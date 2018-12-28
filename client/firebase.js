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

// Generate HTML, listen for input, add that last entry to HTML
playersRef.orderByChild("score").limitToLast(2).on("child_added", function(snapshot) {
  document.querySelector('#players').innerHTML += playerHtmlFromObject(snapshot.val());
});

// Wenn auf den Button gedrückt wird, Score eintragen.
function writeScore(){

  console.log("Inserted Player!")
  playersRef.push({
    name: $('#player').val(),
    score: 5200,
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
  //html += '<p>'+player.location+'</p>';
  //html += '<p>'+player.timestamp+'</p>';
  html += '</div>';
  html += '</li>';
  return html;
}
