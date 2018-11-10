'use strict';

const {dialogflow} = require('actions-on-google');
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp({
   apiKey: '6NcHOQmciWeAGav4N3NHFlYWhhuuGepPp06TEBmd',
   credential: admin.credential.applicationDefault(),
  databaseURL: 'ws://home-automation-renato.firebaseio.com'
});

const app = dialogflow({debug: true});

var ref = admin.app().database().ref();
var usersRef = ref.child('home-automation-renato');

var rooms = {
    "Sala": "S1",
    "Cozinha": "S2",
    "Copa": "S3",
    "Garagem": "S4",
    "Fundos": "S5",
    "Corredor": "S6"
};

app.intent('Desligar', DesligarFunction);
app.intent('Ligar', LigarFunction);

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

function DesligarFunction(conv, {Dispositivos}){
    var room = rooms[Dispositivos];
    var obj = { [room]: "0" };
    
    return ref.update(obj);
}

function LigarFunction(conv, {Dispositivos}){
    var room = rooms[Dispositivos];
    var obj = { [room]: "1" };
    
    return ref.update(obj);
}

//verificar se o dispositivo ja esta ligado antes de acioná-lo e responder que ja esta ligado
//mesclar entidades Ligar e Desligar, e tratar cada entry na funcao
//recriar o projeto do dialogflow apontando para o projeto correto no firebase