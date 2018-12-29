// NICHT LÖSCHEN - WICHTIGES JS FILE, DAMIT FUNKTIONIERT DER GANZE CLIENT

var socket = io.connect(window.location.href);

var buttonstatus = false;
var gamestart = false;
var gamefinish = false;
var endScore = 0;

var leaderboard = 0;
var rank;

/*socket.on('sensor-status', function(data) {
console.log("Ein Empfängnis! " + data);
document.getElementById("score").innerHTML = data;

}); */

socket.on('button-status', function(buttonstatus) {
  console.log('Button Pressed, Game starting');

  // Countdown for Gamestart
  gameintro();

});

// Functions
function gameintro () {
  var timeleft = 10;
  var downloadTimer = setInterval(function(){
    timeleft--;
    document.getElementById("gameinfo").textContent = "Game starting in " + timeleft + " Seconds";

    if(timeleft <= 0){
      gamestart = true;
      socket.emit('gamestart', true);

      console.log("Der Countdown ist fertig!")
      console.log(gamestart);
      clearInterval(downloadTimer);

      play();
    };

  },1000);

};

function play(){
  console.log("Lasst die Spiele beginnen!");
  $("#gameinfo").remove();

  // Receiving absolute score from server
  // The score is pushed into HTML
  socket.on('score', function(score) {
    console.log(score);
    document.getElementById("score").innerHTML = score;
    endScore = score;
  });

  // Receiving last goal data from server
  // This can be used to show different score animations depending on which pipe was hit
  socket.on('lastgoal', function(lastgoal) {
    console.log("Der letzte Treffer gab " + lastgoal + " Punkte");
  });

  var lefttime = 10;
  var Timerdownload = setInterval(function(){
    document.getElementById("progressBar").value = 10 - --lefttime;

    if(lefttime <= 0){
      socket.emit('gamestart', false);
      clearInterval(Timerdownload);
      console.log("Game fertig.")
      gamefinish = true;
      //window.location.href = 'http://www.google.com';
      $('#scoreboard').toggleClass("hidden");
      $('#ingame').toggleClass("hidden");

      $("#myscore").html(endscore);

      console.log(endScore);

      return;
    }

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
  if (e.keyCode === 39 && $('#singleplayerbutton').is(':focus') || e.keyCode === 37 && $('#singleplayerbutton').is(':focus'))  {
    $('#multiplayerbutton').focus();
  } else if (e.keyCode === 37 && $('#multiplayerbutton').is(':focus') || e.keyCode === 39 && $('#multiplayerbutton').is(':focus')) {
    $('#singleplayerbutton').focus();
  }
});






//FIREBASE
//FIREBASE
//FIREBASE
//FIREBASE
//FIREBASE



// Variables for testing only, delete when playing!
// Variables for testing only, delete when playing!
// Variables for testing only, delete when playing!

endscore = 735;

// Initialize Firebase
var config = {
  apiKey: "AIzaSyCYhBFX8j5fBbdgeGqu5IuQAiSiswyIxcM",
  authDomain: "mmball-6c217.firebaseapp.com",
  databaseURL: "https://mmball-6c217.firebaseio.com/",
  projectId: "mmball-6c217",
  storageBucket: "mmball-6c217.appspot.com",
  messagingSenderId: "1011219128121"
};
firebase.initializeApp(config);

//Create firebase database reference
var dbRef = firebase.database();
var playersRef = dbRef.ref('players/');

generateleaderboard();
getrank(endscore);

function generateleaderboard(){

  // Generate HTML, listen for input, add that last entry to HTML
  playersRef.orderByChild("score").limitToLast(5).on("child_added", function(snapshot) {

    document.querySelector('#players').innerHTML += playerHtmlFromObject(snapshot.val());
  });
};

function getrank(endscore){
  var rankref = firebase.database().ref("players").orderByChild("score").startAt(endscore);
  rankref.once("value")
  .then(function(snapshot) {
    rank = snapshot.numChildren() + 1;

    $("#rank").html(rank );
    $("#myscore").html(endscore);

  });
};


// Wenn auf den Button gedrückt wird, Score eintragen.
function writeScore(){

  console.log("Inserted Player!")
  playersRef.push({
    name: $('#player').val(),
    score: endScore,
    location: 'Bern',
    timestamp: 123456789
  });

};

// Generate HTML
function playerHtmlFromObject(player){
  //console.log(contact);
  var html = '';
  html += '<li class="">';
  html += '<div>';
  html += '<p class="">'+player.name+'</p>';
  html += '<p>'+player.score+'</p>';
  html += '<p>'+player.location+'</p>';
  //html += '<p>'+player.timestamp+'</p>';
  html += '</div>';
  html += '</li>';
  return html;
}

/*leaderboardPosition();

// Get your position in the leaderboard by counting how many scores there are
function leaderboardPosition(endscore){

var query = firebase.database().ref("players").orderByChild("score").startAt(endscore);
query.once("value")
.then(function(snapshot) {
snapshot.forEach(function(childSnapshot) {

leaderboard = leaderboard + 1;

//console.log(leaderboard);

});
});
};*/
