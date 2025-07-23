'use client'

import React, { useState, useEffect } from "react"
import {
  collection,
  getDocs,
  doc,
  getDoc
} from "firebase/firestore"
import { db, auth, storage } from "../firebase/config"
import { ref, uploadBytes } from "firebase/storage"
import "../soal-utbk/App.css"

interface QuestionOption {
  label: string
  text: string
}
interface UnderstandingArgOption {
  text: string
  type: "memperkuat" | "memperlemah"
}
interface Question {
  statement: string
  type: "multipleChoice" | "shortAnswer" | "understandingArguments"
  options?: QuestionOption[] | UnderstandingArgOption[]
  answer?: string
}
interface InfoAlertProps {
  show: boolean
  type?: "info" | "warning" | "success" | "error"
  message: string
  onClose: () => void
}
function InfoAlert({ show, type = "info", message, onClose }: InfoAlertProps) {
  if (!show) return null
  return (
    <div className={`custom-alert custom-alert-${type}`}>
      <span>{message}</span>
      <button className="close-alert" onClick={onClose}>
        ✖
      </button>
      <style jsx>{`
        .custom-alert {
          position: fixed;
          top: 22px;
          left: 0;
          right: 0;
          margin: 0 auto;
          width: 80%;
          max-width: 350px;
          padding: 0.9rem 1.5rem;
          border-radius: 10px;
          font-weight: 500;
          z-index: 9999;
          box-shadow: 0 4px 16px 0 rgba(60, 100, 255, 0.06);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: "Inter", sans-serif;
        }
        .custom-alert-info { background: #e0eaff; color: #2563eb; }
        .custom-alert-warning { background: #fff7df; color: #ad7200; }
        .custom-alert-success { background: #e6ffdf; color: #187a12; }
        .custom-alert-error { background: #ffe3e3; color: #e03131; }
        .close-alert {
          background: none;
          border: none;
          font-size: 1.2rem;
          color: inherit;
          cursor: pointer;
          margin-left: 1rem;
        }
      `}</style>
    </div>
  )
}
function getQueryParam(param: string) {
  if (typeof window === "undefined") return null
  const url = new URL(window.location.href)
  return url.searchParams.get(param)
}
async function fetchUsernameFromFirestore(tutorId: string | null, userUid: string | null) {
  if (!tutorId || !userUid) return "user"
  const userDocRef = doc(db, "tutor", tutorId, "user", userUid)
  const userSnap = await getDoc(userDocRef)
  if (!userSnap.exists()) return "user"
  const data = userSnap.data()
  return data.username || "user"
}
async function getCorrectAnswersFromFirestore({
  tutorId, selectedSesi, subtest
}: { tutorId: string, selectedSesi: string, subtest: string }) {
  const subtestDocRef = doc(
    db,
    "tutor",
    tutorId,
    "Soal",
    selectedSesi,
    "subtest",
    subtest
  )
  const subtestSnap = await getDoc(subtestDocRef)
  if (!subtestSnap.exists()) return []
  const data = subtestSnap.data()
  return (data.questions || []).map((q: any) => q.answer)
}
async function uploadExamResultWithScore({
  answers,
  sesi,
  subtest,
  userUid,
  tutorId,
  score,
  correctCount,
  totalQuestions
}: {
  answers: Record<number, any>
  sesi: string
  subtest: string
  userUid: string | null
  tutorId: string | null
  score: number
  correctCount: number
  totalQuestions: number
}) {
  const username = await fetchUsernameFromFirestore(tutorId, userUid)
  const fileName = `final_${username}_${sesi}_${subtest.replace(/\s+/g, "_")}.json`
  const fileRef = ref(storage, `JawabanUser/${username}/sesi/${sesi}/${fileName}`)
  const payload = {
    sesi,
    subtest,
    user: username,
    timestamp: new Date().toISOString(),
    answers,
    result: {
      correct: correctCount,
      total: totalQuestions,
      score: score
    },
    status: "final"
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })
  await uploadBytes(fileRef, blob)
  return true
}

function toAnswerString(arr: any[]) {
  return Array.isArray(arr) ? arr.join(",") : ""
}

export default function ExamPage() {
  const [sesiList, setSesiList] = useState<string[]>([])
  const [selectedSesi, setSelectedSesi] = useState<string>("")
  const subtest =
    typeof window !== "undefined"
      ? getQueryParam("subtest") || "Penalaran Umum"
      : "Penalaran Umum"
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedQuestion, setSelectedQuestion] = useState<number>(1)
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<number, boolean>>({})
  const [answers, setAnswers] = useState<Record<number, any>>({})
  const [timer, setTimer] = useState<number>(30 * 60)
  const [timeoutAlert, setTimeoutAlert] = useState<boolean>(false)
  const [userName, setUserName] = useState<string>("User")
  const [userEmail, setUserEmail] = useState<string>("")
  const [endExamLoading, setEndExamLoading] = useState<boolean>(false)
  const [endExamSuccess, setEndExamSuccess] = useState<boolean>(false)
  const [userUid, setUserUid] = useState<string | null>("")
  const [tutorId, setTutorId] = useState<string | null>("")
  const [isExamSubmitted, setIsExamSubmitted] = useState(false)
  const [lastScore, setLastScore] = useState(0)
  const [lastCorrectCount, setLastCorrectCount] = useState(0)

  useEffect(() => {
    const fetchSesi = async () => {
      const _tutorId =
        typeof window !== "undefined"
          ? localStorage.getItem("tutor_uid")
          : null
      setTutorId(_tutorId)
      if (!_tutorId) return
      const soalColRef = collection(db, "tutor", _tutorId, "Soal")
      const snap = await getDocs(soalColRef)
      const sesiArr = snap.docs.map(doc => doc.id)
      setSesiList(sesiArr)
      if (sesiArr.length > 0) setSelectedSesi(sesiArr[0])
    }
    fetchSesi()
  }, [])
  useEffect(() => {
    const _userUid =
      typeof window !== "undefined"
        ? localStorage.getItem("user_uid")
        : null
    setUserUid(_userUid)
  }, [])
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true)
      setQuestions([])
      setAnsweredQuestions({})
      setAnswers({})
      setSelectedQuestion(1)
      setTimer(30 * 60)
      const user = auth.currentUser
      if (!user) {
        alert("Silakan login dulu.")
        window.location.href = "/"
        return
      }
      setUserName(user.email || "User")
      setUserEmail(user.email || "")
      if (!tutorId) return
      if (!selectedSesi || !subtest) return
      const subtestDocRef = doc(
        db,
        "tutor",
        tutorId,
        "Soal",
        selectedSesi,
        "subtest",
        subtest
      )
      const subtestSnap = await getDoc(subtestDocRef)
      if (!subtestSnap.exists()) {
        alert("Subtest tidak ditemukan.")
        setLoading(false)
        return
      }
      const data = subtestSnap.data()
      setQuestions(data.questions || [])
      if (data.duration) setTimer(data.duration * 60)
      else setTimer(30 * 60)
      setLoading(false)
    }
    if (tutorId && selectedSesi && subtest) fetchQuestions()
  }, [tutorId, selectedSesi, subtest])
  useEffect(() => {
    if (loading || timeoutAlert || timer <= 0 || isExamSubmitted) return
    const countdown = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(countdown)
          setTimeoutAlert(true)
          if (!isExamSubmitted) {
            handleEndExam(true)
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(countdown)
  }, [loading, timeoutAlert, timer, isExamSubmitted])

  const isAnswered = (idx: number) => {
    const q = questions[idx]
    const a = answers[idx]
    if (!q) return false
    if (q.type === "multipleChoice") return !!a
    if (q.type === "shortAnswer") return !!a && String(a).trim() !== ""
    if (q.type === "understandingArguments" && Array.isArray(q.options))
      return Array.isArray(a) && a.length === q.options.length && a.every(val => val === "memperlemah" || val === "memperkuat")
    return false
  }
  const isSaveEnabled = isAnswered(selectedQuestion - 1)
  const isAllAnswered = questions.length > 0 && questions.every((_, idx) => isAnswered(idx))
  const handleSaveAndNext = () => {
    setAnsweredQuestions(prev => ({
      ...prev,
      [selectedQuestion]: true
    }))
    if (selectedQuestion < questions.length) {
      setSelectedQuestion(prev => prev + 1)
    }
  }
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`
  }
  const handleEndExam = async (fromTimeout = false) => {
    setEndExamLoading(true)
    setIsExamSubmitted(true)
    const userAnswersProcessed: Record<number, string> = {}
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      const a = answers[i]
      if (q && q.type === "understandingArguments") {
        userAnswersProcessed[i] = toAnswerString(a)
      } else {
        userAnswersProcessed[i] = a
      }
    }
    let correctAnswers: string[] = []
    if (tutorId && selectedSesi && subtest) {
      correctAnswers = await getCorrectAnswersFromFirestore({
        tutorId,
        selectedSesi,
        subtest
      })
    }
    let correctCount = 0
    for (let i = 0; i < correctAnswers.length; i++) {
      const q = questions[i]
      if (!q || !correctAnswers[i]) continue
      if (q.type === "multipleChoice" || q.type === "shortAnswer") {
        if (userAnswersProcessed[i] && userAnswersProcessed[i] === correctAnswers[i]) correctCount++
      }
      if (q.type === "understandingArguments") {
        if (userAnswersProcessed[i] && userAnswersProcessed[i] === correctAnswers[i]) correctCount++
      }
    }
    const score = Number((correctCount / 70 * 100).toFixed(2))
    setLastScore(score)
    setLastCorrectCount(correctCount)
    await uploadExamResultWithScore({
      answers: userAnswersProcessed,
      sesi: selectedSesi,
      subtest,
      userUid,
      tutorId,
      score,
      correctCount,
      totalQuestions: correctAnswers.length
    })
    setEndExamLoading(false)
    setEndExamSuccess(true)
    if (!fromTimeout) {
      setTimeout(() => {
        window.location.href = "/UserDashboard"
      }, 1800)
    }
  }

  const currentQuestion = questions[selectedQuestion - 1]
  return (
    <>
      <InfoAlert
        show={timeoutAlert}
        type="info"
        message="Waktu habis. Jawabanmu sudah tersimpan."
        onClose={() => {
          setTimeoutAlert(false)
          window.location.href = "/UserDashboard"
        }}
      />
      <InfoAlert
        show={endExamSuccess}
        type="success"
        message={`Jawaban berhasil disimpan. Ujian selesai!\nSkor: ${lastScore} (${lastCorrectCount} benar)`}
        onClose={() => {
          setEndExamSuccess(false)
          window.location.href = "/UserDashboard"
        }}
      />
      <div className="mobile-header-user">
        <div>{userName}</div>
        <div className="mobile-header-info">{subtest}</div>
        <div className="mobile-header-info2">{selectedSesi}</div>
      </div>
      <div className="exam-layout">
        <aside className="exam-sidebar">
          <div className="sidebar-header">
            <span className="sidebar-user">{userName}</span>
            <span className="sidebar-info">{subtest}</span>
            <span className="sidebar-info2">{selectedSesi}</span>
          </div>
          <div className="sidebar-progress">
            <div className="sidebar-progress-label">
              {Object.values(answeredQuestions).filter(Boolean).length} dari {questions.length} Soal dijawab
            </div>
            <div className="sidebar-toggle-grid">
              {questions.map((_, index) => (
                <button
                  key={index + 1}
                  className={`sidebar-toggle-btn ${
                    selectedQuestion === index + 1
                      ? "active"
                      : answeredQuestions[index + 1]
                      ? "answered"
                      : ""
                  }`}
                  onClick={() => setSelectedQuestion(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <button
              className="sidebar-endexam-btn"
              style={{
                marginTop: 24,
                width: "100%",
                background: "#e03131",
                color: "#fff",
                padding: "0.7rem 0",
                border: "none",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 16,
                cursor: !isAllAnswered || endExamLoading || isExamSubmitted ? "not-allowed" : "pointer",
                opacity: !isAllAnswered || endExamLoading || isExamSubmitted ? 0.6 : 1,
                transition: "all .2s"
              }}
              disabled={!isAllAnswered || endExamLoading || isExamSubmitted}
              onClick={() => handleEndExam(false)}
            >
              {endExamLoading ? "Menyimpan..." : "Akhiri Ujian"}
            </button>
          </div>
        </aside>
        <main className="exam-main">
          <div className="exam-headerbar">
            <div className="exam-header-info">
              <div>Nomor Soal</div>
              <div>{selectedQuestion}</div>
            </div>
            <div className="exam-header-right">
              <span>{formatTime(timer)}</span>
              <span>Terhitung</span>
            </div>
          </div>
          <div className="exam-content">
            {loading ? (
              <div style={{ minHeight: 400, textAlign: "center" }}>
                Loading...
              </div>
            ) : currentQuestion ? (
              <>
                <div className="exam-question-statement">
                  {currentQuestion.statement}
                </div>
                {currentQuestion.type === "multipleChoice" && currentQuestion.options && (
                  <div className="exam-multichoice-list">
                    {(currentQuestion.options as QuestionOption[]).map((opt, idx) => (
                      <label
                        key={idx}
                        className="exam-multichoice-item"
                        style={{
                          borderColor:
                            answers[selectedQuestion - 1] === opt.label
                              ? "#2372d9"
                              : "#dbe6f6",
                          background:
                            answers[selectedQuestion - 1] === opt.label
                              ? "#e8f2fd"
                              : "#f8fafd"
                        }}
                      >
                        <input
                          type="radio"
                          name={`q${selectedQuestion}`}
                          value={opt.label}
                          checked={answers[selectedQuestion - 1] === opt.label}
                          onChange={() => {
                            setAnswers(prev => ({
                              ...prev,
                              [selectedQuestion - 1]: opt.label
                            }))
                          }}
                          style={{ marginRight: 6 }}
                        />
                        {opt.label}. {opt.text}
                      </label>
                    ))}
                  </div>
                )}
                {currentQuestion.type === "shortAnswer" && (
                  <input
                    type="text"
                    value={answers[selectedQuestion - 1] || ""}
                    onChange={e => {
                      setAnswers(prev => ({
                        ...prev,
                        [selectedQuestion - 1]: e.target.value
                      }))
                    }}
                    placeholder="Jawaban..."
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginTop: "10px"
                    }}
                  />
                )}
                {currentQuestion.type === "understandingArguments" && Array.isArray(currentQuestion.options) && (
                  <div style={{overflowX:"auto"}}>
                    <table style={{ width: "100%", borderCollapse: "collapse", margin: "24px 0" }}>
                      <thead>
                        <tr style={{ background: "#f6fafd" }}>
                          <th style={{ textAlign: "left", padding: 8, fontWeight: 600 }}>Pernyataan</th>
                          <th style={{ textAlign: "center", fontWeight: 600, width: 150 }}>Memperlemah</th>
                          <th style={{ textAlign: "center", fontWeight: 600, width: 150 }}>Memperkuat</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(currentQuestion.options as UnderstandingArgOption[]).map((opt, opsiIdx) => (
                          <tr key={opsiIdx} style={{ borderBottom: "1px solid #eef2f7" }}>
                            <td style={{ padding: 8 }}>{opt.text}</td>
                            <td style={{ textAlign: "center" }}>
                              <input
                                type="radio"
                                name={`argumen_${selectedQuestion}_${opsiIdx}`}
                                value="memperlemah"
                                checked={answers[selectedQuestion - 1]?.[opsiIdx] === "memperlemah"}
                                onChange={() => {
                                  setAnswers(prev => {
                                    const q = questions[selectedQuestion - 1]
                                    const opts = Array.isArray(q.options) ? q.options.length : 0
                                    const current = prev[selectedQuestion - 1] && Array.isArray(prev[selectedQuestion - 1])
                                      ? [...prev[selectedQuestion - 1]]
                                      : Array(opts).fill("")
                                    current[opsiIdx] = "memperlemah"
                                    return { ...prev, [selectedQuestion - 1]: current }
                                  })
                                }}
                              />
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <input
                                type="radio"
                                name={`argumen_${selectedQuestion}_${opsiIdx}`}
                                value="memperkuat"
                                checked={answers[selectedQuestion - 1]?.[opsiIdx] === "memperkuat"}
                                onChange={() => {
                                  setAnswers(prev => {
                                    const q = questions[selectedQuestion - 1]
                                    const opts = Array.isArray(q.options) ? q.options.length : 0
                                    const current = prev[selectedQuestion - 1] && Array.isArray(prev[selectedQuestion - 1])
                                      ? [...prev[selectedQuestion - 1]]
                                      : Array(opts).fill("")
                                    current[opsiIdx] = "memperkuat"
                                    return { ...prev, [selectedQuestion - 1]: current }
                                  })
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="exam-action">
                  <button className="exam-next-btn"
                    onClick={() => {
                      setAnsweredQuestions(prev => ({
                        ...prev,
                        [selectedQuestion]: true
                      }))
                      handleSaveAndNext()
                    }}
                    disabled={!isSaveEnabled || isExamSubmitted}
                    style={{
                      background: isSaveEnabled ? "#2372d9" : "#aaa",
                      color: "#fff",
                      opacity: isSaveEnabled ? 1 : 0.65,
                      cursor: isSaveEnabled ? "pointer" : "not-allowed"
                    }}
                  >
                    Simpan & Lanjutkan
                  </button>
                </div>
                <div className="mobile-exam-actions">
                  <div className="question-toggle-mobile">
                    {questions.map((_, index) => (
                      <button
                        key={index + 1}
                        className={`toggle-btn-mobile ${
                          selectedQuestion === index + 1
                            ? "active"
                            : answeredQuestions[index + 1]
                            ? "answered"
                            : ""
                        }`}
                        onClick={() => setSelectedQuestion(index + 1)}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    className="sidebar-endexam-btn"
                    style={{
                      background: "#e03131",
                      color: "#fff",
                      padding: "0.7rem 0",
                      border: "none",
                      borderRadius: 8,
                      fontWeight: 600,
                      fontSize: 16,
                      cursor: !isAllAnswered || endExamLoading || isExamSubmitted ? "not-allowed" : "pointer",
                      opacity: !isAllAnswered || endExamLoading || isExamSubmitted ? 0.6 : 1,
                      width: "100%",
                      marginTop: 18
                    }}
                    disabled={!isAllAnswered || endExamLoading || isExamSubmitted}
                    onClick={() => handleEndExam(false)}
                  >
                    {endExamLoading ? "Menyimpan..." : "Akhiri Ujian"}
                  </button>
                </div>
              </>
            ) : (
              <div>Soal tidak ditemukan.</div>
            )}
          </div>
        </main>
      </div>
      <style jsx global>{`
        @media (max-width: 640px) {
          .mobile-exam-actions {
            display: block;
            margin-top: 20px;
          }
          .exam-sidebar {
            display: none !important;
          }
          .question-toggle-mobile {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 10px;
            margin: 14px 0 12px 0;
            border-radius: 8px;
            background: #f7f7fc;
            box-shadow: 0 1px 6px #eee;
            padding: 12px 0;
          }
          .toggle-btn-mobile {
            width: 40px;
            height: 40px;
            border-radius: 7px;
            border: 1.5px solid #d8e1ec;
            background: #f6fafd;
            color: #333;
            font-weight: bold;
            font-size: 1.07em;
            transition: all .17s;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            outline: none;
          }
          .toggle-btn-mobile.active {
            background: #0275d8;
            color: #fff;
            border-color: #0275d8;
          }
          .toggle-btn-mobile.answered {
            background: #0dcc81;
            color: #fff;
            border-color: #0dcc81;
          }
        }
        @media (min-width: 641px) {
          .mobile-exam-actions,
          .question-toggle-mobile,
          .mobile-header-user,
          .mobile-header-info,
          .mobile-header-info2 {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}
