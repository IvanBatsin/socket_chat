const express = require('express');
const app = express();
const path = require('path');
const config = require(__dirname + '/config');
const socketio = require('socket.io');

//Message format module
const messageFormat = require(path.join(__dirname, '/utils/messages.js'));
//Creaet and find user
const {userJoin, getUser, getRoom, userLeave} = require(path.join(__dirname, '/utils/users.js'));

//Socket io prepare
const http = require('http');
const server = http.createServer(app);
const io = socketio(server);

//Set client connect
io.on('connection', socket => {
  socket.on('join', ({username, room}) => {
    const user = userJoin(socket.id, username, room);

    //присоединяет к комнате
    socket.join(user.room);

    //Welcome
    socket.emit('message', messageFormat('CharCordBot', 'Welcome to chat ' + user.username));

    //When user connects
    //отправить всем пользователям, кроме отправителя
    socket.broadcast.to(user.room).emit('message', messageFormat('CharCordBot', `${user.username} has joined the chat`));

    //send users and rooms info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoom(user.room)
    });
  });

  //Listen for chat message
  //after getting message we emit this message to client
  socket.on('chatMessage', data => {
    const user = getUser(socket.id);
    io.to(user.room).emit('message', messageFormat(user.username, data));
  });

  //client disconnect
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    if (user){
      //приходи ко всем пользователям
      io.to(user.room).emit('message', messageFormat('CharCordBot', user.username + ' has left this chat'));
    }

    //send users and rooms info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoom(user.room)
    });
  });
});

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.get('/chat', (req, res) => {
  res.render('chat.ejs');
});

server.listen(config.PORT, () => {
  console.log('we on air');
});