'use client';

import { FaGraduationCap, FaChartLine, FaUsers } from 'react-icons/fa';
import './style.css'

export default function Hero() {
  // Scroll smooth dari tombol
  const scrollToSection = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="utbk-hero-bg utbk-hero-section">
      <div className="utbk-hero-content">
        <div className="utbk-hero-left">
          <h1 className="utbk-hero-title">
            Capai PTN Impianmu <br className="utbk-hide-sm" /><span style={{color:"#bedbff"}}>
            Bersama Platform CerdasYuk!</span>
          </h1>
          <p className="utbk-hero-desc">
           Bergabung dengan CerdasYuk! berarti kamu akan mendapatkan bimbingan dari tutor berpengalaman, materi terstruktur, dan latihan soal yang lengkap untuk persiapan masuk PTN. Jangan lewatkan kesempatan untuk mempersiapkan diri sejak sekarang dan wujudkan PTN impianmu bersama kami!
          </p>
          <div className="utbk-hero-actions">
            <button className="utbk-btn utbk-btn-primary" style={{color: "Blue", backgroundColor:"white"}}>Mulai Gratis</button>
          </div>
        </div>
        <div className="utbk-hero-card-wrap">
          <div className="utbk-glass-card utbk-floating">
            <div className="utbk-card-row">
              <div className="utbk-card-icon"><FaGraduationCap /></div>
              <div>
                <div className="utbk-card-title">Mahasiswa Kampus TOP</div>
                <div className="utbk-card-desc">Sehingga belajar menjadi lebih efektif</div>
              </div>
            </div>
            <div className="utbk-card-row">
              <div className="utbk-card-icon"><FaChartLine /></div>
              <div>
                <div className="utbk-card-title">Harga Terjangkau</div>
                <div className="utbk-card-desc">Tersedia gratis juga loh!!</div>
              </div>
            </div>
            <div className="utbk-card-row">
              <div className="utbk-card-icon"><FaUsers /></div>
              <div>
                <div className="utbk-card-title">Komunitas Belajar</div>
                <div className="utbk-card-desc">didukung komunitas belajar antar pelajar diseluruh indonesia</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet"/>
    </section>
  );
}
