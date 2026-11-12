import React from 'react';
import { SouthYemenFlag } from '../SouthYemenFlag';
import { JanaAvatar } from '../JanaAvatar';
import { AppIcon } from '../AppIcon';
import { Sparkles, Play, Heart, Volume2 } from 'lucide-react';
import { playSoundEffect, speakJanaWelcome, stopSpeaking } from '../../utils/audio';

interface SplashScreenProps {
  onStart: () => void;
  stars: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onStart, stars }) => {
  const handleStart = () => {
    stopSpeaking();
    playSoundEffect.fanfare();
    // Play the official welcome voice on user interaction
    speakJanaWelcome();
    onStart();
  };

  const handlePlayWelcomeVoice = (e: React.MouseEvent) => {
    e.stopPropagation();
    playSoundEffect.click();
    speakJanaWelcome();
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#f8edff] via-[#fdeeff] to-[#fff4fa] flex flex-col items-center justify-between p-4 overflow-hidden select-none">
      {/* Decorative background sunbeams & clouds */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-amber-300/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-88 h-88 bg-pink-300/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-1/4 w-80 h-80 bg-purple-300/25 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Card matching Reference Image 4 */}
      <div className="w-full max-w-sm flex items-center justify-between pt-2 px-1 z-10">
        {/* South Yemen Flag with Golden Frame on left */}
        <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-2xl shadow-sm border border-amber-300">
          <SouthYemenFlag className="w-8 h-5" waving={true} />
          <span className="text-[11px] font-black text-purple-900">الجنوب العربي</span>
        </div>

        {/* Stars Counter */}
        <div className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-yellow-400 text-purple-950 px-3 py-1 rounded-full font-black text-xs shadow-md border-2 border-white">
          <span>⭐</span>
          <span className="tabular-nums">{stars} نجمة</span>
        </div>
      </div>

      {/* School Royal Golden Badge with Official App Icon matching Reference Image */}
      <div className="w-full max-w-sm flex flex-col items-center mt-1 z-10">
        <div className="relative px-4 py-2 bg-gradient-to-r from-purple-900 via-indigo-950 to-purple-900 rounded-3xl border-2 border-amber-400 shadow-xl text-center flex items-center justify-center gap-2.5">
          <AppIcon size="xs" className="w-9 h-9 rounded-xl shadow-md ring-1 ring-amber-300 shrink-0" />
          <div className="text-right">
            <div className="flex items-center gap-1">
              <span className="text-base sm:text-lg font-black text-amber-300 tracking-wide drop-shadow">
                مدرسة خديجة للبنات
              </span>
              <span className="text-sm">🌿</span>
            </div>
            <p className="text-[10px] text-amber-200/95 font-bold">
              تطبيق جنى التعليمي • الصف الأول الابتدائي
            </p>
          </div>
        </div>
      </div>

      {/* Center Hero: Jana's Real Photograph & Speech Bubble */}
      <div className="my-auto flex flex-col items-center z-10 w-full max-w-sm">
        <div className="relative flex items-center justify-center w-full">
          {/* Jana Photo */}
          <div className="relative group">
            <div className="absolute -inset-3 bg-gradient-to-tr from-pink-400 via-purple-400 to-amber-300 rounded-[2.8rem] blur-sm opacity-80 group-hover:opacity-100 transition duration-300" />
            <JanaAvatar
              mode="full"
              size="full"
              className="w-56 h-68 sm:w-60 sm:h-72 ring-4 ring-amber-300 shadow-2xl"
            />
            {/* Cute floating badge */}
            <div className="absolute -bottom-2.5 -right-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-lg border-2 border-white flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>الطالبة جنى 🌸</span>
            </div>
          </div>

          {/* Speech Bubble: "مرحباً جنى" */}
          <div className="absolute -top-3 -right-2 sm:right-0 bg-gradient-to-b from-white to-pink-50 border-3 border-pink-400 rounded-3xl px-4 py-2.5 shadow-xl flex flex-col items-center transform rotate-2 animate-pulse">
            <div className="flex items-center gap-1">
              <span className="text-amber-500 text-xs">✨</span>
              <span className="text-base font-black text-rose-700 font-sans tracking-tight">
                مرحباً
              </span>
              <span className="text-amber-500 text-xs">✨</span>
            </div>
            <span className="text-2xl font-black text-purple-950 -mt-1 drop-shadow-sm">
              جنى
            </span>
            <button
              type="button"
              onClick={handlePlayWelcomeVoice}
              className="mt-1 p-1 bg-amber-400 hover:bg-amber-300 text-purple-950 rounded-full shadow transition active:scale-90 cursor-pointer"
              title="استمع للترحيب الصوتي"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Pink Ribbon Banner: "هيا نتعلم ونمرح معاً" */}
        <div className="mt-4 px-6 py-2 bg-gradient-to-r from-pink-100 via-purple-100 to-pink-100 border-2 border-pink-300 rounded-full shadow-sm text-center flex items-center justify-center gap-1.5">
          <span className="text-amber-500 text-sm">⭐</span>
          <h2 className="text-sm font-black text-purple-950">
            هيا نتعلّم ونمرح معاً
          </h2>
          <span className="text-amber-500 text-sm">⭐</span>
        </div>

        {/* Study books & tools illustration */}
        <div className="flex items-center justify-center gap-3 mt-3 text-2xl">
          <span>📚</span>
          <span>✏️</span>
          <span>🎨</span>
          <span>📐</span>
        </div>
      </div>

      {/* Bottom Direct Entry Action Button: "ابدئي الآن" */}
      <div className="w-full max-w-sm flex flex-col items-center gap-2 mb-3 z-10">
        <button
          type="button"
          onClick={handleStart}
          className="w-full py-4 px-6 rounded-3xl bg-gradient-to-r from-purple-800 via-fuchsia-700 to-purple-800 text-white font-black text-xl shadow-xl shadow-fuchsia-600/30 border-3 border-amber-300 flex items-center justify-center gap-3 hover:brightness-110 active:scale-95 transition-all cursor-pointer ring-4 ring-amber-300/40"
        >
          <span>ابدئي الآن</span>
          <div className="w-8 h-8 rounded-full bg-white text-purple-900 flex items-center justify-center shadow-md">
            <Play className="w-5 h-5 fill-purple-900 mr-0.5" />
          </div>
        </button>

        <p className="text-[11px] text-purple-700 font-bold flex items-center gap-1">
          <span>دخول مباشر مخصص للطالبة جنى فقط • مدرسة خديجة للبنات</span>
          <Sparkles className="w-3 h-3 text-amber-500" />
        </p>
      </div>
    </div>
  );
};
