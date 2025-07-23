'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar,
  Clock,
  Filter,
  Eye,
  Trophy,
  TrendingUp,
  FileText,
  BarChart3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { collection, getDocs, query, where, DocumentData } from "firebase/firestore"
import { db, auth } from "../../firebase/config"
import { onAuthStateChanged, User } from "firebase/auth"
import { useRouter } from 'next/navigation'

interface ExamSession {
  id: string
  title: string
  date?: string
  duration?: string
  difficulty?: string
  category?: string
}

export default function ExamHistory() {
  const router = useRouter()
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const [examHistory, setExamHistory] = useState<ExamSession[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [user, setUser] = useState<User | null>(null)
  const [authChecked, setAuthChecked] = useState<boolean>(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setAuthChecked(true)
    })
    if (auth.currentUser) {
      auth.currentUser
        .reload()
        .then(() => {
          setUser(auth.currentUser)
          setAuthChecked(true)
        })
        .catch(() => {
          setUser(auth.currentUser)
          setAuthChecked(true)
        })
    }
    return () => unsub()
  }, [])

  useEffect(() => {
    if (!authChecked) return
    if (!user) {
      setExamHistory([])
      setLoading(false)
      return
    }
    setLoading(true)
    // FIX: pengecekan user di dalam fetchTryouts juga
    async function fetchTryouts(currentUser: User) {
      const tutorSnap = await getDocs(collection(db, "tutor"))
      let foundTutorDocId: string | null = null
      for (const tutorDoc of tutorSnap.docs) {
        const userSnap = await getDocs(
          query(
            collection(db, "tutor", tutorDoc.id, "user"),
            where("uid", "==", currentUser.uid)
          )
        )
        if (!userSnap.empty) {
          foundTutorDocId = tutorDoc.id
          break
        }
      }
      if (!foundTutorDocId) {
        setExamHistory([])
        setLoading(false)
        return
      }
      const sesiSnap = await getDocs(
        collection(db, "tutor", foundTutorDocId, "Soal")
      )
      const sesiList: ExamSession[] = sesiSnap.docs.map((doc, idx) => {
        const data: DocumentData = doc.data() || {}
        return {
          id: doc.id,
          title: data.title ?? doc.id,
          date: data.date ?? '',
          duration: data.duration
            ? typeof data.duration === "string"
              ? data.duration
              : data.duration + " menit"
            : (90 + idx * 10) + " menit",
          difficulty: data.difficulty ?? "Sedang",
          category: data.category ?? "umum",
        }
      })
      setExamHistory(sesiList)
      setLoading(false)
    }
    // Panggil dengan user yang sudah pasti ada
    fetchTryouts(user)
  }, [user, authChecked])

  // Filter Kategori
  const filters = [
    { id: 'all', name: 'Semua', count: examHistory.length },
    ...Array.from(new Set(examHistory.map(e => e.category)))
      .filter(cat => cat && cat !== "umum")
      .map(cat => ({
        id: cat!,
        name: cat!.charAt(0).toUpperCase() + cat!.slice(1),
        count: examHistory.filter(e => e.category === cat).length
      }))
  ]

  const filteredHistory = examHistory.filter(exam =>
    selectedFilter === 'all' || exam.category === selectedFilter
  )

  // Statistik (dummy, bisa diubah ke data real jika sudah simpan skor/nilai)
  const totalExams = examHistory.length
  const averageScore = 0
  const bestScore = 0
  const improvementTrend = 0

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        stiffness: 100,
        damping: 12
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-orange-500"></div>
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white relative overflow-hidden"
      >
        <motion.div
          className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <div className="relative z-10">
          <motion.h1
            className="text-3xl font-bold mb-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Histori Ujian
          </motion.h1>
          <motion.p
            className="text-orange-100"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Lihat perkembangan dan analisis hasil ujian Anda
          </motion.p>
        </div>
      </motion.div>

<motion.div
  variants={containerVariants}
  className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4"
>
  {/* Total Ujian */}
  <motion.div
    variants={itemVariants}
    whileHover={{ scale: 1.05, boxShadow: "0 8px 32px rgba(0,0,0,0.09)" }}
    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex items-center justify-between"
  >
    <div>
      <p className="text-sm text-gray-600">Total Ujian</p>
      <motion.p className="text-2xl font-bold text-gray-900"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, stiffness: 200, damping: 20 }}
      >{totalExams}</motion.p>
    </div>
    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-blue-50">
      <FileText className="h-6 w-6 text-blue-500" />
    </div>
  </motion.div>
  {/* Rata-rata Nilai */}
  <motion.div
    variants={itemVariants}
    whileHover={{ scale: 1.05, boxShadow: "0 8px 32px rgba(0,0,0,0.09)" }}
    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex items-center justify-between"
  >
    <div>
      <p className="text-sm text-gray-600">Rata-rata Nilai</p>
      <motion.p className="text-2xl font-bold text-teal-600"
        animate={{ color: ["#0f766e", "#10B981", "#0f766e"] }}
        transition={{ duration: 3, repeat: Infinity }}
      >{averageScore}</motion.p>
    </div>
    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-green-50">
      <BarChart3 className="h-6 w-6 text-teal-500" />
    </div>
  </motion.div>
  {/* Nilai Terbaik */}
  <motion.div
    variants={itemVariants}
    whileHover={{ scale: 1.05, boxShadow: "0 8px 32px rgba(0,0,0,0.09)" }}
    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex items-center justify-between"
  >
    <div>
      <p className="text-sm text-gray-600">Nilai Terbaik</p>
      <motion.p className="text-2xl font-bold text-yellow-600"
        animate={{
          textShadow: [
            "0 0 0px rgba(251,146,60,0)",
            "0 0 10px rgba(251,146,60,0.4)",
            "0 0 0px rgba(251,146,60,0)"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >{bestScore}</motion.p>
    </div>
    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-yellow-50">
      <Trophy className="h-6 w-6 text-yellow-500" />
    </div>
  </motion.div>
</motion.div>


      {/* Filter */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filter Kategori</h3>
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <motion.button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedFilter === filter.id
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.name} ({filter.count})
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Exam History List */}
      <motion.div
        variants={containerVariants}
        className="space-y-4"
      >
        {filteredHistory.map((exam, index) => (
          <motion.div
            key={exam.id}
            variants={itemVariants}
            whileHover={{ scale: 1.01, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 card-hover"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {exam.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{exam.date ? new Date(exam.date).toLocaleDateString('id-ID') : '-'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{exam.duration}</span>
                      </div>
                    </div>
                  </div>
                  <motion.span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      exam.difficulty === 'Sulit' ? 'bg-red-100 text-red-800' :
                      exam.difficulty === 'Sedang' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {exam.difficulty}
                  </motion.span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full lg:w-auto btn-hover-lift"
                onClick={() => router.push(`/UserDashboard/exam-history/subtest?sesi=${encodeURIComponent(exam.id)}`)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Lihat Detail
              </Button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredHistory.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Belum ada histori ujian
          </h3>
          <p className="text-gray-600">
            Mulai mengerjakan tryout untuk melihat histori ujian Anda
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
