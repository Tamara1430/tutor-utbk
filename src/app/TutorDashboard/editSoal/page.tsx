"use client";
import React, { useState, useEffect } from "react";
import "./style.css";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  doc,
  setDoc,
  getDoc
} from "firebase/firestore";
import { db, auth } from "../../firebase/config.js";
import { onAuthStateChanged, User } from "firebase/auth";

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

function getQueryParam(param: string): string | null {
  if (typeof window === "undefined") return null;
  const url = new URL(window.location.href);
  return url.searchParams.get(param);
}
function updateArgAnswer(opts: UnderstandingArgOption[]) {
  return opts.map(opt => opt.type).join(",");
}
const initialQuestion: Question = {
  type: "multipleChoice",
  statement: "",
  options: [
    { label: "A", text: "" },
    { label: "B", text: "" },
    { label: "C", text: "" },
    { label: "D", text: "" },
    { label: "E", text: "" }
  ],
  answer: "",
  penjelasan: ""
};

const AdminDashboard: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState<Question>({ ...initialQuestion });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [sesi, setSesi] = useState<string>("");
  const [subtest, setSubtest] = useState<string>("");
  const [tutorDocId, setTutorDocId] = useState<string>("");
  const [durasi, setDurasi] = useState<string>("");
  const [durasiSaved, setDurasiSaved] = useState<string>("");
  const [savingDurasi, setSavingDurasi] = useState<boolean>(false);
  const [notifikasi, setNotifikasi] = useState<string>("");

  useEffect(() => {
    const sesiName = getQueryParam("sesi");
    const subtestName = getQueryParam("subtest");
    if (!sesiName || !subtestName) {
      alert("Pilih sesi dan subtest terlebih dahulu.");
      window.location.href = "/TutorDashboard/pilihSesi";
      return;
    }
    setSesi(sesiName);
    setSubtest(subtestName);
  }, []);

  useEffect(() => {
    if (!sesi || !subtest) return;
    let unsub: (() => void) | undefined;
    const unsubAuth = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        const tutorRef = collection(db, "tutor");
        const q = query(tutorRef, where("uid", "==", user.uid));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const tutorDoc = snap.docs[0];
          setTutorDocId(tutorDoc.id);

          const subtestDocRef = doc(
            db,
            "tutor",
            tutorDoc.id,
            "Soal",
            sesi,
            "subtest",
            subtest
          );

          unsub = onSnapshot(subtestDocRef, (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              setQuestions(
                (data.questions || []).map((q: any) => {
                  if (q.type === "understandingArguments") {
                    return {
                      ...q,
                      options: (q.options || []).map((o: any) => ({
                        text: o.text,
                        type: o.type === "memperkuat" ? "memperkuat" : "memperlemah"
                      }))
                    };
                  }
                  return q;
                })
              );
              setDurasi(String(data.duration || ""));
              setDurasiSaved(String(data.duration || ""));
            } else {
              setQuestions([]);
              setDurasi("");
              setDurasiSaved("");
            }
            setLoading(false);
          });
        }
      }
    });
    return () => {
      if (unsub) unsub();
      unsubAuth();
    };
  }, [sesi, subtest]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    index: number | null = null
  ) => {
    const { name, value } = e.target as { name: string; value: string };

    if (name === "argType" && index !== null && newQuestion.type === "understandingArguments") {
      const updatedOptions = [...(newQuestion.options as UnderstandingArgOption[])];
      updatedOptions[index] = {
        ...updatedOptions[index],
        type: value as "memperkuat" | "memperlemah"
      };
      setNewQuestion((prev: any) => ({
        ...prev,
        options: updatedOptions,
        answer: updateArgAnswer(updatedOptions)
      }));
    }
    else if (name === "text" && index !== null && newQuestion.type === "understandingArguments") {
      const updatedOptions = [...(newQuestion.options as UnderstandingArgOption[])];
      updatedOptions[index] = {
        ...updatedOptions[index],
        text: value
      };
      setNewQuestion((prev: any) => ({
        ...prev,
        options: updatedOptions,
        answer: updateArgAnswer(updatedOptions)
      }));
    }
    else if (name === "type") {
      if (value === "multipleChoice") {
        setNewQuestion({
          type: "multipleChoice",
          statement: "",
          options: [
            { label: "A", text: "" },
            { label: "B", text: "" },
            { label: "C", text: "" },
            { label: "D", text: "" },
            { label: "E", text: "" }
          ],
          answer: "",
          penjelasan: ""
        });
      } else if (value === "understandingArguments") {
        const opts = [
          { text: "", type: "memperkuat" as "memperkuat" },
          { text: "", type: "memperlemah" as "memperlemah" }
        ];
        setNewQuestion({
          type: "understandingArguments",
          statement: "",
          options: opts,
          answer: updateArgAnswer(opts),
          penjelasan: ""
        });
      } else {
        setNewQuestion({
          type: "shortAnswer",
          statement: "",
          options: [],
          answer: "",
          penjelasan: ""
        });
      }
    }
    else if (index !== null && newQuestion.options && newQuestion.type === "multipleChoice") {
      const updatedOptions = [...(newQuestion.options as any)];
      updatedOptions[index][name] = value;
      setNewQuestion((prev: any) => ({ ...prev, options: updatedOptions }));
    }
    else if (name === "statement") {
      setNewQuestion((prev) => ({ ...prev, statement: value }));
    }
    else if (name === "penjelasan") {
      setNewQuestion((prev) => ({ ...prev, penjelasan: value }));
    }
    else if (name === "answer") {
      setNewQuestion((prev) => ({ ...prev, answer: value }));
    }
  };

  const handleAddOrEditQuestion = async () => {
    if (!tutorDocId) return;
    const subtestDocRef = doc(
      db,
      "tutor",
      tutorDocId,
      "Soal",
      sesi,
      "subtest",
      subtest
    );
    const snap = await getDoc(subtestDocRef);
    const existing = snap.exists() ? (snap.data()?.questions || []) : [];
    let currQ = { ...newQuestion };
    if (currQ.type === "understandingArguments") {
      currQ.answer = updateArgAnswer(currQ.options as UnderstandingArgOption[]);
    }
    let updated;
    if (editIndex !== null) {
      updated = [...existing];
      updated[editIndex] = currQ;
    } else {
      updated = [...existing, currQ];
    }
    await setDoc(subtestDocRef, { questions: updated }, { merge: true });
    setEditIndex(null);
    resetNewQuestion();
  };

  const handleDelete = async (index: number) => {
    if (!tutorDocId) return;
    if (!window.confirm("Hapus soal ini?")) return;
    const subtestDocRef = doc(
      db,
      "tutor",
      tutorDocId,
      "Soal",
      sesi,
      "subtest",
      subtest
    );
    const snap = await getDoc(subtestDocRef);
    if (!snap.exists()) return;
    const existing = snap.data()?.questions || [];
    const updated = existing.filter((_: any, i: number) => i !== index);
    await setDoc(subtestDocRef, { questions: updated }, { merge: true });
  };

  const resetNewQuestion = () => {
    setNewQuestion({ ...initialQuestion });
  };

  const handleEdit = (q: Question, index: number) => {
    let setQ = { ...q };
    if (setQ.type === "understandingArguments") {
      setQ.options = (setQ.options as any[]).map((o: any) => ({
        text: o.text,
        type: o.type === "memperkuat" ? "memperkuat" : "memperlemah"
      }));
      setQ.answer = updateArgAnswer(setQ.options as UnderstandingArgOption[]);
    }
    setEditIndex(index);
    setNewQuestion(setQ);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDurasiChange = (e: React.ChangeEvent<HTMLInputElement>) => setDurasi(e.target.value);

  const handleSaveDurasi = async () => {
    if (!tutorDocId) return;
    setSavingDurasi(true);
    const subtestDocRef = doc(
      db,
      "tutor",
      tutorDocId,
      "Soal",
      sesi,
      "subtest",
      subtest
    );
    await setDoc(subtestDocRef, { duration: Number(durasi) }, { merge: true });
    setDurasiSaved(durasi);
    setNotifikasi("Durasi berhasil disimpan!");
    setTimeout(() => setNotifikasi(""), 1500);
    setSavingDurasi(false);
  };

  const handleAddOption = () => {
    setNewQuestion(prev => {
      if (prev.type !== "understandingArguments") return prev;
      const newOptions = [
        ...(prev.options as UnderstandingArgOption[]),
        { text: "", type: "memperkuat" as "memperkuat" }
      ];
      return {
        ...prev,
        options: newOptions,
        answer: updateArgAnswer(newOptions)
      };
    });
  };

  const handleRemoveOption = (i: number) => {
    setNewQuestion(prev => {
      if (prev.type !== "understandingArguments") return prev;
      const newOptions = [...(prev.options as UnderstandingArgOption[])];
      newOptions.splice(i, 1);
      return {
        ...prev,
        options: newOptions,
        answer: updateArgAnswer(newOptions)
      };
    });
  };

  return (
    <div className="admin-dashboard">
      <h2>
        Edit Soal - <span style={{ color: "#20b46a" }}>{sesi}</span>
      </h2>
      <h3>
        Subtest: <span style={{ color: "#2980ef" }}>{subtest}</span>
      </h3>

      <div style={{ marginBottom: 24 }}>
        <label style={{ fontWeight: "bold", marginRight: 10 }}>
          Durasi (menit):
        </label>
        <input
          type="number"
          min="1"
          style={{ width: 100, padding: 8, fontSize: "1rem" }}
          value={durasi}
          onChange={handleDurasiChange}
        />
        <button
          style={{
            marginLeft: 10,
            padding: "8px 16px",
            background: "#1679fa",
            color: "#fff",
            border: 0,
            borderRadius: 8,
            fontWeight: 600,
            cursor:
              durasi !== durasiSaved && durasi !== "" && !savingDurasi
                ? "pointer"
                : "not-allowed",
            opacity:
              durasi !== durasiSaved && durasi !== "" && !savingDurasi
                ? 1
                : 0.6
          }}
          disabled={durasi === durasiSaved || durasi === "" || savingDurasi}
          onClick={handleSaveDurasi}
        >
          {savingDurasi ? "Menyimpan..." : "Simpan Durasi"}
        </button>
        {notifikasi && (
          <span style={{ marginLeft: 12, color: "#229f58" }}>{notifikasi}</span>
        )}
      </div>

      <div className="question-form">
        <h3>{editIndex !== null ? "Edit Soal" : "Tambah Soal Baru"}</h3>
        <select name="type" value={newQuestion.type} onChange={handleInputChange}>
          <option value="multipleChoice">Pilihan Ganda</option>
          <option value="shortAnswer">Isian Singkat</option>
          <option value="understandingArguments">Memahami Argumen</option>
        </select>
        <textarea
          name="statement"
          placeholder="Masukkan pernyataan soal"
          value={newQuestion.statement}
          onChange={handleInputChange}
        ></textarea>
        {newQuestion.type === "multipleChoice" && (
          <>
            {newQuestion.options.map((opt: MultipleChoiceOption, i: number) => (
              <div key={i} className="option-row">
                <label
                  style={{
                    width: "20px",
                    fontWeight: "bold",
                    marginRight: "10px"
                  }}
                >
                  {opt.label}.
                </label>
                <input
                  type="text"
                  name="text"
                  value={opt.text}
                  onChange={(e) => handleInputChange(e, i)}
                  placeholder=""
                />
              </div>
            ))}
            <input
              type="text"
              name="answer"
              placeholder="Jawaban Benar (A/B/C/D)"
              value={newQuestion.answer}
              onChange={handleInputChange}
              style={{
                marginTop: 8,
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "8px",
                fontSize: "1rem"
              }}
            />
          </>
        )}
        {newQuestion.type === "shortAnswer" && (
          <input
            type="text"
            name="answer"
            placeholder="Jawaban"
            value={newQuestion.answer}
            onChange={handleInputChange}
            style={{ marginTop: 8 }}
          />
        )}
        {newQuestion.type === "understandingArguments" && (
          <>
            {(newQuestion.options as UnderstandingArgOption[]).map((opt, i) => (
              <div key={i} className="option-row" style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
                <input
                  type="text"
                  name="text"
                  value={opt.text}
                  onChange={(e) => handleInputChange(e, i)}
                  style={{ marginRight: 8 }}
                />
                <select
                  name="argType"
                  value={opt.type}
                  onChange={(e) => handleInputChange(e, i)}
                  style={{ marginRight: 8 }}
                >
                  <option value="memperkuat">Memperkuat</option>
                  <option value="memperlemah">Memperlemah</option>
                </select>
                <button
                  type="button"
                  style={{ background: "#eee", border: 0, borderRadius: 6, padding: "2px 7px", color: "#444" }}
                  onClick={() => handleRemoveOption(i)}
                  disabled={(newQuestion.options as UnderstandingArgOption[]).length <= 2}
                >
                  Hapus
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddOption} style={{ marginTop: 4, marginBottom: 8 }}>
              Tambah Opsi
            </button>
            <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
              Jawaban urutan: <b>{newQuestion.answer}</b>
            </div>
          </>
        )}
        <textarea
          name="penjelasan"
          placeholder="Masukkan penjelasan"
          value={newQuestion.penjelasan}
          onChange={handleInputChange}
          style={{ marginTop: 8 }}
        />
        <button onClick={handleAddOrEditQuestion} style={{ marginTop: 8 }}>
          {editIndex !== null ? "Update Soal" : "Simpan Soal"}
        </button>
        {editIndex !== null && (
          <button
            type="button"
            onClick={() => {
              setEditIndex(null);
              resetNewQuestion();
            }}
            style={{ marginLeft: 10, background: "#f00", color: "#fff" }}
          >
            Batal Edit
          </button>
        )}
      </div>

      <div className="question-list">
        <h3>
          Daftar Soal ({sesi} - {subtest})
        </h3>
        {loading ? (
          <div>Loading...</div>
        ) : questions.length === 0 ? (
          <p>Belum ada soal.</p>
        ) : (
          questions.map((q, index) => (
            <div
              key={index}
              className="question-item"
              style={{
                position: "relative",
                border: "1px solid #eee",
                borderRadius: 10,
                padding: 12,
                marginBottom: 10
              }}
            >
              <h4>Soal {index + 1}</h4>
              <p className="statement-multiline">{q.statement}</p>
              {q.type === "multipleChoice" && (
                <>
                  <ul>
                    {(q.options as MultipleChoiceOption[]).map((opt, i) => (
                      <li key={i}>
                        <strong>{opt.label}.</strong> {opt.text}
                      </li>
                    ))}
                  </ul>
                  <p>
                    Jawaban Benar: <strong>{q.answer}</strong>
                  </p>
                </>
              )}
              {q.type === "shortAnswer" && (
                <p>
                  Jawaban: <strong>{q.answer}</strong>
                </p>
              )}
              {q.type === "understandingArguments" && (
                <>
                  <ul>
                    {(q.options as UnderstandingArgOption[]).map((opt, i) => (
                      <li key={i}>
                        {opt.text} - <strong>{opt.type}</strong>
                      </li>
                    ))}
                  </ul>
                  <div style={{ fontSize: 12, color: "#888" }}>
                    Jawaban urutan: <b>{q.answer}</b>
                  </div>
                </>
              )}
              {q.penjelasan && (
                <div
                  className="penjelasan-multiline"
                  style={{
                    background: "#f7f7fa",
                    borderRadius: 6,
                    padding: 8,
                    margin: "8px 0"
                  }}
                >
                  <span style={{ fontWeight: 600, color: "#23899a" }}>
                    Penjelasan:
                  </span>
                  <br />
                  {q.penjelasan}
                </div>
              )}
              <div style={{ position: "absolute", top: 10, right: 12 }}>
                <button
                  type="button"
                  onClick={() => handleEdit(q, index)}
                  style={{
                    marginRight: 8,
                    background: "#ffe49a",
                    border: 0,
                    borderRadius: 6,
                    padding: "3px 10px",
                    fontWeight: 600
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(index)}
                  style={{
                    background: "#ffb0b0",
                    border: 0,
                    borderRadius: 6,
                    padding: "3px 10px",
                    fontWeight: 600
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
