'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import './auth.css'
import { Link, ImagePlay, Users,} from 'lucide-react';

export default function RoleSelection() {
  const router = useRouter(); 

  return (
    <div className="wrapper">
      <h2 className="header">Masuk sebagai siapa?</h2>
      <button className="masuk" onClick={() => router.push('/Auth/user')}>Sebagai User <ImagePlay size={20} style={{marginLeft:'45%'}}/></button>
    </div>
  );
}
