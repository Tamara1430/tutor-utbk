'use client';
import React, { useState } from 'react';
import { auth, db } from '../../firebase/config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import '../auth.css';

// Komponen Icon Mata
function EyeIcon({ show }) {
  return show ? (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" strokeWidth="2"/>
      <path d="M2 12S5.5 5 12 5s10 7 10 7-3.5 7-10 7S2 12 2 12z" strokeWidth="2"/>
    </svg>
  ) : (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" strokeWidth="2"/>
      <path d="M2 12S5.5 5 12 5s10 7 10 7-3.5 7-10 7S2 12 2 12z" strokeWidth="2"/>
      <line x1="3" y1="3" x2="21" y2="21" strokeWidth="2"/>
    </svg>
  );
}

// Komponen Alert Custom
function InfoAlert({ show, type = 'info', message, onClose }) {
  if (!show) return null;
  return (
    <div className={`custom-alert custom-alert-${type}`}>
      <span>{message}</span>
      <button className="close-alert" onClick={onClose}>✖</button>
      <style jsx>{`
        .custom-alert {
          position: fixed;
          top: 22px;
          left: 0; right: 0;
          margin: 0 auto;
          width: 80%;
          max-width: 350px;
          padding: 0.9rem 1.5rem;
          border-radius: 10px;
          font-weight: 500;
          z-index: 20;
          box-shadow: 0 4px 16px 0 rgba(60,100,255,0.06);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: 'Inter', sans-serif;
        }
        .custom-alert-info { background: #e0eaff; color: #2563eb; }
        .custom-alert-warning { background: #fff7df; color: #ad7200; }
        .custom-alert-success { background: #e6ffdf; color: #187a12; }
        .custom-alert-error { background: #ffe3e3; color: #e03131; }
        .close-alert {
          background: none;
          border: none;
          font-size: 1.2rem;
          color: inherit;
          cursor: pointer;
          margin-left: 1rem;
        }
      `}</style>
    </div>
  );
}

export default function AuthPages() {
  const [page, setPage] = useState('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Mata
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);

  // Alert
  const [alert, setAlert] = useState({
    show: false,
    type: 'info',
    message: '',
    onClose: null
  });

  const showAlert = (type, message, onClose = null) => {
    setAlert({ show: true, type, message, onClose });
  };
  const hideAlert = () => {
    setAlert({ ...alert, show: false });
    if (alert.onClose) alert.onClose();
  };

  const handleLogin = async () => {
    if (!username || !password) {
      return showAlert('warning', 'Username dan password harus diisi!');
    }
    try {
      const q = query(collection(db, "tutor"), where("username", "==", username));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return showAlert('error', 'Username tidak ditemukan!');
      }
      const userData = querySnapshot.docs[0].data();
      const userEmail = userData.email;
      const userId = querySnapshot.docs[0].id;

      await signInWithEmailAndPassword(auth, userEmail, password);
      localStorage.setItem("tutor_uid", userId);

      showAlert('success', 'Login berhasil!', () => {
        window.location.href = "../TutorDashboard";
      });
    } catch (err) {
    // Tambahkan pengecekan kode error Firebase di sini:
    if (err.code === 'auth/invalid-credential') {
      showAlert('error', 'Username dan password tidak sama');
    } else {
      showAlert('error', err.message);
    }}
  };

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      return showAlert('warning', 'Semua kolom wajib diisi!');
    }
    if (password !== confirmPassword) {
      return showAlert('warning', 'Password tidak cocok!');
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await addDoc(collection(db, "tutor"), {
        uid: userCredential.user.uid,
        username,
        email
      });
      showAlert('success', 'Registrasi berhasil!', () => {
        setPage('login');
      });
    } catch (err) {
      showAlert('error', err.message);
    }
  };

  return (
    // Parent relative agar alert absolute di tengah page, di atas wrapper
    <div style={{ position: 'relative', minHeight: 450 }}>
      {/* ALERT DI LUAR WRAPPER */}
      <InfoAlert
        show={alert.show}
        type={alert.type}
        message={alert.message}
        onClose={hideAlert}
      />

      {/* WRAPPER CARD */}
      <div className="wrapper">
        {page === 'login' ? (
          <>
            <h4 className="header">SELAMAT DATANG! Login Sekarang!</h4>
            <p className="tulisan">Nama Kamu</p>
            <input className="input" type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Masukkan Nama" />
            <p className="tulisan">Password</p>
            <div style={{ position: "relative" }}>
              <input
                className="input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Masukkan Password"
                style={{ paddingRight: 36 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "37%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer"
                }}
                tabIndex={-1}
              >
                <EyeIcon show={showPassword} />
              </button>
            </div>
            <button className="masuk" onClick={handleLogin}>Masuk Sekarang</button>
            <p className="tulisan">Belum Punya Akun? <b onClick={() => setPage('register')} style={{cursor: 'pointer'}}>Daftar</b></p>
          </>
        ) : (
          <>
            <h4 className="header">SELAMAT DATANG! Daftar jadi member kami!</h4>
            <p className="tulisan">Nama Kamu</p>
            <input className="input" type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Masukkan Nama" />
            <p className="tulisan">Email</p>
            <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Masukkan Email" />
            <p className="tulisan">Password</p>
            <div style={{ position: "relative" }}>
              <input
                className="input"
                type={showRegPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Masukkan Password"
                style={{ paddingRight: 36 }}
              />
              <button
                type="button"
                onClick={() => setShowRegPassword(v => !v)}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "37%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer"
                }}
                tabIndex={-1}
              >
                <EyeIcon show={showRegPassword} />
              </button>
            </div>
            <p className="tulisan">Konfirmasi Password</p>
            <div style={{ position: "relative" }}>
              <input
                className="input"
                type={showRegConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Konfirmasi Password"
                style={{ paddingRight: 36 }}
              />
              <button
                type="button"
                onClick={() => setShowRegConfirm(v => !v)}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "37%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer"
                }}
                tabIndex={-1}
              >
                <EyeIcon show={showRegConfirm} />
              </button>
            </div>
            <button className="masuk" onClick={handleRegister}>Daftar</button>
            <p className="tulisan">Sudah Punya Akun? <b onClick={() => setPage('login')} style={{cursor: 'pointer'}}>Masuk</b></p>
          </>
        )}
      </div>
    </div>
  );
}
