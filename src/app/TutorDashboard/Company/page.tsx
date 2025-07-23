'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  User, Mail, Phone, MapPin, Edit, Camera, Save, X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { db, auth } from '../../firebase/config'
import { doc, setDoc, getDoc } from 'firebase/firestore'

// Index signature for social field dynamic access
type ProfileData = {
  username: string
  email: string
  phone: string
  address: string
  bio: string
  instagram: string
  tiktok: string
  youtube: string
  facebook: string
  [key: string]: string
}

const socials = [
  {
    field: 'instagram',
    label: 'Instagram',
    icon: (
      <svg className="h-5 w-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" strokeWidth="2"/>
        <circle cx="12" cy="12" r="4" strokeWidth="2"/>
        <circle cx="17" cy="7" r="1.5" fill="currentColor"/>
      </svg>
    )
  },
  {
    field: 'tiktok',
    label: 'TikTok',
    icon: (
      <svg className="h-5 w-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M16 3v2a3 3 0 003 3h2v4h-2a7 7 0 11-7-7v4a3 3 0 103 3" strokeWidth="2"/>
      </svg>
    )
  },
  {
    field: 'youtube',
    label: 'YouTube',
    icon: (
      <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="2" y="7" width="20" height="10" rx="5" strokeWidth="2"/>
        <polygon points="10,9 16,12 10,15" fill="currentColor"/>
      </svg>
    )
  },
  {
    field: 'facebook',
    label: 'Facebook',
    icon: (
      <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" strokeWidth="2"/>
        <path d="M16 8h-2a2 2 0 00-2 2v2h4v4h-4v4h-4v-4H8v-4h2v-2a4 4 0 014-4h2z" strokeWidth="2"/>
      </svg>
    )
  }
]

export default function CompanyProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData>({
    username: '', email: '', phone: '', address: '', bio: '',
    instagram: '', tiktok: '', youtube: '', facebook: ''
  })
  const [loading, setLoading] = useState(true)
  const [tutorId, setTutorId] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      let tId = ''
      if (auth.currentUser) {
        tId = auth.currentUser.uid
      } else if (typeof window !== 'undefined') {
        tId = localStorage.getItem("tutor_uid") || ''
      }
      setTutorId(tId)
      if (!tId) { setLoading(false); return }
      const docRef = doc(db, 'tutor', tId)
      const snap = await getDoc(docRef)
      if (snap.exists()) {
        const data = snap.data()
        setProfileData({
          username: data.username || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          bio: data.bio || '',
          instagram: data.instagram || '',
          tiktok: data.tiktok || '',
          youtube: data.youtube || '',
          facebook: data.facebook || ''
        })
        setStatus(data.status || '')
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const handleSave = async () => {
    if (!tutorId) {
      alert('tutorId kosong')
      return
    }
    try {
      await setDoc(doc(db, 'tutor', tutorId), { ...profileData }, { merge: true })
      setIsEditing(false)
      alert('Sukses tersimpan!')
    } catch (e) {
      alert('Gagal simpan: ' + e)
    }
  }

  const handleCancel = () => setIsEditing(false)

  const stats = [
    { label: 'Total Siswa', value: '120', color: 'bg-blue-500' },
    { label: 'Total Program', value: '8', color: 'bg-green-500' },
    { label: 'Rating', value: '4.9', color: 'bg-yellow-500' },
    { label: 'Tahun Aktif', value: '4', color: 'bg-purple-500' },
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
            Profil Tutor/Perusahaan
          </motion.h1>
          <motion.p className="text-pink-100" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            Informasi dan branding profil tutor/instansi
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
              {status && (
                <p className="text-xs text-blue-700 bg-blue-100 inline-block px-2 py-1 rounded mt-1">
                  Paket: {status}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Tutor/Perusahaan</label>
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio / Deskripsi Singkat</label>
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
            {/* Social Media */}
            {socials.map(soc => (
              <div className="md:col-span-2" key={soc.field}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{soc.label}</label>
                {isEditing ? (
                  <input type="text" placeholder="@username/link" value={profileData[soc.field]}
                    onChange={e => setProfileData({ ...profileData, [soc.field]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
                ) : profileData[soc.field] ? (
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    {soc.icon}
                    <span>{profileData[soc.field]}</span>
                  </div>
                ) : null}
              </div>
            ))}
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
        </div>
      </div>
    </motion.div>
  )
}
