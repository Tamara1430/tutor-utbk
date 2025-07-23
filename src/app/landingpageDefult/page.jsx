"use client";
import React, { useRef, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";

const LandingPage = () => {
  const flexRefs = React.useRef([]);
  const [showModal, setShowModal] = useState(false);

  const categories = [
    "Digital Marketing",
    "Teknologi & Web3",
    "Editing & Design",
    "Data Analysis",
  ];

  useEffect(() => {
    flexRefs.current.forEach((container) => {
      if (!container) return;

      let isDown = false;
      let startX;
      let scrollLeft;

      const mouseDownHandler = (e) => {
        isDown = true;
        container.classList.add("active");
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
      };

      const mouseLeaveHandler = () => {
        isDown = false;
        container.classList.remove("active");
      };

      const mouseUpHandler = () => {
        isDown = false;
        container.classList.remove("active");
      };

      const mouseMoveHandler = (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2; // scroll speed
        container.scrollLeft = scrollLeft - walk;
      };

      const touchStartHandler = (e) => {
        startX = e.touches[0].pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
      };

      const touchMoveHandler = (e) => {
        const x = e.touches[0].pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
      };

      container.addEventListener("mousedown", mouseDownHandler);
      container.addEventListener("mouseleave", mouseLeaveHandler);
      container.addEventListener("mouseup", mouseUpHandler);
      container.addEventListener("mousemove", mouseMoveHandler);
      container.addEventListener("touchstart", touchStartHandler);
      container.addEventListener("touchmove", touchMoveHandler);

      return () => {
        container.removeEventListener("mousedown", mouseDownHandler);
        container.removeEventListener("mouseleave", mouseLeaveHandler);
        container.removeEventListener("mouseup", mouseUpHandler);
        container.removeEventListener("mousemove", mouseMoveHandler);
        container.removeEventListener("touchstart", touchStartHandler);
        container.removeEventListener("touchmove", touchMoveHandler);
      };
    });
  }, []);

  const handleThumbClick = () => {
    setShowModal(true);
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    window.location.href = "../app";
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <div
        style={{
          backgroundColor: "#1a1a1a",
          minHeight: "100vh",
          overflowX: "hidden",
          overflowY: "visible",
          color: "#fff",
          paddingBottom: "40px",
          paddingTop: "150px",
        }}
      >
        <div className="container-fluid">
          <div className="row head" style={{ padding: "10px" }}>
            <div className="col-12 text-center">
              <h1
                className="Judul"
                style={{
                  marginTop: "15px",
                  fontWeight: "700",
                  fontSize: "2.5rem",
                  letterSpacing: "1px",
                }}
              >
                Selamat Datang di Platform Kami
              </h1>
              <h4
                className="Judul nama"
                style={{ marginTop: "5px", fontWeight: "500", fontSize: "1.5rem" }}
              >
                Silakan pilih kategori kelas yang Anda minati
              </h4>
              <h6
                style={{
                  color: "rgb(186, 246, 217)",
                  marginTop: "10px",
                  fontWeight: "400",
                  fontSize: "1.1rem",
                }}
              >
                (Login diperlukan untuk mengakses kelas)
              </h6>
            </div>
          </div>
        </div>

        {categories.map((category, index) => (
          <div
            className="container-fluid"
            key={index}
            style={{ overflow: "hidden", paddingBottom: "30px" }}
          >
            <h2
              className="Judul"
              style={{
                textAlign: "right",
                fontWeight: "700",
                fontSize: "1.8rem",
                marginBottom: "15px",
                color: "#8af8b2",
              }}
            >
              {category}
            </h2>
            <div className="row">
              <div
                className="d-flex flex-nowrap gap-3 px-3 py-2 custom-scroll"
                ref={(el) => (flexRefs.current[index] = el)}
                style={{
                  scrollSnapType: "x mandatory",
                  overflowX: "auto",
                  overflowY: "hidden",
                  WebkitOverflowScrolling: "touch",
                  scrollBehavior: "smooth",
                  cursor: "grab",
                }}
                onMouseDown={(e) => (e.currentTarget.style.cursor = "grabbing")}
                onMouseUp={(e) => (e.currentTarget.style.cursor = "grab")}
                onMouseLeave={(e) => (e.currentTarget.style.cursor = "grab")}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    onClick={handleThumbClick}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" || e.key === " ") handleThumbClick();
                    }}
                    className="box-thumbali"
                    style={{
                      flex: "0 0 auto",
                      scrollSnapAlign: "start",
                      borderRadius: "12px",
                      backgroundColor: "#2b2b2b",
                      minWidth: "220px",
                      minHeight: "140px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#8af8b2",
                      fontSize: "2.5rem",
                      fontWeight: "700",
                      boxShadow: "0 4px 12px rgba(138, 248, 178, 0.4)",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      userSelect: "none",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) =>
                      Object.assign(e.currentTarget.style, {
                        transform: "scale(1.05)",
                        boxShadow: "0 6px 18px rgba(138, 248, 178, 0.7)",
                      })
                    }
                    onMouseLeave={(e) =>
                      Object.assign(e.currentTarget.style, {
                        transform: "scale(1)",
                        boxShadow: "0 4px 12px rgba(138, 248, 178, 0.4)",
                      })
                    }
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Login atau Daftar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Anda harus login atau mendaftar terlebih dahulu untuk mengakses kelas ini. Apakah Anda ingin
          login atau mendaftar sekarang?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleModalConfirm}>
            Ya, Login/Daftar
          </Button>
        </Modal.Footer>
      </Modal>

      <style>{`
        .custom-scroll::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background-color: #8af8b2;
          border-radius: 10px;
        }
        .active {
          cursor: grabbing !important;
          scroll-behavior: auto !important;
        }
        @media (max-width: 768px) {
          .box-thumbali {
            min-width: 180px !important;
            min-height: 120px !important;
            font-size: 2rem !important;
          }
          .Judul {
            font-size: 1.5rem !important;
          }
          h2.Judul {
            font-size: 1.4rem !important;
          }
        }
        @media (max-width: 480px) {
          .box-thumbali {
            min-width: 140px !important;
            min-height: 100px !important;
            font-size: 1.6rem !important;
          }
        }
      `}</style>
    </>
  );
};

export default LandingPage;

