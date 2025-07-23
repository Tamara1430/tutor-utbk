'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  User, Mail, Phone, MapPin, Calendar, Edit, Camera, Save, X, Trophy, Target, BookOpen, Star
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { db, auth } from '../../firebase/config'
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore'

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    username: '', email: '', phone: '', address: '', birthDate: '', school: '', grade: '', bio: ''
  })
  const [loading, setLoading] = useState(true)
  const [tutorId, setTutorId] = useState('')
  const [userDocId, setUserDocId] = useState('')
  const [status, setStatus] = useState('') // Untuk menampilkan saja, tidak untuk diedit

  useEffect(() => {
    const setupAndFetch = async () => {
      let tId = ''
      let userUid = ''
      if (auth.currentUser) {
        tId = localStorage.getItem("tutor_uid") || auth.currentUser.uid
        userUid = auth.currentUser.uid
      } else if (typeof window !== "undefined") {
        tId = localStorage.getItem("tutor_uid") || ''
        userUid = localStorage.getItem("user_uid") || ''
      }
      setTutorId(tId)
      if (!tId || !userUid) { setLoading(false); return }

      const userCol = collection(db, 'tutor', tId, 'user')
      const q = query(userCol, where('uid', '==', userUid))
      const snapshot = await getDocs(q)
      if (!snapshot.empty) {
        const docSnap = snapshot.docs[0]
        setUserDocId(docSnap.id)
        setProfileData({
          username: docSnap.data().username || '',
          email: docSnap.data().email || '',
          phone: docSnap.data().phone || '',
          address: docSnap.data().address || '',
          birthDate: docSnap.data().birthDate || '',
          school: docSnap.data().school || '',
          grade: docSnap.data().grade || '',
          bio: docSnap.data().bio || ''
        })
        setStatus(docSnap.data().status || '')
      }
      setLoading(false)
    }
    setupAndFetch()
  }, [])

  const handleSave = async () => {
    if (!tutorId || !userDocId) {
      alert('tutorId/userDocId kosong')
      return
    }
    try {
      await setDoc(doc(db, 'tutor', tutorId, 'user', userDocId), profileData, { merge: true })
      setIsEditing(false)
      alert('Sukses tersimpan!')
    } catch (e) {
      alert('Gagal simpan: ' + e)
      console.log("ERROR FIREBASE", e)
    }
  }

  const handleCancel = () => setIsEditing(false)

  const achievements = [
    { id: 1, title: 'Juara 1 Olimpiade Matematika', date: '2024', icon: Trophy, color: 'text-yellow-600' },
    { id: 2, title: 'Nilai Tertinggi Tryout UTBK', date: '2024', icon: Star, color: 'text-blue-600' },
    { id: 3, title: 'Streak Belajar 30 Hari', date: '2024', icon: Target, color: 'text-green-600' },
    { id: 4, title: 'Menyelesaikan 100 Video', date: '2024', icon: BookOpen, color: 'text-purple-600' },
  ]

  const stats = [
    { label: 'Total Tryout', value: '24', color: 'bg-blue-500' },
    { label: 'Rata-rata Nilai', value: '85', color: 'bg-green-500' },
    { label: 'Streak Belajar', value: '7 hari', color: 'bg-orange-500' },
    { label: 'Level', value: '15', color: 'bg-purple-500' },
  ]

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { stiffness: 100, damping: 12 } } }

  if (loading) return <div className="flex justify-center items-center min-h-[300px]">Loading...</div>

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl p-6 text-white relative overflow-hidden">
        <motion.div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
        <div className="relative z-10">
          <motion.h1 className="text-3xl font-bold mb-2" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
            Profil Saya
          </motion.h1>
          <motion.p className="text-pink-100" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            Kelola informasi profil dan lihat pencapaian Anda
          </motion.p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200 card-hover">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Informasi Profil</h2>
            {!isEditing ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={() => setIsEditing(true)} variant="outline" className="btn-hover-lift">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </motion.div>
            ) : (
              <div className="flex space-x-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button onClick={handleSave} className="btn-hover-lift">
                    <Save className="h-4 w-4 mr-2" />
                    Simpan
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button onClick={handleCancel} variant="outline" className="btn-hover-lift">
                    <X className="h-4 w-4 mr-2" />
                    Batal
                  </Button>
                </motion.div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-6 mb-6">
            <motion.div className="relative" whileHover={{ scale: 1.05 }}>
              <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                <User className="h-12 w-12 text-white" />
              </div>
              {isEditing && (
                <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.1 }}
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center shadow-lg">
                  <Camera className="h-4 w-4" />
                </motion.button>
              )}
            </motion.div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{profileData.username}</h3>
              <p className="text-gray-600">{profileData.school} - {profileData.grade}</p>
              {/* Status hanya tampil jika ada, tidak bisa diubah di form */}
              {status && (
                <p className="text-xs text-blue-700 bg-blue-100 inline-block px-2 py-1 rounded mt-1">
                  Paket: {status}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              {isEditing ? (
                <input type="text" value={profileData.username} onChange={e => setProfileData({ ...profileData, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
              ) : (
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <User className="h-4 w-4 text-gray-400" />
                  <span>{profileData.username}</span>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              {isEditing ? (
                <input type="email" value={profileData.email} onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
              ) : (
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{profileData.email}</span>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon</label>
              {isEditing ? (
                <input type="tel" value={profileData.phone} onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
              ) : (
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{profileData.phone}</span>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Lahir</label>
              {isEditing ? (
                <input type="date" value={profileData.birthDate} onChange={e => setProfileData({ ...profileData, birthDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
              ) : (
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{profileData.birthDate ? new Date(profileData.birthDate).toLocaleDateString('id-ID') : ''}</span>
                </div>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
              {isEditing ? (
                <input type="text" value={profileData.address} onChange={e => setProfileData({ ...profileData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
              ) : (
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{profileData.address}</span>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sekolah</label>
              {isEditing ? (
                <input type="text" value={profileData.school} onChange={e => setProfileData({ ...profileData, school: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
              ) : (
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <BookOpen className="h-4 w-4 text-gray-400" />
                  <span>{profileData.school}</span>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kelas/Jurusan</label>
              {isEditing ? (
                <input type="text" value={profileData.grade} onChange={e => setProfileData({ ...profileData, grade: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
              ) : (
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Star className="h-4 w-4 text-gray-400" />
                  <span>{profileData.grade}</span>
                </div>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              {isEditing ? (
                <textarea value={profileData.bio} onChange={e => setProfileData({ ...profileData, bio: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span>{profileData.bio}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 card-hover">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistik</h3>
            <div className="space-y-4">
              {stats.map((stat, index) => (
                <motion.div key={stat.label} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{stat.label}</span>
                  <motion.div whileHover={{ scale: 1.05 }} className={`px-3 py-1 ${stat.color} text-white rounded-full text-sm font-medium`}>
                    {stat.value}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 card-hover">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pencapaian</h3>
            <div className="space-y-3">
              {achievements.map((achievement, index) => (
                <motion.div key={achievement.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }} whileHover={{ scale: 1.02, boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                  <motion.div className={`w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm`} whileHover={{ rotate: 5 }}>
                    <achievement.icon className={`h-5 w-5 ${achievement.color}`} />
                  </motion.div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{achievement.title}</h4>
                    <p className="text-xs text-gray-600">{achievement.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
