# Smart School — Arduino + Supabase Realtime

This version is prepared for:

Phone/PC browser
→ Smart School website
→ Supabase Realtime Broadcast
→ Laptop Bridge
→ USB/Serial
→ Arduino UNO

## Important
The website will not connect to Supabase until you enter:
- Supabase Project URL
- Supabase anon/publishable key
- Channel name (default: smart-school-arduino)

Do NOT put a Supabase service-role/secret key in the website.

## Website
Open `index.html` locally or deploy the folder to GitHub Pages.

Click **Connection Settings** and enter the Supabase values.

## Laptop Bridge
On the laptop:

1. Install Python 3.
2. Install packages:
   `pip install supabase pyserial`
3. Open `bridge.py`.
4. Put your Supabase URL and anon key into the constants.
5. Set `SERIAL_PORT = "COM4"` to your Arduino COM port.
6. Upload `arduino/smart_school_receiver.ino` to the Arduino.
7. Run:
   `python bridge.py`

## Arduino
The starter sketch maps:
- classroomLight → D7
- smartBoard → D8
- waterPump → D6

The gate/servo is intentionally left for the next step because the exact gate wiring and servo pin must match your physical model.

## Supabase
Create one Realtime-enabled channel using the same name:
`smart-school-arduino`

The website sends broadcast event:
`arduino-command`

Payload:
{
  "type": "arduino-command",
  "device": "classroomLight",
  "command": "ON"
}

The bridge listens for that event and writes:
`classroomLight:ON`
to the Arduino serial port.

This package is the website + bridge-ready base. The next step is to configure your Supabase project and test one Arduino light before connecting all modules.
