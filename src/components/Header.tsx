import React, { useState } from 'react';
import { 
  Database, 
  Sparkles, 
  FileText, 
  ExternalLink, 
  Moon, 
  Sun, 
  RefreshCw, 
  ShieldCheck, 
  CopyCheck,
  Calendar,
  Menu,
  LogOut,
  User,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UnpattiLogo } from './UnpattiLogo';
import { UNPATTI_INFO } from '../lib/defaultTemplates';

interface HeaderProps {
  onToggleSidebar?: () => void;
  onOpenCheatSheet: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onOpenCheatSheet }) => {
  const {
    currentYear,
    setCurrentYear,
    availableYears,
    isMirrorMode,
    toggleMirrorMode,
    isConnected,
    isSyncing,
    refreshAllData,
    isDark,
    toggleDarkMode,
    completenessStats,
    currentUser,
    logout
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0B192C]/95 dark:bg-[#071120]/95 backdrop-blur-md border-b border-amber-500/30 text-white shadow-md">
      <div className="px-3 sm:px-4 lg:px-6 py-2 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Mobile Drawer Toggle (min 44x44px touch target) & Official Branding */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden min-w-[44px] min-h-[44px] p-2.5 rounded-xl bg-slate-800/80 text-amber-300 hover:text-white hover:bg-slate-700 active:scale-95 transition-all flex items-center justify-center shrink-0 border border-slate-700/60"
            aria-label="Buka Menu Navigasi"
          >
            <Menu className="w-5 h-5 text-amber-400" />
          </button>

          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {/* Official Logo with Wikimedia URL */}
            <UnpattiLogo size={42} className="shrink-0 drop-shadow-md" />

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="font-extrabold text-xs sm:text-sm md:text-base tracking-tight text-white flex items-center gap-1">
                  <span className="text-amber-400">LPMPP</span> UNIVERSITAS PATTIMURA
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-400/15 text-amber-300 border border-amber-400/40">
                  Kode PT: {UNPATTI_INFO.kode_pt}
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Unggul</span>
                </span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-300/90 truncate flex items-center gap-1.5">
                <span className="font-medium text-amber-200">Portal Lapor Pusat Siklus PPEPP SPMI</span>
                <span className="text-slate-500 hidden sm:inline">·</span>
                <span className="text-slate-400 hidden sm:inline">Mirroring Kemdiktisaintek</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Actions, Mirror Mode Toggle, Global Year Filter, User Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Supabase Status Pill */}
          <div
            title={isConnected ? 'Database Supabase Cloud terhubung' : 'Mode lokal sinkron'}
            className={`hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
              isConnected
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
            }`}
          >
            <Database className="w-3 h-3 text-current animate-pulse" />
            <span>{isConnected ? 'Supabase' : 'Lokal'}</span>
          </div>

          {/* Sync / Refresh Button (min touch target) */}
          <button
            type="button"
            onClick={refreshAllData}
            disabled={isSyncing}
            title="Sinkronisasi Data Siklus"
            className="min-w-[40px] min-h-[40px] p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors flex items-center justify-center shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
          </button>

          {/* Special Mirror Mode Toggle */}
          <button
            type="button"
            onClick={toggleMirrorMode}
            className={`min-h-[40px] inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 ${
              isMirrorMode
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 ring-2 ring-amber-400/60 shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
            title="Sorot seluruh data dengan tombol salin cepat untuk pengisian ke portal kementerian"
          >
            {isMirrorMode ? (
              <>
                <CopyCheck className="w-4 h-4 text-slate-950 shrink-0" />
                <span className="hidden sm:inline">Mode Cermin:</span>
                <span>Siap Salin</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="hidden sm:inline">Mode</span>
                <span>Cermin</span>
              </>
            )}
          </button>

          {/* Global Cycle Year Filter (2020 - 2026) */}
          <div className="flex items-center pl-1 sm:pl-2 border-l border-slate-700/80">
            <div className="flex items-center gap-1 bg-amber-400/10 border border-amber-400/30 rounded-xl px-2 sm:px-2.5 py-1 min-h-[40px]">
              <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <label htmlFor="cycle-year-select" className="text-[11px] font-bold text-amber-300 hidden md:inline">
                Siklus:
              </label>
              <select
                id="cycle-year-select"
                value={currentYear}
                onChange={(e) => setCurrentYear(Number(e.target.value))}
                className="bg-transparent text-xs font-extrabold text-white focus:outline-none cursor-pointer pr-1"
              >
                {availableYears.map((yr) => (
                  <option key={yr} value={yr} className="bg-slate-900 text-white">
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Portal Utama LPMPP External Link */}
          <a
            href="https://portallpmpp.simpatti.site/"
            target="_blank"
            rel="noopener noreferrer"
            title="Kembali ke Portal Utama LPMPP (portallpmpp.simpatti.site)"
            className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-amber-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-amber-500/30 transition-colors"
          >
            <span>Portal LPMPP</span>
            <ExternalLink className="w-3 h-3 text-amber-400" />
          </a>

          {/* Dark / Light Toggle (min touch target) */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className="min-w-[40px] min-h-[40px] p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700/60 flex items-center justify-center shrink-0"
            aria-label="Ganti Tema"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-300" />}
          </button>

          {/* User Profile & Logout Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="min-w-[40px] min-h-[40px] p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/80 flex items-center gap-1.5 transition-colors"
              title="Profil Pengguna"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-400/40 font-bold flex items-center justify-center text-xs">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-2 z-50 text-slate-900 dark:text-white animate-in fade-in">
                <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="font-bold text-xs truncate">
                    {currentUser?.name || 'Pengelola SPMI'}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">
                    {currentUser?.email}
                  </div>
                  <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium truncate mt-0.5">
                    {currentUser?.role}
                  </div>
                </div>

                <div className="p-1.5 space-y-1">
                  <a
                    href="https://portallpmpp.simpatti.site/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
                  >
                    <span>Portal Utama LPMPP</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>

                  <a
                    href={UNPATTI_INFO.portal_spmi_kemdikbud}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
                  >
                    <span>Portal Kemdiktisaintek</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar (Halaman Login)</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Direct Logout Button */}
          <button
            type="button"
            onClick={logout}
            title="Keluar ke Halaman Login"
            className="min-w-[40px] min-h-[40px] p-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-400 border border-slate-700/60 hover:border-rose-500/40 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mirror Mode Notification Banner */}
      {isMirrorMode && (
        <div className="bg-amber-500/10 border-t border-amber-500/20 px-3 sm:px-4 py-1.5 text-xs text-amber-200 flex items-center justify-between overflow-x-hidden">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
            <span className="font-bold text-amber-300 shrink-0">Mode Cermin Aktif:</span>
            <span className="truncate">Tombol 📋 Salin Cepat aktif pada setiap isian data kementerian.</span>
          </div>
          <div className="hidden md:flex items-center gap-3 text-[11px] font-mono text-amber-300/80 shrink-0">
            <span>Siklus {currentYear}: {completenessStats.overallPercent}%</span>
            <span>·</span>
            <span>{completenessStats.validLinkCount} Tautan Publik</span>
          </div>
        </div>
      )}
    </header>
  );
};
