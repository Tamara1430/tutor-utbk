'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import './style.css';

const navLinks = [
  { href: "#home", label: "Beranda" },
  { href: "#aboutus", label: "Tentang Kami" },
  { href: "#rating-reviews", label: "Rating" },
  { href: "#contact", label: "Kontak" }
];

const TUTOR_DOC_ID = "JasU7NCjFYDs5nq0Q5iM";
const TUTOR_UID = "RW9xLSLVWAfNQrAZ8aLljZg1KK73";

export default function Header() {
  const [navOpen, setNavOpen] = useState(false);
  const router = useRouter();

  const scrollToSection = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setNavOpen(false);
  };

  const gotoAuth = () => {
    router.push(`/Auth/user?tutor=${TUTOR_DOC_ID}&uid=${TUTOR_UID}`);
  };

  return (
    <nav className="utbk-navbar">
      <div className="utbk-navbar-inner">
        <a href="#home" className="utbk-logo" style={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none'
        }}>
          <img
            src="https://iili.io/FWFaCgI.jpg"
            alt="Logo CerdasYuk"
            style={{
              width: 70,
              height: 70,
              borderRadius: '50%',
              objectFit: 'cover',
              marginRight: 16,
              border: '2.5px solid #2563eb',
              background: '#fff',
              marginTop: '20px'
            }}
          />
          <span
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#2563eb',
              fontFamily: 'Inter, sans-serif',
              marginTop: '20px',
              letterSpacing: '1px'
            }}
          >
            CerdasYuk!
          </span>
        </a>
        
        <div className={`utbk-navlinks ${navOpen ? "utbk-navlinks-open" : ""}`}>
          {navLinks.map(link => (
            <button
              key={link.href}
              onClick={() => scrollToSection(link.href.replace('#', ''))}
              className="utbk-navlink"
            >{link.label}</button>
          ))}
          <div className="utbk-actions-mobile">
            <button className="utbk-btn utbk-btn-outline" onClick={gotoAuth}>Login / Daftar</button>
          </div>
        </div>

        <div className="utbk-actions">
          <button className="utbk-btn utbk-btn-outline" onClick={gotoAuth}>Login / Daftar</button>
        </div>
        
        <button className="utbk-hamburger" onClick={() => setNavOpen(!navOpen)}>
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}
