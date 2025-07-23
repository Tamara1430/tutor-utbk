'use client'
import { createContext, useContext, useState } from "react";

const PaketKelasContext = createContext();

export function PaketKelasProvider({ children }) {
  const [paketKelas, setPaketKelas] = useState([]);
  return (
    <PaketKelasContext.Provider value={{ paketKelas, setPaketKelas }}>
      {children}
    </PaketKelasContext.Provider>
  );
}

export function usePaketKelas() {
  const ctx = useContext(PaketKelasContext);
  console.log('DEBUG usePaketKelas context:', ctx); // <-- Tambah baris ini
  return ctx;
}
