import React from "react";
import { FaStar } from "react-icons/fa";

const reviews = [
  {
    name: "Nabila Adisti",
    rating: 5,
    comment: "Wihh mantap KA, pembelajaran nyaa seru, ada modulnya jg, dan banyak latsolnya. Selain ngerti materi, jadii sering latsol deh. Allhamdulilah dh ke terimaa di PTN yang aku inginkan😍"
  },
  {
    name: "Reza Pratama",
    rating: 5,
    comment: "FPokoknyaa the besttt bangett, apalagii buat yg samsek ga paham materiii dan ga tau mulai dari mana. Benar-benar diajarinnn dri 0, diarahinn ke manaa, dll. Sekaliii lagiii makasiii banyakkk kakakk 🥹🥹🥹🤩"
  },
  {
    name: "Aulia Rahman",
    rating: 4.8,
    comment: "Kaa, aku mau infoinn. Aku lolos SNBT. Terima kasihh banyakk yaa selama setahun dah nemenin akuu belajarrr🥰❤️"
  },
  {
    name: "Dimas Wirawan",
    rating: 5,
    comment: "Kakakkkk, aku ke terima di Universitas Siliwangi hehhehe, makasihhh banyak arahannyaa. Jujurr aku tadiannya ga pede soalnya mau masuk akuntansi tapii aku rasa ga bakal bisa masukk soalnya ngerasa skornya kurangg, untung di arahin sama kakaknya skor segini bisa nih kemungkinan besar masuk ke siniii. Intinya thanks kaa ^_^"
  },
  {
    name: "Salsabila Putri",
    rating: 5,
    comment: "CerdasYuk! bantu aku paham konsep UTBK yang sulit. Forum diskusinya juga seru, gak malu nanya apapun."
  },
  {
    name: "Bayu Setiawan",
    rating: 5,
    comment: "Pokoknya belajar di CerdasYuk! worth it banget. Nilai sekolah dan tryoutku naik pesat."
  },
  {
    name: "Fahira Lestari",
    rating: 4.9,
    comment: "Assalamualaikum KA, aku mau infoinn aku udhh dpt nihh jurusan ekonomi pembangunan di Untirta hhehe. Tq KA pengajarannya, arahannya, selain itu ini harga nya murahh bngttt  tapii yaa isi nya worth it gitu. Justru aku lebih ngerasa cocok an les online dibandingkan offline, soalnya banyak latsol, materi, tentornya ngejelasin nya enak, dan iyapp di arahkan sesuai jurusan yg aku mau/univ yg aku mau tinggal bilang aja skor segini bisa ga ka dpt jurusan ini/univ ini😾❤️"
  },
  {
    name: "Aldo Saputra",
    rating: 5,
    comment: "UI-nya simple, bikin tambah semangat belajar."
  }
];

export default function RatingReviews() {
  const avgRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <section id="rating-reviews" className="utbk-review-bg">
      <div className="utbk-review-container">
        <div className="utbk-review-header">
          <h2 className="utbk-review-title">Testimoni & Review Pelajar</h2>
          <div className="utbk-review-mainnotice">
            <FaStar className="utbk-review-mainstar" />
            <span>
              Belajar di platform <b>CerdasYuk!</b> sangat menyenangkan dan efektif
            </span>
          </div>
          <div className="utbk-review-rating-summary">
            <span className="utbk-review-stars">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} style={{ color: "#fbbf24" }} className="utbk-review-star" />
              ))}
            </span>
            <span className="utbk-review-rating-text">{avgRating} / 5.0</span>
            <span className="utbk-review-rating-total">(200+ ulasan)</span>
          </div>
        </div>
        <div className="utbk-review-list">
          {reviews.map((r, idx) => (
            <div className="utbk-review-card" key={idx}>
              <div className="utbk-review-card-header">
                <span className="utbk-review-card-avatar">
                  {r.name
                    .split(" ")
                    .map((x) => x[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()}
                </span>
                <div>
                  <div className="utbk-review-card-name">{r.name}</div>
                  <div className="utbk-review-card-stars">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        style={{ color: "#fbbf24" }}
                        className="utbk-review-star"
                      />
                    ))}
                    <span className="utbk-review-card-rating">{r.rating}</span>
                  </div>
                </div>
              </div>
              <div className="utbk-review-card-comment">{r.comment}</div>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .utbk-review-bg {
          background: #f8fafc;
          padding: 90px 0;
        }
        .utbk-review-container {
          max-width: 860px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        .utbk-review-header {
          text-align: center;
          margin-bottom: 2.9rem;
        }
        .utbk-review-title {
          font-family: 'Inter', sans-serif;
          font-size: 2.1rem;
          font-weight: 700;
          color: #222;
          margin-bottom: 0.9rem;
        }
        .utbk-review-mainnotice {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.7rem;
          background: #e0e7ff;
          border-radius: 1rem;
          color: #3730a3;
          font-size: 1.14rem;
          font-weight: 600;
          padding: 0.62rem 1.2rem;
          margin-bottom: 1.2rem;
        }
        .utbk-review-mainstar {
          color: #fbbf24;
          font-size: 1.25rem;
        }
        .utbk-review-rating-summary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.65rem;
          margin-bottom: 0.1rem;
        }
        .utbk-review-stars {
          display: flex;
        }
        .utbk-review-star {
          color: #fbbf24 !important;
          font-size: 1.19rem;
        }
        .utbk-review-rating-text {
          font-weight: 700;
          color: #222;
          font-size: 1.1rem;
        }
        .utbk-review-rating-total {
          color: #64748b;
          font-size: 0.97rem;
        }
        .utbk-review-list {
          column-count: 2;
          column-gap: 1.5rem;
        }
        .utbk-review-card {
          background: #fff;
          border-radius: 1.2rem;
          box-shadow: 0 4px 18px 0 rgba(60,100,255,0.06);
          padding: 0.7rem 0.8rem;
          margin-bottom: 1.5rem;
          display: block;
          break-inside: avoid;
        }
        .utbk-review-card-header {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          margin-bottom: 0.5rem;
        }
        .utbk-review-card-avatar {
          width: 2.1rem;
          height: 2.1rem;
          background: #2563eb;
          color: #fff;
          font-weight: 700;
          font-size: 1.02rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          letter-spacing: 1px;
        }
        .utbk-review-card-name {
          font-weight: 700;
          color: #222;
          font-size: 1.06rem;
        }
        .utbk-review-card-stars {
          display: flex;
          align-items: center;
          gap: 0.14rem;
        }
        .utbk-review-card-rating {
          margin-left: 0.2rem;
          color: #64748b;
          font-size: 0.97rem;
          font-weight: 500;
        }
        .utbk-review-card-comment {
          color: #475569;
          font-size: 0.97rem;
          line-height: 1.5;
        }
        @media (max-width: 900px) {
          .utbk-review-list {
            column-count: 1;
          }
        }
      `}</style>
    </section>
  );
}
