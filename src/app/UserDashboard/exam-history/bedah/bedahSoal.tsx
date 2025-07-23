"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc
} from "firebase/firestore";
import { db } from "../../../firebase/config";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../../firebase/config";

type MultipleChoiceOption = { label: string; text: string };
type UnderstandingArgOption = { text: string; type: "memperkuat" | "memperlemah" };
type QuestionType = "multipleChoice" | "shortAnswer" | "understandingArguments";
interface BaseQuestion {
  type: QuestionType;
  statement: string;
  answer: string;
  penjelasan: string;
}
interface MultipleChoiceQuestion extends BaseQuestion {
  type: "multipleChoice";
  options: MultipleChoiceOption[];
}
interface ShortAnswerQuestion extends BaseQuestion {
  type: "shortAnswer";
  options: [];
}
interface UnderstandingArgumentsQuestion extends BaseQuestion {
  type: "understandingArguments";
  options: UnderstandingArgOption[];
}
type Question = MultipleChoiceQuestion | ShortAnswerQuestion | UnderstandingArgumentsQuestion;

// Jawaban user yang diambil dari file JSON
type UserAnswer = string | null;

interface UserAnswersFile {
  answers: UserAnswer[]; // urut sesuai index soal
}

export default function Page() {
  const params = useSearchParams();
  const sesi = params.get("sesi") || "";      // Premium/dst
  const subtest = params.get("subtest") || ""; // Penalaran Umum/dst
  const username = "Titan Samuel"; // Bisa ganti ke dynamic login
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Ambil soal dari Firestore
  useEffect(() => {
    if (!sesi || !subtest) return;
    setLoading(true);
    setErr(null);

    async function fetchQuestionsAndUserAnswer() {
      try {
        // --- Cari docId tutor yang punya subtest ini (ambil satu tutor saja untuk viewer umum) ---
        const tutorSnap = await getDocs(collection(db, "tutor"));
        let found = false;
        for (const tutorDoc of tutorSnap.docs) {
          const tutorId = tutorDoc.id;
          const subtestDocRef = doc(db, "tutor", tutorId, "Soal", sesi, "subtest", subtest);
          const subtestDocSnap = await getDoc(subtestDocRef);
          if (subtestDocSnap.exists()) {
            const data = subtestDocSnap.data();
            setQuestions(data.questions ?? []);
            found = true;
            break;
          }
        }
        if (!found) {
          setQuestions([]);
        }
      } catch (e) {
        setErr("Gagal mengambil soal.");
        setQuestions([]);
      }
      setLoading(false);
    }

    fetchQuestionsAndUserAnswer();
  }, [sesi, subtest]);

  // Ambil jawaban user dari Storage
  useEffect(() => {
    if (!sesi || !subtest) return;
    async function fetchUserAnswer() {
      try {
        const safeSubtest = subtest.replace(/\s+/g, "_");
        const fileName = `final_${username}_${sesi}_${safeSubtest}.json`;
        const filePath = `JawabanUser/${username}/sesi/${sesi}/${fileName}`;
        const fileRef = ref(storage, filePath);
        const url = await getDownloadURL(fileRef);
        const resp = await fetch(url);
        const data = await resp.json();
        setUserAnswers(data.answers || []);
      } catch (e) {
        setUserAnswers([]);
      }
    }
    fetchUserAnswer();
  }, [sesi, subtest, username]);

  return (
    <div style={{ maxWidth: 800, margin: "32px auto", padding: 24 }}>
      <h1 style={{ textAlign: "center", fontSize: 30, fontWeight: 700, color: "#2067cc" }}>
        {subtest} &ndash; <span style={{ color: "#11aa77" }}>{sesi}</span>
      </h1>
      <h3 style={{ textAlign: "center", color: "#888", fontSize: 20, fontWeight: 400, marginBottom: 32 }}>
        Jawaban Anda, Kunci & Penjelasan
      </h3>
      {loading ? (
        <div>Loading soal...</div>
      ) : err ? (
        <div style={{ color: "red" }}>{err}</div>
      ) : questions.length === 0 ? (
        <div>Tidak ada soal ditemukan.</div>
      ) : (
        questions.map((q, i) => {
          // Cek jawaban user
          const userAns = userAnswers[i];
          let isCorrect = false;
          if (userAns != null) {
            if (q.type === "multipleChoice" || q.type === "shortAnswer") {
              isCorrect = (userAns?.toString().trim().toLowerCase() === q.answer.toString().trim().toLowerCase());
            } else if (q.type === "understandingArguments") {
              // Untuk argumen, jawaban bisa "memperkuat,memperlemah" dsb
              isCorrect = (userAns?.toString().trim().toLowerCase() === q.answer.toString().trim().toLowerCase());
            }
          }
          return (
            <div
              key={i}
              style={{
                border: "2px solid",
                borderColor: userAns == null ? "#e0e7ef" : (isCorrect ? "#14b814" : "#f33"),
                background: userAns == null ? "#fff" : (isCorrect ? "#eafae8" : "#fff3f3"),
                borderRadius: 10,
                padding: 18,
                margin: "20px 0"
              }}
            >
              <div style={{
                fontWeight: 600,
                color: "#2b3a67",
                marginBottom: 6
              }}>
                Soal {i + 1}
              </div>
              <div style={{ whiteSpace: "pre-wrap", marginBottom: 8 }}>{q.statement}</div>
              {q.type === "multipleChoice" && (
                <ul style={{ marginBottom: 6 }}>
                  {(q.options as MultipleChoiceOption[]).map((opt, oi) => (
                    <li key={oi}><b>{opt.label}.</b> {opt.text}</li>
                  ))}
                </ul>
              )}
              {q.type === "shortAnswer" && (
                <div><b>Jawaban:</b> {q.answer}</div>
              )}
              {q.type === "understandingArguments" && (
                <div>
                  <ul>
                    {(q.options as UnderstandingArgOption[]).map((opt, oi) => (
                      <li key={oi}>
                        {opt.text} - <b>{opt.type}</b>
                      </li>
                    ))}
                  </ul>
                  <div style={{ fontSize: 13, color: "#527" }}>
                    Jawaban urutan: <b>{q.answer}</b>
                  </div>
                </div>
              )}
              <div style={{ margin: "10px 0 0 0", fontSize: 16 }}>
                <span style={{
                  fontWeight: 500,
                  color: userAns == null ? "#aaa" : (isCorrect ? "#219f4c" : "#e03030")
                }}>
                  Jawaban Anda: {userAns == null || userAns === "" ? <span style={{ color: "#aaa" }}>Belum dijawab</span> : userAns}
                  {userAns != null && (
                    <span style={{
                      marginLeft: 10,
                      padding: "2px 12px",
                      borderRadius: 14,
                      fontSize: 14,
                      fontWeight: 600,
                      background: isCorrect ? "#19e591" : "#ffbaba",
                      color: isCorrect ? "#055d24" : "#c40000"
                    }}>
                      {isCorrect ? "BENAR" : "SALAH"}
                    </span>
                  )}
                </span>
              </div>
              {q.type === "multipleChoice" && (
                <div style={{ marginTop: 6 }}>
                  Kunci Jawaban: <b>{q.answer}</b>
                </div>
              )}
              {q.penjelasan && (
                <div style={{
                  marginTop: 10,
                  padding: 10,
                  background: "#eafaf6",
                  borderRadius: 6,
                  color: "#125154",
                  whiteSpace: "pre-line"
                }}>
                  <b>Penjelasan:</b>
                  <br />
                  {q.penjelasan}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

