import React from 'react';
import { SouthYemenFlag } from '../SouthYemenFlag';
import { JanaAvatar } from '../JanaAvatar';
import { AppIcon } from '../AppIcon';
import { InstallAppBanner } from '../InstallAppBanner';
import { SpeakButton } from '../SpeakButton';
import { ScreenType } from '../../types';
import { playSoundEffect, speakText } from '../../utils/audio';
import { Sparkles, BookOpen } from 'lucide-react';

interface HomeScreenProps {
  onNavigate: (screen: ScreenType) => void;
  stars: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, stars }) => {
  const handleCardClick = (screen: ScreenType, speechAnnouncement: string, lang: 'ar' | 'en' = 'ar') => {
    playSoundEffect.click();
    speakText(speechAnnouncement, lang);
    onNavigate(screen);
  };

  return (
    <div className="pb-24 pt-2 px-3 sm:px-4 max-w-lg mx-auto space-y-3 select-none">
      {/* Top School Emblem & Flag matching Mockup Image 2 */}
      <div className="w-full flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 bg-white/95 px-2.5 py-1 rounded-2xl shadow-sm border border-amber-300">
          <SouthYemenFlag className="w-7 h-4.5" waving={true} />
          <span className="text-[11px] font-black text-purple-900">الجنوب العربي</span>
        </div>

        <div className="px-4 py-1.5 bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 rounded-2xl border-2 border-amber-400 shadow-md flex items-center gap-1.5">
          <span className="text-sm">🎓</span>
          <span className="text-xs sm:text-sm font-black text-amber-300 tracking-tight">
            مدرسة خديجة للبنات
          </span>
          <span className="text-sm">🌿</span>
        </div>
      </div>

      {/* Hero: Jana at Study Desk with Speech Bubble matching Mockup 2 */}
      <div className="relative bg-gradient-to-r from-pink-50 via-purple-50 to-amber-50 rounded-3xl p-3.5 border-2 border-pink-200 shadow-md flex items-center justify-between gap-3 overflow-hidden">
        {/* Soft decorative background circles */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-amber-200/30 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-pink-200/30 rounded-full blur-xl pointer-events-none" />

        {/* Right side: Speech Bubble "مرحباً جنى" with golden sunbeams */}
        <div className="flex-1 flex flex-col items-center justify-center text-center z-10">
          <div className="relative bg-white border-2 border-pink-400 rounded-3xl px-5 py-2.5 shadow-md flex flex-col items-center">
            <span className="text-amber-500 text-xs font-bold absolute -top-1.5 right-1">✨</span>
            <div className="flex items-center gap-1">
              <span className="text-sm font-black text-rose-700">مرحباً</span>
              <span className="text-sm">🌸</span>
            </div>
            <span className="text-2xl font-black text-purple-950 -mt-1 drop-shadow-sm">
              جنى
            </span>
            <span className="text-amber-500 text-xs font-bold absolute -bottom-1 left-1">✨</span>
          </div>

          <p className="text-[11px] text-purple-700 font-bold mt-2">
            الصف الأول الابتدائي • المنهج اليمني
          </p>

          <div className="mt-1.5">
            <SpeakButton
              text="مرحباً بكِ يا جنى! نتمنى لكِ يوماً دراسياً ممتعاً في مدرسة خديجة للبنات!"
              size="xs"
              variant="pill"
              label="استمع للترحيب"
            />
          </div>
        </div>

        {/* Left side: Jana Real Photo with Frame */}
        <div className="relative shrink-0 z-10">
          <JanaAvatar
            mode="full"
            size="full"
            className="w-28 h-36 sm:w-32 sm:h-40 ring-4 ring-amber-300 rounded-[2rem] shadow-xl"
          />
          <div className="absolute -bottom-1.5 -left-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow border-2 border-white">
            جنى 🌸
          </div>
        </div>
      </div>

      {/* Android & Mobile App Install Banner with Official App Icon */}
      <InstallAppBanner />

      {/* Row 1: 3 Subject Cards matching Mockup 2 (English, Arabic, Math) */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* 1. اللغة الإنجليزية (Sky blue card, ABC on open book) */}
        <div
          onClick={() =>
            handleCardClick(
              'english',
              'English lesson: Alphabet, Words, Listening, and Speaking',
              'en'
            )
          }
          className="relative bg-gradient-to-b from-sky-50 via-blue-50 to-sky-100 rounded-2xl p-2.5 border-2 border-sky-300 shadow-sm flex flex-col items-center text-center hover:bg-sky-100 transition active:scale-95 group cursor-pointer"
        >
          <div className="absolute top-1.5 left-1.5">
            <SpeakButton
              text="English lesson: Alphabet, Words, Listening, and Speaking"
              lang="en"
              size="xs"
              variant="ghost"
            />
          </div>
          <div className="text-3xl my-1 group-hover:scale-110 transition filter drop-shadow">
            🇬🇧
          </div>
          <div className="text-xs font-black text-blue-900 mt-1 leading-tight">
            اللغة الإنجليزية
          </div>
          <span className="text-[10px] font-bold text-sky-700 mt-0.5">ABC Book</span>
        </div>

        {/* 2. اللغة العربية (Pink card, أ ب ت blocks) */}
        <div
          onClick={() =>
            handleCardClick(
              'arabic',
              'مادة اللغة العربية: الحروف والقراءة والكتابة والإملاء والكلمات',
              'ar'
            )
          }
          className="relative bg-gradient-to-b from-pink-50 via-rose-50 to-pink-100 rounded-2xl p-2.5 border-2 border-pink-300 shadow-sm flex flex-col items-center text-center hover:bg-pink-100 transition active:scale-95 group cursor-pointer"
        >
          <div className="absolute top-1.5 left-1.5">
            <SpeakButton
              text="مادة اللغة العربية: الحروف والقراءة والكتابة والإملاء"
              size="xs"
              variant="ghost"
            />
          </div>
          <div className="text-3xl my-1 group-hover:scale-110 transition filter drop-shadow">
            📚
          </div>
          <div className="text-xs font-black text-rose-900 mt-1 leading-tight">
            اللغة العربية
          </div>
          <span className="text-[10px] font-bold text-pink-700 mt-0.5">أ ب ت</span>
        </div>

        {/* 3. الرياضيات (Golden/green card, 123 numbers) */}
        <div
          onClick={() =>
            handleCardClick(
              'math',
              'مادة الرياضيات: الأرقام والعد والجمع والطرح والمقارنة والترتيب',
              'ar'
            )
          }
          className="relative bg-gradient-to-b from-amber-50 via-yellow-50 to-lime-50 rounded-2xl p-2.5 border-2 border-lime-300 shadow-sm flex flex-col items-center text-center hover:bg-lime-100 transition active:scale-95 group cursor-pointer"
        >
          <div className="absolute top-1.5 left-1.5">
            <SpeakButton
              text="مادة الرياضيات: الأرقام والعد والجمع والطرح والمقارنة"
              size="xs"
              variant="ghost"
            />
          </div>
          <div className="text-3xl my-1 group-hover:scale-110 transition filter drop-shadow">
            🔢
          </div>
          <div className="text-xs font-black text-amber-950 mt-1 leading-tight">
            الرياضيات
          </div>
          <span className="text-[10px] font-bold text-lime-700 mt-0.5">١ ٢ ٣</span>
        </div>
      </div>

      {/* Row 2: 2 Subject Cards matching Mockup: Quran (Left/First) and Science (Right/Second, Green card with microscope & new badge) */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* 4. القرآن الكريم (Cream/golden card, Quran stand) */}
        <div
          onClick={() =>
            handleCardClick(
              'quran',
              'القرآن الكريم: تلاوة عطرة وحفظ السور المقررة للصف الأول الابتدائي',
              'ar'
            )
          }
          className="relative bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 rounded-2xl p-3 border-2 border-amber-300 shadow-sm flex flex-col items-center text-center hover:bg-amber-100 transition active:scale-95 group cursor-pointer"
        >
          <div className="absolute top-1.5 left-1.5">
            <SpeakButton
              text="القرآن الكريم: السور المقررة والتلاوة العذبة والحفظ بصوت الشيخ مشاري العفاسي"
              size="xs"
              variant="ghost"
            />
          </div>
          <div className="text-4xl my-1 group-hover:scale-110 transition filter drop-shadow">
            🕌
          </div>
          <div className="text-sm font-black text-amber-950 mt-1">القرآن الكريم</div>
          <span className="text-[10px] font-bold text-amber-700 mt-0.5">
            تلاوة وحفظ السور
          </span>
        </div>

        {/* 5. العلوم (Green card with microscope matching mockup) */}
        <div
          onClick={() =>
            handleCardClick(
              'science',
              'مادة العلوم والبيئة: الحواس الخمس، النباتات، الحيوانات، والماء والبيئة',
              'ar'
            )
          }
          className="relative bg-gradient-to-b from-emerald-50 via-teal-50 to-emerald-100 rounded-2xl p-3 border-2 border-emerald-400 shadow-sm flex flex-col items-center text-center hover:bg-emerald-100 transition active:scale-95 group cursor-pointer"
        >
          {/* New badge matching mockup */}
          <div className="absolute -top-2 right-2 bg-rose-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow border border-white animate-pulse">
            جديد
          </div>

          <div className="absolute top-1.5 left-1.5">
            <SpeakButton
              text="مادة العلوم والبيئة: الحواس الخمس، النباتات والحيوانات"
              size="xs"
              variant="ghost"
            />
          </div>
          <div className="text-4xl my-1 group-hover:scale-110 transition filter drop-shadow">
            🔬
          </div>
          <div className="text-sm font-black text-emerald-950 mt-1">العلوم</div>
          <span className="text-[10px] font-bold text-emerald-700 mt-0.5">
            استكشاف الطبيعة
          </span>
        </div>
      </div>

      {/* Row 3: Islamic & Games Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* التربية الإسلامية */}
        <div
          onClick={() =>
            handleCardClick(
              'islamic',
              'التربية الإسلامية: العقيدة، صفة الوضوء، والصلوات الخمس، والآداب والأخلاق',
              'ar'
            )
          }
          className="relative bg-gradient-to-b from-teal-50 via-emerald-50 to-teal-100 rounded-2xl p-3 border-2 border-teal-300 shadow-sm flex flex-col items-center text-center hover:bg-teal-100 transition active:scale-95 group cursor-pointer"
        >
          <div className="absolute top-1.5 left-1.5">
            <SpeakButton
              text="التربية الإسلامية: العقيدة والعبادات والآداب والقصص"
              size="xs"
              variant="ghost"
            />
          </div>
          <div className="text-4xl my-1 group-hover:scale-110 transition filter drop-shadow">
            🌱
          </div>
          <div className="text-sm font-black text-teal-950 mt-1">التربية الإسلامية</div>
          <span className="text-[10px] font-bold text-teal-700 mt-0.5">
            القيم والعبادات
          </span>
        </div>

        {/* الألعاب التعليمية */}
        <div
          onClick={() =>
            handleCardClick(
              'games',
              'الألعاب التعليمية: ست ألعاب ذكاء ومرح ومطابقة الحروف والأرقام',
              'ar'
            )
          }
          className="relative bg-gradient-to-b from-purple-50 via-fuchsia-50 to-purple-100 rounded-2xl p-3 border-2 border-purple-300 shadow-sm flex flex-col items-center text-center hover:bg-purple-100 transition active:scale-95 group cursor-pointer"
        >
          <div className="absolute top-1.5 left-1.5">
            <SpeakButton
              text="الألعاب التعليمية: ست ألعاب ذكاء ومرح وتحديات مسلية"
              size="xs"
              variant="ghost"
            />
          </div>
          <div className="text-4xl my-1 group-hover:scale-110 transition filter drop-shadow">
            🎮
          </div>
          <div className="text-sm font-black text-purple-950 mt-1">الألعاب التعليمية</div>
          <span className="text-[10px] font-bold text-purple-700 mt-0.5">
            ذكاء ومرح وتركيز
          </span>
        </div>
      </div>

      {/* Row 3: 2 Subject Cards matching Mockup 2 (Games, Quizzes) */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* 6. الألعاب التعليمية (Lilac card, Gamepad controller) */}
        <div
          onClick={() =>
            handleCardClick(
              'games',
              'الألعاب التعليمية: ست ألعاب ذكاء ومرح ومطابقة الحروف والأرقام',
              'ar'
            )
          }
          className="relative bg-gradient-to-b from-purple-50 via-fuchsia-50 to-purple-100 rounded-2xl p-3 border-2 border-purple-300 shadow-sm flex flex-col items-center text-center hover:bg-purple-100 transition active:scale-95 group cursor-pointer"
        >
          <div className="absolute top-1.5 left-1.5">
            <SpeakButton
              text="الألعاب التعليمية: ست ألعاب ذكاء ومرح وتحديات مسلية"
              size="xs"
              variant="ghost"
            />
          </div>
          <div className="text-4xl my-1 group-hover:scale-110 transition filter drop-shadow">
            🎮
          </div>
          <div className="text-sm font-black text-purple-950 mt-1">الألعاب التعليمية</div>
          <span className="text-[10px] font-bold text-purple-700 mt-0.5">
            ذكاء ومرح وتركيز
          </span>
        </div>

        {/* 7. الاختبارات (Coral card, Clipboard with checklist and pencil) */}
        <div
          onClick={() =>
            handleCardClick(
              'quizzes',
              'قسم الاختبارات والتقييم الذكي مع التصحيح الفوري والشهادات',
              'ar'
            )
          }
          className="relative bg-gradient-to-b from-rose-50 via-pink-50 to-rose-100 rounded-2xl p-3 border-2 border-rose-300 shadow-sm flex flex-col items-center text-center hover:bg-rose-100 transition active:scale-95 group cursor-pointer"
        >
          <div className="absolute top-1.5 left-1.5">
            <SpeakButton
              text="قسم الاختبارات: حل الأسئلة مع التصحيح الفوري ونجوم التميز"
              size="xs"
              variant="ghost"
            />
          </div>
          <div className="text-4xl my-1 group-hover:scale-110 transition filter drop-shadow">
            📋
          </div>
          <div className="text-sm font-black text-rose-950 mt-1">الاختبارات</div>
          <span className="text-[10px] font-bold text-rose-700 mt-0.5">
            تصحيح فوري وشهادات
          </span>
        </div>
      </div>

      {/* Row 4: Yemeni Curriculum Books Banner */}
      <div
        onClick={() =>
          handleCardClick(
            'yemeni_curriculum',
            'دروس وكتب المنهج اليمني للصف الأول الابتدائي لمدرسة خديجة للبنات',
            'ar'
          )
        }
        className="bg-gradient-to-r from-purple-800 via-indigo-900 to-purple-800 text-white rounded-2xl p-3 border-2 border-amber-300 shadow-md flex items-center justify-between gap-2 hover:brightness-105 active:scale-98 transition cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-2xl shrink-0">
            📖
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-amber-300">
              دروس المنهج اليمني (الصف الأول)
            </h4>
            <p className="text-[11px] text-purple-200">
              الكتب الدراسية والوحدات المقررة فصلاً بفصل
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <SpeakButton
            text="دروس وكتب المنهج اليمني للصف الأول الأساسي"
            size="xs"
            className="bg-white/20 text-white"
          />
          <span className="text-xs text-amber-300 font-black">فتح ❯</span>
        </div>
      </div>

      {/* Developer Signature Banner matching Mockup */}
      <div 
        onClick={() => {
          playSoundEffect.click();
          speakText('تصميم وتطوير المبرمج ماجد التركي، تطبيق جنى التعليمي لمدرسة خديجة للبنات', 'ar');
        }}
        className="relative bg-gradient-to-r from-purple-900 via-indigo-950 to-purple-900 rounded-3xl p-3 border-2 border-amber-400 shadow-md flex items-center justify-center gap-2 cursor-pointer group hover:brightness-110 transition"
      >
        <span className="text-amber-300 text-sm">🌿</span>
        <span className="text-amber-300 text-sm">⚙️</span>
        <div className="text-center">
          <p className="text-[10px] text-amber-200 font-bold tracking-wider">تصميم وتطوير</p>
          <h4 className="text-sm sm:text-base font-black text-amber-300 tracking-wide drop-shadow">
            ماجد التركي
          </h4>
        </div>
        <span className="text-amber-300 text-sm">⚙️</span>
        <span className="text-amber-300 text-sm">🌿</span>
        <div className="absolute left-2.5 top-1/2 -translate-y-1/2">
          <SpeakButton text="تصميم وتطوير المبرمج ماجد التركي" size="xs" className="bg-white/20 text-white" />
        </div>
      </div>

      {/* Encouragement Star Counter footer */}
      <div className="bg-white rounded-2xl p-3 border border-purple-200 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xl">⭐</span>
          <span className="text-xs font-bold text-purple-900">
            أحسنتِ يا جنى! جمعتِ {stars} نجمة تفوق حتى الآن!
          </span>
          <SpeakButton
            text={`أحسنتِ يا جنى! لقد جمعتِ ${stars} نجمة تفوق حتى الآن! بارك الله فيكِ!`}
            size="xs"
            variant="ghost"
          />
        </div>
        <button
          type="button"
          onClick={() => onNavigate('quizzes')}
          className="text-[11px] font-bold text-purple-700 bg-purple-100 hover:bg-purple-200 px-2.5 py-1 rounded-xl transition cursor-pointer"
        >
          اختبر نفسكِ ❯
        </button>
      </div>
    </div>
  );
};
