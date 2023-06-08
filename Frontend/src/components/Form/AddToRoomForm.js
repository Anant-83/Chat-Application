import React, {
  useState,
  useRef,
  useReducer,
  useEffect,
  Suspense,
} from "react";
import {
  Button,
  TextField,
  Autocomplete,
  Typography,
  useMediaQuery,
} from "@mui/material";
import classes from "./AddToRoomForm.module.css";
import { Container } from "@mui/system";
import {
  Await,
  Form,
  redirect,
  useActionData,
  useLoaderData,
} from "react-router-dom";
import store from "../../store/index";
import { userActions } from "../../store/user-slice";
import { nameReducer, roomReducer } from "../../reducers/inputReducer";
import { createInterest, fetchInterests } from "../../lib/api";
import Notification from "../Ui/Notification";

const ROOMS = [{ label: "cricket" }, { label: "music" }, { label: "art" }];

const AddToRoomForm = () => {
  const [page, setPage] = useState("join");
  const nameInputRef = useRef();
  const roomInputRef = useRef();
  const [formIsValid, setFormIsValid] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const matches = useMediaQuery("(max-width:600px)");

  const [nameState, dispatchName] = useReducer(nameReducer, {
    value: "",
    isValid: null,
  });
  const [roomState, dispatchRoom] = useReducer(roomReducer, {
    value: "",
    isValid: null,
  });
  const { isValid: nameIsValid } = nameState;
  const { isValid: roomIsValid } = roomState;
  useEffect(() => {
    const identifier = setTimeout(() => {
      setFormIsValid(nameIsValid && roomIsValid);
    }, 500);

    return () => clearTimeout(identifier);
  }, [nameIsValid, roomIsValid]);
  const nameChangeHandler = (event) => {
    dispatchName({ type: "USER_INPUT", val: event.target.value });
  };
  const validateNameHandler = () => {
    dispatchName({ type: "INPUT_BLUR" });
  };
  const roomChangeHandler = (event, value = null) => {
    dispatchRoom({
      type: "USER_INPUT",
      val: event ? event.target.value : value,
    });
  };
  const validateRoomHandler = () => {
    dispatchRoom({ type: "INPUT_BLUR" });
  };

  const validateFormHandler = (event) => {
    event.preventDefault();
    if (!nameIsValid) {
      document.getElementById("name").focus();
    } else {
      document.getElementById("room").focus();
    }
  };
  const changePageHandler = () => {
    page === "join" ? setPage("create") : setPage("join");
  };
  const loaderData = useLoaderData();
  const actionData = useActionData();
  useEffect(() => {
    if (actionData && actionData.response.status === 502) {
      document.getElementById("room").focus();
      setShowNotification(true);
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [actionData]);
  return (
    <Container maxWidth="sm">
      {showNotification && (
        <Notification
          status="invalid"
          message={actionData.response.data.message}
        />
      )}
      <Form className={classes["action-div"]} method="POST" action="/dashbord">
        <div className={classes["input-div"]}>
          <TextField
            ref={nameInputRef}
            id="name"
            variant="outlined"
            label="name"
            error={nameIsValid === false}
            sx={{ flex: 3 }}
            name="userName"
            onChange={nameChangeHandler}
            onBlur={validateNameHandler}
            value={nameState.value}
            autoComplete="off"
            size={!matches ? "medium" : "small"}
          />
          <Suspense
            fallback={
              <Typography variant="h4">Fetching Interests..</Typography>
            }
          >
            <Await resolve={loaderData}>
              {(interest) =>
                page === "join" ? (
                  <Autocomplete
                    disablePortal
                    id="room"
                    options={interest}
                    sx={{ flex: 2 }}
                    size={!matches ? "medium" : "small"}
                    onChange={(data) =>
                      roomChangeHandler(null, data.target.childNodes[0].data)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        ref={roomInputRef}
                        name="interest"
                        label="Room"
                        error={roomIsValid === false}
                        onChange={roomChangeHandler}
                        onBlur={validateRoomHandler}
                        value={roomState.value}
                      />
                    )}
                  />
                ) : (
                  <TextField
                    ref={roomInputRef}
                    name="roomName"
                    id="room"
                    variant="outlined"
                    label="Room"
                    error={roomIsValid === false}
                    onChange={roomChangeHandler}
                    onBlur={validateRoomHandler}
                    sx={{ flex: 3 }}
                    value={roomState.value}
                    autoComplete="off"
                    size={!matches ? "medium" : "small"}
                  />
                )
              }
            </Await>
          </Suspense>
        </div>
        <Button
          variant="contained"
          type="submit"
          sx={{
            backgroundColor: "black",
            padding: !matches ? "0.8rem" : "0.5rem",
            transition: "all 300ms",
            "&:hover": {
              backgroundColor: "black",
            },
          }}
          onClick={!formIsValid ? validateFormHandler : () => {}}
        >
          {page === "join" ? "Join" : "Create"}
        </Button>
        <span onClick={changePageHandler} className={classes.link}>
          {page === "join" ? "Create" : "Join"} Room
        </span>
      </Form>
    </Container>
  );
};

export async function loader() {
  let res;
  try {
    res = await fetchInterests();
  } catch (err) {
    throw err;
  }
  return res;
}

export async function action({ request }) {
  const formData = await request.formData();
  const fieldName = formData.get("roomName") ? "roomName" : "interest";
  const userData = {
    name: formData.get("userName"),
    [fieldName]: formData.get(fieldName),
  };
  if (fieldName === "roomName") {
    try {
      await createInterest(formData.get(fieldName));
    } catch (err) {
      if (err.response && err.response.status === 502) {
        return err;
      }
      throw err;
    }
  }
  store.dispatch(userActions.setUserDetails(userData));
  return redirect("/chat");
}
export default AddToRoomForm;
