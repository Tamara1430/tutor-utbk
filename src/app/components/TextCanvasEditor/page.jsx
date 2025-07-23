"use client";
import { useState, useRef, useEffect } from "react";
import { Rnd } from "react-rnd";
import { Bold, Delete, LetterText, SquareDashed, Type, Weight, Youtube, PaintBucket, Upload } from 'lucide-react';
import TextAlignDropdown from './TextAlignDropdown';
import VerticalAlignDropdown from "./VerticalAlignDropdown";
import CustomBaseline from "../Icon/CustomBaseline";
import { db, auth } from "../../firebase/config.js";
import { doc, collection, getDocs, query, where, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "./loader.css";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/config.js";


export default function TextCanvasEditor() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const toolboxRef = useRef(null);
  const [grabbing, setGrabbing] = useState(false);
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [canvasBg, setCanvasBg] = useState("#f3f4f6");
  const [canvasHeight, setCanvasHeight] = useState(1067);
  const canvasRef = useRef(null);
  const elementToolboxRef = useRef(null);
  const selectedElement = elements.find((el) => el.id === selectedId);
  const [landingPageId, setLandingPageId] = useState(null);

  // USER DETECT
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // FETCH LANDING PAGE
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const fetchLandingPage = async () => {
      setLoading(true);
      try {
        const tutorRef = collection(db, "tutor");
        const q = query(tutorRef, where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          setLoading(false);
          return;
        }
        const tutorDoc = querySnapshot.docs[0];
        const landingPageRef = collection(db, "tutor", tutorDoc.id, "Landingpage");
        const landingPageSnapshot = await getDocs(landingPageRef);

        if (!landingPageSnapshot.empty) {
          const landingPageDoc = landingPageSnapshot.docs[0];
          const landingPageData = landingPageDoc.data();
          setElements(
            (landingPageData.elements || []).map((el, index) => ({
              id: `el-${index}`,
              type: el.type,
              text: el.type === "text" || el.type === "button" ? el.content : "",
              src: el.type === "image" || el.type === "youtube" ? el.content : "",
              x: el.position?.x || 0,
              y: el.position?.y || 0,
              width: el.width || 200,
              height: el.height || 100,
              fontSize: el.fontSize || 16,
              fontFamily: el.fontFamily || "Montserrat, sans-serif",
              fontWeight: el.fontWeight || "normal",
              fontStyle: el.fontStyle || "normal",
              textDecoration: el.textDecoration || "none",
              color: el.color || "#000000",
              bgColor: el.bgColor || "transparent",
              borderColor: el.borderColor || "transparent",
              borderRadius: el.borderRadius || 0,
              textAlign: el.textAlign || "left",
              verticalAlign: el.verticalAlign || "top",
            }))
          );
          setCanvasBg(landingPageData.bgColor || "#f3f4f6");
          setCanvasHeight(landingPageData.canvasHeight || 1067);
        }
      } catch (err) {
        console.error("Error fetching landing page:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLandingPage();
  }, [user]);

  // SAVE TO FIRESTORE
  const handleSaveToFirestore = async () => {
    if (!user) {
      alert("User belum login");
      return;
    }
    try {
      const tutorRef = collection(db, "tutor");
      const q = query(tutorRef, where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        alert("Data tutor tidak ditemukan.");
        return;
      }
      const tutorDoc = querySnapshot.docs[0];
      const tutorDocId = tutorDoc.id;

      const landingPageData = {
        updatedAt: new Date(),
        bgColor: canvasBg,
        canvasHeight,
        elements: elements.map((el) => ({
          type: el.type,
          content: el.type === "text" ? el.text : el.src || "",
          position: { x: el.x || 0, y: el.y || 0 },
          width: el.width || "0",
          height: el.height || "0",
          fontFamily: el.fontFamily || "default-font",
          fontSize: el.fontSize || 16,
          color: el.color || "#000000",
          bgColor: el.bgColor || "transparent",
          borderColor: el.borderColor || "transparent",
          borderRadius: el.borderRadius || 0,
          textAlign: el.textAlign || "left",
          verticalAlign: el.verticalAlign || "top",
          fontWeight: el.fontWeight || "normal",
          fontStyle: el.fontStyle || "normal",
          textDecoration: el.textDecoration || "none",
        })),
      };

      let docRef;
      if (landingPageId) {
        docRef = doc(db, "tutor", tutorDocId, "Landingpage", landingPageId);
      } else {
        docRef = doc(db, "tutor", tutorDocId, "Landingpage", "main");
        setLandingPageId("main");
      }

      await setDoc(docRef, landingPageData);
      alert("Berhasil disimpan!");
    } catch (err) {
      console.error("Error menyimpan:", err);
      alert("Gagal menyimpan ke Firestore.");
    }
  };

  // ADD TEXT/YOUTUBE/ELEMENTS
  const addText = () => {
    const newText = {
      id: Date.now(),
      type: "text",
      text: "Tulis sesuatu...",
      fontSize: 16,
      color: "#000000",
      bgColor: "transparent",
      borderColor: "transparent",
      borderRadius: 4,
      x: 50,
      y: 50,
      width: 200,
      height: 50,
      textAlign: "left",
      verticalAlign: "top",
      fontWeight: "normal",
      fontStyle: "normal",
      textDecoration: "none",
    };
    setElements([...elements, newText]);
    setSelectedId(newText.id);
  };
  const addYoutube = () => {
    const newYoutube = {
      id: Date.now(),
      type: "youtube",
      src: "https://www.youtube.com/",
      x: 50,
      y: 150,
      width: 300,
      height: 180,
    };
    setElements([...elements, newYoutube]);
    setSelectedId(newYoutube.id);
  };
  const updateElement = (id, key, value) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, [key]: value } : el))
    );
  };
 const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file || !user) return;

  try {
    // Ambil username tutor dari Firestore
    const tutorRef = collection(db, "tutor");
    const q = query(tutorRef, where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      alert("Data tutor tidak ditemukan.");
      return;
    }
    const tutorDoc = querySnapshot.docs[0];
    const username = tutorDoc.data().username || user.uid;
    const safeUsername = username.replace(/[.#$[\]/]/g, "_");

    // Folder landingpage
    const fileRef = ref(storage, `tutor_images/${safeUsername}/landingpage/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);

    // Tambah ke canvas
    const newImage = {
      id: Date.now(),
      type: "image",
      src: url,
      x: 50,
      y: 50,
      width: 200,
      height: 200,
    };
    setElements(prev => [...prev, newImage]);
    setSelectedId(newImage.id);

    alert("Upload berhasil!\nGambar langsung ditambahkan ke canvas.");
    console.log("Download URL:", url);
  } catch (error) {
    alert("Upload gagal: " + error.message);
    console.error(error);
  }
};


  const deleteElement = () => {
    if (selectedId) {
      setElements((prev) => prev.filter((el) => el.id !== selectedId));
      setSelectedId(null);
    }
  };

  // DRAG TOOLBOX
  const [draggingRef, setDraggingRef] = useState(null);
  const handleMouseDown = (refName) => (e) => {
    setDraggingRef(refName);
    setGrabbing(true);
  };
  const handleMouseUp = () => {
    setDraggingRef(null);
    setGrabbing(false);
  };
  const handleMouseLeave = () => {
    setDraggingRef(null);
    setGrabbing(false);
  };
  const handleMouseMove = (e) => {
    if (grabbing && draggingRef) {
      const ref = draggingRef === "main" ? toolboxRef.current : elementToolboxRef.current;
      if (ref) {
        ref.scrollLeft -= e.movementX;
      }
    }
  };

  // Tambah tinggi canvas
 const increaseCanvasHeight = () => {
  setCanvasHeight(prev => {
    console.log("Prev height:", prev, "New height:", prev + 100);
    return prev + 100;
  });
};


  // LOADING
  if (loading) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "200px",
        gap: "10px",
      }}>
        <div className="loader"></div>
        <p style={{ color: "black" }}>Loading...</p>
      </div>
    );
  }

  // UI
  return (
    <div className="flex flex-col h-screen">
      {/* Toolbox Tetap Fixed di Atas */}
      <div className="toolbox-container overflow-x-auto whitespace-nowrap fixed top-0 left-0 w-full bg-gray text-white z-50" style={{ background: "gray"}}>
        <div
          ref={toolboxRef}
          onMouseDown={handleMouseDown("main")}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          className={`flex items-center gap-2 overflow-x-auto px-2 py-2 select-none ${grabbing ? "cursor-grabbing" : "cursor-grab"}`}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", marginBottom: 10 }}
        >
          {/* Add text */}
          <button
            onClick={addText}
            className=" text-white px-2 py-2 rounded flex items-center justify-center"
            style={{ marginLeft: 20 }}
            title="Tambah Teks"
          >
            <LetterText size={20} />
          </button>
          {/* Add Youtube */}
          <button
            onClick={addYoutube}
            className=" text-white px-2 py-2 rounded flex items-center justify-center"
            style={{ marginLeft: 20 }}
            title="Add Youtube"
          >
            <Youtube size={20} />
          </button>
          {/* Background Color Canvas */}
          <div className="relative" style={{ marginLeft: 20 }}>
            <label
              htmlFor="color-picker"
              className=" text-white px-2 py-2 rounded flex items-center justify-center cursor-pointer"
              title="Background Color"
            >
              <PaintBucket size={20} />
            </label>
            <input
              type="color"
              id="color-picker"
              onChange={(e) => setCanvasBg(e.target.value)}
              value={canvasBg}
              className="hidden"
            />
          </div>
          {/* Upload file */}
          <div>
            <label
              htmlFor="file-upload"
              className=" text-white px-2 py-2 rounded flex items-center justify-center cursor-pointer"
              style={{ marginLeft: 20 }}
              title="Upload Your File"
            >
              <Upload size={20} />
              <span className="ml-2">Upload</span>
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>
        {/* SUBTOOLBAR: Tool untuk element terpilih */}
        {selectedId && (
          <div
            ref={elementToolboxRef}
            onMouseDown={handleMouseDown("element")}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            className={`flex items-center gap-2 px-2 py-2 select-none ${grabbing ? "cursor-grabbing" : "cursor-grab"}`}
            style={{ overflowX: "auto", scrollbarWidth: "none", position: "relative", marginTop: -30 }}
          >
            {/* Delete */}
            <button
              onClick={deleteElement}
              className=" text-white px-2 py-2 rounded flex items-center justify-center"
              style={{ marginLeft: 20 }}
              title="Delete Element"
            >
              <Delete size={20} />
            </button>
            {/* YouTube Settings */}
            {elements.find((el) => el.id === selectedId)?.type === "youtube" && (
              <>
                <label className="text-sm whitespace-nowrap" style={{ marginLeft: 20 }}>Link YouTube Embed</label>
                <input
                  type="text"
                  className="border px-2 py-1"
                  value={elements.find((el) => el.id === selectedId)?.src || ""}
                  onChange={(e) => updateElement(selectedId, "src", e.target.value)} style={{ marginLeft: 10 }}
                />
              </>
            )}
            {/* Text Settings */}
            {elements.find((el) => el.id === selectedId)?.type === "text" && (
              <>
                <TextAlignDropdown
                  selectedId={selectedId}
                  updateElement={updateElement}
                  elements={elements}
                />
                <VerticalAlignDropdown
                  selectedId={selectedId}
                  elements={elements}
                  updateElement={updateElement}
                />
                {/* Font color */}
                <div className="relative" style={{ marginLeft: 20 }}>
                  <label
                    htmlFor={`color-picker-${selectedId}`}
                    title="Font Color"
                    className="text-sm"
                  >
                    <CustomBaseline />
                  </label>
                  <input
                    type="color"
                    id={`color-picker-${selectedId}`}
                    className="hidden"
                    onChange={(e) =>
                      updateElement(selectedId, "color", e.target.value)
                    }
                    value={selectedElement?.color || "#000000"}
                  />
                </div>
                {/* BG Color untuk box/elemen */}
                <div className="relative" style={{ marginLeft: 20 }}>
                  <label
                    htmlFor={`bgcolor-picker-${selectedId}`}
                    title="Background Box Color"
                    className="text-sm"
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                  >
                    <PaintBucket size={20} color="skyblue" />
                    <span style={{ fontSize: "12px" }}>Box BG</span>
                  </label>
                  <input
                    type="color"
                    id={`bgcolor-picker-${selectedId}`}
                    className="hidden"
                    onChange={(e) =>
                      updateElement(selectedId, "bgColor", e.target.value)
                    }
                    value={selectedElement?.bgColor || "#ffffff"}
                  />
                </div>
                {/* Font family */}
                <label className="text-sm" style={{ marginLeft: 20 }}>
                  <Type />
                </label>
                <select
                  onChange={(e) => updateElement(selectedId, "fontFamily", e.target.value)}
                  value={elements.find((el) => el.id === selectedId)?.fontFamily || "Montserrat, sans-serif"}
                  className="px-2 py-1 border text-black"
                  title="Font family"
                >
                  {["Montserrat, sans-serif", "Pacifico, cursive", "Roboto, sans-serif"].map((font) => (
                    <option
                      key={font}
                      value={font}
                      style={{ fontFamily: font, color: "black" }}
                    >
                      {font}
                    </option>
                  ))}
                </select>
                <label className="text-sm" style={{ marginLeft: 20 }}><h4 style={{ fontWeight: 'Bold' }}>A+</h4></label>
                <select
                  onChange={(e) => updateElement(selectedId, "fontSize", parseInt(e.target.value))}
                  value={elements.find((el) => el.id === selectedId)?.fontSize || 16}
                  className="px-2 py-1 border"
                >
                  {[12, 14, 16, 18, 20, 24, 28, 32, 36].map((s) => (
                    <option key={s} value={s} style={{ color: "black", paddingTop: "5px" }}>{s}px</option>
                  ))}
                </select>
                {/*Border Color*/}
                <div className="relative" style={{ marginLeft: 20 }}>
                  <label
                    htmlFor={`border-color-picker-${selectedId}`}
                    title="BorderColor"
                    className="text-sm"
                  >
                    <SquareDashed size={20} color="yellow" style={{ marginLeft: "25px" }} />
                    <h6 style={{ fontSize: "10px" }}>Border Color</h6>
                  </label>
                  <input
                    type="color"
                    id={`border-color-picker-${selectedId}`}
                    className="hidden"
                    onChange={(e) =>
                      updateElement(selectedId, "borderColor", e.target.value)
                    }
                    value={selectedElement?.borderColor || "#000000"}
                  />
                </div>
                <label className="text-sm" style={{ marginLeft: 20 }}>Border Radius</label>
                <select
                  onChange={(e) => updateElement(selectedId, "borderRadius", parseInt(e.target.value))}
                  value={elements.find((el) => el.id === selectedId)?.borderRadius || 0}
                  className="px-2 py-1 border"
                >
                  {[0, 4, 8, 12, 16, 18, 32].map((s) => (
                    <option key={s} value={s}>{s}px</option>
                  ))}
                </select>
                <div className="flex gap-2 items-center ml-4">
                  <button
                    onClick={() =>
                      updateElement(
                        selectedId,
                        "fontWeight",
                        elements.find((el) => el.id === selectedId)?.fontWeight === "bold" ? "normal" : "bold"
                      )
                    }
                    className="px-2 py-1" style={{ marginLeft: 20 }}
                  >
                    B
                  </button>
                  <button
                    onClick={() =>
                      updateElement(
                        selectedId,
                        "fontStyle",
                        elements.find((el) => el.id === selectedId)?.fontStyle === "italic" ? "normal" : "italic"
                      )
                    }
                    className="px-2 py-1 italic" style={{ marginLeft: 20 }}
                  >
                    I
                  </button>
                  <button
                    onClick={() =>
                      updateElement(
                        selectedId,
                        "textDecoration",
                        elements.find((el) => el.id === selectedId)?.textDecoration === "underline" ? "none" : "underline"
                      )
                    }
                    className="px-2 py-1 underline" style={{ marginLeft: 20, paddingRight: 30 }}
                  >
                    U
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Offset tinggi toolbox agar konten tidak tertutup */}
      <div
  className="mt-[120px] flex-1 flex justify-center w-full"
  style={{ overflowY: "auto", minHeight: 0,}}
>
  <div style={{height: 50}}>{/*jarak antara toolbox dan canvas */}

  </div>
  <div
    className="flex flex-col items-center w-[375px] min-h-0"
    style={{ minHeight: `${canvasHeight + 120}px` }} // +120 agar tombol di bawah canvas!
  >
    <div
      ref={canvasRef}
      className="relative w-full border rounded-md"
      style={{
        backgroundColor: canvasBg,
        height: `${canvasHeight}px`,
        transition: "height 0.3s",
      }}
    >
            {elements.map((el) => (
              <Rnd
                key={el.id}
                style={{
                  fontFamily: el.fontFamily || "Montserrat, sans-serif",
                }}
                default={{
                  x: el.x,
                  y: el.y,
                  width: el.width,
                  height: el.height,
                }}
                size={{ width: el.width, height: el.height }}
                position={{ x: el.x, y: el.y }}
                onDragStop={(_e, d) => {
                  updateElement(el.id, "x", d.x);
                  updateElement(el.id, "y", d.y);
                }}
                onResizeStop={(e, direction, ref, delta, position) => {
                  updateElement(el.id, "width", parseInt(ref.style.width));
                  updateElement(el.id, "height", parseInt(ref.style.height));
                  updateElement(el.id, "x", position.x);
                  updateElement(el.id, "y", position.y);
                }}
                bounds="parent"
                onClick={() => setSelectedId(el.id)}
              >
                {el.type === "image" ? (
                  <img
                    src={el.src}
                    alt="uploaded"
                    className={`w-full h-full object-contain ${selectedId === el.id ? "border border-blue-500" : "border border-transparent"
                      }`}
                  />
                ) : el.type === "button" ? (
                  <span
                    className={`flex items-center justify-center w-full h-full px-4 py-2 text-white bg-blue-600 rounded-md text-center ${selectedId === el.id ? "border border-blue-500" : "border border-transparent"
                      }`}
                  >
                    {el.text}
                  </span>
                ) : el.type === "youtube" ? (
                  <iframe
                    src={el.src}
                    className={`w-full h-full rounded-md ${selectedId === el.id ? "border border-blue-500" : "border border-transparent"
                      }`}
                    style={{ pointerEvents: "none" }}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : el.type === "text" ? (
                  <div
                    style={{
                      color: el.color || "black",
                      backgroundColor: el.bgColor || "transparent",
                      fontSize: el.fontSize || 16,
                      fontWeight: el.fontWeight || "normal",
                      fontStyle: el.fontStyle || "normal",
                      textDecoration: el.textDecoration || "none",
                      width: "100%",
                      height: "100%",
                      padding: "4px 8px",
                      overflow: "hidden",
                      display: "flex",
                      alignItems:
                        el.verticalAlign === "top"
                          ? "flex-start"
                          : el.verticalAlign === "middle"
                            ? "center"
                            : "flex-end",
                      justifyContent:
                        el.textAlign === "left"
                          ? "flex-start"
                          : el.textAlign === "center"
                            ? "center"
                            : "flex-end",
                      borderColor: el.borderColor,
                      borderRadius: el.borderRadius,
                    }}
                    className={`cursor-move border transition-all duration-200 ${selectedId === el.id ? "border-blue-500" : "border-transparent"
                      }`}
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updateElement(el.id, "text", e.target.innerText)}
                    onClick={() => setSelectedId(el.id)}
                  >
                    {el.text || "Tulis sesuatu..."}
                  </div>
                ) : null}
              </Rnd>
            ))}
          </div>
          
          
        </div>
      </div>
<div className="w-full flex flex-col items-center mt-4">
  {/* Tombol + */}
  <button
    style={{
      backgroundColor: "black",
      width: 40,
      height: 30,
      fontSize: 24,
      color: "white",
      borderRadius: "999px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "none",
      boxShadow: "0 2px 10px rgba(0,0,0,0.09)",
      marginBottom: 10,
      marginTop:10,
    }}
    onClick={increaseCanvasHeight}
    title="Tambah Tinggi Canvas"
  >
    +
  </button>
  {/* Tombol Save */}
  <button
    className="w-[90%] bg-blue-60 text-gray py-2 rounded-md hover:bg-blue-700 button"
    style={{ maxWidth: 375, marginLeft:"-30px"}}
    onClick={handleSaveToFirestore}
  >
    Save Landing Page to Firestore
  </button>
</div>
</div>
  );
}
