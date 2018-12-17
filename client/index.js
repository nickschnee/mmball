// NICHT LÖSCHEN - WICHTIGES JS FILE, DAMIT FUNKTIONIERT DER GANZE CLIENT

var socket = io.connect(window.location.href);

var buttonstatus = false;
var gamestart = false;
var gamefinish = false;

/*socket.on('sensor-status', function(data) {
console.log("Ein Empfängnis! " + data);
document.getElementById("score").innerHTML = data;

}); */

socket.on('button-status', function(buttonstatus) {
  console.log('Button Pressed, Game starting');

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
      socket.emit('gamestart');

      console.log("Der Countdown ist fertig!")
      console.log(gamestart);
      clearInterval(downloadTimer);
    };

    if (gamestart == true) {
      console.log("Lasst die Spiele beginnen!");
      $("#gameinfo").remove();

      // Receiving absolute score from server
      // The score is pushed into HTML
      socket.on('score', function(score) {
        console.log(score);
        document.getElementById("score").innerHTML = score;
      });

      // Receiving last goal data from server
      // This can be used to show different score animations depending on which pipe was hit
      socket.on('lastgoal', function(lastgoal) {
        console.log("Der letzte Treffer gab " + lastgoal + " Punkte");
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


// Document Ready
$(document).ready(function(){
  $('#singleplayerbutton').click(function(){
    $('.playerButton').toggleClass("hidden");
    $('.ingameelement').toggleClass("hidden");
  });
});

// Change Buttons with arrow keys
$('body').on('keydown', function(e) {
  if (e.keyCode === 39 && $('#singleplayerbutton').is(':focus') || e.keyCode === 37 && $('#singleplayerbutton').is(':focus'))  { //right arrow
    $('#multiplayerbutton').focus();
  } else if (e.keyCode === 37 && $('#multiplayerbutton').is(':focus') || e.keyCode === 39 && $('#multiplayerbutton').is(':focus')) {
    $('#singleplayerbutton').focus();
  }
});
