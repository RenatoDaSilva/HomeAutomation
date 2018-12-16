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

function getNames() {
  var returnObj = {};
  var query = db.ref().orderByKey();
  query.once("value").then(function (relays) {
    relays.forEach(function (relay) {
      var key = relay.key;
      if (key.startsWith("D")) {
        var item = relay.toJSON();
        returnObj[key] = item.name;
      }
    })
  })
  return returnObj;
}

let names = getNames();

(function () {
  var query = db.ref("agenda").orderByKey();
  query.on("value", function (appointments) {
    var html = "";
    appointments.forEach(function (appointment) {
      var appointmentData = appointment.val();
      var key = appointment.key;

      var appointmentStateStr = appointmentData.state == 0 ? "ligar" : "desligar";
      var appointmentSwitch = appointmentData.switch;
      var appointmentSwitchName = appointmentSwitch; //names[appointmentSwitch];
      var currentTimestamp = new Date();
      var appointmentTimestamp = new Date(appointmentData.timestamp);
      var appointmentColor = currentTimestamp < appointmentTimestamp ? "#FFFFFF" : "#F5F5F5";

      const dateOptions = {
        "hour12": false,
        "year": "numeric",
        "month": "long",
        "day": "2-digit",
        "hour": "2-digit",
        "minute": "2-digit",
        "second": "2-digit",
        "timeZone": "America/Sao_Paulo"
      };
      var appointmentDateTimeFmt = appointmentTimestamp.toLocaleTimeString('pt-BR', dateOptions);

      html += `<div class="well" style="margin: 4px 2px; padding: 5px; background-color: ${appointmentColor};">
      <span style="font-size:15px;cursor:pointer; float: right" onclick="deleteSchedule(${key})">&#10006; </span>
      ${appointmentSwitchName} irá ${appointmentStateStr} em ${appointmentDateTimeFmt}</div>`
    })

    document.getElementById("appointments").innerHTML = html;
  })
}());

function deleteSchedule(key) {
  db.ref("agenda").child(key).remove();
}