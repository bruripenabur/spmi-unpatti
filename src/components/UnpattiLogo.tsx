import React, { useState } from 'react';

export const UNPATTI_LOCAL_LOGO_URL = '/assets/aistudio/Logo_Unpatti_New_d71c02b9.png';
export const UNPATTI_OFFICIAL_LOGO_URL =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Logo_Universitas_Pattimura_Terbaru.png/330px-Logo_Universitas_Pattimura_Terbaru.png';

interface UnpattiLogoProps {
  className?: string;
  size?: number;
  showTextFallback?: boolean;
}

export const UnpattiLogo: React.FC<UnpattiLogoProps> = ({ 
  className = '', 
  size = 40,
  showTextFallback = true
}) => {
  const [imgSrc, setImgSrc] = useState(UNPATTI_LOCAL_LOGO_URL);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (imgSrc === UNPATTI_LOCAL_LOGO_URL) {
      setImgSrc(UNPATTI_OFFICIAL_LOGO_URL);
    } else {
      setHasError(true);
    }
  };

  if (hasError) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`rounded-lg bg-[#0B192C] border-2 border-[#D4AF37] flex flex-col items-center justify-center text-center p-0.5 shadow-md shrink-0 ${className}`}
        title="Universitas Pattimura"
      >
        <span className="text-[10px] font-extrabold text-[#FACC15] tracking-tighter leading-none">
          UNPATTI
        </span>
        <span className="text-[7px] font-bold text-white/80 tracking-widest leading-none mt-0.5">
          1962
        </span>
      </div>
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
    >
      <img
        src={imgSrc}
        alt="Logo Resmi Universitas Pattimura"
        loading="eager"
        referrerPolicy="no-referrer"
        onError={handleError}
        className="w-full h-full object-contain drop-shadow-sm transition-transform duration-200"
      />
    </div>
  );
};
