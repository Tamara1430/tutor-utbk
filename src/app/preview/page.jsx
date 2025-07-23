'use client';
import { useEffect, useState } from 'react';

export default function PreviewPage() {
  const [data, setData] = useState({ title: '', bgColor: '#fff' });

  useEffect(() => {
    const saved = localStorage.getItem('tutorPreview');
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: data.bgColor }}
    >
      <h1 className="text-4xl font-bold">{data.title || 'Preview Kamu'}</h1>
    </div>
  );
}
