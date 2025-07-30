aimport type { ReactNode } from 'react';
import './globals.css';
import { PaketKelasProvider } from '@/app/context/PaketKelasContext'; // ⬅️ Import Provider saja

export const metadata = {
  title: 'Platform Belajar UTBK',
  description: 'UTBK, Tryout, Video Pembelajaran',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body>
        <PaketKelasProvider>
          {children}
        </PaketKelasProvider>
      </body>
    </html>
  );
}
