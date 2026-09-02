import React from 'react';
import logoImage from '../../assets/logo.png';

interface BloomBeeLogoProps {
  className?: string;
  variant?: 'full' | 'icon-only' | 'horizontal' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  subtitleText?: string;
}

export const BloomBeeLogo: React.FC<BloomBeeLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
  showSubtitle = true,
  subtitleText = 'Pure Himalayan Harvests',
}) => {
  const iconDimensions = {
    sm: { w: 32, h: 32 },
    md: { w: 42, h: 42 },
    lg: { w: 54, h: 54 },
    xl: { w: 96, h: 96 },
  }[size];

  // The uploaded brand mark (assets/logo.png), used everywhere the bee icon
  // used to appear — swap that file to change the logo across the whole site.
  const renderBeeIcon = () => (
    <img
      src={logoImage}
      alt="BloomBee Naturals logo"
      width={iconDimensions.w}
      height={iconDimensions.h}
      className="shrink-0 object-contain transition-transform duration-300 group-hover:scale-105"
      style={{ width: iconDimensions.w, height: iconDimensions.h }}
    />
  );

  if (variant === 'icon-only') {
    return <div className={`inline-flex items-center ${className}`}>{renderBeeIcon()}</div>;
  }

  const isWhite = variant === 'white';

  return (
    <div className={`inline-flex items-center gap-2 sm:gap-3 shrink-0 ${className}`}>
      {renderBeeIcon()}
      <div className="flex flex-col whitespace-nowrap">
        <div className="flex items-baseline gap-1">
          <span
            className={`font-serif tracking-tight font-black leading-none ${
              size === 'sm'
                ? 'text-base'
                : size === 'lg'
                ? 'text-2xl sm:text-3xl'
                : size === 'xl'
                ? 'text-3xl sm:text-4xl'
                : 'text-lg sm:text-xl'
            } ${isWhite ? 'text-white' : 'text-[#2D1B10]'}`}
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            BloomBee
          </span>
          <span
            className={`font-sans font-bold uppercase tracking-widest text-[9px] sm:text-[10px] ${
              isWhite ? 'text-[#F5B324]' : 'text-[#8A5100]'
            }`}
          >
            Naturals
          </span>
          <span
            className={`text-[8px] font-semibold ${
              isWhite ? 'text-gray-300' : 'text-gray-500'
            }`}
          >
            ™
          </span>
        </div>
        
        {showSubtitle && (
          <p
            className={`text-[9px] sm:text-[10.5px] font-medium tracking-wide mt-0.5 hidden xs:block ${
              isWhite ? 'text-gray-300' : 'text-[#5C6E58]'
            }`}
          >
            {subtitleText}
          </p>
        )}
      </div>
    </div>
  );
};