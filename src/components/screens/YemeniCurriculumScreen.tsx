import React, { useState } from 'react';
import { VirtualTeacher } from '../VirtualTeacher';
import { SpeakButton } from '../SpeakButton';
import { yemeniCurriculumData } from '../../utils/curriculumData';
import { playSoundEffect, speakText } from '../../utils/audio';
import { Volume2, ChevronLeft, BookOpen, CheckCircle, Sparkles } from 'lucide-react';

interface YemeniCurriculumScreenProps {
  onAddStars: (amount: number) => void;
  onCompleteLesson: (lessonId: string) => void;
}

export const YemeniCurriculumScreen: React.FC<YemeniCurriculumScreenProps> = ({
  onAddStars,
  onCompleteLesson,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<(typeof yemeniCurriculumData)[0] | null>(
    null
  );
  const [activeLesson, setActiveLesson] = useState<{ title: string; desc: string } | null>(null);

  const handleSelectSubject = (subj: (typeof yemeniCurriculumData)[0]) => {
    playSoundEffect.click();
    setSelectedSubject(subj);
    setActiveLesson(null);
    speakText(`كتاب ${subj.title}، وفق المنهج اليمني للصف الأول!`, 'ar');
  };

  const handleOpenLesson = (lesson: { title: string; desc: string }) => {
    playSoundEffect.click();
    setActiveLesson(lesson);
    speakText(`${lesson.title}. ${lesson.desc}`, 'ar');
  };

  return (
    <div className="pb-24 pt-2 px-3 sm:px-4 max-w-lg mx-auto">
      {/* Header Banner matching Screen 9 */}
      <div className="relative bg-gradient-to-r from-purple-800 via-indigo-800 to-purple-900 rounded-3xl p-3 text-white shadow-lg mb-3 flex items-center justify-between border-2 border-amber-300">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shadow">
            📚
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg font-black tracking-wide text-amber-200 drop-shadow">
                دروس المنهج اليمني
              </h2>
              <SpeakButton
                text="دروس ومقررات المنهج اليمني للصف الأول الابتدائي بمدرسة خديجة للبنات"
                size="xs"
                className="bg-white/30 text-white"
              />
            </div>
            <p className="text-xs text-white/90 font-medium">كتب ومقررات الصف الأول الأساسي</p>
          </div>
        </div>
        <SpeakButton
          text="أهلاً بكِ يا جنى في كتب المنهج الدراسي اليمني لمدرسة خديجة للبنات! كتبكِ المدرسية مرتبة بالوحدات والدروس!"
          size="sm"
          className="bg-amber-400 text-purple-950 hover:bg-amber-300"
        />
      </div>

      {/* Main Subjects List matching Screen 9 */}
      {!selectedSubject && (
        <>
          <VirtualTeacher
            speechText="هذه هي كتب المنهج اليمني المقررة للصف الأول يا جنى. اختاري الكتاب الذي تدرسينه في مدرسة خديجة لنتصفح وحداته ودروسه معاً!"
            lang="ar"
          />

          <div className="space-y-2.5 mt-3">
            {yemeniCurriculumData.map((subj) => (
              <div
                key={subj.id}
                onClick={() => handleSelectSubject(subj)}
                className="w-full bg-white hover:bg-purple-50/80 rounded-2xl p-3.5 border-2 border-purple-200/80 shadow-sm flex items-center justify-between transition-all active:scale-98 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center text-2xl group-hover:scale-105 transition">
                    {subj.icon}
                  </div>
                  <div className="text-right">
                    <h3 className="text-sm font-black text-purple-950 group-hover:text-purple-700 transition">
                      {subj.title}
                    </h3>
                    <p className="text-[11px] text-purple-600 font-medium">{subj.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <SpeakButton text={`${subj.title}. ${subj.subtitle}`} size="xs" />
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-200">
                    {subj.badge}
                  </span>
                  <ChevronLeft className="w-5 h-5 text-purple-400 group-hover:text-purple-700 transition transform group-hover:-translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Subject Units & Lessons View */}
      {selectedSubject && !activeLesson && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedSubject(null)}
              className="text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1.5 rounded-xl hover:bg-purple-200 transition cursor-pointer"
            >
              ← العودة لقائمة الكتب
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-purple-900">{selectedSubject.title}</span>
              <SpeakButton text={selectedSubject.title} size="xs" />
            </div>
          </div>

          <VirtualTeacher
            speechText={`هذه وحدات ودروس ${selectedSubject.title}. اختاري الدرس الذي وصلتِ إليه مع معلمتكِ في الفصل يا جنى!`}
            lang="ar"
          />

          <div className="space-y-3">
            {selectedSubject.units.map((unit) => (
              <div
                key={unit.unitNumber}
                className="bg-white rounded-3xl p-4 border border-purple-200 shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-purple-100 pb-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                      {unit.unitNumber}
                    </span>
                    <SpeakButton text={`${unit.unitNumber}: ${unit.unitTitle}`} size="xs" />
                  </div>
                  <h4 className="text-sm font-black text-purple-950">{unit.unitTitle}</h4>
                </div>

                <div className="space-y-1.5">
                  {unit.lessons.map((lesson) => (
                    <div
                      key={lesson.title}
                      onClick={() => handleOpenLesson(lesson)}
                      className="w-full p-2.5 rounded-xl bg-purple-50/50 hover:bg-purple-100/70 text-right flex items-center justify-between transition group cursor-pointer"
                    >
                      <div>
                        <h5 className="text-xs font-bold text-purple-950 group-hover:text-purple-700">
                          {lesson.title}
                        </h5>
                        <p className="text-[10px] text-purple-600 mt-0.5">{lesson.desc}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <SpeakButton text={`${lesson.title}. ${lesson.desc}`} size="xs" />
                        <ChevronLeft className="w-4 h-4 text-purple-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Lesson Detail View */}
      {activeLesson && selectedSubject && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveLesson(null)}
              className="text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1.5 rounded-xl hover:bg-purple-200 transition cursor-pointer"
            >
              ← العودة لدروس الوحدة
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-purple-900">{selectedSubject.title}</span>
              <SpeakButton text={activeLesson.title} size="xs" />
            </div>
          </div>

          <VirtualTeacher
            speechText={`شرح درس: ${activeLesson.title}. ${activeLesson.desc}. هيا نستمع ونتعلم بجد يا بطلة خديجة!`}
            lang="ar"
          />

          <div className="bg-white rounded-3xl p-5 border-2 border-purple-300 shadow-md">
            <div className="flex items-center justify-between mb-2 text-purple-900">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedSubject.icon}</span>
                <h3 className="text-base font-black text-purple-950">{activeLesson.title}</h3>
              </div>
              <SpeakButton text={`${activeLesson.title}. ${activeLesson.desc}`} size="sm" />
            </div>

            <p className="text-sm font-bold text-purple-900 leading-loose bg-purple-50/70 p-4 rounded-2xl border border-purple-100">
              {activeLesson.desc}
            </p>

            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={() => {
                  playSoundEffect.star();
                  speakText(
                    `شرح المعلمة لدرس: ${activeLesson.title}. محتوى الدرس: ${activeLesson.desc}. أحسنتِ يا جنى!`,
                    'ar'
                  );
                }}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold text-xs shadow flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>استماع لشرح المعلمة بالتفصيل 🔊</span>
              </button>

              <button
                onClick={() => {
                  playSoundEffect.fanfare();
                  onAddStars(5);
                  onCompleteLesson(`yemeni_${activeLesson.title}`);
                  speakText('أحسنتِ يا جنى! أتممتِ هذا الدرس من المنهج اليمني بنجاح!', 'ar');
                }}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-bold text-xs shadow flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                <span>إتمام الدرس والحصول على النجوم ⭐ +5</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
