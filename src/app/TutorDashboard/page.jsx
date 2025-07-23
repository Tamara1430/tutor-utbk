'use client';
import React, { useState, useEffect, useRef } from "react";
import { FilePen, Trash, GraduationCap, Building2, ScanEye, Megaphone, Youtube } from 'lucide-react';
import { db } from "../firebase/config";
import { usePaketKelas } from "../context/PaketKelasContext";
import { collection, addDoc, doc, getDoc, getDocs, deleteDoc, updateDoc } from "firebase/firestore";
import "./style.css";

function SimpleModal({ show, onClose, title, message, type = "info", onConfirm }) {
  if (!show) return null;
  return (
    <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.18)", zIndex: 10000 }}>
      <div className="modal-dialog">
        <div className={`modal-content border-0 shadow rounded-4`}>
          <div className={`modal-header ${type === "danger" ? "bg-danger text-white" : "bg-primary text-white"}`}>
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body"><div>{message}</div></div>
          <div className="modal-footer">
            {type === "danger" ? (
              <>
                <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Batal</button>
                <button type="button" className="btn btn-danger" onClick={() => { onConfirm && onConfirm(); onClose(); }}>Hapus</button>
              </>
            ) : (
              <button type="button" className="btn btn-primary" onClick={onClose}>OK</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const subtestList = [
  "Penalaran Umum",
  "Pengetahuan Kuantitatif",
  "Pengetahuan dan Pemahaman Umum",
  "Membaca dan Menulis",
  "Literasi Bahasa Indonesia",
  "Literasi Bahasa Inggris",
  "Penalaran Matematika"
];

const dashboardId = "main";

const TutorDashboard = () => {
  const [uid, setUid] = useState(null);
  const [activeTab, setActiveTab] = useState("kelas");
  const [newClass, setNewClass] = useState({ title: "", description: "", price: "", benefit: [""] });
  const [kelasLoading, setKelasLoading] = useState(true);
  const [editClassId, setEditClassId] = useState(null);
  const [editClassForm, setEditClassForm] = useState({ title: "", description: "", price: "", benefit: [""] });
  const [modal, setModal] = useState({ show: false, title: "", message: "", type: "info", onConfirm: null });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const [videoForm, setVideoForm] = useState({
    url: "",
    kategori: "",
    judul: "",
    subtest: "",
    description: "",
    instructor: "",
  });
  const [filterKategori, setFilterKategori] = useState("");
  const [filterSubtest, setFilterSubtest] = useState("");
  const [videoPembahasan, setVideoPembahasan] = useState([]);
  const [videoLoading, setVideoLoading] = useState(false);
  const [editVideoId, setEditVideoId] = useState(null);
  const [editVideoForm, setEditVideoForm] = useState({
    url: "",
    kategori: "",
    judul: "",
    subtest: "",
    description: "",
    instructor: "",
  });

  const { paketKelas, setPaketKelas } = usePaketKelas();

  useEffect(() => {
    const storedUid = localStorage.getItem("tutor_uid");
    if (!storedUid) {
      setModal({
        show: true,
        title: "Akses Ditolak",
        message: "Anda belum login.",
        type: "info",
        onConfirm: () => window.location.href = "../auth"
      });
    } else {
      setUid(storedUid);
    }
  }, []);

  useEffect(() => {
    if (uid) fetchKelas();
  }, [uid]);

  useEffect(() => {
    if (uid && activeTab === "video") fetchVideoPembahasan();
  }, [uid, activeTab]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchKelas = async () => {
    setKelasLoading(true);
    try {
      const refPaket = collection(db, "tutor", uid, "dashboard", dashboardId, "paketKelas");
      const snap = await getDocs(refPaket);
      setPaketKelas(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch {
      setPaketKelas([]);
    }
    setKelasLoading(false);
  };

  const fetchVideoPembahasan = async () => {
    setVideoLoading(true);
    try {
      const refVideo = collection(db, "tutor", uid, "dashboard", dashboardId, "VideoPembahasan");
      const snap = await getDocs(refVideo);
      setVideoPembahasan(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch {
      setVideoPembahasan([]);
    }
    setVideoLoading(false);
  };

  const handleNewClassChange = (e) => {
    const { name, value } = e.target;
    setNewClass(prev => ({ ...prev, [name]: value }));
  };

  const handleBenefitChange = (idx, value) => {
    setNewClass(prev => {
      const benefit = [...prev.benefit];
      benefit[idx] = value;
      return { ...prev, benefit };
    });
  };

  const handleAddBenefit = () => {
    setNewClass(prev => ({ ...prev, benefit: [...prev.benefit, ""] }));
  };

  const handleRemoveBenefit = (idx) => {
    setNewClass(prev => {
      const benefit = prev.benefit.filter((_, i) => i !== idx);
      return { ...prev, benefit };
    });
  };

  const handleAddClass = async (e) => {
    e.preventDefault();
    if (!newClass.title || !newClass.description || !newClass.price || newClass.benefit.filter(b => b.trim() !== "").length === 0) {
      setModal({
        show: true,
        title: "Validasi",
        message: "Semua kolom & minimal 1 benefit wajib diisi!",
        type: "info"
      });
      return;
    }
    try {
      const tutorDocRef = doc(db, "tutor", uid);
      const tutorDoc = await getDoc(tutorDocRef);
      if (!tutorDoc.exists()) {
        setModal({ show: true, title: "Data Tidak Ditemukan", message: "Data tutor tidak ditemukan.", type: "info" });
        return;
      }
      const refPaket = collection(db, "tutor", uid, "dashboard", dashboardId, "paketKelas");
      await addDoc(refPaket, {
        title: newClass.title,
        description: newClass.description,
        price: Number(newClass.price),
        benefit: newClass.benefit.filter(b => b.trim() !== ""),
        createdAt: new Date(),
      });
      setNewClass({ title: "", description: "", price: "", benefit: [""] });
      await fetchKelas();
      setModal({
        show: true,
        title: "Berhasil",
        message: `Kelas baru ditambahkan: ${newClass.title}`,
        type: "info"
      });
    } catch (err) {
      setModal({
        show: true,
        title: "Error",
        message: "Gagal menyimpan ke database: " + err.message,
        type: "info"
      });
    }
  };

  const handleEditKelas = (kelas) => {
    setEditClassId(kelas.id);
    setEditClassForm({
      title: kelas.title,
      description: kelas.description,
      price: kelas.price,
      benefit: kelas.benefit && Array.isArray(kelas.benefit) ? [...kelas.benefit] : [""]
    });
  };

  const handleEditClassFormChange = (e) => {
    const { name, value } = e.target;
    setEditClassForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditBenefitChange = (idx, value) => {
    setEditClassForm(prev => {
      const benefit = [...prev.benefit];
      benefit[idx] = value;
      return { ...prev, benefit };
    });
  };

  const handleEditAddBenefit = () => {
    setEditClassForm(prev => ({ ...prev, benefit: [...prev.benefit, ""] }));
  };

  const handleEditRemoveBenefit = (idx) => {
    setEditClassForm(prev => {
      const benefit = prev.benefit.filter((_, i) => i !== idx);
      return { ...prev, benefit };
    });
  };

  const handleUpdateKelas = async (kelasId) => {
    try {
      const kelasDocRef = doc(db, "tutor", uid, "dashboard", dashboardId, "paketKelas", kelasId);
      await updateDoc(kelasDocRef, {
        title: editClassForm.title,
        description: editClassForm.description,
        price: Number(editClassForm.price),
        benefit: editClassForm.benefit.filter(b => b.trim() !== "")
      });
      setEditClassId(null);
      await fetchKelas();
      setModal({ show: true, title: "Berhasil", message: "Kelas berhasil diedit", type: "info" });
    } catch (err) {
      setModal({ show: true, title: "Error", message: "Gagal update: " + err.message, type: "info" });
    }
  };

  const deleteKelasConfirmed = async (kelasId) => {
    try {
      const kelasDocRef = doc(db, "tutor", uid, "dashboard", dashboardId, "paketKelas", kelasId);
      const kelasSnap = await getDoc(kelasDocRef);
      const kelasData = kelasSnap.exists() ? kelasSnap.data() : null;
      const kelasTitle = kelasData?.title;
      if (kelasTitle) {
        const videoColRef = collection(db, "tutor", uid, "dashboard", dashboardId, "VideoPembahasan");
        const allVideoSnap = await getDocs(videoColRef);
        const relatedVideos = allVideoSnap.docs.filter(
          v => v.data().kategori === kelasTitle
        );
        for (const v of relatedVideos) {
          await deleteDoc(doc(db, "tutor", uid, "dashboard", dashboardId, "VideoPembahasan", v.id));
        }
      }
      await deleteDoc(kelasDocRef);
      await fetchKelas();
      await fetchVideoPembahasan();
      setModal({
        show: true,
        title: "Berhasil",
        message: "Kelas dan seluruh video pembahasan terkait telah dihapus.",
        type: "info"
      });
    } catch (err) {
      setModal({ show: true, title: "Error", message: "Gagal hapus kelas: " + err.message, type: "info" });
    }
  };

  const handleVideoFormChange = (e) => {
    const { name, value } = e.target;
    setVideoForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    if (
      !videoForm.url ||
      !videoForm.kategori ||
      !videoForm.judul ||
      !videoForm.subtest ||
      !videoForm.description ||
      !videoForm.instructor
    ) {
      setModal({
        show: true,
        title: "Validasi",
        message: "Semua kolom wajib diisi!",
        type: "info"
      });
      return;
    }
    try {
      const refVideo = collection(db, "tutor", uid, "dashboard", dashboardId, "VideoPembahasan");
      await addDoc(refVideo, {
        url: videoForm.url,
        kategori: videoForm.kategori,
        judul: videoForm.judul,
        subtest: videoForm.subtest,
        description: videoForm.description,
        instructor: videoForm.instructor,
        createdAt: new Date(),
      });
      setVideoForm({ url: "", kategori: "", judul: "", subtest: "", description: "", instructor: "" });
      await fetchVideoPembahasan();
      setModal({
        show: true,
        title: "Berhasil",
        message: "Video berhasil ditambahkan",
        type: "info"
      });
    } catch (err) {
      setModal({
        show: true,
        title: "Error",
        message: "Gagal menyimpan ke database: " + err.message,
        type: "info"
      });
    }
  };

  const handleEditVideo = (video) => {
    setEditVideoId(video.id);
    setEditVideoForm({
      url: video.url,
      kategori: video.kategori,
      judul: video.judul,
      subtest: video.subtest,
      description: video.description || "",
      instructor: video.instructor || "",
    });
  };

  const handleEditVideoFormChange = (e) => {
    const { name, value } = e.target;
    setEditVideoForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateVideo = async (videoId) => {
    try {
      const videoDocRef = doc(db, "tutor", uid, "dashboard", dashboardId, "VideoPembahasan", videoId);
      await updateDoc(videoDocRef, {
        url: editVideoForm.url,
        kategori: editVideoForm.kategori,
        judul: editVideoForm.judul,
        subtest: editVideoForm.subtest,
        description: editVideoForm.description,
        instructor: editVideoForm.instructor,
      });
      setEditVideoId(null);
      await fetchVideoPembahasan();
      setModal({
        show: true,
        title: "Berhasil",
        message: "Video berhasil diedit",
        type: "info"
      });
    } catch (err) {
      setModal({
        show: true,
        title: "Error",
        message: "Gagal update: " + err.message,
        type: "info"
      });
    }
  };

  const deleteVideoConfirmed = async (videoId) => {
    const docRef = doc(db, "tutor", uid, "dashboard", dashboardId, "VideoPembahasan", videoId);
    await deleteDoc(docRef);
    await fetchVideoPembahasan();
    setModal({
      show: true,
      title: "Berhasil",
      message: "Video dihapus",
      type: "info"
    });
  };

  const getYoutubeEmbedUrl = (url) => {
    try {
      if (!url) return "";
      if (url.includes("youtube.com/embed/")) {
        return url.split("?")[0];
      }
      let videoId = "";
      if (url.includes("youtube.com")) {
        const urlObj = new URL(url);
        videoId = urlObj.searchParams.get("v");
      } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split(/[?&]/)[0];
      }
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    } catch { }
    return "";
  };

  const formatCurrency = (amount) => {
    return amount?.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 });
  };

  const filteredVideos = videoPembahasan.filter(video => {
    return (
      (filterKategori === "" || video.kategori === filterKategori) &&
      (filterSubtest === "" || video.subtest === filterSubtest)
    );
  });

  if (!uid) return (
    <SimpleModal
      show={modal.show}
      title={modal.title}
      message={modal.message}
      type={modal.type}
      onClose={() => {
        setModal(m => ({ ...m, show: false }));
        if (modal.onConfirm) modal.onConfirm();
      }}
      onConfirm={modal.onConfirm}
    />
  );

  return (
    <>
      <SimpleModal
        show={modal.show}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onClose={() => {
          setModal(m => ({ ...m, show: false }));
          if (modal.onConfirm && modal.type !== "danger") modal.onConfirm();
        }}
        onConfirm={modal.onConfirm}
      />

      <div className="dashboard-container" role="main" aria-label="Tutor Dashboard">
        <div className="header-navbar">
          <h1>Dashboard Tutor</h1>
          <nav className="dropdown-nav" ref={dropdownRef}>
            <button className="dropdown-toggle" aria-haspopup="true" aria-expanded={dropdownOpen} onClick={() => setDropdownOpen(v => !v)} tabIndex={0}>
              Edit & Navigasi <span style={{ marginLeft: 7 }}>▼</span>
            </button>
            {dropdownOpen && (
              <>
                <div className="menu-blur-overlay" onClick={() => setDropdownOpen(false)} aria-label="Tutup navigasi" />
                <div className="dropdown-center-modal" role="menu" aria-modal="true">
                  <ul>
                    <li><a href="TutorDashboard/Company" className="dropdown-link"><Building2 size={17} style={{ marginRight: 10 }} /> Company Profile</a></li>
                    <li><a href="/components/TextCanvasEditor" className="dropdown-link"><FilePen size={17} style={{ marginRight: 10 }} /> Edit Landing Pagemu</a></li>
                    <li><a href="TutorDashboard/editSoal/Sesi" className="dropdown-link"><FilePen size={17} style={{ marginRight: 10 }} /> Tambah/Edit Soal TO</a></li>
                    <li><a href="TutorDashboard/pengumuman" className="dropdown-link"><Megaphone size={17} style={{ marginRight: 10 }} /> Buat Pengumuman</a></li>
                    <li><a href="Mainpage" className="dropdown-link"><ScanEye size={17} style={{ marginRight: 10 }} /> Preview Landingpage</a></li>
                    <li><a href="Auth/user" className="dropdown-link"><ScanEye size={17} style={{ marginRight: 10 }} /> Jadi Siswa (Testing)</a></li>
                    <li><a href="TutorDashboard/Members" className="dropdown-link"><GraduationCap size={17} style={{ marginRight: 10 }} /> List Siswa</a></li>
                  </ul>
                </div>
              </>
            )}
          </nav>
        </div>

        <section aria-label="Pendapatan tutor">
          <h2>Pendapatan</h2>
          <div className="income-summary">
            <div className="income-box" tabIndex="0"><h3>Total Pendapatan</h3><p>{formatCurrency(12500000)}</p></div>
            <div className="income-box" tabIndex="0"><h3>Pendapatan Bulan Ini</h3><p>{formatCurrency(3500000)}</p></div>
            <div className="income-box" tabIndex="0"><h3>Pendapatan Bersih (setelah dikurang 5% komisi)</h3><p>{formatCurrency(10000)}</p></div>
            <div className="income-box" tabIndex="0"><h3>Jumlah Kelas</h3><p>{paketKelas.length}</p></div>
          </div>
        </section>

        <div>
          {activeTab === "kelas" && (
            <>
              <section aria-label="Tambah kelas baru">
                <h2>Tambah Kelas</h2>
                <form onSubmit={handleAddClass} aria-describedby="add-class-description">
                  <p id="add-class-description" style={{ marginBottom: "1rem", color: "#555" }}>Isi informasi kelas baru yang ingin Anda buat.</p>
                  <label htmlFor="title">Judul Kelas</label>
                  <input type="text" id="title" name="title" value={newClass.title} onChange={handleNewClassChange} placeholder="Judul kelas" required autoComplete="off" />
                  <label htmlFor="description">Deskripsi Kelas</label>
                  <textarea id="description" name="description" value={newClass.description} onChange={handleNewClassChange} placeholder="Deskripsikan kelas atau materi yang diajarkan" rows="3" required />
                  <label>Benefit / Fitur Kelas</label>
                  {newClass.benefit.map((b, i) => (
                    <div key={i} style={{ display: "flex", gap: 6, marginBottom: 7 }}>
                      <input type="text" value={b} onChange={e => handleBenefitChange(i, e.target.value)} placeholder="Contoh: Akses Tryout" required style={{ flex: 1 }} />
                      {newClass.benefit.length > 1 && (
                        <button type="button" onClick={() => handleRemoveBenefit(i)} style={{ color: "#e33", fontWeight: 700, border: "none", background: "transparent" }}>✖</button>
                      )}
                    </div>
                  ))}
                  <button type="button" className="btn btn-secondary btn-sm mb-2" onClick={handleAddBenefit}>+ Benefit</button>
                  <label htmlFor="price">Harga Kelas (IDR)</label>
                  <input type="number" id="price" name="price" min="0" value={newClass.price} onChange={handleNewClassChange} placeholder="Contoh: 150000" required />
                  <button type="submit" className="btn btn-success" aria-label="Tambah kelas baru">Tambah Kelas</button>
                </form>
              </section>
              <section style={{ marginTop: 28 }} aria-label="Daftar paket kelas">
                <h2>Paket Kelas Terdaftar</h2>
                {kelasLoading ? (
                  <p style={{ color: "#888" }}>Memuat data kelas...</p>
                ) : paketKelas.length === 0 ? (
                  <p style={{ color: "#888" }}>Belum ada paket kelas.</p>
                ) : (
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {paketKelas.map(kelas => (
                      <li key={kelas.id} style={{
                        background: "#bad3d4", borderRadius: 10, marginBottom: 16, padding: 16,
                        boxShadow: "0 1px 3px #0001", display: "flex", gap: 20, alignItems: "center", position: "relative"
                      }}>
                        <div style={{ flex: 1 }}>
                          {editClassId === kelas.id ? (
                            <form onSubmit={e => { e.preventDefault(); handleUpdateKelas(kelas.id); }}>
                              <input type="text" name="title" value={editClassForm.title} onChange={handleEditClassFormChange} placeholder="Judul kelas" required style={{ marginBottom: 8, width: "100%" }} />
                              <textarea name="description" value={editClassForm.description} onChange={handleEditClassFormChange} placeholder="Deskripsi kelas" rows="3" required style={{ marginBottom: 8, width: "100%" }} />
                              <label style={{ fontWeight: 500, color: "#234", marginTop: 2, marginBottom: 4 }}>Benefit / Fitur</label>
                              {editClassForm.benefit.map((b, i) => (
                                <div key={i} style={{ display: "flex", gap: 6, marginBottom: 7 }}>
                                  <input type="text" value={b} onChange={e => handleEditBenefitChange(i, e.target.value)} required style={{ flex: 1 }} />
                                  {editClassForm.benefit.length > 1 && (
                                    <button type="button" onClick={() => handleEditRemoveBenefit(i)} style={{ color: "#e33", fontWeight: 700, border: "none", background: "transparent" }}>✖</button>
                                  )}
                                </div>
                              ))}
                              <button type="button" className="btn btn-secondary btn-sm mb-2" onClick={handleEditAddBenefit}>+ Benefit</button>
                              <input type="number" name="price" value={editClassForm.price} onChange={handleEditClassFormChange} placeholder="Harga" min="0" required style={{ marginBottom: 8, width: "100%" }} />
                              <button type="submit" className="btn btn-primary btn-sm">Simpan</button>
                              <button type="button" className="btn btn-secondary btn-sm ms-2" onClick={() => setEditClassId(null)}>Batal</button>
                            </form>
                          ) : (
                            <>
                              <div style={{ fontSize: 18, fontWeight: 600 }}>{kelas.title}</div>
                              <div style={{ color: "#666", margin: "6px 0 10px" }}>{kelas.description}</div>
                              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                                {(kelas.benefit || []).map((b, i) => (
                                  <li key={i} style={{ display: "flex", alignItems: "center", color: "#058520", fontWeight: 500, marginBottom: 3 }}>
                                    <span style={{ fontSize: 18, marginRight: 6 }}>✔️</span>{b}
                                  </li>
                                ))}
                              </ul>
                              <div style={{ color: "#2563eb", fontWeight: 500, marginTop: 8 }}>
                                Rp {Number(kelas.price).toLocaleString('id-ID')}
                              </div>
                            </>
                          )}
                        </div>
                        {editClassId !== kelas.id && (
                          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            <button onClick={() => handleEditKelas(kelas)} style={{ background: "none", border: "none", cursor: "pointer" }} title="Edit">
                              <FilePen size={20} color="#363" />
                            </button>
                            <button onClick={() =>
                              setModal({
                                show: true, title: "Konfirmasi Hapus", message: "Yakin hapus kelas ini?", type: "danger", onConfirm: () => deleteKelasConfirmed(kelas.id)
                              })
                            } style={{ background: "none", border: "none", cursor: "pointer" }} title="Hapus">
                              <Trash size={20} color="#f44" />
                            </button>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </>
          )}
          {activeTab === "video" && (
            <>
              <section aria-label="Tambah video pembahasan">
                <h2>Tambah Video Pembahasan</h2>
                <form onSubmit={handleAddVideo} aria-describedby="add-video-description">
                  <p id="add-video-description" style={{ marginBottom: "1rem", color: "#555" }}>
                    Upload video pembahasan YouTube (embed), pilih kategori kelas & subtest.
                  </p>
                  <label htmlFor="judul">Judul Video</label>
                  <input type="text" id="judul" name="judul" value={videoForm.judul} onChange={handleVideoFormChange} placeholder="Judul video pembahasan" required autoComplete="off" />
                  <label htmlFor="url">URL Youtube</label>
                  <input type="url" id="url" name="url" value={videoForm.url} onChange={handleVideoFormChange} placeholder="Contoh: https://youtu.be/xxxxxx" required autoComplete="off" />
                  <label htmlFor="kategori">Kategori Kelas</label>
                  <select id="kategori" name="kategori" value={videoForm.kategori} onChange={handleVideoFormChange} required>
                    <option value="">Pilih Kategori</option>
                    {paketKelas.map((kelas) => (
                      <option key={kelas.id} value={kelas.title}>{kelas.title}</option>
                    ))}
                  </select>
                  <label htmlFor="subtest">Subtest</label>
                  <select id="subtest" name="subtest" value={videoForm.subtest} onChange={handleVideoFormChange} required>
                    <option value="">Pilih Subtest</option>
                    {subtestList.map((s, i) => (
                      <option key={i} value={s}>{s}</option>
                    ))}
                  </select>
                  <label htmlFor="description">Deskripsi Video</label>
                  <textarea id="description" name="description" value={videoForm.description} onChange={handleVideoFormChange} placeholder="Deskripsi singkat video pembahasan" rows="3" required />
                  <label htmlFor="instructor">Nama Tutor</label>
                  <input type="text" id="instructor" name="instructor" value={videoForm.instructor} onChange={handleVideoFormChange} placeholder="Nama tutor pengisi video" required autoComplete="off" />
                  <button type="submit" className="btn btn-success" aria-label="Tambah video pembahasan">Tambah Video Pembahasan</button>
                </form>
              </section>
              <section style={{ marginTop: 28 }} aria-label="Daftar Video Pembahasan">
                <h2>Video Pembahasan</h2>
                <div style={{
                  display: "flex", gap: 16, marginBottom: 22, flexWrap: "wrap"
                }}>
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <label style={{ fontWeight: 600, color: "#334", marginBottom: 2 }}>Filter Kelas</label>
                    <select style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: "1px solid #bbb" }} value={filterKategori} onChange={e => setFilterKategori(e.target.value)}>
                      <option value="">Semua Kelas</option>
                      {paketKelas.map((kelas) => (
                        <option key={kelas.id} value={kelas.title}>{kelas.title}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <label style={{ fontWeight: 600, color: "#334", marginBottom: 2 }}>Filter Subtest</label>
                    <select style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: "1px solid #bbb" }} value={filterSubtest} onChange={e => setFilterSubtest(e.target.value)}>
                      <option value="">Semua Subtest</option>
                      {subtestList.map((s, i) => (
                        <option key={i} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {videoLoading ? (
                  <p style={{ color: "#888" }}>Memuat data video...</p>
                ) : filteredVideos.length === 0 ? (
                  <p style={{ color: "#888" }}>Tidak ada video pembahasan sesuai filter.</p>
                ) : (
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {filteredVideos.map(video => (
                      <li key={video.id} style={{
                        background: "#e4e8fa", borderRadius: 10, marginBottom: 22, padding: 16,
                        boxShadow: "0 1px 3px #0001", display: "flex", gap: 20, alignItems: "flex-start", position: "relative"
                      }}>
                        <div style={{ minWidth: 200 }}>
                          {getYoutubeEmbedUrl(video.url) ? (
                            <iframe
                              width="200"
                              height="112"
                              src={getYoutubeEmbedUrl(video.url)}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              title={video.judul}
                              style={{ borderRadius: 8, boxShadow: "0 2px 10px #0002" }}
                            />
                          ) : (
                            <Youtube size={48} style={{ color: "#ff3636" }} />
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          {editVideoId === video.id ? (
                            <form onSubmit={e => { e.preventDefault(); handleUpdateVideo(video.id); }}>
                              <input type="text" name="judul" value={editVideoForm.judul} onChange={handleEditVideoFormChange} placeholder="Judul video" required style={{ marginBottom: 8, width: "100%" }} />
                              <input type="url" name="url" value={editVideoForm.url} onChange={handleEditVideoFormChange} placeholder="URL Youtube" required style={{ marginBottom: 8, width: "100%" }} />
                              <select name="kategori" value={editVideoForm.kategori} onChange={handleEditVideoFormChange} required style={{ marginBottom: 8, width: "100%" }}>
                                <option value="">Pilih Kategori</option>
                                {paketKelas.map((kelas) => (
                                  <option key={kelas.id} value={kelas.title}>{kelas.title}</option>
                                ))}
                              </select>
                              <select name="subtest" value={editVideoForm.subtest} onChange={handleEditVideoFormChange} required style={{ marginBottom: 8, width: "100%" }}>
                                <option value="">Pilih Subtest</option>
                                {subtestList.map((s, i) => (
                                  <option key={i} value={s}>{s}</option>
                                ))}
                              </select>
                              <textarea name="description" value={editVideoForm.description} onChange={handleEditVideoFormChange} placeholder="Deskripsi singkat video" rows="3" required style={{ marginBottom: 8, width: "100%" }} />
                              <input type="text" name="instructor" value={editVideoForm.instructor} onChange={handleEditVideoFormChange} placeholder="Nama tutor" required style={{ marginBottom: 8, width: "100%" }} />
                              <button type="submit" className="btn btn-primary btn-sm">Simpan</button>
                              <button type="button" className="btn btn-secondary btn-sm ms-2" onClick={() => setEditVideoId(null)}>Batal</button>
                            </form>
                          ) : (
                            <>
                              <div style={{ fontSize: 18, fontWeight: 600 }}>{video.judul}</div>
                              <div style={{ color: "#3a54a7", fontWeight: 500, margin: "4px 0 2px" }}>{video.kategori}</div>
                              <div style={{ color: "#2a9677", fontWeight: 500, margin: "0 0 7px" }}>{video.subtest}</div>
                              <div style={{ color: "#444", marginBottom: 4 }}>{video.url}</div>
                              <div style={{ color: "#666", marginBottom: 4 }}>Deskripsi: {video.description}</div>
                              <div style={{ color: "#666" }}>Tutor: {video.instructor}</div>
                            </>
                          )}
                        </div>
                        {editVideoId !== video.id && (
                          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            <button onClick={() => handleEditVideo(video)} style={{ background: "none", border: "none", cursor: "pointer" }} title="Edit">
                              <FilePen size={20} color="#363" />
                            </button>
                            <button onClick={() =>
                              setModal({
                                show: true, title: "Konfirmasi Hapus", message: "Yakin hapus video ini?", type: "danger", onConfirm: () => deleteVideoConfirmed(video.id)
                              })
                            } style={{ background: "none", border: "none", cursor: "pointer" }} title="Hapus">
                              <Trash size={20} color="#f44" />
                            </button>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </>
          )}
        </div>

        <div style={{
          display: "flex", gap: 20, margin: "32px 0 0 0", justifyContent: "center",
          position: "sticky", bottom: 0, background: "#fff", padding: "12px 0 8px 0", zIndex: 9, borderTop: "1.5px solid #e3e6ec"
        }}>
          <button className={`tab-btn${activeTab === "kelas" ? " active" : ""}`} onClick={() => setActiveTab("kelas")}>Kelas</button>
          <button className={`tab-btn${activeTab === "video" ? " active" : ""}`} onClick={() => setActiveTab("video")}>Upload Video Pembahasan</button>
        </div>
      </div>
    </>
  );
};

export default TutorDashboard;
