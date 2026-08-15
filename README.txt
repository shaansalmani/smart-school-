BAV Smart School - repaired original website

This version keeps the original single-page website and fixes:
- Admin login
- Upload / rename / explore media
- Firebase cloud media sync with IndexedDB fallback
- Customize Mode stays on the same page
- Double-click / double-tap text editing
- Double-click / double-tap display photo replacement
- Drag/drop and touch/pointer reordering of Control Center boards
- Customize tabs
- Existing Arduino Web Serial controls are preserved

Admin login:
Username: shan
Password: SmartSchool@2026

Firebase project configured: shan-65830
For cloud sync, enable Anonymous Authentication, Firestore and Storage in Firebase Console.
If cloud services are not enabled, the site continues using local IndexedDB for media.
