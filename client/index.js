// NICHT LÖSCHEN - WICHTIGES JS FILE, DAMIT FUNKTIONIERT DER GANZE CLIENT

var socket = io.connect(window.location.href);

var buttonstatus = false;
var gamestart = false;
var gamefinish = false;
var endScore = 8000;

var leaderboard = 0;
var myrank;
var timestamp = new Date().getTime() / 1000;
var absoluterank = 0;


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

endscore = 8000;

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

getrank(endscore);
generateleaderboard();
//generatetable();

function generateleaderboard(){

  absoluterank = 0;

  // First delete old leaderboard if it exists.
  $( ".tablerow" ).remove();

  // Then generate new leaderboard
  playersRef.once('value').then(function(snapshot) {
    var query = playersRef.orderByChild("invertedscore").limitToFirst(10);
    query.once("value")
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {

        var myhtml = playerHtmlFromObject(childSnapshot.val());
        $("#players").append(myhtml);

      });
    });
  });
};

function generateleaderboardchur(){

  absoluterank = 0;

  // First delete old leaderboard if it exists.
  $( ".tablerow" ).remove();

  // Then generate new leaderboard
  playersRef.once('value').then(function(snapshot) {
    var query = playersRef.orderByChild("invertedscore");
    query.once("value")
    .then(function(snapshot) {

      var i = 1; // counter
      snapshot.forEach(function(childSnapshot) {
        //console.log(i);

        var entry = childSnapshot.val();
        if (entry.location == 'Chur' && i <= 10) {

          document.querySelector('#players').innerHTML += playerHtmlFromObject(childSnapshot.val());
          i++;

        };
      });
    });
  });
};

function generateleaderboardbern(){

  absoluterank = 0;

  // First delete old leaderboard if it exists.
  $( ".tablerow" ).remove();

  // Then generate new leaderboard
  playersRef.once('value').then(function(snapshot) {
    var query = playersRef.orderByChild("invertedscore");
    query.once("value")
    .then(function(snapshot) {

      var i = 1; // counter
      snapshot.forEach(function(childSnapshot) {
        //console.log(i);

        var entry = childSnapshot.val();
        if (entry.location == 'Bern' && i <= 10) {

          document.querySelector('#players').innerHTML += playerHtmlFromObject(childSnapshot.val());
          i++;

        };
      });
    });
  });
};

function getrank(endscore){
  var rankref = firebase.database().ref("players").orderByChild("score").startAt(endscore);
  rankref.once("value")
  .then(function(snapshot) {
    myrank = snapshot.numChildren() + 1;

    $("#rank").html(myrank);
    $("#myscore").html(endscore);

  });
};


// Wenn auf den Button gedrückt wird, Score eintragen.
function writeScore(){
  console.log("Inserted Player!")
  playersRef.push({
    name: $('#player').val(),
    score: endScore,
    invertedscore: - endScore,
    location: 'Bern',
    timestamp: timestamp
  });

  generateleaderboard();

};

// Generate HTML
function playerHtmlFromObject(player){

  absoluterank++
  console.log(absoluterank);

  var html = '';
  html += '<tr class="tablerow">';
  html += '<td class="text-leaderboard">' + absoluterank + '.</td>';
  html += '<td class="text-leaderboard">'+player.score+'</td>';
  html += '<td class="text-leaderboard">'+player.name+'</td>';
  html += '<td class="text-leaderboard">'+player.location+'</td>';
  //html += '<p>'+player.timestamp+'</p>';
  html += '</tr>';

  if (absoluterank >= 10){
    absoluterank = 0;
  }

  return html;

}

/*
leaderboardPosition();

// Get your position in the leaderboard by counting how many scores there are
function leaderboardPosition(endscore){

var query = firebase.database().ref("players").orderByChild("score").startAt(endscore);
query.once("value")
.then(function(snapshot) {
snapshot.forEach(function(childSnapshot) {

//console.log(leaderboard);

});
});
};
*/

/*
// Generate HTML, listen for input, add that last entry to HTML
playersRef.orderByChild("invertedscore").limitToFirst(5).on("child_added", function(snapshot) {
document.querySelector('#players').innerHTML += playerHtmlFromObject(snapshot.val());
});
*/
