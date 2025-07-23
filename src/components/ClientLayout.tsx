'use client'

import { useState } from 'react'
import Header from './HeaderDashboard'
import Sidebar from './Sidebar'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <>
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {/* Main tanpa padding kiri */}
      <main className="pt-16 min-h-screen bg-gray-50 px-2 md:px-6 transition-all">
        {children}
      </main>
    </>
  )
}
