import React from "react";
import {Handshake, GraduationCap, DollarSign, Globe } from "lucide-react";

export default function AboutUs() {
  return (
    <section id="aboutus" className="utbk-aboutus-bg">
      <div className="utbk-aboutus-container">
        {/* Badge */}
        <div className="utbk-aboutus-badge">About Us</div>
        {/* Judul */}
        <h2 className="utbk-aboutus-title">
          Platform <span className="utbk-aboutus-highlight">Terdepan</span> untuk Belajar UTBK
        </h2>
        {/* Subjudul */}
        <p className="utbk-aboutus-desc">
          Kami adalah platform yang mendukung dan memfasilitasi para calon mahasiswa untuk mencapai mimpinya di PTN terbaik di Indonesia
        </p>
        {/* Card Grid */}
        <div className="utbk-aboutus-features">
          <div className="utbk-aboutus-feature-card">
            <div className="utbk-aboutus-feature-icon"><Globe/></div>
            <div className="utbk-aboutus-feature-title">Komunitas Antar Pelajar</div>
            <div className="utbk-aboutus-feature-desc">
              Kami sudah menyiapkan groub dan komunitas via whatsapp yeng terdiri dari para pelajar di seluruh indonesia, didalamnya juga terdapat latihan soal setiap harinya sehingga kamu bisa belajar minimum 3 soal per harinya
            </div>
          </div>
          <div className="utbk-aboutus-feature-card">
            <div className="utbk-aboutus-feature-icon"><DollarSign /></div>
            <div className="utbk-aboutus-feature-title">Harga Kelas Terjangkau</div>
            <div className="utbk-aboutus-feature-desc">
              Kami menyadari bahwa pelajar membutuhkan fasilitas belajar yang murah, cepat dan efektif. maka dari itu paket yang tersedia semuanya Terjangkau
            </div>
          </div>
          <div className="utbk-aboutus-feature-card">
            <div className="utbk-aboutus-feature-icon"><GraduationCap /></div>
            <div className="utbk-aboutus-feature-title">Analytics Lengkap</div>
            <div className="utbk-aboutus-feature-desc">
              Pantau performa histori ujian sehingga kamu dapat mempelajarinya dari kesalahan
            </div>
          </div>
          <div className="utbk-aboutus-feature-card">
            <div className="utbk-aboutus-feature-icon"><Handshake/></div>
            <div className="utbk-aboutus-feature-title">Ajak Teman</div>
            <div className="utbk-aboutus-feature-desc">
              Ajak teman kamu belajar di platform kami, dan nikmati komisimu!
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .utbk-aboutus-bg {
          background: #f7f9fb;
          padding: 82px 0 60px 0;
        }
        .utbk-aboutus-container {
          max-width: 1250px;
          margin: 0 auto;
          padding: 0 2rem;
          text-align: center;
        }
        .utbk-aboutus-badge {
          display: inline-block;
          padding: 5px 20px;
          background: #e3edff;
          color: #2563eb;
          font-weight: 600;
          font-size: 1rem;
          border-radius: 1.2rem;
          margin-bottom: 18px;
        }
        .utbk-aboutus-title {
          font-family: 'Inter', sans-serif;
          font-size: 2.9rem;
          font-weight: 700;
          color: #151e2d;
          margin-bottom: 18px;
        }
        .utbk-aboutus-highlight {
          color: #2563eb;
        }
        .utbk-aboutus-desc {
          max-width: 940px;
          margin: 0 auto 42px auto;
          color: #434957;
          font-size: 1.25rem;
          line-height: 1.55;
        }
        .utbk-aboutus-features {
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2.3rem;
        }
        .utbk-aboutus-feature-card {
          background: #fff;
          border-radius: 1.25rem;
          box-shadow: 0 6px 32px 0 rgba(100,130,255,0.09);
          padding: 2.6rem 1.3rem 2rem 1.3rem;
          text-align: center;
          transition: transform 0.16s, box-shadow 0.18s;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .utbk-aboutus-feature-card:hover {
          transform: translateY(-8px) scale(1.03);
          box-shadow: 0 10px 32px 0 rgba(100,130,255,0.17);
        }
        .utbk-aboutus-feature-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: #e3edff;
          color: #2563eb;
          font-size: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.1rem;
        }
        .utbk-aboutus-feature-title {
          font-size: 1.27rem;
          font-weight: 700;
          color: #111928;
          margin-bottom: 0.6rem;
        }
        .utbk-aboutus-feature-desc {
          font-size: 1.04rem;
          color: #4b5563;
        }
        @media (max-width: 1100px) {
          .utbk-aboutus-features {
            grid-template-columns: 1fr 1fr;
            gap: 1.4rem;
          }
        }
        @media (max-width: 700px) {
          .utbk-aboutus-features {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .utbk-aboutus-title { font-size: 2.1rem;}
          .utbk-aboutus-container { padding: 0 1rem;}
        }
      `}</style>
    </section>
  );
}
