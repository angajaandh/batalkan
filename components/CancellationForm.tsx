'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CloudUpload, X, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';

export default function CancellationForm() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Security: Prevent context menu and copy/paste on certain elements
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (!selected.type.startsWith('image/')) {
        setError('Format file tidak didukung (gunakan JPG/PNG)');
        return;
      }
      if (selected.size > 5 * 1024 * 1024) {
        setError('Ukuran file maksimal 5MB');
        return;
      }
      setFile(selected);
      setError(null);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const res = await fetch('/api/cancel', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Terjadi kesalahan sistem. Silakan coba lagi nanti.');
      }
    } catch (err) {
      setError('Gagal menghubungi server. Periksa koneksi internet Anda.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-sm mx-auto"
      >
        <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-mandiri-blue mb-2">Permintaan Berhasil</h2>
        <p className="text-slate-600 mb-6 font-medium">
          Pengajuan pembatalan transaksi Anda telah diterima dan sedang diproses oleh sistem.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="w-full py-4 bg-mandiri-blue text-white rounded-full font-bold hover:bg-opacity-90 transition-all shadow-lg"
        >
          Selesai
        </button>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-xl relative overflow-hidden"
      >
        <h1 className="text-xl font-bold text-mandiri-blue text-center mb-1">Pembatalan Transaksi</h1>
        <p className="text-sm text-slate-500 text-center mb-6">
          Silakan unggah bukti transaksi yang ingin Anda batalkan secara resmi.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-3xl p-8 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[220px] ${
              preview ? 'border-mandiri-light-blue bg-blue-50' : 'border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-mandiri-light-blue'
            }`}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            
            <AnimatePresence mode="wait">
              {preview ? (
                <motion.div 
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10 p-2"
                >
                  <button 
                    type="button"
                    onClick={removeFile}
                    className="absolute top-4 right-4 z-20 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-md"
                  >
                    <X size={18} />
                  </button>
                  <div className="relative w-full h-full rounded-2xl overflow-hidden">
                    <Image 
                      src={preview} 
                      alt="Preview Transaksi" 
                      fill 
                      className="object-contain" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <CloudUpload className="w-14 h-14 text-mandiri-light-blue mx-auto mb-4" />
                  <p className="text-sm font-bold text-mandiri-light-blue">Pilih foto bukti transaksi</p>
                  <p className="text-xs text-slate-400 mt-2">Format: JPG, PNG (Maks. 5MB)</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-blue-50 border-l-4 border-mandiri-light-blue p-3 rounded-r-lg flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-mandiri-light-blue shrink-0 mt-0.5" />
            <p className="text-[11px] text-mandiri-blue font-semibold leading-relaxed">
              Pastikan bukti yang diunggah jelas dan terbaca. Data Anda dilindungi oleh sistem keamanan berlapis.
            </p>
          </div>

          {error && (
            <p className="text-xs text-red-500 font-bold text-center animate-pulse">{error}</p>
          )}

          <button 
            type="submit"
            disabled={!file || loading}
            className={`w-full py-4 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
              file && !loading 
                ? 'bg-mandiri-blue text-white shadow-lg cursor-pointer' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>Batalkan Transaksi Sekarang</>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
