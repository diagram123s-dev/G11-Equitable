# Class Announcements App — Setup Guide

You have 8 files. Here's what to do with them.

## Files in this folder
- `index.html` — the page classmates open
- `admin.html` — the page you and your officer use to post (password-protected)
- `app.js` — logic for index.html
- `admin.js` — logic for admin.html
- `firebase-config.js` — **you must edit this** with your own Firebase keys
- `firebase-messaging-sw.js` — required for push notifications (also needs your keys pasted in)
- `manifest.json` — lets classmates "Add to Home Screen"
- `icon-192.png`, `icon-512.png` — placeholder app icons (swap these for your own logo anytime)

## Step 1 — Create your Firebase project
1. Go to https://console.firebase.google.com
2. **Add project** → name it → finish setup (you can skip Google Analytics)
3. Left sidebar → **Build → Firestore Database** → Create database → start in **test mode** → choose a location close to you (e.g. `asia-southeast1`)

## Step 2 — Register a web app
1. Project Settings (gear icon, top left) → scroll to **Your apps** → click the **`</>`** icon
2. Nickname it anything → Register app
3. You'll see a code block with `apiKey`, `authDomain`, `projectId`, etc. **Copy all of it.**

## Step 3 — Get your VAPID key
1. Still in Project Settings → **Cloud Messaging** tab
2. Scroll to **Web configuration** → click **Generate key pair**
3. Copy the long key string shown

## Step 4 — Edit `firebase-config.js`
Open it and replace:
- The whole `firebaseConfig = {...}` object with what you copied in Step 2
- `VAPID_KEY` with what you copied in Step 3
- `ADMIN_PASSWORD` with a password only you and your officer know

## Step 5 — Edit `firebase-messaging-sw.js`
Near the bottom, replace the placeholder values inside `firebase.initializeApp({...})` with the **same** values from Step 2. (This file can't read `firebase-config.js`, so the same keys need to be pasted here too — just copy-paste the same numbers twice.)

## Step 6 — Deploy for free with Firebase Hosting
You'll need a computer with Node.js installed for this part (the CLI tool doesn't run on phones).

```bash
npm install -g firebase-tools
firebase login
cd classapp        # this folder
firebase init hosting
```
When asked:
- "What do you want to use as your public directory?" → type `.` (a single dot, meaning this folder)
- "Configure as a single-page app?" → No
- "Set up automatic builds with GitHub?" → No
- It may ask to overwrite `index.html` → say **No**

Then deploy:
```bash
firebase deploy
```

You'll get a live link like `https://yourproject.web.app` — that's your class app.

## Step 7 — Share it
- Send the link to your class group chat
- **Android (Chrome):** open the link, tap "Enable" when prompted, allow notifications
- **iPhone (Safari):** tap Share → **Add to Home Screen** *first*, then open the app icon from the home screen, then tap "Enable" — push notifications on iPhone only work this way

## Posting an announcement
Go to `https://yourproject.web.app/admin.html`, enter your password, fill in the title and details, hit **Send to class**. It appears instantly in everyone's app and triggers a notification.

## If something doesn't work
- **Notifications never trigger:** double check the keys in `firebase-messaging-sw.js` match `firebase-config.js` exactly
- **"Permission denied" in Firestore:** your database is probably out of "test mode" — Firestore test mode rules expire after 30 days; you'll need to update the security rules (Firebase will show a banner with a link when this happens)
- **iPhone never gets push notifications:** confirm they used "Add to Home Screen" and are opening the home-screen icon, not Safari directly
