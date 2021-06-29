class GameRoom{
    constructor(io){
        this.io = io;
        this.host=null;
        this.participants={};
        this.gameId = null;
        this.lastBuzz = Date.now()
        this.timeOut = 5
    }
    setGameId(gameId){
        this.gameId=gameId;
    }
    assignHost(host){
        this.host=host;
    }
    addParticipant(participant){
        this.participants.push(participant);
    }
    sendHost(protocol, msg){
        console.log("Sending message to host")
        this.io.to(this.host).emit(protocol,msg)
    }
    updatePlayerList(){
        this.sendHost("player list", this.participants)
    }
    buzzPlayer(name){
        if (Date.now()-this.lastBuzz<this.timeOut*1000){
            let timeTaken = Date.now()-this.lastBuzz
            console.log(timeTaken)
            let timeRemaining = (this.timeOut*1000) - timeTaken
            let warningMsg = "Cannot buzz in yet, time remaining: " + timeRemaining/1000 + "s"
            this.io.to(this.participants[name].socket).emit("warning", warningMsg )
            return;
        }
        for (let name in this.participants){
            this.participants[name].buzz=false
        }
        this.participants[name].buzz=true
        this.lastBuzz = Date.now()
    }
}
module.exports=GameRoom;