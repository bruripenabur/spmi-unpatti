import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Plus, 
  ExternalLink, 
  Edit3, 
  CheckCircle2, 
  Calendar, 
  FileText, 
  X,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PPEPPLogItem } from '../types/spmi';
import { CopyButton } from '../components/CopyButton';
import { GDriveField } from '../components/GDriveField';
import { validateGDriveUrl } from '../lib/urlValidator';

export const PengendalianView: React.FC = () => {
  const { currentYear, ppeppLogsList, updatePPEPPLog } = useApp();

  const pengendalianLogs = ppeppLogsList.filter(p => p.tahap_ppepp === 'Pengendalian');

  // Also pull Correction & Action items from Evaluasi AMI logs to show seamless integration
  const evaluasiPlorItems = ppeppLogsList.filter(
    p => p.tahap_ppepp === 'Evaluasi' && (p.plor_correction || p.plor_action)
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PPEPPLogItem | null>(null);

  const [formData, setFormData] = useState<PPEPPLogItem>({
    tahun: currentYear,
    tahap_ppepp: 'Pengendalian',
    kode_butir: '',
    judul_kegiatan_atau_butir: '',
    unit_sumber: 'Pimpinan Universitas & Tim LPMPP',
    tanggal_pelaksanaan_selesai: `${currentYear}-10-28`,
    narasi_ringkas: '',
    plor_correction: '',
    plor_action: '',
    gdrive_public_url: '',
    status_link_publik: 'Belum Divalidasi',
    status_verifikasi_lpmpp: 'Diverifikasi',
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    const count = pengendalianLogs.length + 1;
    setFormData({
      tahun: currentYear,
      tahap_ppepp: 'Pengendalian',
      kode_butir: `KTL-0${count}`,
      judul_kegiatan_atau_butir: 'Rapat Tinjauan Manajemen (RTM) Tindak Lanjut Temuan AMI',
      unit_sumber: 'Pimpinan Universitas & Tim LPMPP',
      tanggal_pelaksanaan_selesai: `${currentYear}-11-01`,
      narasi_ringkas: 'Rapat Tinjauan Manajemen membahas tindak lanjut tindakan korektif atas temuan AMI pada fakultas dan prodi, serta penetapan penanggungjawab perbaikan.',
      plor_correction: '',
      plor_action: '',
      gdrive_public_url: '',
      status_link_publik: 'Belum Divalidasi',
      status_verifikasi_lpmpp: 'Diverifikasi',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: PPEPPLogItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
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

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="glass-panel p-5 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
              Tahap Pengendalian SPMI: Risalah RTM & Tindak Lanjut Koreksi
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Mendokumentasikan Rapat Tinjauan Manajemen (RTM) universitas, penanganan ketidaksesuaian hasil audit AMI, serta pemantauan aksi koreksi terintegrasi konsep <strong>PLOR+CA</strong> (Tahun Siklus {currentYear}).
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs flex items-center gap-1.5 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambahkan Pengendalian Baru</span>
        </button>
      </div>

      {/* Integration Banner from PLOR+CA */}
      {evaluasiPlorItems.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-300/80 dark:border-amber-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-xs text-amber-900 dark:text-amber-200">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Integrasi Butir Koreksi & Tindakan Korektif (PLOR+CA) dari Tahap Evaluasi:</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/20 text-amber-800 dark:text-amber-300">
              {evaluasiPlorItems.length} Temuan Aktif
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {evaluasiPlorItems.map(item => (
              <div key={item.kode_butir} className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-amber-200 dark:border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 dark:text-white truncate">
                    {item.judul_kegiatan_atau_butir}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{item.kode_butir}</span>
                </div>
                {item.plor_correction && (
                  <div className="text-[11px] text-slate-600 dark:text-slate-300">
                    <strong className="text-amber-700 dark:text-amber-400">Correction (Koreksi Cepat):</strong> {item.plor_correction}
                  </div>
                )}
                {item.plor_action && (
                  <div className="text-[11px] text-slate-600 dark:text-slate-300">
                    <strong className="text-purple-700 dark:text-purple-400">Corrective Action (Sistemik):</strong> {item.plor_action}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pengendalianLogs.map((item) => (
          <div
            key={item.kode_butir}
            className="glass-panel p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 hover:border-amber-500/40 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                      {item.kode_butir}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                      {item.status_verifikasi_lpmpp || 'Diverifikasi'}
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
                <div>PIC/Unit: <strong className="text-slate-700 dark:text-slate-300">{item.unit_sumber}</strong></div>
                <div>Tanggal Selesai: {item.tanggal_pelaksanaan_selesai}</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <span>Risalah & Narasi Pengendalian</span>
                  <CopyButton textToCopy={item.narasi_ringkas} label="Narasi Pengendalian" size="xs" buttonText="Salin Narasi" />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                  {item.narasi_ringkas}
                </p>
              </div>

              {item.plor_action && (
                <div className="p-2.5 rounded-lg bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-800/60 text-[11px] space-y-1">
                  <div className="font-semibold text-purple-900 dark:text-purple-300">
                    Aksi Koreksi Terjadwal:
                  </div>
                  <div className="text-slate-700 dark:text-slate-300">{item.plor_action}</div>
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
                  <span>Risalah RTM Drive</span>
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
                  textToCopy={`${item.judul_kegiatan_atau_butir}\n${item.narasi_ringkas}\nRisalah RTM: ${item.gdrive_public_url}`}
                  label={item.judul_kegiatan_atau_butir}
                  size="xs"
                  buttonText="Salin Baris"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-500" />
                <span>{editingItem ? 'Edit Dokumen Pengendalian RTM' : 'Tambah Pengendalian Baru'}</span>
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
              <div className="grid grid-cols-2 gap-3">
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
                    Tanggal Selesai RTM
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
                  Judul Pengendalian / Agenda RTM <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.judul_kegiatan_atau_butir}
                  onChange={(e) => setFormData({ ...formData, judul_kegiatan_atau_butir: e.target.value })}
                  placeholder="Contoh: Rapat Tinjauan Manajemen Siklus SPMI Tingkat Universitas"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Unit Pelaksana / PIC Pengendalian
                </label>
                <input
                  type="text"
                  value={formData.unit_sumber || ''}
                  onChange={(e) => setFormData({ ...formData, unit_sumber: e.target.value })}
                  placeholder="Pimpinan Universitas & Tim LPMPP"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Narasi Tindak Lanjut & Keputusan RTM <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.narasi_ringkas || ''}
                  onChange={(e) => setFormData({ ...formData, narasi_ringkas: e.target.value })}
                  placeholder="Uraian hasil rapat tinjauan manajemen, keputusan pimpinan, dan jadwal tindak lanjut..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white leading-relaxed"
                />
              </div>

              <GDriveField
                value={formData.gdrive_public_url || ''}
                onChange={(val) => setFormData({ ...formData, gdrive_public_url: val })}
                label="Tautan Risalah RTM Publik Google Drive"
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
                  Simpan Pengendalian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
