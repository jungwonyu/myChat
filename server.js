let express = require('express');
let app = express();

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

let users = [];
let connections = [];

server.listen(3000);
console.log('server is running');

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
  connections.push(socket);
  console.log('connection : %s sockets connected', socket);

  socket.on('disconnect', () => { // 연결이 끊겼을 때
    console.log(`${socket.userName} disconnected!`);
    if (socket.userName) { // socket에 userName이 있다면
      users.splice(users.indexOf(socket.userName), 1); // 제거
    }
    connections.splice(connections.indexOf(socket), 1);
    updateUsername();
  });

  socket.on('newUser', function (newUser, callback) {
    console.log(newUser);
    users.push(newUser);
    socket.userName = newUser;
    updateUsername();

    if (callback) callback(true);
  });

  socket.on('newMsg', function (msg) {
    console.log(`user=${socket.userName}, msg=${msg}`);
    io.sockets.emit('sentMsg', { userName: socket.userName, msg });
  });

  function updateUsername() {
    io.sockets.emit('allUser', users);
  }
});
