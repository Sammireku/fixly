import React from 'react';

interface FixlyLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const FixlyLogo: React.FC<FixlyLogoProps> = ({
  className = '',
  showText = true,
  size = 'md',
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {/* High precision SVG of the Fixly Hammer + Lightning Bolt symbol */}
      <div className={`${iconSizes[size]} relative flex items-center justify-center shrink-0`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
        >
          {/* Hammer Head & Claw in Vibrant Electric Blue */}
          <path
            d="M62 20C58 12 68 8 78 12C85 15 92 22 88 28C84 34 76 38 70 32L62 38L52 28L62 20Z"
            fill="#0072FF"
          />
          {/* Lightning Bolt Stem forming the handle */}
          <path
            d="M58 32L35 55H52L22 88L38 52H25L58 32Z"
            fill="#0072FF"
          />
        </svg>
      </div>

      {showText && (
        <span
          className={`font-black tracking-tight text-[#0072FF] ${textSizes[size]}`}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Fixly
        </span>
      )}
    </div>
  );
};
