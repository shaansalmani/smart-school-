import asyncio, json, serial
from supabase import create_client

# Fill these 3 values from your Supabase project.
SUPABASE_URL = "PASTE_YOUR_SUPABASE_URL"
SUPABASE_KEY = "PASTE_YOUR_SUPABASE_ANON_KEY"
CHANNEL = "smart-school-arduino"

# Change COM4 if Windows gives your Arduino another COM port.
SERIAL_PORT = "COM4"
BAUD_RATE = 9600

ser = None

def send_arduino(device, command):
    global ser
    line = f"{device}:{command}\n"
    ser.write(line.encode("utf-8"))
    print("Arduino <-", line.strip())

async def main():
    global ser
    ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
    print("Arduino serial connected:", SERIAL_PORT)

    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    channel = supabase.channel(CHANNEL)

    def on_command(payload):
        data = payload.get("payload", payload) if isinstance(payload, dict) else {}
        device = data.get("device")
        command = data.get("command")
        if device and command:
            send_arduino(device, command)

    channel.on_broadcast("arduino-command", on_command)
    channel.subscribe()
    print("Bridge listening on Supabase channel:", CHANNEL)

    # Keep process alive.
    while True:
        await asyncio.sleep(2)

if __name__ == "__main__":
    asyncio.run(main())
