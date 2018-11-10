'use strict';

const {dialogflow} = require('actions-on-google');
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp({
   apiKey: 'AIzaSyDNEB7wFTiFqc9TyKwNmT9nZuHvTz7spr4',
   credential: admin.credential.applicationDefault(),
  databaseURL: 'ws://home-automation-renato.firebaseio.com'
});

const app = dialogflow({debug: true});

var ref = admin.app().database().ref();
var usersRef = ref.child('home-automation-renato');

app.intent('Acao', AcaoFunction);

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

function AcaoFunction(conv, {ligar, desligar, dispositivos}){
    var data = {};
    data[dispositivos] = ligar.concat(desligar);
    
    return ref.update(data);
}