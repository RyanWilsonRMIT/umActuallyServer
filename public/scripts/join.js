console.log("host.js loaded")
var socket = io();
var urlParams = new URLSearchParams(window.location.search);
let displayName = null;
id = urlParams.get('id')
socket.emit("join game",id)
socket.on("joined game", (msg)=>{
    console.log(msg)
    $(".nameForm").show()
})
socket.on("error", (msg)=>{
    window.location.replace("/?error=" + msg)
})
socket.on("warning", (msg)=>{
    $(".warning:visible").html(msg);
})

$(document).on("click", "#teamNameBtn", function(data){
    let tname = $("#teamName").val()
    if (tname!=""){
        socket.emit("attemptRegister",{name:tname, gameId:id})
        displayName=tname;
    }
    else{
        $(".nameForm .warning").html("Please put something in the box")
    }
    
});

socket.on("registered",(msg)=>{
    $(".nameForm").hide()
    $(".buzzerForm").show()

})

$(document).on("click", "#buzzer", function(data){
    $(".warning:visible").html("");
    socket.emit("buzz",{gameId:id,name:displayName});
});
