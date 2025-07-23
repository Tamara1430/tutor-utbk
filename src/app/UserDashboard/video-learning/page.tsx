'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { motion } from 'framer-motion'
import {
  Play,
  Eye,
  BookOpen,
  Star,
  Search,
  Filter,
  PlayCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'

type VideoDoc = {
  id: string
  title: string
  description: string
  duration?: string
  views?: number
  rating?: number
  category: string
  subtest: string
  instructor: string
  url: string
  isNew?: boolean
}

type Category = {
  id: string
  name: string
  count: number
}

type Subtest = {
  id: string
  name: string
  count: number
}

const getYoutubeEmbedUrl = (url: string): string => {
  try {
    let id = ''
    if (!url) return ''
    if (url.includes('youtube.com')) {
      const u = new URL(url)
      id = u.searchParams.get('v') || ''
    } else if (url.includes('youtu.be/')) {
      id = url.split('youtu.be/')[1].split(/[?&]/)[0]
    }
    return id ? `https://www.youtube.com/embed/${id}` : ''
  } catch {
    return ''
  }
}

export default function VideoLearningFintechAuto() {
  const [videos, setVideos] = useState<VideoDoc[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedSubtest, setSelectedSubtest] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [tutorUid, setTutorUid] = useState<string | null>(null)

  useEffect(() => {
    const tutorId =
      typeof window !== 'undefined' ? localStorage.getItem('tutor_uid') : null
    setTutorUid(tutorId)
  }, [])

  useEffect(() => {
    if (!tutorUid) return
    const fetchVideos = async () => {
      setLoading(true)
      const ref = collection(db, 'tutor', tutorUid, 'dashboard', 'main', 'VideoPembahasan')
      const snap = await getDocs(ref)
      const docs: VideoDoc[] = snap.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          title: data.judul || 'Tanpa Judul',
          description: data.description|| '',
          duration: data.duration || '',
          views: data.views || 0,
          rating: data.rating || 0,
          category: data.kategori || 'lainnya',
          subtest: data.subtest || 'Lainnya',
          instructor: data.instructor || 'Tutor',
          url: data.url,
          isNew: false
        }
      })
      setVideos(docs)
      setLoading(false)
    }
    fetchVideos()
  }, [tutorUid])

  const categories: Category[] = [
    { id: 'all', name: 'Semua', count: videos.length },
    ...Array.from(new Set(videos.map(v => v.category))).map(cat => ({
      id: cat,
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      count: videos.filter(v => v.category === cat).length
    }))
  ]

  const subtests: Subtest[] = [
    { id: 'all', name: 'Semua', count: videos.length },
    ...Array.from(new Set(videos.map(v => v.subtest))).map(sub => ({
      id: sub,
      name: sub,
      count: videos.filter(v => v.subtest === sub).length
    }))
  ]

  const filteredVideos = videos.filter(video => {
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory
    const matchesSubtest = selectedSubtest === 'all' || video.subtest === selectedSubtest
    const matchesSearch =
      (video.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (video.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSubtest && matchesSearch
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

  if (!tutorUid) {
    return (
      <div className="py-20 text-center text-gray-400">
        UID tutor tidak ditemukan.<br />Pastikan sudah login sebagai tutor/siswa dan localStorage tersedia.
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
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white relative overflow-hidden"
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
            Video Pembelajaran
          </motion.h1>
          <motion.p
            className="text-purple-100"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Belajar dengan video berkualitas tinggi dari instruktur terbaik
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari video pembelajaran..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
        </div>
        {/* FILTER KATEGORI */}
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              type="button"
            >
              {category.name} ({category.count})
            </motion.button>
          ))}
        </div>
        {/* FILTER SUBTEST */}
        <div className="flex flex-wrap gap-2 mt-2">
          {subtests.map((subtest) => (
            <motion.button
              key={subtest.id}
              onClick={() => setSelectedSubtest(subtest.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                selectedSubtest === subtest.id
                  ? 'bg-green-600 text-white border-green-600 shadow'
                  : 'bg-green-100 text-green-800 border-green-100 hover:bg-green-200'
              }`}
              type="button"
            >
              {subtest.name} ({subtest.count})
            </motion.button>
          ))}
        </div>
      </motion.div>

      {loading ? (
        <div className="py-20 text-center text-gray-400">Memuat data video...</div>
      ) : (
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredVideos.map((video, index) => (
            <motion.div
              key={video.id}
              variants={itemVariants}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
              }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden card-hover"
            >
              <div className="relative h-48 bg-black overflow-hidden flex items-center justify-center group">
                {getYoutubeEmbedUrl(video.url) ? (
                  <iframe
                    src={getYoutubeEmbedUrl(video.url)}
                    className="w-full h-full"
                    style={{ aspectRatio: "16/9", border: 0 }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={video.title}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-white bg-purple-200">
                    <Play className="w-12 h-12 text-purple-500" />
                  </div>
                )}
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-medium">
                  {video.duration}
                </div>
                {video.isNew && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium"
                  >
                    Baru
                  </motion.div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {video.title}
                  </h3>
                  <motion.div
                    className="flex items-center space-x-1 ml-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{video.rating}</span>
                  </motion.div>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {video.description}
                </p>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">{video.instructor}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <motion.div
                    className="flex items-center space-x-1 text-gray-600"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="text-sm">{video.views?.toLocaleString() || 0} views</span>
                  </motion.div>
                  {/* badge kategori & subtest */}
                  <div className="flex items-center gap-2 mb-4 mt-2">
                    <span className="inline-block px-2 py-0.5 bg-gray-100 text-purple-600 font-semibold rounded text-xs min-w-[90px] text-center">
                      {video.category}
                    </span>
                    <span className="inline-block px-2 py-0.5 bg-green-100 text-green-800 font-medium rounded text-xs">
                      {video.subtest}
                    </span>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white btn-hover-lift"
                    asChild
                  >
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Tonton Video
                    </a>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
      {!loading && filteredVideos.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <motion.div
            animate={{
              y: [0, -10, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Tidak ada video ditemukan
          </h3>
          <p className="text-gray-600">
            Coba ubah kata kunci pencarian atau filter kategori
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
