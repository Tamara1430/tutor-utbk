'use client'
import React, { useState, useEffect, ChangeEvent } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { auth, db } from '../../firebase/config'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { collection, query, where, getDocs, addDoc, doc } from 'firebase/firestore'
import '../auth.css'

// ---- UI Components ----
function EyeIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" strokeWidth="2"/>
      <path d="M2 12S5.5 5 12 5s10 7 10 7-3.5 7-10 7S2 12 2 12z" strokeWidth="2"/>
    </svg>
  ) : (
    <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" strokeWidth="2"/>
      <path d="M2 12S5.5 5 12 5s10 7 10 7-3.5 7-10 7S2 12 2 12z" strokeWidth="2"/>
      <line x1="3" y1="3" x2="21" y2="21" strokeWidth="2"/>
    </svg>
  )
}
function InfoAlert({ show, type = 'info', message, onClose }: { show: boolean, type?: string, message: string, onClose: () => void }) {
  if (!show) return null
  return (
    <div className={`custom-alert custom-alert-${type}`}>
      <span>{message}</span>
      <button className="close-alert" onClick={onClose}>✖</button>
      <style jsx>{`
        .custom-alert {
          position: fixed;
          top: 22px;
          left: 0;
          right: 0;
          margin: 0 auto;
          width: 80%;
          max-width: 350px;
          padding: 0.9rem 1.5rem;
          border-radius: 10px;
          font-weight: 500;
          z-index: 9999;
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
  )
}
function PasswordInput({ value, onChange, placeholder, show, setShow }: {
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  show: boolean
  setShow: (show: boolean) => void
}) {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        className="input"
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
        style={{ paddingRight: 36 }}
      />
      <button
        type="button"
        aria-label={show ? 'Sembunyikan password' : 'Tampilkan password'}
        onClick={() => setShow(!show)}
        style={{
          position: 'absolute', right: 10, top: '50%',
          transform: 'translateY(-50%)',
          background: 'none', border: 'none', padding: 0, cursor: 'pointer'
        }}
        tabIndex={-1}
      >
        <EyeIcon visible={show} />
      </button>
    </div>
  )
}

// ---- MAIN COMPONENT ----
export default function AuthPages() {
  const [page, setPage] = useState<'login' | 'register'>('login')
  const [tutorId, setTutorId] = useState<string>('JasU7NCjFYDs5nq0Q5iM') // default
  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showRegPassword, setShowRegPassword] = useState<boolean>(false)
  const [showRegConfirm, setShowRegConfirm] = useState<boolean>(false)
  const [alert, setAlert] = useState<{ show: boolean, type: string, message: string, onClose: null | (() => void) }>({ show: false, type: 'info', message: '', onClose: null })
  const showAlert = (type: string, message: string, onClose: null | (() => void) = null) =>
    setAlert({ show: true, type, message, onClose })
  const hideAlert = () => {
    setAlert({ ...alert, show: false })
    if (alert.onClose) alert.onClose()
  }

  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    // Always read from query param tutor if exists, else fallback to default
    const tutor = searchParams.get('tutor')
    if (tutor) setTutorId(tutor)
    // eslint-disable-next-line
  }, [searchParams])

  const handleLogin = async () => {
    if (!username || !password) {
      return showAlert('warning', 'Username dan password harus diisi!')
    }
    try {
      const userQuery = query(
        collection(db, 'tutor', tutorId, 'user'),
        where('username', '==', username)
      )
      const querySnapshot = await getDocs(userQuery)
      if (querySnapshot.empty) {
        return showAlert('error', 'Username tidak ditemukan!')
      }
      const userData = querySnapshot.docs[0].data()
      const userEmail = userData.email
      const userId = querySnapshot.docs[0].id

      await signInWithEmailAndPassword(auth, userEmail, password)
      // WAJIB: Simpan dua key ini setiap login user!
      localStorage.setItem('user_uid', userId)
      localStorage.setItem('tutor_uid', tutorId)

      showAlert('success', 'Login berhasil!', () => {
        window.location.href = '../UserDashboard'
      })
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential') {
        showAlert('error', 'Username dan password tidak sama')
      } else {
        showAlert('error', err.message)
      }
    }
  }

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      return showAlert('warning', 'Semua kolom wajib diisi!')
    }
    if (password !== confirmPassword) {
      return showAlert('warning', 'Password tidak cocok!')
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      const tutorRef = doc(db, 'tutor', tutorId)
      const userRef = collection(tutorRef, 'user')
      const userQuery = query(userRef, where('username', '==', username))
      const querySnapshot = await getDocs(userQuery)
      if (!querySnapshot.empty) {
        showAlert('error', 'Username sudah digunakan.')
        return
      }
      await addDoc(userRef, {
        uid: user.uid,
        username,
        email,
      })
      showAlert('success', 'Registrasi berhasil!', () => setPage('login'))
    } catch (err: any) {
      showAlert('error', err.message)
    }
  }

  return (
    <div style={{ position: 'relative', minHeight: 450 }}>
      <InfoAlert
        show={alert.show}
        type={alert.type}
        message={alert.message}
        onClose={hideAlert}
      />
      <div className="wrapper">
        {page === 'login' ? (
          <>
            <h4 className="header">SELAMAT DATANG! Login Sekarang!</h4>
            <p className="tulisan">Nama Kamu</p>
            <input
              className="input"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Masukkan Nama"
              autoComplete="username"
            />
            <p className="tulisan">Password</p>
            <PasswordInput
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Masukkan Password"
              show={showPassword}
              setShow={setShowPassword}
            />
            <button className="masuk" onClick={handleLogin}>Masuk Sekarang</button>
            <p className="tulisan">
              Belum Punya Akun?{' '}
              <b onClick={() => setPage('register')} style={{ cursor: 'pointer' }}>
                Daftar
              </b>
            </p>
          </>
        ) : (
          <>
            <h4 className="header">SELAMAT DATANG! Daftar jadi member kami!</h4>
            <p className="tulisan">Nama Kamu</p>
            <input
              className="input"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Masukkan Nama"
              autoComplete="username"
            />
            <p className="tulisan">Email</p>
            <input
              className="input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Masukkan Email"
              autoComplete="email"
            />
            <p className="tulisan">Password</p>
            <PasswordInput
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Masukkan Password"
              show={showRegPassword}
              setShow={setShowRegPassword}
            />
            <p className="tulisan">Konfirmasi Password</p>
            <PasswordInput
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Konfirmasi Password"
              show={showRegConfirm}
              setShow={setShowRegConfirm}
            />
            <button className="masuk" onClick={handleRegister}>Daftar</button>
            <p className="tulisan">
              Sudah Punya Akun?{' '}
              <b onClick={() => setPage('login')} style={{ cursor: 'pointer' }}>
                Masuk
              </b>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
