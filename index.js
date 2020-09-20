const express = require('express');
const socketio = require('socket.io');
const http = require('http');

// 引入针对用户的增删改查等业务代码方法
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users')

const PORT = process.env.PORT || 5000;


const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connect', (socket) => {
  console.log('we have a new connection')

  // 当用户进入房间(输入name、room)，后端监听到join事件后，将信息存储，同时利用callback执行前端动作
  socket.on('join', ({ name, room }, callback) => {

    // 依据socket.id 添加用户信息
    const { error, user } = addUser({ id: socket.id, name, room });

    if(error) return callback(error);
    

    // 每个人都知道 后面的信息。socket套接字触发message事件供前端渲染
    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}`});

    // 除了该用户 user.room 不知道以外，别的用户都知道后面的信息。socket套接字触发message给除自己外的房间渲染。
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined!`});
    
    // 套接字进入用户输入的房间
    socket.join(user.room)

    callback(); // 没有报错时通知front-end
  });

  // 监听sendMessage事件，通过socket.id获取用户信息。服务器触发message事件给前端
  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);
    console.log(user, 'user')

    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  })

  socket.on('disconnect', () => {
    console.log('user had left!!!')
  })
})



app.use(router);

server.listen(PORT, () => console.log(`server has started on port ${PORT}`));