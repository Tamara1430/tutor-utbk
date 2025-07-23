'use client'

import { Home, FileText, Play, History, User as UserIcon, X , Brain} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname()
  const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/UserDashboard' },
  { icon: FileText, label: 'Bank Soal', path: '/UserDashboard/Bank-Soal' },
  { icon: Play, label: 'Video', path: '/UserDashboard/video-learning' },
  { icon: History, label: 'Histori', path: '/UserDashboard/exam-history' },
  { icon: Brain, label: 'Plan Upgrade', path: '/UserDashboard/Plan' },
  { icon: UserIcon, label: 'Profil', path: '/UserDashboard/profile' },
  
]

  return (
    <>
      {/* Overlay */}
      <div
        className={`
          fixed inset-0 bg-black/40 z-40 transition-opacity duration-300
          ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setSidebarOpen(false)}
      />
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 shadow-lg
        transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-64'}
      `}>
        {/* Tombol close */}
        <div className="flex items-center justify-between h-16 border-b px-4">
          <span className="font-bold text-lg">Menu</span>
          <button onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col py-6">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = pathname === item.path
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`
                  flex items-center gap-3 px-6 py-3 text-gray-700 rounded-lg mb-2 transition
                  ${active ? 'bg-blue-50 font-bold text-blue-700' : 'hover:bg-gray-100'}
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
