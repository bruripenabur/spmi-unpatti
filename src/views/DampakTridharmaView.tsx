import React, { useState } from 'react';
import { 
  Award, 
  ExternalLink, 
  Edit3, 
  CheckCircle2, 
  FileText, 
  Sparkles, 
  X,
  BookOpen,
  FlaskConical,
  HeartHandshake,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PPEPPLogItem } from '../types/spmi';
import { CopyButton } from '../components/CopyButton';
import { GDriveField } from '../components/GDriveField';
import { validateGDriveUrl } from '../lib/urlValidator';

export const DampakTridharmaView: React.FC = () => {
  const { currentYear, ppeppLogsList, updatePPEPPLog } = useApp();

  const dampakLogs = ppeppLogsList.filter(p => p.tahap_ppepp === 'Dampak Tridharma');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PPEPPLogItem | null>(null);

  const [formData, setFormData] = useState<PPEPPLogItem>({
    tahun: currentYear,
    tahap_ppepp: 'Dampak Tridharma',
    kode_butir: '',
    judul_kegiatan_atau_butir: '',
    unit_sumber: '',
    tanggal_pelaksanaan_selesai: `${currentYear}-11-19`,
    narasi_ringkas: '',
    gdrive_public_url: '',
    status_link_publik: 'Belum Divalidasi',
    status_verifikasi_lpmpp: 'Diverifikasi',
  });

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

  const getDampakIcon = (code: string) => {
    if (code === 'DMP-01') return <BookOpen className="w-5 h-5 text-blue-500" />;
    if (code === 'DMP-02') return <FlaskConical className="w-5 h-5 text-emerald-500" />;
    if (code === 'DMP-03') return <HeartHandshake className="w-5 h-5 text-amber-500" />;
    return <ShieldCheck className="w-5 h-5 text-purple-500" />;
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="glass-panel p-5 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
              Dampak Penjaminan Mutu Tridharma & Praktik Baik PPEPP
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            4 Butir Wajib Pelaporan Dampak Siklus PPEPP ke Portal Kemdiktisaintek untuk Universitas Pattimura (Tahun Siklus {currentYear}).
          </p>
        </div>

        <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-bold shrink-0">
          4 Butir Wajib Kemdiktisaintek
        </span>
      </div>

      {/* 4 Cards Grid */}
      <div className="space-y-4">
        {dampakLogs.map((item, idx) => (
          <div
            key={item.kode_butir}
            className="glass-panel p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 hover:border-amber-500/40 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                  {getDampakIcon(item.kode_butir)}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      Butir Wajib #{idx + 1} ({item.kode_butir})
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                      Terverifikasi LPMPP
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1">
                    {item.judul_kegiatan_atau_butir}
                  </h3>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Unit Pengelola: <strong className="text-slate-700 dark:text-slate-300">{item.unit_sumber}</strong> · Terakhir Disinkronkan: {item.tanggal_pelaksanaan_selesai}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(item)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Narasi</span>
                </button>
              </div>
            </div>

            {/* Narasi Box */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Narasi Capaian Outstanding (Siap Tempel ke Portal SPMI):
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-500">
                    {item.narasi_ringkas?.length || 0} Karakter
                  </span>
                  <CopyButton
                    textToCopy={item.narasi_ringkas}
                    label={item.judul_kegiatan_atau_butir}
                    size="xs"
                    buttonText="Salin Narasi"
                  />
                </div>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-sans whitespace-pre-line">
                {item.narasi_ringkas}
              </p>
            </div>

            {/* Bottom Row: Link Drive & Direct Copy */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Portofolio Bukti:</span>
                {item.gdrive_public_url ? (
                  <a
                    href={item.gdrive_public_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                  >
                    <span className="truncate max-w-[260px]">{item.gdrive_public_url}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                ) : (
                  <span className="text-rose-500">Tautan belum ada</span>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {item.gdrive_public_url && (
                  <CopyButton textToCopy={item.gdrive_public_url} label="Tautan Bukti Portofolio" size="xs" buttonText="Salin URL Drive" />
                )}
                <CopyButton
                  textToCopy={`${item.judul_kegiatan_atau_butir}\n${item.narasi_ringkas}\nBukti: ${item.gdrive_public_url}`}
                  label={item.judul_kegiatan_atau_butir}
                  size="xs"
                  buttonText="Salin Lengkap"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL EDIT NARASI DAMPAK DENGAN PANDUAN STRUKTUR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>Edit Narasi Butir Dampak Tridharma</span>
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
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Butir Dampak Tridharma
                </label>
                <input
                  type="text"
                  disabled
                  value={formData.judul_kegiatan_atau_butir}
                  className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold"
                />
              </div>

              {/* Guidance Box for Sentences */}
              <div className="p-3 rounded-lg bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/60 text-blue-900 dark:text-blue-200 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  <span>Panduan Struktur Kalimat Portofolio Kemdiktisaintek:</span>
                </div>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px] leading-relaxed text-blue-800 dark:text-blue-300">
                  <li><strong>Konteks/Target:</strong> Sebutkan baseline standar institusi dan pencapaian target.</li>
                  <li><strong>Bukti Kuantitatif:</strong> Cantumkan angka konkrit (persentase kelulusan, skor IKU, jumlah paten, akreditasi internasional).</li>
                  <li><strong>Dampak Luaran:</strong> Jelaskan implikasi nyata terhadap mutu lulusan, riset kemaritiman kepulauan, atau reputasi kampus.</li>
                </ul>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Narasi Portofolio Dampak <span className="text-rose-500">*</span>
                  </label>
                  <span className={`text-[11px] font-mono ${
                    (formData.narasi_ringkas?.length || 0) < 150 ? 'text-amber-500' : 'text-emerald-500 font-bold'
                  }`}>
                    {formData.narasi_ringkas?.length || 0} Karakter (Disarankan min. 150 karakter)
                  </span>
                </div>
                <textarea
                  rows={6}
                  required
                  value={formData.narasi_ringkas || ''}
                  onChange={(e) => setFormData({ ...formData, narasi_ringkas: e.target.value })}
                  placeholder="Ketikkan uraian capaian outstanding perguruan tinggi secara komprehensif..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white leading-relaxed"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Unit Pengelola / Sumber Verifikasi
                </label>
                <input
                  type="text"
                  value={formData.unit_sumber || ''}
                  onChange={(e) => setFormData({ ...formData, unit_sumber: e.target.value })}
                  placeholder="Wakil Rektor Bidang Akademik / LPPM / LPMPP"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <GDriveField
                value={formData.gdrive_public_url || ''}
                onChange={(val) => setFormData({ ...formData, gdrive_public_url: val })}
                label="Tautan Portofolio Bukti Google Drive"
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
                  Simpan Narasi Dampak
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
