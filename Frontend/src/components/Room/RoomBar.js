import React, { Fragment, useCallback, useState } from "react";
import ReactDOM from "react-dom";
import { Typography, useMediaQuery, IconButton, Menu, MenuItem } from "@mui/material";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import classes from "./RoomBar.module.css";
import { useDispatch, useSelector } from "react-redux";
import moment, { min } from "moment";
import { userActions } from "../../store/user-slice";
import ReactPlayer from "react-player";
import { useEffect } from "react";
import axios from "axios";
import Button from '@mui/material/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.css';
const RoomBar = (props) => {

  const [bc,setBc] = useState(new Set());
  const [list, setList] = useState([]);
  const mp = props.senderids;
  const matches = useMediaQuery("(max-width:768px)");
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);
  console.log(users);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [privateUsers, setPrivateUsers] = useState([]);
  const userId = useSelector((state) => state.user.userId);
  const [mystream, setMyStream] = useState();
  const [person, setPerson] = useState(new Map());
  const [bst,setBst] = useState(new Set());
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  const [showDropdown, setShowDropdown] = useState(false);

  const [blocked,setBlocked] = useState(new Map());


  function blocking(){
    toast.success('User Blocked successfully!!!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      });
  }
  function unBlocking(){
    toast.success('User Unblocked successfully!!!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      });
  }

  function you_are_blocked(user){
    toast.error(`Oops!!! ${user.name} has blocked you, you can't send message to ${user.name} anymore!!`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      });
  }

  function blockUser(blockid) {
    setBc((prevBc) => {
      const updatedBc = new Set(prevBc); 
      updatedBc.add(blockid); 
      return updatedBc;
    });
      axios
      .post("http://localhost:8000/blockUser", { userId,blockid }) 
      .then((res) => {
      })
      .catch((err) => {
        console.log(err);
      });

      blocking();
  }
  
  function unBlockUser(blockid) {
    setBc((prevBc) => {
      const updatedBc = new Set(prevBc); 
      updatedBc.delete(blockid); 
      return updatedBc;
    });
      axios
      .post("http://localhost:8000/unblockUser", {userId, blockid }) 
      .then((res) => {
      })
      .catch((err) => {
        console.log(err);
      });

      unBlocking();
  }
  
  const handleClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleClose = (event) => {
    if (!event.target.matches('.dropbtn')) {
      setShowDropdown(false);
    }
  };
  const handleToggle = () => {
    setMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const updatedBlocked = new Map();
    for (const key in bc) {
      const blockedUsers = bc[key];
      for (const blockid of blockedUsers) {
        updatedBlocked.set(blockid, true);
      }
    }
    setBlocked(updatedBlocked);
  }, [bc]);
  const addUserToPrivateRoomHandler = async (user) => {
   
    setSelectedUserId(user.id);
    const reqid = user.id;
    let arr;
    let can = true;
    try {
      await axios
      .post("http://localhost:8000/getBlock", {reqid }) 
      .then((res) => {
        arr = res.data;
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

      
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === userId) {
          can = false;
          break;
        }
      }
  
    } catch (error) {
      console.log(error);
    }
    
    if (!can) {
      setSelectedUserId(userId);
      console.log("blocked man");
      you_are_blocked(user);
      props.onBacktogroup(userId);
      return;
    }
    const st = mp.get(user.id);
    
    if (mp.has(userId)) {
      const st = mp.get(userId);
      if (st.has(user.id)) {
        st.delete(user.id);
        const toremove = user.id;
        props.onRemove({ userId, toremove });
      }
    }
    if (user.id == userId) {
      props.onBacktogroup(user);
      return;
    }

    const mpp = new Map(person);
    mpp.set(userId, user.id);
    setPerson(mpp);
    let ra, rb;
    if (userId < user.id) {
      ra = userId;
      rb = user.id;
    } else {
      ra = user.id;
      rb = userId;
    }
    ra += rb;
    const roomName = ra;
    console.log("Name of rooom -> " + roomName);
    console.log(user);
    props.onJoinToPrivateRoom({ ...user, privateRoom: roomName });
  };

  function getList(userId) {
    axios
      .post("http://localhost:8000/Get_List", { userId }) 
      .then((res) => {
        const newList = res.data;
        if (person.has(userId)) {
          const req = person.get(userId);
          let has = false;
          for (let i = 0; i < newList.length; i++) {
            if (newList[i].id == req) {
              has = true;
              break;
            }
          }
          if (!has) {
            props.onBacktogroup(userId);
          }
        }
        setList(newList);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function check(usid) {
    if (!mp.has(userId)) return false;

    const st = mp.get(userId);
    if (st.has(usid)) return true;

    return false;
  }
  function getnew(s) {
    let s1 = "👋 ";
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

  useEffect(() => {
      getList(userId);
  }, [users]);

  
  const buttonStyle = {
    fontSize: "25px",
    backgroundColor: "transparent",
    color: "#333333",
    border: "none",
    cursor: "pointer",
    position: "relative",
  };
  const plusIconStyle = {
    fontSize: "24px",
    color: "#333333",
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
        {list &&
          [...list] // Create a new array to avoid modifying the read-only array
            .sort((a, b) => {
              if (a.id === userId) return -1;
              if (b.id === userId) return 1;
              return a.name.localeCompare(b.name);
            })
            .map((user) => (
              <div key={user.id} style={{ display: "flex", alignItems: "center" }}>
                {
                  user.id == userId ? 
                  (<div/>) 
                  :
                (
              bc.has(user.id) ? (
                <button
                title="Click me to perform an action"
                  onClick={() => unBlockUser(user.id)}
                  style={{
                    backgroundColor: "#dcdcdc",
                    color: "black",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    border: "none",
                    marginRight: "0.5rem",
                    transition: "background-color 0.3s",
                  }}
                >
                  🚫
                </button>
              ) : ( 
                <button
                title="Click me to perform an action"
                  onClick={() => blockUser(user.id)}
                  style={{
                    backgroundColor: "#4b4b4b",
                    color: "white",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    border: "none",
                    marginRight: "0.5rem",
                    transition: "background-color 0.3s",
                  }}
                >
                  🔓
                </button>
              )
            )
          }
                <h4
                  style={{
                    color: user.id === selectedUserId ? "green" : "white",
                    marginRight: "1rem",
                    fontSize : "18px",
                  }}
                >
                  {user.id === userId
                    ? "Group Chat"
                    : check(user.id) ? getnew(user.name) : user.name}
                </h4>
            <Button title="Chat with User" variant="text" style={{fontSize: "25px"}} onClick={() => addUserToPrivateRoomHandler(user)}>+</Button>
            <ToastContainer 
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            />
              </div> 
            ))}
      </div>
    </div>
  );
};

export default RoomBar;
