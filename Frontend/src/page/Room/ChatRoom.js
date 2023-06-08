import React, { useEffect, useState } from "react";
import Chat from "../../components/Room/Chat";
import RoomBar from "../../components/Room/RoomBar";
import classes from "./Room.module.css";
import { useSelector } from "react-redux";
import axios from "axios";
const ChatRoom = () => { 
  const userDetails = useSelector((state) => state.user.userDetails);
  const users = useSelector((state) => state.user.users);
  const [showManu, setShowManu] = useState(false);
  const [user, setUser] = useState(null); 
  const [isPrivate, setIsPrivate] = useState(false);
  const [curruntRoom, setCurruntRoom] = useState(" ");
  const changeManuStateHandler = () => setShowManu((prevState) => !prevState);
  const [notid,setNotId] = useState(" ");
  const [newMsg,setNewMsg] = useState(new Map());
  const privateRoomHandler = (userData) => {
    console.log(userData);
    setUser(userData);
    setIsPrivate(true);
    console.log("Private room to => ")
    console.log(userData.privateRoom);
    setCurruntRoom(userData.privateRoom);
  };
  const openRoomHandler = (data) => {
    if (data.id === "GROUPID") {
      return setIsPrivate(false);
    }
    setIsPrivate(true);
    setCurruntRoom(data.privateRoom);
    console.log("room changed ", data.privateRoom);
  };
  const update = ({userId,toremove}) => {
    const st = newMsg.get(userId);
    st.delete(toremove);
    const nmp = new Map(newMsg);
    nmp.set(userId,st);
    setNewMsg(nmp);
  }
  const togroup = (data) => {
    setIsPrivate(false);
    console.log("/////->" + data.roomName);
    setCurruntRoom(data.room);
  } 
  const notify = ({userId,senderid}) => {
    if(user)
    {
      console.log(senderid);
      console.log(user.id);
      if(senderid == user.id)
      return;
    }
    const mp = new Map(newMsg);
    const newst = new Set();
    if(!mp.has(userId))
    mp.set(userId,newst);

    const st = mp.get(userId);
    st.add(senderid);
    mp.set(userId,st);
    console.log(mp);
    setNewMsg(mp);
  }
  return (
    <div className={classes["container-div"]}>
      <RoomBar
        isOpen={showManu}
        onClick={changeManuStateHandler}
        onJoinToPrivateRoom={privateRoomHandler}
        onChangeRoom={openRoomHandler}
        onBacktogroup={togroup}
        senderids = {newMsg}
        onRemove = {update}
      />
      <Chat
        privateUser={user}
        onMenuClicked={changeManuStateHandler}
        isPrivate={isPrivate}
        currentRoom={curruntRoom}
        onNewMessage = {notify}
      />
    </div>
  );
};

export default ChatRoom;
