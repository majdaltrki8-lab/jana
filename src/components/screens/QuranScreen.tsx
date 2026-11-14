import React, { useState, useRef } from 'react';
import { VirtualTeacher } from '../VirtualTeacher';
import { SpeakButton } from '../SpeakButton';
import { prescribedSurahs } from '../../utils/quranData';
import { playSoundEffect, speakText, stopSpeaking } from '../../utils/audio';
import { Volume2, Play, Pause, RotateCcw, Check, Sparkles, BookOpen, Star, Square } from 'lucide-react';
import { QuranSurah } from '../../types';

interface QuranScreenProps {
  onAddStars: (amount: number) => void;
  onCompleteLesson: (lessonId: string) => void;
}

type TabType = 'menu' | 'surahs' | 'memorize' | 'listen' | 'repeat' | 'tajweed' | 'quiz';

export const QuranScreen: React.FC<QuranScreenProps> = ({ onAddStars, onCompleteLesson }) => {
  const [activeTab, setActiveTab] = useState<TabType>('menu');
  const [selectedSurah, setSelectedSurah] = useState<QuranSurah>(prescribedSurahs[0]);

  // Audio player state for authentic recitations
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const verseAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [repeatCount, setRepeatCount] = useState(3);
  const [currentRepeat, setCurrentRepeat] = useState(1);

  // Memorization quiz state
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);

  const handleStopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (verseAudioRef.current) {
      verseAudioRef.current.pause();
      setPlayingAyah(null);
    }
    setIsPlaying(false);
    setAudioError(null);
  };

  const handlePlayAyah = (surahId: number, ayahNumber: number, forceReplay: boolean = false) => {
    stopSpeaking();
    setAudioError(null);
    // Stop full surah audio if playing
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    if (!forceReplay && playingAyah === ayahNumber && verseAudioRef.current && !verseAudioRef.current.paused) {
      verseAudioRef.current.pause();
      setPlayingAyah(null);
      return;
    }

    const sPad = String(surahId).padStart(3, '0');
    const aPad = String(ayahNumber).padStart(3, '0');
    const url = `/audio/quran/ayahs/${sPad}${aPad}.mp3`;

    if (!verseAudioRef.current) {
      verseAudioRef.current = new Audio(url);
    } else {
      verseAudioRef.current.pause();
      verseAudioRef.current.src = url;
      verseAudioRef.current.currentTime = 0;
    }

    verseAudioRef.current.onended = () => {
      setPlayingAyah(null);
      playSoundEffect.star();
    };

    verseAudioRef.current.onerror = () => {
      setPlayingAyah(null);
      setAudioError(`ملف تلاوة الآية ${ayahNumber} من ${selectedSurah.name} غير متوفر محلياً (${url}).`);
    };

    setPlayingAyah(ayahNumber);
    verseAudioRef.current.play().catch(() => {
      setPlayingAyah(null);
      setAudioError(`تعذر تشغيل تلاوة الآية ${ayahNumber} محلياً.`);
    });
  };

  const quranCards = [
    {
      id: 'surahs' as TabType,
      title: 'سور مقررة',
      subtitle: 'السور المقررة للصف الأول',
      spoken: 'السور القرآنية المقررة للصف الأول الأساسي',
      iconEmoji: '🕌',
      gradient: 'from-emerald-500 to-teal-700',
    },
    {
      id: 'memorize' as TabType,
      title: 'حفظ الآيات',
      subtitle: 'آية بآية مع الترديد',
      spoken: 'حفظ الآيات الكريمة آية بآية مع الترديد والتثبيت',
      iconEmoji: '📖',
      gradient: 'from-amber-500 to-orange-600',
    },
    {
      id: 'listen' as TabType,
      title: 'الاستماع للتلاوة',
      subtitle: 'تلاوات قرآنية عذبة',
      spoken: 'الاستماع للتلاوة القرآنية العذبة بصوت الشيخ مشاري العفاسي',
      iconEmoji: '🎧',
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      id: 'repeat' as TabType,
      title: 'تكرار الحفظ',
      subtitle: 'تكرار ٣ و ٥ و ٧ مرات',
      spoken: 'تكرار الحفظ التلقائي ثلاث أو خمس أو سبع مرات للتثبيت',
      iconEmoji: '🔄',
      gradient: 'from-purple-500 to-violet-700',
    },
    {
      id: 'tajweed' as TabType,
      title: 'أحكام مبسطة',
      subtitle: 'الاستعاذة والبسملة والآداب',
      spoken: 'أحكام وآداب مبسطة: الاستعاذة والبسملة وحسن الإنصات',
      iconEmoji: '📜',
      gradient: 'from-rose-500 to-pink-600',
    },
    {
      id: 'quiz' as TabType,
      title: 'اختبار الحفظ',
      subtitle: 'تثبيت السور وشهادة حفظ',
      spoken: 'اختبار حفظ السور وتثبيتها ونيل الأوسمة',
      iconEmoji: '📋',
      gradient: 'from-teal-500 to-emerald-700',
    },
  ];

  const handlePlayAudio = () => {
    stopSpeaking(); // stop any synthetic TTS speech first
    setAudioError(null);
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {
        setIsPlaying(false);
        setAudioError(`تعذر تشغيل ملف السورة المحلي (${selectedSurah.audioUrl}).`);
      });
    }
  };


  const handleAudioEnded = () => {
    if (currentRepeat < repeatCount) {
      setCurrentRepeat((prev) => prev + 1);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      setIsPlaying(false);
      setCurrentRepeat(1);
      playSoundEffect.fanfare();
      onAddStars(5);
    }
  };

  return (
    <div className="pb-24 pt-2 px-3 sm:px-4 max-w-lg mx-auto">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 rounded-3xl p-3 text-white shadow-lg mb-3 flex items-center justify-between border-2 border-amber-300">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shadow">
            🕌
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg font-black tracking-wide text-amber-200 drop-shadow">
                القرآن الكريم
              </h2>
              <SpeakButton
                text="القرآن الكريم: تلاوة خاشعة وحفظ السور المقررة للصف الأول الابتدائي"
                size="xs"
                className="bg-white/30 text-white"
              />
            </div>
            <p className="text-xs text-white/90 font-medium">تلاوة وحفظ السور المقررة للصف الأول</p>
          </div>
        </div>
        <SpeakButton
          text="أهلاً بكِ يا جنى في روضة القرآن الكريم! خيركم من تعلّم القرآن وعلّمه!"
          size="sm"
          className="bg-amber-400 text-purple-950 hover:bg-amber-300"
        />
      </div>

      {/* Main 6 Cards View */}
      {activeTab === 'menu' && (
        <>
          <VirtualTeacher
            speechText="بارك الله فيكِ يا جنى! القرآن الكريم نور قلوبنا. اختاري السور المقررة، أو استمعي للتلاوة العطرة مع التكرار لتصبحي حافظة كتاب الله!"
            lang="ar"
          />

          <div className="grid grid-cols-2 gap-3 mt-2">
            {quranCards.map((card) => (
              <div
                key={card.id}
                onClick={() => {
                  playSoundEffect.click();
                  setActiveTab(card.id);
                }}
                className={`card-3d relative rounded-2xl p-3.5 bg-gradient-to-b ${card.gradient} text-white flex flex-col items-center justify-center text-center min-h-[140px] shadow-lg border-2 border-white/50 active:scale-95 transition-all group cursor-pointer`}
              >
                <div className="absolute top-2 left-2">
                  <SpeakButton
                    text={card.spoken}
                    size="xs"
                    className="bg-white/30 text-white hover:bg-white/50"
                  />
                </div>
                <div className="text-4xl mb-2 transform group-hover:scale-110 transition-transform filter drop-shadow">
                  {card.iconEmoji}
                </div>
                <h3 className="text-base font-black leading-tight text-white drop-shadow">
                  {card.title}
                </h3>
                <span className="text-[11px] text-white/90 font-medium mt-1">
                  {card.subtitle}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 1. سور مقررة */}
      {activeTab === 'surahs' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTab('menu')}
              className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl hover:bg-emerald-200 transition cursor-pointer"
            >
              ← العودة للأقسام
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-purple-900">
                السور المقررة (الصف الأول)
              </span>
              <SpeakButton text="عشر سور مقررة للصف الأول الأساسي" size="xs" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {prescribedSurahs.map((surah) => (
              <div
                key={surah.id}
                onClick={() => {
                  setSelectedSurah(surah);
                  setActiveTab('listen');
                  playSoundEffect.click();
                }}
                className="bg-white rounded-2xl p-3 border border-emerald-200 shadow-sm flex flex-col items-center text-center hover:bg-emerald-50 transition active:scale-95 group cursor-pointer relative"
              >
                <div className="absolute top-2 left-2">
                  <SpeakButton
                    text={`${surah.name}. عدد آياتها ${surah.ayahCount}، وهي سورة ${surah.revelationType}`}
                    size="xs"
                  />
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-base font-black mb-1.5 group-hover:scale-105 transition">
                  {surah.id}
                </div>
                <h4 className="text-base font-black text-emerald-950 font-quran">
                  {surah.name}
                </h4>
                <div className="flex items-center gap-2 text-[10px] text-purple-600 mt-1 font-bold">
                  <span>{surah.ayahCount} آيات</span>
                  <span>•</span>
                  <span>{surah.revelationType}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2 & 3: الاستماع والتلاوة وحفظ الآيات */}
      {(activeTab === 'listen' || activeTab === 'memorize' || activeTab === 'repeat') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                handleStopAudio();
                setActiveTab('menu');
              }}
              className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl hover:bg-emerald-200 transition cursor-pointer"
            >
              ← العودة للأقسام
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-purple-900 font-quran">
                {selectedSurah.name} ({selectedSurah.ayahCount} آيات)
              </span>
              <SpeakButton text={`تلاوة ${selectedSurah.name}`} size="xs" />
            </div>
          </div>

          <VirtualTeacher
            speechText={`نحن الآن في رحاب ${selectedSurah.name}. استمعي بخشوع للتلاوة وكرري الآيات الكريمة يا جنى!`}
            lang="ar"
          />

          {/* Surah Audio Player Card */}
          <div className="bg-gradient-to-b from-emerald-50 via-teal-50 to-white rounded-3xl p-5 border-2 border-emerald-300 shadow-md">
            {/* Offline local Quran audio tag */}
            <audio
              ref={audioRef}
              src={selectedSurah.audioUrl}
              onEnded={handleAudioEnded}
              onPlay={() => { setIsPlaying(true); setAudioError(null); }}
              onPause={() => setIsPlaying(false)}
              onError={() => {
                setIsPlaying(false);
                setAudioError(`ملف تلاوة ${selectedSurah.name} غير موجود محلياً.`);
              }}
            />

            {audioError && (
              <div className="mb-3 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-800 text-center">
                {audioError}
              </div>
            )}

            <div className="text-center mb-4">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                تلاوة الشيخ مشاري العفاسي
              </span>
              <h3 className="text-2xl font-black text-emerald-950 font-quran mt-2">
                {selectedSurah.name}
              </h3>
            </div>

            {/* Repetition Selector */}
            <div className="flex items-center justify-center gap-2 mb-4 bg-white/80 p-2 rounded-2xl border border-emerald-100">
              <span className="text-xs font-bold text-purple-900">مرات التكرار:</span>
              {[1, 3, 5, 7].map((num) => (
                <button
                  key={num}
                  onClick={() => setRepeatCount(num)}
                  className={`w-7 h-7 rounded-lg text-xs font-black transition cursor-pointer ${
                    repeatCount === num
                      ? 'bg-emerald-600 text-white shadow'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  {num}×
                </button>
              ))}
              {repeatCount > 1 && (
                <span className="text-[10px] font-bold text-amber-600">
                  (التكرار الحالي: {currentRepeat}/{repeatCount})
                </span>
              )}
            </div>

            {/* Audio Controls with Play, Pause, Stop, Replay */}
            <div className="flex items-center justify-center gap-3 mb-5">
              <button
                onClick={handlePlayAudio}
                className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white flex items-center justify-center shadow-lg active:scale-95 transition cursor-pointer"
                title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل التلاوة'}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 mr-0.5" />}
              </button>

              <button
                onClick={handleStopAudio}
                className="p-3 bg-white text-rose-600 rounded-full border border-rose-200 hover:bg-rose-50 shadow-sm active:scale-95 transition cursor-pointer"
                title="إيقاف التلاوة تماماً"
              >
                <Square className="w-4 h-4 fill-rose-600" />
              </button>

              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = 0;
                    audioRef.current.play();
                    setIsPlaying(true);
                  }
                }}
                className="p-3 bg-white text-emerald-800 rounded-full border border-emerald-200 hover:bg-emerald-50 shadow-sm active:scale-95 transition cursor-pointer"
                title="إعادة التلاوة من البداية"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Verses Quran Display with Individual Authentic Recitation Buttons */}
            <div className="space-y-2.5 bg-white p-3.5 rounded-2xl border border-emerald-200/80 shadow-inner max-h-80 overflow-y-auto">
              {selectedSurah.verses.map((ayah) => {
                const isAyahActive = playingAyah === ayah.number;
                return (
                  <div
                    key={ayah.number}
                    onClick={() => handlePlayAyah(selectedSurah.id, ayah.number, true)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                      isAyahActive
                        ? 'bg-amber-50/90 border-amber-400 shadow-md ring-2 ring-amber-300'
                        : 'bg-emerald-50/40 hover:bg-emerald-50/80 border-emerald-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <p className="text-base sm:text-lg font-bold text-emerald-950 font-quran text-right leading-loose flex-1">
                        {ayah.text}{' '}
                        <span className="inline-block text-xs text-amber-700 bg-amber-100 border border-amber-300 w-6 h-6 rounded-full text-center leading-6 font-sans">
                          {ayah.number}
                        </span>
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayAyah(selectedSurah.id, ayah.number, false);
                        }}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition active:scale-95 shrink-0 cursor-pointer ${
                          isAyahActive
                            ? 'bg-amber-400 text-purple-950 shadow ring-2 ring-amber-300 animate-pulse'
                            : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-200'
                        }`}
                        title="استماع لتلاوة الآية بصوت الشيخ مشاري العفاسي"
                        aria-label={`تلاوة الآية ${ayah.number}`}
                      >
                        {isAyahActive ? (
                          <>
                            <Pause className="w-3.5 h-3.5" />
                            <span className="text-[10px]">إيقاف</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5" />
                            <span className="text-[10px]">تلاوة</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Complete Surah Reward Button */}
            <button
              onClick={() => {
                playSoundEffect.fanfare();
                onAddStars(10);
                onCompleteLesson(`quran_${selectedSurah.id}`);
                speakText(
                  `هنيئاً لكِ يا جنى! أتممتِ تلاوة وحفظ ${selectedSurah.name}، بارك الله فيكِ يا بنيتي!`,
                  'ar'
                );
              }}
              className="mt-4 w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl font-bold text-xs shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>أتقنتُ حفظ السورة ⭐ +10</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. أحكام مبسطة */}
      {activeTab === 'tajweed' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTab('menu')}
              className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl hover:bg-emerald-200 transition cursor-pointer"
            >
              ← العودة للأقسام
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-purple-900">آداب وأحكام تلاوة القرآن</span>
              <SpeakButton text="آداب وأحكام تلاوة القرآن الكريم" size="xs" />
            </div>
          </div>

          <div className="space-y-2.5">
            {[
              {
                title: 'الِاسْتِعَاذَةُ',
                text: 'أَقُولُ: «أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ» لِيَحْمِيَنِي اللهُ مِنْ كُلِّ شَرٍّ عِنْدَ قِرَاءَةِ الْقُرْآنِ.',
                emoji: '🛡️',
              },
              {
                title: 'الْبَسْمَلَةُ',
                text: 'أَقُولُ: «بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ» فِي بِدَايَةِ كُلِّ سُورَةٍ، ابْتِغَاءَ بَرَكَةِ اسْمِ اللهِ.',
                emoji: '✨',
              },
              {
                title: 'آدَابُ الِاسْتِمَاعِ وَالْإِنْصَاتِ',
                text: 'عِنْدَمَا يُتْلَى الْقُرْآنُ الْكَرِيمُ، أُنْصِتُ بِأَدَبٍ وَخُشُوعٍ وَلَا أَتَكَلَّمُ لِتَنَالَنِي رَحْمَةُ اللهِ.',
                emoji: '👂',
              },
              {
                title: 'الطَّهَارَةُ وَالنَّظَافَةُ',
                text: 'أَتَوَضَّأُ وَأَكُونُ نَظِيفَةَ الثِّيَابِ وَالْمَكَانِ قَبْلَ مَسِّ الْمُصْحَفِ الشَّرِيفِ.',
                emoji: '🧼',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{item.emoji}</span>
                    <h4 className="text-sm font-black text-emerald-900">{item.title}</h4>
                  </div>
                  <SpeakButton text={`${item.title}. ${item.text}`} size="xs" />
                </div>
                <p className="text-xs text-purple-950 font-medium leading-relaxed bg-emerald-50/50 p-2.5 rounded-xl">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. اختبار الحفظ */}
      {activeTab === 'quiz' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTab('menu')}
              className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl hover:bg-emerald-200 transition cursor-pointer"
            >
              ← العودة للأقسام
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-purple-900">اختبار حفظ السور</span>
              <SpeakButton text="اختبار حفظ السور الكريمة" size="xs" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border-2 border-emerald-300 shadow-md text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl mb-2">
              ⭐
            </div>
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <h3 className="text-base font-black text-emerald-950 font-quran">
                سؤال في سورة الإخلاص:
              </h3>
              <SpeakButton
                text="سؤال في سورة الإخلاص: ما هي الآية الأخيرة التي تكمل السورة الكريمة؟"
                size="xs"
              />
            </div>
            <p className="text-sm font-bold text-purple-900 bg-emerald-50 p-3 rounded-2xl mb-4 font-quran leading-loose">
              «قُلْ هُوَ اللَّهُ أَحَدٌ ۞ اللَّهُ الصَّمَدُ ۞ لَمْ يَلِدْ وَلَمْ يُولَدْ ۞ ...»
              <br />
              مَا هِيَ الْآيَةُ الْأَخِيرَةُ يَا جَنَى؟
            </p>

            <div className="space-y-2">
              {[
                'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
                'مِن شَرِّ مَا خَلَقَ',
                'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ',
              ].map((opt, idx) => (
                <div key={opt} className="relative">
                  <button
                    onClick={() => {
                      if (idx === 0) {
                        playSoundEffect.fanfare();
                        setQuizFeedback('أحسنتِ يا جنى! بارك الله في حفظكِ لسورة الإخلاص!');
                        speakText('أحسنتِ يا جنى! إجابة صحيحة بارك الله فيكِ!', 'ar');
                        onAddStars(5);
                      } else {
                        playSoundEffect.error();
                        setQuizFeedback('حاولي تذكر الآية الأخيرة من سورة الإخلاص يا جنى!');
                        speakText('حاولي تذكر الآية الأخيرة من سورة الإخلاص يا جنى!', 'ar');
                      }
                    }}
                    className="w-full py-3 px-4 bg-emerald-50/70 hover:bg-emerald-100 border border-emerald-200 rounded-2xl text-sm font-black text-emerald-950 font-quran transition active:scale-95 cursor-pointer text-center"
                  >
                    {opt}
                  </button>
                  <div className="absolute top-2 left-2">
                    <SpeakButton text={opt} size="xs" variant="ghost" />
                  </div>
                </div>
              ))}
            </div>

            {quizFeedback && (
              <div className="mt-4 p-2 bg-emerald-100 text-emerald-800 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5">
                <span>{quizFeedback}</span>
                <SpeakButton text={quizFeedback} size="xs" variant="ghost" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
