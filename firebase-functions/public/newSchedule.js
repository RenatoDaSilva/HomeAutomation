'use strict';

var config = {
  databaseURL: "https://home-automation-renato.firebaseio.com",
  projectId: "home-automation-renato",
  storageBucket: "home-automation-renato.appspot.com",
  APIKEY: "AIzaSyDNEB7wFTiFqc9TyKwNmT9nZuHvTz7spr4",
  authDomain: "home-automation-renato.firebaseapp.com",
  messagingSenderId: "1032180582469"
};

firebase.initializeApp(config);

var db = firebase.database();

(function () {
  var query = db.ref().orderByKey();
  query.on("value", function (names) {
    var html = "";
    names.forEach(function (name) {
      var nameData = name.val().name;
      var key = name.key;
      if (key.startsWith("D")) {
        html += `<option value="${key}">${nameData}</option>`;
      }
    })

    document.getElementById("switchNames").innerHTML = html;
  })
}());

function doSchedule() {
  var state = document.getElementById("state").value;
  var switchKey = document.getElementById("switchNames").value;
  var date = document.getElementById("datetimestamp").value;
  var time = document.getElementById("timetimestamp").value;
  var timestamp = new Date(date + "T" + time + ":00.000-02:00");
   
  var postData = {
    "state": state,
    "switch": switchKey,
    "timestamp": timestamp
  };

  var newPostKey = db.ref().child('agenda').push().key;
  var updates = {};
  updates[newPostKey] = postData;

  var returnObj = firebase.database().ref('agenda').update(updates);

  document.getElementById("message").innerHTML = `<div class="alert alert-sucess" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Successo!</strong> Agendamento efetuado!</div>`;

      setTimeout(function(){
        window.location.assign(window.location.protocol + "//" + window.location.host + "/schedule.html")
      }, 1500);
      
  return returnObj;
}
