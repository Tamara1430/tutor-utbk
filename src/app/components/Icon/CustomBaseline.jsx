// components/icons/CustomBaseline.jsx
const CustomBaseline = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Garis bawah */}
    <path d="M4 20h16" stroke="red" />

    {/* Segitiga atas */}
    <path d="m6 16 6-12 6 12" stroke="white" />

    {/* Garis horizontal tengah */}
    <path d="M8 12h8" stroke="white" />
  </svg>
);

export default CustomBaseline;
