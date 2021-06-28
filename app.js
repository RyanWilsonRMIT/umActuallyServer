const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,"/pages/index.html"));
});

app.use(express.static('public'))

server.listen(4000, () => {
  console.log('listening on *:4000');
});

io.sockets.on('connection', function(socket) {
    console.log("url"+socket.handshake.url);
    clientId=socket.handshake.query.clientId;
    console.log("connected clientId:"+clientId);

});