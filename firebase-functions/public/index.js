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
  query.on("value", function (relays) {
    var html = "";
    relays.forEach(function (relay) {
      var relayData = relay.val();
      var key = relay.key;
      if (key.startsWith("D")) {
        var isOn = (relayData.value == "0") ? "far" : "fas";
        html += `<button id="${key}" value="${relayData.value}" type="button" onclick="doClick(this)" class="btn-lg btn-default btn-block"><i class="${isOn} fa-lightbulb"> ${relayData.name}</i></button>`;
      }
    })

    document.getElementById("buttons").innerHTML = html;
  })
}());

function doClick(button) {
  var invertedButtonValue = button.value == "0" ? "1" : "0";
  db.ref(button.id + "/value").set(invertedButtonValue);
}