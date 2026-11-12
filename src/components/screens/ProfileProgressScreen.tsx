import React, { useState } from 'react';
import { JanaAvatar } from '../JanaAvatar';
import { AppIcon } from '../AppIcon';
import { SpeakButton } from '../SpeakButton';
import { StudentProfile } from '../../types';
import { playSoundEffect } from '../../utils/audio';
import { SouthYemenFlag } from '../SouthYemenFlag';
import {
  ChevronLeft,
  ChevronDown,
  Trophy,
  Award,
  Star,
  CheckCircle,
  FileText,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface ProfileProgressScreenProps {
  profile: StudentProfile;
  onUpdateAvatar?: (url: string) => void;
}

export const ProfileProgressScreen: React.FC<ProfileProgressScreenProps> = ({ profile }) => {
  const [openSection, setOpenSection] = useState<'scores' | 'badges' | 'parent_report' | null>(
    'scores'
  );

  const toggleSection = (sec: 'scores' | 'badges' | 'parent_report') => {
    playSoundEffect.click();
    setOpenSection((prev) => (prev === sec ? null : sec));
  };

  const totalPossibleLessons = 25;
  const progressPercent = Math.min(
    100,
    Math.max(40, Math.round((profile.completedLessons.length / totalPossibleLessons) * 100) + 20)
  );

  return (
    <div className="pb-24 pt-2 px-3 sm:px-4 max-w-lg mx-auto space-y-3 select-none">
      {/* Top School Emblem matching Reference Mockup Image 1 */}
      <div className="w-full flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 bg-white/95 px-2.5 py-1 rounded-2xl shadow-sm border border-amber-300">
          <SouthYemenFlag className="w-7 h-4.5" waving={true} />
          <span className="text-[11px] font-black text-purple-900">الجنوب العربي</span>
        </div>

        <div className="px-3 py-1 bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 rounded-2xl border-2 border-amber-400 shadow-md flex items-center gap-2">
          <AppIcon size="xs" className="w-6 h-6 rounded-lg ring-1 ring-amber-300 shadow-sm" />
          <span className="text-xs sm:text-sm font-black text-amber-300 tracking-tight">
            مدرسة خديجة للبنات
          </span>
          <span className="text-sm">🌿</span>
        </div>
      </div>

      {/* Hero Card: Jana's Real Photo on left + Profile Badge on right (Matching Mockup 1) */}
      <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-amber-50 rounded-3xl p-4 border-2 border-pink-200/90 shadow-md flex items-center justify-between gap-3">
        {/* Right side: Crown Badge, Calligraphy Name, Grade Ribbon */}
        <div className="flex flex-col items-center justify-center flex-1 text-center space-y-2">
          {/* "ملف جنى" Purple Pill with Crown */}
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-purple-800 to-indigo-900 text-white px-4 py-1 rounded-full border border-amber-300 shadow-sm">
            <span className="text-amber-300 text-sm">👑</span>
            <span className="text-xs font-black tracking-wide">ملف جنى</span>
          </div>

          {/* Large Calligraphy Name with golden sunbeams */}
          <div className="relative flex items-center justify-center">
            <span className="text-amber-500 text-sm font-bold absolute -top-2 right-0">✨</span>
            <h2 className="text-4xl font-black text-rose-700 font-sans tracking-tight drop-shadow-sm px-2">
              جنى
            </h2>
            <span className="text-amber-500 text-sm font-bold absolute -bottom-1 left-0">✨</span>
          </div>

          {/* Yellow Golden Ribbon: "الصف الأول الابتدائي" */}
          <div className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-purple-950 px-4 py-1 rounded-full border-2 border-amber-500 font-black text-xs shadow-sm flex items-center gap-1">
            <span>🎓</span>
            <span>الصف الأول الابتدائي</span>
          </div>

          <div className="pt-1">
            <SpeakButton
              text={`ملف الطالبة جنى، الصف الأول الابتدائي، مدرسة خديجة للبنات، نسبة التقدم ${progressPercent} بالمئة`}
              size="xs"
              variant="pill"
              label="استمع لبيانات جنى"
            />
          </div>
        </div>

        {/* Left side: Jana Real Photo with Frame */}
        <div className="relative shrink-0">
          <JanaAvatar
            mode="full"
            size="full"
            className="w-32 h-44 sm:w-36 sm:h-48 ring-4 ring-amber-300 rounded-[2rem] shadow-xl"
          />
          <div className="absolute -bottom-2 -left-1 bg-gradient-to-r from-amber-400 to-yellow-400 text-purple-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow border-2 border-white">
            ⭐ متفوقة
          </div>
        </div>
      </div>

      {/* Progress Bar Card matching Image 1 */}
      <div className="bg-white rounded-3xl p-4 border-2 border-pink-200 shadow-md space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-purple-800 to-indigo-900 text-white px-3 py-1 rounded-xl text-xs font-black shadow-sm">
              <span>📊</span>
              <span>مستوى التقدم</span>
            </div>
            <SpeakButton text={`مستوى التقدم ${progressPercent} بالمئة، أحسنتِ يا جنى واصلي التعلم`} size="xs" />
          </div>

          <div className="flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <span>🍎 كتب التفوق</span>
          </div>
        </div>

        {/* Horizontal Progress Bar */}
        <div className="relative w-full h-7 bg-purple-100 rounded-full overflow-hidden p-0.5 shadow-inner border border-purple-200">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-500 rounded-full flex items-center justify-center transition-all duration-1000 ease-out shadow"
            style={{ width: `${progressPercent}%` }}
          >
            <span className="text-white text-xs font-black drop-shadow-sm tabular-nums">
              {progressPercent}%
            </span>
          </div>
        </div>

        <p className="text-center text-xs font-black text-purple-900 pt-1 flex items-center justify-center gap-1.5">
          <span className="text-amber-500">⭐</span>
          <span>أحسنتِ يا جنى .. واصلي التعلّم!</span>
          <span className="text-amber-500">⭐</span>
        </p>
      </div>

      {/* 3 Stat Badges matching Mockup 1 (Blue, Pink, Green) */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* 1. الأوسمة المكتسبة (Blue) */}
        <div className="bg-gradient-to-b from-sky-50 to-blue-100 rounded-2xl p-3 border-2 border-sky-300 shadow-sm flex flex-col items-center text-center">
          <div className="text-2xl mb-1 filter drop-shadow">🎖️</div>
          <span className="text-xl font-black text-blue-950 tabular-nums">
            {profile.badges.length || 5}
          </span>
          <span className="text-[11px] font-black text-blue-900 leading-tight mt-0.5">
            الأوسمة المكتسبة
          </span>
          <div className="mt-1">
            <SpeakButton text={`${profile.badges.length || 5} أوسمة مكتسبة`} size="xs" variant="ghost" />
          </div>
        </div>

        {/* 2. النجوم المجمعة (Pink) */}
        <div className="bg-gradient-to-b from-pink-50 to-rose-100 rounded-2xl p-3 border-2 border-pink-300 shadow-sm flex flex-col items-center text-center">
          <div className="text-2xl mb-1 filter drop-shadow">⭐</div>
          <span className="text-xl font-black text-rose-950 tabular-nums">
            {profile.stars}
          </span>
          <span className="text-[11px] font-black text-rose-900 leading-tight mt-0.5">
            النجوم المجمعة
          </span>
          <div className="mt-1">
            <SpeakButton text={`${profile.stars} نجمة مجمعة حتى الآن`} size="xs" variant="ghost" />
          </div>
        </div>

        {/* 3. الدروس المكتملة (Green) */}
        <div className="bg-gradient-to-b from-emerald-50 to-teal-100 rounded-2xl p-3 border-2 border-emerald-300 shadow-sm flex flex-col items-center text-center">
          <div className="text-2xl mb-1 filter drop-shadow">📖</div>
          <span className="text-xl font-black text-emerald-950 tabular-nums">
            {profile.completedLessons.length || 24}
          </span>
          <span className="text-[11px] font-black text-emerald-900 leading-tight mt-0.5">
            الدروس المكتملة
          </span>
          <div className="mt-1">
            <SpeakButton text={`${profile.completedLessons.length || 24} درساً مكتملاً`} size="xs" variant="ghost" />
          </div>
        </div>
      </div>

      {/* Latest Achievement Card matching Mockup 1 */}
      <div className="bg-white rounded-3xl p-3.5 border-2 border-amber-300 shadow-md flex items-center justify-between gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-purple-950 flex items-center justify-center text-2xl shadow shrink-0">
          🏆
        </div>

        <div className="flex-1 text-right">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-black bg-purple-900 text-amber-300 px-2 py-0.5 rounded-full">
              أحدث إنجاز
            </span>
            <SpeakButton text="أحدث إنجاز: أكملت جنى عشرين درساً بنجاح باهر" size="xs" variant="ghost" />
          </div>
          <p className="text-sm font-black text-purple-950 mt-1">
            أكملتِ {profile.completedLessons.length || 20} درساً بنجاح
          </p>
        </div>

        <span className="text-amber-500 text-lg">✨</span>
      </div>

      {/* Accordion Sections: Test Results, Badges, Parent Reports */}
      <div className="space-y-2.5 pt-1">
        {/* 1. نتائجي في الاختبارات */}
        <div className="bg-white rounded-2xl border-2 border-purple-200 overflow-hidden shadow-sm">
          <div
            role="button"
            tabIndex={0}
            onClick={() => toggleSection('scores')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleSection('scores');
              }
            }}
            className="w-full p-3.5 flex items-center justify-between text-right hover:bg-purple-50/50 transition cursor-pointer select-none"
          >
            <div className="flex items-center gap-2 text-purple-950 font-black text-sm">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>نتائجي في الاختبارات</span>
            </div>
            <div className="flex items-center gap-2">
              <SpeakButton text="نتائج جنى في اختبارات المواد الدراسية" size="xs" />
              {openSection === 'scores' ? (
                <ChevronDown className="w-5 h-5 text-purple-600" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-purple-400" />
              )}
            </div>
          </div>

          {openSection === 'scores' && (
            <div className="p-3 border-t border-purple-100 bg-purple-50/30 space-y-2">
              {[
                { subj: 'اختبار اللغة العربية', score: profile.quizScores.ar_quiz_1 || 100, color: 'text-pink-600' },
                { subj: 'اختبار اللغة الإنجليزية', score: profile.quizScores.en_quiz_1 || 95, color: 'text-blue-600' },
                { subj: 'اختبار الرياضيات', score: profile.quizScores.math_quiz_1 || 100, color: 'text-amber-600' },
                { subj: 'اختبار التربية الإسلامية', score: profile.quizScores.islamic_quiz_1 || 90, color: 'text-emerald-600' },
              ].map((res) => (
                <div
                  key={res.subj}
                  className="bg-white p-2.5 rounded-xl border border-purple-100 flex items-center justify-between text-xs font-bold"
                >
                  <span className="text-purple-900">{res.subj}</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-sm font-black ${res.color} tabular-nums`}>
                      {res.score}%
                    </span>
                    <span className="text-xs text-amber-500">⭐ ممتاز</span>
                    <SpeakButton text={`${res.subj}: الدرجة ${res.score} في المئة، ممتاز جداً`} size="xs" variant="ghost" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. إنجازاتي والجوائز */}
        <div className="bg-white rounded-2xl border-2 border-purple-200 overflow-hidden shadow-sm">
          <div
            role="button"
            tabIndex={0}
            onClick={() => toggleSection('badges')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleSection('badges');
              }
            }}
            className="w-full p-3.5 flex items-center justify-between text-right hover:bg-purple-50/50 transition cursor-pointer select-none"
          >
            <div className="flex items-center gap-2 text-purple-950 font-black text-sm">
              <Award className="w-5 h-5 text-pink-500" />
              <span>إنجازاتي والجوائز ({profile.badges.length})</span>
            </div>
            <div className="flex items-center gap-2">
              <SpeakButton text="إنجازات وجوائز وأوسمة الطالبة جنى" size="xs" />
              {openSection === 'badges' ? (
                <ChevronDown className="w-5 h-5 text-purple-600" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-purple-400" />
              )}
            </div>
          </div>

          {openSection === 'badges' && (
            <div className="p-3 border-t border-purple-100 bg-purple-50/30 grid grid-cols-2 gap-2">
              {profile.badges.map((b) => (
                <div
                  key={b}
                  className="bg-white p-2.5 rounded-xl border border-pink-200 flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl">🎖️</span>
                    <span className="text-xs font-bold text-purple-950 leading-tight">{b}</span>
                  </div>
                  <SpeakButton text={`وسام: ${b}`} size="xs" variant="ghost" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. تقارير ولي الأمر */}
        <div className="bg-white rounded-2xl border-2 border-purple-200 overflow-hidden shadow-sm">
          <div
            role="button"
            tabIndex={0}
            onClick={() => toggleSection('parent_report')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleSection('parent_report');
              }
            }}
            className="w-full p-3.5 flex items-center justify-between text-right hover:bg-purple-50/50 transition cursor-pointer select-none"
          >
            <div className="flex items-center gap-2 text-purple-950 font-black text-sm">
              <FileText className="w-5 h-5 text-indigo-500" />
              <span>تقارير ولي الأمر (المتابعة الأسرية)</span>
            </div>
            <div className="flex items-center gap-2">
              <SpeakButton text="تقارير ولي الأمر والمتابعة الأسرية الدورية للطالبة جنى" size="xs" />
              {openSection === 'parent_report' ? (
                <ChevronDown className="w-5 h-5 text-purple-600" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-purple-400" />
              )}
            </div>
          </div>

          {openSection === 'parent_report' && (
            <div className="p-4 border-t border-purple-100 bg-purple-50/40 space-y-3">
              <div className="bg-white p-3.5 rounded-2xl border border-indigo-100 space-y-2">
                <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                  <span className="text-xs font-black text-purple-950">
                    تقرير المتابعة الدورية للطالبة جنى
                  </span>
                  <span className="text-[10px] text-purple-500 font-bold">
                    الفصل الدراسي الأول
                  </span>
                </div>

                <div className="text-xs text-purple-900 leading-relaxed font-medium space-y-1">
                  <p>• <strong>المواظبة والتفاعل:</strong> ممتازة وتشارك يومياً في حل الأنشطة.</p>
                  <p>• <strong>حفظ القرآن الكريم:</strong> إتقان كامل للسور المقررة وتلاوة خاشعة.</p>
                  <p>• <strong>اللغة العربية والإنجليزية:</strong> مهارة عالية في القراءة والتهجئة.</p>
                  <p>• <strong>الرياضيات:</strong> عبقرية في عمليات الجمع والطرح ومقارنة الأعداد.</p>
                </div>

                <div className="mt-3 p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>ملاحظة المعلمة: جنى طالبة نموذجية ومتفوقة، نتمنى لها دوام التميز!</span>
                  </div>
                  <SpeakButton text="ملاحظة المعلمة: جنى طالبة نموذجية وذكية جداً ومتفوقة، بارك الله فيها ورعاها!" size="xs" variant="ghost" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
