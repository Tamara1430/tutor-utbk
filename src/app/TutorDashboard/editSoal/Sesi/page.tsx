'use client';
import React, { useEffect, useState } from "react";
import { collection, doc, getDocs, setDoc, deleteDoc, query, where } from "firebase/firestore";
import { db, auth } from "../../../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { Plus, ListChecks, Pencil, Trash2 } from 'lucide-react';
import "./style.css";

const dashboardId = "main"; // Ganti sesuai kebutuhan

type SessionData = {
  id: string;
  title: string;
  description: string;
  duration: number;
  subtest: string;
  participants: number;
  difficulty: string;
  category: string;
  rating: number;
  price: string;
  image: string;
};

const defaultSessionData = (id: string, idx: number): SessionData => ({
  id,
  title: id,
  description: `Latihan soal untuk sesi ${id}.`,
  duration: 90 + idx * 10,
  subtest: '7 subtest',
  participants: 0,
  difficulty: 'Sedang',
  category: 'umum',
  rating: 4.5,
  price: "",
  image: '/api/placeholder/300/200'
});

export default function SessionSelector() {
  const [uid, setUid] = useState<string>("");
  const [tutorDocId, setTutorDocId] = useState<string>("");
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [kelasOptions, setKelasOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<SessionData>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string>("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // Ambil data paketKelas lalu mapping id dokumen ke field title (untuk opsi harga)
  async function fetchKelasOptions(uid: string) {
    const refPaket = collection(db, "tutor", uid, "dashboard", dashboardId, "paketKelas");
    const snap = await getDocs(refPaket);
    setKelasOptions(snap.docs.map(doc => doc.data()?.title || ""));
  }

  // Ambil data paketKelas untuk mapping id → title
  async function fetchPaketKelasMap(uid: string) {
    const map: Record<string, string> = {};
    if (!uid) return map;
    const col = collection(db, "tutor", uid, "dashboard", dashboardId, "paketKelas");
    const snap = await getDocs(col);
    snap.forEach(docSnap => {
      map[docSnap.id] = docSnap.data()?.title || "";
    });
    return map;
  }

  // Ambil data sesi, lalu ambil title dari paketKelas (harga)
  const fetchSessions = async (tutorId: string) => {
    const sesiSnap = await getDocs(collection(db, "tutor", tutorId, "Soal"));
    const paketMap = await fetchPaketKelasMap(tutorId);
    const sesiArr: SessionData[] = [];
    sesiSnap.docs.forEach((docSnap, idx) => {
      const data = docSnap.data() || {};
      const sessionId = docSnap.id;
      sesiArr.push({
        id: sessionId,
        title: data.title ?? sessionId,
        description: data.description ?? `Latihan soal untuk sesi ${sessionId}.`,
        duration: data.duration ?? (90 + idx * 10),
        subtest: data.subtest ?? (30 + idx * 2),
        participants: data.participants ?? 0,
        difficulty: data.difficulty ?? 'Sedang',
        category: data.category ?? 'umum',
        rating: data.rating ?? 4.5,
        price: paketMap[sessionId] || "",
        image: data.image ?? '/api/placeholder/300/200',
      });
    });
    setSessions(sesiArr);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        alert("Kamu belum login");
        window.location.href = "/auth";
        return;
      }
      setUid(user.uid);
      const q = query(collection(db, "tutor"), where("uid", "==", user.uid));
      const qs = await getDocs(q);
      if (!qs.empty) {
        const tutorDoc = qs.docs[0];
        setTutorDocId(tutorDoc.id);
        await fetchSessions(tutorDoc.id);
        await fetchKelasOptions(tutorDoc.id);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleSessionClick = (sessionId: string) => {
    if (!tutorDocId) return;
    window.location.href = `/TutorDashboard/editSoal/Sesi/subtest?sesi=${sessionId}`;
  };

  const openAddSessionForm = () => {
    setShowForm(true);
    setIsEditing(false);
    setFormData({});
    setFormError(null);
    setEditId("");
  };

  const openEditSessionForm = (session: SessionData) => {
    setShowForm(true);
    setIsEditing(true);
    setFormData(session);
    setFormError(null);
    setEditId(session.id);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorDocId) {
      setFormError("Akun tutor tidak ditemukan.");
      return;
    }
    let idx = isEditing
      ? sessions.findIndex(s => s.id === editId)
      : sessions.length;
    let id = (formData.id?.trim() || (isEditing ? editId : `Sesi${idx + 1}`));

    if (!isEditing && sessions.some(s => s.id === id)) {
      setFormError("ID sudah ada. Pilih nama/id sesi lain.");
      return;
    }

    const defaultData = defaultSessionData(id, idx);
    const allowedKeys: (keyof SessionData)[] = [
      "id", "title", "description", "duration", "subtest", "participants", "difficulty", "category", "rating", "price", "image"
    ];
    const finalData: Partial<SessionData> = {};
    for (const key of allowedKeys) {
      let val = (formData[key] !== undefined && formData[key] !== "")
        ? formData[key]
        : defaultData[key];
      if (["duration", "subtest", "participants", "rating"].includes(key)) {
        val = val !== undefined && val !== "" ? Number(val) : defaultData[key];
      }
      finalData[key] = val as any;
    }
    try {
      await setDoc(doc(db, "tutor", tutorDocId, "Soal", id), finalData);
      setShowForm(false);
      setFormError(null);
      setFormData({});
      setEditId("");
      setIsEditing(false);
      await fetchSessions(tutorDocId);
    } catch (err: any) {
      setFormError("Gagal menyimpan data: " + (err?.message || ""));
      console.error("Firestore error:", err);
    }
  };

  const handleDelete = async () => {
    if (!tutorDocId || !deleteTarget) return;
    try {
      await deleteDoc(doc(db, "tutor", tutorDocId, "Soal", deleteTarget));
      setDeleteTarget(null);
      await fetchSessions(tutorDocId);
    } catch (err: any) {
      alert("Gagal menghapus sesi: " + (err?.message || ""));
    }
  };

  if (loading) return (
    <div className="ss-center">
      <div className="ss-spinner"></div>
    </div>
  );

  return (
    <div className="ss-root">
      <div className="ss-card">
        <div className="ss-header">
          <ListChecks size={28} className="ss-icon-main" />
          <h2>Kelola Sesi Tryout</h2>
        </div>
        <p className="ss-desc">
          Pilih sesi tryout untuk mulai mengelola atau tambahkan sesi baru jika diperlukan.
        </p>
        <div className="ss-session-list">
          {sessions.map((s, idx) => (
            <div className="ss-session-card" key={s.id}>
              <img src={s.image} alt={s.title} className="ss-session-img" onClick={() => handleSessionClick(s.id)} />
              <div className="ss-session-main" onClick={() => handleSessionClick(s.id)}>
                <div className="ss-session-row">
                  <b>{s.title}</b>
                  <span className="ss-session-badge">{s.price}</span>
                </div>
                <div className="ss-session-desc">{s.description}</div>
                <div className="ss-session-info">
                  <span>⏱ {s.duration}m</span>
                  <span>📝 {s.subtest} soal</span>
                  <span>👤 {s.participants} peserta</span>
                  <span>⭐ {s.rating}</span>
                  <span>🔖 {s.difficulty}</span>
                  <span>📚 {s.category}</span>
                </div>
              </div>
              <div className="ss-session-actions">
                <button className="ss-btn-icon" onClick={() => openEditSessionForm(s)} title="Edit">
                  <Pencil size={18} />
                </button>
                <button className="ss-btn-icon" onClick={() => setDeleteTarget(s.id)} title="Hapus">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={openAddSessionForm}
          className="ss-btn ss-btn-add"
          aria-label="Tambah sesi baru"
        >
          <Plus size={18} /> Tambah Sesi Baru
        </button>
        <div className="ss-label">
          <span>Sesi akan tampil di daftar setelah ditambahkan.</span>
        </div>
      </div>
      {showForm && (
        <div className="ss-modal-bg" onClick={() => setShowForm(false)}>
          <div className="ss-modal" onClick={e => e.stopPropagation()}>
            <h3>{isEditing ? "Edit Sesi" : "Tambah Sesi Baru"}</h3>
            <form onSubmit={handleFormSubmit} className="ss-form">
              {!isEditing && (
                <label>
                  ID Sesi (Opsional):
                  <input type="text" name="id" value={formData.id || ''} onChange={handleFormChange} placeholder="cth: Sesi3" />
                </label>
              )}
              <label>
                Judul:
                <input type="text" name="title" value={formData.title || ''} onChange={handleFormChange} placeholder="Judul sesi" />
              </label>
              <label>
                Deskripsi:
                <textarea name="description" value={formData.description || ''} onChange={handleFormChange} placeholder="Deskripsi" />
              </label>
              <label>
                Durasi (menit):
                <input type="number" name="duration" value={formData.duration || ''} onChange={handleFormChange} placeholder="Durasi" />
              </label>
              <label>
                Jumlah Soal:
                <input type="number" name="subtest" value={formData.subtest || ''} onChange={handleFormChange} placeholder="Jumlah soal" />
              </label>
              <label>
                Peserta:
                <input type="number" name="participants" value={formData.participants || ''} onChange={handleFormChange} placeholder="Peserta" />
              </label>
              <label>
                Tingkat Kesulitan:
                <input type="text" name="difficulty" value={formData.difficulty || ''} onChange={handleFormChange} placeholder="Sedang/Sulit/Mudah" />
              </label>
              <label>
                Kategori:
                <input type="text" name="category" value={formData.category || ''} onChange={handleFormChange} placeholder="Kategori" />
              </label>
              <label>
                Rating:
                <input type="number" step="0.1" name="rating" value={formData.rating || ''} onChange={handleFormChange} placeholder="4.5" />
              </label>
              <label>
                Gambar (URL):
                <input type="text" name="image" value={formData.image || ''} onChange={handleFormChange} placeholder="/api/placeholder/300/200" />
              </label>
              <label>
                Harga:
                <select name="price" value={formData.price || ''} onChange={handleFormChange}>
                  <option value="">Pilih harga/paket</option>
                  {kelasOptions.map((option, i) => (
                    <option value={option} key={i}>{option}</option>
                  ))}
                </select>
              </label>
              {formError && <div className="ss-form-error">{formError}</div>}
              <div className="ss-form-actions">
                <button type="button" onClick={() => setShowForm(false)}>Batal</button>
                <button type="submit">{isEditing ? "Simpan" : "Tambah"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {deleteTarget && (
        <div className="ss-modal-bg" onClick={() => setDeleteTarget(null)}>
          <div className="ss-modal" onClick={e => e.stopPropagation()}>
            <h3>Hapus Sesi</h3>
            <p>Apakah Anda yakin ingin menghapus sesi <b>{deleteTarget}</b>?</p>
            <div className="ss-form-actions">
              <button type="button" onClick={() => setDeleteTarget(null)}>Batal</button>
              <button type="button" onClick={handleDelete} style={{ background: "#ff4444", color: "#fff" }}>Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
