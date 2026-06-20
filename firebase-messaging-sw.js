// =========================================================
// firebase-messaging-sw.js
// Required for push notifications to arrive even when the
// tab/page is closed. Must sit at the root of your site
// (same folder as index.html), not in a subfolder.
// =========================================================

importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

// NOTE: Service workers can't import your firebase-config.js the normal way,
// so the same config values are pasted directly here too.
// Keep these in sync with firebase-config.js if you ever change them.
firebase.initializeApp({
  apiKey: "AIzaSyAD6rX9_gZ3HcWno7t7mwmGb7hVvRhyoV0",
  authDomain: "class-announcement-3ecbb.firebaseapp.com",
  projectId: "class-announcement-3ecbb",
  storageBucket: "class-announcement-3ecbb.firebasestorage.app",
  messagingSenderId: "1094714655385",
  appId: "1:1094714655385:web:85383a57efcc335c6d6e08"
});

const messaging = firebase.messaging();

// Show a notification when a push arrives while the page/tab is closed
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || "Class Announcement";
  const options = {
    body: payload.notification?.body || "",
    icon: "icon-192.png",
    badge: "icon-192.png",
  };
  self.registration.showNotification(title, options);
});
