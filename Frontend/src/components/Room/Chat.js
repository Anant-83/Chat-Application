import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import soketIo from "socket.io-client";
import Input from "../Input/Input";
import Display from "./Display";
import classes from "./Chat.module.css";
import { userActions } from "../../store/user-slice";
import Header from "./Header";
import { messageActions } from "../../store/message-slice";
import { NotificationManager } from 'react-notifications';
import axios from "axios"; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.css';
const ENDPOINT = "http://localhost:8000";

let socket;
 
const Chat = (props) => {
  const { privateUser, isPrivate, currentRoom } = props;
  const [cr,setCr] = useState({});
  const messages = useSelector((state) => state.message.messages);
  const privateMessages = useSelector((state) => state.message.privateMessages);
  const [userId, setUserId] = useState(null);
  const dispatch = useDispatch(); 
  const [pvtmsgs,setPvtMsgs] = useState([]);
  const [grpmsgs,setGrpMsgs] = useState([]);
  const roomUsers = useSelector((state) => state.user.users);
  const userDetails = useSelector((state) => state.user.userDetails);
  const users = useSelector((state) => state.user.users);
  const sendMessageHandler = (message) => {
    socket.emit("send_message", message, (error) => {
      if (error) {
        throw error;
      }
    });
  };
  const noti = (usid) =>{
    console.log("I'm in bitch");
    toast(`💬 New Message from ${usid}`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      });
      
  }

  const sendPrivateMessageHandler = (message) => {
    const pvt = cr;
    console.log("For sending Pvt.... -> ");
    console.log(pvt);
    socket.emit("private_msg", {message,pvt}, (error) => {
      if (error) {
        throw error;
      }  
    }); 
    const room = users.room;
    getmsg();
    // getprivatemessages({userId,currentRoom});
    // socket.emit("private_msg" ,  {
    //   content : message,
    //   to : props.privateUser
    // })
  };
  const sendFilesHandler = (files) => {
    const fileDetails = [];
    for (const file in files) {
      if (file === "length") break;
      const data = {
        file: files[file],
        type: files[file].type,
        name: files[file].name,
        width: files[file].width,
        height: files[file].height,
      };
      fileDetails.push(data);
    }
    socket.emit("send_Files", fileDetails, (error) => {
      if (error) {
        throw error;
      }
    });
  };

  // useEffect(() => {
  //   if(isPrivate)
  //   {
  //     console.log("Here buddy");
  //     console.log(userId);
  //     axios.get('http://localhost:8000/msgs', { params: { id: userId } })
  //     .then(response => console.log(response))
  //     .catch(error => console.log(error));
  //   }
  // }, [isPrivate]);
  useEffect(() => {
    socket = soketIo(ENDPOINT, { transports: ["websocket"] });
    getgrpmsg();
    socket.on("connect", () => {
      setUserId(socket.id);
      dispatch(userActions.setUserId(socket.id));
    }); 
    socket.emit("join", userDetails, (error) => {
      if (error) {
        throw error;
      }
    });
    getgrpmsg();

   
  }, [userDetails]);

  useEffect(() => {
    if (privateUser && isPrivate) {
      const user2 = privateUser.id;
      const user1 = userId;
      var has = false;
      setCr(privateUser);
      const curroom = currentRoom;
      let rm;
      axios
      .post("http://localhost:8000/Findroom", { user1,user2,curroom})  // Pass userId in the request body
      .then((res) => {
        rm = res.data;
        console.log("--->> " + rm);
        if(rm != "Not found")
        {
          has = true;
        }
        // console.log(res.data[0].message);
      })
      .catch((err) => {
        console.log(err);
      });

      getmsg();
      if(has)
      {
        const nobj = {
          id : privateUser.id,
          name : privateUser.name,
          room : privateUser.room,
          checkedInAt : privateUser.checkedInAt,
          privateRoom : rm         
        }
        setCr(nobj);
      }
      socket.emit(
        "private_room",
        {
          me: { ...userDetails, id: userId },
          user: privateUser,
          roomName: has ? rm : currentRoom,
        },
        (error) => {
          if (error) {
            throw error;
          }
        }
      );
    }
  }, [privateUser, isPrivate]);

  useEffect(() => {
    if(isPrivate)
    getmsg(userId);
  },[isPrivate]);

  function getmsg() {
    const romm = currentRoom;
    console.log(romm);
    axios
      .post("http://localhost:8000/Msg", { romm })  // Pass userId in the request body
      .then((res) => {
        // console.log(res.data[0].message);
        setPvtMsgs(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function getgrpmsg() {
    const roomname = users.room;
    axios
      .post("http://localhost:8000/GroupMsg", { roomname })  // Pass userId in the request body
      .then((res) => {
        console.log(res.data);
        // console.log(res.data[0].message);
        setGrpMsgs(res.data);
      })
      .catch((err) => {
        console.log(err);
      }); 
    // if(currentRoom != users.room)
    // props.onNewMessage({userId,userId});
  }
  // useEffect(() => {
  //   console.log(isPrivate)
  //   if (isPrivate && userId) {
  //     getprivatemessages();
  //   }
  // }, [isPrivate,userId]);

  useEffect(  () => {
    console.log(pvtmsgs);
  },[pvtmsgs]);
  // useEffect(() => {
  //   console.log("Here boy")
  //   if (isPrivate && userId) {
  //     console.log("Hoping");
  //   socket.on("give" , (data) => {
  //     console.log("avse bhai");
  //     console.log(data);
  //   })
  // }
  // },[isPrivate,userId])

  useEffect( () => {
    socket.on("rcv_pvt" , (data) => {
      console.log("this is private!!!!");
      console.log(data);
      const user = {
        name: data.name,
        message: data.message,
        files: data.files,
        createdAt: data.createdAt,
        id: data.id,
      };
      if(data.name)
      noti(data.name);
      getmsg();
      const senderid = data.id;
      props.onNewMessage({userId,senderid});
      // setPvtMsgs((list) => [...list, user]);
      // const pvt_user = {
      //   name : data.name,
      //   message : data.message,
      //   files : data.files,
      //   createdAt : data.createdAt,
      //   id : data.id
      // };
    });

    return () => {
      socket.off("rcv_pvt");
    };
  })
  useEffect(() => {
    socket.on("recive_message", (data) => {
      const user = {
        name: data.name,
        message: data.message,
        files: data.files,
        createdAt: data.createdAt,
        id: data.id,
      };
      getgrpmsg()
      console.log("user ", user, isPrivate);
      !isPrivate
        ? getgrpmsg()
        : getmsg(userId);
    });
    socket.on("room", (data) => {
      if (roomUsers.length === 0) {
        dispatch(userActions.setUsersInRoom(data));
      } else {
        dispatch(
          userActions.setUsersInRoom({
            room: data.room,
            usersInRoom: [
              ...roomUsers.usersInRoom,
              data.usersInRoom[data.usersInRoom.length - 1],
            ],
          })
        );
      }
      // dispatch(userActions.setUsersInRoom(data));
    });
    return () => socket.off();
  }, [messages, privateMessages, isPrivate, currentRoom, roomUsers]);
  
 
  return (
    <div className={classes["chat-div"]}>
      <Header onClick={props.onMenuClicked} />
      <Display
        messages={!isPrivate ? (grpmsgs || []) : (pvtmsgs || [])}
        id={userId}
      />
      <Input
        onMessage={!isPrivate ? sendMessageHandler : sendPrivateMessageHandler}
        onSendFiles={sendFilesHandler}
      />
      <ToastContainer
       position="top-right"
       autoClose={2000}
       hideProgressBar={false}
       newestOnTop
       closeOnClick
       rtl={false}
       pauseOnFocusLoss={false}
       draggable
       pauseOnHover
       theme="dark"
       />
    </div>
  );
};

export default Chat; 