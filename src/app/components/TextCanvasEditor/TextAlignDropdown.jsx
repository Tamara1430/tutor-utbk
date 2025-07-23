
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";

const Dropdown = ({ children, isOpen, triggerRef }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({ top: rect.bottom + 5, left: rect.left });
    }
  }, [isOpen, triggerRef]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="absolute z-50 border rounded shadow-lg p-2 flex flex-col gap-2"
      style={{ top: position.top, left: position.left, position: "fixed" }}
    >
      {children}
    </div>,
    document.body
  );
};

const TextAlignDropdown = ({ selectedId, elements, updateElement }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const currentAlign =
  elements?.find((el) => el.id === selectedId)?.textAlign || "left";
  const handleChange = (align) => {
    updateElement(selectedId, "textAlign", align);
    setIsOpen(false);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-2 rounded"
        title="Text Align"
        style={{marginLeft:25}}
      >
        {/* Tampilkan ikon sesuai align aktif */}
        <div className="flex items-center gap-2 p-2 rounded">
  {{
    left: (
      <>
        <AlignLeft size={20} />
        <span>Left</span>
      </>
    ),
    center: (
      <>
        <AlignCenter size={20} />
        <span>Center</span>
      </>
    ),
    right: (
      <>
        <AlignRight size={20} />
        <span>Right</span>
      </>
    ),
    justify: (
      <>
        <AlignJustify size={20} />
        <span>Justify</span>
      </>
    ),
  }[currentAlign]}
</div>

      </button>

<Dropdown isOpen={isOpen} triggerRef={buttonRef} style={{BorderRadius:8}}>
  <button
    onClick={() => handleChange("left")}
    className="flex items-center gap-2 px-3 py-2 rounded" style={{backgroundColor:"white", color:"black", padding:5, paddingRight:10}}
  >
    <AlignLeft size={20} /> Left
  </button>
  <button
    onClick={() => handleChange("center")}
    className="flex items-center gap-2 px-3 py-2 rounded" style={{backgroundColor:"white", color:"black", padding:5, paddingRight:10}}
  >
    <AlignCenter size={20} /> Center
  </button>
  <button
    onClick={() => handleChange("right")}
    className="flex items-center gap-2 px-3 py-2 rounded" style={{backgroundColor:"white", color:"black", padding:5, paddingRight:10}}
  >
    <AlignRight size={20} /> Right
  </button>
  <button
    onClick={() => handleChange("justify")}
    className="flex items-center gap-2 px-3 py-2 rounded" style={{backgroundColor:"white", color:"black", padding:5, paddingRight:10}}
  >
    <AlignJustify size={20} /> Justify
  </button>
</Dropdown>

    </>
  );
};

export default TextAlignDropdown;
