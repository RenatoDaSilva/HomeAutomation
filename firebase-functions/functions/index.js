'use strict';

const {dialogflow} = require('actions-on-google');
const app = dialogflow({debug: false});
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
   databaseURL: 'ws://home-automation-renato.firebaseio.com'
 });
const db = admin.database();

app.intent('Default Welcome Intent', conv => {
    conv.ask('Olá! Como posso te ajudar?')
})

app.intent('Default Fallback Intent', conv => {
    conv.ask('Desculpe, não entendi o que você quer, pode repetir?')
})

app.intent('Obrigado', conv => {
    conv.close('Beleza! se precisar é só chamar')
})

app.intent('Acao', acaoFunction);

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

function acaoFunction(conv, {ligar, desligar, dispositivos}){
    var onoff = ligar.concat(desligar);
    var data = {};
    if (dispositivos == 'Todos') {
        data.S1 = onoff;
        data.S2 = onoff;
        data.S3 = onoff;
        data.S4 = onoff;
        data.S5 = onoff;
        data.S6 = onoff;
        data.S7 = onoff;
        data.S8 = onoff;
    }
    else {
        data[dispositivos] = onoff;
    }
    
    db.ref().update(data);

    conv.ask('Pronto!');
}

const dateOptions = {
    hour12: false, 
    timeZone: 'America/Sao_Paulo'
};
const currentDateTime = new Date(Date.now());
const currentDateTimeFmt = currentDateTime.toLocaleString('pt-BR', dateOptions);


function setValue(switchName, valueToChange) {
    db.ref(switchName).set(valueToChange);
}

 function removeSchedule(key) {
     db.ref("agenda").child(key).remove();
 }

exports.runScheduledActions = functions.https.onRequest((request, response) => {
    var query = db.ref("agenda").orderByKey();
    query.once("value").then(function (events) {
        var html = "<html><body>";
        html = html + `<h1>Data/Hora atual: ${currentDateTimeFmt}</h1>`;
        events.forEach(function (event) {
            var eventData = event.val();
            const eventDateTime = new Date(eventData.timestamp);
            const eventDateTimeFmt = eventDateTime.toLocaleString('pt-BR', dateOptions);

            html = html + `<h1>Evento ${event.key}</h1>`;
            html = html + `<p>Em ${eventDateTimeFmt} o botão ${eventData.switch} será alterado para o valor ${eventData.state}</p>`;

            if (eventDateTime.valueOf() <= currentDateTime.valueOf()) {
                setValue(eventData.switch, eventData.state);
                removeSchedule(db, event.key);

                html = html + '<p style="color:#ff0000;">Este evento foi executado e removido</p>';
            }

            html = html + '<br>';
        });
        html = html + `</body></html>`;
        response.send(html);
    });
});



exports.runScheduleEvents = functions.https.onRequest((request, response) => {
  response.send("Nada a exibir por enquanto");
});


