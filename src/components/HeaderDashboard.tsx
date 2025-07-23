'use client'

import { useEffect, useState } from 'react'
import { Menu } from 'lucide-react'
import { db } from '../app/firebase/config'
import { doc, getDoc } from 'firebase/firestore'

interface HeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export default function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const [userData, setUserData] = useState<{ username: string } | null>(null)
  const [tutorData, setTutorData] = useState<{ username: string } | null>(null)

  useEffect(() => {
    const tutorId = typeof window !== 'undefined' ? localStorage.getItem('tutor_uid') : null
    const userId = typeof window !== 'undefined' ? localStorage.getItem('user_uid') : null

    // Fetch USER
    if (tutorId && userId) {
      const fetchUser = async () => {
        try {
          const userDoc = await getDoc(doc(db, 'tutor', tutorId, 'user', userId))
          if (userDoc.exists()) {
            setUserData(userDoc.data() as { username: string })
          }
        } catch (err) {
          console.error('Gagal mengambil data user:', err)
        }
      }
      fetchUser()
    }

    // Fetch TUTOR
    if (tutorId) {
      const fetchTutor = async () => {
        try {
          const tutorDoc = await getDoc(doc(db, 'tutor', tutorId))
          if (tutorDoc.exists()) {
            setTutorData(tutorDoc.data() as { username: string })
          }
        } catch (err) {
          console.error('Gagal mengambil data tutor:', err)
        }
      }
      fetchTutor()
    }
  }, [])

  const username = userData?.username || 'User'
  const initial = username?.charAt(0).toUpperCase()
  const tutorName = tutorData?.username || 'StudyPlatform'

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white border-b border-gray-200 z-50 flex items-center px-4 shadow-sm">
      {/* Tombol Hamburger */}
      <button
        aria-label="Buka Sidebar"
        className={`mr-4 p-2 rounded transition hover:bg-gray-100 active:scale-95
          ${sidebarOpen ? 'bg-gray-100' : ''}`}
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-6 w-6 text-gray-700" />
      </button>

      {/* Logo/Brand */}
      <span className="text-xl font-bold text-purple-600 flex items-center gap-2">
        <span className="bg-purple-100 text-purple-600 font-bold px-2 py-1 rounded-lg text-base">SP</span>
        {tutorName}
      </span>

      {/* Kanan: Search & User */}
      <div className="ml-auto flex items-center gap-3">
        <input
          type="text"
          className="hidden md:block w-72 rounded-lg border border-gray-200 px-3 py-1 bg-gray-50 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-100"
          placeholder="Cari materi, tryout, atau video..."
        />
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-800">
            {username}
          </span>
          <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
            <span className="text-lg font-semibold">{initial}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
