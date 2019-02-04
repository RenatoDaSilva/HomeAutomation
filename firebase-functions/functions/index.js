'use strict';

const { dialogflow } = require('actions-on-google');
const app = dialogflow({ debug: false });
const functions = require('firebase-functions');
const admin = require('firebase-admin');

const welcomeHello = ['Olá!', 'Oi!', 'Daí?', 'Beleza?'];
const welcomeSalute = ['Como posso te ajudar?', 'Em que posso lhe ser útil?', 'Fala logo que eu não tenho o dia todo!'];
const okAnswers = ['Beleza!', 'Pronto!', 'OK!', 'Certo!'];
const thanksAnswers1 = ['Beleza!', 'Tudo certo!', 'OK!', 'Tudo bem!'];
const thanksAnswers2 = ['Se precisar é só chamar!', 'Estou a disposição!', 'Que a força esteja com você!'];

var config = {
    credential: admin.credential.applicationDefault(),
    databaseURL: 'ws://home-automation-renato.firebaseio.com'
};

admin.initializeApp(config);

const db = admin.database();

const names = {};

function getNames() {
    var query = db.ref().orderByKey();
    query.once("value", function (switches) {
        switches.forEach(function (switchData) {
            var switchName = switchData.val().name;
            var key = switchData.key;
            if (key.startsWith("D")) {
                names[key] = switchName;
            }
        })
    })
};

getNames();

app.intent('Default Welcome Intent', conv => {
    conv.ask(welcomeHello.sample() + ' ' + welcomeSalute.sample())
})

app.intent('Default Fallback Intent', conv => {
    conv.ask('Desculpe, não entendi o que você quer. Pode repetir?')
})

app.intent('Obrigado', conv => {
    conv.close(thanksAnswers1.sample() + ' ' + thanksAnswers2.sample())
})

app.intent('Acao', acaoFunction);

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

function acaoFunction(conv, { ligar, desligar, dispositivos }) {
    var okAnswer = okAnswers.sample();
    var onOffGender = setOnOffGender(dispositivos, ligar);
    var onoff = ligar.concat(desligar);
    if (dispositivos == 'Todos') {
        db.ref("D1/value").set(onoff);
        db.ref("D2/value").set(onoff);
        db.ref("D3/value").set(onoff);
        db.ref("D4/value").set(onoff);
        db.ref("D5/value").set(onoff);
        db.ref("D6/value").set(onoff);
        db.ref("D7/value").set(onoff);
        db.ref("D8/value").set(onoff);

        conv.ask(okAnswer + ' ' + dispositivos + ' ' + onOffGender);
    }
    else {
        db.ref(dispositivos + "/value").set(onoff);
        conv.ask(okAnswer + ' ' + names[dispositivos] + ' ' + onOffGender);
    }
}

function setOnOffGender(dispositivo, ligar) {
    var prefix = '';
    if (ligar == '') {
        prefix = 'des';
    }
    var sufix = 'a';
    if (dispositivo == 'D2') {
        sufix = 'o';
    }
    if (dispositivo == 'D8') {
        sufix = 'o';
    }
    if (dispositivo == 'Todos') {
        sufix = 'os';
    }
    return prefix + 'ligad' + sufix;
}

function setValue(switchName, valueToChange) {
    console.log(valueToChange);
    if (valueToChange == 2) {
        db.ref(switchName + "/value").once('value').then(function (snapshot) {
            if (snapshot.val() == '0') {
                db.ref(switchName + "/value").set('1');
            } else {
                db.ref(switchName + "/value").set('0');
            }
        });
    }
    else {
        db.ref(switchName + "/value").set(valueToChange);
    };
}

exports.runScheduledActions = functions.https.onRequest((request, response) => {
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

    const currentDateTime = new Date(Date.now());
    const currentDateTimeFmt = currentDateTime.toLocaleString('pt-BR', dateOptions);

    var query = db.ref("agenda").orderByKey();
    query.once("value").then(function (events) {
        var html = "<html><body>";
        html = html + `<h1>Data/Hora atual: ${currentDateTimeFmt}</h1>`;
        events.forEach(function (event) {
            var eventData = event.val();
            var eventDateTime = new Date(eventData.timestamp);
            var eventDateTimeFmt = eventDateTime.toLocaleString('pt-BR', dateOptions);
            const eventRepeat = eventData.repeat;

            html = html + `<h1>Evento ${event.key}</h1>`;
            html = html + `<p>Em ${eventDateTimeFmt} o botão ${eventData.switch} será alterado para o valor ${eventData.state}</p>`;

            if (eventDateTime.valueOf() <= currentDateTime.valueOf()) {
                setValue(eventData.switch, eventData.state);
                if (eventRepeat == 'once') {
                    db.ref("agenda/" + event.key).remove();
                    html = html + '<p style="color:#ff0000;">Este evento foi executado e removido</p>';
                }
                else {
                    var repeatLap = eventRepeat.split(' ');
                    var interval = Number(repeatLap[0]);
                    var period = repeatLap[1];
                    switch (period) {
                        case "minute":
                            eventDateTime.setMinutes(eventDateTime.getMinutes() + interval);
                            break;
                        case "hour":
                            eventDateTime.setHours(eventDateTime.getHours() + interval);
                            break;
                        case "day":
                            eventDateTime.setDate(eventDateTime.getDate() + interval);
                    }
                    db.ref("agenda/" + event.key).update({ "timestamp": eventDateTime });
                    html = html + '<p style="color:#ff0000;">Este evento foi executado e reagendado para ' + eventDateTime.toLocaleString('pt-BR', dateOptions) + '</p>';
                }
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

Array.prototype.sample = function () {
    return this[Math.floor(Math.random() * this.length)];
}
