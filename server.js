const { Socket } = require('dgram');
const express = require('express');
const app = express();
const http = require('http').createServer(app);


const PORT = process.env.PORT || 3000

var users = {};

http.listen(PORT, ()=>{
    console.log("listening on PORT", PORT);
})

app.use(express.static(__dirname+'/public'))

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html')
})

const io  = require('socket.io')(http);

io.on('connection',(Socket)=>{
    console.log('connected user_id .....',Socket.id); // id is always different..

    Socket.on('user_joined', (user_name)=>{
        users[Socket.id] = user_name;
        Socket.broadcast.emit('user_connected',user_name);
        io.emit('user_list',users);
    });                                                    // *when User joined the chat*

    Socket.on('message', (msg)=>{
        console.log(msg,"==msgs===");
        Socket.broadcast.emit('message', msg);
        // var socket_id = Socket.id
        // io.to(socket_id).emit('message',msg) // single user msg send
    });                                             //*when some user send the message*

    Socket.on('typing',(name)=>{
        Socket.broadcast.emit('typing',name);
    })

    Socket.on('disconnect', ()=>{
        Socket.broadcast.emit('user_disconnected', user=users[Socket.id]);
        delete users[Socket.id];
        io.emit('user_list',users);

    });                                             //*when an user left the chat*
})