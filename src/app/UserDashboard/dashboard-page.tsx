'use client'

import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import { 
  FileText, Play, BookOpen, Award
} from 'lucide-react'
import Link from 'next/link'

const MOTIVATION_QUOTES = [
  { text: 'Usaha tidak akan pernah mengkhianati hasil.', author: 'Anies Baswedan' },
  { text: 'Orang yang tidak pernah membuat kesalahan, tidak pernah mencoba sesuatu yang baru.', author: 'Albert Einstein' },
  { text: 'Kunci kesuksesan adalah fokus pada tujuan, bukan pada hambatan.', author: 'Jack Ma' },
  { text: 'Masa depan adalah milik mereka yang percaya pada keindahan mimpi mereka.', author: 'Eleanor Roosevelt' },
  { text: 'Semangat, kerja keras, dan tekad akan membawamu ke tempat yang kamu impikan.', author: 'B.J. Habibie' },
  { text: 'Sukses adalah hasil dari persiapan, kerja keras, dan belajar dari kegagalan.', author: 'Colin Powell' },
  { text: 'Jangan takut gagal, karena kegagalan adalah guru terbaik.', author: 'Soichiro Honda' },
  { text: 'Mimpi tidak akan menjadi kenyataan tanpa tindakan.', author: 'Walt Disney' },
  { text: 'Percayalah pada dirimu sendiri, dan segala sesuatu mungkin terjadi.', author: 'Simone Biles' },
  { text: 'Kesempatan tidak datang dua kali, manfaatkan sebaik mungkin.', author: 'Chairul Tanjung' }
]

const quickActions = [
  { icon: FileText, label: 'Bank Soal', color: 'bg-blue-500', hoverColor: 'hover:bg-blue-600', href: '/Bank-Soal', external: false },
  { icon: Play, label: 'Tonton Video', color: 'bg-green-500', hoverColor: 'hover:bg-green-600', href: '/video-learning', external: false },
  { icon: BookOpen, label: 'Baca Materi', color: 'bg-purple-500', hoverColor: 'hover:bg-purple-600', href: 'https://drive.google.com/file/d/1KrdOINVyLrcbMhdQn7mkVUSApedsr14h/view?usp=drive_link', external: true },
  { icon: Award, label: 'Lihat Histori', color: 'bg-orange-500', hoverColor: 'hover:bg-orange-600', href: '/exam-history', external: false },
]

export default function Dashboard() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  // Carousel state
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      transition: { duration: 0.5 }
    })
  }

  const handleNext = () => {
    setDirection(1)
    setIndex((prev) => (prev + 1) % MOTIVATION_QUOTES.length)
  }
  const handlePrev = () => {
    setDirection(-1)
    setIndex((prev) => (prev - 1 + MOTIVATION_QUOTES.length) % MOTIVATION_QUOTES.length)
  }

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
      transition: { type: "spring" as const, stiffness: 100, damping: 12 }
    }
  }

  return (
    <motion.div 
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="space-y-6"
    >
      {/* Welcome Section */}
      <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white card-hover relative overflow-hidden"
      >
        <motion.div
          className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full"
          animate={{ scale: [1, 1.1, 1], x: [0, 10, 0], y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <motion.h1 
              className="text-2xl font-bold mb-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Selamat datang kembali 👋
            </motion.h1>
            <motion.p 
              className="text-blue-100"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Ayo lanjutkan perjalanan belajarmu hari ini
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Carousel Motivasi */}
      <motion.div
        variants={itemVariants}
        className="relative flex flex-col items-center justify-center bg-white rounded-xl p-6 border shadow-sm overflow-hidden min-h-[140px]"
      >
        <div className="w-full max-w-xl flex items-center justify-center">
          {/* Prev Button */}
          <button
            onClick={handlePrev}
            className="absolute left-4 md:left-8 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full p-2 z-10"
            aria-label="Sebelumnya"
            tabIndex={0}
          >
            <svg width={22} height={22} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" strokeWidth={2}/></svg>
          </button>
          {/* Carousel Slide */}
          <div className="flex-1 px-8 text-center relative min-h-[72px] flex flex-col justify-center items-center">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={index}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full"
              >
                <div className="text-lg md:text-xl font-semibold text-gray-800">
                  “{MOTIVATION_QUOTES[index].text}”
                </div>
                <div className="mt-2 text-sm md:text-base text-gray-500 font-medium">
                  — {MOTIVATION_QUOTES[index].author}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          {/* Next Button */}
          <button
            onClick={handleNext}
            className="absolute right-4 md:right-8 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full p-2 z-10"
            aria-label="Selanjutnya"
            tabIndex={0}
          >
            <svg width={22} height={22} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" strokeWidth={2}/></svg>
          </button>
        </div>
      </motion.div>
      {/* Dot indicator moved outside */}
      <div className="flex gap-2 justify-center mt-2 mb-4">
        {MOTIVATION_QUOTES.map((_, i) => (
          <span
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-200
              ${index === i ? "bg-blue-500" : "bg-gray-300"}`}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 card-hover"
      >
        <motion.h3 
          className="text-lg font-semibold text-gray-900 mb-4"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          Aksi Cepat
        </motion.h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, idx) =>
            action.external ? (
              <a
                key={action.label}
                href={action.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 1.3 + idx * 0.1 }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`${action.color} ${action.hoverColor} text-white p-4 rounded-lg cursor-pointer transition-all duration-300 btn-hover-lift`}
                >
                  <motion.div 
                    className="flex flex-col items-center space-y-2"
                    whileHover={{ y: -2 }}
                  >
                    <action.icon className="h-6 w-6" />
                    <span className="text-sm font-medium text-center">{action.label}</span>
                  </motion.div>
                </motion.div>
              </a>
            ) : (
              <Link href={action.href} key={action.label} className="block">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 1.3 + idx * 0.1 }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`${action.color} ${action.hoverColor} text-white p-4 rounded-lg cursor-pointer transition-all duration-300 btn-hover-lift`}
                >
                  <motion.div 
                    className="flex flex-col items-center space-y-2"
                    whileHover={{ y: -2 }}
                  >
                    <action.icon className="h-6 w-6" />
                    <span className="text-sm font-medium text-center">{action.label}</span>
                  </motion.div>
                </motion.div>
              </Link>
            )
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
