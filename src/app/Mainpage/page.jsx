"use client";
import React, { useEffect, useState } from "react";
import { db } from "../firebase/config.js";
import { doc, getDoc } from "firebase/firestore";
import "../components/TextCanvasEditor/loader.css";

const LandingPageRenderer = () => {
  const [landingPage, setLandingPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState(null);
  const [error, setError] = useState(null);

  // Ambil UID dari localStorage
  useEffect(() => {
    const storedUid = localStorage.getItem("tutor_uid");
    if (storedUid) {
      setUid(storedUid);
      console.log("Document ID tutor (from localStorage):", storedUid);
    } else {
      alert("Kamu belum login.");
      window.location.href = "/AuthPages";
    }
  }, []);

  useEffect(() => {
    if (!uid) return;

    const fetchLandingPage = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch dokumen tutor langsung dari documentId
        const tutorDocRef = doc(db, "tutor", uid);
        const tutorDoc = await getDoc(tutorDocRef);

        if (!tutorDoc.exists()) {
          setError("Dokumen tutor tidak ditemukan.");
          setLandingPage(null);
          setLoading(false);
          return;
        }

        // Fetch dokumen landing page 'main' dari subkoleksi Landingpage
        const landingPageRef = doc(db, "tutor", uid, "Landingpage", "main");
        const landingPageDoc = await getDoc(landingPageRef);

        if (!landingPageDoc.exists()) {
          setError("Landing page 'main' belum dibuat.");
          setLandingPage(null);
          setLoading(false);
          return;
        }

        const data = landingPageDoc.data();
        console.log("LandingPage doc data:", data);

        if (!Array.isArray(data.elements) || data.elements.length === 0) {
          setError("Landing page kosong. Silakan edit dulu di TextCanvasEditor.");
          setLandingPage({ ...data, elements: [] });
        } else {
          setLandingPage(data);
        }
      } catch (err) {
        setError("Gagal mengambil data dari Firestore: " + err.message);
        setLandingPage(null);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLandingPage();
  }, [uid]);

  // LOADING
  if (loading) {
    return (
      <div className="flex flex-col items-center mt-[200px] gap-4">
        <div className="loader"></div>
        <p>Loading landing page...</p>
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className="flex flex-col items-center mt-32 text-red-600 text-center">
        <p>{error}</p>
      </div>
    );
  }

  // KOSONG
  if (!landingPage || !landingPage.elements) {
    return (
      <div className="flex flex-col items-center mt-32 text-gray-500">
        <p>Tidak ada landing page ditemukan.</p>
      </div>
    );
  }

  // RENDER LANDING PAGE
  return (
    <div className="flex flex-col items-center">
        <div
          className="relative"
          style={{
            backgroundColor: landingPage.bgColor || "#f3f4f6",
            height: landingPage.canvasHeight ? `${landingPage.canvasHeight}px` : "667px",
            width: "375px",
            overflow: "hidden",
            position: "relative",
            borderRadius: "10px",
            boxShadow: "0 0 10px 1px #ddd"
          }}
        >
          {landingPage.elements.map((el, i) => {
            const {
              type,
              position = { x: 0, y: 0 },
              width = 200,
              height = 100,
              fontFamily = "Montserrat, sans-serif",
              color = "#000000",
              bgColor = "transparent",
              borderColor = "transparent",
              borderRadius = 0,
              fontSize = 16,
              fontWeight = "normal",
              fontStyle = "normal",
              textDecoration = "none",
              textAlign = "left",
              verticalAlign = "top",
              content = ""
            } = el;

            let textContent = content;
            if (!content && el.text) textContent = el.text;
            if (!content && el.src) textContent = el.src;

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: position.x,
                  top: position.y,
                  width,
                  height,
                  fontFamily,
                  color,
                  backgroundColor: bgColor,
                  borderColor,
                  borderRadius,
                  borderStyle: "solid",
                  borderWidth: "1px",
                  overflow: "hidden",
                  boxSizing: "border-box",
                  zIndex: 2,
                }}
              >
                {type === "text" ? (
                  <div
                    style={{
                      fontSize,
                      fontWeight,
                      fontStyle,
                      textDecoration,
                      textAlign,
                      display: "flex",
                      alignItems:
                        verticalAlign === "middle"
                          ? "center"
                          : verticalAlign === "bottom"
                          ? "flex-end"
                          : "flex-start",
                      justifyContent:
                        textAlign === "center"
                          ? "center"
                          : textAlign === "right"
                          ? "flex-end"
                          : "flex-start",
                      height: "100%",
                      width: "100%",
                      padding: "4px 8px",
                      overflow: "hidden"
                    }}
                  >
                    {textContent || "Tulis sesuatu..."}
                  </div>
                ) : type === "youtube" ? (
                  <iframe
                    src={textContent}
                    title="YouTube Video"
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : type === "image" ? (
                  <img
                    src={textContent}
                    alt="uploaded"
                    className="w-full h-full object-contain"
                  />
                ) : null}
              </div>
            );
          })}
        </div>
    </div>
  );
};

export default LandingPageRenderer;
