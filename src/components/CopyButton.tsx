import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CopyButtonProps {
  textToCopy?: string;
  label?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'xs';
  className?: string;
  buttonText?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy = '',
  label,
  iconOnly = false,
  size = 'sm',
  className = '',
  buttonText = 'Salin',
}) => {
  const { copyToClipboard, isMirrorMode } = useApp();
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!textToCopy) return;
    copyToClipboard(textToCopy, label);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const sizeClasses = {
    xs: 'px-2 py-1 text-[11px] gap-1',
    sm: 'px-2.5 py-1.2 text-xs gap-1.5',
    md: 'px-3.5 py-1.5 text-xs font-medium gap-2',
  }[size];

  const iconSize = size === 'xs' ? 'w-3 h-3' : 'w-3.5 h-3.5';

  if (iconOnly) {
    return (
      <button
        type="button"
        onClick={handleCopy}
        title={label ? `Salin ${label}` : 'Salin ke clipboard'}
        className={`p-1.5 rounded-md transition-all duration-150 inline-flex items-center justify-center ${
          copied
            ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
            : isMirrorMode
            ? 'bg-amber-400/15 text-amber-700 dark:text-amber-300 hover:bg-amber-400/25 border border-amber-400/40 shadow-xs'
            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
        } ${className}`}
      >
        {copied ? <Check className={iconSize} /> : <Copy className={iconSize} />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`rounded-lg inline-flex items-center font-medium transition-all duration-150 shrink-0 whitespace-nowrap ${sizeClasses} ${
        copied
          ? 'bg-emerald-600 text-white shadow-xs'
          : isMirrorMode
          ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold shadow-xs ring-1 ring-amber-400/50 hover:shadow-md'
          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
      } ${className}`}
    >
      {copied ? (
        <>
          <Check className={iconSize} />
          <span>Tersalin!</span>
        </>
      ) : (
        <>
          <Copy className={iconSize} />
          <span>{buttonText}</span>
        </>
      )}
    </button>
  );
};
