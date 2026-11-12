import React, { useState } from 'react';
import { VirtualTeacher } from '../VirtualTeacher';
import { SpeakButton } from '../SpeakButton';
import {
  islamicCreedData,
  islamicWorshipData,
  islamicManners,
} from '../../utils/curriculumData';
import { playSoundEffect, speakText } from '../../utils/audio';
import { Volume2, Award, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';

interface IslamicScreenProps {
  onAddStars: (amount: number) => void;
  onCompleteLesson: (lessonId: string) => void;
}

type TabType = 'menu' | 'creed' | 'worship' | 'manners' | 'stories' | 'seerah' | 'exercises';

export const IslamicScreen: React.FC<IslamicScreenProps> = ({ onAddStars, onCompleteLesson }) => {
  const [activeTab, setActiveTab] = useState<TabType>('menu');
  const [wuduStepIndex, setWuduStepIndex] = useState(0);

  const islamicCards = [
    {
      id: 'creed' as TabType,
      title: 'العقيدة الإسلامية',
      subtitle: 'أركان الإسلام والإيمان',
      spoken: 'العقيدة الإسلامية: أركان الإسلام وأركان الإيمان ومعرفة الله ورسوله',
      iconEmoji: '🌱',
      gradient: 'from-emerald-500 to-teal-700',
    },
    {
      id: 'worship' as TabType,
      title: 'العبادات',
      subtitle: 'الوضوء والصلوات الخمس',
      spoken: 'العبادات: خطوات الوضوء الصحيحة بالترتيب والصلوات الخمس المفروضة',
      iconEmoji: '🕌',
      gradient: 'from-amber-500 to-orange-600',
    },
    {
      id: 'manners' as TabType,
      title: 'الآداب والأخلاق',
      subtitle: 'بر الوالدين وآداب المسلم',
      spoken: 'الآداب والأخلاق: بر الوالدين، آداب الطعام، وإفشاء السلام، والنظافة',
      iconEmoji: '💖',
      gradient: 'from-pink-500 to-rose-600',
    },
    {
      id: 'stories' as TabType,
      title: 'قصص إسلامية',
      subtitle: 'قصص وعبر هادفة',
      spoken: 'قصص إسلامية هادفة: قصة أصحاب الفيل وحماية الكعبة المشرفة',
      iconEmoji: '🌴',
      gradient: 'from-purple-500 to-indigo-700',
    },
    {
      id: 'seerah' as TabType,
      title: 'السيرة النبوية',
      subtitle: 'حياة نبينا محمد ﷺ',
      spoken: 'السيرة النبوية العطرة: حياة وأخلاق نبينا محمد صلى الله عليه وسلم',
      iconEmoji: '✨',
      gradient: 'from-teal-500 to-cyan-700',
    },
    {
      id: 'exercises' as TabType,
      title: 'تدريبات وتقويم',
      subtitle: 'اختبارات ونجوم تفوق',
      spoken: 'تدريبات وتقويم مهارات التربية الإسلامية ونيل الأوسمة والنجوم',
      iconEmoji: '📋',
      gradient: 'from-indigo-500 to-purple-800',
    },
  ];

  return (
    <div className="pb-24 pt-2 px-3 sm:px-4 max-w-lg mx-auto">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-teal-700 via-emerald-700 to-green-800 rounded-3xl p-3 text-white shadow-lg mb-3 flex items-center justify-between border-2 border-amber-300">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shadow">
            🌱
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg font-black tracking-wide text-amber-200 drop-shadow">
                التربية الإسلامية
              </h2>
              <SpeakButton
                text="مادة التربية الإسلامية: العقيدة والعبادات والأخلاق النبيلة والسيرة العطرة"
                size="xs"
                className="bg-white/30 text-white"
              />
            </div>
            <p className="text-xs text-white/90 font-medium">العقيدة والعبادات والأخلاق النبيلة</p>
          </div>
        </div>
        <SpeakButton
          text="أهلاً يا جنى في دروس التربية الإسلامية! نتعلم ديننا السمح وأخلاق نبينا الحبيب!"
          size="sm"
          className="bg-amber-400 text-purple-950 hover:bg-amber-300"
        />
      </div>

      {/* Main 6 Cards View */}
      {activeTab === 'menu' && (
        <>
          <VirtualTeacher
            speechText="ما أجمل أن نتعلم ديننا يا جنى! اختاري من العقيدة، أو صفة الوضوء والصلاة، أو آداب وأخلاق المسلم لتنالي رضا الله وثوابه!"
            lang="ar"
          />

          <div className="grid grid-cols-2 gap-3 mt-2">
            {islamicCards.map((card) => (
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

      {/* 1. العقيدة الإسلامية */}
      {activeTab === 'creed' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTab('menu')}
              className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl hover:bg-emerald-200 transition cursor-pointer"
            >
              ← العودة للأقسام
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-purple-900">العقيدة الإسلامية</span>
              <SpeakButton text="العقيدة الإسلامية: أركان الإسلام، وأركان الإيمان، ومن ربك ونبيك" size="xs" />
            </div>
          </div>

          <div className="space-y-3">
            {islamicCreedData.map((section) => (
              <div
                key={section.title}
                className="bg-white rounded-3xl p-4 border-2 border-emerald-200 shadow-md"
              >
                <div className="flex items-center justify-between border-b border-emerald-100 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{section.emoji}</span>
                    <h3 className="text-base font-black text-emerald-950">{section.title}</h3>
                  </div>
                  <SpeakButton text={`${section.title}. ${section.items.join('. ')}`} size="xs" />
                </div>

                <div className="space-y-2">
                  {section.items.map((item, i) => (
                    <div
                      key={i}
                      className="p-2.5 bg-emerald-50/60 rounded-xl text-xs sm:text-sm font-bold text-emerald-950 flex items-center justify-between"
                    >
                      <span>{item}</span>
                      <SpeakButton text={item} size="xs" variant="ghost" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. العبادات: الوضوء والصلوات */}
      {activeTab === 'worship' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTab('menu')}
              className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1.5 rounded-xl hover:bg-amber-200 transition cursor-pointer"
            >
              ← العودة للأقسام
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-purple-900">صفة الوضوء والصلوات</span>
              <SpeakButton text="صفة الوضوء الصحيحة بالترتيب والصلوات الخمس المفروضة" size="xs" />
            </div>
          </div>

          {/* Interactive Wudu Stepper */}
          <div className="bg-white rounded-3xl p-4 border-2 border-amber-300 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-black text-amber-900 flex items-center gap-1.5">
                <span>💧</span>
                <span>خطوات الوضوء الصحيحة بالترتيب (خطوة {wuduStepIndex + 1} من 7):</span>
              </h3>
              <SpeakButton
                text={`خطوات الوضوء الصحيحة. الخطوة الحالية: ${islamicWorshipData.wuduSteps[wuduStepIndex].text}`}
                size="xs"
              />
            </div>

            {/* Current Step Card */}
            <div className="bg-gradient-to-b from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200 text-center my-3 relative">
              <div className="absolute top-2 left-2">
                <SpeakButton text={islamicWorshipData.wuduSteps[wuduStepIndex].text} size="xs" />
              </div>
              <div className="text-5xl mb-2">
                {islamicWorshipData.wuduSteps[wuduStepIndex].emoji}
              </div>
              <h4 className="text-lg font-black text-amber-950">
                {islamicWorshipData.wuduSteps[wuduStepIndex].text}
              </h4>

              <button
                onClick={() => {
                  playSoundEffect.click();
                  speakText(
                    `الخطوة رقم ${wuduStepIndex + 1}: ${
                      islamicWorshipData.wuduSteps[wuduStepIndex].text
                    }`,
                    'ar'
                  );
                }}
                className="mt-3 px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 active:scale-95 cursor-pointer shadow"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>استمعي للخطوة 🔊</span>
              </button>
            </div>

            {/* Stepper Buttons */}
            <div className="flex items-center justify-between gap-2">
              <button
                disabled={wuduStepIndex === 0}
                onClick={() => setWuduStepIndex((p) => Math.max(0, p - 1))}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-100 text-amber-800 disabled:opacity-40 cursor-pointer"
              >
                السابق
              </button>

              <div className="flex gap-1">
                {islamicWorshipData.wuduSteps.map((_, idx) => (
                  <span
                    key={idx}
                    className={`w-2.5 h-2.5 rounded-full ${
                      wuduStepIndex === idx ? 'bg-amber-500' : 'bg-amber-200'
                    }`}
                  />
                ))}
              </div>

              <button
                disabled={wuduStepIndex === islamicWorshipData.wuduSteps.length - 1}
                onClick={() => setWuduStepIndex((p) => Math.min(islamicWorshipData.wuduSteps.length - 1, p + 1))}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-white disabled:opacity-40 cursor-pointer"
              >
                التالي
              </button>
            </div>
          </div>

          {/* 5 Daily Prayers Table */}
          <div className="bg-white rounded-3xl p-4 border-2 border-emerald-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-black text-emerald-950 flex items-center gap-1.5">
                <span>🕌</span>
                <span>الصلوات الخمس المفروضة:</span>
              </h3>
              <SpeakButton text="الصلوات الخمس المفروضة: الفجر، الظهر، العصر، المغرب، والعشاء" size="xs" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {islamicWorshipData.prayers.map((prayer) => (
                <div
                  key={prayer.name}
                  onClick={() => {
                    playSoundEffect.click();
                    speakText(`${prayer.name}: عدد ركعاتها ${prayer.rakats}، ووقتها ${prayer.time}`, 'ar');
                  }}
                  className="p-2.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between cursor-pointer hover:bg-emerald-100/70 transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{prayer.emoji}</span>
                    <div>
                      <h4 className="text-xs font-black text-emerald-950">{prayer.name}</h4>
                      <p className="text-[10px] text-emerald-700">{prayer.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-black bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                      {prayer.rakats} ركعات
                    </span>
                    <SpeakButton
                      text={`${prayer.name}، ${prayer.rakats} ركعات، وقتها ${prayer.time}`}
                      size="xs"
                      variant="ghost"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. الآداب والأخلاق */}
      {activeTab === 'manners' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTab('menu')}
              className="text-xs font-bold text-pink-800 bg-pink-100 px-3 py-1.5 rounded-xl hover:bg-pink-200 transition cursor-pointer"
            >
              ← العودة للأقسام
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-purple-900">آداب وأخلاق المسلمة الصغيرة</span>
              <SpeakButton text="آداب وأخلاق المسلمة الصغيرة" size="xs" />
            </div>
          </div>

          <div className="space-y-2.5">
            {islamicManners.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-4 border border-pink-200 shadow-sm flex items-start gap-3 relative"
              >
                <span className="text-3xl p-1 bg-pink-50 rounded-xl">{item.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-pink-900">{item.title}</h4>
                    <SpeakButton text={`${item.title}. ${item.text}`} size="xs" />
                  </div>
                  <p className="text-xs text-purple-950 font-medium mt-1 leading-relaxed">
                    {item.text}
                  </p>
                  <button
                    onClick={() => {
                      playSoundEffect.click();
                      speakText(`${item.title}: ${item.text}`, 'ar');
                    }}
                    className="mt-2 text-[11px] font-bold text-pink-700 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>استمعي للنصيحة 🔊</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. قصص إسلامية */}
      {activeTab === 'stories' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTab('menu')}
              className="text-xs font-bold text-purple-800 bg-purple-100 px-3 py-1.5 rounded-xl hover:bg-purple-200 transition cursor-pointer"
            >
              ← العودة للأقسام
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-purple-900">قصص إسلامية ممتعة</span>
              <SpeakButton text="قصص إسلامية ممتعة وهادفة" size="xs" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border-2 border-purple-200 shadow-md">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-3xl">🐘</span>
                <h3 className="text-base font-black text-purple-950">قصة أصحاب الفيل</h3>
              </div>
              <SpeakButton
                text="قصة أصحاب الفيل: حاول أبرهة وجيشه ومعه الفيل العظيم هدم الكعبة المشرفة بيت الله الحرام. فحمى الله بيته وأرسل طيراً أبابيل رمتهم بحجارة من سجيل، وحفظ بيته الحرام!"
                size="xs"
              />
            </div>
            <p className="text-xs sm:text-sm font-bold text-purple-900 leading-relaxed bg-purple-50/70 p-4 rounded-2xl border border-purple-100">
              حاول أبرهة وجيشه ومعه الفيل العظيم هدم الكعبة المشرفة بيت الله الحرام. فرفض الفيل التقدم نحو الكعبة بأمر الله، وأرسل الله طيراً أبابيل رمتهم بحجارة من سجيل، وحمى الله بيته الحرام من كل سوء!
            </p>

            <button
              onClick={() => {
                playSoundEffect.star();
                speakText(
                  'قصة أصحاب الفيل: حاول أبرهة وجيشه هدم الكعبة المشرفة، فحمى الله بيته وأرسل طيراً أبابيل لتهزم المعتدين!',
                  'ar'
                );
                onAddStars(5);
              }}
              className="mt-4 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl text-xs font-bold shadow flex items-center gap-2 mx-auto active:scale-95 transition cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>استمعي لقصة أصحاب الفيل 🔊</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. السيرة النبوية */}
      {activeTab === 'seerah' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTab('menu')}
              className="text-xs font-bold text-teal-800 bg-teal-100 px-3 py-1.5 rounded-xl hover:bg-teal-200 transition cursor-pointer"
            >
              ← العودة للأقسام
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-purple-900">سيرة النبي محمد ﷺ</span>
              <SpeakButton text="سيرة النبي محمد صلى الله عليه وسلم" size="xs" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border-2 border-teal-200 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-black text-teal-900">
                سيدنا ونبينا محمد ﷺ
              </h3>
              <SpeakButton
                text="سيدنا ونبينا محمد صلى الله عليه وسلم: ولد في مكة المكرمة في عام الفيل، وكان يعرف بالصادق الأمين، وهو خاتم الأنبياء والمرسلين"
                size="xs"
              />
            </div>
            <div className="space-y-2 text-xs sm:text-sm font-bold text-purple-950 bg-teal-50/60 p-4 rounded-2xl leading-relaxed">
              <p>• وُلِدَ نبينا محمد ﷺ في مكة المكرمة في عام الفيل.</p>
              <p>• كان معروفاً بين قومه بـ «الصادق الأمين» لحسن خلقه وصدقه.</p>
              <p>• نزل عليه الوحي والقرآن الكريم في غار حراء وهو في الأربعين من عمره.</p>
              <p>• نحن نحب نبينا ونتبع سنته الشريفة لنكون معه في الجنة!</p>
            </div>

            <button
              onClick={() => {
                playSoundEffect.fanfare();
                onAddStars(5);
                onCompleteLesson('islamic_pillars');
                speakText(
                  'صلّى الله على نبينا محمد وعلى آله وصحبه وسلم تسليماً كثيراً!',
                  'ar'
                );
              }}
              className="mt-4 px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-700 text-white rounded-2xl text-xs font-bold shadow flex items-center gap-2 mx-auto active:scale-95 transition cursor-pointer"
            >
              <span>صلّى الله عليه وسلم 💖 +5 نجوم</span>
            </button>
          </div>
        </div>
      )}

      {/* 6. تدريبات وتقويم */}
      {activeTab === 'exercises' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTab('menu')}
              className="text-xs font-bold text-indigo-800 bg-indigo-100 px-3 py-1.5 rounded-xl hover:bg-indigo-200 transition cursor-pointer"
            >
              ← العودة للأقسام
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-purple-900">تقويم التربية الإسلامية</span>
              <SpeakButton text="تقويم التربية الإسلامية ونيل وسام التميز" size="xs" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border-2 border-indigo-200 shadow-md text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-3xl mb-2">
              ⭐
            </div>
            <h3 className="text-base font-black text-indigo-950">
              وسام المسلمة الصغيرة المتميزة
            </h3>
            <p className="text-xs text-purple-700 mt-1 max-w-xs mx-auto">
              أحسنتِ يا جنى في حفظ أركان الإسلام ومعرفة آداب الوضوء والصلاة، بارك الله فيكِ ورعاكِ!
            </p>

            <button
              onClick={() => {
                playSoundEffect.fanfare();
                onAddStars(10);
                speakText('أحسنتِ يا جنى! نلتِ وسام التفوق في التربية الإسلامية!', 'ar');
              }}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-black text-xs rounded-2xl shadow-lg active:scale-95 transition cursor-pointer"
            >
              استلام وسام التفوق الإسلامي ⭐ +10
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
