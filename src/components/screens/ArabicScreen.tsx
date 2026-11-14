import React, { useState, useRef, useEffect } from 'react';
import { VirtualTeacher } from '../VirtualTeacher';
import { SpeakButton } from '../SpeakButton';
import { JanaAvatar } from '../JanaAvatar';
import {
  arabicLettersData,
  arabicReadingStories,
  arabicVocabularyCards,
} from '../../utils/curriculumData';
import { playSoundEffect, speakText } from '../../utils/audio';
import { Volume2, Eraser, Check, RefreshCw, Sparkles, BookOpen, PenTool, Headphones, Award } from 'lucide-react';

interface ArabicScreenProps {
  onAddStars: (amount: number) => void;
  onCompleteLesson: (lessonId: string) => void;
}

type TabType = 'menu' | 'letters' | 'reading' | 'writing' | 'spelling' | 'vocab' | 'exercises';

export const ArabicScreen: React.FC<ArabicScreenProps> = ({ onAddStars, onCompleteLesson }) => {
  const [activeTab, setActiveTab] = useState<TabType>('menu');
  const [selectedLetter, setSelectedLetter] = useState(arabicLettersData[0]);
  const [selectedStory, setSelectedStory] = useState(arabicReadingStories[0]);

  // Canvas state for writing practice
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#9333ea');
  const [brushSize, setBrushSize] = useState(8);

  // Spelling exercise state
  const [spellingIndex, setSpellingIndex] = useState(0);
  const [spellingFeedback, setSpellingFeedback] = useState<string | null>(null);

  const spellingQuestions = [
    { targetWord: 'أَرْنَب', spokenLetter: 'أ', options: ['أ', 'ب', 'ت'], correct: 'أ' },
    { targetWord: 'بَطَّة', spokenLetter: 'ب', options: ['ت', 'ب', 'ث'], correct: 'ب' },
    { targetWord: 'تُفَّاح', spokenLetter: 'ت', options: ['ن', 'ي', 'ت'], correct: 'ت' },
    { targetWord: 'قَلَم', spokenLetter: 'ق', options: ['ف', 'ق', 'ك'], correct: 'ق' },
  ];

  // Letter audio click
  const handleLetterClick = (item: (typeof arabicLettersData)[0]) => {
    setSelectedLetter(item);
    playSoundEffect.click();
    speakText(item.sound, 'ar');
  };

  // Canvas drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawTraceLetter();
    }
  };

  const drawTraceLetter = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.font = 'bold 150px Tajawal';
    ctx.fillStyle = '#f3e8ff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(selectedLetter.char, canvas.width / 2, canvas.height / 2);
  };

  useEffect(() => {
    if (activeTab === 'writing') {
      setTimeout(drawTraceLetter, 50);
    }
  }, [activeTab, selectedLetter]);

  // Main 6 Cards matching Screen 4 in screenshot
  const arabicCards = [
    {
      id: 'letters' as TabType,
      title: 'الحروف العربية',
      subtitle: 'نطق الحركات وأشكال الحروف',
      iconEmoji: '🔤',
      gradient: 'from-amber-400 to-orange-500',
    },
    {
      id: 'reading' as TabType,
      title: 'القراءة',
      subtitle: 'قصص سهلة وقراءة ممتعة',
      iconEmoji: '📖',
      gradient: 'from-pink-500 to-rose-600',
    },
    {
      id: 'writing' as TabType,
      title: 'الكتابة',
      subtitle: 'سبورة تفاعلية وتتبع الحروف',
      iconEmoji: '✏️',
      gradient: 'from-purple-500 to-indigo-600',
    },
    {
      id: 'spelling' as TabType,
      title: 'الإملاء',
      subtitle: 'الاستماع واختيار الحرف الصحيح',
      iconEmoji: '🎧',
      gradient: 'from-blue-500 to-cyan-600',
    },
    {
      id: 'vocab' as TabType,
      title: 'الكلمات والجمل',
      subtitle: 'مفردات مصورة ناطقة',
      iconEmoji: '📚',
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'exercises' as TabType,
      title: 'تدريبات وتقويم',
      subtitle: 'أنشطة تقييم ونجوم تفوق',
      iconEmoji: '📋',
      gradient: 'from-violet-500 to-purple-700',
    },
  ];

  return (
    <div className="pb-24 pt-2 px-3 sm:px-4 max-w-lg mx-auto">
      {/* Subject Header Banner matching Reference Mockup Image 3 */}
      <div className="relative bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 rounded-3xl p-3 text-white shadow-lg mb-3 flex items-center justify-between border-2 border-amber-300">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shadow">
            📚
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg font-black tracking-wide text-amber-200 drop-shadow">
                اللغة العربية
              </h2>
              <SpeakButton
                text="مادة اللغة العربية: الحروف والقراءة والكتابة والإملاء والكلمات والجمل والتدريبات"
                size="xs"
                className="bg-white/30 text-white"
              />
            </div>
            <p className="text-xs text-white/90 font-medium">أ ب ت • الحروف والقراءة والكتابة</p>
          </div>
        </div>
        <SpeakButton
          text="أهلاً بكِ يا جنى في مادة اللغة العربية الجميلة! هيا نتعلم معاً الحروف والكلمات والقراءة!"
          size="sm"
          className="bg-amber-400 text-purple-950 hover:bg-amber-300"
        />
      </div>

      {/* Main Menu matching Mockup Image 3 */}
      {activeTab === 'menu' && (
        <div className="space-y-3">
          {/* Jana & Teacher Interactive Speech Prompt Card matching Image 3 */}
          <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-amber-50 rounded-3xl p-3 border-2 border-pink-200 shadow-sm flex items-center justify-between gap-2.5">
            {/* Jana Avatar & Badge on right in RTL */}
            <div className="flex flex-col items-center shrink-0">
              <JanaAvatar size="md" withRing={true} />
              <span className="bg-pink-600 text-white text-[10px] font-black px-2 py-0.2 rounded-full -mt-2 shadow border border-white z-10">
                جنى
              </span>
            </div>

            {/* Speech Bubble in Center */}
            <div className="flex-1 bg-white border-2 border-pink-300 rounded-2xl px-3 py-2 shadow-sm text-center">
              <span className="text-amber-500 text-xs">✨</span>
              <p className="text-xs sm:text-sm font-black text-purple-950 leading-snug">
                هيا نتعلّم معًا اللغة العربية !
              </p>
            </div>

            {/* Big Purple Speaker Button on Left */}
            <button
              type="button"
              onClick={() => {
                playSoundEffect.click();
                speakText('هيا نتعلّم معًا اللغة العربية يا جنى! اختاري من الحروف، القراءة، الكتابة، أو الإملاء!', 'ar');
              }}
              className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white px-3 py-2 rounded-2xl shadow-md border border-amber-300 flex flex-col items-center justify-center gap-0.5 active:scale-95 transition cursor-pointer shrink-0"
              title="استمعي إلى الدرس"
            >
              <Volume2 className="w-5 h-5 text-amber-300" />
              <span className="text-[10px] font-black whitespace-nowrap">استمعي للدرس</span>
            </button>
          </div>

          {/* 5 Main Subject Cards matching Mockup Image 3 */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Row 1, Card 1: القراءة (Sky Blue) */}
            <div
              onClick={() => {
                playSoundEffect.click();
                setActiveTab('reading');
              }}
              className="relative bg-gradient-to-b from-sky-50 via-blue-50 to-sky-100 rounded-2xl p-3.5 border-2 border-sky-300 shadow-sm flex flex-col items-center text-center hover:bg-sky-100 transition active:scale-95 group cursor-pointer"
            >
              <div className="absolute top-2 left-2">
                <SpeakButton text="القراءة: أقرأ قصصاً جميلة ومفيدة" size="xs" variant="ghost" />
              </div>
              <div className="text-4xl my-1 group-hover:scale-110 transition filter drop-shadow">
                📖
              </div>
              <h3 className="text-base font-black text-sky-950 mt-1">القراءة</h3>
              <span className="text-[10px] font-bold text-sky-700">أقرأ مع جنى</span>
            </div>

            {/* Row 1, Card 2: الحروف (Pink) */}
            <div
              onClick={() => {
                playSoundEffect.click();
                setActiveTab('letters');
              }}
              className="relative bg-gradient-to-b from-pink-50 via-rose-50 to-pink-100 rounded-2xl p-3.5 border-2 border-pink-300 shadow-sm flex flex-col items-center text-center hover:bg-pink-100 transition active:scale-95 group cursor-pointer"
            >
              <div className="absolute top-2 left-2">
                <SpeakButton text="الحروف: أ ب ت ث ج ح خ د" size="xs" variant="ghost" />
              </div>
              <div className="text-4xl my-1 group-hover:scale-110 transition filter drop-shadow">
                🔤
              </div>
              <h3 className="text-base font-black text-pink-950 mt-1">الحروف</h3>
              <span className="text-[10px] font-bold text-pink-700">أ ب ت</span>
            </div>

            {/* Row 2, Card 3: الكتابة (Peach) */}
            <div
              onClick={() => {
                playSoundEffect.click();
                setActiveTab('writing');
              }}
              className="relative bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 rounded-2xl p-3.5 border-2 border-amber-300 shadow-sm flex flex-col items-center text-center hover:bg-amber-100 transition active:scale-95 group cursor-pointer"
            >
              <div className="absolute top-2 left-2">
                <SpeakButton text="الكتابة: سبورة تفاعلية لرسم وتتبع الحروف باليد" size="xs" variant="ghost" />
              </div>
              <div className="text-4xl my-1 group-hover:scale-110 transition filter drop-shadow">
                ✏️
              </div>
              <h3 className="text-base font-black text-amber-950 mt-1">الكتابة</h3>
              <span className="text-[10px] font-bold text-amber-700">دفتر وقلم</span>
            </div>

            {/* Row 2, Card 4: الإملاء (Teal) */}
            <div
              onClick={() => {
                playSoundEffect.click();
                setActiveTab('spelling');
              }}
              className="relative bg-gradient-to-b from-teal-50 via-cyan-50 to-teal-100 rounded-2xl p-3.5 border-2 border-teal-300 shadow-sm flex flex-col items-center text-center hover:bg-teal-100 transition active:scale-95 group cursor-pointer"
            >
              <div className="absolute top-2 left-2">
                <SpeakButton text="الإملاء: الاستماع لنطق الحرف واختيار الحرف الصحيح" size="xs" variant="ghost" />
              </div>
              <div className="text-4xl my-1 group-hover:scale-110 transition filter drop-shadow">
                🎧
              </div>
              <h3 className="text-base font-black text-teal-950 mt-1">الإملاء</h3>
              <span className="text-[10px] font-bold text-teal-700">سماع وتهجئة</span>
            </div>
          </div>

          {/* Row 3: الكلمات (Wide Card matching bottom of Mockup 3) */}
          <div
            onClick={() => {
              playSoundEffect.click();
              setActiveTab('vocab');
            }}
            className="relative bg-gradient-to-r from-purple-50 via-pink-50 to-purple-100 rounded-2xl p-3.5 border-2 border-purple-300 shadow-sm flex items-center justify-between hover:bg-purple-100 transition active:scale-95 group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl filter drop-shadow">📖</div>
              <div className="text-right">
                <h3 className="text-base font-black text-purple-950">الكلمات والجمل</h3>
                <span className="text-[11px] font-bold text-purple-700">
                  كتاب • قلم • مفردات مصورة وناطقة
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <SpeakButton text="الكلمات والجمل: مفردات مصورة ناطقة وممتعة" size="xs" />
              <span className="text-xs font-black text-purple-700">فتح ❯</span>
            </div>
          </div>
        </div>
      )}

      {/* 1. الحروف العربية */}
      {activeTab === 'letters' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTab('menu')}
              className="text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1.5 rounded-xl hover:bg-purple-200 transition cursor-pointer"
            >
              ← العودة للأقسام
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-purple-900">
                الحروف العربية (٢٨ حرفاً)
              </span>
              <SpeakButton text="الحروف الهجائية العربية، ثمانية وعشرون حرفاً" size="xs" />
            </div>
          </div>

          <VirtualTeacher
            speechText={`هذا حرف ${selectedLetter.name}: «${selectedLetter.char}». كَمَا فِي كَلِمَةِ «${selectedLetter.word}». استمعي إلى صوته وكرري معي يا جنى!`}
            lang="ar"
          />

          {/* Large Letter Feature Card */}
          <div
            onClick={() => {
              playSoundEffect.click();
              speakText(selectedLetter.sound, 'ar');
            }}
            className="bg-gradient-to-b from-purple-50 to-pink-50 rounded-3xl p-4 border-2 border-purple-200 text-center shadow-md relative cursor-pointer"
          >
            <div className="absolute top-3 left-3">
              <SpeakButton text={selectedLetter.sound} size="sm" className="bg-purple-200 text-purple-900" />
            </div>
            <div className="flex items-center justify-center gap-4">
              <span className="text-7xl font-black text-purple-900 drop-shadow">
                {selectedLetter.char}
              </span>
              <div className="text-6xl">{selectedLetter.emoji}</div>
            </div>
            <div className="mt-2 text-2xl font-black text-purple-950 flex items-center justify-center gap-2">
              <span>{selectedLetter.word}</span>
              <SpeakButton text={selectedLetter.word} size="xs" />
            </div>
            <p className="text-xs text-purple-600 font-bold mt-0.5">
              حرف {selectedLetter.name} ({selectedLetter.char})
            </p>

            <div className="flex items-center justify-center gap-2 mt-3">
              <button
                onClick={() => {
                  playSoundEffect.star();
                  speakText(selectedLetter.sound, 'ar');
                  onAddStars(2);
                }}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 active:scale-95 transition cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>نطق الحرف والكلمة 🔊</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('writing');
                }}
                className="px-3 py-2 bg-amber-400 text-purple-950 rounded-xl text-xs font-bold shadow flex items-center gap-1 active:scale-95 transition cursor-pointer"
              >
                <PenTool className="w-4 h-4" />
                <span>تدرّبي على كتابته</span>
              </button>
            </div>
          </div>

          {/* Alphabet Grid */}
          <div className="grid grid-cols-7 gap-1.5 bg-white p-3 rounded-2xl border border-purple-200 shadow-sm">
            {arabicLettersData.map((item) => (
              <button
                key={item.char}
                onClick={() => handleLetterClick(item)}
                className={`h-11 rounded-xl text-lg font-black transition-all flex items-center justify-center cursor-pointer ${
                  selectedLetter.char === item.char
                    ? 'bg-purple-600 text-white shadow-md scale-105 ring-2 ring-amber-300'
                    : 'bg-purple-50 text-purple-900 hover:bg-purple-100'
                }`}
                title={`حرف ${item.name}`}
              >
                {item.char}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. القراءة */}
      {activeTab === 'reading' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTab('menu')}
              className="text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1.5 rounded-xl hover:bg-purple-200 transition cursor-pointer"
            >
              ← العودة للأقسام
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-purple-900">نصوص القراءة للصف الأول</span>
              <SpeakButton text="نصوص القراءة الميسرة لطالبة الصف الأول" size="xs" />
            </div>
          </div>

          <VirtualTeacher
            speechText={`درس القراءة بعنوان: ${selectedStory.title}. استمعي جيداً وحاولي القراءة معي بصوتكِ الجميل يا جنى!`}
            lang="ar"
          />

          {/* Story Selector */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {arabicReadingStories.map((story) => (
              <button
                key={story.title}
                onClick={() => {
                  setSelectedStory(story);
                  playSoundEffect.click();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedStory.title === story.title
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'bg-purple-100 text-purple-900 hover:bg-purple-200'
                }`}
              >
                {story.title}
              </button>
            ))}
          </div>

          {/* Story Card */}
          <div className="bg-white rounded-3xl p-5 border-2 border-rose-200 shadow-md">
            <div className="flex items-center justify-center gap-2 mb-3">
              <h3 className="text-lg font-black text-rose-600 text-center">
                {selectedStory.title}
              </h3>
              <SpeakButton text={selectedStory.title} size="xs" />
            </div>
            <div
              onClick={() => {
                playSoundEffect.click();
                speakText(selectedStory.text, 'ar');
              }}
              className="relative bg-rose-50/50 p-4 rounded-2xl border border-rose-100 cursor-pointer"
            >
              <div className="absolute top-2 left-2">
                <SpeakButton text={selectedStory.text} size="sm" />
              </div>
              <p className="text-base sm:text-lg font-bold text-purple-950 leading-loose text-center">
                {selectedStory.text}
              </p>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={() => {
                  playSoundEffect.star();
                  speakText(selectedStory.text, 'ar');
                  onAddStars(5);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black text-xs rounded-2xl shadow flex items-center gap-2 active:scale-95 transition cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>قراءة النص كاملاً بصوت المعلمة 🔊</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. الكتابة التفاعلية */}
      {activeTab === 'writing' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTab('menu')}
              className="text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1.5 rounded-xl hover:bg-purple-200 transition cursor-pointer"
            >
              ← العودة للأقسام
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-purple-900">
                سبورة كتابة الحرف: ({selectedLetter.char})
              </span>
              <SpeakButton text={`سبورة كتابة الحرف ${selectedLetter.name}`} size="xs" />
            </div>
          </div>

          <VirtualTeacher
            speechText={`اكتبي حرف «${selectedLetter.char}» بإصبعكِ أو القلم يا جنى داخل السبورة! لا تخافي إذا أخطأتِ، فبإمكانكِ مسحه في أي وقت!`}
            lang="ar"
          />

          {/* Whiteboard Canvas */}
          <div className="bg-white rounded-3xl p-3 border-2 border-purple-300 shadow-lg flex flex-col items-center">
            <canvas
              ref={canvasRef}
              width={340}
              height={260}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full max-w-[340px] h-[260px] bg-purple-50/40 rounded-2xl border-2 border-dashed border-purple-300 touch-none cursor-crosshair shadow-inner"
            />

            {/* Canvas Controls */}
            <div className="flex items-center justify-between w-full mt-3 px-1">
              <div className="flex items-center gap-1.5">
                {['#9333ea', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setBrushColor(c)}
                    style={{ backgroundColor: c }}
                    aria-label={`اختيار لون الفرشاة ${c}`}
                    className={`w-7 h-7 rounded-full border-2 transition cursor-pointer ${
                      brushColor === c ? 'border-purple-950 scale-110 shadow' : 'border-white'
                    }`}
                  ></button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={clearCanvas}
                  className="p-2 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-xl text-xs font-bold flex items-center gap-1 active:scale-95 transition cursor-pointer"
                  title="مسح السبورة"
                >
                  <Eraser className="w-4 h-4" />
                  <span>مسح</span>
                </button>

                <button
                  onClick={() => {
                    playSoundEffect.fanfare();
                    onAddStars(5);
                    speakText('خط رائع وممتاز يا جنى! خطكِ جميل كروحكِ!', 'ar');
                  }}
                  className="px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow active:scale-95 transition cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>أنهيتُ الكتابة ⭐</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. الإملاء الصوتي */}
      {activeTab === 'spelling' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTab('menu')}
              className="text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1.5 rounded-xl hover:bg-purple-200 transition cursor-pointer"
            >
              ← العودة للأقسام
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-purple-900">تمرين الإملاء والاستماع</span>
              <SpeakButton text="تمرين الإملاء والاستماع، استمعي للحرف واختاري الإجابة الصحيحة" size="xs" />
            </div>
          </div>

          <VirtualTeacher
            speechText={`استمعي جيداً للحرف يا جنى: «${spellingQuestions[spellingIndex].spokenLetter}»، واختاري الحرف المطابق!`}
            lang="ar"
          />

          <div className="bg-white rounded-3xl p-5 border-2 border-blue-200 shadow-md text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl mb-3 shadow-inner">
              🎧
            </div>
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <h3 className="text-base font-black text-purple-900">
                ما هو الحرف الذي يبدأ به: {spellingQuestions[spellingIndex].targetWord}؟
              </h3>
              <SpeakButton
                text={`ما هو الحرف الذي تبدأ به كلمة ${spellingQuestions[spellingIndex].targetWord} يا جنى؟`}
                size="xs"
              />
            </div>
            <p className="text-xs text-purple-600 font-medium mb-4">
              اضغطي على زر الصوت للاستماع
            </p>

            <button
              onClick={() => {
                playSoundEffect.click();
                speakText(spellingQuestions[spellingIndex].spokenLetter, 'ar');
              }}
              className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-bold text-xs shadow flex items-center gap-2 mx-auto active:scale-95 transition cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>استمعي للحرف المطلوب 🔊</span>
            </button>

            {/* Options with individual speak buttons */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              {spellingQuestions[spellingIndex].options.map((opt) => (
                <div key={opt} className="relative">
                  <button
                    onClick={() => {
                      if (opt === spellingQuestions[spellingIndex].correct) {
                        playSoundEffect.success();
                        setSpellingFeedback('إجابة صحيحة يا جنى! أحسنتِ!');
                        speakText('إجابة ممتازة يا جنى! أحسنتِ!', 'ar');
                        onAddStars(3);
                        setTimeout(() => {
                          setSpellingFeedback(null);
                          setSpellingIndex((prev) => (prev + 1) % spellingQuestions.length);
                        }, 1800);
                      } else {
                        playSoundEffect.error();
                        setSpellingFeedback('حاولي مرة أخرى يا بطلة!');
                        speakText('حاولي مرة أخرى يا جنى، ركزي جيداً في الصوت!', 'ar');
                      }
                    }}
                    className="w-full py-3.5 bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 rounded-2xl text-2xl font-black text-purple-950 active:scale-95 transition shadow-sm cursor-pointer"
                  >
                    {opt}
                  </button>
                  <div className="absolute top-1 left-1">
                    <SpeakButton text={`حرف ${opt}`} size="xs" variant="ghost" />
                  </div>
                </div>
              ))}
            </div>

            {spellingFeedback && (
              <div className="mt-4 p-2 bg-emerald-100 text-emerald-800 rounded-xl font-bold text-xs">
                {spellingFeedback}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. الكلمات والجمل */}
      {activeTab === 'vocab' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTab('menu')}
              className="text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1.5 rounded-xl hover:bg-purple-200 transition cursor-pointer"
            >
              ← العودة للأقسام
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-purple-900">مفردات مصورة وناطقة</span>
              <SpeakButton text="مفردات وكلمات مصورة وناطقة" size="xs" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {arabicVocabularyCards.map((card) => (
              <div
                key={card.word}
                onClick={() => {
                  playSoundEffect.click();
                  speakText(`${card.word}... ${card.sentence}`, 'ar');
                }}
                className="bg-white rounded-2xl p-3 border border-emerald-200 shadow-sm flex flex-col items-center text-center hover:bg-emerald-50/50 active:scale-95 transition cursor-pointer relative"
              >
                <div className="absolute top-2 left-2">
                  <SpeakButton text={`${card.word}. ${card.sentence}`} size="xs" />
                </div>
                <div className="text-4xl mb-1">{card.emoji}</div>
                <h4 className="text-base font-black text-emerald-950">{card.word}</h4>
                <p className="text-[11px] text-purple-700 mt-0.5">{card.sentence}</p>
                <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full mt-2">
                  {card.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. تدريبات وتقويم */}
      {activeTab === 'exercises' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTab('menu')}
              className="text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1.5 rounded-xl hover:bg-purple-200 transition cursor-pointer"
            >
              ← العودة للأقسام
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-purple-900">تدريبات وتقويم اللغة العربية</span>
              <SpeakButton text="تدريبات وتقويم مهارات اللغة العربية" size="xs" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border-2 border-purple-200 shadow-md text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-3xl mb-2">
              ⭐
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <h3 className="text-base font-black text-purple-900">
                تقويم مهارات القراءة والكتابة
              </h3>
              <SpeakButton text="تقويم مهارات القراءة والكتابة لطالبة الصف الأول جنى" size="xs" />
            </div>
            <p className="text-xs text-purple-600 mt-1 max-w-xs mx-auto">
              أكملتِ تدريبات الحروف ونطق الكلمات بنجاح، استمري في التميز يا نجمة خديجة!
            </p>

            <button
              onClick={() => {
                playSoundEffect.fanfare();
                onAddStars(10);
                onCompleteLesson('ar_letters_basics');
                speakText('مبروك يا جنى! حصلتِ على عشر نجوم تفوق في اللغة العربية!', 'ar');
              }}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-xs rounded-2xl shadow-lg active:scale-95 transition cursor-pointer"
            >
              الحصول على وسام التميز ⭐ +10
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
