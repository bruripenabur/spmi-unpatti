import { createClient } from '@supabase/supabase-js';
import { 
  SiklusPT, 
  PengelolaPT, 
  PenetapanItem, 
  TargetPT, 
  PPEPPLogItem 
} from '../types/spmi';
import { 
  getDefaultPengelolaList, 
  getDefaultPenetapanItems, 
  getDefaultTargetPT, 
  getDefaultPPEPPLogs,
  UNPATTI_INFO
} from './defaultTemplates';

export const SUPABASE_URL = 'https://kltufmxoxxepetmjzxgq.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_QJu09tSQYPS3npD4UFP0nQ_JCAoY4N3';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Storage fallback keys for resilient offline capability
const STORAGE_PREFIX = 'simpatti_spmi_';

export async function checkSupabaseConnection(): Promise<{ ok: boolean; message: string }> {
  try {
    // Quick probe
    const { error } = await supabase
      .from('lapor_pusat_siklus')
      .select('count', { count: 'exact', head: true })
      .limit(1);

    if (error) {
      console.warn('Supabase probe warning:', error.message);
      return { ok: false, message: error.message };
    }
    return { ok: true, message: 'Terhubung ke database Supabase Cloud' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Koneksi gagal';
    return { ok: false, message: msg };
  }
}

// -------------------------------------------------------------
// 1. SIKLUS PT
// -------------------------------------------------------------
export async function fetchSiklusPT(year: number): Promise<SiklusPT> {
  const localKey = `${STORAGE_PREFIX}siklus_${year}`;
  try {
    const { data, error } = await supabase
      .from('lapor_pusat_siklus')
      .select('*')
      .eq('tahun', year)
      .maybeSingle();

    if (error) {
      console.warn('Error fetching siklus:', error.message);
    }

    if (data) {
      localStorage.setItem(localKey, JSON.stringify(data));
      return data as SiklusPT;
    }
  } catch (e) {
    console.warn('Network issue fetching siklus, falling back to local:', e);
  }

  // Fallback to local storage or default
  const cached = localStorage.getItem(localKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // ignore
    }
  }

  const defaultSiklus: SiklusPT = {
    tahun: year,
    kode_pt: UNPATTI_INFO.kode_pt,
    nama_pt: UNPATTI_INFO.nama_pt,
    status_pelaporan: 'Draf Kerja',
    persentase_kelengkapan: 85,
    tanggal_sinkronisasi_terakhir: new Date().toISOString().split('T')[0],
    catatan_admin: 'Siklus pelaporan aktif LPMPP Universitas Pattimura',
  };
  localStorage.setItem(localKey, JSON.stringify(defaultSiklus));
  return defaultSiklus;
}

export async function upsertSiklusPT(siklus: SiklusPT): Promise<boolean> {
  const localKey = `${STORAGE_PREFIX}siklus_${siklus.tahun}`;
  localStorage.setItem(localKey, JSON.stringify(siklus));

  try {
    const { error } = await supabase
      .from('lapor_pusat_siklus')
      .upsert(siklus, { onConflict: 'tahun' });

    if (error) {
      console.warn('Error upserting siklus:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase upsert failed:', err);
    return false;
  }
}

// -------------------------------------------------------------
// 2. PENGELOLA PT
// -------------------------------------------------------------
export async function fetchPengelolaPT(year: number): Promise<PengelolaPT[]> {
  const localKey = `${STORAGE_PREFIX}pengelola_${year}`;
  try {
    const { data, error } = await supabase
      .from('lapor_pusat_pengelola')
      .select('*')
      .eq('tahun', year)
      .order('id', { ascending: true });

    if (!error && data && data.length > 0) {
      localStorage.setItem(localKey, JSON.stringify(data));
      return data as PengelolaPT[];
    }
  } catch (e) {
    console.warn('Using local fallback for pengelola:', e);
  }

  const cached = localStorage.getItem(localKey);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // ignore
    }
  }

  const defaults = getDefaultPengelolaList(year);
  localStorage.setItem(localKey, JSON.stringify(defaults));
  return defaults;
}

export async function savePengelolaItem(item: PengelolaPT): Promise<boolean> {
  const year = item.tahun;
  const localKey = `${STORAGE_PREFIX}pengelola_${year}`;
  const existing = await fetchPengelolaPT(year);
  const updated = existing.some(e => e.email === item.email || (item.id && e.id === item.id))
    ? existing.map(e => ((item.id && e.id === item.id) || e.email === item.email) ? item : e)
    : [...existing, { ...item, id: item.id || `loc_${Date.now()}` }];
  
  localStorage.setItem(localKey, JSON.stringify(updated));

  try {
    const { error } = await supabase
      .from('lapor_pusat_pengelola')
      .upsert(item);
    if (error) {
      console.warn('Supabase upsert pengelola:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('Network issue saving pengelola:', e);
    return false;
  }
}

export async function deletePengelolaItem(year: number, id?: string, email?: string): Promise<boolean> {
  const localKey = `${STORAGE_PREFIX}pengelola_${year}`;
  const existing = await fetchPengelolaPT(year);
  const updated = existing.filter(e => !(e.id === id || (email && e.email === email)));
  localStorage.setItem(localKey, JSON.stringify(updated));

  try {
    if (id && !id.startsWith('loc_')) {
      await supabase.from('lapor_pusat_pengelola').delete().eq('id', id);
    }
    return true;
  } catch (e) {
    console.warn('Delete pengelola failed:', e);
    return false;
  }
}

// -------------------------------------------------------------
// 3. PENETAPAN (KOMITMEN, STANDAR, DOKUMENTASI)
// -------------------------------------------------------------
export async function fetchPenetapanItems(year: number): Promise<PenetapanItem[]> {
  const localKey = `${STORAGE_PREFIX}penetapan_${year}`;
  try {
    const { data, error } = await supabase
      .from('lapor_pusat_penetapan')
      .select('*')
      .eq('tahun', year)
      .order('kode_item', { ascending: true });

    if (!error && data && data.length > 0) {
      localStorage.setItem(localKey, JSON.stringify(data));
      return data as PenetapanItem[];
    }
  } catch (e) {
    console.warn('Using local fallback for penetapan:', e);
  }

  const cached = localStorage.getItem(localKey);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // ignore
    }
  }

  const defaults = getDefaultPenetapanItems(year);
  localStorage.setItem(localKey, JSON.stringify(defaults));
  return defaults;
}

export async function savePenetapanItem(item: PenetapanItem): Promise<boolean> {
  const year = item.tahun;
  const localKey = `${STORAGE_PREFIX}penetapan_${year}`;
  const existing = await fetchPenetapanItems(year);
  const updated = existing.some(e => e.kode_item === item.kode_item)
    ? existing.map(e => e.kode_item === item.kode_item ? item : e)
    : [...existing, item];

  localStorage.setItem(localKey, JSON.stringify(updated));

  try {
    const { error } = await supabase
      .from('lapor_pusat_penetapan')
      .upsert(item, { onConflict: 'tahun,kode_item' });

    if (error) {
      console.warn('Supabase upsert penetapan item:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('Network issue saving penetapan:', e);
    return false;
  }
}

// -------------------------------------------------------------
// 4. TARGET PT (STANDAR PERGURUAN TINGGI)
// -------------------------------------------------------------
export async function fetchTargetPT(year: number): Promise<TargetPT[]> {
  const localKey = `${STORAGE_PREFIX}target_pt_${year}`;
  try {
    const { data, error } = await supabase
      .from('lapor_pusat_target_pt')
      .select('*')
      .eq('tahun', year)
      .order('urutan_jenjang', { ascending: true });

    if (!error && data && data.length > 0) {
      localStorage.setItem(localKey, JSON.stringify(data));
      return data as TargetPT[];
    }
  } catch (e) {
    console.warn('Using local fallback for target PT:', e);
  }

  const cached = localStorage.getItem(localKey);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // ignore
    }
  }

  const defaults = getDefaultTargetPT(year);
  localStorage.setItem(localKey, JSON.stringify(defaults));
  return defaults;
}

export async function saveTargetPT(items: TargetPT[]): Promise<boolean> {
  if (items.length === 0) return true;
  const year = items[0].tahun;
  const localKey = `${STORAGE_PREFIX}target_pt_${year}`;
  localStorage.setItem(localKey, JSON.stringify(items));

  try {
    const { error } = await supabase
      .from('lapor_pusat_target_pt')
      .upsert(items, { onConflict: 'tahun,jenjang_pendidikan' });

    if (error) {
      console.warn('Supabase upsert target PT:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('Network issue saving target PT:', e);
    return false;
  }
}

// -------------------------------------------------------------
// 5. PPEPP LOGS (EVALUASI, PENGENDALIAN, PENINGKATAN, DAMPAK)
// -------------------------------------------------------------
export async function fetchPPEPPLogs(year: number): Promise<PPEPPLogItem[]> {
  const localKey = `${STORAGE_PREFIX}ppepp_logs_${year}`;
  try {
    const { data, error } = await supabase
      .from('lapor_pusat_ppepp_logs')
      .select('*')
      .eq('tahun', year)
      .order('kode_butir', { ascending: true });

    if (!error && data && data.length > 0) {
      localStorage.setItem(localKey, JSON.stringify(data));
      return data as PPEPPLogItem[];
    }
  } catch (e) {
    console.warn('Using local fallback for ppepp logs:', e);
  }

  const cached = localStorage.getItem(localKey);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // ignore
    }
  }

  const defaults = getDefaultPPEPPLogs(year);
  localStorage.setItem(localKey, JSON.stringify(defaults));
  return defaults;
}

export async function savePPEPPLogItem(item: PPEPPLogItem): Promise<boolean> {
  const year = item.tahun;
  const localKey = `${STORAGE_PREFIX}ppepp_logs_${year}`;
  const existing = await fetchPPEPPLogs(year);
  const updated = existing.some(e => e.kode_butir === item.kode_butir)
    ? existing.map(e => e.kode_butir === item.kode_butir ? item : e)
    : [...existing, item];

  localStorage.setItem(localKey, JSON.stringify(updated));

  try {
    const { error } = await supabase
      .from('lapor_pusat_ppepp_logs')
      .upsert(item, { onConflict: 'tahun,kode_butir' });

    if (error) {
      console.warn('Supabase upsert ppepp log:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('Network issue saving ppepp log:', e);
    return false;
  }
}

// -------------------------------------------------------------
// 6. INISIALISASI TEMPLATE SIKLUS TAHUN INI (UPSERT MASSAL)
// -------------------------------------------------------------
export async function initializeYearTemplate(year: number): Promise<{ success: boolean; message: string }> {
  try {
    const pengelola = getDefaultPengelolaList(year);
    const penetapan = getDefaultPenetapanItems(year);
    const targetPT = getDefaultTargetPT(year);
    const ppepp = getDefaultPPEPPLogs(year);

    // Save to local cache first
    localStorage.setItem(`${STORAGE_PREFIX}pengelola_${year}`, JSON.stringify(pengelola));
    localStorage.setItem(`${STORAGE_PREFIX}penetapan_${year}`, JSON.stringify(penetapan));
    localStorage.setItem(`${STORAGE_PREFIX}target_pt_${year}`, JSON.stringify(targetPT));
    localStorage.setItem(`${STORAGE_PREFIX}ppepp_logs_${year}`, JSON.stringify(ppepp));

    // Try Supabase upserts
    const siklusObj: SiklusPT = {
      tahun: year,
      kode_pt: UNPATTI_INFO.kode_pt,
      nama_pt: UNPATTI_INFO.nama_pt,
      status_pelaporan: 'Draf Kerja',
      persentase_kelengkapan: 90,
      tanggal_sinkronisasi_terakhir: new Date().toISOString().split('T')[0],
      catatan_admin: `Template siklus SPMI tahun ${year} diinisialisasi otomatis sesuai pedoman Kemdiktisaintek.`,
    };
    await upsertSiklusPT(siklusObj);

    // Upsert items in batches
    try {
      await supabase.from('lapor_pusat_pengelola').upsert(pengelola);
      await supabase.from('lapor_pusat_penetapan').upsert(penetapan, { onConflict: 'tahun,kode_item' });
      await supabase.from('lapor_pusat_target_pt').upsert(targetPT, { onConflict: 'tahun,jenjang_pendidikan' });
      await supabase.from('lapor_pusat_ppepp_logs').upsert(ppepp, { onConflict: 'tahun,kode_butir' });
    } catch (dbErr) {
      console.warn('Database batch upsert partial fail, stored locally:', dbErr);
    }

    return {
      success: true,
      message: `Template data siklus PPEPP SPMI tahun ${year} berhasil diinisialisasi untuk LPMPP Universitas Pattimura!`,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Inisialisasi gagal';
    return { success: false, message: msg };
  }
}
