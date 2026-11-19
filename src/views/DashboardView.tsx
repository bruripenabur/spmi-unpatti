import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  RefreshCw, 
  FileSpreadsheet, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  FileText, 
  Layers, 
  Share2,
  Clock,
  ArrowRight,
  LayoutDashboard,
  FileCheck2,
  Workflow,
  ClipboardCheck,
  ShieldAlert,
  Bell,
  Calendar,
  X,
  Download
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UNPATTI_INFO } from '../lib/defaultTemplates';
import { CopyButton } from '../components/CopyButton';
import { UnpattiLogo } from '../components/UnpattiLogo';
import { ANNOUNCEMENTS, AnnouncementItem } from './InformasiView';

export const DashboardView: React.FC = () => {
  const {
    currentYear,
    setCurrentYear,
    availableYears,
    siklus,
    completenessStats,
    isSyncing,
    handleInitializeTemplate,
    setActiveMenu,
    setActiveSubMenu,
    updateSiklusStatus,
    pengelolaList,
    penetapanList,
    ppeppLogsList,
  } = useApp();

  const [activeModalItem, setActiveModalItem] = useState<AnnouncementItem | null>(null);

  // 6 Quick Interactive Cards (3x2 Grid) matching requirement 2:
  // 1. Dashboard (Subjudul: SPMI Akhir PT)
  // 2. Penetapan (Subjudul: Jumlah Pengaturan Total)
  // 3. Pelaksanaan (Subjudul: Standar Pendidikan Tinggi)
  // 4. Evaluasi (Subjudul: Jumlah Evaluasi Total)
  // 5. Pengendalian (Subjudul: Jumlah Pengendalian Total)
  // 6. Peningkatan (Subjudul: Jumlah Peningkatan Total)
  const quickMenuCards = [
    {
      id: 'dashboard-stat',
      menuId: 'dashboard',
      title: 'Dashboard',
      subtitle: 'SPMI Akhir PT',
      metric: `${completenessStats.overallPercent}%`,
      metricLabel: 'Kesiapan Siklus',
      icon: LayoutDashboard,
      iconColor: 'text-blue-500',
      desc: 'Ringkasan rapot mutu, status akreditasi Unggul, dan kepatuhan kementerian.',
      badgeText: 'Status Institusi',
      badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
    },
    {
      id: 'penetapan-stat',
      menuId: 'penetapan',
      subId: 'komitmen_mutu',
      title: 'Penetapan',
      subtitle: 'Jumlah Pengaturan Total',
      metric: `${penetapanList.filter(p => p.status_ada).length} Butir`,
      metricLabel: 'SK Rektor & Matriks',
      icon: FileCheck2,
      iconColor: 'text-indigo-500',
      desc: 'Komitmen mutu, standar wajib SPMI Unpatti, dan mekanisme pendokumentasian.',
      badgeText: 'Matriks Regulasi',
      badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
    },
    {
      id: 'pelaksanaan-stat',
      menuId: 'pelaksanaan',
      title: 'Pelaksanaan',
      subtitle: 'Standar Pendidikan Tinggi',
      metric: '9 Sistem',
      metricLabel: 'Integrasi Terhubung',
      icon: Workflow,
      iconColor: 'text-emerald-500',
      desc: 'Konektivitas PDDikti, SISTER, BIMA, SIMKATMAWA, dan repositori mutu.',
      badgeText: 'Kementerian',
      badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
    },
    {
      id: 'evaluasi-stat',
      menuId: 'evaluasi',
      title: 'Evaluasi',
      subtitle: 'Jumlah Evaluasi Total',
      metric: `${ppeppLogsList.filter(p => p.tahap_ppepp === 'Evaluasi').length} Butir`,
      metricLabel: 'AMI PLOR+CA',
      icon: ClipboardCheck,
      iconColor: 'text-amber-500',
      desc: 'Audit Mutu Internal dengan formulir temuan baku PLOR+CA LPMPP Unpatti.',
      badgeText: 'Model PLOR+CA',
      badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
    },
    {
      id: 'pengendalian-stat',
      menuId: 'pengendalian',
      title: 'Pengendalian',
      subtitle: 'Jumlah Pengendalian Total',
      metric: `${ppeppLogsList.filter(p => p.tahap_ppepp === 'Pengendalian').length} Risalah`,
      metricLabel: 'RTM Pimpinan',
      icon: ShieldAlert,
      iconColor: 'text-purple-500',
      desc: 'Tindak lanjut koreksi audit dan risalah Rapat Tinjauan Manajemen universitas.',
      badgeText: 'Siklus RTM',
      badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
    },
    {
      id: 'peningkatan-stat',
      menuId: 'peningkatan',
      title: 'Peningkatan',
      subtitle: 'Jumlah Peningkatan Total',
      metric: `${ppeppLogsList.filter(p => p.tahap_ppepp === 'Peningkatan').length} Standar`,
      metricLabel: 'Elevasi Kaizen',
      icon: TrendingUp,
      iconColor: 'text-cyan-500',
      desc: 'Peningkatan standar baru melampaui capaian sebelumnya untuk siklus berikutnya.',
      badgeText: 'Kaizen Berkelanjutan',
      badgeColor: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300'
    },
  ];

  return (
    <div className="space-y-6">
      {/* 
        HEADER BANNER:
        Kotak biru penuh dengan judul "SISTEM PENJAMINAN MUTU INTERNAL",
        subjudul "Aplikasi Data Siklus PPEPP SPMI",
        dan dropdown filter Tahun (2024, 2025, 2026) yang memfilter data secara dinamis.
      */}
      <div className="bg-gradient-to-r from-[#0B192C] via-[#102A43] to-[#1E3A8A] text-white p-6 sm:p-7 rounded-2xl shadow-xl border border-blue-900/60 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <UnpattiLogo size={64} className="shrink-0 drop-shadow-md hidden sm:block mt-1" />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                  KODE PT: {UNPATTI_INFO.kode_pt}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Akreditasi Institusi: UNGGUL</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                SISTEM PENJAMINAN MUTU INTERNAL
              </h1>

              <div className="text-sm font-semibold text-blue-200">
                Aplikasi Data Siklus PPEPP SPMI &middot; Universitas Pattimura
              </div>

              <p className="text-xs text-blue-100/80 max-w-2xl leading-relaxed pt-1">
                Ruang kerja terpadu penyusunan instrumen mutu, validasi repositori Google Drive publik, audit berbasis <strong className="text-amber-300">PLOR+CA</strong>, serta penyedia salin cepat ke portal kementerian (<span className="font-mono text-blue-300">spmi.kemdiktisaintek.go.id</span>).
              </p>
            </div>
          </div>

          {/* Dynamic Year Filter Dropdown & Sync Button */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-stretch gap-3 shrink-0">
            <div>
              <label htmlFor="banner-cycle-year-select" className="block text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-1">
                Pilih Tahun Siklus SPMI:
              </label>
              <div className="flex items-center gap-2">
                <select
                  id="banner-cycle-year-select"
                  value={currentYear}
                  onChange={(e) => setCurrentYear(Number(e.target.value))}
                  className="bg-slate-900 text-white font-extrabold text-sm px-3.5 py-2 rounded-lg border border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer shadow-inner w-full"
                >
                  {availableYears.map((yr) => (
                    <option key={yr} value={yr} className="bg-slate-900 text-white font-bold">
                      Tahun Siklus {yr}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleInitializeTemplate}
                  disabled={isSyncing}
                  title="Inisialisasi / Sinkronkan template siklus ini"
                  className="p-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition-all shadow-md flex items-center justify-center shrink-0 cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            <div className="w-full text-right sm:text-left md:text-right pt-1">
              <span className="text-[10px] text-blue-200 font-mono">
                Kelengkapan Tahun {currentYear}: <strong className="text-amber-300">{completenessStats.overallPercent}%</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 
        GRID MENU CEPAT (6 KARTU INTERAKTIF 3x2)
        1. Dashboard (Subjudul: SPMI Akhir PT)
        2. Penetapan (Subjudul: Jumlah Pengaturan Total)
        3. Pelaksanaan (Subjudul: Standar Pendidikan Tinggi)
        4. Evaluasi (Subjudul: Jumlah Evaluasi Total)
        5. Pengendalian (Subjudul: Jumlah Pengendalian Total)
        6. Peningkatan (Subjudul: Jumlah Peningkatan Total)
      */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Menu Cepat Siklus PPEPP SPMI</span>
          </h2>
          <span className="text-xs text-slate-500">
            Klik kartu untuk navigasi langsung ke lembar kerja
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickMenuCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => {
                  setActiveMenu(card.menuId);
                  if (card.subId) setActiveSubMenu(card.subId);
                }}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-500/50 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Icon className={`w-5 h-5 ${card.iconColor}`} />
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${card.badgeColor}`}>
                      {card.badgeText}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {card.title}
                  </h3>

                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                    {card.subtitle}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    {card.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-base font-extrabold font-mono text-slate-900 dark:text-white">
                      {card.metric}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {card.metricLabel}
                    </div>
                  </div>

                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Buka</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 
        BAGIAN INFORMASI (PAPAN INFORMASI):
        Daftar pengumuman penting (panduan operasional SPMI, batas waktu pengisian, info sinkronisasi)
        Setiap kartu memiliki tombol aksi "Selengkapnya" yang memunculkan detail modal
      */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Papan Informasi & Pengumuman Mutu
              </h3>
              <p className="text-xs text-slate-500">
                Instruksi resmi penjaminan mutu dan batas waktu siklus PPEPP Kemdiktisaintek
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveMenu('informasi')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Lihat Semua Informasi</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ANNOUNCEMENTS.slice(0, 4).map((ann) => (
            <div
              key={ann.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between hover:border-blue-400 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="font-mono text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{ann.tanggal}</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    ann.kategori === 'Penting'
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                      : ann.kategori === 'Panduan'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                  }`}>
                    {ann.kategori}
                  </span>
                </div>

                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug mb-1.5">
                  {ann.judul}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {ann.ringkasan}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setActiveModalItem(ann)}
                  className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <span className="text-[11px] text-slate-400 font-mono">Kemdiktisaintek</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Dialog Detail Pengumuman */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                  {activeModalItem.kategori}
                </span>
                <div className="text-xs text-slate-400 mt-1 font-mono">
                  {activeModalItem.tanggal}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
              {activeModalItem.judul}
            </h3>

            <div className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700">
              {activeModalItem.isiLengkap}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <a
                href={activeModalItem.tautanKemdikbud}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-semibold hover:underline"
              >
                <span>Buka Portal Kemdiktisaintek</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
