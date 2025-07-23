import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
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

const VerticalAlignDropdown = ({ selectedId, elements, updateElement }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);

  const currentAlign =
    elements?.find((el) => el.id === selectedId)?.verticalAlign || "top";

  const handleChange = (align) => {
    updateElement(selectedId, "verticalAlign", align);
    setIsOpen(false);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-2 rounded"
        title="Vertical Align"
        style={{ marginLeft: 25 }}
      >
        {/* Tampilkan ikon + teks sesuai verticalAlign aktif */}
        <div className="flex items-center gap-2 p-2 rounded">
          {{
            top: (
              <>
                <AlignVerticalJustifyStart size={20} />
                <span>Top</span>
              </>
            ),
            middle: (
              <>
                <AlignVerticalJustifyCenter size={20} />
                <span>Middle</span>
              </>
            ),
            bottom: (
              <>
                <AlignVerticalJustifyEnd size={20} />
                <span>Bottom</span>
              </>
            ),
          }[currentAlign]}
        </div>
      </button>

      <Dropdown isOpen={isOpen} triggerRef={buttonRef}>
        <button
          onClick={() => handleChange("top")}
          className="flex items-center gap-2 px-3 py-2 rounded"
          style={{ backgroundColor: "white", color: "black", padding: 5, paddingRight: 10 }}
        >
          <AlignVerticalJustifyStart size={20} /> Top
        </button>
        <button
          onClick={() => handleChange("middle")}
          className="flex items-center gap-2 px-3 py-2 rounded"
          style={{ backgroundColor: "white", color: "black", padding: 5, paddingRight: 10 }}
        >
          <AlignVerticalJustifyCenter size={20} /> Middle
        </button>
        <button
          onClick={() => handleChange("bottom")}
          className="flex items-center gap-2 px-3 py-2 rounded"
          style={{ backgroundColor: "white", color: "black", padding: 5, paddingRight: 10 }}
        >
          <AlignVerticalJustifyEnd size={20} /> Bottom
        </button>
      </Dropdown>
    </>
  );
};

export default VerticalAlignDropdown;
