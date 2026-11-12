import React from 'react';

interface Props {
  className?: string;
  waving?: boolean;
  withBorder?: boolean;
}

export const SouthYemenFlag: React.FC<Props> = ({
  className = 'w-9 h-6',
  waving = false,
  withBorder = true,
}) => {
  return (
    <div
      className={`relative inline-block overflow-hidden rounded ${
        withBorder ? 'shadow-md border border-amber-300/60' : ''
      } ${waving ? 'transform -rotate-2 hover:rotate-0 transition-transform' : ''} ${className}`}
      title="علم الجنوب العربي"
    >
      <svg
        viewBox="0 0 60 40"
        className="w-full h-full object-cover"
        preserveAspectRatio="none"
      >
        {/* Horizontal Stripes: Red, White, Black */}
        <rect x="0" y="0" width="60" height="13.33" fill="#CE1126" />
        <rect x="0" y="13.33" width="60" height="13.34" fill="#FFFFFF" />
        <rect x="0" y="26.67" width="60" height="13.33" fill="#000000" />

        {/* Sky-Blue Triangle at Hoist (Left) */}
        <polygon points="0,0 24,20 0,40" fill="#38BDF8" />

        {/* Red Five-Pointed Star in Triangle */}
        {/* Center of star at ~ (9, 20) */}
        <polygon
          points="
            9,14.5
            10.2,18.2
            14.2,18.2
            11,20.5
            12.2,24.2
            9,21.8
            5.8,24.2
            7,20.5
            3.8,18.2
            7.8,18.2
          "
          fill="#DC2626"
        />
      </svg>
    </div>
  );
};
