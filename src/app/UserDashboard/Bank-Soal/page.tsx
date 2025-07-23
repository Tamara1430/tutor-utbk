"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Clock,
  Users,
  Star,
  Play,
  BookOpen,
  Target,
  Filter,
  Search
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { collection, getDocs, query, where, DocumentData } from "firebase/firestore"
import { db, auth } from "../../firebase/config"
import { onAuthStateChanged, User } from "firebase/auth"
import { useRouter } from "next/navigation"

type TryoutDoc = {
  id: string
  title: string
  description: string
  duration: number
  subtest: number
  participants: number
  difficulty: string
  category: string
  rating: number
  price: string
  image: string
}

export default function Tryout() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [tryouts, setTryouts] = useState<TryoutDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [authChecked, setAuthChecked] = useState(false)

  // Cek auth
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

  // Fetch sesi tryout
  useEffect(() => {
    if (!authChecked) return
    if (!user) {
      setTryouts([])
      setLoading(false)
      return
    }
    setLoading(true)
    async function fetchTryouts() {
      const tutorSnap = await getDocs(collection(db, "tutor"))
      let foundTutorDocId: string | null = null

      for (const tutorDoc of tutorSnap.docs) {
        const userSnap = await getDocs(
          query(
            collection(db, "tutor", tutorDoc.id, "user"),
            where("uid", "==", user!.uid)
          )
        )
        if (!userSnap.empty) {
          foundTutorDocId = tutorDoc.id
          break
        }
      }

      if (!foundTutorDocId) {
        setTryouts([])
        setLoading(false)
        return
      }

      const sesiSnap = await getDocs(
        collection(db, "tutor", foundTutorDocId, "Soal")
      )
      const sesiList: TryoutDoc[] = sesiSnap.docs.map((doc, idx) => {
        const data: DocumentData = doc.data() || {}
        return {
          id: doc.id,
          title: data.title ?? doc.id,
          description: data.description ?? `Latihan soal untuk sesi ${doc.id}.`,
          duration: data.duration ?? (90 + idx * 10),
          subtest: data.subtest ?? (30 + idx * 2),
          participants: data.participants ?? 0,
          difficulty: data.difficulty ?? "Sedang",
          category: data.category ?? "umum",
          rating: data.rating ?? 4.5,
          price: doc.id === "Free" ? "Gratis" : "Premium",
          image: data.image ?? "/api/placeholder/300/200"
        }
      })
      setTryouts(sesiList)
      setLoading(false)
    }
    fetchTryouts()
  }, [user, authChecked])

  const categories = [
    { id: "all", name: "Semua", count: tryouts.length },
    ...Array.from(new Set(tryouts.map((t) => t.category)))
      .filter((cat) => cat !== "umum")
      .map((cat) => ({
        id: cat,
        name: cat.charAt(0).toUpperCase() + cat.slice(1),
        count: tryouts.filter((t) => t.category === cat).length
      }))
  ]

  const filteredTryouts = tryouts.filter((tryout) => {
    const matchesCategory =
      selectedCategory === "all" || tryout.category === selectedCategory
    const matchesSearch =
      tryout.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tryout.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

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
        <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-green-500"></div>
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full px-2 md:px-8 py-6 space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white relative overflow-hidden"
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
            Latihan Soal
          </motion.h1>
          <motion.p
            className="text-green-100"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Asah kemampuanmu dengan berbagai Latihan Soal berkualitas
          </motion.p>
        </div>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari tryout atau materi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? "bg-green-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.name} ({category.count})
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Tryout Grid */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
      >
        {filteredTryouts.map((tryout, index) => (
          <motion.div
            key={tryout.id}
            variants={itemVariants}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
            }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden card-hover"
          >
            <div className="h-48 bg-gradient-to-br from-green-100 to-blue-100 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500 opacity-80"
                whileHover={{ opacity: 0.9 }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
                >
                  <BookOpen className="h-8 w-8 text-white" />
                </motion.div>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
                  tryout.price === "Gratis"
                    ? "bg-green-500 text-white"
                    : "bg-yellow-500 text-white"
                }`}
              >
                {tryout.price}
              </motion.div>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {tryout.title}
                </h3>
                <motion.div
                  className="flex items-center space-x-1 ml-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">{tryout.rating}</span>
                </motion.div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                {tryout.description}
              </p>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <motion.div
                    className="flex items-center justify-center space-x-1 text-gray-600"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Clock className="h-4 w-4" />
                    <span className="text-xs">{tryout.duration}m</span>
                  </motion.div>
                </div>
                <div className="text-center">
                  <motion.div
                    className="flex items-center justify-center space-x-1 text-gray-600"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Target className="h-4 w-4" />
                    <span className="text-xs">{tryout.subtest} Subtest</span>
                  </motion.div>
                </div>
                <div className="text-center">
                  <motion.div
                    className="flex items-center justify-center space-x-1 text-gray-600"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Users className="h-4 w-4" />
                    <span className="text-xs">{tryout.participants}</span>
                  </motion.div>
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                  onClick={() =>
                    router.push(`/UserDashboard/Bank-Soal/subtest?sesi=${encodeURIComponent(tryout.id)}`)
                  }
                >
                  <Play className="h-4 w-4 mr-2" />
                  Mulai Tryout
                </Button>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredTryouts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Tidak ada tryout ditemukan
          </h3>
          <p className="text-gray-600">
            Coba ubah kata kunci pencarian atau filter kategori
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
