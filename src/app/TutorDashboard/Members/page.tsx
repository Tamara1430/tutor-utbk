'use client';
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

type UserData = {
  id: string;
  username: string;
  email?: string;
  uid?: string;
  status?: string;
};

function getStatusColor(status?: string) {
  if (!status) return '#64748b'; // abu
  if (status.toLowerCase() === 'premium') return '#2563eb';
  if (status.toLowerCase() === 'free') return '#22c55e';
  return '#64748b';
}

export default function KelolaSiswa() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const tutorId = typeof window !== "undefined" ? localStorage.getItem("tutor_uid") : null;
      if (!tutorId) return setLoading(false);
      const userCol = collection(db, 'tutor', tutorId, 'user');
      const snapshot = await getDocs(userCol);
      const userList: UserData[] = [];
      snapshot.forEach(doc => {
        userList.push({ id: doc.id, ...doc.data() } as UserData);
      });
      setUsers(userList);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  return (
    <div className="kelola-root">
      <h2 className="title">Kelola Siswa</h2>
      <div className="user-grid">
        {loading ? (
          <div className="loading">Memuat data siswa...</div>
        ) : users.length === 0 ? (
          <div className="empty">Belum ada siswa terdaftar.</div>
        ) : (
          users.map((user, i) => (
            <div className="user-card" key={user.id} tabIndex={0} onClick={() => setSelected(user)}>
              <div className="avatar" style={{ background: `linear-gradient(120deg, #2563eb 60%, #1e40af 100%)` }}>
                {user.username?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="info">
                <div className="username-row">
                  <span className="username">{user.username}</span>
                  <span className="status-badge"
                    style={{
                      background: getStatusColor(user.status),
                      color: '#fff',
                    }}
                  >{user.status || '-'}</span>
                </div>
                <div className="email">{user.email || <span className="none">Email belum diisi</span>}</div>
              </div>
              <span className="arrow">&rarr;</span>
            </div>
          ))
        )}
      </div>

      {/* Glass slide detail */}
      <div className={`detail-overlay${selected ? ' show' : ''}`} onClick={() => setSelected(null)}>
        <div className={`detail-panel${selected ? ' slide' : ''}`} onClick={e => e.stopPropagation()}>
          <button className="close-btn" onClick={() => setSelected(null)}>&times;</button>
          {selected && (
            <>
              <div className="detail-avatar">{selected.username?.charAt(0)?.toUpperCase() || 'U'}</div>
              <div className="detail-username">{selected.username}</div>
              <div className="detail-meta">
                <div>
                  <span>Email:</span> {selected.email || '-'}
                </div>
                <div>
                  <span>UID:</span> {selected.uid || selected.id}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>Status:</span>
                  <span className="status-badge"
                    style={{
                      background: getStatusColor(selected.status),
                      color: '#fff',
                      fontSize: '0.97rem',
                      padding: '5px 14px',
                      margin: 0,
                    }}
                  >{selected.status || '-'}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .kelola-root {
          min-height: 100vh;
          background: linear-gradient(105deg, #e0eaff 50%, #2563eb13 100%);
          padding: 32px 8px 56px 8px;
          font-family: 'Inter', Arial, sans-serif;
        }
        .title {
          color: #2563eb;
          font-size: 2.15rem;
          font-weight: 800;
          text-align: center;
          margin-bottom: 30px;
          letter-spacing: 0.5px;
        }
        .user-grid {
          width: 100%;
          max-width: 680px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
        }
        .user-card {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 8px 36px #2563eb19;
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px 22px;
          cursor: pointer;
          transition: box-shadow 0.15s, transform 0.15s;
          border: 2px solid #f0f7ff;
          position: relative;
          outline: none;
        }
        .user-card:focus, .user-card:hover {
          box-shadow: 0 10px 40px #2563eb30;
          border: 2px solid #2563eb30;
          transform: translateY(-2px) scale(1.015);
        }
        .avatar {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.65rem;
          color: #fff;
          font-weight: 900;
          box-shadow: 0 4px 24px #2563eb30;
          flex-shrink: 0;
        }
        .info {
          flex: 1;
          min-width: 0;
        }
        .username-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .username {
          font-size: 1.08rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 2px;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .status-badge {
          display: inline-block;
          font-size: 0.89rem;
          font-weight: 600;
          padding: 4px 13px;
          border-radius: 9px;
          margin-left: 3px;
          letter-spacing: 0.4px;
          box-shadow: 0 2px 8px #2563eb15;
          text-transform: capitalize;
          transition: background 0.16s;
          user-select: none;
        }
        .email {
          font-size: 0.97rem;
          color: #3b82f6;
          opacity: 0.84;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .none { color: #94a3b8; font-style: italic; }
        .arrow {
          font-size: 1.4rem;
          color: #2563eb;
          font-weight: bold;
          margin-left: 10px;
        }
        .loading, .empty {
          text-align: center;
          color: #2563eb;
          grid-column: 1 / -1;
          padding: 44px 0 36px 0;
        }
        /* Slide overlay & panel */
        .detail-overlay {
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.23s;
          position: fixed;
          inset: 0;
          z-index: 88;
          background: rgba(30,41,59,0.08);
        }
        .detail-overlay.show {
          pointer-events: auto;
          opacity: 1;
        }
        .detail-panel {
          background: rgba(255,255,255,0.91);
          backdrop-filter: blur(20px) saturate(1.25);
          border-top-left-radius: 32px;
          border-bottom-left-radius: 32px;
          box-shadow: -16px 0 40px #2563eb18;
          width: 355px;
          max-width: 99vw;
          height: 100vh;
          position: fixed;
          right: -380px;
          top: 0;
          z-index: 100;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 54px 32px 24px 32px;
          transform: translateX(0);
          transition: right 0.33s cubic-bezier(.7,1.7,.3,1), box-shadow 0.2s;
        }
        .detail-overlay.show .detail-panel {
          right: 0;
          box-shadow: -24px 0 48px #2563eb26;
        }
        .close-btn {
          position: absolute;
          left: -52px;
          top: 32px;
          width: 40px;
          height: 40px;
          font-size: 2.2rem;
          color: #fff;
          background: linear-gradient(135deg, #2563eb, #1e40af 92%);
          border: none;
          border-radius: 50%;
          box-shadow: 0 4px 24px #2563eb38;
          cursor: pointer;
          z-index: 1;
          transition: background 0.17s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .close-btn:hover {
          background: linear-gradient(120deg, #2563eb 70%, #1e40af 100%);
        }
        .detail-avatar {
          width: 92px; height: 92px;
          border-radius: 50%;
          margin-bottom: 14px;
          background: linear-gradient(120deg, #2563eb 60%, #1e40af 100%);
          color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 2.8rem; font-weight: 900;
          box-shadow: 0 8px 32px #2563eb25;
        }
        .detail-username {
          font-size: 1.3rem; font-weight: 800; color: #2563eb; margin-bottom: 12px;
        }
        .detail-meta {
          width: 100%;
          background: #e0eaff80;
          border-radius: 14px;
          padding: 22px 18px 15px 18px;
          font-size: 1.08rem;
          color: #3b82f6;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 18px;
          box-shadow: 0 2px 18px #2563eb12;
        }
        .detail-meta span {
          font-weight: 600;
          color: #2563eb;
          min-width: 68px;
          display: inline-block;
        }
        @media (max-width: 780px) {
          .user-grid { gap: 14px; }
          .user-card { padding: 15px 10px; }
          .avatar { width: 40px; height: 40px; font-size: 1.18rem;}
        }
        @media (max-width: 480px) {
          .kelola-root { padding: 14px 1px 35px 1px; }
          .title { font-size: 1.15rem; }
          .detail-panel {
            padding: 30px 10px 20px 10px;
            border-radius: 0;
            width: 100vw;
            right: -100vw;
          }
          .detail-overlay.show .detail-panel { right: 0; }
          .close-btn { left: auto; right: 12px; top: 12px; }
        }
      `}</style>
    </div>
  );
}
