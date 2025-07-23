'use client'

import dynamic from 'next/dynamic'

// SSR dimatikan agar bisa diexport sebagai static page
const DashboardPage = dynamic(() => import('./dashboard-page'), {
  ssr: false,
})

export default function Page() {
  return <DashboardPage />
}
