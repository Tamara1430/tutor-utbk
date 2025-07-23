// lib/firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD9BhhgzA2D0DPQKapDe2M2wR7U0u7nOu4",
  authDomain: "utbk-2fca1.firebaseapp.com",
  projectId: "utbk-2fca1",
  storageBucket: "utbk-2fca1.firebasestorage.app", // ✅ BENAR!
  messagingSenderId: "317409113218",
  appId: "1:317409113218:web:dd902046c75208bfa9309b",
  measurementId: "G-YC7Y7MB13W"
};

// Cegah duplicate initialize!
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
