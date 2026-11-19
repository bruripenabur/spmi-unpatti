import React, { useState } from 'react';
import { 
  BarChart3, 
  Search, 
  Filter, 
  Users, 
  GraduationCap, 
  Award, 
  TrendingUp, 
  Globe2, 
  Briefcase, 
  Info,
  Calendar
} from 'lucide-react';
import { UNPATTI_INFO } from '../lib/defaultTemplates';

export const PojokInfoView: React.FC = () => {
  const [selectedFakultas, setSelectedFakultas] = useState<string>('Semua');
  const [prodiSearch, setProdiSearch] = useState<string>('');
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);

  const fakultasList = [
    'Semua Program Studi (Universitas)',
    'Fakultas Keguruan dan Ilmu Pendidikan (FKIP)',
    'Fakultas Hukum (FH)',
    'Fakultas Ekonomi dan Bisnis (FEB)',
    'Fakultas Pertanian (FP)',
    'Fakultas Perikanan dan Ilmu Kelautan (FPIK)',
    'Fakultas Teknik (FT)',
    'Fakultas Kedokteran (FK)',
    'Fakultas MIPA',
    'Fakultas Ilmu Sosial dan Ilmu Politik (FISIP)',
  ];

  // 1. Grouped Bar: Mhs Baru vs Mhs Aktif per Semester (3 tahun terakhir)
  const mhsSemesterData = [
    { sem: 'Gasal 23/24', baru: 6840, aktif: 28900 },
    { sem: 'Genap 23/24', baru: 210, aktif: 28450 },
    { sem: 'Gasal 24/25', baru: 7150, aktif: 30200 },
    { sem: 'Genap 24/25', baru: 180, aktif: 29800 },
    { sem: 'Gasal 25/26', baru: 7420, aktif: 32418 },
    { sem: 'Genap 25/26', baru: 195, aktif: 31950 },
  ];

  // 2. Bar Chart: Mhs Asing vs Mhs Pindahan per Tahun
  const mhsAsingPindahanData = [
    { tahun: '2021', asing: 24, pindahan: 112 },
    { tahun: '2022', asing: 38, pindahan: 145 },
    { tahun: '2023', asing: 52, pindahan: 168 },
    { tahun: '2024', asing: 65, pindahan: 192 },
    { tahun: '2025', asing: 84, pindahan: 210 },
  ];

  // 3. Combo Chart: Dosen Serdos vs Total Dosen per Fakultas
  const serdosFakultasData = [
    { fak: 'FKIP', total: 280, serdos: 224, persen: 80.0 },
    { fak: 'FH', total: 130, serdos: 104, persen: 80.0 },
    { fak: 'FEB', total: 160, serdos: 125, persen: 78.1 },
    { fak: 'FP', total: 155, serdos: 122, persen: 78.7 },
    { fak: 'FPIK', total: 140, serdos: 112, persen: 80.0 },
    { fak: 'FT', total: 150, serdos: 105, persen: 70.0 },
    { fak: 'FK', total: 95, serdos: 62, persen: 65.3 },
    { fak: 'FMIPA', total: 130, serdos: 88, persen: 67.7 },
  ];

  // 4. Grouped Bar: Dosen Tetap per Program Pendidikan (Kualifikasi S2 vs S3)
  const dosenTetapJenjang = [
    { jenjang: 'Diploma', s2: 55, s3: 30, total: 85 },
    { jenjang: 'Sarjana (S1)', s2: 490, s3: 350, total: 840 },
    { jenjang: 'Magister (S2)', s2: 35, s3: 180, total: 215 },
    { jenjang: 'Doktor (S3)', s2: 0, s3: 65, total: 65 },
    { jenjang: 'Profesi', s2: 15, s3: 20, total: 35 },
  ];

  // 5. Grouped Bar: Dosen Tidak Tetap per Program Pendidikan
  const dosenTidakTetapJenjang = [
    { jenjang: 'Diploma', lb: 14, praktisi: 8, total: 22 },
    { jenjang: 'Sarjana (S1)', lb: 25, praktisi: 20, total: 45 },
    { jenjang: 'Magister (S2)', lb: 10, praktisi: 8, total: 18 },
    { jenjang: 'Doktor (S3)', lb: 6, praktisi: 2, total: 8 },
    { jenjang: 'Profesi (RSUD)', lb: 5, praktisi: 23, total: 28 },
  ];

  // 6. Bar Chart: Jabatan Fungsional Dosen
  const jafungData = [
    { jabatan: 'Tenaga Pengajar', count: 60, persen: 4.8, color: '#94A3B8' },
    { jabatan: 'Asisten Ahli', count: 210, persen: 16.9, color: '#38BDF8' },
    { jabatan: 'Lektor', count: 450, persen: 36.3, color: '#3B82F6' },
    { jabatan: 'Lektor Kepala', count: 380, persen: 30.6, color: '#6366F1' },
    { jabatan: 'Guru Besar / Profesor', count: 140, persen: 11.3, color: '#F59E0B' },
  ];

  return (
    <div className="space-y-6">
      {/* 
        FILTER HEADER BAR:
        Bar biru penuh di bagian atas:
        Nama PT: "001021 - Universitas Pattimura",
        Dropdown "Tampilkan Data",
        Kotak pencarian prodi
      */}
      <div className="bg-gradient-to-r from-[#0B192C] via-[#102A43] to-[#1E3A8A] text-white p-4 sm:p-5 rounded-2xl shadow-lg border border-blue-900/60">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                KODE PT: {UNPATTI_INFO.kode_pt}
              </span>
              <span className="text-xs font-semibold text-blue-200">
                Pojok Info Eksekutif Mutu & Statistik
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              POJOK INFO PERGURUAN TINGGI — UNIVERSITAS PATTIMURA
            </h1>
          </div>

          {/* Controls: Dropdown & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md rounded-xl px-3 py-1.5 border border-white/20">
              <Filter className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <label htmlFor="tampilkan-data-select" className="text-xs text-blue-200 font-medium">Tampilkan Data:</label>
              <select
                id="tampilkan-data-select"
                value={selectedFakultas}
                onChange={(e) => setSelectedFakultas(e.target.value)}
                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer max-w-[200px] truncate"
              >
                {fakultasList.map((f) => (
                  <option key={f} value={f} className="bg-slate-900 text-white">
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative min-w-[180px]">
              <Search className="w-3.5 h-3.5 text-blue-200 absolute left-3 top-2.5" />
              <input
                type="text"
                value={prodiSearch}
                onChange={(e) => setProdiSearch(e.target.value)}
                placeholder="Cari prodi / sub-unit..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder:text-blue-200/60 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 
        RINGKASAN METRIK KIRI & KANAN
        - Total Mahasiswa (32.418)
        - Total Dosen (1.240)
        - Dosen Bersertifikasi (942 / 76%)
        - Total Guru Besar (140)
      */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Total Mahasiswa</div>
            <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
              32.418
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">91% Status Aktif</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Total Dosen</div>
            <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
              1.240
            </div>
            <div className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">1.140 Dosen Tetap</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Dosen Serdos</div>
            <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
              942
            </div>
            <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">76,0% Tersertifikasi</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Guru Besar / Prof.</div>
            <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
              140
            </div>
            <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">11,3% dari Dosen</div>
          </div>
        </div>
      </div>

      {/* 
        6 GRAFIK ANALITIS INTERAKTIF (2 KOLOM GRID)
      */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 
          1. GROUPED BAR CHART: Jumlah Mahasiswa Baru vs Mahasiswa Aktif per Semester
        */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                1. Jumlah Mahasiswa Baru vs Mahasiswa Aktif per Semester
              </h3>
              <p className="text-xs text-slate-500">Perkembangan 3 tahun akademik terakhir</p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-xs bg-blue-500" />
                <span>Mhs Baru</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-xs bg-slate-700 dark:bg-slate-400" />
                <span>Mhs Aktif</span>
              </span>
            </div>
          </div>

          {/* SVG Grouped Bar Chart */}
          <div className="h-64 w-full relative">
            <svg className="w-full h-full" viewBox="0 0 500 240" preserveAspectRatio="none">
              {/* Grid Lines */}
              {[0, 10000, 20000, 30000].map((val, idx) => {
                const y = 200 - (val / 35000) * 180;
                return (
                  <g key={val}>
                    <line x1="45" y1={y} x2="490" y2={y} stroke="#E2E8F0" strokeDasharray="3 3" />
                    <text x="35" y={y + 4} fontSize="9" fill="#94A3B8" textAnchor="end" fontFamily="monospace">
                      {val.toLocaleString()}
                    </text>
                  </g>
                );
              })}

              {/* Bars */}
              {mhsSemesterData.map((d, i) => {
                const groupWidth = 65;
                const startX = 55 + i * 72;
                const hAktif = (d.aktif / 35000) * 180;
                const hBaru = (d.baru / 35000) * 180;

                return (
                  <g key={d.sem} className="cursor-pointer group">
                    {/* Bar Mhs Aktif */}
                    <rect
                      x={startX + 28}
                      y={200 - hAktif}
                      width="24"
                      height={hAktif}
                      fill="#334155"
                      rx="3"
                      className="transition-all hover:opacity-80"
                    >
                      <title>{`${d.sem} - Mhs Aktif: ${d.aktif.toLocaleString()} orang`}</title>
                    </rect>
                    {/* Bar Mhs Baru */}
                    <rect
                      x={startX}
                      y={200 - hBaru}
                      width="24"
                      height={hBaru}
                      fill="#3B82F6"
                      rx="3"
                      className="transition-all hover:opacity-80"
                    >
                      <title>{`${d.sem} - Mhs Baru: ${d.baru.toLocaleString()} orang`}</title>
                    </rect>

                    {/* Semester label */}
                    <text
                      x={startX + 26}
                      y="218"
                      fontSize="9"
                      fill="#64748B"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      {d.sem.replace(' ', '\n')}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="text-[11px] text-slate-500 text-center font-mono">
            Gasal 25/26 mencatat rekor tertinggi 32.418 mahasiswa aktif dan 7.420 mahasiswa baru Unpatti.
          </div>
        </div>

        {/* 
          2. BAR CHART: Jumlah Mahasiswa Asing vs Mahasiswa Pindahan
        */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                2. Jumlah Mahasiswa Asing vs Mahasiswa Pindahan
              </h3>
              <p className="text-xs text-slate-500">Pertumbuhan internasionalisasi & mobilitas mahasiswa Unpatti</p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-xs bg-emerald-500" />
                <span>Mhs Asing</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-xs bg-amber-500" />
                <span>Mhs Pindahan</span>
              </span>
            </div>
          </div>

          <div className="h-64 w-full relative">
            <svg className="w-full h-full" viewBox="0 0 500 240" preserveAspectRatio="none">
              {[0, 50, 100, 150, 200, 250].map((val) => {
                const y = 200 - (val / 250) * 180;
                return (
                  <g key={val}>
                    <line x1="35" y1={y} x2="490" y2={y} stroke="#E2E8F0" strokeDasharray="3 3" />
                    <text x="28" y={y + 4} fontSize="9" fill="#94A3B8" textAnchor="end" fontFamily="monospace">
                      {val}
                    </text>
                  </g>
                );
              })}

              {mhsAsingPindahanData.map((d, i) => {
                const startX = 60 + i * 85;
                const hAsing = (d.asing / 250) * 180;
                const hPindahan = (d.pindahan / 250) * 180;

                return (
                  <g key={d.tahun} className="cursor-pointer">
                    {/* Bar Asing */}
                    <rect
                      x={startX}
                      y={200 - hAsing}
                      width="30"
                      height={hAsing}
                      fill="#10B981"
                      rx="4"
                      className="transition-all hover:opacity-80"
                    >
                      <title>{`Tahun ${d.tahun} - Mhs Asing: ${d.asing} orang`}</title>
                    </rect>
                    <text x={startX + 15} y={192 - hAsing} fontSize="9" fill="#059669" textAnchor="middle" fontWeight="bold">
                      {d.asing}
                    </text>

                    {/* Bar Pindahan */}
                    <rect
                      x={startX + 36}
                      y={200 - hPindahan}
                      width="30"
                      height={hPindahan}
                      fill="#F59E0B"
                      rx="4"
                      className="transition-all hover:opacity-80"
                    >
                      <title>{`Tahun ${d.tahun} - Mhs Pindahan: ${d.pindahan} orang`}</title>
                    </rect>
                    <text x={startX + 51} y={192 - hPindahan} fontSize="9" fill="#D97706" textAnchor="middle" fontWeight="bold">
                      {d.pindahan}
                    </text>

                    <text x={startX + 33} y="220" fontSize="11" fill="#475569" textAnchor="middle" fontWeight="bold">
                      {d.tahun}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="text-[11px] text-slate-500 text-center font-mono">
            Mhs asing berasal dari Timor Leste, PNG, Belanda & program Erasmus+ Unpatti (Total 84 orang pada 2025).
          </div>
        </div>

        {/* 
          3. COMBO CHART: Dosen Memiliki Sertifikasi Pendidik (Serdos) vs Total Dosen
        */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                3. Dosen Bersertifikasi (Serdos) vs Total Dosen per Fakultas
              </h3>
              <p className="text-xs text-slate-500">Combo Bar (Jumlah Dosen) + Trend Line (Persentase %)</p>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-slate-300 dark:bg-slate-700" />
                <span>Total Dosen</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-blue-600" />
                <span>Serdos</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-rose-500" />
                <span>% Serdos</span>
              </span>
            </div>
          </div>

          <div className="h-64 w-full relative">
            <svg className="w-full h-full" viewBox="0 0 500 240" preserveAspectRatio="none">
              {/* Left axis (0 - 300) */}
              {[0, 100, 200, 300].map((val) => {
                const y = 200 - (val / 300) * 170;
                return (
                  <g key={val}>
                    <line x1="35" y1={y} x2="465" y2={y} stroke="#E2E8F0" strokeDasharray="3 3" />
                    <text x="30" y={y + 4} fontSize="9" fill="#94A3B8" textAnchor="end" fontFamily="monospace">
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Right axis (0 - 100%) */}
              <text x="475" y="35" fontSize="8" fill="#E11D48" textAnchor="start">100%</text>
              <text x="475" y="115" fontSize="8" fill="#E11D48" textAnchor="start">50%</text>
              <text x="475" y="195" fontSize="8" fill="#E11D48" textAnchor="start">0%</text>

              {/* Bars */}
              {serdosFakultasData.map((d, i) => {
                const startX = 45 + i * 53;
                const hTotal = (d.total / 300) * 170;
                const hSerdos = (d.serdos / 300) * 170;

                return (
                  <g key={d.fak} className="cursor-pointer">
                    {/* Bar Total */}
                    <rect
                      x={startX}
                      y={200 - hTotal}
                      width="18"
                      height={hTotal}
                      fill="#CBD5E1"
                      rx="3"
                    />
                    {/* Bar Serdos */}
                    <rect
                      x={startX + 18}
                      y={200 - hSerdos}
                      width="18"
                      height={hSerdos}
                      fill="#2563EB"
                      rx="3"
                    />
                    <text x={startX + 18} y="218" fontSize="9" fill="#475569" textAnchor="middle" fontWeight="bold">
                      {d.fak}
                    </text>
                  </g>
                );
              })}

              {/* Line trend for % Serdos */}
              <path
                d={serdosFakultasData.map((d, i) => {
                  const x = 45 + i * 53 + 18;
                  const y = 200 - (d.persen / 100) * 170;
                  return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ')}
                fill="none"
                stroke="#E11D48"
                strokeWidth="2.5"
              />

              {/* Points on Line */}
              {serdosFakultasData.map((d, i) => {
                const x = 45 + i * 53 + 18;
                const y = 200 - (d.persen / 100) * 170;
                return (
                  <circle
                    key={d.fak}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#FFFFFF"
                    stroke="#E11D48"
                    strokeWidth="2"
                  >
                    <title>{`${d.fak} - Persentase Serdos: ${d.persen}%`}</title>
                  </circle>
                );
              })}
            </svg>
          </div>
          <div className="text-[11px] text-slate-500 text-center font-mono">
            Rata-rata universitas: 76,0% (FKIP, FH, dan FPIK mencapai rasio sertifikasi pendidik tertinggi 80%).
          </div>
        </div>

        {/* 
          4. GROUPED BAR CHART: Jumlah Dosen Tetap Berdasarkan Program Pendidikan
        */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                4. Dosen Tetap Berdasarkan Program Pendidikan & Kualifikasi
              </h3>
              <p className="text-xs text-slate-500">Distribusi 1.140 Dosen Tetap Universitas Pattimura</p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-xs bg-sky-500" />
                <span>Magister (S2)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-xs bg-indigo-600" />
                <span>Doktor (S3)</span>
              </span>
            </div>
          </div>

          <div className="h-64 w-full relative">
            <svg className="w-full h-full" viewBox="0 0 500 240" preserveAspectRatio="none">
              {[0, 200, 400, 600, 800].map((val) => {
                const y = 200 - (val / 900) * 180;
                return (
                  <g key={val}>
                    <line x1="35" y1={y} x2="490" y2={y} stroke="#E2E8F0" strokeDasharray="3 3" />
                    <text x="28" y={y + 4} fontSize="9" fill="#94A3B8" textAnchor="end" fontFamily="monospace">
                      {val}
                    </text>
                  </g>
                );
              })}

              {dosenTetapJenjang.map((d, i) => {
                const startX = 55 + i * 88;
                const hS2 = (d.s2 / 900) * 180;
                const hS3 = (d.s3 / 900) * 180;

                return (
                  <g key={d.jenjang} className="cursor-pointer">
                    {/* Bar S2 */}
                    <rect
                      x={startX}
                      y={200 - hS2}
                      width="32"
                      height={hS2}
                      fill="#0EA5E9"
                      rx="3"
                    >
                      <title>{`${d.jenjang} - S2: ${d.s2} dosen`}</title>
                    </rect>
                    <text x={startX + 16} y={192 - hS2} fontSize="9" fill="#0284C7" textAnchor="middle" fontWeight="bold">
                      {d.s2}
                    </text>

                    {/* Bar S3 */}
                    <rect
                      x={startX + 36}
                      y={200 - hS3}
                      width="32"
                      height={hS3}
                      fill="#4F46E5"
                      rx="3"
                    >
                      <title>{`${d.jenjang} - S3: ${d.s3} dosen`}</title>
                    </rect>
                    <text x={startX + 52} y={192 - hS3} fontSize="9" fill="#4338CA" textAnchor="middle" fontWeight="bold">
                      {d.s3}
                    </text>

                    <text x={startX + 34} y="218" fontSize="10" fill="#475569" textAnchor="middle" fontWeight="bold">
                      {d.jenjang}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="text-[11px] text-slate-500 text-center font-mono">
            Jenjang S1 memiliki rasio dosen tetap terbesar (840 orang: 490 berkualifikasi S2 dan 350 berkualifikasi Doktor).
          </div>
        </div>

        {/* 
          5. GROUPED BAR CHART: Jumlah Dosen Tidak Tetap Berdasarkan Program Pendidikan
        */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                5. Dosen Tidak Tetap Berdasarkan Program Pendidikan
              </h3>
              <p className="text-xs text-slate-500">Dosen Luar Biasa (LB) & Dosen Praktisi Industri / Rumah Sakit (121 Total)</p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-xs bg-amber-500" />
                <span>Dosen Luar Biasa</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-xs bg-purple-500" />
                <span>Dosen Praktisi</span>
              </span>
            </div>
          </div>

          <div className="h-64 w-full relative">
            <svg className="w-full h-full" viewBox="0 0 500 240" preserveAspectRatio="none">
              {[0, 10, 20, 30].map((val) => {
                const y = 200 - (val / 30) * 180;
                return (
                  <g key={val}>
                    <line x1="35" y1={y} x2="490" y2={y} stroke="#E2E8F0" strokeDasharray="3 3" />
                    <text x="28" y={y + 4} fontSize="9" fill="#94A3B8" textAnchor="end" fontFamily="monospace">
                      {val}
                    </text>
                  </g>
                );
              })}

              {dosenTidakTetapJenjang.map((d, i) => {
                const startX = 55 + i * 88;
                const hLb = (d.lb / 30) * 180;
                const hPraktisi = (d.praktisi / 30) * 180;

                return (
                  <g key={d.jenjang} className="cursor-pointer">
                    {/* Bar LB */}
                    <rect
                      x={startX}
                      y={200 - hLb}
                      width="30"
                      height={hLb}
                      fill="#F59E0B"
                      rx="3"
                    >
                      <title>{`${d.jenjang} - LB: ${d.lb} orang`}</title>
                    </rect>
                    <text x={startX + 15} y={192 - hLb} fontSize="9" fill="#D97706" textAnchor="middle" fontWeight="bold">
                      {d.lb}
                    </text>

                    {/* Bar Praktisi */}
                    <rect
                      x={startX + 34}
                      y={200 - hPraktisi}
                      width="30"
                      height={hPraktisi}
                      fill="#A855F7"
                      rx="3"
                    >
                      <title>{`${d.jenjang} - Praktisi: ${d.praktisi} orang`}</title>
                    </rect>
                    <text x={startX + 49} y={192 - hPraktisi} fontSize="9" fill="#9333EA" textAnchor="middle" fontWeight="bold">
                      {d.praktisi}
                    </text>

                    <text x={startX + 32} y="218" fontSize="10" fill="#475569" textAnchor="middle" fontWeight="bold">
                      {d.jenjang.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="text-[11px] text-slate-500 text-center font-mono">
            Profesi Dokter & S1 Kedokteran diperkuat 23 dokter spesialis praktisi RSUD Dr. M. Haulussy Ambon.
          </div>
        </div>

        {/* 
          6. BAR CHART: Distribusi Dosen Berdasarkan Jabatan Fungsional
        */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                6. Distribusi Dosen Berdasarkan Jabatan Fungsional (Jafung)
              </h3>
              <p className="text-xs text-slate-500">Komposisi jenjang karier akademik 1.240 Dosen Unpatti</p>
            </div>
            <div className="text-xs font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
              Total 1.240
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {jafungData.map((item) => (
              <div key={item.jabatan} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {item.jabatan}
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {item.count} orang
                    </span>
                    <span className="text-[11px] text-slate-400">({item.persen}%)</span>
                  </div>
                </div>

                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${(item.count / 450) * 100}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
            <span>Rasio Lektor & Lektor Kepala: <strong>66,9%</strong></span>
            <span>Rasio Guru Besar: <strong>11,3% (140 Guru Besar)</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
