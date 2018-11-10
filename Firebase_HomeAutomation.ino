#include <ESP8266WiFi.h>
#include<FirebaseArduino.h>
#define FIREBASE_HOST "home-automation-renato.firebaseio.com"        //Your Firebase Project URL goes here without "http:" , "\" and "/"
#define FIREBASE_AUTH "6NcHOQmciWeAGav4N3NHFlYWhhuuGepPp06TEBmd"     //Your Firebase Database Secret goes here
#define WIFI_SSID "wifi_sem_sinal"                                   //your WiFi SSID for which yout NodeMCU connects
#define WIFI_PASSWORD "contabilidade"                                //Password of your wifi network 

#define Relay1 D1
#define Relay2 D2
#define Relay3 D3
#define Relay4 D4
#define Relay5 D5
#define Relay6 D6
#define Relay7 D7
#define Relay8 D8

int val1;
int val2;
int val3;
int val4;
int val5;
int val6;
int val7;
int val8;

void setup() 
{
  Serial.begin(115200);                                                   // Select the same baud rate if you want to see the datas on Serial Monitor
  pinMode(Relay1,OUTPUT);
  pinMode(Relay2,OUTPUT);
  pinMode(Relay3,OUTPUT);
  pinMode(Relay4,OUTPUT);
  pinMode(Relay5,OUTPUT);
  pinMode(Relay6,OUTPUT);
  pinMode(Relay7,OUTPUT);
  pinMode(Relay8,OUTPUT);

  digitalWrite(Relay1,HIGH);
  digitalWrite(Relay2,HIGH);
  digitalWrite(Relay3,HIGH);
  digitalWrite(Relay4,HIGH);
  digitalWrite(Relay5,HIGH);
  digitalWrite(Relay6,HIGH);
  digitalWrite(Relay7,HIGH);
  digitalWrite(Relay8,HIGH);
  
  WiFi.begin(WIFI_SSID,WIFI_PASSWORD);
  Serial.print("connecting");
  while (WiFi.status()!=WL_CONNECTED){
    Serial.print(".");
    delay(500);
  }
  Serial.println();
  Serial.print("connected:");
  Serial.println(WiFi.localIP());

  Firebase.begin(FIREBASE_HOST,FIREBASE_AUTH);
  setValues();
}

void loop() 
{
  if (Firebase.failed()) {
    Serial.print("setting number failed:");
    Serial.println(Firebase.error());
    firebasereconnect();
    return;
  }
      
  setValues();

  setPins();

  setLog();

}

void setPins() {
  digitalWrite(Relay1, val1);
  digitalWrite(Relay2, val2);
  digitalWrite(Relay3, val3);
  digitalWrite(Relay4, val4);
  digitalWrite(Relay5, val5);
  digitalWrite(Relay6, val6);
  digitalWrite(Relay7, val7);
  digitalWrite(Relay8, val8);
}

void setValues() {
  val1 = Firebase.getString("S1").toInt();
  val2 = Firebase.getString("S2").toInt();
  val3 = Firebase.getString("S3").toInt();
  val4 = Firebase.getString("S4").toInt();
  val5 = Firebase.getString("S5").toInt();
  val6 = Firebase.getString("S6").toInt();
  val7 = Firebase.getString("S7").toInt();
  val8 = Firebase.getString("S8").toInt();
}

void firebasereconnect() {
  Serial.println("Trying to reconnect");
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  setValues();
}

void setLog() {
  Serial.println("S1 = " + String(val1));
  Serial.println("S2 = " + String(val2));
  Serial.println("S3 = " + String(val3));
  Serial.println("S4 = " + String(val4));
  Serial.println("S5 = " + String(val5));
  Serial.println("S6 = " + String(val6));
  Serial.println("S7 = " + String(val7));
  Serial.println("S8 = " + String(val8));
}

