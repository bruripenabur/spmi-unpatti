import React from 'react';
import { 
  Workflow, 
  ExternalLink, 
  CheckCircle2, 
  RefreshCw, 
  Calendar, 
  Database, 
  FileCheck,
  Server
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CopyButton } from '../components/CopyButton';

export const PelaksanaanView: React.FC = () => {
  const { currentYear, integrationSystems, addToast } = useApp();

  const handleSyncSystem = (name: string) => {
    addToast('success', 'Sinkronisasi Berhasil', `Data sistem ${name} telah diselaraskan dengan basis data LPMPP.`);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="glass-panel p-5 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Workflow className="w-5 h-5 text-amber-500" />
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
              Tahap Pelaksanaan: Integrasi Sistem Kemdiktisaintek
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pelaksanaan standar mutu Universitas Pattimura diukur melalui rekaman data operasional terpusat pada 9 sistem basis data kementerian dan portal LPMPP (Tahun Siklus {currentYear}).
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 shrink-0">
          <Server className="w-4 h-4 text-emerald-500" />
          <span>9 / 9 Sistem Terkoneksi</span>
        </div>
      </div>

      {/* Grid 9 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrationSystems.map((sys) => (
          <div
            key={sys.id}
            className="glass-panel p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 hover:border-amber-500/40 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {sys.kode}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                    {sys.nama}
                  </h3>
                  <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                    {sys.singkatan}
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span>{sys.status_sinkronisasi}</span>
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {sys.deskripsi}
              </p>

              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-[11px] space-y-1">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Kategori Data:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{sys.kategori}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 font-mono text-[10px]">
                  <span>Pembaruan Terakhir:</span>
                  <span>{sys.tanggal_update}</span>
                </div>
                <div className="pt-1 border-t border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-[11px] truncate">
                  📊 {sys.total_data_sync}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
              <a
                href={sys.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium truncate max-w-[150px]"
              >
                <span>Buka Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleSyncSystem(sys.singkatan)}
                  title="Cek Sinkronisasi"
                  className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <CopyButton
                  textToCopy={`${sys.nama} (${sys.singkatan}): ${sys.url}\nRekaman: ${sys.total_data_sync}`}
                  label={`Data ${sys.singkatan}`}
                  size="xs"
                  buttonText="Salin"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
