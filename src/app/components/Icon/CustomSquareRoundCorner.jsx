// components/icons/CostumeSquareRoundColor.jsx
const CostumeSquareRoundColor = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      {/* Kotak dengan sudut membulat */}
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="5"
        ry="5"
        fill="none"
        stroke="black"
        strokeWidth="2"
      />
      {/* Sudut kanan atas diwarnai, contoh: lingkaran kecil di pojok */}
      <circle cx="20" cy="4" r="3" fill="red" />
    </svg>
  );
  
  export default CostumeSquareRoundColor;
  