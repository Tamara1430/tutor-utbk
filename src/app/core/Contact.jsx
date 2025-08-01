import React from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from "react-icons/fa";

export default function Contact() {
  return (
    <section id="contact" className="utbk-contact-bg">
      <div className="utbk-contact-container">
        <div className="utbk-contact-header">
          <h2 className="utbk-contact-title">Hubungi Kami</h2>
          <p className="utbk-contact-sub">
            Ada pertanyaan? Tim kami siap membantu Anda 24/7
          </p>
        </div>
        <div className="utbk-contact-content">
          <div className="utbk-contact-list">
            <div className="utbk-contact-item">
              <div className="utbk-contact-icon"><FaPhone /></div>
              <div>
                <div className="utbk-contact-item-title">Telepon</div>
                <div className="utbk-contact-item-desc">+62 821-1158-7434</div>
              </div>
            </div>
            <div className="utbk-contact-item">
              <div className="utbk-contact-icon"><FaEnvelope /></div>
              <div>
                <div className="utbk-contact-item-title">Email</div>
                <div className="utbk-contact-item-desc">jihansajidah31@gmail.com</div>
              </div>
            </div>
            <div className="utbk-contact-item">
              <div className="utbk-contact-icon"><FaWhatsapp /></div>
              <div>
                <div className="utbk-contact-item-title">WhatsApp</div>
                <div className="utbk-contact-item-desc">+62 821-1158-7434</div>
              </div>
            </div>
          </div>
          <div className="utbk-contact-imagewrap">
            <img
              src="/contact-illustration.png"
              alt="Ilustrasi Hubungi Kami"
              className="utbk-contact-image"
            />
          </div>
        </div>
      </div>
      <style jsx>{`
        .utbk-contact-bg {
          background: #fff;
          padding: 90px 0;
        }
        .utbk-contact-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        .utbk-contact-header {
          text-align: center;
          margin-bottom: 3.2rem;
        }
        .utbk-contact-title {
          font-family: 'Inter', sans-serif;
          font-size: 2.5rem;
          font-weight: 700;
          color: #222;
          margin-bottom: 1.1rem;
        }
        .utbk-contact-sub {
          font-size: 1.14rem;
          color: #4b5563;
          max-width: 540px;
          margin: 0 auto;
        }
        .utbk-contact-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: flex-start;
        }
        .utbk-contact-list {
          display: flex;
          flex-direction: column;
          gap: 1.7rem;
        }
        .utbk-contact-item {
          display: flex;
          gap: 1.25rem;
          align-items: center;
        }
        .utbk-contact-icon {
          width: 3rem;
          height: 3rem;
          background: #2563eb;
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }
        .utbk-contact-item-title {
          font-size: 1.07rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.19rem;
        }
        .utbk-contact-item-desc {
          color: #64748b;
          font-size: 0.99rem;
        }
        .utbk-contact-formwrap {
          width: 100%;
        }
        .utbk-contact-form {
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
        }
        .utbk-contact-label {
          font-size: 0.99rem;
          font-weight: 500;
          color: #222;
          margin-bottom: 0.29rem;
          display: block;
        }
        .utbk-contact-input {
          width: 100%;
          padding: 0.78rem 1.05rem;
          border: 1.7px solid #d1d5db;
          border-radius: 0.7rem;
          font-size: 1rem;
          font-family: 'Inter', sans-serif;
          background: #f8fafc;
          margin-bottom: 0.18rem;
          outline: none;
          transition: border 0.16s, box-shadow 0.14s;
        }
        .utbk-contact-input:focus {
          border: 1.7px solid #2563eb;
          background: #fff;
        }
        .utbk-contact-btn {
          width: 100%;
          background: #2563eb;
          color: #fff;
          font-weight: 700;
          font-size: 1.11rem;
          padding: 0.95rem 0;
          border: none;
          border-radius: 0.7rem;
          cursor: pointer;
          margin-top: 0.32rem;
          transition: background 0.18s;
        }
        .utbk-contact-btn:hover {
          background: #1e40af;
        }
        @media (max-width: 900px) {
          .utbk-contact-content {
            grid-template-columns: 1fr;
            gap: 2.3rem;
          }
        }
        .utbk-contact-imagewrap {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }
        .utbk-contact-image {
          max-width: 100%;
          max-height: 380px;
          border-radius: 1.4rem;
          object-fit: contain;
          box-shadow: 0 8px 32px 0 rgba(40,67,150,0.09);
        }

      `}</style>
    </section>
  );
}
