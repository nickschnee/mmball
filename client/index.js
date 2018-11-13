// NICHT LÖSCHEN - WICHTIGES JS FILE, DAMIT FUNKTIONIERT DER GANZE CLIENT

var socket = io.connect(window.location.href);

var buttonstatus = false;
var gamestart = false;
var gamefinish = false;
var score = 0;

/*socket.on('sensor-status', function(data) {
console.log("Ein Empfängnis! " + data);
document.getElementById("score").innerHTML = data;

}); */

socket.on('button-status', function(buttonstatus) {
  console.log("Buttonstatus received " + buttonstatus);

  // Countdown for Gamestart
  game();

});

// Functions
function game () {
  var timeleft = 5;
  var downloadTimer = setInterval(function(){
    timeleft--;
    document.getElementById("gameinfo").textContent = "Game starting in " + timeleft + " Seconds";

    if(timeleft <= 0){
      gamestart = true;
      socket.emit('gamestart');

      console.log("Der Countdown ist fertig!")
      console.log(gamestart);
      clearInterval(downloadTimer);
    };

    if (gamestart == true) {
      console.log("Lasst die Spiele beginnen!");
      $("#gameinfo").remove();

      socket.on('sensor1', function(data) {
        console.log("Score Sensor 1");
        score = score + 10;
        document.getElementById("score").innerHTML = score;
      });

      socket.on('sensor2', function(data) {
        console.log("Score Sensor 2");
        score = score + 50;
        document.getElementById("score").innerHTML = score;
      });

      var lefttime = 60;
      var Timerdownload = setInterval(function(){
        document.getElementById("progressBar").value = 60 - --lefttime;

        if(lefttime <= 0){
          socket.emit('gamestart');
          clearInterval(Timerdownload);
          console.log("Game fertig.")
          gamefinish = true;
          return;
        }

      },1000);
    };

  },1000);

};
