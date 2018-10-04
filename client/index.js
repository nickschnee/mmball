var socket = io.connect(window.location.href);
/*var $ledButton = document.querySelector('#led-button');
var $body = document.querySelector('body'); */

// When the led button is clicked, send the event to the edison
/*$ledButton.addEventListener('click', function () {
socket.emit('click');
}); */

// When we receive an event from the edison, set the browser to the led state
/*socket.on('update-status', function(data) {
if (data === true) {
$body.classList.add('state-on');
} else {
$body.classList.remove('state-on');
}
});

/*socket.on('game-status', function(data) {
console.log(data);
document.getElementById("gameinfo").innerHTML = data;

});*/

var buttonstatus = false;

socket.on('sensor-status', function(data) {
  console.log("Ein Empfängnis! " + data);
  document.getElementById("score").innerHTML = data;

});

socket.on('button-status', function(buttonstatus) {
  console.log("Status received " + buttonstatus);

  document.getElementById("gameinfo").innerHTML = "Game starting in 3 Seconds";

  var timeleft = 3;
  var downloadTimer = setInterval(function(){
    timeleft--;
    document.getElementById("countdowntimer").textContent = timeleft;
    if(timeleft <= 0)
    clearInterval(downloadTimer);
  },1000);

});
