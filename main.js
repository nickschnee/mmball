// *INFO*

// SERVERSEITIGES JS FILE
// DER SERVER SCHICKT SENSORDATEN AN DEN CLIENT

// Mit Server verbinden: ssh pi@172.20.10.X
// Passwort: 123456
// DIESE DATEI AUSFÜHREN MIT DEM COMMAND sudo node main.js
// index.html kann anschliessend über 172.20.10.X:3000 aufgerufen werden.

// Server libraries
var express = require('express');
var app = express()
var server = require('http').Server(app);

var io = require('socket.io')(server);

// Raspberry libraries
var five = require('johnny-five');
var Raspi = require('raspi-io');
var board = new five.Board({
  io: new Raspi()
});

// Start the express server
server.listen(3000);
console.log('Access client screen on <IP>:3000');

app.get('/', function(req, res) {
  // Join all arguments together and normalize the resulting path.
  //res.sendFile(__dirname + '/client/index.html');
  res.sendFile(__dirname + '/client/index.html');
});

// Add static files files in client folder
app.use(express.static(__dirname + '/client'));

// Variables
var sensor1;
var sensor2;
var button;

var brightness;
var score = 0;
var gamerunning = false;
var countdownstarted = false;
var singleplayer = false; // sets if singleplayermode has been started yet

thegame();

function thegame(){

  // RASPBERRY BOARD
  board.on('ready', function () {
    sensor1 = new five.Sensor.Digital({
      pin: 'P1-11',
      freq: 1,
      threshold: 0.05,
    });

    sensor2 = new five.Sensor.Digital({
      pin: 'P1-7',
      freq: 1,
      threshold: 0.05,
    });

    button = new five.Button('P1-40')

    button.on("press", function() {
      console.log( "Button pressed" );

      if(!countdownstarted && singleplayer){
        io.emit('button-status', true);
        countdownstarted = true;
      }

    }); // Button endet Hier

    // Sensoren aktivieren
    sensor1.on("change", function() {
      brightness = this.value;
      console.log("Sensor 1: Die Helligkeit ist: " + this.value);
      console.log('\u0007');

      //if (brightness == 0 && gamerunning){
        if (brightness == 0 && gamerunning){
          console.log('SCORE IN PIPE A + 10 Points');

          score = score + 10;
          console.log(score);
          io.emit('score', score);
          io.emit('lastgoal', 10);
        };
      });

      sensor2.on("change", function() {
        brightness = this.value;
        console.log("Sensor 2: Die Helligkeit ist: " + this.value);
        console.log('\u0007');

        if (brightness == 0 && gamerunning){
          console.log('SCORE IN PIPE B + 25 Points');

          score = score + 25;
          console.log(score);
          io.emit('score', score);
          io.emit('lastgoal', 25);
        };
      });

      io.on('connection', function(socket) {

        socket.on('singleplayer', function(newgame){
          console.log("Singleplayer");
          singleplayer = true;

        }); // ENDE Function singleplayer

        socket.on('gamestart', function(gamestart){
          //console.log("Das funktioniert so toll!");
          gamerunning = gamestart;
          console.log("das game läuft:" + gamerunning);

        }); // ENDE Function gamestart

        socket.on('newgame', function(newgame){
          console.log("NEW GAME");

          score = 0;
          gamerunning = false;
          countdownstarted = false;
          singleplayer = false;

          thegame(); // start thegame() new

        }); // ENDE Function gamestart

      }); //ENDE IO CONNECTION
    }); // ENDE BOARD

  }; // ENDE thegame()

  // SOCKET
