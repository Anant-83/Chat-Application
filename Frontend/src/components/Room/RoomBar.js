import React, { Fragment, useState } from "react";
import ReactDOM from "react-dom";
import { Typography, useMediaQuery } from "@mui/material";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import classes from "./RoomBar.module.css"; 
import { useDispatch, useSelector } from "react-redux";
import moment, { min } from "moment";
import { userActions } from "../../store/user-slice";

const RoomBar = (props) => {
  const mp = props.senderids;
  const matches = useMediaQuery("(max-width:768px)");
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);
  console.log(users);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [privateUsers, setPrivateUsers] = useState([]);
  const userId = useSelector((state) => state.user.userId);
  const addUserToPrivateRoomHandler = (user) => {
    setSelectedUserId(user.id);
    if(mp.has(userId))
    {
      const st = mp.get(userId);
      if(st.has(user.id))
      {
        st.delete(user.id);
        const toremove = user.id;
        props.onRemove({userId,toremove});
      }
    }
    if(user.id == userId)
    {
      props.onBacktogroup(user);
      return;
    }
    let ra,rb;
    if(userId < user.id)
    {
      ra = userId;
      rb = user.id;
    }
    else
    {
      ra = user.id;
      rb = userId;
    }
    ra += rb;
    const roomName = ra;
    console.log("Name of rooom -> " + roomName);
    console.log(user);
    props.onJoinToPrivateRoom({ ...user, privateRoom: roomName });
   
  };

  function check(usid)
  {
    if(!mp.has(userId))
    return false;

    const st = mp.get(userId);
    if(st.has(usid))
    return true;

    return false;
  }
  function getnew(s)
  {
    let s1 = "👋 " 
    let ok = s1.concat(s);
    return ok;
  }
  const changeRoomHandler = (data) => {
    console.log(data);
    if (data.id === "GROUPID") {
      return props.onChangeRoom(data);
    }
    const isPrivate = checkPrivateUserHandler(data.id);
    if (isPrivate) {
      return props.onChangeRoom(data);
    }
  };
  const checkPrivateUserHandler = (id) => {
    const data = privateUsers.findIndex((user) => user.id === id);
    if (data == -1) return false;
    return true;
  };
  return (
    <div
      className={`${classes["roombar-div"]} ${
        matches &&
        (props.isOpen
          ? classes["open_roombar-slider"]
          : classes["close_roombar-slider"])
      }`}
    >
      {props.isOpen &&
        ReactDOM.createPortal(
          <div className={classes["backdrop-div"]} onClick={props.onClick} />,
          document.getElementById("backdrop-root")
        )}
      <div className={classes["header-div"]}>
        <Typography
          color="whitesmoke"
          variant={!matches ? "h4" : "h5"}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            textTransform: "uppercase",
            letterSpacing: "1px",
            fontWeight: "bold",
          }}
        >
          <GroupsOutlinedIcon sx={{ fontSize: !matches ? "2.5rem" : "2rem" }} />
          {users.room}
        </Typography>

        <a href="/dashbord">
          <ExitToAppRoundedIcon
            color="white"
            sx={{
              fontSize: !matches ? "1.8rem" : "1.5rem",
              color: "gray",
              cursor: "pointer",
              padding: "0.5rem",
              borderRadius: "4px",
              transition: "all 100ms",
              "&:hover": {
                backgroundColor: "#33393d",
                color: "whitesmoke",
              },
            }}
          />
        </a>
      </div>
      <div className={classes["user-div"]}>
  {users.usersInRoom &&
    [...users.usersInRoom] // Create a new array to avoid modifying the read-only array
      .sort((a, b) => {
        if (a.id === userId) return -1; // Place the current user (Group Chat) on top
        if (b.id === userId) return 1;
        return a.name.localeCompare(b.name); // Sort the rest of the users alphabetically
      })
      .map((user) => (
        <div key={user.id} style={{ display: "flex", alignItems: "center" }}>
          <h4
            style={{
              color: user.id === selectedUserId ? "green" : "white",
              marginRight: "1rem",
            }}
          >
            {user.id === userId
              ? "Group Chat"
              : check(user.id) ? getnew(user.name) : user.name}
          </h4>
          <button onClick={() => addUserToPrivateRoomHandler(user)}>+</button>
        </div>
      ))}
</div>
    </div>
  );
};

export default RoomBar;
