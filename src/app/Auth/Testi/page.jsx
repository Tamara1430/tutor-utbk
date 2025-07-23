'use client'
import React, { useState } from 'react';
import '../auth.css';

export default function AuthPages() {
  const [page, setPage] = useState('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [preview, setPreview] = useState(null);

  // Simulasi login (bisa kamu custom ke backend sendiri nanti)
  const handleLogin = async () => {
    if (!username || !password) return alert("Username dan password harus diisi!");
    alert("Login berhasil!");
    window.location.href = "../UserDashboard";
  };

  // Simulasi daftar user + upload screenshot ke CRT
  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) return alert("Semua kolom wajib diisi!");
    if (password !== confirmPassword) return alert("Password tidak cocok!");
    if (!screenshot) return alert("Silakan upload screenshot IG sudah follow dulu!");

    // Proses upload ke backend CRT (nanti ganti URL CRT kamu sendiri)
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('screenshot', screenshot);

    try {
      const response = await fetch('http://localhost:5000/api/verify-follow', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();

      if (result.allowed) {
        alert("Registrasi & verifikasi follow IG sukses! Silakan login.");
        setPage('login');
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setScreenshot(null);
        setPreview(null);
      } else {
        alert("Akun kamu belum follow! Silakan follow dulu sebelum daftar.");
      }
    } catch (err) {
      alert("Gagal menghubungi server CRT. Coba lagi nanti.");
    }
  };

  // Handle upload gambar
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setScreenshot(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  return (
    <div className="wrapper">
      {page === 'login' ? (
        <>
          <h4 className="header">SELAMAT DATANG! Login Sekarang!</h4>
          <p className="tulisan">Nama Kamu</p>
          <input className="input" type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Masukkan Nama" />
          <p className="tulisan">Password</p>
          <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Masukkan Password" />
          <button className="masuk" onClick={handleLogin}>Masuk Sekarang</button>
          <p className="tulisan">Belum Punya Akun? <b onClick={() => setPage('register')} style={{ cursor: 'pointer' }}>Daftar</b></p>
        </>
      ) : (
        <>
          <h6 className="header" style={{marginTop: "100px"}}>SELAMAT DATANG! Daftar jadi member kami!</h6>
          <p className="tulisan">Nama Kamu</p>
          <input className="input" type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Masukkan Nama" />
          <p className="tulisan">Email</p>
          <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Masukkan Email" />
          <p className="tulisan">Password</p>
          <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Masukkan Password" />
          <p className="tulisan">Konfirmasi Password</p>
          <input className="input" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Konfirmasi Password" />
          
          {/* Upload screenshot hanya di form daftar */}
          <p className="tulisan">Upload screenshot IG sudah follow</p>
          <input
            className="input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ border: "none", background: "none" }}
          />
          {preview && (
            <img
              src={preview}
              alt="Preview Screenshot"
              className="mt-2 w-32 h-auto rounded shadow"
              style={{ marginTop: 8, marginBottom: 8, borderRadius: 8 }}
            />
          )}

          <button className="masuk" onClick={handleRegister}>Daftar</button>
          <p className="tulisan">Sudah Punya Akun? <b onClick={() => setPage('login')} style={{ cursor: 'pointer' }}>Masuk</b></p>
        </>
      )}
    </div>
  );
}
