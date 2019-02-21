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
  var query = db.ref("log").orderByChild("timestamp");
  query.on("value", function (logs) {
    var html = "";

    logs.forEach(function (log) {
      var logData = log.val();

      var logTimestamp = new Date(logData.timestamp);
      var logDateTimeFmt = logTimestamp.toLocaleString('pt-BR', dateOptions);
      var logMessage = logData.message;

      html += `<div class="well" style="margin: 4px 2px; padding: 5px;">${logDateTimeFmt}<br>${logMessage}</div>`;

      document.getElementById("logs").innerHTML = html;
    })

  })
}());

function clearLog(key) {
  db.ref("log").remove();
}