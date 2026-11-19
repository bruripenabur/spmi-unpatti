import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Printer, 
  Download, 
  Search, 
  Copy, 
  ExternalLink, 
  CheckCircle2, 
  Building2, 
  Layers, 
  Sparkles,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UNPATTI_INFO } from '../lib/defaultTemplates';
import { CopyButton } from '../components/CopyButton';
import { UnpattiLogo } from '../components/UnpattiLogo';

export const CheatSheetView: React.FC = () => {
  const { 
    currentYear, 
    pengelolaList, 
    penetapanList, 
    targetPTList, 
    ppeppLogsList,
    completenessStats,
    copyToClipboard,
    addToast
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');

  // Filtering
  const filterText = (text?: string) => {
    if (!searchTerm.trim()) return true;
    if (!text) return false;
    return text.toLowerCase().includes(searchTerm.toLowerCase());
  };

  const filteredPengelola = pengelolaList.filter(p => 
    filterText(p.nama_lengkap) || filterText(p.jabatan) || filterText(p.nip) || filterText(p.email)
  );

  const filteredPenetapan = penetapanList.filter(p => 
    filterText(p.nama_item) || filterText(p.kode_item) || filterText(p.nomor_sk_dokumen) || filterText(p.deskripsi_singkat)
  );

  const filteredEvaluasi = ppeppLogsList.filter(p => p.tahap_ppepp === 'Evaluasi' && (
    filterText(p.judul_kegiatan_atau_butir) || filterText(p.kode_butir) || filterText(p.narasi_ringkas) || filterText(p.plor_problem)
  ));

  const filteredPengendalian = ppeppLogsList.filter(p => p.tahap_ppepp === 'Pengendalian' && (
    filterText(p.judul_kegiatan_atau_butir) || filterText(p.kode_butir) || filterText(p.narasi_ringkas)
  ));

  const filteredPeningkatan = ppeppLogsList.filter(p => p.tahap_ppepp === 'Peningkatan' && (
    filterText(p.judul_kegiatan_atau_butir) || filterText(p.kode_butir) || filterText(p.narasi_ringkas)
  ));

  const filteredDampak = ppeppLogsList.filter(p => p.tahap_ppepp === 'Dampak Tridharma' && (
    filterText(p.judul_kegiatan_atau_butir) || filterText(p.kode_butir) || filterText(p.narasi_ringkas)
  ));

  // Export to CSV Function
  const handleExportCSV = () => {
    try {
      const rows: string[][] = [
        ['LPMPP UNIVERSITAS PATTIMURA - KEMDIKTI SAINTEK SPMI REKAPITULASI SIKLUS', `${currentYear}`],
        ['Kode PT', UNPATTI_INFO.kode_pt, 'Nama PT', UNPATTI_INFO.nama_pt],
        ['Status Akreditasi', UNPATTI_INFO.akreditasi, 'Kelengkapan', `${completenessStats.overallPercent}%`],
        [],
        ['=== 1. PENGELOLA SPMI ==='],
        ['No', 'Nama Lengkap', 'NIP', 'Jabatan', 'No HP', 'Email', 'Status'],
        ...pengelolaList.map((p, idx) => [
          `${idx + 1}`,
          `"${p.nama_lengkap}"`,
          `'${p.nip}`,
          `"${p.jabatan}"`,
          `'${p.no_hp}`,
          p.email,
          p.is_aktif ? 'Aktif' : 'Non-Aktif'
        ]),
        [],
        ['=== 2. DOKUMEN PENETAPAN (KOMITMEN & STANDAR) ==='],
        ['Kode', 'Nama Standar / Dokumen', 'Kategori', 'Bentuk/SK', 'Tanggal', 'Tautan Google Drive'],
        ...penetapanList.map(p => [
          p.kode_item,
          `"${p.nama_item}"`,
          p.kategori_menu,
          `"${p.nomor_sk_dokumen || p.bentuk_implementasi || '-'}"`,
          p.tanggal_penetapan || '-',
          p.gdrive_public_url || '-'
        ]),
        [],
        ['=== 3. SIKLUS PPEPP (EVALUASI, PENGENDALIAN, PENINGKATAN, DAMPAK) ==='],
        ['Tahap', 'Kode', 'Judul Butir / Agenda', 'Narasi Ringkas Kemdiktisaintek', 'Tautan Drive Bukti'],
        ...ppeppLogsList.map(item => [
          item.tahap_ppepp,
          item.kode_butir,
          `"${item.judul_kegiatan_atau_butir}"`,
          `"${(item.narasi_ringkas || '').replace(/"/g, '""')}"`,
          item.gdrive_public_url || '-'
        ])
      ];

      const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + rows.map(e => e.join(';')).join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `SIMPATTI_SPMI_Kemdiktisaintek_Rekap_${currentYear}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addToast('success', 'Ekspor CSV Berhasil', `File rekapitulasi siklus ${currentYear} telah diunduh.`);
    } catch (e) {
      addToast('error', 'Gagal Mengekspor', 'Terjadi kesalahan pembentukan berkas CSV.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="glass-panel p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 no-print">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-amber-500" />
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                Lembar Rekap Siap Input (Kemdiktisaintek Cheat-Sheet)
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Seluruh isian pelaporan siklus PPEPP Universitas Pattimura (Tahun {currentYear}) tersusun berurutan dengan tombol salin cepat per sel data.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor CSV / Excel</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Cetak Laporan Eksekutif</span>
            </button>

            <a
              href={UNPATTI_INFO.portal_spmi_kemdikbud}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <span>Buka spmi.kemdiktisaintek.go.id</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari butir data, kata kunci narasi, atau nomor SK di seluruh lembar rekap..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/50"
          />
        </div>
      </div>

      {/* PRINT-ONLY HEADER */}
      <div className="hidden print-only p-6 border-b-2 border-slate-900 text-center space-y-2 mb-6">
        <div className="flex items-center justify-center gap-4">
          <UnpattiLogo size={60} />
          <div className="text-left">
            <div className="text-lg font-bold tracking-tight uppercase text-slate-900">
              KEMENTERIAN PENDIDIKAN TINGGI, SAINS, DAN TEKNOLOGI
            </div>
            <div className="text-base font-bold text-slate-900 uppercase">
              LEMBAR REKAPITULASI PELAPORAN SIKLUS PPEPP SPMI — TAHUN {currentYear}
            </div>
            <div className="text-xs font-semibold text-slate-800">
              LPMPP UNIVERSITAS PATTIMURA (KODE PT: {UNPATTI_INFO.kode_pt})
            </div>
          </div>
        </div>
        <div className="text-xs text-slate-600 pt-1 border-t border-slate-300">
          Status Akreditasi Institusi: UNGGUL · Tanggal Cetak: {new Date().toLocaleDateString('id-ID')} · Sistem Lapor Pusat SIMPATTI
        </div>
      </div>

      {/* SECTION 1: PENGELOLA PT */}
      <div className="glass-panel rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs space-y-2 p-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold flex items-center justify-center text-xs">
              1
            </span>
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
              Data Pengelola SPMI Perguruan Tinggi
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-500">{filteredPengelola.length} Terdata</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300">
              <tr>
                <th className="sticky left-0 bg-slate-100 dark:bg-slate-800 py-2 px-3 z-10 shadow-xs">Nama Lengkap</th>
                <th className="py-2 px-3">NIP</th>
                <th className="py-2 px-3">Jabatan</th>
                <th className="py-2 px-3">No. HP</th>
                <th className="py-2 px-3">Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredPengelola.map((p) => (
                <tr key={p.email} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="sticky left-0 bg-white dark:bg-slate-900 z-10 py-2 px-3 font-semibold text-slate-900 dark:text-white shadow-xs whitespace-nowrap">
                    <div className="flex items-center justify-between gap-1">
                      <span>{p.nama_lengkap}</span>
                      <CopyButton textToCopy={p.nama_lengkap} iconOnly size="xs" />
                    </div>
                  </td>
                  <td className="py-2 px-3 font-mono text-[11px]">
                    <div className="flex items-center justify-between gap-1">
                      <span>{p.nip}</span>
                      <CopyButton textToCopy={p.nip} iconOnly size="xs" />
                    </div>
                  </td>
                  <td className="py-2 px-3">
                    <div className="flex items-center justify-between gap-1">
                      <span>{p.jabatan}</span>
                      <CopyButton textToCopy={p.jabatan} iconOnly size="xs" />
                    </div>
                  </td>
                  <td className="py-2 px-3 font-mono text-[11px]">
                    <div className="flex items-center justify-between gap-1">
                      <span>{p.no_hp}</span>
                      <CopyButton textToCopy={p.no_hp} iconOnly size="xs" />
                    </div>
                  </td>
                  <td className="py-2 px-3 text-[11px]">
                    <div className="flex items-center justify-between gap-1">
                      <span>{p.email}</span>
                      <CopyButton textToCopy={p.email} iconOnly size="xs" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: PENETAPAN */}
      <div className="glass-panel rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs space-y-2 p-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold flex items-center justify-center text-xs">
              2
            </span>
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
              Dokumen Penetapan SPMI (Kebijakan & Standar)
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-500">{filteredPenetapan.length} Butir</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300">
              <tr>
                <th className="sticky left-0 bg-slate-100 dark:bg-slate-800 py-2 px-3 w-16 z-10 shadow-xs">Kode</th>
                <th className="py-2 px-3">Nama Dokumen / Standar</th>
                <th className="py-2 px-3">Nomor Legalitas SK</th>
                <th className="py-2 px-3">Tanggal</th>
                <th className="py-2 px-3">Tautan Google Drive Publik</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredPenetapan.map((item) => (
                <tr key={item.kode_item} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="sticky left-0 bg-white dark:bg-slate-900 z-10 py-2.5 px-3 font-mono font-bold text-amber-600 dark:text-amber-400 shadow-xs">
                    {item.kode_item}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center justify-between gap-1 font-semibold text-slate-900 dark:text-white">
                      <span>{item.nama_item}</span>
                      <CopyButton textToCopy={item.nama_item} iconOnly size="xs" />
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px]">
                    <div className="flex items-center justify-between gap-1">
                      <span>{item.nomor_sk_dokumen || item.bentuk_implementasi || '-'}</span>
                      <CopyButton textToCopy={item.nomor_sk_dokumen || ''} iconOnly size="xs" />
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px]">
                    <div className="flex items-center justify-between gap-1">
                      <span>{item.tanggal_penetapan}</span>
                      <CopyButton textToCopy={item.tanggal_penetapan || ''} iconOnly size="xs" />
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400 truncate max-w-[220px]">
                        {item.gdrive_public_url || '-'}
                      </span>
                      {item.gdrive_public_url && (
                        <CopyButton textToCopy={item.gdrive_public_url} iconOnly size="xs" />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: EVALUASI (PLOR+CA) */}
      <div className="glass-panel rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs space-y-2 p-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold flex items-center justify-center text-xs">
              3
            </span>
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
              Evaluasi & Audit Mutu Internal (Model PLOR+CA)
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-500">{filteredEvaluasi.length} Butir</span>
        </div>

        <div className="space-y-3 pt-1">
          {filteredEvaluasi.map((item) => (
            <div key={item.kode_butir} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    {item.kode_butir}
                  </span>
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    {item.judul_kegiatan_atau_butir}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CopyButton textToCopy={item.narasi_ringkas} label="Narasi" size="xs" buttonText="Salin Narasi" />
                  {item.gdrive_public_url && (
                    <CopyButton textToCopy={item.gdrive_public_url} label="Link Drive" size="xs" buttonText="Salin URL" />
                  )}
                </div>
              </div>

              <div className="text-[11px] text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed font-sans bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800">
                {item.narasi_ringkas}
              </div>

              <div className="text-[10px] font-mono text-slate-500 truncate">
                Tautan Drive: {item.gdrive_public_url}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: PENGENDALIAN & PENINGKATAN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pengendalian */}
        <div className="glass-panel rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-purple-500/20 text-purple-700 dark:text-purple-300 font-bold flex items-center justify-center text-xs">
                4
              </span>
              <h2 className="font-bold text-xs text-slate-900 dark:text-white">
                Pengendalian (Risalah RTM)
              </h2>
            </div>
            <span className="text-[11px] font-mono text-slate-500">{filteredPengendalian.length} Item</span>
          </div>

          <div className="space-y-2">
            {filteredPengendalian.map(item => (
              <div key={item.kode_butir} className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white truncate">{item.judul_kegiatan_atau_butir}</span>
                  <CopyButton textToCopy={item.narasi_ringkas} iconOnly size="xs" />
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">{item.narasi_ringkas}</p>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                  <span>Drive: {item.gdrive_public_url ? 'Ada' : '-'}</span>
                  {item.gdrive_public_url && (
                    <CopyButton textToCopy={item.gdrive_public_url} size="xs" buttonText="Salin URL" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Peningkatan */}
        <div className="glass-panel rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-bold flex items-center justify-center text-xs">
                5
              </span>
              <h2 className="font-bold text-xs text-slate-900 dark:text-white">
                Peningkatan (Elevasi Standar Baru)
              </h2>
            </div>
            <span className="text-[11px] font-mono text-slate-500">{filteredPeningkatan.length} Item</span>
          </div>

          <div className="space-y-2">
            {filteredPeningkatan.map(item => (
              <div key={item.kode_butir} className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white truncate">{item.judul_kegiatan_atau_butir}</span>
                  <CopyButton textToCopy={item.narasi_ringkas} iconOnly size="xs" />
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">{item.narasi_ringkas}</p>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                  <span>Drive: {item.gdrive_public_url ? 'Ada' : '-'}</span>
                  {item.gdrive_public_url && (
                    <CopyButton textToCopy={item.gdrive_public_url} size="xs" buttonText="Salin URL" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 5: DAMPAK TRIDHARMA (4 BUTIR WAJIB) */}
      <div className="glass-panel rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs space-y-2 p-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-rose-500/20 text-rose-700 dark:text-rose-300 font-bold flex items-center justify-center text-xs">
              6
            </span>
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
              Dampak Tridharma & Praktik Baik PPEPP (4 Butir Wajib)
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-500">4 Butir Wajib</span>
        </div>

        <div className="space-y-3 pt-1">
          {filteredDampak.map((item, idx) => (
            <div key={item.kode_butir} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="font-bold text-xs text-slate-900 dark:text-white">
                  #{idx + 1}. {item.judul_kegiatan_atau_butir}
                </span>
                <div className="flex items-center gap-1.5">
                  <CopyButton textToCopy={item.narasi_ringkas} label="Narasi Dampak" size="xs" buttonText="Salin Narasi" />
                  {item.gdrive_public_url && (
                    <CopyButton textToCopy={item.gdrive_public_url} label="Link Portofolio" size="xs" buttonText="Salin Drive" />
                  )}
                </div>
              </div>

              <div className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed font-sans bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800">
                {item.narasi_ringkas}
              </div>

              <div className="text-[10px] font-mono text-slate-500 truncate">
                Portofolio Drive: {item.gdrive_public_url}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
