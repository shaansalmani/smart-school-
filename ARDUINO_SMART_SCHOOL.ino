#include <Servo.h>

// Smart School command map used by the website
// 1 = classroom light ON, 0 = OFF
// F/f = fan 1 ON/OFF
// G/g = fan 2 ON/OFF
// 2/3 = gate OPEN/CLOSE
// B/b = buzzer ON/OFF
// R = reset object counter

const int SENSOR_PIN = 7;
const int LIGHT_PIN  = 3;
const int FAN1_PIN   = 5;
const int BUZZER_PIN = 6;
const int FAN2_PIN   = 10;
const int SERVO_PIN  = 9;

Servo gate;
unsigned long count = 0;
bool lastSensor = false;

void setup() {
  Serial.begin(9600);
  pinMode(SENSOR_PIN, INPUT);
  pinMode(LIGHT_PIN, OUTPUT);
  pinMode(FAN1_PIN, OUTPUT);
  pinMode(FAN2_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  digitalWrite(LIGHT_PIN, LOW);
  digitalWrite(FAN1_PIN, LOW);
  digitalWrite(FAN2_PIN, LOW);
  digitalWrite(BUZZER_PIN, LOW);

  gate.attach(SERVO_PIN);
  gate.write(0);
}

void handleCommand(char c) {
  switch (c) {
    case '1': digitalWrite(LIGHT_PIN, HIGH); break;
    case '0': digitalWrite(LIGHT_PIN, LOW); break;
    case 'F': digitalWrite(FAN1_PIN, HIGH); break;
    case 'f': digitalWrite(FAN1_PIN, LOW); break;
    case 'G': digitalWrite(FAN2_PIN, HIGH); break;
    case 'g': digitalWrite(FAN2_PIN, LOW); break;
    case '2': gate.write(90); break;
    case '3': gate.write(0); break;
    case 'B': digitalWrite(BUZZER_PIN, HIGH); break;
    case 'b': digitalWrite(BUZZER_PIN, LOW); break;
    case 'R': count = 0; Serial.println("COUNT:0"); break;
  }
}

void loop() {
  while (Serial.available()) handleCommand(Serial.read());

  bool detected = digitalRead(SENSOR_PIN) == HIGH;
  if (detected && !lastSensor) {
    count++;
    Serial.print("COUNT:");
    Serial.println(count);
  }
  lastSensor = detected;
  delay(20);
}
