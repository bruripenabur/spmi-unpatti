export type TahapPPEPP = 'Penetapan' | 'Pelaksanaan' | 'Evaluasi' | 'Pengendalian' | 'Peningkatan' | 'Dampak Tridharma';

export interface SiklusPT {
  tahun: number;
  kode_pt: string;
  nama_pt: string;
  status_pelaporan: 'Belum Dimulai' | 'Draf Kerja' | 'Siap Lapor' | 'Sudah Dilaporkan';
  persentase_kelengkapan: number;
  tanggal_sinkronisasi_terakhir?: string;
  catatan_admin?: string;
}

export interface PengelolaPT {
  id?: string;
  tahun: number;
  nama_lengkap: string;
  nip: string;
  jabatan: string;
  no_hp: string;
  email: string;
  is_aktif: boolean;
}

export interface PenetapanItem {
  id?: string;
  tahun: number;
  kategori_menu: 'komitmen_mutu' | 'standar_spmi' | 'standar_lainnya' | 'mekanisme_dokumentasi';
  kode_item: string;
  nama_item: string;
  status_ada: boolean;
  bentuk_implementasi?: string; // e.g., 'Sistem unit tersendiri', 'Melekat pada organ', 'Kombinasi'
  nomor_sk_dokumen?: string;
  tanggal_penetapan?: string;
  deskripsi_singkat?: string;
  gdrive_public_url?: string;
  status_link_publik?: 'Valid' | 'Format Tidak Valid' | 'Belum Divalidasi' | 'Akses Terbatas';
}

export interface TargetPT {
  id?: string;
  tahun: number;
  urutan_jenjang: number;
  jenjang_pendidikan: string; // e.g. 'Sarjana', 'Diploma Tiga', etc.
  sndikti_masa_studi_maks: string;
  sndikti_beban_sks_min: string;
  sndikti_ipk_min: string;
  sndikti_beban_dosen_sks: string;
  pt_masa_studi_maks: string;
  pt_beban_sks_min: string;
  pt_ipk_min: string;
  pt_beban_dosen_sks: string;
  pt_syarat_tambahan_lulus?: string;
  pt_syarat_tambahan_dosen?: string;
}

export interface PPEPPLogItem {
  id?: string;
  tahun: number;
  tahap_ppepp: TahapPPEPP;
  kode_butir: string;
  judul_kegiatan_atau_butir: string;
  unit_sumber?: string;
  tanggal_pelaksanaan_selesai?: string;
  narasi_ringkas?: string;
  // Specific for Evaluasi (PLOR+CA)
  plor_problem?: string;
  plor_location?: string;
  plor_objective_evidence?: string;
  plor_reference?: string;
  plor_correction?: string;
  plor_action?: string;
  // Google Drive URL & Verification
  gdrive_public_url?: string;
  status_link_publik?: 'Valid' | 'Format Tidak Valid' | 'Belum Divalidasi' | 'Akses Terbatas';
  status_verifikasi_lpmpp?: 'Draf' | 'Diverifikasi' | 'Perlu Perbaikan';
  kategori_evaluasi?: 'Pemantauan' | 'Audit Mutu Internal' | 'Evaluasi Diri' | 'Asesmen';
  // Additional metrics if applicable
  realisasi_capaian?: string;
  status_ketercapaian?: 'Melampaui' | 'Mencapai' | 'Belum Mencapai';
}

export interface SistemIntegrasi {
  id: string;
  kode: string;
  nama: string;
  singkatan: string;
  url: string;
  deskripsi: string;
  kategori: string;
  status_sinkronisasi: 'Terhubung' | 'Aktif' | 'Perlu Pembaruan';
  tanggal_update: string;
  total_data_sync: string;
}
