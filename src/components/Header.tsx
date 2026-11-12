import React, { useState, useEffect } from 'react';
import { SouthYemenFlag } from './SouthYemenFlag';
import { JanaAvatar } from './JanaAvatar';
import { AppIcon } from './AppIcon';
import {
  Volume2,
  VolumeX,
  ArrowRight,
  Sparkles,
  Star,
  Square,
  RotateCcw,
} from 'lucide-react';
import { ScreenType } from '../types';
import {
  stopSpeaking,
  replayLastSpeech,
  subscribeSpeechState,
  getCurrentSpokenText,
} from '../utils/audio';

interface HeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  stars: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  title?: string;
  showBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  stars,
  soundEnabled,
  onToggleSound,
  title,
  showBack = false,
}) => {
  const [activeSpeech, setActiveSpeech] = useState<string | null>(getCurrentSpokenText());

  useEffect(() => {
    return subscribeSpeechState((txt) => {
      setActiveSpeech(txt);
    });
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-800 text-white shadow-md border-b-2 border-amber-400">
      <div className="max-w-2xl mx-auto px-3 py-2 flex items-center justify-between gap-2">
        {/* Right side in RTL (First element): Back button or Flag & School */}
        <div className="flex items-center gap-2 shrink-0">
          {showBack ? (
            <button
              onClick={() => {
                stopSpeaking();
                onNavigate('home');
              }}
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition active:scale-95 flex items-center justify-center cursor-pointer"
              title="العودة للرئيسية"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <div
                onClick={() => onNavigate('home')}
                className="cursor-pointer transition active:scale-90"
                title="تطبيق جنى التعليمي"
              >
                <AppIcon size="xs" className="w-8 h-8 rounded-xl shadow-md ring-1 ring-amber-300" />
              </div>
              <div className="flex items-center gap-1.5 bg-black/20 px-2 py-0.5 rounded-full border border-white/10">
                <SouthYemenFlag className="w-5 h-3.5" />
                <span className="text-[10px] font-bold text-amber-200 tracking-wide">الجنوب</span>
              </div>
            </div>
          )}
        </div>

        {/* Center: Golden Emblem or Screen Title */}
        <div className="flex-1 text-center flex flex-col items-center justify-center min-w-0 px-1">
          {title ? (
            <div className="flex items-center gap-1.5 justify-center max-w-full">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <h1 className="text-sm sm:text-base font-black text-amber-300 drop-shadow-sm truncate">
                {title}
              </h1>
            </div>
          ) : (
            <div
              onClick={() => onNavigate('home')}
              className="cursor-pointer group flex flex-col items-center"
            >
              <div className="flex items-center gap-1">
                <span className="text-amber-400 text-xs">🎓</span>
                <span className="text-sm sm:text-base font-black text-amber-300 tracking-tight group-hover:text-amber-200 transition drop-shadow">
                  مدرسة خديجة للبنات
                </span>
                <span className="text-amber-400 text-xs">🌿</span>
              </div>
              <span className="text-[10px] text-purple-200 font-medium">الصف الأول الابتدائي • جنى</span>
            </div>
          )}
        </div>

        {/* Left side in RTL (Last element): Audio controls, Stars & Jana Avatar */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Quick Stop Audio Button when speech is running */}
          {activeSpeech && (
            <button
              onClick={stopSpeaking}
              className="flex items-center gap-1 bg-rose-500 hover:bg-rose-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow animate-pulse cursor-pointer"
              title="إيقاف الصوت الآن"
            >
              <Square className="w-3 h-3 fill-white" />
              <span>إيقاف</span>
            </button>
          )}

          {/* Quick Replay Audio Button */}
          <button
            onClick={replayLastSpeech}
            className="p-1.5 rounded-full bg-white/15 hover:bg-white/30 text-amber-200 hover:text-white transition active:scale-95 cursor-pointer"
            title="إعادة استماع آخر نص مقروء"
            aria-label="إعادة الاستماع"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Star Counter */}
          <div
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-1 bg-amber-500/20 border border-amber-400/40 px-2 py-0.5 rounded-full cursor-pointer hover:bg-amber-500/30 transition"
            title="نجوم جنى"
          >
            <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span className="text-xs font-black text-amber-300 tabular-nums">{stars}</span>
          </div>

          {/* Sound Toggle Button */}
          <button
            onClick={onToggleSound}
            className={`p-1.5 rounded-full transition active:scale-95 cursor-pointer ${
              soundEnabled ? 'bg-amber-400 text-purple-950 shadow' : 'bg-white/20 text-white/70'
            }`}
            title={soundEnabled ? 'كتم المؤثرات الصوتية' : 'تشغيل المؤثرات الصوتية'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Mini Jana Real Avatar */}
          <div
            onClick={() => onNavigate('profile')}
            className="cursor-pointer transition active:scale-95"
            title="ملف الطالبة جنى"
          >
            <JanaAvatar size="sm" withRing={true} />
          </div>
        </div>
      </div>
    </header>
  );
};
