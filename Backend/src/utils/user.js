const users = new Map();
const usersInRoom = new Map();

const addUser = (userData) => {
  const name = userData.name.trim().toLowerCase();

  if (!name) {
    return {
      error: "name is required",
    };
  }
  const date = new Date().getTime();
  const room = (userData.roomName || userData.interest).trim().toLowerCase();

  const user = {
    id: userData.id,
    name,
    room,
    checkedInAt: date,
  };
  users.set(userData.id, user);
  usersInRoom.set(room, (usersInRoom.get(room) || 0) + 1);
  return { user };
};

const removeUser = (id) => {
  const user = users.get(id);
  if (user) {
    const existingUsers = usersInRoom.get(user.room);
    if (existingUsers == 1) {
      usersInRoom.delete(user.room);
    } else {
      usersInRoom.set(user.room, existingUsers - 1);
    }
    users.delete(id);
  }
  return user;
};

const getUser = (id) => {
  return users.get(id);
};

const getUsersInRoom = (room) => {
  room = room.trim().toLowerCase();
  const usersOfRoom = [];
  users.forEach((user) => {
    if (user.room === room) usersOfRoom.push(user);
  });
  return usersOfRoom;
};
const availableRooms = () => {
  const rooms = [];
  usersInRoom.forEach((value, key) => {
    rooms.push(key);
  });
  return rooms;
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  availableRooms,
};
