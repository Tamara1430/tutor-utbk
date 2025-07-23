// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Konfigurasi Firebase kamu
const firebaseConfig = {
  apiKey: "AIzaSyD9BhhgzA2D0DPQKapDe2M2wR7U0u7nOu4",
  authDomain: "utbk-2fca1.firebaseapp.com",
  projectId: "utbk-2fca1",
  storageBucket: "utbk-2fca1.firebasestorage.app",
  messagingSenderId: "317409113218",
  appId: "1:317409113218:web:dd902046c75208bfa9309b",
  measurementId: "G-YC7Y7MB13W"
};

// Inisialisasi Firebase dan Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
