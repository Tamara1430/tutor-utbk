'use client'
import React, { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import "./SubtestSelector.css"

const subtestList = [
  "Penalaran Umum",
  "Pemahaman Bacaan dan Menulis",
  "Pengetahuan dan Pemahaman Umum",
  "Pengetahuan Kuantitatif",
  "Literasi dalam Bahasa Indonesia",
  "Literasi dalam Bahasa Inggris",
  "Penalaran Matematika"
]

export default function SubtestSelector() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sesi = searchParams.get("sesi")

  useEffect(() => {
    if (!sesi) {
      alert("Pilih sesi dulu!")
      window.location.href = "/TutorDashboard/pilihSesi"
    }
  }, [sesi])

  const handleClick = (subtest: string) => {
    router.push(`/TutorDashboard/editSoal?sesi=${encodeURIComponent(sesi || "")}&subtest=${encodeURIComponent(subtest)}`)
  }

  return (
    <div className="subtest-root">
      <div className="subtest-card">
        <h2 className="subtest-title">Pilih Subtest</h2>
        <p className="subtest-desc">
          Pilih subtest yang ingin kamu kelola untuk <span className="subtest-sesi">{sesi}</span>
        </p>
        <div className="subtest-btn-list">
          {subtestList.map((subtest) => (
            <button
              key={subtest}
              className="subtest-btn"
              onClick={() => handleClick(subtest)}
              type="button"
            >
              {subtest}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
