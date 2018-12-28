// Hat funktioniert, DB von dem Typen von Time to Hack
// Initialize Firebase
/*var config = {
  apiKey: "AIzaSyCfolxrOcBrgxVXKiBmdRbwakCNsw-kHbQ",
  authDomain: "tempone-7869c.firebaseapp.com",
  databaseURL: "https://tempone-7869c.firebaseio.com",
  projectId: "tempone-7869c",
  storageBucket: "tempone-7869c.appspot.com",
  messagingSenderId: "557485542616"
};
firebase.initializeApp(config);*/

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

//create firebase database reference
var dbRef = firebase.database();
var playersRef = dbRef.ref('players/');

//console.log(dbRef);
console.log(playersRef);

/*playersRef.set ({
   Anna: {
      number: 1,
      age: 30
   },

   Amanda: {
      number: 2,
      age: 20
   }
});*/

playersRef.push({
  name: 'Linus',
  score: 510,
  location: 'Bern',
  timestamp: 123456789

});


/*
//load older conatcts as well as any newly added one...
contactsRef.on("child_added", function(snap) {
  console.log("added", snap.key, snap.val());
  $('#contacts').append(contactHtmlFromObject(snap.val()));
});

//save contact
$('.addValue').on("click", function( event ) {
  event.preventDefault();
  if( $('#name').val() != '' || $('#email').val() != '' ){
    contactsRef.push({
      name: $('#name').val().replace(/<[^>]*>/ig, ""),
      email: $('#email').val().replace(/<[^>]*>/ig, ""),
      location: {
        city: $('#city').val().replace(/<[^>]*>/ig, ""),
        state: $('#state').val().replace(/<[^>]*>/ig, ""),
        zip: $('#zip').val().replace(/<[^>]*>/ig, "")
      }
    })
    contactForm.reset();
  } else {
    alert('Please fill atlease name or email!');
  }
});

//prepare conatct object's HTML
function contactHtmlFromObject(contact){
  console.log( contact );
  var html = '';
  html += '<li class="list-group-item contact">';
  html += '<div>';
  html += '<p class="lead">'+contact.name+'</p>';
  html += '<p>'+contact.email+'</p>';
  html += '<p><small title="'+contact.location.zip+'">'+contact.location.city+', '+contact.location.state+'</small></p>';
  html += '</div>';
  html += '</li>';
  return html;
}
*/
