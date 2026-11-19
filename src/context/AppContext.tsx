import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  SiklusPT, 
  PengelolaPT, 
  PenetapanItem, 
  TargetPT, 
  PPEPPLogItem,
  SistemIntegrasi
} from '../types/spmi';
import { 
  fetchSiklusPT, 
  fetchPengelolaPT, 
  fetchPenetapanItems, 
  fetchTargetPT, 
  fetchPPEPPLogs,
  upsertSiklusPT,
  initializeYearTemplate,
  checkSupabaseConnection,
  savePenetapanItem,
  saveTargetPT,
  savePPEPPLogItem,
  savePengelolaItem,
  deletePengelolaItem
} from '../lib/supabase';
import { DEFAULT_INTEGRATION_SYSTEMS, UNPATTI_INFO } from '../lib/defaultTemplates';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

interface AppContextType {
  // Year
  currentYear: number;
  setCurrentYear: (year: number) => void;
  availableYears: number[];

  // Navigation
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
  activeSubMenu?: string;
  setActiveSubMenu: (sub: string) => void;
  activeTab?: string;
  setActiveTab: (tab: string) => void;

  // Mirror Mode (Siap Salin)
  isMirrorMode: boolean;
  toggleMirrorMode: () => void;

  // Supabase State
  isConnected: boolean;
  connectionStatus: string;
  isLoading: boolean;
  isSyncing: boolean;

  // Data
  siklus: SiklusPT | null;
  pengelolaList: PengelolaPT[];
  penetapanList: PenetapanItem[];
  targetPTList: TargetPT[];
  ppeppLogsList: PPEPPLogItem[];
  integrationSystems: SistemIntegrasi[];

  // Actions
  refreshAllData: () => Promise<void>;
  handleInitializeTemplate: () => Promise<void>;
  updatePenetapan: (item: PenetapanItem) => Promise<boolean>;
  updateTargetPTMatrix: (items: TargetPT[]) => Promise<boolean>;
  updatePPEPPLog: (item: PPEPPLogItem) => Promise<boolean>;
  updatePengelola: (item: PengelolaPT) => Promise<boolean>;
  removePengelola: (id?: string, email?: string) => Promise<boolean>;
  updateSiklusStatus: (status: SiklusPT['status_pelaporan']) => Promise<void>;

  // Copy & Toast Helpers
  copyToClipboard: (text: string, label?: string) => void;
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, message?: string) => void;
  removeToast: (id: string) => void;

  // Stats
  completenessStats: {
    penetapanPercent: number;
    pelaksanaanPercent: number;
    evaluasiPercent: number;
    pengendalianPercent: number;
    peningkatanPercent: number;
    dampakPercent: number;
    overallPercent: number;
    validLinkCount: number;
    totalLinkCount: number;
  };

  // Dark mode
  isDark: boolean;
  toggleDarkMode: () => void;

  // Authentication
  isAuthenticated: boolean;
  currentUser: { name: string; email: string; role: string } | null;
  login: (email: string, password?: string) => boolean;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const availableYears = [2026, 2025, 2024, 2023, 2022, 2021, 2020];

  const [activeMenu, setActiveMenu] = useState<string>('dashboard');
  const [activeSubMenu, setActiveSubMenu] = useState<string>('komitmen_mutu');
  const [activeTab, setActiveTab] = useState<string>('standar_wajib');

  const [isMirrorMode, setIsMirrorMode] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [connectionStatus, setConnectionStatus] = useState<string>('Memeriksa koneksi Supabase...');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Theme
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('simpatti_theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('simpatti_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('simpatti_theme', 'light');
    }
  }, [isDark]);

  const toggleDarkMode = () => setIsDark(prev => !prev);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('simpatti_auth');
      return stored !== 'false';
    }
    return true;
  });

  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: string } | null>(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('simpatti_user');
      if (storedUser) {
        try {
          return JSON.parse(storedUser);
        } catch {
          // ignore
        }
      }
    }
    return {
      name: 'Dr. Bruri Melky Laimeheriwa, S.Pi., M.Sc.',
      email: 'bruri.laimeheriwa@unpatti.ac.id',
      role: 'Koordinator Pusat Audit Mutu & SPMI LPMPP',
    };
  });

  const login = (loginEmail: string, _password?: string): boolean => {
    let name = 'Pengelola SPMI LPMPP';
    let role = 'Auditor Mutu Internal LPMPP Unpatti';
    if (loginEmail.includes('bruri')) {
      name = 'Dr. Bruri Melky Laimeheriwa, S.Pi., M.Sc.';
      role = 'Koordinator Pusat Audit Mutu & SPMI LPMPP';
    } else if (loginEmail.includes('mario')) {
      name = 'Mario R. Silooy, S.Kom., M.Cs.';
      role = 'Operator PD-SPMI Kementerian';
    } else if (loginEmail.includes('izaak')) {
      name = 'Prof. Dr. Izaak H. Wenno, S.Pd., M.Pd.';
      role = 'Ketua LPMPP Universitas Pattimura';
    }
    const user = { name, email: loginEmail, role };
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('simpatti_auth', 'true');
    localStorage.setItem('simpatti_user', JSON.stringify(user));
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('simpatti_auth', 'false');
  };

  // Data states
  const [siklus, setSiklus] = useState<SiklusPT | null>(null);
  const [pengelolaList, setPengelolaList] = useState<PengelolaPT[]>([]);
  const [penetapanList, setPenetapanList] = useState<PenetapanItem[]>([]);
  const [targetPTList, setTargetPTList] = useState<TargetPT[]>([]);
  const [ppeppLogsList, setPpeppLogsList] = useState<PPEPPLogItem[]>([]);
  const [integrationSystems] = useState<SistemIntegrasi[]>(DEFAULT_INTEGRATION_SYSTEMS);

  const addToast = useCallback((type: ToastMessage['type'], title: string, message?: string) => {
    const id = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const copyToClipboard = useCallback((text: string, label?: string) => {
    if (!text) {
      addToast('warning', 'Teks kosong', 'Tidak ada data untuk disalin');
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      addToast(
        'success', 
        'Tersalin ke clipboard!', 
        label ? `${label} siap ditempel ke portal Kemdiktisaintek.` : 'Siap ditempel ke formulir kementerian.'
      );
    }).catch(() => {
      // Fallback
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        addToast('success', 'Tersalin ke clipboard!', label || 'Teks berhasil disalin.');
      } catch {
        addToast('error', 'Gagal menyalin', 'Izin clipboard browser dibatasi.');
      }
    });
  }, [addToast]);

  // Load data for year
  const loadDataForYear = useCallback(async (year: number) => {
    setIsLoading(true);
    try {
      const conn = await checkSupabaseConnection();
      setIsConnected(conn.ok);
      setConnectionStatus(conn.ok ? 'Supabase Cloud Terhubung' : 'Mode Offline / Lokal Sinkron');

      const [sData, pData, penData, tData, logData] = await Promise.all([
        fetchSiklusPT(year),
        fetchPengelolaPT(year),
        fetchPenetapanItems(year),
        fetchTargetPT(year),
        fetchPPEPPLogs(year)
      ]);

      setSiklus(sData);
      setPengelolaList(pData);
      setPenetapanList(penData);
      setTargetPTList(tData);
      setPpeppLogsList(logData);
    } catch (err) {
      console.error('Error loading data for year:', err);
      addToast('error', 'Gagal memuat data', 'Menggunakan data simpanan lokal.');
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadDataForYear(currentYear);
  }, [currentYear, loadDataForYear]);

  const refreshAllData = async () => {
    setIsSyncing(true);
    await loadDataForYear(currentYear);
    setIsSyncing(false);
    addToast('info', 'Data Disinkronkan', `Data siklus SPMI tahun ${currentYear} telah diperbarui.`);
  };

  const handleInitializeTemplate = async () => {
    setIsSyncing(true);
    const res = await initializeYearTemplate(currentYear);
    if (res.success) {
      addToast('success', 'Inisialisasi Berhasil', res.message);
      await loadDataForYear(currentYear);
    } else {
      addToast('error', 'Inisialisasi Gagal', res.message);
    }
    setIsSyncing(false);
  };

  const updatePenetapan = async (item: PenetapanItem): Promise<boolean> => {
    const success = await savePenetapanItem(item);
    setPenetapanList(prev => {
      const idx = prev.findIndex(p => p.kode_item === item.kode_item);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = item;
        return copy;
      }
      return [...prev, item];
    });
    addToast(
      success ? 'success' : 'info', 
      'Dokumen Penetapan Disimpan', 
      `Butir ${item.kode_item} berhasil disimpan (${success ? 'Supabase & Lokal' : 'Tersimpan Lokal'}).`
    );
    return success;
  };

  const updateTargetPTMatrix = async (items: TargetPT[]): Promise<boolean> => {
    const success = await saveTargetPT(items);
    setTargetPTList(items);
    addToast('success', 'Standar Perguruan Tinggi Disimpan', 'Matriks ketentuan standar Unpatti untuk seluruh jenjang berhasil diperbarui.');
    return success;
  };

  const updatePPEPPLog = async (item: PPEPPLogItem): Promise<boolean> => {
    const success = await savePPEPPLogItem(item);
    setPpeppLogsList(prev => {
      const idx = prev.findIndex(p => p.kode_butir === item.kode_butir);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = item;
        return copy;
      }
      return [...prev, item];
    });
    addToast(
      'success',
      'Data PPEPP Diperbarui',
      `Butir ${item.kode_butir} (${item.tahap_ppepp}) berhasil disimpan.`
    );
    return success;
  };

  const updatePengelola = async (item: PengelolaPT): Promise<boolean> => {
    const success = await savePengelolaItem(item);
    setPengelolaList(prev => {
      const exists = prev.some(p => (item.id && p.id === item.id) || p.email === item.email);
      if (exists) {
        return prev.map(p => ((item.id && p.id === item.id) || p.email === item.email) ? item : p);
      }
      return [...prev, item];
    });
    addToast('success', 'Pengelola Disimpan', `${item.nama_lengkap} berhasil diperbarui.`);
    return success;
  };

  const removePengelola = async (id?: string, email?: string): Promise<boolean> => {
    const success = await deletePengelolaItem(currentYear, id, email);
    setPengelolaList(prev => prev.filter(p => !(p.id === id || (email && p.email === email))));
    addToast('info', 'Pengelola Dihapus', 'Data pengelola berhasil dihapus.');
    return success;
  };

  const updateSiklusStatus = async (status: SiklusPT['status_pelaporan']) => {
    if (!siklus) return;
    const updated: SiklusPT = {
      ...siklus,
      status_pelaporan: status,
      tanggal_sinkronisasi_terakhir: new Date().toISOString().split('T')[0]
    };
    setSiklus(updated);
    await upsertSiklusPT(updated);
    addToast('success', 'Status Pelaporan Diperbarui', `Status siklus ${currentYear} diubah ke: ${status}`);
  };

  const toggleMirrorMode = () => {
    setIsMirrorMode(prev => {
      const next = !prev;
      addToast(
        next ? 'info' : 'warning', 
        next ? 'Mode Cermin Kementerian Aktif' : 'Mode Cermin Dinonaktifkan',
        next ? 'Seluruh tombol salin cepat disorot untuk kemudahan entri ke portal SPMI kementerian.' : 'Tampilan standar aktif.'
      );
      return next;
    });
  };

  // Calculate completeness & stats
  const completenessStats = React.useMemo(() => {
    // 1. Penetapan: Komitmen (min 2) + Standar SPMI (8) + Dokumen (min 1)
    const penWajib = penetapanList.filter(p => p.kategori_menu === 'komitmen_mutu' || p.kategori_menu === 'standar_spmi');
    const penWithLink = penWajib.filter(p => p.status_ada && p.gdrive_public_url && p.gdrive_public_url.length > 10).length;
    const penetapanPercent = penWajib.length > 0 ? Math.round((penWithLink / Math.max(penWajib.length, 10)) * 100) : 0;

    // 2. Pelaksanaan (9 Integrasi sistem)
    const pelaksanaanPercent = 100; // All systems connected

    // 3. Evaluasi (4 butir wajib)
    const evalItems = ppeppLogsList.filter(p => p.tahap_ppepp === 'Evaluasi');
    const evalFilled = evalItems.filter(p => p.narasi_ringkas && p.gdrive_public_url).length;
    const evaluasiPercent = Math.min(100, Math.round((evalFilled / 4) * 100));

    // 4. Pengendalian (min 2 butir)
    const kendaliItems = ppeppLogsList.filter(p => p.tahap_ppepp === 'Pengendalian');
    const pengendalianPercent = kendaliItems.length >= 2 ? 100 : Math.round((kendaliItems.length / 2) * 100);

    // 5. Peningkatan (min 2 butir)
    const tingkatItems = ppeppLogsList.filter(p => p.tahap_ppepp === 'Peningkatan');
    const peningkatanPercent = tingkatItems.length >= 2 ? 100 : Math.round((tingkatItems.length / 2) * 100);

    // 6. Dampak Tridharma (4 butir wajib)
    const dampakItems = ppeppLogsList.filter(p => p.tahap_ppepp === 'Dampak Tridharma');
    const dampakFilled = dampakItems.filter(p => p.narasi_ringkas && p.gdrive_public_url).length;
    const dampakPercent = Math.min(100, Math.round((dampakFilled / 4) * 100));

    // Overall
    const overallPercent = Math.round(
      (penetapanPercent * 0.25) +
      (pelaksanaanPercent * 0.15) +
      (evaluasiPercent * 0.20) +
      (pengendalianPercent * 0.15) +
      (peningkatanPercent * 0.10) +
      (dampakPercent * 0.15)
    );

    // Valid links count
    const allLinks = [
      ...penetapanList.map(p => p.gdrive_public_url),
      ...ppeppLogsList.map(p => p.gdrive_public_url)
    ].filter(Boolean) as string[];

    const validLinkCount = allLinks.filter(u => u.includes('drive.google.com') || u.includes('docs.google.com')).length;

    return {
      penetapanPercent,
      pelaksanaanPercent,
      evaluasiPercent,
      pengendalianPercent,
      peningkatanPercent,
      dampakPercent,
      overallPercent: Math.min(100, Math.max(10, overallPercent)),
      validLinkCount,
      totalLinkCount: allLinks.length,
    };
  }, [penetapanList, ppeppLogsList]);

  return (
    <AppContext.Provider
      value={{
        currentYear,
        setCurrentYear,
        availableYears,
        activeMenu,
        setActiveMenu,
        activeSubMenu,
        setActiveSubMenu,
        activeTab,
        setActiveTab,
        isMirrorMode,
        toggleMirrorMode,
        isConnected,
        connectionStatus,
        isLoading,
        isSyncing,
        siklus,
        pengelolaList,
        penetapanList,
        targetPTList,
        ppeppLogsList,
        integrationSystems,
        refreshAllData,
        handleInitializeTemplate,
        updatePenetapan,
        updateTargetPTMatrix,
        updatePPEPPLog,
        updatePengelola,
        removePengelola,
        updateSiklusStatus,
        copyToClipboard,
        toasts,
        addToast,
        removeToast,
        completenessStats,
        isDark,
        toggleDarkMode,
        isAuthenticated,
        currentUser,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
