BAV SMART SCHOOL - PHONE TO ARDUINO SETUP
=========================================

IMPORTANT ARCHITECTURE
----------------------
Phone browser
    -> Firebase Firestore
    -> Smart School page open on a PC/laptop
    -> Web Serial USB
    -> Arduino UNO SMD

The phone does NOT need a COM port. COM4 is a Windows/PC serial-port concept.

1. FIREBASE
-----------
Firebase project: shan-65830
Enable:
- Authentication -> Sign-in method -> Anonymous -> Enable
- Firestore Database -> Create database
- Storage -> Get started

Paste the rules from FIREBASE_RULES.txt into Firestore Rules and Storage Rules.

2. PC/LAPTOP
------------
- Open the Smart School website in Google Chrome or Microsoft Edge.
- Connect Arduino UNO by USB.
- Open Control Center.
- Click CONNECT ARDUINO.
- Select the Arduino/USB serial port.
- Leave this page open while controlling from the phone.

3. PHONE
--------
- Open the same website.
- Login normally.
- Press Light/Gate/Fan/Bell controls.
- If the phone has no USB serial connection, the website sends the command to Firebase.
- The connected PC receives it and forwards it to Arduino.

4. ARDUINO
----------
The included ARDUINO_SMART_SCHOOL.ino uses the command map already used by the dashboard.
Upload it from Arduino IDE while the board is connected to the PC.

5. MEDIA
--------
Photo/video upload uses Firebase Storage + Firestore. Uploaded cloud media can be read from another device after Firebase is configured.

NOTE
----
If Firebase Authentication/Firestore/Storage is not enabled, phone-to-PC commands and cloud media cannot work across devices.
