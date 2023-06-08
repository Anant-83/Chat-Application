const io = require("./server/server");
const {
  addUser,
  getUser,
  removeUser,
  getUsersInRoom,
  availableRooms,
} = require("./utils/user");
const { genratemessage } = require("./utils/message");
const { savemessage, findmessageforuser} = require("./message_storage");
const { useScrollTrigger } = require("@mui/material");
const ADMIN_ID = "I_AM_ADMIN";
const mp = new Map();
io.on("connection", (socket) => {

  socket.on('give', () => {
    console.log("Hii give");
    console.log(mp);
    socket.emit({mp});
  })
  // When someone join the room
  socket.on("join", (data, callback) => {
    const { error, user } = addUser({
      id: socket.id,
      ...data,
    });
    availableRooms();

    if (error) {
      return callback(error);
    }
    // Creates vertual connection between users in the same room
    socket.join(user.room);

    // This will send massage to currunt user
    socket.emit(
      "recive_message",
      genratemessage({
        name: "Admin",
        message: `Welcome, ${user.name}.`,
        id: ADMIN_ID,
      })
    );

    // This will send massage to all users expect currunt user
    socket.broadcast.to(user.room).emit(
      "recive_message",
      genratemessage({
        name: "Admin",
        message: `${user.name} has joined.`,
        id: ADMIN_ID,
      })
    );

    io.to(user.room).emit("room", {
      room: user.room,
      usersInRoom: getUsersInRoom(user.room),
    });
    // to notify client
    callback();
  });

  // Message sent
  socket.on("send_message", (message, callback) => {
    const user = getUser(socket.id);

    //this will send massage to all users in a room
    io.to(user.room).emit(
      "recive_message",
      genratemessage({ name: user.name, message, id: user.id })
    );
    callback();
  });
  socket.on("send_private_message", (message, callback) => {
    const user = getUser(socket.id);
    console.log(user.privateRoom);
    console.log(message);
    //this will send massage to all users in a room
    io.to(user.privateRoom).emit(
      "recive_message",
      genratemessage({
        name: user.name,
        message,
        id: user.id,
        privateRoom: user.privateRoom,
      })
    );
    callback();
  });

  socket.on("private_room", (data, callback) => {
    const roomName = data.roomName;
    let user = getUser(data.me.id);
    const users = getUsersInRoom(user.room);
    users.map((user) => {
      if (user.id === data.me.id || data.user.id) {
        user.privateRoom = roomName;
      }
    });
    io.sockets.sockets.get(data.me.id).join(roomName);
    io.sockets.sockets.get(data.user.id).join(roomName);
    io.to(roomName).emit(
      "recive_private_message",
      genratemessage({
        name: data.me.name,
        message: `hii i am ${data.me.name}.`,
        id: data.me.id,
      })
    );
    callback();
  });

  socket.on("private_msg" , async ({message,pvt}, callback) => {
    const user = getUser(socket.id);
    // console.log(user.privateRoom);
    // console.log(message);
    // console.log(user);
    // console.log(pvt);
    const to_id = pvt.id;
    await socket.to(pvt.id).emit("private_msg",genratemessage({ name: user.name, message, id: user.id }))
    const obj = {
      from : user.id,
      to : pvt.id,
      message : message
    }
    if(!mp.has(user.id))
    mp.set(user.id,[]);
    if(!mp.has(pvt.id))
    mp.set(pvt.id,[]);

    await mp.get(user.id).push(obj);
    await mp.get(pvt.id).push(obj);
    await callback();
  });

  
  socket.on("send_Files", (files, callback) => {
    const user = getUser(socket.id);
    const fileDetails = [];
    files.forEach((file) => {
      const filedata = {
        file: Buffer.from(file.file).toString("base64"),
        type: file.type,
        name: file.name,
        width: file.width,
        height: file.height,
      };
      fileDetails.push(filedata);
    });
    io.to(user.room).emit(
      "recive_message",
      genratemessage({ name: user.name, files: fileDetails, id: user.id })
    );
    callback();
  });

  // Leave room or refreash the page
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "recive_message",
        genratemessage({
          name: "Admin",
          message: `${user.name} has left.`,
          id: ADMIN_ID,
        })
      );
      io.to(user.room).emit("room", {
        room: user.room,
        usersInRoom: getUsersInRoom(user.room),
      });
    }
  });
});