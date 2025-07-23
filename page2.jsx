'use client'

import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import './App.css'

// Import komponen halaman
import Dashboard from './pages/Dashboard'
import Tryout from './pages/Tryout'
import VideoLearning from './pages/VideoLearning'
import ExamHistory from './pages/ExamHistory'
import Profile from './pages/Profile'

// Import komponen layout
import Header from './src/app/UserDashboard/components/page'
import Sidebar from './src/app/UserDashboard/components/Sidebar'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
        />
        
        <div className="flex">
          <Sidebar 
            sidebarOpen={sidebarOpen} 
            setSidebarOpen={setSidebarOpen} 
          />
          
          <main className="flex-1 lg:ml-64 pt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 lg:p-6"
            >
              <Routes>
                <Route path="/component/Header" element={<Header />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tryout" element={<Tryout />} />
                <Route path="/video-learning" element={<VideoLearning />} />
                <Route path="/exam-history" element={<ExamHistory />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </motion.div>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App

