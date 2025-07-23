'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  Trophy, 
  Target, 
  BookOpen, 
  TrendingUp,
  Star,
  Play,
  FileText,
  Award,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Dashboard() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  // Data dummy untuk demonstrasi
  const userStats = {
    name: "Ahmad Rizki",
    level: 15,
    exp: 2450,
    maxExp: 3000,
    totalTryouts: 24,
    averageScore: 85,
    studyStreak: 7
  }

  const recentActivities = [
    { id: 1, type: 'tryout', title: 'Tryout Matematika Dasar', score: 88, date: '2 jam lalu' },
    { id: 2, type: 'video', title: 'Integral dan Diferensial', duration: '45 menit', date: '1 hari lalu' },
    { id: 3, type: 'tryout', title: 'Tryout Bahasa Indonesia', score: 92, date: '2 hari lalu' },
  ]

  const upcomingTryouts = [
    { id: 1, title: 'Tryout Fisika Lanjutan', date: 'Besok, 14:00', difficulty: 'Sulit' },
    { id: 2, title: 'Tryout Kimia Organik', date: '3 hari lagi', difficulty: 'Sedang' },
  ]

  const expPercentage = (userStats.exp / userStats.maxExp) * 100

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
        type: "spring" as const,
        stiffness: 100,
        damping: 12
      }
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
        {/* Animated background elements */}
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
        <motion.div
          className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full"
          animate={{ 
            scale: [1, 1.1, 1],
            x: [0, 10, 0],
            y: [0, -10, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <div className="flex items-center justify-between relative z-10">
          <div>
            <motion.h1 
              className="text-2xl font-bold mb-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Selamat datang kembali, {userStats.name}! 👋
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
          <motion.div 
            className="hidden md:block"
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center animate-float">
              <Trophy className="h-10 w-10 text-yellow-300" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Level & EXP Card */}
        <motion.div
          variants={itemVariants}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
          }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 card-hover relative overflow-hidden"
        >
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-50"
            animate={{ 
              background: [
                "linear-gradient(45deg, rgba(147, 51, 234, 0.1), transparent)",
                "linear-gradient(135deg, rgba(147, 51, 234, 0.1), transparent)",
                "linear-gradient(225deg, rgba(147, 51, 234, 0.1), transparent)",
                "linear-gradient(315deg, rgba(147, 51, 234, 0.1), transparent)"
              ]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Level</p>
                <motion.p 
                  className="text-2xl font-bold text-gray-900"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {userStats.level}
                </motion.p>
              </div>
              <motion.div 
                className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Star className="h-6 w-6 text-purple-600" />
              </motion.div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">EXP</span>
                <span className="font-medium">{userStats.exp}/{userStats.maxExp}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 progress-bar">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${expPercentage}%` }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                  className="bg-purple-600 h-2 rounded-full relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Total Tryouts */}
        <motion.div
          variants={itemVariants}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
          }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 card-hover"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tryout</p>
              <motion.p 
                className="text-2xl font-bold text-gray-900"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
              >
                {userStats.totalTryouts}
              </motion.p>
            </div>
            <motion.div 
              className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
              whileHover={{ 
                scale: 1.1,
                boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)"
              }}
            >
              <FileText className="h-6 w-6 text-blue-600" />
            </motion.div>
          </div>
        </motion.div>

        {/* Average Score */}
        <motion.div
          variants={itemVariants}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
          }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 card-hover"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rata-rata Nilai</p>
              <motion.p 
                className="text-2xl font-bold text-gray-900"
                animate={{ 
                  color: ["#111827", "#10B981", "#111827"]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {userStats.averageScore}
              </motion.p>
            </div>
            <motion.div 
              className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"
              animate={{ 
                y: [0, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <TrendingUp className="h-6 w-6 text-green-600" />
            </motion.div>
          </div>
        </motion.div>

        {/* Study Streak */}
        <motion.div
          variants={itemVariants}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
          }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 card-hover"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Streak Belajar</p>
              <motion.p 
                className="text-2xl font-bold text-gray-900"
                animate={{ 
                  textShadow: [
                    "0 0 0px rgba(251, 146, 60, 0)",
                    "0 0 10px rgba(251, 146, 60, 0.5)",
                    "0 0 0px rgba(251, 146, 60, 0)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {userStats.studyStreak} hari
              </motion.p>
            </div>
            <motion.div 
              className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center"
              animate={{ 
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Target className="h-6 w-6 text-orange-600" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content Grid */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Recent Activities */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200 card-hover"
        >
          <motion.h3 
            className="text-lg font-semibold text-gray-900 mb-4"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Aktivitas Terbaru
          </motion.h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
                }}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 cursor-pointer"
              >
                <motion.div 
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activity.type === 'tryout' ? 'bg-blue-100' : 'bg-green-100'
                  }`}
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 5
                  }}
                >
                  {activity.type === 'tryout' ? (
                    <FileText className={`h-5 w-5 ${activity.type === 'tryout' ? 'text-blue-600' : 'text-green-600'}`} />
                  ) : (
                    <Play className="h-5 w-5 text-green-600" />
                  )}
                </motion.div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{activity.title}</h4>
                  <p className="text-sm text-gray-600">
                    {activity.score ? `Nilai: ${activity.score}` : `Durasi: ${activity.duration}`} • {activity.date}
                  </p>
                </div>
                {activity.score && (
                  <motion.div 
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      activity.score >= 90 ? 'bg-green-100 text-green-800' :
                      activity.score >= 80 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {activity.score >= 90 ? 'Excellent' : activity.score >= 80 ? 'Good' : 'Needs Improvement'}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Tryouts */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 card-hover"
        >
          <motion.h3 
            className="text-lg font-semibold text-gray-900 mb-4"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            Tryout Mendatang
          </motion.h3>
          <div className="space-y-4">
            {upcomingTryouts.map((tryout, index) => (
              <motion.div
                key={tryout.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 1.1 + index * 0.1 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
                }}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-all duration-300 cursor-pointer"
              >
                <h4 className="font-medium text-gray-900 mb-2">{tryout.title}</h4>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                  <Clock className="h-4 w-4" />
                  <span>{tryout.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <motion.span 
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tryout.difficulty === 'Sulit' ? 'bg-red-100 text-red-800' :
                      tryout.difficulty === 'Sedang' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {tryout.difficulty}
                  </motion.span>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button size="sm" className="btn-hover-lift">
                      Mulai
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="mt-6"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              variant="outline" 
              className="w-full btn-hover-lift"
            >
              Lihat Semua Latihan Soal
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

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
          {[
            { icon: FileText, label: 'Mulai Tryout', color: 'bg-blue-500', hoverColor: 'hover:bg-blue-600' },
            { icon: Play, label: 'Tonton Video', color: 'bg-green-500', hoverColor: 'hover:bg-green-600' },
            { icon: BookOpen, label: 'Baca Materi', color: 'bg-purple-500', hoverColor: 'hover:bg-purple-600' },
            { icon: Award, label: 'Lihat Prestasi', color: 'bg-orange-500', hoverColor: 'hover:bg-orange-600' },
          ].map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 1.3 + index * 0.1 }}
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
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

