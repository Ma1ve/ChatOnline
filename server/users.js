const { trimStr } = require('./utils');

let users = [];

const findUser = (user) => {
  //? ({ name, room })
  const userName = trimStr(user.name);
  const userRoom = trimStr(user.room);

  return users.find((u) => trimStr(u.name) === userName && trimStr(u.room) === userRoom); //? Undefined || Object
};

const addUser = (user) => {
  console.log(user);
  const isExist = findUser(user);

  !isExist && users.push(user);

  const currentUser = isExist || user;

  return { isExist: !!isExist, user: currentUser };
};

const getRoomUsers = (room) => users.filter((u) => u.room === room);

const removeUser = (user) => {
  const found = findUser(user);

  if (found) {
    users = users.filter(({ name, room }) => room === found.room && name !== found.name);
  }

  return found;
};

module.exports = { addUser, findUser, getRoomUsers, removeUser };
