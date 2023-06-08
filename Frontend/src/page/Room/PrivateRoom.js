import React, { useState } from "react";
import Chat from "../../components/Room/Chat";
import classes from "./Room.module.css";

const PrivateRoom = () => {
  const [showManu, setShowManu] = useState(false);
  const changeManuStateHandler = () => setShowManu((prevState) => !prevState);

  return (
    <div className={classes["container-div"]}>
      <Chat
        // privateUser={JSON.parse(localStorage.getItem("user"))}
        onMenuClicked={changeManuStateHandler}
      />
    </div>
  );
};

export default PrivateRoom;
