import '../globals.css'
import ClientLayout from '@/components/ClientLayout'

export const metadata = {
  title: 'StudyPlatform',
  description: 'UTBK, Tryout, Video Pembelajaran',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
