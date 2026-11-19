import React, { useState } from 'react';
import { 
  FileCheck2, 
  Plus, 
  ExternalLink, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  Save, 
  Calendar, 
  FileText, 
  Share2, 
  AlertTriangle,
  X,
  Layers,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PenetapanItem, TargetPT } from '../types/spmi';
import { CopyButton } from '../components/CopyButton';
import { GDriveField } from '../components/GDriveField';
import { validateGDriveUrl } from '../lib/urlValidator';

export const PenetapanView: React.FC = () => {
  const { 
    currentYear, 
    activeSubMenu, 
    setActiveSubMenu, 
    activeTab, 
    setActiveTab, 
    penetapanList, 
    updatePenetapan, 
    targetPTList, 
    updateTargetPTMatrix,
    isMirrorMode 
  } = useApp();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PenetapanItem | null>(null);

  // Editable local matrix for Tab 3: Standar Perguruan Tinggi
  const [localTargetPT, setLocalTargetPT] = useState<TargetPT[]>(() => targetPTList);
  const [isMatrixDirty, setIsMatrixDirty] = useState(false);

  // Sync if targetPTList updates
  React.useEffect(() => {
    setLocalTargetPT(targetPTList);
    setIsMatrixDirty(false);
  }, [targetPTList]);

  // Form State for Penetapan Item
  const [formData, setFormData] = useState<PenetapanItem>({
    tahun: currentYear,
    kategori_menu: 'komitmen_mutu',
    kode_item: '',
    nama_item: '',
    status_ada: true,
    bentuk_implementasi: 'Sistem unit tersendiri',
    nomor_sk_dokumen: '',
    tanggal_penetapan: `${currentYear}-01-15`,
    deskripsi_singkat: '',
    gdrive_public_url: '',
    status_link_publik: 'Belum Divalidasi',
  });

  const handleOpenAdd = (category: PenetapanItem['kategori_menu'], defaultTitle: string = '') => {
    setEditingItem(null);
    const count = penetapanList.filter(p => p.kategori_menu === category).length + 1;
    let codePrefix = 'KOM-';
    if (category === 'standar_spmi') codePrefix = 'STD-';
    if (category === 'standar_lainnya') codePrefix = 'STD-EXT-';
    if (category === 'mekanisme_dokumentasi') codePrefix = 'DOC-';

    setFormData({
      tahun: currentYear,
      kategori_menu: category,
      kode_item: `${codePrefix}0${count}`,
      nama_item: defaultTitle,
      status_ada: true,
      bentuk_implementasi: 'Sistem unit tersendiri',
      nomor_sk_dokumen: `SK Rektor No. ${count + 420}/UN13/SK/${currentYear}`,
      tanggal_penetapan: `${currentYear}-02-15`,
      deskripsi_singkat: '',
      gdrive_public_url: '',
      status_link_publik: 'Belum Divalidasi',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: PenetapanItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    const valRes = validateGDriveUrl(formData.gdrive_public_url);
    const toSave: PenetapanItem = {
      ...formData,
      status_link_publik: valRes.isValidFormat ? 'Valid' : 'Format Tidak Valid',
    };
    await updatePenetapan(toSave);
    setIsModalOpen(false);
  };

  // Matrix handlers
  const handleMatrixChange = (index: number, field: keyof TargetPT, value: string) => {
    setLocalTargetPT(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
    setIsMatrixDirty(true);
  };

  const handleSaveMatrix = async () => {
    await updateTargetPTMatrix(localTargetPT);
    setIsMatrixDirty(false);
  };

  // Filtered lists
  const komitmenList = penetapanList.filter(p => p.kategori_menu === 'komitmen_mutu');
  const standarSPMIList = penetapanList.filter(p => p.kategori_menu === 'standar_spmi');
  const standarLainList = penetapanList.filter(p => p.kategori_menu === 'standar_lainnya');
  const dokumentasiList = penetapanList.filter(p => p.kategori_menu === 'mekanisme_dokumentasi');

  return (
    <div className="space-y-6">
      {/* View Header with Sub-menu pills */}
      <div className="glass-panel p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-amber-500" />
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                Tahap Penetapan SPMI (Tahun Siklus {currentYear})
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Penyusunan dan legalitas dokumen Kebijakan, Manual, Standar SN-Dikti, Standar Penciri Kepulauan, serta Matriks Ketentuan Mahasiswa & Dosen Universitas Pattimura.
            </p>
          </div>
        </div>

        {/* 4 Sub-menu Selector */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveSubMenu('komitmen_mutu')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeSubMenu === 'komitmen_mutu'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>A. Pengaturan Komitmen Mutu</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/10 dark:bg-white/10">
              {komitmenList.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubMenu('pelaksana')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeSubMenu === 'pelaksana'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>B. Pelaksana (Organ SPMI)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/10 dark:bg-white/10">
              LPMPP &middot; GJM &middot; UJM
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubMenu('standar_spmi')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeSubMenu === 'standar_spmi'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>C. Standar SPMI</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/10 dark:bg-white/10">
              3 Tab
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubMenu('mekanisme_dokumentasi')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeSubMenu === 'mekanisme_dokumentasi'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>D. Mekanisme Pendokumentasian</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/10 dark:bg-white/10">
              {dokumentasiList.length}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================
          SUB-MENU A: PENGATURAN KOMITMEN MUTU
          ======================================================== */}
      {activeSubMenu === 'komitmen_mutu' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Daftar Komitmen & Kebijakan Mutu Wajib Kemdiktisaintek
            </h2>
            <button
              type="button"
              onClick={() => handleOpenAdd('komitmen_mutu', 'Pengaturan Tambahan Komitmen Mutu')}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambahkan Pengaturan Lain</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {komitmenList.map((item) => (
              <div
                key={item.kode_item}
                className="glass-panel p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 hover:border-amber-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {item.kode_item}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          item.status_ada
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-700 dark:text-rose-300'
                        }`}>
                          {item.status_ada ? 'Ada' : 'Tidak Ada'}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {item.nama_item}
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

                  {item.bentuk_implementasi && (
                    <div className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                      Bentuk: <span className="font-semibold">{item.bentuk_implementasi}</span>
                    </div>
                  )}

                  <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1 font-mono text-[11px]">
                    <div>No. SK: <strong className="text-slate-800 dark:text-slate-200">{item.nomor_sk_dokumen || '-'}</strong></div>
                    <div>Tanggal: {item.tanggal_penetapan || '-'}</div>
                  </div>

                  {item.deskripsi_singkat && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1 border-t border-slate-100 dark:border-slate-800">
                      {item.deskripsi_singkat}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                  {item.gdrive_public_url ? (
                    <a
                      href={item.gdrive_public_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium truncate max-w-[200px]"
                    >
                      <span>Tautan Drive Terverifikasi</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  ) : (
                    <span className="text-xs text-rose-500 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Belum ada tautan
                    </span>
                  )}

                  <div className="flex items-center gap-1.5">
                    {item.gdrive_public_url && (
                      <CopyButton textToCopy={item.gdrive_public_url} label="Tautan Dokumen" size="xs" buttonText="Salin Link" />
                    )}
                    <CopyButton
                      textToCopy={`${item.nama_item}\nNo. SK: ${item.nomor_sk_dokumen}\nBentuk: ${item.bentuk_implementasi}\nTanggal: ${item.tanggal_penetapan}\nTautan: ${item.gdrive_public_url}`}
                      label={item.nama_item}
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
          SUB-MENU B: PELAKSANA (ORGAN SPMI LPMPP, GJM, UJM)
          ======================================================== */}
      {activeSubMenu === 'pelaksana' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Struktur Organ Pelaksana SPMI Universitas Pattimura
              </h2>
              <p className="text-xs text-slate-500">
                Tata kelola penjaminan mutu berjenjang: LPMPP tingkat Universitas, GJM tingkat Fakultas, dan UJM tingkat Program Studi.
              </p>
            </div>
            <CopyButton
              textToCopy="Organ Pelaksana SPMI Universitas Pattimura:\n1. Tingkat Universitas: LPMPP (SK Rektor No. 420/UN13/SK/2023)\n2. Tingkat Fakultas: Gugus Jaminan Mutu (GJM) pada 9 Fakultas & Pascasarjana\n3. Tingkat Program Studi: Unit Jaminan Mutu (UJM) pada 89 Program Studi"
              label="Struktur Pelaksana SPMI Unpatti"
              size="xs"
              buttonText="Salin Struktur Pelaksana"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tingkat 1: LPMPP */}
            <div className="glass-panel p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                  TINGKAT UNIVERSITAS
                </span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-2">
                  LPMPP Universitas Pattimura
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Lembaga Penjaminan Mutu dan Pengembangan Pembelajaran mengoordinasikan seluruh siklus PPEPP, audit mutu internal model PLOR+CA, dan pelaporan pusat kementerian.
                </p>
                <div className="mt-3 text-[11px] font-mono text-slate-600 dark:text-slate-300 space-y-1 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700">
                  <div>Ketua: <strong>Prof. Dr. Izaak H. Wenno, M.Pd.</strong></div>
                  <div>Kapus Audit: <strong>Dr. Bruri M. Laimeheriwa, M.Sc.</strong></div>
                  <div>SK: <strong>SK Rektor No. 420/UN13/SK/2023</strong></div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <a
                  href="https://drive.google.com/drive/folders/1Unpatti_LPMPP_Public_Repo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
                >
                  <span>SK & Pedoman LPMPP</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <CopyButton textToCopy="SK Rektor No. 420/UN13/SK/2023 tentang Pengangkatan Pengelola LPMPP Universitas Pattimura" label="SK LPMPP" iconOnly size="xs" />
              </div>
            </div>

            {/* Tingkat 2: GJM Fakultas */}
            <div className="glass-panel p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  TINGKAT FAKULTAS (9 FAKULTAS)
                </span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-2">
                  Gugus Jaminan Mutu (GJM)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  GJM berkedudukan di tingkat Dekanat di 9 Fakultas dan Sekolah Pascasarjana Unpatti untuk memastikan implementasi SPMI di tingkat fakultas dan memfasilitasi audit AMI internal.
                </p>
                <div className="mt-3 text-[11px] font-mono text-slate-600 dark:text-slate-300 space-y-1 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700">
                  <div>Cakupan: <strong>9 Fakultas & Pascasarjana</strong></div>
                  <div>Status: <strong>100% Terbentuk & Aktif</strong></div>
                  <div>SK: <strong>SK Dekan Terintegrasi</strong></div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <a
                  href="https://drive.google.com/drive/folders/1Unpatti_GJM_Fakultas_Public_Repo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
                >
                  <span>SK GJM Fakultas</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <CopyButton textToCopy="Gugus Jaminan Mutu (GJM) pada 9 Fakultas di lingkungan Universitas Pattimura" label="GJM Fakultas" iconOnly size="xs" />
              </div>
            </div>

            {/* Tingkat 3: UJM Prodi */}
            <div className="glass-panel p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                  TINGKAT PROGRAM STUDI (89 PRODI)
                </span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-2">
                  Unit Jaminan Mutu (UJM)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  UJM berkedudukan di setiap program studi untuk memonitor ketercapaian capaian pembelajaran lulusan (CPL), evaluasi kepuasan mahasiswa, dan tindak lanjut rekomendasi PLOR+CA.
                </p>
                <div className="mt-3 text-[11px] font-mono text-slate-600 dark:text-slate-300 space-y-1 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700">
                  <div>Jumlah: <strong>89 Program Studi</strong></div>
                  <div>Evaluasi: <strong>Kompilasi AMI Semesteran</strong></div>
                  <div>Model: <strong>PLOR+CA LPMPP Unpatti</strong></div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <a
                  href="https://drive.google.com/drive/folders/1Unpatti_UJM_Prodi_Public_Repo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
                >
                  <span>Pedoman UJM Prodi</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <CopyButton textToCopy="Unit Jaminan Mutu (UJM) pada 89 Program Studi di lingkungan Universitas Pattimura" label="UJM Prodi" iconOnly size="xs" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-MENU C: STANDAR SPMI (3 TABS)
          ======================================================== */}
      {activeSubMenu === 'standar_spmi' && (
        <div className="space-y-4">
          {/* Tab buttons */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl w-fit">
            <button
              type="button"
              onClick={() => setActiveTab('standar_wajib')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'standar_wajib'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Tab 1: Standar SPMI (8 Wajib SN-Dikti)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('standar_lainnya')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'standar_lainnya'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Tab 2: Standar Lainnya (Penciri Unpatti)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('standar_pt')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'standar_pt'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Tab 3: Standar Perguruan Tinggi (Matriks Jenjang)
            </button>
          </div>

          {/* TAB 1: 8 STANDAR WAJIB */}
          {activeTab === 'standar_wajib' && (
            <div className="glass-panel rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    8 Standar Mutu Wajib SN-Dikti Universitas Pattimura
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Standar Pendidikan, Penelitian, PkM, Nonakademik Organisasi, Keuangan, Kemahasiswaan, Ketenagaan, Sarpras.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 font-semibold">
                    <tr>
                      <th className="py-2.5 px-3 w-12 text-center">Kode</th>
                      <th className="py-2.5 px-3">Nama Standar Mutu</th>
                      <th className="py-2.5 px-3">Nomor SK Dokumen</th>
                      <th className="py-2.5 px-3">Tanggal Penetapan</th>
                      <th className="py-2.5 px-3">Tautan Drive Publik</th>
                      <th className="py-2.5 px-3 text-right">Aksi & Salin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {standarSPMIList.map((item) => (
                      <tr key={item.kode_item} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 text-center font-mono font-bold text-amber-600 dark:text-amber-400">
                          {item.kode_item}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{item.nama_item}</span>
                            <CopyButton textToCopy={item.nama_item} label={item.nama_item} iconOnly size="xs" />
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">{item.deskripsi_singkat}</div>
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <span>{item.nomor_sk_dokumen || '-'}</span>
                            {item.nomor_sk_dokumen && <CopyButton textToCopy={item.nomor_sk_dokumen} label="No SK" iconOnly size="xs" />}
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                          {item.tanggal_penetapan}
                        </td>
                        <td className="py-3 px-3">
                          {item.gdrive_public_url ? (
                            <div className="flex items-center gap-1.5">
                              <a
                                href={item.gdrive_public_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                              >
                                <span>Buka Drive</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                              <CopyButton textToCopy={item.gdrive_public_url} label={`Link Drive ${item.nama_item}`} iconOnly size="xs" />
                            </div>
                          ) : (
                            <span className="text-rose-500 text-[11px]">Belum Ada</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <CopyButton
                              textToCopy={`${item.nama_item} | SK: ${item.nomor_sk_dokumen} | Tgl: ${item.tanggal_penetapan} | URL: ${item.gdrive_public_url}`}
                              label={item.nama_item}
                              size="xs"
                              buttonText="Salin Baris"
                            />
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: STANDAR LAINNYA (MELAMPAUI SN-DIKTI / PENCIRI) */}
          {activeTab === 'standar_lainnya' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Standar Melampaui SN-Dikti / Penciri Universitas Pattimura
                  </h3>
                  <p className="text-xs text-slate-500">
                    Standar keunggulan Pola Ilmiah Pokok (PIP) Kemaritiman Laut Pulau-Pulau Kecil, Kerjasama Pasifik, & Target Publikasi Guru Besar.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenAdd('standar_lainnya', 'Standar Penciri Baru')}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambahkan Standar Lain</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {standarLainList.map((item) => (
                  <div
                    key={item.kode_item}
                    className="glass-panel p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            {item.kode_item}
                          </span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {item.nama_item}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                        {item.deskripsi_singkat}
                      </p>

                      <div className="mt-2 text-[11px] font-mono text-slate-500 space-y-0.5">
                        <div>SK: {item.nomor_sk_dokumen}</div>
                        <div>Ditetapkan: {item.tanggal_penetapan}</div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      {item.gdrive_public_url ? (
                        <a
                          href={item.gdrive_public_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                          <span>Tautan Dokumen</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-rose-500">Tautan belum ada</span>
                      )}

                      <div className="flex items-center gap-1">
                        {item.gdrive_public_url && (
                          <CopyButton textToCopy={item.gdrive_public_url} label="Tautan Drive" size="xs" buttonText="Salin URL" />
                        )}
                        <CopyButton
                          textToCopy={`${item.nama_item}\nNo. SK: ${item.nomor_sk_dokumen}\nDeskripsi: ${item.deskripsi_singkat}\nDrive: ${item.gdrive_public_url}`}
                          label={item.nama_item}
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

          {/* TAB 3: STANDAR PERGURUAN TINGGI (MATRIKS JENJANG PENDIDIKAN) */}
          {activeTab === 'standar_pt' && (
            <div className="space-y-4">
              <div className="glass-panel p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <span>Matriks Perbandingan Standar Pendidikan: SN-Dikti vs Universitas Pattimura</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">
                      Tahun {currentYear}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Kolom <strong>SN-Dikti</strong> terkunci baku (*Read-Only*). Kolom <strong>Ketentuan Universitas Pattimura</strong> dapat disesuaikan dan disimpan langsung ke database Supabase.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSaveMatrix}
                  className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0 ${
                    isMatrixDirty
                      ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 animate-pulse'
                      : 'bg-slate-900 dark:bg-slate-800 text-amber-300 hover:bg-slate-800'
                  }`}
                >
                  <Save className="w-4 h-4 text-amber-400" />
                  <span>Simpan Standar Mahasiswa & Dosen</span>
                </button>
              </div>

              <div className="glass-panel rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-white font-semibold text-[11px]">
                        <th rowSpan={2} className="sticky left-0 z-20 bg-slate-900 py-2.5 px-3 border border-slate-800 text-center w-10 shadow-r">No</th>
                        <th rowSpan={2} className="sticky left-10 z-20 bg-slate-900 py-2.5 px-3 border border-slate-800 shadow-r">Jenjang Pendidikan</th>
                        <th colSpan={3} className="py-2 px-3 border border-slate-800 text-center bg-slate-800 text-amber-200">
                          Standar SN-Dikti Kemdiktisaintek (Terkunci)
                        </th>
                        <th colSpan={4} className="py-2 px-3 border border-slate-800 text-center bg-amber-600/30 text-amber-200">
                          Ketentuan Universitas Pattimura (Dapat Diedit)
                        </th>
                        <th rowSpan={2} className="py-2.5 px-3 border border-slate-800 text-right">Salin</th>
                      </tr>
                      <tr className="bg-slate-800/90 text-slate-300 text-[10px] font-mono">
                        <th className="py-1.5 px-2 border border-slate-700">Masa Maks</th>
                        <th className="py-1.5 px-2 border border-slate-700">Beban SKS</th>
                        <th className="py-1.5 px-2 border border-slate-700">IPK Min</th>
                        <th className="py-1.5 px-2 border border-slate-700 bg-amber-500/10 text-amber-300">PT Masa Maks</th>
                        <th className="py-1.5 px-2 border border-slate-700 bg-amber-500/10 text-amber-300">PT Beban SKS</th>
                        <th className="py-1.5 px-2 border border-slate-700 bg-amber-500/10 text-amber-300">PT IPK Min</th>
                        <th className="py-1.5 px-2 border border-slate-700 bg-amber-500/10 text-amber-300">Syarat Tambahan Lulus</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {localTargetPT.map((row, idx) => (
                        <tr key={row.jenjang_pendidikan} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="sticky left-0 z-10 bg-white dark:bg-slate-900 py-2.5 px-3 text-center font-mono text-slate-500 border-r border-slate-200 dark:border-slate-800 shadow-xs">
                            {idx + 1}
                          </td>
                          <td className="sticky left-10 z-10 bg-white dark:bg-slate-900 py-2.5 px-3 font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800 whitespace-nowrap shadow-xs">
                            {row.jenjang_pendidikan}
                          </td>

                          {/* Locked SN-Dikti columns */}
                          <td className="py-2 px-2.5 font-mono text-slate-500 bg-slate-100/50 dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                            <span className="flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                              <span>{row.sndikti_masa_studi_maks}</span>
                            </span>
                          </td>
                          <td className="py-2 px-2.5 font-mono text-slate-500 bg-slate-100/50 dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                            <span className="flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                              <span>{row.sndikti_beban_sks_min}</span>
                            </span>
                          </td>
                          <td className="py-2 px-2.5 font-mono text-slate-500 bg-slate-100/50 dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                            <span className="flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                              <span>{row.sndikti_ipk_min}</span>
                            </span>
                          </td>

                          {/* Editable Unpatti Columns */}
                          <td className="py-1 px-1.5 border-r border-slate-200 dark:border-slate-800">
                            <input
                              type="text"
                              value={row.pt_masa_studi_maks}
                              onChange={(e) => handleMatrixChange(idx, 'pt_masa_studi_maks', e.target.value)}
                              className="w-full px-2 py-1 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded focus:ring-1 focus:ring-amber-500"
                            />
                          </td>
                          <td className="py-1 px-1.5 border-r border-slate-200 dark:border-slate-800">
                            <input
                              type="text"
                              value={row.pt_beban_sks_min}
                              onChange={(e) => handleMatrixChange(idx, 'pt_beban_sks_min', e.target.value)}
                              className="w-full px-2 py-1 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded focus:ring-1 focus:ring-amber-500"
                            />
                          </td>
                          <td className="py-1 px-1.5 border-r border-slate-200 dark:border-slate-800">
                            <input
                              type="text"
                              value={row.pt_ipk_min}
                              onChange={(e) => handleMatrixChange(idx, 'pt_ipk_min', e.target.value)}
                              className="w-full px-2 py-1 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded focus:ring-1 focus:ring-amber-500"
                            />
                          </td>
                          <td className="py-1 px-1.5 border-r border-slate-200 dark:border-slate-800 min-w-[200px]">
                            <input
                              type="text"
                              value={row.pt_syarat_tambahan_lulus || ''}
                              onChange={(e) => handleMatrixChange(idx, 'pt_syarat_tambahan_lulus', e.target.value)}
                              placeholder="Syarat tambahan kelulusan..."
                              className="w-full px-2 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded focus:ring-1 focus:ring-amber-500"
                            />
                          </td>

                          {/* Action Copy */}
                          <td className="py-2 px-3 text-right whitespace-nowrap">
                            <CopyButton
                              textToCopy={`Jenjang: ${row.jenjang_pendidikan} | Masa Maks: ${row.pt_masa_studi_maks} | Beban SKS: ${row.pt_beban_sks_min} | IPK: ${row.pt_ipk_min} | Syarat: ${row.pt_syarat_tambahan_lulus}`}
                              label={`Standar ${row.jenjang_pendidikan}`}
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
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          SUB-MENU C: MEKANISME PENDOKUMENTASIAN
          ======================================================== */}
      {activeSubMenu === 'mekanisme_dokumentasi' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                SOP Pengendalian Dokumen dan Rekaman Mutu SPMI
              </h2>
              <p className="text-xs text-slate-500">
                Mekanisme tata kelola penyimpanan rekaman audit, berita acara RTM, dan distribusi berkas mutu.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleOpenAdd('mekanisme_dokumentasi', 'SOP Mekanisme Tambahan')}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambahkan Mekanisme Lain</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dokumentasiList.map((item) => (
              <div
                key={item.kode_item}
                className="glass-panel p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {item.kode_item}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1.5">
                    {item.nama_item}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    {item.deskripsi_singkat}
                  </p>
                  <div className="text-[11px] font-mono text-slate-500 mt-2">
                    SK: {item.nomor_sk_dokumen}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  {item.gdrive_public_url ? (
                    <a
                      href={item.gdrive_public_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <span>Lihat SOP</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-xs text-rose-500">Belum ada tautan</span>
                  )}

                  <CopyButton
                    textToCopy={`${item.nama_item}\nNo. Dokumen: ${item.nomor_sk_dokumen}\nDeskripsi: ${item.deskripsi_singkat}\nDrive: ${item.gdrive_public_url}`}
                    label={item.nama_item}
                    size="xs"
                    buttonText="Salin"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL EDIT / TAMBAH PENETAPAN DENGAN GDRIVE FIELD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-amber-500" />
                <span>{editingItem ? 'Edit Dokumen Penetapan Mutu' : 'Tambah Dokumen Penetapan Baru'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Kode Butir
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.kode_item}
                    onChange={(e) => setFormData({ ...formData, kode_item: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div className="col-span-2">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Nama Dokumen / Standar Mutu <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nama_item}
                    onChange={(e) => setFormData({ ...formData, nama_item: e.target.value })}
                    placeholder="Contoh: Standar Kompetensi Lulusan"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {formData.kategori_menu === 'komitmen_mutu' && (
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Bentuk Implementasi Mekanisme SPMI
                  </label>
                  <select
                    value={formData.bentuk_implementasi || 'Sistem unit tersendiri'}
                    onChange={(e) => setFormData({ ...formData, bentuk_implementasi: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Sistem unit tersendiri">Sistem unit tersendiri (LPMPP)</option>
                    <option value="Melekat pada organ">Melekat pada organ</option>
                    <option value="Kombinasi">Kombinasi (LPMPP + GJM Fakultas + UJM)</option>
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Nomor SK Penetapan / Dokumen
                  </label>
                  <input
                    type="text"
                    value={formData.nomor_sk_dokumen || ''}
                    onChange={(e) => setFormData({ ...formData, nomor_sk_dokumen: e.target.value })}
                    placeholder="SK Rektor No. 421/UN13/SK/2023"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Tanggal Penetapan Dokumen
                  </label>
                  <input
                    type="date"
                    value={formData.tanggal_penetapan || ''}
                    onChange={(e) => setFormData({ ...formData, tanggal_penetapan: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Deskripsi Ringkas Standar / Dokumen
                </label>
                <textarea
                  rows={3}
                  value={formData.deskripsi_singkat || ''}
                  onChange={(e) => setFormData({ ...formData, deskripsi_singkat: e.target.value })}
                  placeholder="Ringkasan isi kebijakan, lingkup pemberlakuan, serta kaitannya dengan SPMI..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              {/* Special GDriveField with live validation check & mandatory warning */}
              <GDriveField
                value={formData.gdrive_public_url || ''}
                onChange={(val) => setFormData({ ...formData, gdrive_public_url: val })}
                label="Tautan Dokumen Publik Google Drive"
                required
              />

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="status_ada"
                    checked={formData.status_ada}
                    onChange={(e) => setFormData({ ...formData, status_ada: e.target.checked })}
                    className="rounded text-amber-500 focus:ring-amber-500"
                  />
                  <label htmlFor="status_ada" className="text-slate-700 dark:text-slate-300 select-none">
                    Status Dokumen: Ada & Berlaku
                  </label>
                </div>

                <div className="flex items-center gap-2">
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
                    Simpan Dokumen
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
