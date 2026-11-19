import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Plus, 
  ExternalLink, 
  Edit3, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  X,
  Copy,
  Users,
  GraduationCap,
  Scale
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PPEPPLogItem } from '../types/spmi';
import { CopyButton } from '../components/CopyButton';
import { GDriveField } from '../components/GDriveField';
import { generatePlorCaNarrative, generateCompactSummary } from '../lib/plorcaGenerator';
import { validateGDriveUrl } from '../lib/urlValidator';

export const EvaluasiView: React.FC = () => {
  const { 
    currentYear, 
    ppeppLogsList, 
    updatePPEPPLog, 
    targetPTList,
    copyToClipboard,
    addToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'evaluasi_umum' | 'mahasiswa' | 'dosen'>('evaluasi_umum');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PPEPPLogItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<PPEPPLogItem>({
    tahun: currentYear,
    tahap_ppepp: 'Evaluasi',
    kode_butir: '',
    kategori_evaluasi: 'Audit Mutu Internal',
    judul_kegiatan_atau_butir: '',
    unit_sumber: '',
    tanggal_pelaksanaan_selesai: `${currentYear}-09-30`,
    narasi_ringkas: '',
    plor_problem: '',
    plor_location: '',
    plor_objective_evidence: '',
    plor_reference: '',
    plor_correction: '',
    plor_action: '',
    gdrive_public_url: '',
    status_link_publik: 'Belum Divalidasi',
    status_verifikasi_lpmpp: 'Diverifikasi',
    realisasi_capaian: '',
    status_ketercapaian: 'Mencapai',
  });

  const evaluasiLogs = ppeppLogsList.filter(p => p.tahap_ppepp === 'Evaluasi');

  const handleOpenAdd = () => {
    setEditingItem(null);
    const count = evaluasiLogs.length + 1;
    setFormData({
      tahun: currentYear,
      tahap_ppepp: 'Evaluasi',
      kode_butir: `EVA-0${count}`,
      kategori_evaluasi: 'Audit Mutu Internal',
      judul_kegiatan_atau_butir: 'Audit Mutu Internal (AMI) Siklus Tambahan',
      unit_sumber: 'Pusat Audit Mutu Internal LPMPP Unpatti',
      tanggal_pelaksanaan_selesai: `${currentYear}-10-01`,
      narasi_ringkas: '',
      plor_problem: '',
      plor_location: 'Fakultas / Program Studi',
      plor_objective_evidence: '',
      plor_reference: 'Standar SPMI Unpatti & SN-Dikti',
      plor_correction: '',
      plor_action: '',
      gdrive_public_url: '',
      status_link_publik: 'Belum Divalidasi',
      status_verifikasi_lpmpp: 'Diverifikasi',
      realisasi_capaian: '100% Terlaksana',
      status_ketercapaian: 'Mencapai',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: PPEPPLogItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleGeneratePlorCa = () => {
    const narrative = generatePlorCaNarrative({
      judul: formData.judul_kegiatan_atau_butir,
      problem: formData.plor_problem,
      location: formData.plor_location,
      objective_evidence: formData.plor_objective_evidence,
      reference: formData.plor_reference,
      correction: formData.plor_correction,
      action: formData.plor_action,
    });

    setFormData(prev => ({
      ...prev,
      narasi_ringkas: narrative,
    }));

    addToast('success', 'Narasi PLOR+CA Dihasilkan', 'Teks ringkas siap salin telah dimasukkan ke dalam narasi deskripsi.');
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = validateGDriveUrl(formData.gdrive_public_url);
    const itemToSave: PPEPPLogItem = {
      ...formData,
      status_link_publik: val.isValidFormat ? 'Valid' : 'Format Tidak Valid',
    };
    await updatePPEPPLog(itemToSave);
    setIsModalOpen(false);
  };

  // Mock data for Tab 2: Mahasiswa & Tab 3: Dosen based on TargetPT
  const [mahasiswaRealisasi, setMahasiswaRealisasi] = useState([
    {
      indikator: 'Rata-rata Masa Studi Lulusan Sarjana (S1)',
      targetUnpatti: 'Maks. 5.0 Tahun (Target Rerata 4.0 Tahun)',
      realisasi: '3.9 Tahun',
      status: 'Melampaui' as const,
      catatan: 'Program pendampingan penulisan tugas akhir online berhasil mempercepat masa kelulusan.',
    },
    {
      indikator: 'Indeks Prestasi Kumulatif (IPK) Rata-rata Lulusan Sarjana',
      targetUnpatti: 'Min. 2.75 (Target Rerata 3.25)',
      realisasi: '3.42',
      status: 'Melampaui' as const,
      catatan: 'Penerapan kurikulum berbasis OBE dan rubrik asesmen transparan.',
    },
    {
      indikator: 'Persentase Kelulusan Tepat Waktu (KTW)',
      targetUnpatti: '>= 65% Mahasiswa',
      realisasi: '72.4%',
      status: 'Melampaui' as const,
      catatan: 'Sistem peringatan dini (early warning) bagi mahasiswa semester 7.',
    },
    {
      indikator: 'Sertifikasi Kompetensi / Bahasa Asing (TOEFL Min 450)',
      targetUnpatti: '100% Lulusan',
      realisasi: '89.6%',
      status: 'Mencapai' as const,
      catatan: 'Fasilitas tes TOEFL gratis di UPT Bahasa Unpatti bagi mahasiswa akhir.',
    },
    {
      indikator: 'Rata-rata Masa Tunggu Kerja Lulusan (< 6 Bulan)',
      targetUnpatti: '< 6 Bulan',
      realisasi: '3.8 Bulan',
      status: 'Melampaui' as const,
      catatan: 'Hasil tracer study terintegrasi sistem IKU kementerian.',
    },
  ]);

  const [dosenRealisasi, setDosenRealisasi] = useState([
    {
      indikator: 'Beban Kinerja Dosen (BKD) Memenuhi Syarat',
      targetUnpatti: '12 - 16 SKS per Semester (100% Dosen)',
      realisasi: '98.4%',
      status: 'Mencapai' as const,
      catatan: 'Verifikasi asesor BKD internal tersinkronisasi langsung ke SISTER.',
    },
    {
      indikator: 'Publikasi Ilmiah Guru Besar (Scopus/WoS Bereputasi)',
      targetUnpatti: 'Min. 1 Artikel / Tahun / Profesor',
      realisasi: '1.4 Artikel / Tahun',
      status: 'Melampaui' as const,
      catatan: 'Insentif riset Guru Besar dan kolaborasi konsorsium universitas kepulauan.',
    },
    {
      indikator: 'Dosen Berkualifikasi S3 (Doktor)',
      targetUnpatti: 'Min. 45% dari Total Dosen',
      realisasi: '48.2%',
      status: 'Melampaui' as const,
      catatan: 'Program beasiswa percepatan doktoral LPDP dan tugas belajar universitas.',
    },
    {
      indikator: 'Keterlibatan Praktisi / Dosen Berkegiatan di Luar Kampus',
      targetUnpatti: 'Min. 25% Dosen',
      realisasi: '28.1%',
      status: 'Melampaui' as const,
      catatan: 'Dosen membimbing magang industri kemaritiman dan perikanan.',
    },
  ]);

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="glass-panel p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-amber-500" />
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                Tahap Evaluasi SPMI & Audit Mutu Internal (Tahun {currentYear})
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Pelaksanaan Pemantauan, Audit Mutu Internal berinstrumen <strong className="text-amber-600 dark:text-amber-400">PLOR+CA</strong> (Dr. Bruri Melky Laimeheriwa), Evaluasi Diri, serta Capaian Realisasi Standar Mahasiswa & Dosen.
            </p>
          </div>

          {activeTab === 'evaluasi_umum' && (
            <button
              type="button"
              onClick={handleOpenAdd}
              className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs flex items-center gap-1.5 shadow-xs shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Laporan Evaluasi</span>
            </button>
          )}
        </div>

        {/* 3 Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('evaluasi_umum')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'evaluasi_umum'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>Tab 1: Evaluasi (4 Kategori Wajib & PLOR+CA)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/10 dark:bg-white/10">
              {evaluasiLogs.length} Butir
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('mahasiswa')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'mahasiswa'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Tab 2: Capaian Standar Mahasiswa</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dosen')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'dosen'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Tab 3: Capaian Standar Dosen</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          TAB 1: EVALUASI UMUM (4 KATEGORI WAJIB + PLOR+CA)
          ======================================================== */}
      {activeTab === 'evaluasi_umum' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evaluasiLogs.map((item) => (
              <div
                key={item.kode_butir}
                className="glass-panel p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 hover:border-amber-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {item.kode_butir}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                          {item.kategori_evaluasi || 'Audit Mutu Internal'}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                        {item.judul_kegiatan_atau_butir}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-[11px] text-slate-500 space-y-0.5">
                    <div>Unit Sumber: <strong className="text-slate-700 dark:text-slate-300">{item.unit_sumber}</strong></div>
                    <div>Selesai: {item.tanggal_pelaksanaan_selesai}</div>
                  </div>

                  {/* Narasi Ringkas */}
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                      <span>Narasi Evaluasi Siap Lapor Kementerian</span>
                      <CopyButton textToCopy={item.narasi_ringkas} label="Narasi Evaluasi" size="xs" buttonText="Salin Narasi" />
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans line-clamp-4 whitespace-pre-line">
                      {item.narasi_ringkas}
                    </p>
                  </div>

                  {/* Highlight PLOR+CA details if present */}
                  {item.plor_problem && (
                    <div className="p-2.5 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/60 text-[11px] space-y-1">
                      <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Formulir Baku PLOR+CA Terisi</span>
                      </div>
                      <div className="text-slate-700 dark:text-slate-300">
                        <strong>Problem:</strong> {item.plor_problem}
                      </div>
                      <div className="text-slate-600 dark:text-slate-400">
                        <strong>Koreksi & Tindakan:</strong> {item.plor_correction}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                  {item.gdrive_public_url ? (
                    <a
                      href={item.gdrive_public_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 truncate max-w-[180px]"
                    >
                      <span>Laporan Drive Publik</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  ) : (
                    <span className="text-xs text-rose-500">Belum ada tautan</span>
                  )}

                  <div className="flex items-center gap-1">
                    {item.gdrive_public_url && (
                      <CopyButton textToCopy={item.gdrive_public_url} label="Link Drive" size="xs" buttonText="Salin URL" />
                    )}
                    <CopyButton
                      textToCopy={`${item.judul_kegiatan_atau_butir}\n${item.narasi_ringkas}\nTautan Laporan: ${item.gdrive_public_url}`}
                      label={item.judul_kegiatan_atau_butir}
                      size="xs"
                      buttonText="Salin Baris"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: CAPAIAN STANDAR MAHASISWA
          ======================================================== */}
      {activeTab === 'mahasiswa' && (
        <div className="glass-panel rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Evaluasi Realisasi Capaian Standar Kemahasiswaan & Lulusan Unpatti (Tahun {currentYear})
              </h3>
              <p className="text-[11px] text-slate-500">
                Perbandingan antara target internal yang ditetapkan pada menu Penetapan dengan realisasi hasil audit lapangan.
              </p>
            </div>
            <CopyButton
              textToCopy={mahasiswaRealisasi.map(m => `${m.indikator} | Target: ${m.targetUnpatti} | Realisasi: ${m.realisasi} | Status: ${m.status}`).join('\n')}
              label="Rekap Capaian Mahasiswa"
              size="xs"
              buttonText="Salin Seluruh Tabel"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 font-semibold">
                <tr>
                  <th className="sticky left-0 z-10 bg-slate-100 dark:bg-slate-800 py-2.5 px-3 w-12 text-center shadow-xs">No</th>
                  <th className="py-2.5 px-3">Indikator Kinerja Mutu Mahasiswa</th>
                  <th className="py-2.5 px-3">Target Standar Unpatti</th>
                  <th className="py-2.5 px-3">Realisasi Tahun Berjalan</th>
                  <th className="py-2.5 px-3 text-center">Status Capaian</th>
                  <th className="py-2.5 px-3">Catatan Verifikasi Evaluasi</th>
                  <th className="py-2.5 px-3 text-right">Salin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {mahasiswaRealisasi.map((row, idx) => (
                  <tr key={row.indikator} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="sticky left-0 z-10 bg-white dark:bg-slate-900 py-3 px-3 text-center font-mono text-slate-500 shadow-xs">{idx + 1}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                      {row.indikator}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300">
                      {row.targetUnpatti}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-amber-600 dark:text-amber-400">
                      {row.realisasi}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{row.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[11px] text-slate-600 dark:text-slate-400">
                      {row.catatan}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <CopyButton
                        textToCopy={`${row.indikator}: Target ${row.targetUnpatti}, Realisasi ${row.realisasi} (${row.status}). Catatan: ${row.catatan}`}
                        label={row.indikator}
                        size="xs"
                        buttonText="Salin"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: CAPAIAN STANDAR DOSEN
          ======================================================== */}
      {activeTab === 'dosen' && (
        <div className="glass-panel rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Evaluasi Realisasi Capaian Standar Ketenagaan & Kinerja Dosen Unpatti
              </h3>
              <p className="text-[11px] text-slate-500">
                Pencapaian BKD, beban SKS, publikasi jurnal internasional Guru Besar, dan kualifikasi akademik.
              </p>
            </div>
            <CopyButton
              textToCopy={dosenRealisasi.map(d => `${d.indikator} | Target: ${d.targetUnpatti} | Realisasi: ${d.realisasi} | Status: ${d.status}`).join('\n')}
              label="Rekap Capaian Dosen"
              size="xs"
              buttonText="Salin Seluruh Tabel"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 font-semibold">
                <tr>
                  <th className="sticky left-0 z-10 bg-slate-100 dark:bg-slate-800 py-2.5 px-3 w-12 text-center shadow-xs">No</th>
                  <th className="py-2.5 px-3">Indikator Kinerja Mutu Dosen</th>
                  <th className="py-2.5 px-3">Target Standar Unpatti</th>
                  <th className="py-2.5 px-3">Realisasi Tahun Berjalan</th>
                  <th className="py-2.5 px-3 text-center">Status Capaian</th>
                  <th className="py-2.5 px-3">Catatan Rekomendasi Audit</th>
                  <th className="py-2.5 px-3 text-right">Salin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {dosenRealisasi.map((row, idx) => (
                  <tr key={row.indikator} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="sticky left-0 z-10 bg-white dark:bg-slate-900 py-3 px-3 text-center font-mono text-slate-500 shadow-xs">{idx + 1}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                      {row.indikator}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300">
                      {row.targetUnpatti}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-amber-600 dark:text-amber-400">
                      {row.realisasi}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{row.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[11px] text-slate-600 dark:text-slate-400">
                      {row.catatan}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <CopyButton
                        textToCopy={`${row.indikator}: Target ${row.targetUnpatti}, Realisasi ${row.realisasi} (${row.status}). Catatan: ${row.catatan}`}
                        label={row.indikator}
                        size="xs"
                        buttonText="Salin"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL FORMULIR EVALUASI + PLOR+CA AMI GENERATOR
          ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-amber-500" />
                  <span>{editingItem ? 'Edit Laporan Evaluasi / AMI' : 'Tambah Laporan Evaluasi Baru'}</span>
                </h3>
                <span className="text-[11px] text-amber-600 dark:text-amber-400">
                  Model Audit Mutu Internal (AMI) Berbasis PLOR+CA — Dr. Bruri Melky Laimeheriwa
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Kode Butir
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.kode_butir}
                    onChange={(e) => setFormData({ ...formData, kode_butir: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Kategori Evaluasi Wajib
                  </label>
                  <select
                    value={formData.kategori_evaluasi || 'Audit Mutu Internal'}
                    onChange={(e) => setFormData({ ...formData, kategori_evaluasi: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="Pemantauan">1. Pemantauan</option>
                    <option value="Audit Mutu Internal">2. Audit Mutu Internal (AMI)</option>
                    <option value="Evaluasi Diri">3. Evaluasi Diri (EDPS/UPPS)</option>
                    <option value="Asesmen">4. Asesmen Kecukupan / Akreditasi</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Tanggal Selesai
                  </label>
                  <input
                    type="date"
                    value={formData.tanggal_pelaksanaan_selesai}
                    onChange={(e) => setFormData({ ...formData, tanggal_pelaksanaan_selesai: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Judul Kegiatan / Butir Evaluasi <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.judul_kegiatan_atau_butir}
                  onChange={(e) => setFormData({ ...formData, judul_kegiatan_atau_butir: e.target.value })}
                  placeholder="Contoh: Audit Mutu Internal Siklus Tahunan Tingkat Program Studi & Unit Kerja"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Unit Sumber / Pelaksana Evaluasi
                </label>
                <input
                  type="text"
                  value={formData.unit_sumber || ''}
                  onChange={(e) => setFormData({ ...formData, unit_sumber: e.target.value })}
                  placeholder="Pusat Audit Mutu Internal LPMPP Unpatti"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              {/* SPECIAL SECTION: PLOR+CA FORMULIR TERSTRUKTUR (Khusus AMI) */}
              <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-slate-800/80 border border-amber-300/80 dark:border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-slate-900 dark:text-amber-300">
                      Formulir Temuan Terstruktur PLOR+CA
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleGeneratePlorCa}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Ringkasan Narasi PLOR+CA</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Isi 6 butir PLOR+CA di bawah ini, lalu klik tombol &quot;Generate Ringkasan Narasi&quot; untuk mengkompilasi deskripsi yang siap ditempel ke portal Kemdiktisaintek.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      1. Problem (Masalah / Ketidaksesuaian)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.plor_problem || ''}
                      onChange={(e) => setFormData({ ...formData, plor_problem: e.target.value })}
                      placeholder="Uraian ketidaksesuaian atau kesenjangan mutu yang ditemukan..."
                      className="w-full px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      2. Location (Lokasi / Prodi / Unit Audit)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.plor_location || ''}
                      onChange={(e) => setFormData({ ...formData, plor_location: e.target.value })}
                      placeholder="Fakultas Perikanan, Lab Biologi Kelautan, dll."
                      className="w-full px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      3. Objective Evidence (Bukti Objektif)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.plor_objective_evidence || ''}
                      onChange={(e) => setFormData({ ...formData, plor_objective_evidence: e.target.value })}
                      placeholder="Bukti rekaman berkas nilai, sampel 24 RPS, dll."
                      className="w-full px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      4. Reference (Klausul Standar Acuan)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.plor_reference || ''}
                      onChange={(e) => setFormData({ ...formData, plor_reference: e.target.value })}
                      placeholder="Standar Pendidikan Butir 3.4 & Permendikbudristek No. 53/2023"
                      className="w-full px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      5. Correction (Tindakan Koreksi Cepat)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.plor_correction || ''}
                      onChange={(e) => setFormData({ ...formData, plor_correction: e.target.value })}
                      placeholder="Tindakan langsung menangani ketidaksesuaian..."
                      className="w-full px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      6. Corrective Action (Tindakan Pencegahan Sistemik)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.plor_action || ''}
                      onChange={(e) => setFormData({ ...formData, plor_action: e.target.value })}
                      placeholder="Perbaikan akar masalah agar ketidaksesuaian tidak terulang..."
                      className="w-full px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Narasi Ringkas Final */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Narasi Ringkas Hasil Evaluasi (Kolom Deskripsi Kementerian) <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {formData.narasi_ringkas?.length || 0} Karakter
                  </span>
                </div>
                <textarea
                  rows={4}
                  required
                  value={formData.narasi_ringkas || ''}
                  onChange={(e) => setFormData({ ...formData, narasi_ringkas: e.target.value })}
                  placeholder="Narasi kompilasi hasil evaluasi atau hasil generate PLOR+CA..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-[11px] leading-relaxed"
                />
              </div>

              {/* GDrive field with check */}
              <GDriveField
                value={formData.gdrive_public_url || ''}
                onChange={(val) => setFormData({ ...formData, gdrive_public_url: val })}
                label="Tautan Laporan Evaluasi Publik Google Drive"
                required
              />

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
                >
                  Simpan Laporan Evaluasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
