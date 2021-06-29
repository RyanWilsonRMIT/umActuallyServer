console.log("host.js loaded")
var socket = io();
gameId = null
socket.on("id assigned", (msg) =>{
    $("#gameCode").html(msg)
    console.log("id recieved")
    gameId = msg
    console.log(msg)
})
socket.on("player list", (msg) =>{
    console.log("player list recieved")
    let players = msg;
    $("#players").html("")
    for (let name in players){
        console.log("Player is " + name);
        console.log(players[name])
        nameEl = "<td>" + name + "</td>"
        scoreEl = "<td>" + players[name].score + "</td>"
        addScoreBtn = "<td><button id='" + name + "' class='addBtn'>+</button></td>"
        subScoreBtn = "<td><button id='" + name + "' class='subBtn'>-</button></td>"
        openTag = "<div class='player'>"
        if (players[name].buzz){
            openTag = "<div class='player selected'>"
        }
        $("#players").append(
            openTag + nameEl + scoreEl + addScoreBtn + subScoreBtn + "</div>"
        )
    }
})
//Request to start a new game
socket.emit("start new game");


$(document).on("click", ".addBtn", function(data){
    console.log("addBtn clicked")
    console.log(data)
    socket.emit("addScore",{gameId, name: data.target.id});
});
$(document).on("click", ".subBtn", function(data){
    socket.emit("subScore",{gameId, name: data.target.id});
});

