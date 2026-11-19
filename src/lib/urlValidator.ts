/**
 * Google Drive URL Validator & Formatter
 * Memastikan tautan dokumen publik memenuhi syarat verifikasi Kemdiktisaintek
 */

export interface GDriveValidationResult {
  isValidFormat: boolean;
  isGoogleDrive: boolean;
  fileId: string | null;
  kind: 'file' | 'folder' | 'document' | 'spreadsheet' | 'presentation' | 'other' | 'none';
  recommendedUrl: string;
  warningMessage?: string;
  errorMessage?: string;
}

export function validateGDriveUrl(url?: string): GDriveValidationResult {
  if (!url || !url.trim()) {
    return {
      isValidFormat: false,
      isGoogleDrive: false,
      fileId: null,
      kind: 'none',
      recommendedUrl: '',
      errorMessage: 'Tautan Google Drive belum diisi.',
    };
  }

  const cleanUrl = url.trim();

  // Basic URL regex
  try {
    const parsed = new URL(cleanUrl);
    const host = parsed.hostname.toLowerCase();

    const isGoogle = host.includes('drive.google.com') || host.includes('docs.google.com');

    if (!isGoogle) {
      return {
        isValidFormat: false,
        isGoogleDrive: false,
        fileId: null,
        kind: 'other',
        recommendedUrl: cleanUrl,
        warningMessage: 'Tautan bukan berasal dari domain resmi Google Drive (drive.google.com / docs.google.com). Asesor kementerian biasanya mensyaratkan repositori Google Drive publik.',
      };
    }

    let fileId: string | null = null;
    let kind: GDriveValidationResult['kind'] = 'file';

    // Check folder
    const folderMatch = cleanUrl.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    if (folderMatch) {
      fileId = folderMatch[1];
      kind = 'folder';
    }

    // Check file/d/
    const fileMatch = cleanUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileMatch) {
      fileId = fileMatch[1];
      kind = 'file';
    }

    // Check docs/d/
    const docMatch = cleanUrl.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
    if (docMatch) {
      fileId = docMatch[1];
      kind = 'document';
    }

    // Check spreadsheets/d/
    const sheetMatch = cleanUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
    if (sheetMatch) {
      fileId = sheetMatch[1];
      kind = 'spreadsheet';
    }

    // Check presentations/d/
    const presMatch = cleanUrl.match(/\/presentation\/d\/([a-zA-Z0-9_-]+)/);
    if (presMatch) {
      fileId = presMatch[1];
      kind = 'presentation';
    }

    // Check ?id= query param
    if (!fileId && parsed.searchParams.has('id')) {
      fileId = parsed.searchParams.get('id');
    }

    // Build recommended view URL if possible
    let recommendedUrl = cleanUrl;
    if (fileId) {
      if (kind === 'folder') {
        recommendedUrl = `https://drive.google.com/drive/folders/${fileId}?usp=sharing`;
      } else if (kind === 'file') {
        recommendedUrl = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
      }
    }

    // Check if URL has usp=sharing or view
    const hasSharingParam = cleanUrl.includes('usp=sharing') || cleanUrl.includes('/view');

    return {
      isValidFormat: true,
      isGoogleDrive: true,
      fileId,
      kind,
      recommendedUrl,
      warningMessage: !hasSharingParam 
        ? 'Perhatian: Pastikan pengaturan Berbagi (Sharing) file disetel ke "Siapa saja yang memiliki link" (Anyone with the link) dengan hak akses "Pelihat" (Viewer) agar kementerian tidak mengalami Access Denied.'
        : undefined,
    };
  } catch {
    return {
      isValidFormat: false,
      isGoogleDrive: false,
      fileId: null,
      kind: 'none',
      recommendedUrl: cleanUrl,
      errorMessage: 'Format URL tidak valid. Pastikan diawali dengan https://',
    };
  }
}
