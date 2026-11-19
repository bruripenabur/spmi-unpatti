import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Phone, 
  Building2, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  X, 
  Copy, 
  ShieldCheck 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PengelolaPT } from '../types/spmi';
import { CopyButton } from '../components/CopyButton';

export const PengelolaView: React.FC = () => {
  const { 
    currentYear, 
    pengelolaList, 
    updatePengelola, 
    removePengelola, 
    isMirrorMode 
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PengelolaPT | null>(null);

  // Form state
  const [formData, setFormData] = useState<PengelolaPT>({
    tahun: currentYear,
    nama_lengkap: '',
    nip: '',
    jabatan: '',
    no_hp: '',
    email: '',
    is_aktif: true,
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      tahun: currentYear,
      nama_lengkap: '',
      nip: '',
      jabatan: 'Auditor SPMI LPMPP Unpatti',
      no_hp: '',
      email: '',
      is_aktif: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: PengelolaPT) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama_lengkap.trim() || !formData.email.trim()) {
      return;
    }
    await updatePengelola(formData);
    setIsModalOpen(false);
  };

  const handleDelete = async (item: PengelolaPT) => {
    if (confirm(`Yakin ingin menghapus ${item.nama_lengkap} dari daftar pengelola SPMI tahun ${currentYear}?`)) {
      await removePengelola(item.id, item.email);
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="glass-panel p-5 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" />
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
              Pengelola SPMI Perguruan Tinggi
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Daftar pimpinan dan tim penjaminan mutu LPMPP Universitas Pattimura (Tahun Siklus {currentYear}). Data ini dicocokkan dengan profil tim SPMI di portal Kemdiktisaintek.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Pengelola Baru</span>
        </button>
      </div>

      {/* Main Table */}
      <div className="glass-panel rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 font-semibold">
              <tr>
                <th className="sticky left-0 z-10 bg-slate-100 dark:bg-slate-800 py-3 px-4 w-12 text-center shadow-xs">No</th>
                <th className="py-3 px-4">Nama Lengkap & NIP</th>
                <th className="py-3 px-4">Jabatan Struktural / Peran</th>
                <th className="py-3 px-4">Kontak (HP & Email)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Aksi & Salin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/80 text-slate-800 dark:text-slate-200">
              {pengelolaList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Belum ada pengelola SPMI untuk tahun {currentYear}. Klik tombol &quot;Tambah Pengelola&quot; untuk menambahkan data.
                  </td>
                </tr>
              ) : (
                pengelolaList.map((item, idx) => (
                  <tr key={item.email || idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="sticky left-0 z-10 bg-white dark:bg-slate-900 py-3 px-4 text-center font-mono text-slate-500 shadow-xs">
                      {idx + 1}
                    </td>

                    {/* Nama & NIP */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5 flex-wrap">
                        <span>{item.nama_lengkap}</span>
                        <CopyButton textToCopy={item.nama_lengkap} label="Nama Lengkap" iconOnly size="xs" />
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5 flex items-center gap-1.5">
                        <span>NIP: {item.nip || '-'}</span>
                        {item.nip && <CopyButton textToCopy={item.nip} label="NIP" iconOnly size="xs" />}
                      </div>
                    </td>

                    {/* Jabatan */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium">{item.jabatan}</span>
                        <CopyButton textToCopy={item.jabatan} label="Jabatan" iconOnly size="xs" />
                      </div>
                      <span className="text-[11px] text-slate-400">LPMPP Universitas Pattimura</span>
                    </td>

                    {/* Kontak */}
                    <td className="py-3 px-4 space-y-1">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{item.no_hp || '-'}</span>
                        {item.no_hp && <CopyButton textToCopy={item.no_hp} label="No HP" iconOnly size="xs" />}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span className="truncate max-w-[180px]">{item.email}</span>
                        <CopyButton textToCopy={item.email} label="Email" iconOnly size="xs" />
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                        item.is_aktif
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                          : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{item.is_aktif ? 'Aktif' : 'Non-Aktif'}</span>
                      </span>
                    </td>

                    {/* Aksi */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <CopyButton 
                          textToCopy={`${item.nama_lengkap} | NIP: ${item.nip} | ${item.jabatan} | HP: ${item.no_hp} | Email: ${item.email}`}
                          label={`Data Pengelola ${item.nama_lengkap}`}
                          size="xs"
                          buttonText="Salin Baris"
                        />
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          title="Edit Pengelola"
                          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          title="Hapus Pengelola"
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-500" />
                <span>{editingItem ? 'Edit Data Pengelola SPMI' : 'Tambah Pengelola SPMI LPMPP'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Lengkap & Gelar <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.nama_lengkap}
                  onChange={(e) => setFormData({ ...formData, nama_lengkap: e.target.value })}
                  placeholder="Contoh: Dr. Bruri Melky Laimeheriwa, S.Pi., M.Sc."
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    NIP / NIDN
                  </label>
                  <input
                    type="text"
                    value={formData.nip}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    placeholder="197405202002121002"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    No. Handphone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={formData.no_hp}
                    onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
                    placeholder="081247000212"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Jabatan dalam Struktur SPMI LPMPP <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.jabatan}
                  onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                  placeholder="Koordinator Pusat Audit Mutu Internal & SPMI LPMPP"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Alamat Email Resmi <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="bruri.laimeheriwa@unpatti.ac.id"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_aktif"
                  checked={formData.is_aktif}
                  onChange={(e) => setFormData({ ...formData, is_aktif: e.target.checked })}
                  className="rounded text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="is_aktif" className="text-slate-700 dark:text-slate-300 select-none">
                  Pengelola Aktif pada Tahun Siklus {currentYear}
                </label>
              </div>

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
                  Simpan Pengelola
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
