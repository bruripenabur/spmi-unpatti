import React, { useState } from 'react';
import { 
  TrendingUp, 
  Plus, 
  ExternalLink, 
  Edit3, 
  CheckCircle2, 
  Calendar, 
  FileText, 
  X,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PPEPPLogItem } from '../types/spmi';
import { CopyButton } from '../components/CopyButton';
import { GDriveField } from '../components/GDriveField';
import { validateGDriveUrl } from '../lib/urlValidator';

export const PeningkatanView: React.FC = () => {
  const { currentYear, ppeppLogsList, updatePPEPPLog } = useApp();

  const peningkatanLogs = ppeppLogsList.filter(p => p.tahap_ppepp === 'Peningkatan');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PPEPPLogItem | null>(null);

  const [formData, setFormData] = useState<PPEPPLogItem>({
    tahun: currentYear,
    tahap_ppepp: 'Peningkatan',
    kode_butir: '',
    judul_kegiatan_atau_butir: '',
    unit_sumber: 'Senat Akademik & LPMPP Unpatti',
    tanggal_pelaksanaan_selesai: `${currentYear}-11-15`,
    narasi_ringkas: '',
    gdrive_public_url: '',
    status_link_publik: 'Belum Divalidasi',
    status_verifikasi_lpmpp: 'Diverifikasi',
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    const count = peningkatanLogs.length + 1;
    setFormData({
      tahun: currentYear,
      tahap_ppepp: 'Peningkatan',
      kode_butir: `KTG-0${count}`,
      judul_kegiatan_atau_butir: 'Peningkatan Standar Mutu Baru Hasil RTM',
      unit_sumber: 'Senat Akademik & LPMPP Unpatti',
      tanggal_pelaksanaan_selesai: `${currentYear}-11-20`,
      narasi_ringkas: 'Menetapkan peningkatan target mutu standar lama menjadi standar baru yang lebih tinggi berdasarkan hasil capaian dan rekomendasi Rapat Tinjauan Manajemen.',
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
            <TrendingUp className="w-5 h-5 text-amber-500" />
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
              Tahap Peningkatan SPMI (Kaizen): Penetapan Standar Mutu Baru
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Mendokumentasikan peningkatan standar mutu (*continuous quality improvement*) yang telah melampaui capaian sebelumnya untuk siklus selanjutnya di Universitas Pattimura (Tahun Siklus {currentYear}).
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs flex items-center gap-1.5 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambahkan Peningkatan Baru</span>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {peningkatanLogs.map((item) => (
          <div
            key={item.kode_butir}
            className="glass-panel p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 hover:border-amber-500/40 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
                      {item.kode_butir}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                      <span>Standar Ditingkatkan</span>
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
                <div>Pengesahan: <strong className="text-slate-700 dark:text-slate-300">{item.unit_sumber}</strong></div>
                <div>Tanggal Penetapan Baru: {item.tanggal_pelaksanaan_selesai}</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <span>Deskripsi Perubahan Standar Baru</span>
                  <CopyButton textToCopy={item.narasi_ringkas} label="Deskripsi Peningkatan" size="xs" buttonText="Salin Narasi" />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                  {item.narasi_ringkas}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
              {item.gdrive_public_url ? (
                <a
                  href={item.gdrive_public_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 truncate max-w-[180px]"
                >
                  <span>SK Standar Baru Drive</span>
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
                  textToCopy={`${item.judul_kegiatan_atau_butir}\n${item.narasi_ringkas}\nSK Rektor / Bukti: ${item.gdrive_public_url}`}
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
                <TrendingUp className="w-5 h-5 text-amber-500" />
                <span>{editingItem ? 'Edit Penetapan Peningkatan Standar' : 'Tambah Peningkatan Standar Mutu Baru'}</span>
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
                    Tanggal Penetapan Standar Baru
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
                  Judul Peningkatan Standar <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.judul_kegiatan_atau_butir}
                  onChange={(e) => setFormData({ ...formData, judul_kegiatan_atau_butir: e.target.value })}
                  placeholder="Contoh: Peningkatan Standar Beban Publikasi Bereputasi Lulusan Magister & Doktor"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Dasar Hukum / Legalitas Pengesahan
                </label>
                <input
                  type="text"
                  value={formData.unit_sumber || ''}
                  onChange={(e) => setFormData({ ...formData, unit_sumber: e.target.value })}
                  placeholder="SK Rektor No. 892/UN13/SK/2024 & Senat Akademik Unpatti"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Deskripsi Perubahan Standar Lama ke Standar Baru <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.narasi_ringkas || ''}
                  onChange={(e) => setFormData({ ...formData, narasi_ringkas: e.target.value })}
                  placeholder="Jelaskan standar sebelumnya, besaran peningkatan standar baru, serta landasan hasil RTM..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white leading-relaxed"
                />
              </div>

              <GDriveField
                value={formData.gdrive_public_url || ''}
                onChange={(val) => setFormData({ ...formData, gdrive_public_url: val })}
                label="Tautan SK / Naskah Standar Baru Google Drive"
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
                  Simpan Peningkatan Standar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
