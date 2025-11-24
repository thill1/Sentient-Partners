import React, { useState } from 'react';
import { Hexagon } from 'lucide-react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "h-10" }) => {
  const [imgError, setImgError] = useState(false);

  // If the user has not uploaded logo.png yet, or the path is wrong,
  // we fallback to this premium icon so the site looks good in the meantime.
  if (imgError) {
    return (
      <div className={`relative flex items-center justify-center ${className} aspect-square`}>
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-purple-600 rounded-lg opacity-20 rotate-6"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 to-brand-500 rounded-lg shadow-lg flex items-center justify-center text-white">
          <Hexagon className="w-3/5 h-3/5 fill-current" strokeWidth={1.5} />
          <span className="absolute text-[10px] font-bold text-white">SP</span>
        </div>
      </div>
    );
  }

  return (
    <img 
      src="/logo.png" 
      alt="Sentient Partners" 
      className={`${className} object-contain`}
      onError={() => setImgError(true)}
    />
  );
};