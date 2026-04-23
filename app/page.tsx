'use client';

import React from 'react';
import Image from 'next/image';
import CancellationForm from '@/components/CancellationForm';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Dynamic Security Overlays */}
      <div className="fixed top-0 bottom-0 left-0 w-3 md:w-5 security-pattern z-[100] border-r border-mandiri-blue/10 pointer-events-none" />
      <div className="fixed top-0 bottom-0 right-0 w-3 md:w-5 security-pattern z-[100] border-l border-mandiri-blue/10 pointer-events-none" />

      {/* Header */}
      <header className="bg-white py-4 shadow-sm flex justify-center items-center relative z-10">
        <div className="relative w-28 h-10">
          <Image 
            src="https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg" 
            alt="Bank Mandiri" 
            fill
            priority
            className="object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center pt-8 pb-20 relative z-10 px-4">
        <CancellationForm />
      </main>

      {/* Footer */}
      <footer className="bg-mandiri-footer text-white py-4 text-center text-xs font-medium fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-md mx-auto">
          © 2026 PT Bank Mandiri (Persero) Tbk. Seluruh hak cipta dilindungi.
        </div>
      </footer>

      {/* Decorative Background Accents */}
      <div className="absolute top-40 -left-20 w-64 h-64 bg-mandiri-blue/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 -right-20 w-64 h-64 bg-mandiri-gold/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
