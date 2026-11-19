import React, { useState } from 'react';
import { 
  Bell, 
  Calendar, 
  ExternalLink, 
  FileText, 
  Search, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  X,
  Share2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface AnnouncementItem {
  id: string;
  tanggal: string;
  kategori: 'Penting' | 'Panduan' | 'Jadwal' | 'Audit';
  judul: string;
  ringkasan: string;
  isiLengkap: string;
  fileLampiran?: string;
  tautanKemdikbud?: string;
}

export const ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-1',
    tanggal: '10 Februari 2026',
    kategori: 'Penting',
    judul: 'Edaran Jadwal Pelaporan Siklus PPEPP SPMI Tahun 2026 ke Kemdiktisaintek',
    ringkasan: 'Seluruh perguruan tinggi diwajibkan menyelesaikan verifikasi dokumen penetapan dan unggah bukti sahih Google Drive paling lambat 30 April 2026.',
    isiLengkap: `Berdasarkan Surat Edaran Ditjen Diktisaintek No. 0142/E.E2/DT.01.01/2026 perihal Pelaporan Siklus SPMI PTN/PTS Tahun 2026:
1. Ruang kerja SIMPATTI Lapor Pusat digunakan sebagai instrumen pra-pelaporan resmi LPMPP Universitas Pattimura.
2. Setiap tautan Google Drive wajib diatur hak akses publik: "Anyone with the link can view".
3. Laporan evaluasi wajib menyertakan formulir Audit Mutu Internal (AMI) berbasis PLOR+CA.
4. Tim Task Force LPMPP siap mendampingi operator prodi dan fakultas dalam sesi pendampingan klinis setiap hari kerja.`,
    fileLampiran: 'SE_Dirjen_Diktisaintek_Pelaporan_SPMI_2026.pdf',
    tautanKemdikbud: 'https://spmi.kemdiktisaintek.go.id'
  },
  {
    id: 'ann-2',
    tanggal: '28 Januari 2026',
    kategori: 'Panduan',
    judul: 'Pedoman Standar SPMI & Standar Pendidikan Tinggi Unpatti Melampaui SN-Dikti',
    ringkasan: 'Matriks komitmen mutu dan standar SPMI Unpatti telah dimutakhirkan berdasarkan Permendikbudristek No. 53 Tahun 2023.',
    isiLengkap: `Pedoman Operasional SPMI LPMPP Unpatti Edisi 2026 mencakup:
- Standar Kompetensi Lulusan (IPK minimal kelulusan Unpatti S1 disetel 2.50 melampaui SN-Dikti 2.00).
- Standar Dosen (Beban maksimal 16 SKS per semester dengan kewajiban publikasi SINTA).
- Mekanisme pendokumentasian SOP repositori digital terpusat LPMPP.`,
    fileLampiran: 'Buku_Pedoman_SPMI_Unpatti_2026.pdf',
    tautanKemdikbud: 'https://spmi.kemdiktisaintek.go.id'
  },
  {
    id: 'ann-3',
    tanggal: '15 Januari 2026',
    kategori: 'Audit',
    judul: 'Kompilasi Formulir Audit Mutu Internal Model PLOR+CA LPMPP',
    ringkasan: 'Inovasi audit mutu internal Unpatti: Problem, Location, Objective Evidence, Reference, Correction, dan Corrective Action siap disalin ke sistem pusat.',
    isiLengkap: `Metode PLOR+CA dikembangkan oleh Pusat Audit Mutu & SPMI LPMPP (Dr. Bruri Melky Laimeheriwa):
- Mengidentifikasi akar permasalahan (Problem) secara objektif.
- Menentukan lokasi (Location) unit/jurusan/prodi yang diaudit.
- Menghadirkan bukti sahih (Objective Evidence).
- Mengacu pada regulasi (Reference).
- Tindakan perbaikan segera (Correction).
- Tindakan pencegahan sistemik berulang (Corrective Action).`,
    fileLampiran: 'Formulir_Baku_AMI_PLORCA_Unpatti.pdf',
    tautanKemdikbud: 'https://spmi.kemdiktisaintek.go.id'
  },
  {
    id: 'ann-4',
    tanggal: '05 Januari 2026',
    kategori: 'Jadwal',
    judul: 'Rapat Tinjauan Manajemen (RTM) Siklus Pengendalian Tingkat Rektorat',
    ringkasan: 'Risalah RTM yang dipimpin Rektor Unpatti menjadi dasar pengisian lembar tahapan Pengendalian dan Peningkatan (Kaizen).',
    isiLengkap: `Risalah Resmi RTM Universitas Pattimura Tahun 2026 menegaskan 12 rekomendasi strategis:
1. Peningkatan akreditasi prodi dari Baik Sekali menuju Unggul.
2. Pengalokasian dana pendampingan sertifikasi pendidik (Serdos).
3. Penguatan sarana laboratorium riset laut dalam dan kepulauan.`,
    fileLampiran: 'Risalah_Resmi_RTM_Unpatti_2026.pdf',
    tautanKemdikbud: 'https://spmi.kemdiktisaintek.go.id'
  }
];

export const InformasiView: React.FC = () => {
  const { addToast } = useApp();
  const [search, setSearch] = useState('');
  const [selectedKategori, setSelectedKategori] = useState<string>('Semua');
  const [activeModalItem, setActiveModalItem] = useState<AnnouncementItem | null>(null);

  const filteredAnnouncements = ANNOUNCEMENTS.filter(a => {
    const matchSearch = a.judul.toLowerCase().includes(search.toLowerCase()) ||
                        a.ringkasan.toLowerCase().includes(search.toLowerCase());
    const matchKat = selectedKategori === 'Semua' || a.kategori === selectedKategori;
    return matchSearch && matchKat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white p-6 rounded-2xl shadow-lg border border-blue-600/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-300" />
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">
                Pusat Informasi & Pengumuman Resmi
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              PAPAN INFORMASI SPMI KEMDIKTISAINTEK & LPMPP
            </h1>
            <p className="text-xs text-blue-100/90 mt-1 max-w-2xl">
              Informasi terkini perihal petunjuk teknis, surat edaran kementerian, jadwal sinkronisasi, dan formulir baku mutu internal Universitas Pattimura.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative min-w-[200px]">
              <Search className="w-4 h-4 text-blue-200 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari pengumuman..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder:text-blue-200/60 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
              />
            </div>

            <select
              value={selectedKategori}
              onChange={(e) => setSelectedKategori(e.target.value)}
              className="py-1.5 px-3 rounded-xl bg-white/10 border border-white/20 text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              <option value="Semua" className="bg-slate-900">Semua Kategori</option>
              <option value="Penting" className="bg-slate-900">Penting</option>
              <option value="Panduan" className="bg-slate-900">Panduan</option>
              <option value="Jadwal" className="bg-slate-900">Jadwal</option>
              <option value="Audit" className="bg-slate-900">Audit PLOR+CA</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Announcements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAnnouncements.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.tanggal}</span>
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  item.kategori === 'Penting'
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                    : item.kategori === 'Panduan'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                }`}>
                  {item.kategori}
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug mb-2">
                {item.judul}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.ringkasan}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveModalItem(item)}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Baca Selengkapnya</span>
                <span>&rarr;</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  addToast('info', 'Mengunduh Dokumen', `Mengunduh lampiran ${item.fileLampiran}`);
                }}
                className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"
                title="Unduh Lampiran"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
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

            <div className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700">
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
                className="px-4 py-2 text-xs font-bold rounded-lg bg-slate-900 text-white hover:bg-slate-800"
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
