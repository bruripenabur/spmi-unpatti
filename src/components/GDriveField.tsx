import React, { useState } from 'react';
import { ExternalLink, CheckCircle2, AlertTriangle, ShieldAlert, Check, RefreshCw } from 'lucide-react';
import { validateGDriveUrl, GDriveValidationResult } from '../lib/urlValidator';
import { CopyButton } from './CopyButton';

interface GDriveFieldProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

export const GDriveField: React.FC<GDriveFieldProps> = ({
  value,
  onChange,
  label = 'Tautan Dokumen Publik Google Drive',
  placeholder = 'https://drive.google.com/file/d/.../view?usp=sharing',
  required = false,
}) => {
  const [validation, setValidation] = useState<GDriveValidationResult | null>(() => {
    return value ? validateGDriveUrl(value) : null;
  });
  const [hasChecked, setHasChecked] = useState(false);

  const handleValidate = () => {
    const res = validateGDriveUrl(value);
    setValidation(res);
    setHasChecked(true);
  };

  const handleApplyRecommended = () => {
    if (validation?.recommendedUrl) {
      onChange(validation.recommendedUrl);
      setValidation(validateGDriveUrl(validation.recommendedUrl));
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <span>{label}</span>
          {required && <span className="text-rose-500 font-bold">*</span>}
        </label>
        {value && (
          <div className="flex items-center gap-2">
            <CopyButton textToCopy={value} label="URL Google Drive" size="xs" buttonText="Salin URL" />
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
            >
              <span>Uji Link</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="url"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setHasChecked(false);
          }}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-slate-800 dark:text-slate-200"
        />
        <button
          type="button"
          onClick={handleValidate}
          className="px-3 py-2 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 inline-flex items-center gap-1.5 shrink-0 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${hasChecked ? 'text-emerald-500' : 'text-slate-500'}`} />
          <span>Validasi Format Link</span>
        </button>
      </div>

      {/* Mandatory Red Warning Box */}
      <div className="p-2.5 rounded-lg border border-rose-300/80 bg-rose-50/90 dark:bg-rose-950/30 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2">
        <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-semibold text-rose-900 dark:text-rose-100 block">
            Peringatan Akses Kementerian:
          </strong>
          Pastikan file/tautan dapat diakses/dibaca oleh publik (<span className="underline font-medium">Anyone with the link</span>) dengan izin <em>Pelihat (Viewer)</em>. Tautan dengan akses terbatas akan berstatus &quot;Akses Ditolak&quot; saat verifikasi asesor SPMI Kemdiktisaintek.
        </div>
      </div>

      {/* Validation Result Feedback */}
      {hasChecked && validation && (
        <div className="text-xs space-y-1 animate-in fade-in">
          {validation.isValidFormat ? (
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Format URL Google Drive terverifikasi valid ({validation.kind}).</span>
              </div>
              {validation.recommendedUrl !== value && (
                <button
                  type="button"
                  onClick={handleApplyRecommended}
                  className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-600 text-white rounded hover:bg-emerald-700 inline-flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  Gunakan Format Standar
                </button>
              )}
            </div>
          ) : (
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200 flex items-start gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span>{validation.errorMessage || validation.warningMessage}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
