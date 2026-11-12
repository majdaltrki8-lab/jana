import React from 'react';

interface Props {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  mode?: 'head' | 'full';
  customUrl?: string;
  withRing?: boolean;
}

export const JANA_REAL_PHOTO =
  '/assets/aistudio/_______________________________________1__2d35e175.png';

export const JanaAvatar: React.FC<Props> = ({
  className = '',
  size = 'md',
  mode = 'head',
  customUrl,
  withRing = true,
}) => {
  const sizeMap = {
    xs: 'w-8 h-8',
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
    full: 'w-60 h-72',
  };

  const imageSrc = customUrl || JANA_REAL_PHOTO;

  if (mode === 'full') {
    return (
      <div
        className={`relative overflow-hidden rounded-[2.5rem] shadow-2xl border-4 border-amber-300 bg-gradient-to-tr from-purple-100 to-pink-100 ${sizeMap[size]} ${className}`}
      >
        <img
          src={imageSrc}
          alt="الطالبة جنى"
          className="w-full h-full object-cover transition duration-300"
          style={{
            objectPosition: 'center 18%',
            transform: 'scale(1.02)',
          }}
          referrerPolicy="no-referrer"
        />
        {/* Soft bottom vignette glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-950/30 via-transparent to-transparent pointer-events-none" />
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-full overflow-hidden shrink-0 ${
        withRing
          ? 'ring-4 ring-amber-300 shadow-lg shadow-purple-300/40 border-2 border-white'
          : ''
      } bg-gradient-to-tr from-purple-100 to-pink-100 ${sizeMap[size]} ${className}`}
    >
      <img
        src={imageSrc}
        alt="الطالبة جنى"
        className="w-full h-full object-cover transition duration-300"
        style={{
          objectPosition: 'center 20%',
          transform: 'scale(1.4)',
        }}
        referrerPolicy="no-referrer"
      />
    </div>
  );
};
