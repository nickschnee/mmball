// NICHT LÖSCHEN - WICHTIGES JS FILE, DAMIT FUNKTIONIERT DER GANZE CLIENT

//FIREBASE
//FIREBASE
//FIREBASE
//FIREBASE
//FIREBASE

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

// ENDE Firebase
// ENDE Firebase
// ENDE Firebase
// ENDE Firebase
// ENDE Firebase

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
var highscore; // get the highscore from database gethighscore() to display at the beginning

// Define and Load Sounds
var music_intro = new sound("sounds/music_intro.mp3");
var music_gameplay = new sound("sounds/gameplay_mmball_final.mp3");
var sound_buzzer = new sound("sounds/sound_buzzer.mp3");
var sound_highscore = new sound("sounds/sound_highscore.mp3");
var sound_topten = new sound("sounds/sound_topten.mp3");
var sound_nohighscore = new sound("sounds/sound_nohighscore.mp3");
var sound_strike10 = new sound("sounds/sound_strike10.mp3");
var sound_strike25 = new sound("sounds/sound_strike25.mp3");
var sound_strike100 = new sound("sounds/sound_strike100.mp3");
var sound_select = new sound ("sounds/sound_select.wav");

// Start Gameplay
// Show Start Screen on Document Ready
$(document).ready(function(){

  // Reset Variables on Server
  socket.emit('newgame', true);

  music_intro.loop();

  gethighscore();

  $('#leaderboardbutton').click(function(){
    $('.button-gamestart').toggleClass("hidden");
    $('#scoreboard').toggleClass("hidden");
    $('.highscore').toggleClass("hidden");

    alreadyinserted = true;

    //generateleaderboard();
    $('#button-global').focus();

    //console.log("I'm here!");

  });

  $('#singleplayerbutton').click(function(){
    socket.emit('singleplayer', true);
    $('.button-gamestart').toggleClass("hidden");
    $('.game-start').toggleClass("hidden");
  });
});

// Then Show Second Screen when pressed on button
socket.on('button-status', function(buttonstatus) {
  console.log('Button Pressed, Game starting');

  sound_buzzer.play();

  // When Buzzer is Pushed, Show Third Screen
  $(".game-start").toggleClass('hidden');
  $(".game-intro").toggleClass('hidden');

  //$("<img class='gif' src='images/countdown.gif' alt='GIF'> width='1000px' ").appendTo(".gifspace");
  $("#gif").attr("src", "images/countdown.gif");


  gameintro();

});

// Countdown is Starting
function gameintro () {
  music_intro.stop();
  music_gameplay.play();

  var timeleft = 12;
  var downloadTimer = setInterval(function(){
    timeleft--;
    // document.getElementById("pregame-countdown").textContent = "Game starting in " + timeleft + " Seconds";

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
  //$(".gif").remove();
  $("#gif").attr("src", "");



  // Receiving absolute score from server
  // The score is pushed into HTML
  socket.on('score', function(score) {
    console.log(score);
    document.getElementById("score").innerHTML = score;
    endscore = score;
    console.log("Der Endscore ist: " + endscore);

    if (endscore > highscore){
      $("#highscore").html(endscore);
      $(".highscore").addClass("shadow");
      $(".score").addClass("shadow");
    }

  });

  // Receiving last goal data from server
  // This can be used to show different score animations depending on which pipe was hit
  socket.on('lastgoal', function(lastgoal) {
    console.log("Der letzte Treffer gab " + lastgoal + " Punkte");

    if (lastgoal == 25 && !gamefinish){
      //console.log("GIF");
      sound_strike25.play();
      $("#gif").attr("src", "images/superstrike.gif");
      gifcountdown();

    } else if (lastgoal == 10 && !gamefinish){
      sound_strike10.play();
      $("#gif").attr("src", "images/strike.gif");
      gifcountdown();

    };

  });

  var lefttime = 60;
  var Timerdownload = setInterval(function(){
    document.getElementById("progressBar").value = 60 - --lefttime;

    if(lefttime <= 0){
      socket.emit('gamestart', false);
      clearInterval(Timerdownload);
      console.log("Game fertig.")
      gamefinish = true;

      // prepare GIF container for fullscreen GIF
      // add fullscreen GIF
      $('.highscore').addClass("hidden");

      $("#gif").addClass("endgif");
      $('#ingame').addClass("hidden");

      if (endscore == 0){
        sound_nohighscore.play();

      } else if (endscore > highscore){
        sound_highscore.play();
        $("#gif").attr("src", "images/bern_gewinnt.gif");

      } else if (endscore <= highscore){
        sound_topten.play();
        $("#gif").attr("src", "images/nohighscore.gif");
      }

      setTimeout(function(){

        $("#gif").attr("src", " ");

        $('#scoreboard').toggleClass("hidden");
        $('.button-gamestart').removeAttr("autofocus");

        // Display Leaderboard
        getrank(endscore);
        console.log("Alreadyinserted is: " + alreadyinserted);

        // wegen DB latenz eine sekunde puffer einbauen
        setTimeout(function(){

          if (myrank > 10 || alreadyinserted){
            generateleaderboard();
          } else {
            generatewinnerboard();
          }

          // wegen DB latenz eine sekunde puffer einbauen
          setTimeout(function(){
            $('#playerinput').focus();

          }, 1000);

        }, 1000);
        // end Display Leaderboard

      }, 10000); // end of endgif

      return;
    }

  },1000); //end of interval

};

// End Gameplay
// End Gameplay
// End Gameplay
// End Gameplay

// Start Keyboard Controls
// Start Keyboard Controls
// Start Keyboard Controls
// Start Keyboard Controls
// Start Keyboard Controls

$(document).keydown(
  function(e)
  {
    if (e.keyCode == 39) {
      $(".move:focus").next().focus();
      sound_select.play();
    }

    if (e.keyCode == 37) {
      $(".move:focus").prev().focus();
      sound_select.play();
    }

    //Open the Settings Window when ESCAPE is presseed.
    if (e.keyCode == 27 && $("#myModal").hasClass("hidden")) {
      $('#myModal').toggleClass("hidden");
      $('#button-quit').focus();

    } else if (e.keyCode == 27 && !$("#myModal").hasClass("hidden")){
      $('#myModal').toggleClass("hidden");

      if(!$("#singleplayerbutton").hasClass("hidden")){
        $('#singleplayerbutton').focus();

      } else if (!$("#info-push").hasClass("hidden")) {
        console.log("do nothing")

      } else if (!$("#scoreboard").hasClass("hidden") && alreadyinserted) {
        $('#button-global').focus();

      } else if (!$("#scoreboard").hasClass("hidden") && !alreadyinserted) {
        $('#playerinput').focus();

      };
    };
  });

  // Write Player to Database when pressing Enter on Input field
  $('table').on("change keyup", function(e) {
    //console.log("Input detected!")
    if (e.keyCode === 13 && $('#playerinput').val() != "" )  {
      writeScore();
    } else if (e.keyCode === 13 && $('#playerinput').val() == "" ){
      alreadyinserted = true;
      $('#button-global').focus();
    };
  });

  // Control the focus in the overlay settings window
  $("#button-quit").focus(function(){
    $(".quit").toggleClass("hidden");
  });

  $("#button-quit").blur(function(){
    $(".quit").toggleClass("hidden");
  });

  $("#button-help").focus(function(){
    $(".help").toggleClass("hidden");
  });

  $("#button-help").blur(function(){
    $(".help").toggleClass("hidden");
  });

  $("#button-about").focus(function(){
    $(".about").toggleClass("hidden");
  });

  $("#button-about").blur(function(){
    $(".about").toggleClass("hidden");
  });

  $("#button-settings").focus(function(){
    $("#span-location").html(devicelocation);
    $(".settings").toggleClass("hidden");
  });

  $("#button-settings").blur(function(){
    $(".settings").toggleClass("hidden");
  });

  // Leaderboard Focus
  $("#button-global").focus(function(){
    generateleaderboard();
  });

  $("#button-chur").focus(function(){
    generateleaderboardchur();
  });

  $("#button-bern").focus(function(){
    generateleaderboardbern();
  });

  $("#button-newgame").focus(function(){
    $('#text-playagain').removeClass("hidden");
    $( "#players" ).addClass("hidden");
    $( ".tablerow" ).remove();
    $( ".myrow" ).remove();
  });

  $("#button-newgame").blur(function(){
    $('#text-playagain').addClass("hidden");
    $( "#players" ).removeClass("hidden");
  });


  // End Keyboard Controls
  // End Keyboard Controls
  // End Keyboard Controls
  // End Keyboard Controls

  // Start Functions
  // Start Functions
  // Start Functions
  // Start Functions

  function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);

    this.play = function(){
      this.sound.play();
    }

    this.loop = function(){
      this.sound.play();
      this.sound.setAttribute("loop", "true");
    }

    this.stop = function(){
      this.sound.pause();
    }

  }

  function gifcountdown(){
    console.log("This GIF will be removed!");
    setTimeout(function(){

      $("#gif").attr("src", "");

    }, 5000);
  }


  function newgame(){
    console.log("NEW GAME");

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

    $("body").empty();
    location.reload();

    // $(".modal").addClass("hidden");
    // $('#singleplayerbutton').focus();
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
                //console.log(includeskey);
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

    console.log("generating leaderboard");

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
    console.log(rankref);
    rankref.once("value")
    .then(function(snapshot) {
      //myrank = snapshot.numChildren() + 1;
      myrank = snapshot.numChildren();
      console.log("Myrank is: " + myrank);

    });
  };


  // Wenn auf den Button gedrückt wird, Score eintragen.
  function writeScore(){
    console.log("Inserted Player!")
    alreadyinserted = true;

    playersRef.push({
      name: $('#playerinput').val(),
      score: endscore,
      invertedscore: - endscore,
      location: devicelocation,
      timestamp: timestamp
    });

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

            //document.querySelector('#players').innerHTML += playerHtmlFromObject(childSnapshot.val());

            var myhtml = playerHtmlFromObject(childSnapshot.val());
            $("#players").append(myhtml);

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

            //document.querySelector('#players').innerHTML += playerHtmlFromObject(childSnapshot.val());

            var myhtml = playerHtmlFromObject(childSnapshot.val());
            $("#players").append(myhtml);

            i++;

          };
        });
      });
    });
  };

  function gethighscore(){

    playersRef.once('value').then(function(snapshot) {
      var query = playersRef.orderByChild("invertedscore").limitToFirst(1);
      query.once("value")
      .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {

          var entry = childSnapshot.val();

          highscore = entry.score;

          $("#highscore").html(highscore);

        });
      });
    });
  };

  function simulatebuzzer(){
    // When Buzzer is Pushed, Show Third Screen
    $(".game-start").toggleClass('hidden');
    $(".game-intro").toggleClass('hidden');
    gameintro();
  }
