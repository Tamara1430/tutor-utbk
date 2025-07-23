'use client';
import React, { useEffect, useState } from "react";
import { collection, doc, getDocs, setDoc, deleteDoc, query, where } from "firebase/firestore";
import { db, auth } from "../../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { Megaphone, Plus, Pencil, Trash2 } from 'lucide-react'; // pakai Megaphone icon
import "../editSoal/Sesi/style.css";

type Announcement = {
  id: string;
  title: string;
  content: string;
  date: string;
  image: string;
};

const defaultAnnouncement = (id: string, idx: number): Announcement => ({
  id,
  title: `Pengumuman ${idx + 1}`,
  content: '',
  date: new Date().toISOString().slice(0, 10), // yyyy-mm-dd
  image: '/api/placeholder/400/200'
});

export default function PengumumanManager() {
  const [uid, setUid] = useState<string>("");
  const [tutorDocId, setTutorDocId] = useState<string>("");
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Announcement>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string>("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // Fetch pengumuman
  const fetchAnnouncements = async (tutorId: string) => {
    const snap = await getDocs(collection(db, "tutor", tutorId, "Pengumuman"));
    const arr: Announcement[] = [];
    snap.docs.forEach((docSnap, idx) => {
      const data = docSnap.data() || {};
      arr.push({
        id: docSnap.id,
        title: data.title ?? `Pengumuman ${idx + 1}`,
        content: data.content ?? "",
        date: data.date ?? new Date().toISOString().slice(0, 10),
        image: data.image ?? '/api/placeholder/400/200',
      });
    });
    setAnnouncements(arr);
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

        await fetchAnnouncements(tutorDoc.id);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // ---- List
  const handleAnnouncementClick = (id: string) => {
    // bisa diubah redirect ke detail view jika mau, sementara ini tidak ada detail
  };

  // ---- Form (Add/Edit)
  const openAddForm = () => {
    setShowForm(true);
    setIsEditing(false);
    setFormData({});
    setFormError(null);
    setEditId("");
  };

  const openEditForm = (ann: Announcement) => {
    setShowForm(true);
    setIsEditing(true);
    setFormData(ann);
    setFormError(null);
    setEditId(ann.id);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      ? announcements.findIndex(a => a.id === editId)
      : announcements.length;
    let id = (formData.id?.trim() || (isEditing ? editId : `Pengumuman${idx + 1}`));

    if (!isEditing && announcements.some(a => a.id === id)) {
      setFormError("ID sudah ada. Pilih nama/id pengumuman lain.");
      return;
    }
    const def = defaultAnnouncement(id, idx);
    const allowedKeys: (keyof Announcement)[] = [
      "id", "title", "content", "date", "image"
    ];
    const finalData: Partial<Announcement> = {};
    for (const key of allowedKeys) {
      finalData[key] = (formData[key] !== undefined && formData[key] !== "") ? formData[key] : def[key];
    }

    try {
      await setDoc(doc(db, "tutor", tutorDocId, "Pengumuman", id), finalData);
      setShowForm(false);
      setFormError(null);
      setFormData({});
      setEditId("");
      setIsEditing(false);
      await fetchAnnouncements(tutorDocId);
    } catch (err: any) {
      setFormError("Gagal menyimpan data: " + (err?.message || ""));
      console.error("Firestore error:", err);
    }
  };

  // ---- Delete
  const handleDelete = async () => {
    if (!tutorDocId || !deleteTarget) return;
    try {
      await deleteDoc(doc(db, "tutor", tutorDocId, "Pengumuman", deleteTarget));
      setDeleteTarget(null);
      await fetchAnnouncements(tutorDocId);
    } catch (err: any) {
      alert("Gagal menghapus pengumuman: " + (err?.message || ""));
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
          <Megaphone size={28} className="ss-icon-main" />
          <h2>Kelola Pengumuman</h2>
        </div>
        <p className="ss-desc">
          Buat dan kelola pengumuman untuk siswa di platform Anda.
        </p>

        {/* --- Pengumuman LIST --- */}
        <div className="ss-session-list">
          {announcements.map((a, idx) => (
            <div className="ss-session-card" key={a.id}>
              <img src={a.image} alt={a.title} className="ss-session-img" onClick={() => handleAnnouncementClick(a.id)} />
              <div className="ss-session-main" onClick={() => handleAnnouncementClick(a.id)}>
                <div className="ss-session-row">
                  <b>{a.title}</b>
                  <span className="ss-session-badge">{a.date}</span>
                </div>
                <div className="ss-session-desc">{a.content.length > 110 ? a.content.slice(0, 110) + '…' : a.content}</div>
              </div>
              <div className="ss-session-actions">
                <button className="ss-btn-icon" onClick={() => openEditForm(a)} title="Edit">
                  <Pencil size={18} />
                </button>
                <button className="ss-btn-icon" onClick={() => setDeleteTarget(a.id)} title="Hapus">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={openAddForm}
          className="ss-btn ss-btn-add"
          aria-label="Tambah pengumuman"
        >
          <Plus size={18} /> Tambah Pengumuman
        </button>

        <div className="ss-label">
          <span>Pengumuman akan tampil di daftar setelah ditambahkan.</span>
        </div>
      </div>

      {/* --- FORM MODAL (TAMBAH/EDIT) --- */}
      {showForm && (
        <div className="ss-modal-bg" onClick={() => setShowForm(false)}>
          <div className="ss-modal" onClick={e => e.stopPropagation()}>
            <h3>{isEditing ? "Edit Pengumuman" : "Tambah Pengumuman"}</h3>
            <form onSubmit={handleFormSubmit} className="ss-form">
              {!isEditing && (
                <label>
                  ID Pengumuman (Opsional):
                  <input type="text" name="id" value={formData.id || ''} onChange={handleFormChange} placeholder="cth: Pengumuman3" />
                </label>
              )}
              <label>
                Judul:
                <input type="text" name="title" value={formData.title || ''} onChange={handleFormChange} placeholder="Judul pengumuman" />
              </label>
              <label>
                Isi Pengumuman:
                <textarea name="content" value={formData.content || ''} onChange={handleFormChange} placeholder="Isi pengumuman..." />
              </label>
              <label>
                Tanggal:
                <input type="date" name="date" value={formData.date || new Date().toISOString().slice(0, 10)} onChange={handleFormChange} />
              </label>
              <label>
                Gambar (URL):
                <input type="text" name="image" value={formData.image || ''} onChange={handleFormChange} placeholder="/api/placeholder/400/200" />
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

      {/* --- DELETE MODAL --- */}
      {deleteTarget && (
        <div className="ss-modal-bg" onClick={() => setDeleteTarget(null)}>
          <div className="ss-modal" onClick={e => e.stopPropagation()}>
            <h3>Hapus Pengumuman</h3>
            <p>Apakah Anda yakin ingin menghapus pengumuman <b>{deleteTarget}</b>?</p>
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
