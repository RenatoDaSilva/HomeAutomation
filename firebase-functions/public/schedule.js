'use strict';

const dateOptions = {
  "hour12": false,
  "year": "numeric",
  "month": "long",
  "day": "2-digit",
  "hour": "2-digit",
  "minute": "2-digit",
  "timeZone": "America/Sao_Paulo"
};

const config = {
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
  var query = db.ref("agenda").orderByChild("timestamp");
  query.on("value", function (appointments) {
    var html = "";
    if (appointments.numChildren() == 0) {
      html = '<div class="well" style="margin: 4px 2px; padding: 5px; background-color: #82E0AA;">Nenhum agendamento encontrado</div>';

      document.getElementById("appointments").innerHTML = html;
    }

    appointments.forEach(function (appointment) {
      var appointmentData = appointment.val();
      var key = appointment.key;
      var appointmentStateStr = '';

      switch (appointmentData.state) {
        case '0':
          appointmentStateStr = "ligar";
          break;
        case '1':
          appointmentStateStr = "desligar";
          break;
        case '-1':
          appointmentStateStr = "inverter";
      };

      var currentTimestamp = new Date();
      var appointmentTimestamp = new Date(appointmentData.timestamp);
      var appointmentColor = currentTimestamp < appointmentTimestamp ? "#FFFFFF" : "#FF0000";
      var appointmentDateTimeFmt = appointmentTimestamp.toLocaleString('pt-BR', dateOptions);

      db.ref(appointmentData.switch).once("value")
        .then(function (snapshot) {
          var appointmentSwitchName = snapshot.child("name").val();

          html += `<div class="well" style="margin: 4px 2px; padding: 5px; background-color: ${appointmentColor};"><span style="font-size:15px;cursor:pointer; float: right" onclick="deleteSchedule('${key}')">&#10006; </span>${appointmentSwitchName} irá ${appointmentStateStr} em ${appointmentDateTimeFmt}</div>`;

          document.getElementById("appointments").innerHTML = html;
        });
    })
  })
}());

function deleteSchedule(key) {
  db.ref("agenda").child(key).remove();
}