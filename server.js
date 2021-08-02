const console = require('console');
const { Socket } = require('dgram');
const express = require('express');
const app = express();
const http = require('http').createServer(app);

const PORT = process.env.PORT || 3000

http.listen(PORT, ()=>{
    console.log("listening on PORT", PORT);
})

app.use(express.static(__dirname+'/public'))

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html')
})

const io  = require('socket.io')(http);

io.on('connection',(Socket)=>{
    console.log('connected.....',Socket.id); // id is always different..
    Socket.on('message', (msg)=>{
        Socket.broadcast.emit('message', msg);
    })
})