var socket = io.connect(window.location.href);

var buttonstatus = false;
var gamestart = false;

socket.on('sensor-status', function(data) {
  console.log("Ein Empfängnis! " + data);
  document.getElementById("score").innerHTML = data;

});

socket.on('button-status', function(buttonstatus) {
  console.log("Buttonstatus received " + buttonstatus);

  // Countdown for Gamestart
  game();

});

// Functions
function game () {
  var timeleft = 10;
  var downloadTimer = setInterval(function(){
    timeleft--;
    document.getElementById("gameinfo").textContent = "Game starting in " + timeleft + " Seconds";

    if(timeleft <= 0){
      gamestart = true;
      console.log("Der Countdown ist fertig!")
      console.log(gamestart);
      clearInterval(downloadTimer);
    };

    if (gamestart == true) {
      console.log("Lasst die Spiele beginnen!");

      var lefttime = 10;
      var Timerdownload = setInterval(function(){
        document.getElementById("progressBar").value = 10 - --lefttime;
        if(lefttime <= 0)
        clearInterval(Timerdownload);
      },1000);
    }

  },1000);

};
