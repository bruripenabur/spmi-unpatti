import React, { useState } from 'react';
import { 
  Download, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ExternalLink, 
  ShieldCheck, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TUT_WURI_LOGO_URL = '/assets/aistudio/TRANS-logo_tut_wuri_a8ba1332.png';
export const UNPATTI_LOGO_URL = '/assets/aistudio/Logo_Unpatti_New_d71c02b9.png';
export const KEMDIKBUD_BG_URL = '/assets/aistudio/image_143e08bf.png';

export const LoginView: React.FC = () => {
  const { login, addToast } = useApp();

  const [username, setUsername] = useState('001021-lp3mp');
  const [password, setPassword] = useState('hotumesse2026');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Username dan password wajib diisi');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      // Allow any reasonable username or default
      const success = login(username, password);
      setIsSubmitting(false);
      if (success) {
        addToast('success', 'Selamat Datang di SIMPATTI', `Berhasil login sebagai ${username}`);
      } else {
        setErrorMessage('Username atau password tidak sesuai.');
      }
    }, 350);
  };

  const handleQuickPreset = (presetUser: string, name: string) => {
    setUsername(presetUser);
    setPassword('hotumesse2026');
    setErrorMessage('');
    setIsSubmitting(true);
    setTimeout(() => {
      login(presetUser, 'hotumesse2026');
      setIsSubmitting(false);
      addToast('success', 'Selamat Datang', `Login sebagai ${name}`);
    }, 250);
  };

  const handleDownloadPanduan = () => {
    addToast('info', 'Mengunduh Panduan SPMI', 'Buku Pedoman Siklus PPEPP Kemdiktisaintek 2026 sedang diunduh.');
    window.open('https://spmi.kemdiktisaintek.go.id', '_blank');
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row font-sans selection:bg-blue-500/20 selection:text-blue-900">
      {/* 
        PANEL KIRI (LEBAR ~30%):
        Latar Ungu Gelap / Deep Violet dengan aksen garis geometris,
        Logo Tut Wuri Handayani berdampingan dengan Logo Unpatti,
        Judul "SISTEM PENJAMINAN MUTU INTERNAL", Deskripsi, Tombol "Download Panduan", Footer
      */}
      <div className="w-full lg:w-[32%] xl:w-[30%] bg-gradient-to-b from-[#38106A] via-[#330E63] to-[#250949] text-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden shrink-0 shadow-2xl">
        {/* Subtle geometric line patterns overlay */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="geometric-lines" width="60" height="60" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="60" y2="60" stroke="#FFFFFF" strokeWidth="0.8" />
                <line x1="60" y1="0" x2="0" y2="60" stroke="#FFFFFF" strokeWidth="0.8" />
                <circle cx="30" cy="30" r="1.5" fill="#FFFFFF" opacity="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#geometric-lines)" />
          </svg>
        </div>

        {/* Diagonal architectural glow line */}
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />

        {/* Bagian Atas: Logo Kementerian (Tut Wuri Handayani) & Logo Unpatti berdampingan sejajar */}
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4 pt-1">
            <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center p-1 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-md">
              <img
                src={TUT_WURI_LOGO_URL}
                alt="Logo Tut Wuri Handayani Kementerian Dikti"
                className="w-full h-full object-contain drop-shadow"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center p-1 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-md">
              <img
                src={UNPATTI_LOGO_URL}
                alt="Logo Resmi Universitas Pattimura"
                className="w-full h-full object-contain drop-shadow"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          </div>

          <div className="text-[11px] font-semibold tracking-wider uppercase text-amber-300/90 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>KEMDIKTISAINTEK &middot; UNIVERSITAS PATTIMURA</span>
          </div>
        </div>

        {/* Bagian Tengah: Judul Kapital & Deskripsi Lengkap & Tombol Download Panduan */}
        <div className="relative z-10 my-8 lg:my-auto space-y-5">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            SISTEM PENJAMINAN MUTU INTERNAL
          </h1>

          <p className="text-xs sm:text-sm text-violet-100/90 leading-relaxed font-light">
            memelihara dan meningkatkan mutu pendidikan tinggi secara berkelanjutan, yang dijalankan secara internal untuk mewujudkan visi dan misi PT, serta untuk memenuhi kebutuhan stakeholders melalui penyelenggaraan perguruan tinggi.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleDownloadPanduan}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-medium text-xs sm:text-sm shadow-lg hover:shadow-blue-500/25 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-white" />
              <span>Download Panduan</span>
            </button>
          </div>
        </div>

        {/* Bagian Bawah (Footer): Teks Kecil Hak Cipta */}
        <div className="relative z-10 pt-6 border-t border-white/10 text-[11px] text-violet-200/70 flex flex-col sm:flex-row lg:flex-col justify-between gap-2">
          <div>
            &copy; 2026 Sistem Penjaminan Mutu Internal - Universitas Pattimura
          </div>
          <div className="text-[10px] text-amber-300/80 font-mono">
            Kode PT: 001021 &middot; LPMPP
          </div>
        </div>
      </div>

      {/* 
        PANEL KANAN (LEBAR ~70%):
        Latar Gambar Gedung Kaca Modern bernuansa biru keabuan,
        Form Login di tengah: "Login Account", "Enter your username and password",
        input Username, input Password masked, tombol biru "Sign In"
      */}
      <div 
        className="flex-1 bg-slate-100 dark:bg-slate-900 relative flex flex-col justify-between items-center p-4 sm:p-8 lg:p-12 overflow-y-auto"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(241, 245, 249, 0.92), rgba(241, 245, 249, 0.85)), url(${KEMDIKBUD_BG_URL})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Top bar right side links */}
        <div className="w-full max-w-md flex items-center justify-between text-xs text-slate-500 mb-6">
          <div className="font-semibold text-slate-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Portal SPMI Online Siklus 2026</span>
          </div>

          <a
            href="https://portallpmpp.simpatti.site/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors font-medium"
          >
            <span>Portal LPMPP</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Centered Login Box */}
        <div className="w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-1.5">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
              Login Account
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter your username and password
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Input field Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="001021-lp3mp"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-blue-50/60 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Input field Password with masking */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showPassword ? 'Sembunyikan' : 'Lihat'}</span>
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-blue-50/60 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Tombol biru Sign In */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold text-sm shadow-md hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isSubmitting ? 'Memproses Masuk...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </form>

          {/* Quick Access Presets for Evaluator */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">
              Pilihan Akun Cepat LPMPP Unpatti:
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickPreset('001021-lp3mp', 'Dr. Bruri M. Laimeheriwa (Kapus Audit SPMI)')}
                className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700 text-left transition-colors cursor-pointer"
              >
                <div className="font-bold text-slate-800 dark:text-white truncate">001021-lp3mp</div>
                <div className="text-[10px] text-slate-500 truncate">Dr. Bruri (Kapus Audit)</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickPreset('001021-operator', 'Mario R. Silooy, M.Cs. (Operator SPMI)')}
                className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700 text-left transition-colors cursor-pointer"
              >
                <div className="font-bold text-slate-800 dark:text-white truncate">001021-operator</div>
                <div className="text-[10px] text-slate-500 truncate">Mario Silooy (Operator)</div>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom link info */}
        <div className="mt-6 text-center text-xs text-slate-500">
          <span>Butuh bantuan akses? Hubungi LPMPP Universitas Pattimura melalui </span>
          <a href="mailto:lpmpp@unpatti.ac.id" className="text-blue-600 hover:underline">
            lpmpp@unpatti.ac.id
          </a>
        </div>
      </div>
    </div>
  );
};
