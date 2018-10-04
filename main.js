// Server libraries
var express = require('express');
var app = express();
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
console.log('Listening on 3000');

app.get('/', function(req, res) {
  // Join all arguments together and normalize the resulting path.
  res.sendFile(__dirname + '/client/index.html');
});

// Add static files files in client folder
app.use(express.static(__dirname + '/client'));

// Variables
var led;
var sensor1;
var sensor2;
var button;

var brightness;
var score = 0;
var gamerunning;

// RASPBERRY BOARD
board.on('ready', function () {
  sensor1 = new five.Sensor.Digital('P1-11');
  sensor2 = new five.Sensor.Digital('P1-7');
  button = new five.Button('P1-40')

  button.on("press", function() {
    console.log( "Button pressed" );
    //io.emit('game-status', "THE GAME IS STARTING");
    io.emit('button-status', true);
  }); // Button endet Hier

  function gameon(){

    // Sensoren aktivieren
    sensor1.on("change", function() {
      brightness = this.value;
      console.log("Die Helligkeit Sensor 1 ist:" + brightness);

      if (brightness == 0){
        io.emit('sensor1', true);

      };
    }); // ENDE SENSOR 1

    sensor2.on("change", function() {
      brightness = this.value;
      console.log("Die Helligkeit Sensor 2 ist:" + brightness);

      if (brightness == 0){
        io.emit('sensor2', true);

      };
    }); // ENDE SENSOR 2

  }; // ENDE Function TEST

  io.on('connection', function(socket) {

    socket.on('gamestart', function(gamestart){
      //console.log("Das funktioniert so toll!");
      gamerunning = true;
      gameon();
      console.log("Das Spiel läuft " + gamerunning);
    });
  }); //ENDE IO CONNECTION
}); // ENDE BOARD

// SOCKET
