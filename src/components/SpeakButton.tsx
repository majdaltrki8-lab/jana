import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { speakText, stopSpeaking, subscribeSpeechState, getCurrentSpokenText, playSoundEffect } from '../utils/audio';

interface SpeakButtonProps {
  text: string;
  lang?: 'ar' | 'en';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
  variant?: 'circle' | 'pill' | 'ghost';
  label?: string;
}

export const SpeakButton: React.FC<SpeakButtonProps> = ({
  text,
  lang = 'ar',
  size = 'sm',
  className = '',
  variant = 'circle',
  label,
}) => {
  const [isPlaying, setIsPlaying] = useState(getCurrentSpokenText() === text);

  useEffect(() => {
    return subscribeSpeechState((activeText) => {
      setIsPlaying(activeText === text);
    });
  }, [text]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent parent card clicks

    if (isPlaying) {
      stopSpeaking();
    } else {
      playSoundEffect.click();
      speakText(text, lang);
    }
  };

  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
  };

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-bold transition-all active:scale-95 cursor-pointer shadow-sm ${
          isPlaying
            ? 'bg-amber-400 text-purple-950 ring-2 ring-purple-900 animate-pulse'
            : 'bg-purple-100 hover:bg-purple-200 text-purple-900'
        } ${className}`}
        title={isPlaying ? 'إيقاف الصوت' : 'استمع للنص 🔊'}
      >
        {isPlaying ? (
          <VolumeX className={iconSizes[size]} />
        ) : (
          <Volume2 className={iconSizes[size]} />
        )}
        {label && <span className="text-[11px]">{label}</span>}
      </button>
    );
  }

  if (variant === 'ghost') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center justify-center rounded-lg transition-all active:scale-90 cursor-pointer ${
          isPlaying
            ? 'text-amber-500 scale-110 animate-pulse'
            : 'text-purple-600/70 hover:text-purple-900'
        } ${className}`}
        title={isPlaying ? 'إيقاف الصوت' : 'استمع للنص 🔊'}
      >
        <Volume2 className={iconSizes[size]} />
      </button>
    );
  }

  // Default circle button
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center justify-center rounded-full shrink-0 transition-all active:scale-90 cursor-pointer shadow-sm ${sizeClasses[size]} ${
        isPlaying
          ? 'bg-amber-400 text-purple-950 ring-2 ring-amber-300 scale-105 animate-pulse'
          : 'bg-purple-100 hover:bg-purple-200 text-purple-800 border border-purple-200/80'
      } ${className}`}
      title={isPlaying ? 'إيقاف الصوت' : 'استمع للنص 🔊'}
      aria-label={`استمع: ${text}`}
    >
      {isPlaying ? (
        <VolumeX className={iconSizes[size]} />
      ) : (
        <Volume2 className={iconSizes[size]} />
      )}
    </button>
  );
};
