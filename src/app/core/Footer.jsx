import React from "react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="utbk-footer-bg">
      <div className="utbk-footer-container">
        <div className="utbk-footer-grid">
          <div>
            <h3 className="utbk-footer-logo">CerdasYuk</h3>
            <p className="utbk-footer-desc">Platform terdepan untuk tutor UTBK profesional</p>
          </div>
          <div>
            <h4 className="utbk-footer-title">Platform</h4>
            <ul className="utbk-footer-list">
              <li><a href="#" className="utbk-footer-link">Bank Soal</a></li>
              <li><a href="#" className="utbk-footer-link">Analytics</a></li>
              <li><a href="#" className="utbk-footer-link">Modul Pembelajaran</a></li>
            </ul>
          </div>
          <div>
            <h4 className="utbk-footer-title">Dukungan</h4>
            <ul className="utbk-footer-list">
              <li><a href="#" className="utbk-footer-link">Help Center</a></li>
              <li><a href="#" className="utbk-footer-link">Komunitas</a></li>
              <li><a href="#" className="utbk-footer-link">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="utbk-footer-title">Ikuti Kami</h4>
            <div className="utbk-footer-social">
              <a href="#" className="utbk-footer-soclink"><FaFacebook /></a>
              <a href="#" className="utbk-footer-soclink"><FaInstagram /></a>
              <a href="#" className="utbk-footer-soclink"><FaYoutube /></a>
            </div>
          </div>
        </div>
        <div className="utbk-footer-copyright">
          <p>&copy; 2025 CerdasYuk Platform. All rights reserved.</p>
        </div>
      </div>
      <style jsx>{`
        .utbk-footer-bg {
          background: #181e2a;
          color: #fff;
          padding: 70px 0 32px 0;
        }
        .utbk-footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        .utbk-footer-grid {
          display: grid;
          grid-template-columns: repeat(4,1fr);
          gap: 2.1rem;
          margin-bottom: 2.3rem;
        }
        .utbk-footer-logo {
          font-family: 'Inter', sans-serif;
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 1rem;
          letter-spacing: -1px;
        }
        .utbk-footer-desc {
          color: #b7bdd6;
          font-size: 1rem;
          margin-bottom: 0.7rem;
        }
        .utbk-footer-title {
          font-size: 1.08rem;
          font-weight: 700;
          margin-bottom: 1.1rem;
        }
        .utbk-footer-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .utbk-footer-link {
          color: #b7bdd6;
          text-decoration: none;
          transition: color 0.16s;
        }
        .utbk-footer-link:hover {
          color: #60a5fa;
        }
        .utbk-footer-social {
          display: flex;
          gap: 1.1rem;
        }
        .utbk-footer-soclink {
          color: #b7bdd6;
          font-size: 1.4rem;
          transition: color 0.16s;
          display: flex;
          align-items: center;
        }
        .utbk-footer-soclink:hover {
          color: #60a5fa;
        }
        .utbk-footer-copyright {
          border-top: 1.5px solid #232c3f;
          padding-top: 2.1rem;
          text-align: center;
          color: #b7bdd6;
          font-size: 1rem;
        }
        @media (max-width: 900px) {
          .utbk-footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 2.1rem;
          }
        }
        @media (max-width: 600px) {
          .utbk-footer-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          .utbk-footer-container {
            padding: 0 1rem;
          }
        }
      `}</style>
    </footer>
  );
}
