// =========================================================
// admin.js — runs on admin.html
// =========================================================

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const pwInput = document.getElementById("pw");
const unlockBtn = document.getElementById("unlockBtn");
const unlockMsg = document.getElementById("unlockMsg");
const unlockSection = document.getElementById("unlockSection");
const postSection = document.getElementById("postSection");

const authorInput = document.getElementById("author");
const titleInput = document.getElementById("title");
const bodyInput = document.getElementById("body");
const postBtn = document.getElementById("postBtn");
const msgEl = document.getElementById("msg");

unlockBtn.addEventListener("click", () => {
  if (pwInput.value === ADMIN_PASSWORD) {
    unlockSection.classList.remove("show");
    postSection.classList.add("show");
  } else {
    unlockMsg.textContent = "Wrong password.";
    unlockMsg.className = "err";
  }
});

// Allow pressing Enter in the password field
pwInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") unlockBtn.click();
});

postBtn.addEventListener("click", async () => {
  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();
  const author = authorInput.value.trim();

  if (!title || !body) {
    msgEl.textContent = "Please fill in both the title and details.";
    msgEl.className = "err";
    return;
  }

  postBtn.disabled = true;
  msgEl.textContent = "Sending...";
  msgEl.className = "";

  try {
    await db.collection("announcements").add({
      title,
      body,
      author: author || null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    msgEl.textContent = "Posted! Classmates will see it now.";
    msgEl.className = "ok";
    titleInput.value = "";
    bodyInput.value = "";
  } catch (err) {
    console.error(err);
    msgEl.textContent = "Something went wrong. Check your Firebase config.";
    msgEl.className = "err";
  } finally {
    postBtn.disabled = false;
  }
});
