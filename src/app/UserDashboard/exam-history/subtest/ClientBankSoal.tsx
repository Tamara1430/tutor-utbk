'use client'

import { useEffect, useState } from "react"
import { motion } from 'framer-motion'
import {
  Calendar,
  Clock,
  Trophy,
  FileText,
  BarChart3,
  Eye
} from 'lucide-react'
import { useRouter } from "next/navigation"
import { Button } from '@/components/ui/button'
import { getDownloadURL, ref } from "firebase/storage"
import { storage, db } from "../../../firebase/config"
import { doc, getDoc } from "firebase/firestore"

// SUBTEST NAMES
const SUBTESTS = [
  "Penalaran Umum",
  "Pemahaman Bacaan dan Menulis",
  "Pengetahuan dan Pemahaman Umum",
  "Pengetahuan Kuantitatif",
  "Literasi dalam Bahasa Indonesia",
  "Literasi dalam Bahasa Inggris",
  "Penalaran Matematika"
]

type SubtestResult = {
  date: string
  duration: string
  difficulty: string
  score: number
  totalQuestions: number
  correct: number
  wrong: number
} | null

export default function SubtestHistory() {
  const [results, setResults] = useState<Record<string, SubtestResult>>({})
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState("")
  const [sesi, setSesi] = useState("")
  const [userReady, setUserReady] = useState(false)
  const router = useRouter()

  // Ambil user dari localStorage & Firestore
  useEffect(() => {
    async function fetchUser() {
      const uid = typeof window !== "undefined" ? localStorage.getItem("user_uid") : null
      const tutorId = typeof window !== "undefined" ? localStorage.getItem("tutor_uid") : null
      if (!uid || !tutorId) {
        router.push("/login")
        return
      }
      try {
        const userDoc = await getDoc(doc(db, "tutor", tutorId, "user", uid))
        if (userDoc.exists()) {
          const data = userDoc.data()
          setUsername(data.username || "")
          setSesi(data.sesi || "Premium") // fallback default jika sesi kosong
          setUserReady(true)
        } else {
          setUsername("")
          setSesi("")
          setUserReady(true)
          router.push("/login")
        }
      } catch (e) {
        setUsername("")
        setSesi("")
        setUserReady(true)
        router.push("/login")
      }
    }
    fetchUser()
  }, [router])

  // FETCH DATA DARI FIREBASE STORAGE
  useEffect(() => {
    if (!userReady || !username || !sesi) return
    let cancelled = false
    async function fetchAll() {
      setLoading(true)
      const out: Record<string, SubtestResult> = {}
      for (const subtest of SUBTESTS) {
        const safeSubtest = subtest.replace(/\s+/g, "_")
        const fileName = `final_${username}_${sesi}_${safeSubtest}.json`
        const filePath = `JawabanUser/${username}/sesi/${sesi}/${fileName}`
        try {
          const fileRef = ref(storage, filePath)
          const url = await getDownloadURL(fileRef)
          const resp = await fetch(url)
          const data = await resp.json()
          out[subtest] = {
            date: data.timestamp ? data.timestamp.split("T")[0] : "-",
            duration: "30 menit",
            difficulty: data.result?.difficulty ?? "Sedang",
            score: data.result?.score ?? 0,
            totalQuestions: data.result?.total ?? 70,
            correct: data.result?.correct ?? 0,
            wrong: (data.result?.total ?? 70) - (data.result?.correct ?? 0),
          }
        } catch (e) {
          out[subtest] = null
        }
      }
      if (!cancelled) {
        setResults(out)
        setLoading(false)
      }
    }
    fetchAll()
    return () => { cancelled = true }
  }, [username, sesi, userReady])

  // STATISTIK SUMMARY
  const subtestsWithResult = SUBTESTS.filter(st => results[st])
  const totalExams = subtestsWithResult.length
  const averageScore = totalExams === 0 ? 0 : Math.round(
    subtestsWithResult.reduce((sum, st) => sum + (results[st]?.score || 0), 0) / totalExams
  )
  const bestScore = totalExams === 0 ? 0 : Math.max(...subtestsWithResult.map(st => results[st]?.score || 0))

  // ANIMATION
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { stiffness: 100, damping: 12 } }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* HEADER SUMMARY */}
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

      {/* SUMMARY STAT CARDS */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4"
      >
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

      {/* LIST SUBTEST */}
      <motion.div
        variants={containerVariants}
        className="space-y-4"
      >
        {loading && (
          <div className="text-center text-gray-500 py-6">Loading...</div>
        )}
        {!loading && SUBTESTS.map((subtest, idx) => {
          const data = results[subtest]
          const accuracy = data && data.totalQuestions
            ? Math.round((data.correct / data.totalQuestions) * 100)
            : 0
          return (
            <motion.div
              key={subtest}
              variants={itemVariants}
              whileHover={{ scale: 1.01, boxShadow: "0 10px 25px rgba(0,0,0,0.07)" }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 card-hover"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{subtest}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{data ? data.date : '-'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{data ? data.duration : '-'}</span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        data?.difficulty === 'Sulit' ? 'bg-red-100 text-red-800' :
                        data?.difficulty === 'Sedang' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}
                    >
                      {data ? data.difficulty : '-'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Skor</p>
                      <p className="text-xl font-bold text-gray-900">{data ? data.score : 0}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Benar</p>
                      <p className="text-xl font-bold text-gray-900">{data ? data.correct : 0}/{data ? data.totalQuestions : 0}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Salah</p>
                      <p className="text-xl font-bold text-gray-900">{data ? data.wrong : 0}</p>
                    </div>
                    <div className="flex flex-col justify-center p-3">
                      <p className="text-sm text-gray-600">Akurasi</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${accuracy}%` }}
                          transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                          className={`h-2 rounded-full ${
                            accuracy >= 90 ? 'bg-green-500' :
                            accuracy >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                        />
                      </div>
                      <div className="text-right text-xs font-medium text-gray-600 mt-1">{accuracy}%</div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-2 lg:ml-6">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full lg:w-auto btn-hover-lift"
                    onClick={() =>
                      router.push(
                        `/UserDashboard/exam-history/bedah?sesi=${encodeURIComponent(sesi)}&subtest=${encodeURIComponent(subtest)}`
                      )
                    }
                    disabled={!data}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Lihat Detail
                  </Button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}
