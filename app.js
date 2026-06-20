// =========================================================
// app.js — runs on index.html (the page classmates open)
// =========================================================

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const feedEl = document.getElementById("feed");
const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");
const enableBtn = document.getElementById("enableBtn");

// ---- 1. Listen for announcements in real time ----
db.collection("announcements")
  .orderBy("createdAt", "desc")
  .limit(50)
  .onSnapshot(
    (snapshot) => {
      if (snapshot.empty) {
        feedEl.innerHTML = `<div class="empty">No announcements yet. Check back soon.</div>`;
        return;
      }
      feedEl.innerHTML = "";
      snapshot.forEach((doc) => {
        const data = doc.data();
        const date = data.createdAt
          ? data.createdAt.toDate().toLocaleString([], {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })
          : "";
        const card = document.createElement("div");
        card.className = "announcement";
        card.innerHTML = `
          <div class="meta">${date}${data.author ? " · " + escapeHtml(data.author) : ""}</div>
          <div class="title">${escapeHtml(data.title || "")}</div>
          <div class="body">${escapeHtml(data.body || "")}</div>
        `;
        feedEl.appendChild(card);
      });
    },
    (err) => {
      feedEl.innerHTML = `<div class="empty">Couldn't load announcements. Check your Firebase config.</div>`;
      console.error(err);
    }
  );

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ---- 2. Notification permission + push token registration ----
function refreshStatusUI() {
  const perm = Notification.permission;
  if (perm === "granted") {
    statusDot.classList.add("on");
    statusText.textContent = "Notifications are on";
    enableBtn.textContent = "Enabled";
    enableBtn.disabled = true;
  } else if (perm === "denied") {
    statusDot.classList.remove("on");
    statusText.textContent = "Notifications blocked — check your browser settings";
    enableBtn.textContent = "Blocked";
    enableBtn.disabled = true;
  } else {
    statusDot.classList.remove("on");
    statusText.textContent = "Notifications are off";
    enableBtn.textContent = "Enable";
    enableBtn.disabled = false;
  }
}

async function enableNotifications() {
  try {
    if (!("serviceWorker" in navigator) || !("Notification" in window)) {
      alert("This browser doesn't support notifications. Try Chrome on Android, or on iPhone add this page to your Home Screen first (Share → Add to Home Screen), then open it from there.");
      return;
    }

    const permission = await Notification.requestPermission();
    refreshStatusUI();
    if (permission !== "granted") return;

    const registration = await navigator.serviceWorker.register("firebase-messaging-sw.js");
    const messaging = firebase.messaging();

    const token = await messaging.getToken({
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      // Save this device's token so the admin page can (optionally) target devices,
      // and so we have a record of who's subscribed.
      await db.collection("deviceTokens").doc(token).set({
        token,
        registeredAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      console.log("Registered for push notifications.");
    }
  } catch (err) {
    console.error("Notification setup failed:", err);
    alert("Something went wrong enabling notifications. Open the browser console for details.");
  }
}

enableBtn.addEventListener("click", enableNotifications);

// Reflect current permission state on load
refreshStatusUI();

// Register the service worker early too, so it's ready even before the button is pressed
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("firebase-messaging-sw.js").catch(console.error);
}
