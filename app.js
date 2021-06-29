const GameRoom = require("./model/GameRoom.js")
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

app.get('/host', (req, res) => {
  res.sendFile(path.join(__dirname,"/pages/host.html"));
});

app.get('/join', (req, res) => {
  res.sendFile(path.join(__dirname,"/pages/join.html"));
});

app.use(express.static('public'))

server.listen(5000, () => {
  console.log('listening on *:5000');
});

games=[]

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('start new game', (msg) => {
    console.log(socket.id + " is requesting to host a new game");
    //Setting up the new gameRoom
    gameRoom = new GameRoom(io);
    gameRoom.assignHost(socket.id);
    for (let i=1000; i<=9999; i++){
      if (games[i]==null){
        console.log("Going to use id: " + i);
        gameRoom.setGameId(i)
        games[i]=gameRoom;
        break;
      }
    }
    gameRoom.sendHost("id assigned",gameRoom.gameId)
  });
  socket.on("join game", (msg) =>{
    console.log("Someone is trying to join the game + " + msg)
    if (games[msg]!=null){
      io.to(socket.id).emit("joined game", "You have joined a game")
    }
    else{
      io.to(socket.id).emit("error", "Game Id is not valid")
    }
  })
  socket.on("attemptRegister",(msg)=>{
    console.log(msg.name + " Is trying to register for game " + msg.gameId);
    if (games[msg.gameId] == null){
      io.to(socket.id).emit("error", "Game Id is not valid")
      return
    }
    gameRoom = games[msg.gameId]
    if (msg.name in gameRoom.participants){
      io.to(socket.id).emit("warning", "Name is taken")
      return;
    }
    gameRoom.participants[msg.name] = {
      socket: socket.id,
      name: msg.name,
      score: 0,
      buzz:false,
    }
    io.to(socket.id).emit("registered")
    gameRoom.updatePlayerList();
  })
  socket.on("addScore",(msg)=>{
    console.log(msg)
    games[msg.gameId].participants[msg.name].score+=1;
    games[msg.gameId].updatePlayerList()
  })
  socket.on("subScore",(msg)=>{
    games[msg.gameId].participants[msg.name].score-=1;
    games[msg.gameId].updatePlayerList()
  })
  socket.on("buzz",(msg)=>{
    games[msg.gameId].buzzPlayer(msg.name)
    games[msg.gameId].updatePlayerList()
  })
});