import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Award, 
  Users, 
  GraduationCap, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  FileCheck2, 
  Search, 
  Filter, 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { UnpattiLogo } from '../components/UnpattiLogo';
import { UNPATTI_INFO } from '../lib/defaultTemplates';
import { CopyButton } from '../components/CopyButton';

// Real sample study programs of Universitas Pattimura (001021)
interface ProdiItem {
  no: number;
  kode: string;
  nama: string;
  status: 'Aktif' | 'Re-Akreditasi';
  jenjang: 'S1' | 'S2' | 'S3' | 'D3' | 'D4' | 'Profesi';
  akreditasi: 'Unggul' | 'Baik Sekali' | 'Baik' | 'A' | 'B' | 'Pertama';
  tanggalSk: string;
  rasioDosenMhs: string;
  fakultas: string;
}

const UNPATTI_PRODI_LIST: ProdiItem[] = [
  { no: 1, kode: '11201', nama: 'Pendidikan Dokter', status: 'Aktif', jenjang: 'S1', akreditasi: 'Unggul', tanggalSk: '12-06-2023', rasioDosenMhs: '1 : 12', fakultas: 'Kedokteran' },
  { no: 2, kode: '11901', nama: 'Profesi Dokter', status: 'Aktif', jenjang: 'Profesi', akreditasi: 'Unggul', tanggalSk: '24-08-2023', rasioDosenMhs: '1 : 8', fakultas: 'Kedokteran' },
  { no: 3, kode: '74201', nama: 'Ilmu Hukum', status: 'Aktif', jenjang: 'S1', akreditasi: 'Unggul', tanggalSk: '15-03-2022', rasioDosenMhs: '1 : 28', fakultas: 'Hukum' },
  { no: 4, kode: '74101', nama: 'Magister Ilmu Hukum', status: 'Aktif', jenjang: 'S2', akreditasi: 'Unggul', tanggalSk: '11-10-2022', rasioDosenMhs: '1 : 14', fakultas: 'Hukum' },
  { no: 5, kode: '74001', nama: 'Doktor Ilmu Hukum', status: 'Aktif', jenjang: 'S3', akreditasi: 'Baik Sekali', tanggalSk: '05-09-2023', rasioDosenMhs: '1 : 7', fakultas: 'Hukum' },
  { no: 6, kode: '61201', nama: 'Manajemen', status: 'Aktif', jenjang: 'S1', akreditasi: 'Unggul', tanggalSk: '20-04-2023', rasioDosenMhs: '1 : 32', fakultas: 'Ekonomi dan Bisnis' },
  { no: 7, kode: '62201', nama: 'Akuntansi', status: 'Aktif', jenjang: 'S1', akreditasi: 'Unggul', tanggalSk: '18-05-2023', rasioDosenMhs: '1 : 30', fakultas: 'Ekonomi dan Bisnis' },
  { no: 8, kode: '60201', nama: 'Ekonomi Pembangunan', status: 'Aktif', jenjang: 'S1', akreditasi: 'Baik Sekali', tanggalSk: '14-11-2022', rasioDosenMhs: '1 : 26', fakultas: 'Ekonomi dan Bisnis' },
  { no: 9, kode: '61101', nama: 'Magister Manajemen', status: 'Aktif', jenjang: 'S2', akreditasi: 'Baik Sekali', tanggalSk: '09-02-2023', rasioDosenMhs: '1 : 15', fakultas: 'Ekonomi dan Bisnis' },
  { no: 10, kode: '22201', nama: 'Teknik Sipil', status: 'Aktif', jenjang: 'S1', akreditasi: 'Baik Sekali', tanggalSk: '19-07-2023', rasioDosenMhs: '1 : 24', fakultas: 'Teknik' },
  { no: 11, kode: '21201', nama: 'Teknik Mesin', status: 'Aktif', jenjang: 'S1', akreditasi: 'Baik Sekali', tanggalSk: '22-08-2022', rasioDosenMhs: '1 : 22', fakultas: 'Teknik' },
  { no: 12, kode: '20201', nama: 'Teknik Elektro', status: 'Aktif', jenjang: 'S1', akreditasi: 'Baik Sekali', tanggalSk: '04-06-2023', rasioDosenMhs: '1 : 23', fakultas: 'Teknik' },
  { no: 13, kode: '26201', nama: 'Teknik Industri', status: 'Aktif', jenjang: 'S1', akreditasi: 'Baik', tanggalSk: '17-01-2024', rasioDosenMhs: '1 : 25', fakultas: 'Teknik' },
  { no: 14, kode: '27201', nama: 'Teknik Perminyakan', status: 'Aktif', jenjang: 'S1', akreditasi: 'Baik Sekali', tanggalSk: '29-09-2023', rasioDosenMhs: '1 : 18', fakultas: 'Teknik' },
  { no: 15, kode: '28201', nama: 'Teknik Geofisika', status: 'Aktif', jenjang: 'S1', akreditasi: 'Baik', tanggalSk: '15-08-2023', rasioDosenMhs: '1 : 19', fakultas: 'Teknik' },
  { no: 16, kode: '54201', nama: 'Agribisnis', status: 'Aktif', jenjang: 'S1', akreditasi: 'Unggul', tanggalSk: '08-04-2023', rasioDosenMhs: '1 : 27', fakultas: 'Pertanian' },
  { no: 17, kode: '54211', nama: 'Agroteknologi', status: 'Aktif', jenjang: 'S1', akreditasi: 'Baik Sekali', tanggalSk: '12-05-2022', rasioDosenMhs: '1 : 24', fakultas: 'Pertanian' },
  { no: 18, kode: '54231', nama: 'Teknologi Hasil Pertanian', status: 'Aktif', jenjang: 'S1', akreditasi: 'Baik Sekali', tanggalSk: '16-10-2023', rasioDosenMhs: '1 : 21', fakultas: 'Pertanian' },
  { no: 19, kode: '54251', nama: 'Peternakan', status: 'Aktif', jenjang: 'S1', akreditasi: 'Baik Sekali', tanggalSk: '21-07-2022', rasioDosenMhs: '1 : 20', fakultas: 'Pertanian' },
  { no: 20, kode: '54241', nama: 'Kehutanan', status: 'Aktif', jenjang: 'S1', akreditasi: 'Unggul', tanggalSk: '10-03-2023', rasioDosenMhs: '1 : 26', fakultas: 'Pertanian' },
  { no: 21, kode: '54101', nama: 'Magister Pertanian Lahan Kering', status: 'Aktif', jenjang: 'S2', akreditasi: 'Baik Sekali', tanggalSk: '27-11-2022', rasioDosenMhs: '1 : 12', fakultas: 'Pertanian' },
  { no: 22, kode: '56201', nama: 'Ilmu Kelautan', status: 'Aktif', jenjang: 'S1', akreditasi: 'Unggul', tanggalSk: '07-06-2023', rasioDosenMhs: '1 : 22', fakultas: 'Perikanan dan Ilmu Kelautan' },
  { no: 23, kode: '56211', nama: 'Manajemen Sumberdaya Perairan', status: 'Aktif', jenjang: 'S1', akreditasi: 'Unggul', tanggalSk: '14-09-2022', rasioDosenMhs: '1 : 21', fakultas: 'Perikanan dan Ilmu Kelautan' },
  { no: 24, kode: '56221', nama: 'Budidaya Perairan', status: 'Aktif', jenjang: 'S1', akreditasi: 'Baik Sekali', tanggalSk: '23-02-2023', rasioDosenMhs: '1 : 20', fakultas: 'Perikanan dan Ilmu Kelautan' },
  { no: 25, kode: '56231', nama: 'Teknologi Hasil Perikanan', status: 'Aktif', jenjang: 'S1', akreditasi: 'Baik Sekali', tanggalSk: '11-04-2022', rasioDosenMhs: '1 : 19', fakultas: 'Perikanan dan Ilmu Kelautan' },
  { no: 26, kode: '56101', nama: 'Magister Ilmu Kelautan', status: 'Aktif', jenjang: 'S2', akreditasi: 'Unggul', tanggalSk: '03-11-2023', rasioDosenMhs: '1 : 11', fakultas: 'Perikanan dan Ilmu Kelautan' },
  { no: 27, kode: '56001', nama: 'Doktor Ilmu Kelautan', status: 'Aktif', jenjang: 'S3', akreditasi: 'Unggul', tanggalSk: '18-08-2023', rasioDosenMhs: '1 : 6', fakultas: 'Perikanan dan Ilmu Kelautan' },
  { no: 28, kode: '84205', nama: 'Pendidikan Biologi', status: 'Aktif', jenjang: 'S1', akreditasi: 'Unggul', tanggalSk: '16-05-2023', rasioDosenMhs: '1 : 25', fakultas: 'FKIP' },
  { no: 29, kode: '84202', nama: 'Pendidikan Matematika', status: 'Aktif', jenjang: 'S1', akreditasi: 'Unggul', tanggalSk: '25-07-2022', rasioDosenMhs: '1 : 26', fakultas: 'FKIP' },
  { no: 30, kode: '84203', nama: 'Pendidikan Fisika', status: 'Aktif', jenjang: 'S1', akreditasi: 'Baik Sekali', tanggalSk: '13-09-2023', rasioDosenMhs: '1 : 22', fakultas: 'FKIP' },
  { no: 31, kode: '84204', nama: 'Pendidikan Kimia', status: 'Aktif', jenjang: 'S1', akreditasi: 'Baik Sekali', tanggalSk: '08-11-2022', rasioDosenMhs: '1 : 23', fakultas: 'FKIP' },
  { no: 32, kode: '86208', nama: 'Pendidikan Guru Sekolah Dasar (PGSD)', status: 'Aktif', jenjang: 'S1', akreditasi: 'Unggul', tanggalSk: '01-08-2023', rasioDosenMhs: '1 : 35', fakultas: 'FKIP' },
  { no: 33, kode: '87901', nama: 'Pendidikan Profesi Guru (PPG)', status: 'Aktif', jenjang: 'Profesi', akreditasi: 'Unggul', tanggalSk: '29-10-2023', rasioDosenMhs: '1 : 16', fakultas: 'FKIP' },
  { no: 34, kode: '84105', nama: 'Magister Pendidikan Biologi', status: 'Aktif', jenjang: 'S2', akreditasi: 'Unggul', tanggalSk: '14-04-2023', rasioDosenMhs: '1 : 12', fakultas: 'FKIP' },
  { no: 35, kode: '44201', nama: 'Matematika', status: 'Aktif', jenjang: 'S1', akreditasi: 'Baik Sekali', tanggalSk: '17-06-2023', rasioDosenMhs: '1 : 20', fakultas: 'MIPA' },
  { no: 36, kode: '45201', nama: 'Fisika', status: 'Aktif', jenjang: 'S1', akreditasi: 'Baik Sekali', tanggalSk: '22-03-2022', rasioDosenMhs: '1 : 18', fakultas: 'MIPA' },
  { no: 37, kode: '46201', nama: 'Kimia', status: 'Aktif', jenjang: 'S1', akreditasi: 'Unggul', tanggalSk: '09-12-2022', rasioDosenMhs: '1 : 21', fakultas: 'MIPA' },
  { no: 38, kode: '47201', nama: 'Biologi', status: 'Aktif', jenjang: 'S1', akreditasi: 'Unggul', tanggalSk: '05-05-2023', rasioDosenMhs: '1 : 23', fakultas: 'MIPA' },
  { no: 39, kode: '48201', nama: 'Farmasi', status: 'Aktif', jenjang: 'S1', akreditasi: 'Baik Sekali', tanggalSk: '30-08-2023', rasioDosenMhs: '1 : 24', fakultas: 'MIPA' },
  { no: 40, kode: '55201', nama: 'Teknik Informatika & Sistem Info', status: 'Aktif', jenjang: 'S1', akreditasi: 'Baik Sekali', tanggalSk: '18-09-2023', rasioDosenMhs: '1 : 29', fakultas: 'MIPA' },
  { no: 41, kode: '63201', nama: 'Ilmu Administrasi Negara', status: 'Aktif', jenjang: 'S1', akreditasi: 'Unggul', tanggalSk: '24-05-2023', rasioDosenMhs: '1 : 31', fakultas: 'ISIP' },
  { no: 42, kode: '70201', nama: 'Ilmu Komunikasi', status: 'Aktif', jenjang: 'S1', akreditasi: 'Baik Sekali', tanggalSk: '19-10-2022', rasioDosenMhs: '1 : 28', fakultas: 'ISIP' },
  { no: 43, kode: '67201', nama: 'Sosiologi', status: 'Aktif', jenjang: 'S1', akreditasi: 'Baik Sekali', tanggalSk: '11-06-2023', rasioDosenMhs: '1 : 25', fakultas: 'ISIP' },
  { no: 44, kode: '54401', nama: 'Budidaya Tanaman Perkebunan', status: 'Aktif', jenjang: 'D3', akreditasi: 'Baik', tanggalSk: '14-02-2023', rasioDosenMhs: '1 : 18', fakultas: 'Pertanian' },
  { no: 45, kode: '56401', nama: 'Teknologi Penangkapan Ikan', status: 'Aktif', jenjang: 'D3', akreditasi: 'Baik', tanggalSk: '20-03-2023', rasioDosenMhs: '1 : 16', fakultas: 'Perikanan dan Ilmu Kelautan' },
];

export const ProfilPTView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJenjang, setSelectedJenjang] = useState<string>('Semua');
  const [selectedAkreditasi, setSelectedAkreditasi] = useState<string>('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filtered study programs
  const filteredProdi = useMemo(() => {
    return UNPATTI_PRODI_LIST.filter(item => {
      const matchSearch = item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.kode.includes(searchQuery) ||
                          item.fakultas.toLowerCase().includes(searchQuery.toLowerCase());
      const matchJenjang = selectedJenjang === 'Semua' || item.jenjang === selectedJenjang;
      const matchAkreditasi = selectedAkreditasi === 'Semua' || item.akreditasi === selectedAkreditasi;
      return matchSearch && matchJenjang && matchAkreditasi;
    });
  }, [searchQuery, selectedJenjang, selectedAkreditasi]);

  const totalPages = Math.ceil(filteredProdi.length / itemsPerPage) || 1;
  const paginatedProdi = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProdi.slice(start, start + itemsPerPage);
  }, [filteredProdi, currentPage]);

  // Accreditation breakdown data (Total 89)
  const akreditasiData = [
    { label: 'Unggul', count: 28, percent: 31.5, color: '#10B981', textColor: 'text-emerald-500' },
    { label: 'Baik Sekali', count: 34, percent: 38.2, color: '#3B82F6', textColor: 'text-blue-500' },
    { label: 'Baik', count: 15, percent: 16.9, color: '#F59E0B', textColor: 'text-amber-500' },
    { label: 'A', count: 6, percent: 6.7, color: '#6366F1', textColor: 'text-indigo-500' },
    { label: 'B', count: 4, percent: 4.5, color: '#06B6D4', textColor: 'text-cyan-500' },
    { label: 'Pertama', count: 2, percent: 2.2, color: '#94A3B8', textColor: 'text-slate-400' },
  ];

  // Helper for SVG Donut arc
  const renderDonutSlices = (data: { count: number; color: string }[], total: number, size = 160, stroke = 26) => {
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    let accumulatedPercent = 0;

    return data.map((slice, idx) => {
      const slicePercent = slice.count / total;
      const strokeDashoffset = circumference * (1 - slicePercent);
      const rotation = accumulatedPercent * 360 - 90;
      accumulatedPercent += slicePercent;

      return (
        <circle
          key={idx}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={slice.color}
          strokeWidth={stroke}
          strokeDasharray={`${circumference * slicePercent} ${circumference}`}
          strokeDashoffset={0}
          transform={`rotate(${rotation} ${size / 2} ${size / 2})`}
          className="transition-all duration-500 hover:opacity-85"
        />
      );
    });
  };

  return (
    <div className="space-y-6">
      {/* 
        BAGIAN ATAS / PROFIL UTAMA
        - Kiri: Kartu biru informasi lembaga (Logo Unpatti, Kode PT, Nama PT, SK, Dosen 1.240, Tendik 685)
        - Kanan: Status & Kontak (Aktif, Akreditasi Unggul, Alamat, Telp, Fax, Email, Website)
        - Donut Chart: "Statistik Akreditasi yang Didapat"
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Kartu Informasi Lembaga (sebelah kiri berlatar belakang biru) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0B192C] via-[#102A43] to-[#1E3A8A] text-white p-6 rounded-2xl shadow-lg border border-blue-900/60 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-start gap-4 mb-4">
              <div className="p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner">
                <UnpattiLogo size={62} />
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                  KODE PT: {UNPATTI_INFO.kode_pt}
                </span>
                <h2 className="text-xl font-extrabold tracking-tight text-white mt-1 leading-snug">
                  UNIVERSITAS PATTIMURA
                </h2>
                <div className="text-xs text-blue-200 mt-0.5 font-medium">
                  Hotumese — Kampus Poka Ambon
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-blue-100/90 pt-2 border-t border-white/15">
              <div className="flex items-start justify-between gap-2">
                <span className="text-blue-300">SK Pendirian PT:</span>
                <span className="font-semibold text-right font-mono text-[11px] text-white">
                  Keppres RI No. 66 Thn 1963
                </span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-blue-300">Tanggal SK PT:</span>
                <span className="font-semibold text-right text-white">23 April 1963</span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-blue-300">SK Akreditasi Institusi:</span>
                <span className="font-semibold text-right font-mono text-[11px] text-amber-300">
                  1021/SK/BAN-PT/Ak/PT/IV/2023
                </span>
              </div>
            </div>
          </div>

          {/* Statistik Dosen & Tendik di bagian bawah kartu biru */}
          <div className="grid grid-cols-2 gap-3 pt-4 mt-4 border-t border-white/15">
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/15">
              <div className="text-[11px] text-blue-200 flex items-center gap-1.5 mb-1">
                <Users className="w-3.5 h-3.5 text-amber-300" />
                <span>Jumlah Dosen</span>
              </div>
              <div className="text-xl font-extrabold font-mono text-white">
                1.240
              </div>
              <div className="text-[10px] text-emerald-300 mt-0.5">
                942 Bersertifikat Pendidik
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/15">
              <div className="text-[11px] text-blue-200 flex items-center gap-1.5 mb-1">
                <Building2 className="w-3.5 h-3.5 text-blue-300" />
                <span>Tenaga Kependidikan</span>
              </div>
              <div className="text-xl font-extrabold font-mono text-white">
                685
              </div>
              <div className="text-[10px] text-blue-200 mt-0.5">
                PNS & PPPK Unpatti
              </div>
            </div>
          </div>
        </div>

        {/* Status & Kontak + Donut Akreditasi (sebelah kanan) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status & Contact Details */}
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-sm text-slate-800 dark:text-white">Status & Legalitas PT</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Aktif</span>
                </span>
              </div>

              <div className="space-y-2 text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-2">
                  <Award className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-white">Akreditasi Perguruan Tinggi:</span>
                    <div className="font-extrabold text-amber-700 dark:text-amber-400 text-sm">
                      UNGGUL (s.d. 18 April 2028)
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-white">Alamat Kampus:</span>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Jl. Ir. M. Putuhena, Kampus Poka, Ambon, Maluku (Kode Pos: 97233)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Telp: +62 911 3824001 / Fax: +62 911 3824002</span>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>humas@unpatti.ac.id &middot; lpmpp@unpatti.ac.id</span>
                </div>

                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-500 shrink-0" />
                  <a href="https://unpatti.ac.id" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                    https://unpatti.ac.id
                  </a>
                </div>
              </div>
            </div>

            {/* Donut Chart: Statistik Akreditasi yang Didapat */}
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              <h3 className="font-bold text-xs text-slate-800 dark:text-white mb-2 text-center">
                Statistik Akreditasi yang Didapat (Total 89 Prodi)
              </h3>

              <div className="relative flex items-center justify-center">
                <svg width="150" height="150" viewBox="0 0 160 160">
                  {renderDonutSlices(akreditasiData, 89, 160, 24)}
                </svg>
                <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-extrabold font-mono text-slate-900 dark:text-white">89</span>
                  <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Prodi</span>
                </div>
              </div>

              {/* Legend Grid */}
              <div className="grid grid-cols-3 gap-x-2 gap-y-1 mt-3 text-[11px] w-full">
                {akreditasiData.map(item => (
                  <div key={item.label} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600 dark:text-slate-400 truncate">{item.label}:</span>
                    <strong className="font-mono text-slate-900 dark:text-white">{item.count}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 
        BAGIAN TENGAH / STATISTIK MAHASISWA
        - Total Mahasiswa: 32.418 orang
        - Rincian per jenjang: Diploma (1.120), Sarjana (27.450), Sarjana Terapan (840), Doktor (380), Magister (2.140), Profesi (488)
        - 3 Grafik Donut / Ringkasan Analitis:
          1. Proporsi Jenjang Pendidikan
          2. Rasio Jenis Kelamin (Laki-laki 44% vs Perempuan 56%)
          3. Status Registrasi Mahasiswa (Aktif 91%, Cuti 4%, Non-Aktif 5%)
      */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Statistik Mahasiswa Universitas Pattimura
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Data terintegrasi PDDikti & SPMI Semester Gasal/Genap Tahun Akademik 2025/2026
            </p>
          </div>

          <div className="flex items-baseline gap-2 bg-blue-50 dark:bg-blue-950/40 px-3.5 py-1.5 rounded-xl border border-blue-200 dark:border-blue-900/60">
            <span className="text-xs text-blue-700 dark:text-blue-300 font-semibold">Total Mahasiswa:</span>
            <span className="text-lg font-extrabold font-mono text-blue-950 dark:text-blue-100">
              32.418
            </span>
            <span className="text-xs text-slate-500">Orang</span>
          </div>
        </div>

        {/* Rincian Angka per Jenjang */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { jenjang: 'Sarjana (S1)', count: '27.450', percent: '84,7%', color: 'border-blue-300 dark:border-blue-900 text-blue-600' },
            { jenjang: 'Magister (S2)', count: '2.140', percent: '6,6%', color: 'border-emerald-300 dark:border-emerald-900 text-emerald-600' },
            { jenjang: 'Diploma (D3)', count: '1.120', percent: '3,5%', color: 'border-amber-300 dark:border-amber-900 text-amber-600' },
            { jenjang: 'Sarjana Terapan (D4)', count: '840', percent: '2,6%', color: 'border-indigo-300 dark:border-indigo-900 text-indigo-600' },
            { jenjang: 'Profesi', count: '488', percent: '1,5%', color: 'border-purple-300 dark:border-purple-900 text-purple-600' },
            { jenjang: 'Doktor (S3)', count: '380', percent: '1,2%', color: 'border-rose-300 dark:border-rose-900 text-rose-600' },
          ].map((item) => (
            <div key={item.jenjang} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              <div className="text-[11px] font-semibold text-slate-500 truncate">{item.jenjang}</div>
              <div className="text-base font-extrabold font-mono text-slate-900 dark:text-white mt-1">
                {item.count}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 font-mono">{item.percent} dari total</div>
            </div>
          ))}
        </div>

        {/* 3 Donut Charts Analitis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* 1. Proporsi Jenjang */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center">
            <h4 className="text-xs font-bold text-slate-800 dark:text-white mb-2 text-center">
              1. Proporsi Jenjang Pendidikan
            </h4>
            <div className="relative flex items-center justify-center my-1">
              <svg width="130" height="130" viewBox="0 0 160 160">
                {renderDonutSlices([
                  { count: 27450, color: '#3B82F6' },
                  { count: 2140, color: '#10B981' },
                  { count: 1120, color: '#F59E0B' },
                  { count: 840, color: '#6366F1' },
                  { count: 488, color: '#8B5CF6' },
                  { count: 380, color: '#EC4899' },
                ], 32418, 160, 24)}
              </svg>
              <div className="absolute text-center">
                <span className="text-xs font-bold font-mono text-slate-800 dark:text-white">S1: 85%</span>
              </div>
            </div>
            <div className="w-full text-[11px] space-y-1 mt-2 text-slate-600 dark:text-slate-400">
              <div className="flex justify-between"><span>Sarjana (S1):</span> <strong className="font-mono text-slate-800 dark:text-slate-200">27.450 (84.7%)</strong></div>
              <div className="flex justify-between"><span>Pascasarjana (S2/S3):</span> <strong className="font-mono text-slate-800 dark:text-slate-200">2.520 (7.8%)</strong></div>
              <div className="flex justify-between"><span>Vokasi & Profesi:</span> <strong className="font-mono text-slate-800 dark:text-slate-200">2.448 (7.5%)</strong></div>
            </div>
          </div>

          {/* 2. Rasio Jenis Kelamin */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center">
            <h4 className="text-xs font-bold text-slate-800 dark:text-white mb-2 text-center">
              2. Rasio Jenis Kelamin Mahasiswa
            </h4>
            <div className="relative flex items-center justify-center my-1">
              <svg width="130" height="130" viewBox="0 0 160 160">
                {renderDonutSlices([
                  { count: 18154, color: '#EC4899' }, // Perempuan 56%
                  { count: 14264, color: '#0284C7' }, // Laki-laki 44%
                ], 32418, 160, 24)}
              </svg>
              <div className="absolute text-center">
                <span className="text-xs font-bold text-pink-600">56% P</span>
              </div>
            </div>
            <div className="w-full text-[11px] space-y-1.5 mt-2 text-slate-600 dark:text-slate-400">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                  <span>Perempuan (56%):</span>
                </span>
                <strong className="font-mono text-slate-800 dark:text-slate-200">18.154 Orang</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
                  <span>Laki-Laki (44%):</span>
                </span>
                <strong className="font-mono text-slate-800 dark:text-slate-200">14.264 Orang</strong>
              </div>
            </div>
          </div>

          {/* 3. Status Registrasi Mahasiswa */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center">
            <h4 className="text-xs font-bold text-slate-800 dark:text-white mb-2 text-center">
              3. Status Registrasi Semester Berjalan
            </h4>
            <div className="relative flex items-center justify-center my-1">
              <svg width="130" height="130" viewBox="0 0 160 160">
                {renderDonutSlices([
                  { count: 29500, color: '#10B981' }, // Aktif 91%
                  { count: 1297, color: '#F59E0B' },  // Cuti 4%
                  { count: 1621, color: '#EF4444' },  // Non-Aktif 5%
                ], 32418, 160, 24)}
              </svg>
              <div className="absolute text-center">
                <span className="text-xs font-bold text-emerald-600">91% Aktif</span>
              </div>
            </div>
            <div className="w-full text-[11px] space-y-1.5 mt-2 text-slate-600 dark:text-slate-400">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Aktif Kuliah (91%):</span>
                </span>
                <strong className="font-mono text-slate-800 dark:text-slate-200">29.500 Orang</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Cuti Akademik (4%):</span>
                </span>
                <strong className="font-mono text-slate-800 dark:text-slate-200">1.297 Orang</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>Non-Aktif / Belum KRS (5%):</span>
                </span>
                <strong className="font-mono text-slate-800 dark:text-slate-200">1.621 Orang</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 
        BAGIAN BAWAH / TABEL DAFTAR PROGRAM STUDI INTERAKTIF
        - Judul: "DAFTAR PROGRAM STUDI"
        - Fitur pencarian (search bar) dan filter jenjang pendidikan & akreditasi
        - Kolom tabel: NO, KODE PRODI, NAMA PROGRAM STUDI, STATUS, JENJANG, AKREDITASI, TANGGAL SK, RASIO DOSEN/MHS
      */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Table Header Bar with Filters */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                DAFTAR PROGRAM STUDI UNIVERSITAS PATTIMURA
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Menampilkan {filteredProdi.length} program studi terakreditasi BAN-PT / LAM di lingkungan Unpatti
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cari nama prodi / kode / fakultas..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            {/* Jenjang Filter */}
            <select
              value={selectedJenjang}
              onChange={(e) => {
                setSelectedJenjang(e.target.value);
                setCurrentPage(1);
              }}
              className="py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="Semua">Semua Jenjang</option>
              <option value="S1">S1 (Sarjana)</option>
              <option value="S2">S2 (Magister)</option>
              <option value="S3">S3 (Doktor)</option>
              <option value="D3">D3 (Diploma)</option>
              <option value="Profesi">Profesi</option>
            </select>

            {/* Akreditasi Filter */}
            <select
              value={selectedAkreditasi}
              onChange={(e) => {
                setSelectedAkreditasi(e.target.value);
                setCurrentPage(1);
              }}
              className="py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="Semua">Semua Akreditasi</option>
              <option value="Unggul">Unggul</option>
              <option value="Baik Sekali">Baik Sekali</option>
              <option value="Baik">Baik</option>
              <option value="A">A</option>
              <option value="B">B</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-3 text-center w-12">NO</th>
                <th className="py-3 px-3 w-28">KODE PRODI</th>
                <th className="py-3 px-4">NAMA PROGRAM STUDI</th>
                <th className="py-3 px-3 text-center w-24">STATUS</th>
                <th className="py-3 px-3 text-center w-24">JENJANG</th>
                <th className="py-3 px-3 text-center w-28">AKREDITASI</th>
                <th className="py-3 px-3 text-center w-28">TANGGAL SK</th>
                <th className="py-3 px-3 text-center w-28">RASIO DOSEN/MHS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
              {paginatedProdi.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Tidak ada program studi yang cocok dengan filter pencarian &quot;{searchQuery}&quot;
                  </td>
                </tr>
              ) : (
                paginatedProdi.map((p, index) => {
                  const absoluteNo = (currentPage - 1) * itemsPerPage + index + 1;
                  return (
                    <tr 
                      key={p.kode}
                      className="hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-3 text-center font-mono text-slate-400">
                        {absoluteNo}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-blue-700 dark:text-blue-400">
                        {p.kode}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        <div>{p.nama}</div>
                        <div className="text-[10px] text-slate-400 font-normal">Fakultas {p.fakultas}</div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-semibold">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                          {p.jenjang}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span 
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            p.akreditasi === 'Unggul' 
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                              : p.akreditasi === 'Baik Sekali'
                              ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                              : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                          }`}
                        >
                          {p.akreditasi}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-[11px] text-slate-500 dark:text-slate-400">
                        {p.tanggalSk}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-semibold text-slate-800 dark:text-slate-200">
                        {p.rasioDosenMhs}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        {totalPages > 1 && (
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <div>
              Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredProdi.length)} dari {filteredProdi.length} prodi
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-mono font-bold">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
