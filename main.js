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

var brightness
var score = 0;


// RASPBERRY BOARD
board.on('ready', function () {
  sensor1 = new five.Sensor.Digital('P1-11');
  sensor2 = new five.Sensor.Digital('P1-7');
  button = new five.Button('P1-40')

  button.on("press", function() {
    console.log( "Button pressed" );
    io.emit('game-status', "THE GAME IS STARTING");

    setTimeout(function(){
      console.log("Game starting in 3...");
      io.emit('game-status', "NOW PLAYING");
    }, 3000);

    sensor1.on("change", function() {
      brightness = this.value;
      console.log("Die Helligkeit Sensor 1 ist:" + brightness);

      if (brightness == 0){
        score = score + 10;
        io.emit('sensor-status', score);

      };
    });

    sensor2.on("change", function() {
      brightness = this.value;
      //console.log("Die Helligkeit Sensor 2 ist:" + brightness);

      if (brightness == 0){
        score = score + 50;
        io.emit('sensor-status', score);

      };
    });

  });

});

// SOCKET WHEN A CLIENT CONNECTS TO SERVER
io.on('connection', function(socket) {
  console.log('New user connected');

  // Send the current ledState to the client
  //io.emit('update-status', ledIsOn);
  //io.emit('sensor-status', score);

  // On led button press in browser
  /*socket.on('click', function(msg) {
  console.log('Clicked');
  ledIsOn = !ledIsOn;
  led.toggle(); // If light is on off, then activate it, else deactivate
  io.emit('update-status', ledIsOn);
});*/
});
