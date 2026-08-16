// Smart School Arduino receiver
// Website -> Supabase Realtime -> Laptop Bridge -> USB Serial -> Arduino

const int CLASSROOM_LIGHT = 7;
const int SMART_BOARD = 8;
const int WATER_PUMP = 6;
// For a servo gate, use Servo.h and attach it to your actual servo pin.
// Example: Servo gate; gate.attach(9);

void setup() {
  Serial.begin(9600);
  pinMode(CLASSROOM_LIGHT, OUTPUT);
  pinMode(SMART_BOARD, OUTPUT);
  pinMode(WATER_PUMP, OUTPUT);

  digitalWrite(CLASSROOM_LIGHT, LOW);
  digitalWrite(SMART_BOARD, LOW);
  digitalWrite(WATER_PUMP, LOW);
}

void setOutput(int pin, String command) {
  digitalWrite(pin, command == "ON" ? HIGH : LOW);
}

void handleCommand(String line) {
  line.trim();

  int sep = line.indexOf(':');
  if (sep < 0) return;

  String device = line.substring(0, sep);
  String command = line.substring(sep + 1);

  if (device == "classroomLight") setOutput(CLASSROOM_LIGHT, command);
  else if (device == "smartBoard") setOutput(SMART_BOARD, command);
  else if (device == "waterPump") setOutput(WATER_PUMP, command);

  // Add your gate/servo logic here when the exact servo wiring is finalized.

  Serial.print("OK:");
  Serial.print(device);
  Serial.print(":");
  Serial.println(command);
}

void loop() {
  if (Serial.available()) {
    String line = Serial.readStringUntil('\n');
    handleCommand(line);
  }
}
