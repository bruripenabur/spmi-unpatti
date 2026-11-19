/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ToastContainer } from './components/ToastContainer';
import { DashboardView } from './views/DashboardView';
import { ProfilPTView } from './views/ProfilPTView';
import { PojokInfoView } from './views/PojokInfoView';
import { PengelolaView } from './views/PengelolaView';
import { PenetapanView } from './views/PenetapanView';
import { PelaksanaanView } from './views/PelaksanaanView';
import { EvaluasiView } from './views/EvaluasiView';
import { PengendalianView } from './views/PengendalianView';
import { PeningkatanView } from './views/PeningkatanView';
import { DampakTridharmaView } from './views/DampakTridharmaView';
import { InformasiView } from './views/InformasiView';
import { CheatSheetView } from './views/CheatSheetView';
import { LoginView } from './views/LoginView';
import { 
  ExternalLink, 
  Loader2, 
  FileSpreadsheet,
  X
} from 'lucide-react';
import { UNPATTI_INFO } from './lib/defaultTemplates';

const AppContent: React.FC = () => {
  const { 
    activeMenu, 
    setActiveMenu, 
    currentYear, 
    isLoading, 
    isAuthenticated 
  } = useApp();

  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [isCheatSheetModalOpen, setIsCheatSheetModalOpen] = useState(false);

  // If user is not logged in, show the split-screen Login Page
  if (!isAuthenticated) {
    return (
      <>
        <ToastContainer />
        <LoginView />
      </>
    );
  }

  const renderActiveView = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <DashboardView />;
      case 'profil_pt':
        return <ProfilPTView />;
      case 'pojok_info':
        return <PojokInfoView />;
      case 'penetapan':
        return <PenetapanView />;
      case 'pelaksanaan':
        return <PelaksanaanView />;
      case 'evaluasi':
        return <EvaluasiView />;
      case 'pengendalian':
        return <PengendalianView />;
      case 'peningkatan':
        return <PeningkatanView />;
      case 'dampak':
        return <DampakTridharmaView />;
      case 'informasi':
        return <InformasiView />;
      case 'pengelola':
        return <PengelolaView />;
      case 'cheatsheet':
        return <CheatSheetView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/90 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <ToastContainer />

      {/* Top Header */}
      <Header
        onToggleSidebar={() => setIsSidebarOpenMobile(prev => !prev)}
        onOpenCheatSheet={() => setActiveMenu('cheatsheet')}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex">
        {/* Sidebar (Desktop fixed & Mobile/Tablet slide-over drawer) */}
        <Sidebar
          isOpenMobile={isSidebarOpenMobile}
          onCloseMobile={() => setIsSidebarOpenMobile(false)}
        />

        {/* Content Viewport (desktop offset for 72 = 288px sidebar) */}
        <main className="flex-1 lg:ml-72 p-3 sm:p-5 lg:p-8 max-w-7xl w-full mx-auto pb-24">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Memuat Data Siklus PPEPP SPMI Tahun {currentYear}...
              </div>
              <p className="text-xs text-slate-500 text-center max-w-md">
                Menghubungkan ke Supabase Cloud dan menyelaraskan template instrumen LPMPP Universitas Pattimura.
              </p>
            </div>
          ) : (
            renderActiveView()
          )}
        </main>
      </div>

      {/* Floating Bottom Quick Action for Mirror Mode & Ministry Entry */}
      <div className="fixed bottom-4 right-4 z-30 no-print flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveMenu('cheatsheet')}
          className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-amber-300 border border-amber-500/40 text-xs font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Lembar Rekap</span>
          <span>Siap Salin</span>
        </button>

        <a
          href={UNPATTI_INFO.portal_spmi_kemdikbud}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[44px] px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span>Portal Kemdiktisaintek</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Quick CheatSheet Modal Drawer if opened */}
      {isCheatSheetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Lembar Rekap Cepat Siap Input (Kemdiktisaintek Cheat-Sheet)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCheatSheetModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <CheatSheetView />
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
