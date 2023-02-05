const express = require('express');

const http = require('http'); //createServer
const { Server } = require('socket.io');
const cors = require('cors');
const router = require('./route');

const { addUser, findUser, getRoomUsers, removeUser } = require('./users');

const app = express();

app.use(cors({ origin: '*' }));

app.use('/', router);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });

io.on('connection', (socket) => {
  socket.on('join', ({ name, room }) => {
    socket.join(room);

    const { user, isExist } = addUser({ name, room });
    console.log('user', user);
    const userMessage = isExist ? `${user.name} here your go again` : `Hey my love ${user.name}`;

    socket.emit('message', {
      data: { user: { name: 'ADMIN' }, message: userMessage },
    });

    socket.broadcast.to(user.room).emit('message', {
      data: { user: { name: 'ADMIN' }, message: `${name} has joined` },
    });

    io.to(user.room).emit('room', { data: { users: getRoomUsers(user.room) } }); //? user.room --> берем комнату последнего юзера, тк он последний зашёл в room, то от него будет отсчёт.
  });

  socket.on('sendMessage', ({ message, params }) => {
    //? params --> { name, room }
    const user = findUser(params); //? Тут мы проверяем существует ли user, если да то возвращает тот же объект, только из массива users

    //console.log('params:', params); //? params { name: 'qq1', room: 'qq' }
    //console.log('user:', user); //? user { isExist: false, user: { name: 'qq1', room: 'qq' } }
    //console.log('message:', message); //? Сообщение пользователя

    if (user) {
      io.to(user.room).emit('message', { data: { user, message } }); //? (user <==> params) --> { name, room }
    }
  });

  socket.on('leftRoom', ({ params }) => {
    const user = removeUser(params);

    if (user) {
      const { room, name } = user; //? возвращаем user, которого удалили. Тоже самое, на подобии того, что я делал сверху

      io.to(room).emit('message', {
        data: { user: { name: 'ADMIN' }, message: `${name} has left` },
      }); //? (user <==> params) --> { name, room }

      io.to(room).emit('room', { data: { users: getRoomUsers(room) } });
    }
  });

  io.on('disconnect', () => {
    console.log(`Disconnect`);
  });
});

server.listen(5000, () => {
  console.log(`Server is start`);
});
