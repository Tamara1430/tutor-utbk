'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

type PaketDoc = {
  id: string
  title: string
  price: number
  benefit: string[]
  description: string
  marking?: string
}

const paketOrder = ['Gratis', 'Premium', 'Enterprise']

export default function PaketKelasCard() {
  const [paket, setPaket] = useState<PaketDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [tutorUid, setTutorUid] = useState<string | null>(null)

  useEffect(() => {
    const tutorId =
      typeof window !== 'undefined' ? localStorage.getItem('tutor_uid') : null
    setTutorUid(tutorId)
  }, [])

  useEffect(() => {
    if (!tutorUid) return
    const fetchPaket = async () => {
      setLoading(true)
      const ref = collection(db, 'tutor', tutorUid, 'dashboard', 'main', 'paketKelas')
      const snap = await getDocs(ref)
      let docs: PaketDoc[] = snap.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          title: data.title || 'Tanpa Judul',
          price: typeof data.price === "number" ? data.price : (parseInt(data.price) || 0),
          benefit: Array.isArray(data.benefit) ? data.benefit : [],
          description: data.description || '',
          marking: data.marking || ''
        }
      })
      // Sort manual sesuai urutan yang diinginkan
      docs = docs.sort((a, b) => {
        const ai = paketOrder.indexOf(a.title)
        const bi = paketOrder.indexOf(b.title)
        // Jika tidak ada di paketOrder, urutkan di belakang
        return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
      })
      setPaket(docs)
      setLoading(false)
    }
    fetchPaket()
  }, [tutorUid])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  }
  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  if (!tutorUid) {
    return (
      <div className="py-20 text-center text-gray-400">
        UID tutor tidak ditemukan.<br />Pastikan sudah login dan localStorage tersedia.
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full min-h-[50vh] flex flex-col items-center py-8"
    >
      <motion.div
        variants={cardVariants}
        className="mb-8 text-center max-w-xl"
      >
        <h1 className="text-3xl font-extrabold text-green-700 mb-2">
          Upgrade Paket Kelas
        </h1>
        <p className="text-gray-500 text-base">
          Pilih paket belajar yang sesuai kebutuhanmu. Dapatkan fitur premium!
        </p>
      </motion.div>
      {loading ? (
        <div className="py-20 text-center text-gray-400">Memuat data paket...</div>
      ) : paket.length === 0 ? (
        <div className="text-gray-400 text-lg font-bold">Tidak ada paket ditemukan</div>
      ) : (
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-7 w-full max-w-5xl px-3"
        >
          {paket.map(pkg => (
            <motion.div
              variants={cardVariants}
              key={pkg.id}
              whileHover={{ scale: 1.045, boxShadow: "0 16px 48px 0 rgba(60,180,120,0.13)" }}
              className={`
                group relative flex flex-col items-center rounded-2xl
                transition-all duration-200 ease-in-out 
                bg-white shadow-xl border-2
                ${pkg.marking === "Paling Populer"
                  ? "border-green-400 ring-2 ring-green-300 scale-105 z-10"
                  : "border-gray-200"
                }
                px-6 pt-9 pb-8
                hover:shadow-2xl hover:-translate-y-1
              `}
            >
              {pkg.marking && (
                <span className={`absolute top-5 right-5 px-3 py-1 rounded-full text-xs font-bold shadow 
                  ${pkg.marking === "Paling Populer"
                    ? "bg-green-500 text-white"
                    : "bg-blue-100 text-blue-700"
                  }
                `}>{pkg.marking}</span>
              )}
              <div className={`mb-3 rounded-xl bg-gradient-to-br flex items-center justify-center
                ${pkg.marking === "Paling Populer" ? "from-green-300 to-green-500" : "from-gray-200 to-blue-100"}
                w-14 h-14 shadow-lg
              `}>
                <Star className={pkg.marking === "Paling Populer" ? "text-white" : "text-green-400"} size={30} />
              </div>
              <div className={`text-xl font-bold mb-1
                ${pkg.marking === "Paling Populer" ? "text-green-700" : "text-gray-800"}
              `}>
                {pkg.title}
              </div>
              <div className={`text-3xl font-extrabold mb-5
                ${pkg.marking === "Paling Populer" ? "text-green-600" : "text-blue-600"}
              `}>
                {`Rp ${pkg.price.toLocaleString("id-ID")}`}
              </div>
              <ul className="mb-7 w-full text-gray-600 space-y-2 text-base">
                {(Array.isArray(pkg.benefit) ? pkg.benefit : []).map((feat, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <svg className="h-5 w-5 text-green-400 mt-1.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`
                  w-full py-3 rounded-lg font-bold transition-all
                  ${pkg.marking === "Paling Populer"
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-gray-100 hover:bg-green-100 text-green-700"
                  }
                  shadow-md group-hover:scale-105
                `}
                onClick={() => alert(`Kamu memilih paket: ${pkg.title}`)}
              >
                Pilih Paket
              </Button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}
