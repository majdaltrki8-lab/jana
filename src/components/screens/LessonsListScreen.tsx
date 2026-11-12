import React from 'react';
import { ScreenType } from '../../types';
import { SpeakButton } from '../SpeakButton';
import { playSoundEffect, speakText } from '../../utils/audio';
import { BookOpen, CheckCircle, ArrowLeft, Star } from 'lucide-react';

interface LessonsListScreenProps {
  onNavigate: (screen: ScreenType) => void;
  completedLessons: string[];
}

export const LessonsListScreen: React.FC<LessonsListScreenProps> = ({
  onNavigate,
  completedLessons,
}) => {
  const subjects = [
    {
      id: 'arabic' as ScreenType,
      name: 'اللغة العربية',
      lessonsCount: '٦ مهارات (الحروف، القراءة، الكتابة)',
      icon: '📖',
      color: 'bg-pink-500',
    },
    {
      id: 'english' as ScreenType,
      name: 'اللغة الإنجليزية',
      lessonsCount: 'A-Z + Words & Speaking',
      icon: '🔤',
      color: 'bg-blue-500',
    },
    {
      id: 'math' as ScreenType,
      name: 'الرياضيات',
      lessonsCount: 'الأرقام والجمع والطرح',
      icon: '🔢',
      color: 'bg-amber-500',
    },
    {
      id: 'quran' as ScreenType,
      name: 'القرآن الكريم',
      lessonsCount: '١٠ سور مقررة مع التلاوة والتكرار',
      icon: '🕌',
      color: 'bg-emerald-500',
    },
    {
      id: 'islamic' as ScreenType,
      name: 'التربية الإسلامية',
      lessonsCount: 'العقيدة والوضوء والصلوات والآداب',
      icon: '🌱',
      color: 'bg-teal-600',
    },
    {
      id: 'yemeni_curriculum' as ScreenType,
      name: 'دروس المنهج اليمني',
      lessonsCount: '٥ كتب مدرسية كاملة بالوحدات',
      icon: '📚',
      color: 'bg-purple-600',
    },
  ];

  return (
    <div className="pb-24 pt-2 px-3 sm:px-4 max-w-lg mx-auto">
      <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-purple-900 rounded-3xl p-3 text-white shadow-lg mb-3 flex items-center justify-between border-2 border-amber-300">
        <div className="flex items-center gap-2">
          <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl shadow">
            📖
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg font-black text-amber-200">دروسي ومناهجي</h2>
              <SpeakButton text="قائمة المواد والدروس المقررة لمتابعة المذاكرة اليومية" size="xs" className="bg-white/30 text-white" />
            </div>
            <p className="text-xs text-white/90 font-medium">متابعة المواد والدروس اليومية</p>
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        {subjects.map((subj) => (
          <div
            key={subj.id}
            onClick={() => {
              playSoundEffect.click();
              onNavigate(subj.id);
            }}
            className="bg-white rounded-2xl p-3.5 border-2 border-purple-200 shadow-sm flex items-center justify-between hover:bg-purple-50/70 transition cursor-pointer active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-xl ${subj.color} text-white flex items-center justify-center text-2xl shadow-sm`}
              >
                {subj.icon}
              </div>
              <div className="text-right">
                <h3 className="text-sm font-black text-purple-950">{subj.name}</h3>
                <p className="text-[11px] text-purple-600 font-bold">{subj.lessonsCount}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <SpeakButton text={`${subj.name}. ${subj.lessonsCount}`} size="xs" />
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                متابعة ❯
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
