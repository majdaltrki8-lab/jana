import React from 'react';

export const APP_OFFICIAL_ICON = '/app-icon.png';

interface AppIconProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'custom';
  rounded?: boolean;
  withShadow?: boolean;
  bordered?: boolean;
}

export const AppIcon: React.FC<AppIconProps> = ({
  className = '',
  size = 'md',
  rounded = true,
  withShadow = true,
  bordered = true,
}) => {
  const sizeClasses = {
    xs: 'w-7 h-7',
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
    '2xl': 'w-36 h-36',
    custom: '',
  };

  return (
    <div
      className={`relative shrink-0 overflow-hidden select-none ${
        rounded ? 'rounded-2xl sm:rounded-3xl' : ''
      } ${
        bordered ? 'ring-2 ring-amber-300 border-2 border-white/80' : ''
      } ${
        withShadow ? 'shadow-lg shadow-purple-950/30' : ''
      } ${sizeClasses[size]} ${className}`}
    >
      <img
        src={APP_OFFICIAL_ICON}
        alt="أيقونة تطبيق جنى التعليمي – مدرسة خديجة للبنات"
        className="w-full h-full object-cover"
        loading="eager"
      />
    </div>
  );
};
