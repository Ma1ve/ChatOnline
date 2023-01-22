const express = require('express');

const http = require('http'); //createServer
const { Server } = require('socket.io');
const cors = require('cors');
const router = require('./route');
// const { addUser, findUser } = require('./users');

const app = express();

app.use(cors({ origin: '*' }));

app.use('/', router);

app.listen(5000, () => {
  console.log(`Server is start`);
});
