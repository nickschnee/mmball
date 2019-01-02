// NICHT LÖSCHEN - WICHTIGES JS FILE, DAMIT FUNKTIONIERT DER GANZE CLIENT

var socket = io.connect(window.location.href);

var buttonstatus = false;
var gamestart = false;
var gamefinish = false;
var endscore = 0; // the score at the end of mygame

var myrank; // my rank in the current game
var timestamp = new Date().getTime() / 1000; // generates timestamp for database
var absoluterank = 0; // numerates ranks from 1 to 10. Is reset upon reaching 10.
var alreadyinserted = false; // checks if player has already been inserted to database
var lastKnownKey; // saves last seen key of a node to push into array
var keyarray = []; // saves all keys which have been pushed into the array
var devicelocation = "Bern"; // set the location of this device

/*socket.on('sensor-status', function(data) {
console.log("Ein Empfängnis! " + data);
document.getElementById("score").innerHTML = data;

}); */

// First Screen
$(document).ready(function(){
  $('#singleplayerbutton').click(function(){
    $('.button-gamestart').toggleClass("hidden");
    $('.game-start').toggleClass("hidden");
  });
});

// Then Show Second Screen when pressed on button
socket.on('button-status', function(buttonstatus) {
  console.log('Button Pressed, Game starting');

  // When Buzzer is Pushed, Show Third Screen
  $(".game-start").toggleClass('hidden');
  $("#pregame-countdown").toggleClass('hidden');
  gameintro();

});

function simulatebuzzer(){
  // When Buzzer is Pushed, Show Third Screen
  $(".game-start").toggleClass('hidden');
  $("#pregame-countdown").toggleClass('hidden');
  gameintro();
}

// Countdown is Starting
function gameintro () {
  var timeleft = 10;
  var downloadTimer = setInterval(function(){
    timeleft--;
    document.getElementById("pregame-countdown").textContent = "Game starting in " + timeleft + " Seconds";

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
  $(".game-intro").toggleClass("hidden");
  $(".game").toggleClass("hidden");

  // Receiving absolute score from server
  // The score is pushed into HTML
  socket.on('score', function(score) {
    console.log(score);
    document.getElementById("score").innerHTML = score;
    endscore = score;
    console.log("Der Endscore ist: " + endscore);
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
      $('.button-gamestart').removeAttr("autofocus");
      $('#ingame').toggleClass("hidden");

      // Display Leaderboard
      getrank(endscore);

      setTimeout(function(){
        if (myrank > 10 || alreadyinserted){
          generateleaderboard();
        } else {
          generatewinnerboard();
        }

        setTimeout(function(){
          $('#playerinput').focus();

        }, 1000);

      }, 1000);
      // end Display Leaderboard

      return;
    }

  },1000);

};

$(document).keydown(
  function(e)
  {
    if (e.keyCode == 39) {
      $(".move:focus").next().focus();
    }

    if (e.keyCode == 37) {
      $(".move:focus").prev().focus();
    }

    if (e.keyCode == 27) {
      $('#myModal').toggleClass("hidden");
    }

  }
);

// Write Player to Database when pressing Enter on Input field
$('table').on("change keyup", function(e) {
  console.log("Input detected!")
  if (e.keyCode === 13)  {
    console.log("ENTERED!")
    writeScore();
  };
});






//FIREBASE
//FIREBASE
//FIREBASE
//FIREBASE
//FIREBASE

//endscore = 20;

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

/*getrank(endscore);

setTimeout(function(){

if (myrank > 10 || alreadyinserted){
generateleaderboard();
} else {
generatewinnerboard();

}

}, 1000);*/







// Functions
// Functions
// Functions
// Functions
// Functions
// Functions
// Functions
// Functions

function newgame(){
  console.log("NEW GAME");

  // reset visuals
  $('.button-gamestart').removeClass("hidden");
  $('#ingame').removeClass("hidden");
  $('.ingameelement').addClass("hidden");
  $('#scoreboard').addClass("hidden");
  $('#button-newgame').removeClass("hidden");

  buttonstatus = false;
  gamestart = false;
  gamefinish = false;
  endscore = 0; // the score at the end of mygame

  myrank = 0; // my rank in the current game
  timestamp = new Date().getTime() / 1000; // generates timestamp for database
  absoluterank = 0; // numerates ranks from 1 to 10. Is reset upon reaching 10.
  alreadyinserted = false; // checks if player has already been inserted to database
  lastKnownKey = "nokey"; // saves last seen key of a node to push into array
  keyarray = []; // saves all keys which have been pushed into the array

  socket.emit('newgame', true);

  location.reload();
}

function generatewinnerboard(){

  // First delete old leaderboard if it exists.
  $( ".tablerow" ).remove();
  $( ".myrow" ).remove();

  if (myrank == 1){
    absoluterank = 1; // set absoluterank to 1 instead of 0 because myrank is already 1

    console.log("Du Gewinnertyp!")

    // generate myrank
    var myhtml = myHtml();
    $("#players").append(myhtml);

    //  generate rest of leaderboard
    playersRef.once('value').then(function(snapshot) {
      var query = playersRef.orderByChild("invertedscore").limitToFirst(9);
      query.once("value")
      .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {

          var myhtml = playerHtmlFromObject(childSnapshot.val());
          $("#players").append(myhtml);

        });

      });
    });

  } else {

    // Then generate new leaderboard
    playersRef.once('value').then(function(snapshot) {

      // write entrys before my rank
      var query = playersRef.orderByChild("invertedscore").limitToFirst((myrank-1));

      // get to know last known key and make array
      query.once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          lastKnownKey = childSnapshot.key;
          keyarray.push(lastKnownKey);
          console.log(keyarray)
        });
      });

      query.once("value")
      .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {

          // Generate Entrys before my rank
          var myhtml = playerHtmlFromObject(childSnapshot.val());
          $("#players").append(myhtml);

        });


        // generate myrank
        var myhtml = myHtml();
        $("#players").append(myhtml);

        absoluterank++;

        // generate ranks after myrank
        playersRef.once('value').then(function(snapshot) {

          var secondquery = playersRef.orderByChild("invertedscore").limitToFirst(9);
          secondquery.once("value")
          .then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {

              var key = childSnapshot.key;
              var includeskey = keyarray.includes(key);
              console.log(includeskey);
              //console.log(status);
              if (includeskey == false) {

                var myhtml = playerHtmlFromObject(childSnapshot.val());
                $("#players").append(myhtml);

              };
            });
          });
        });
      });
    });
  };
};

function generateleaderboard(){

  absoluterank = 0;

  // First delete old leaderboard if it exists.
  $( ".tablerow" ).remove();
  $( ".myrow" ).remove();

  // Then generate new leaderboard
  playersRef.once('value').then(function(snapshot) {
    var query = playersRef.orderByChild("invertedscore").limitToFirst(10);
    query.once("value")
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {

        var myhtml = playerHtmlFromObject(childSnapshot.val());
        $("#players").append(myhtml);

      });

      if (alreadyinserted == false){
        var myhtml = myHtml();
        $("#players").append(myhtml);
      };

    });
  });
};

function getrank(endscore){
  var rankref = firebase.database().ref("players").orderByChild("score").startAt(endscore);
  rankref.once("value")
  .then(function(snapshot) {
    myrank = snapshot.numChildren() + 1;

  });
};


// Wenn auf den Button gedrückt wird, Score eintragen.
function writeScore(){
  console.log("Inserted Player!")
  alreadyinserted = true;
  $('#button-newgame').toggleClass("hidden");


  playersRef.push({
    name: $('#playerinput').val(),
    score: endscore,
    invertedscore: - endscore,
    location: devicelocation,
    timestamp: timestamp
  });

  generateleaderboard();
  $('#button-global').focus();

};

// Generate HTML
function playerHtmlFromObject(player){

  absoluterank++

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

function myHtml(){
  var html = '';
  html += '<tr class="myrow">';
  html += '<td class="text-leaderboard">' + myrank + '.</td>';
  html += '<td class="text-leaderboard">'+ endscore +' </td>';
  html += '<td class="text-leaderboard">'+ '<input id="playerinput" class="move" type="text" name="" placeholder="ENTER YOUR NAME" maxlength="20">' + '</td>';
  html += '<td class="text-leaderboard">'+ devicelocation +'</td>';
  //html += '<p>'+player.timestamp+'</p>';
  html += '</tr>';
  return html;
}

function generateleaderboardchur(){

  absoluterank = 0;

  // First delete old leaderboard if it exists.
  $( ".tablerow" ).remove();
  $( ".myrow" ).remove();

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
  $( ".myrow" ).remove();

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
