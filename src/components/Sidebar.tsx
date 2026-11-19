import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Building2,
  BarChart3,
  FileCheck2, 
  Workflow, 
  ClipboardCheck, 
  ShieldAlert, 
  TrendingUp, 
  Award, 
  Bell,
  Users, 
  FileSpreadsheet, 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  X,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UnpattiLogo } from './UnpattiLogo';
import { UNPATTI_INFO } from '../lib/defaultTemplates';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const { 
    activeMenu, 
    setActiveMenu, 
    activeSubMenu, 
    setActiveSubMenu, 
    currentYear, 
    completenessStats 
  } = useApp();

  const [penetapanExpanded, setPenetapanExpanded] = useState<boolean>(true);

  const handleMenuClick = (menuId: string) => {
    setActiveMenu(menuId);
    onCloseMobile();
  };

  const handleSubMenuClick = (menuId: string, subId: string) => {
    setActiveMenu(menuId);
    setActiveSubMenu(subId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile & Tablet Backdrop overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs lg:hidden transition-opacity duration-300"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 lg:top-[57px] bottom-0 left-0 z-50 lg:z-30 w-80 lg:w-72 bg-[#0B192C] lg:bg-slate-900 border-r border-slate-800 text-slate-200 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header (Mobile/Tablet Close Button & Branding) */}
        <div className="p-4 border-b border-slate-800/90 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <UnpattiLogo size={40} className="shrink-0" />
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                <span>{UNPATTI_INFO.nama_pt}</span>
              </div>
              <div className="text-[11px] text-amber-300 font-mono">
                Siklus SPMI: {currentYear}
              </div>
            </div>
          </div>

          {/* Close button with min 44x44px touch target on mobile */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden min-w-[44px] min-h-[44px] p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 flex items-center justify-center shrink-0 border border-slate-700/60"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Progress Indicator */}
        <div className="px-4 py-3 bg-slate-950/30 border-b border-slate-800/60">
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="text-slate-400">Kesiapan Lapor Pusat</span>
            <span className="font-extrabold text-amber-400 font-mono text-xs">
              {completenessStats.overallPercent}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500 rounded-full"
              style={{ width: `${completenessStats.overallPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 font-mono">
            <span>{completenessStats.validLinkCount} Tautan Drive</span>
            <span>Kode PT: 001021</span>
          </div>
        </div>

        {/* 
          Navigation Menu (Strictly ordered per user specification):
          1. Dashboard
          2. Profil Perguruan Tinggi
          3. Pojok Info Perguruan Tinggi
          4. Penetapan (submenus: Pengaturan Komitmen Mutu, Pelaksana, Standar SPMI, Mekanisme Pendokumentasian)
          5. Pelaksanaan
          6. Evaluasi
          7. Pengendalian
          8. Peningkatan
          9. Dampak Terdampak
          10. Informasi
          11. Pengelola PT
          12. Lembar Rekap (Siap Salin)
        */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1 text-xs font-medium">
          {/* 1. Dashboard */}
          <button
            type="button"
            onClick={() => handleMenuClick('dashboard')}
            className={`w-full min-h-[42px] flex items-center justify-between px-3.5 py-2 rounded-xl transition-colors ${
              activeMenu === 'dashboard'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80 active:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Dashboard</span>
            </div>
            {completenessStats.overallPercent >= 90 && (
              <CheckCircle2 className={`w-4 h-4 ${activeMenu === 'dashboard' ? 'text-slate-950' : 'text-emerald-400'}`} />
            )}
          </button>

          {/* 2. Profil Perguruan Tinggi */}
          <button
            type="button"
            onClick={() => handleMenuClick('profil_pt')}
            className={`w-full min-h-[42px] flex items-center justify-between px-3.5 py-2 rounded-xl transition-colors ${
              activeMenu === 'profil_pt'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80 active:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <Building2 className="w-4 h-4 shrink-0" />
              <span>Profil Perguruan Tinggi</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
              Unggul
            </span>
          </button>

          {/* 3. Pojok Info Perguruan Tinggi */}
          <button
            type="button"
            onClick={() => handleMenuClick('pojok_info')}
            className={`w-full min-h-[42px] flex items-center justify-between px-3.5 py-2 rounded-xl transition-colors ${
              activeMenu === 'pojok_info'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80 active:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <BarChart3 className="w-4 h-4 shrink-0" />
              <span>Pojok Info Perguruan Tinggi</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">
              Statistik
            </span>
          </button>

          {/* 4. Penetapan (Accordion with 4 sub-menus) */}
          <div className="space-y-1">
            <div
              className={`w-full min-h-[42px] flex items-center justify-between px-3.5 py-2 rounded-xl transition-colors cursor-pointer ${
                activeMenu === 'penetapan'
                  ? 'bg-slate-800 text-amber-300 font-bold border border-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60 active:bg-slate-800'
              }`}
              onClick={() => {
                setActiveMenu('penetapan');
                setPenetapanExpanded(!penetapanExpanded);
              }}
            >
              <div className="flex items-center gap-3">
                <FileCheck2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Penetapan</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">
                  {completenessStats.penetapanPercent}%
                </span>
                {penetapanExpanded ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </div>

            {/* 4 Sub-menus for Penetapan */}
            {penetapanExpanded && (
              <div className="pl-4 pr-1 space-y-0.5 pt-0.5 border-l border-slate-800 ml-4">
                <button
                  type="button"
                  onClick={() => handleSubMenuClick('penetapan', 'komitmen_mutu')}
                  className={`w-full min-h-[36px] text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    activeMenu === 'penetapan' && activeSubMenu === 'komitmen_mutu'
                      ? 'bg-amber-400/20 text-amber-300 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <span>A. Pengaturan Komitmen Mutu</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSubMenuClick('penetapan', 'pelaksana')}
                  className={`w-full min-h-[36px] text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    activeMenu === 'penetapan' && activeSubMenu === 'pelaksana'
                      ? 'bg-amber-400/20 text-amber-300 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <span>B. Pelaksana</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSubMenuClick('penetapan', 'standar_spmi')}
                  className={`w-full min-h-[36px] text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    activeMenu === 'penetapan' && activeSubMenu === 'standar_spmi'
                      ? 'bg-amber-400/20 text-amber-300 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <span>C. Standar SPMI</span>
                  <span className="text-[10px] font-mono text-slate-500">3 Tab</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSubMenuClick('penetapan', 'mekanisme_dokumentasi')}
                  className={`w-full min-h-[36px] text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    activeMenu === 'penetapan' && activeSubMenu === 'mekanisme_dokumentasi'
                      ? 'bg-amber-400/20 text-amber-300 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <span>D. Mekanisme Pendokumentasian</span>
                </button>
              </div>
            )}
          </div>

          {/* 5. Pelaksanaan */}
          <button
            type="button"
            onClick={() => handleMenuClick('pelaksanaan')}
            className={`w-full min-h-[42px] flex items-center justify-between px-3.5 py-2 rounded-xl transition-colors ${
              activeMenu === 'pelaksanaan'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80 active:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <Workflow className="w-4 h-4 shrink-0" />
              <span>Pelaksanaan</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
              9 Sistem
            </span>
          </button>

          {/* 6. Evaluasi */}
          <button
            type="button"
            onClick={() => handleMenuClick('evaluasi')}
            className={`w-full min-h-[42px] flex items-center justify-between px-3.5 py-2 rounded-xl transition-colors ${
              activeMenu === 'evaluasi'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80 active:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <ClipboardCheck className="w-4 h-4 shrink-0" />
              <span>Evaluasi (PLOR+CA)</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">
              {completenessStats.evaluasiPercent}%
            </span>
          </button>

          {/* 7. Pengendalian */}
          <button
            type="button"
            onClick={() => handleMenuClick('pengendalian')}
            className={`w-full min-h-[42px] flex items-center justify-between px-3.5 py-2 rounded-xl transition-colors ${
              activeMenu === 'pengendalian'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80 active:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Pengendalian</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">
              {completenessStats.pengendalianPercent}%
            </span>
          </button>

          {/* 8. Peningkatan */}
          <button
            type="button"
            onClick={() => handleMenuClick('peningkatan')}
            className={`w-full min-h-[42px] flex items-center justify-between px-3.5 py-2 rounded-xl transition-colors ${
              activeMenu === 'peningkatan'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80 active:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="w-4 h-4 shrink-0" />
              <span>Peningkatan</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">
              {completenessStats.peningkatanPercent}%
            </span>
          </button>

          {/* 9. Dampak Terdampak */}
          <button
            type="button"
            onClick={() => handleMenuClick('dampak')}
            className={`w-full min-h-[42px] flex items-center justify-between px-3.5 py-2 rounded-xl transition-colors ${
              activeMenu === 'dampak'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80 active:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <Award className="w-4 h-4 shrink-0" />
              <span>Dampak Terdampak</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">
              4 Butir
            </span>
          </button>

          {/* 10. Informasi */}
          <button
            type="button"
            onClick={() => handleMenuClick('informasi')}
            className={`w-full min-h-[42px] flex items-center justify-between px-3.5 py-2 rounded-xl transition-colors ${
              activeMenu === 'informasi'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80 active:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 shrink-0" />
              <span>Informasi</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
              Papan Info
            </span>
          </button>

          {/* 11. Pengelola PT */}
          <button
            type="button"
            onClick={() => handleMenuClick('pengelola')}
            className={`w-full min-h-[42px] flex items-center justify-between px-3.5 py-2 rounded-xl transition-colors ${
              activeMenu === 'pengelola'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80 active:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 shrink-0" />
              <span>Pengelola PT</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
              LPMPP
            </span>
          </button>

          {/* 12. Lembar Rekap (Siap Salin) */}
          <div className="pt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={() => handleMenuClick('cheatsheet')}
              className={`w-full min-h-[44px] flex items-center justify-between px-3.5 py-2 rounded-xl transition-colors ${
                activeMenu === 'cheatsheet'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-extrabold shadow-md'
                  : 'text-amber-300 hover:text-white hover:bg-slate-800/90 border border-amber-500/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Lembar Rekap</span>
              </div>
              <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 bg-amber-400 text-slate-950 rounded">
                Siap Salin
              </span>
            </button>
          </div>
        </nav>

        {/* Footer links in sidebar */}
        <div className="p-3 border-t border-slate-800/90 bg-slate-950/70 text-xs text-slate-400 space-y-1.5">
          <a
            href="https://portallpmpp.simpatti.site/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between text-xs text-amber-300 hover:text-white font-medium p-1 rounded-lg hover:bg-slate-800/60 transition-colors"
          >
            <span>Portal Utama LPMPP</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="text-[10px] text-slate-500 leading-tight">
            &copy; 2026 LPMPP Universitas Pattimura. Inovasi Audit Mutu PLOR+CA oleh Dr. Bruri Melky Laimeheriwa.
          </div>
        </div>
      </aside>
    </>
  );
};
