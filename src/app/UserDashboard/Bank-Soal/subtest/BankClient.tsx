'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Filter, Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'

export default function BankClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sesi, setSesi] = useState('')

  // Baca sesi dari URL query
  useEffect(() => {
    const currentSesi = searchParams.get('sesi') || 'Sesi1'
    setSesi(currentSesi)
  }, [searchParams])

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
            Tryout & Latihan Soal
          </motion.h1>
          <motion.p
            className="text-green-100"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Asah kemampuanmu dengan berbagai tryout dan latihan soal berkualitas
          </motion.p>
        </div>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari tryout atau materi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          {/* Filter Button */}
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
        </div>
      </motion.div>

      {/* Static Grid with 7 Subtests */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
      >
        {[
          "Penalaran Umum",
          "Pemahaman Bacaan dan Menulis",
          "Pengetahuan dan Pemahaman Umum",
          "Pengetahuan Kuantitatif",
          "Literasi dalam Bahasa Indonesia",
          "Literasi dalam Bahasa Inggris",
          "Penalaran Matematika"
        ].map((subtest) => (
          <motion.div
            key={subtest}
            variants={itemVariants}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
            }}
            onClick={() =>
              router.push(
                `/soal-utbk?sesi=${encodeURIComponent(sesi)}&subtest=${encodeURIComponent(subtest)}`
              )
            }
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-center text-center font-medium text-gray-800 cursor-pointer hover:bg-gray-50 transition"
          >
            {subtest}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
