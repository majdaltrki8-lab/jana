import React, { useState } from 'react';
import { VirtualTeacher } from '../VirtualTeacher';
import { SpeakButton } from '../SpeakButton';
import { playSoundEffect, speakText } from '../../utils/audio';
import { Volume2, CheckCircle, Sparkles, Eye, Ear, Hand, Smile, Flower2, Cat, Droplet, Sun, ArrowRight } from 'lucide-react';

interface ScienceScreenProps {
  onAddStars: (amount: number) => void;
  onCompleteLesson: (lessonId: string) => void;
}

type ScienceTab = 'menu' | 'senses' | 'plants' | 'animals' | 'water' | 'quiz';

export const ScienceScreen: React.FC<ScienceScreenProps> = ({ onAddStars, onCompleteLesson }) => {
  const [activeTab, setActiveTab] = useState<ScienceTab>('menu');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const scienceTopics = [
    {
      id: 'senses',
      title: 'حواسُّ الْجِسْمِ الْخَمْسُ',
      subtitle: 'البصر، السمع، الشم، التذوق، اللمس',
      icon: '👁️',
      badge: 'الوحدة الأولى',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'plants',
      title: 'النَّبَاتَاتُ مِنْ حَوْلِي',
      subtitle: 'الأشجار، الزهور، الجذور والوراق',
      icon: '🌱',
      badge: 'الوحدة الثانية',
      color: 'from-lime-500 to-green-600',
    },
    {
      id: 'animals',
      title: 'الْحَيَوَانَاتُ الْأَلِيفَةُ وَالْبَرِّيَّةُ',
      subtitle: 'أعلاف الحيوانات ومساكنها المفيدة',
      icon: '🐾',
      badge: 'الوحدة الثالثة',
      color: 'from-amber-500 to-orange-600',
    },
    {
      id: 'water',
      title: 'الْمَاءُ وَالْهَوَاءُ وَالْبِيئَةُ',
      subtitle: 'أهمية الماء والطقس والشمس للحياة',
      icon: '💧',
      badge: 'الوحدة الرابعة',
      color: 'from-cyan-500 to-blue-600',
    },
  ];

  const handleSelectTopic = (id: ScienceTab, title: string) => {
    playSoundEffect.click();
    setActiveTab(id);
    speakText(`مادة العلوم: ${title}. هيا نتعلم يا جنى!`, 'ar');
  };

  return (
    <div className="pb-24 pt-2 px-3 sm:px-4 max-w-lg mx-auto space-y-3">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 rounded-3xl p-3 text-white shadow-lg flex items-center justify-between border-2 border-amber-300">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shadow">
            🔬
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg font-black tracking-wide text-amber-200 drop-shadow">
                مادة العلوم والبيئة
              </h2>
              <SpeakButton
                text="مادة العلوم والبيئة للصف الأول الابتدائي، مدرسة خديجة للبنات"
                size="xs"
                className="bg-white/30 text-white"
              />
            </div>
            <p className="text-xs text-white/90 font-medium">استكشاف الطبيعة والحواس والجسم</p>
          </div>
        </div>
        <span className="bg-amber-400 text-purple-950 px-3 py-1 rounded-full text-xs font-black shadow">
          جديد ✨
        </span>
      </div>

      {activeTab === 'menu' && (
        <>
          <VirtualTeacher
            speechText="أهلاً بكِ في مادة العلوم يا جنى! هنا سنتعلم عن حواسنا الخمس، والنباتات الجميلة، والحيوانات، وأهمية الماء والبيئة. اختاري موضوعاً لنبدأ!"
            lang="ar"
          />

          <div className="grid grid-cols-1 gap-2.5 mt-2">
            {scienceTopics.map((top) => (
              <div
                key={top.id}
                onClick={() => handleSelectTopic(top.id as ScienceTab, top.title)}
                className="bg-white hover:bg-emerald-50/70 rounded-2xl p-3.5 border-2 border-emerald-200 shadow-sm flex items-center justify-between transition active:scale-98 cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-100 to-teal-100 flex items-center justify-center text-3xl group-hover:scale-110 transition shadow-sm">
                    {top.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-emerald-950 group-hover:text-emerald-800 transition">
                        {top.title}
                      </h3>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                        {top.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-700 font-medium mt-0.5">{top.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <SpeakButton text={`${top.title}. ${top.subtitle}`} size="xs" />
                  <span className="text-xs text-emerald-600 font-bold group-hover:-translate-x-1 transition">
                    فتح ❯
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Senses Lesson Screen */}
      {activeTab === 'senses' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTab('menu')}
              className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl hover:bg-emerald-200 transition cursor-pointer flex items-center gap-1"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>العودة لقائمة العلوم</span>
            </button>
            <SpeakButton text="حواس الجسم الخمس: البصر بالعين، السمع بالأذن، الشم بالأنف، التذوق باللسان، اللمس باليد" size="xs" />
          </div>

          <VirtualTeacher
            speechText="حواسنا هي النعم التي أعطانا الله إياها يا جنى لنكتشف العالم من حولنا! لنتعرف عليها معاً."
            lang="ar"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { title: '١. حاسة البصر (العينان)', desc: 'نرى بها الأشياء الجميلة والألوان والأشكال.', icon: '👁️', audio: 'نرى الأشياء بأعيننا الجميلة يا جنى' },
              { title: '٢. حاسة السمع (الأذنان)', desc: 'نسمع بها الأصوات والعصافير والقرآن الكريم.', icon: '👂', audio: 'نسمع الأصوات الجميلة بآذاننا' },
              { title: '٣. حاسة الشم (الأنف)', desc: 'نشم بها رائحة الورود والطعام الطيب.', icon: '👃', audio: 'نشم روائح الزهور الطيبة بأنوفنا' },
              { title: '٤. حاسة التذوق (اللسان)', desc: 'نتذوق بها الطعم الحلو والحامض واللذيذ.', icon: '👅', audio: 'نتذوق أطيب الأطعمة بألسنتنا' },
              { title: '٥. حاسة اللمس (اليد الجلد)', desc: 'نلمس بها الأشياء الناعمة والخشنة والباردة.', icon: '✋', audio: 'نلمس الأشياء ونميزها بأيدينا' },
            ].map((s, idx) => (
              <div
                key={idx}
                onClick={() => {
                  playSoundEffect.click();
                  speakText(s.audio, 'ar');
                }}
                className="bg-white p-4 rounded-2xl border-2 border-emerald-200 shadow-sm space-y-2 cursor-pointer hover:bg-emerald-50/70 active:scale-98 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{s.icon}</span>
                    <h4 className="text-xs font-black text-emerald-950">{s.title}</h4>
                  </div>
                  <SpeakButton text={s.audio} size="xs" />
                </div>
                <p className="text-[11px] text-emerald-800 bg-emerald-50 p-2.5 rounded-xl font-medium">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              playSoundEffect.star();
              onAddStars(5);
              onCompleteLesson('science_senses');
              speakText('أحسنتِ يا جنى! أتممتِ درس الحواس الخمس بنجاح ونلتِ 5 نجوم!', 'ar');
            }}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl font-bold text-xs shadow-md flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            <span>إتمام درس العلوم والحصول على النجوم ⭐ +5</span>
          </button>
        </div>
      )}

      {/* Plants Lesson Screen */}
      {activeTab === 'plants' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTab('menu')}
              className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl hover:bg-emerald-200 transition cursor-pointer flex items-center gap-1"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>العودة لقائمة العلوم</span>
            </button>
            <SpeakButton text="النباتات من حولنا: الأشجار والزهور والخضروات المفيدة" size="xs" />
          </div>

          <VirtualTeacher
            speechText="النباتات كائنات حية جميلة تزين بيوتنا ومدرستنا يا جنى، وهي تعطينا الهواء النقي والثمار الطيبة!"
            lang="ar"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { title: 'أجزاء النبتة', desc: 'الجذور في التربة، الساق القوي، والأوراق الخضراء الجميلة.', icon: '🌿', audio: 'النبتة تتكون من جذور وساق وأوراق خضراء' },
              { title: 'الأزهار والورود', desc: 'تتميز بألوانها الزاهية ورائحتها العطرة.', icon: '🌸', audio: 'الزهور جميلة وزاهية الألوان' },
              { title: 'أشجار الفواكه', desc: 'تفاح وموز وبرتقال تغذي أجسامنا وتمنحنا الصحة.', icon: '🍎', audio: 'الفواكه المفيدة تغذي أجسامنا يا جنى' },
            ].map((p, idx) => (
              <div
                key={idx}
                onClick={() => {
                  playSoundEffect.click();
                  speakText(p.audio, 'ar');
                }}
                className="bg-white p-4 rounded-2xl border-2 border-lime-200 shadow-sm space-y-2 cursor-pointer hover:bg-lime-50/70 active:scale-98 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{p.icon}</span>
                    <h4 className="text-xs font-black text-lime-950">{p.title}</h4>
                  </div>
                  <SpeakButton text={p.audio} size="xs" />
                </div>
                <p className="text-[11px] text-lime-900 bg-lime-50 p-2.5 rounded-xl font-medium">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              playSoundEffect.star();
              onAddStars(5);
              onCompleteLesson('science_plants');
              speakText('أحسنتِ يا جنى! أتممتِ درس النباتات بنجاح ونلتِ 5 نجوم!', 'ar');
            }}
            className="w-full py-3 bg-gradient-to-r from-lime-600 to-green-700 text-white rounded-2xl font-bold text-xs shadow-md flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            <span>إتمام درس النباتات والحصول على النجوم ⭐ +5</span>
          </button>
        </div>
      )}

      {/* Animals Lesson Screen */}
      {activeTab === 'animals' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTab('menu')}
              className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl hover:bg-emerald-200 transition cursor-pointer flex items-center gap-1"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>العودة لقائمة العلوم</span>
            </button>
            <SpeakButton text="الحيوانات الأليفة والبرية وأصواتها وأطعمتها المفيدة" size="xs" />
          </div>

          <VirtualTeacher
            speechText="الحيوانات مخلوقات نافعة يا جنى! منها الحيوانات الأليفة التي نربي ونعتني بها، ومنها الحيوانات البرية."
            lang="ar"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { title: 'القطط الأليفة', desc: 'حيوانات لطيفة تعيش بالقرب منا ونعتني بها.', icon: '🐱', audio: 'القطة حيوان أليف ولطيف' },
              { title: 'الأغنام والابقار', desc: 'تعطينا الحليب المفيد واللحوم الصالحة للتغذية.', icon: '🐄', audio: 'البقرة والخروف تعطينا الحليب المفيد' },
              { title: 'الطيور والعصافير', desc: 'تبني أعشاشها وتغرد بأصوات عذبة في الصباح.', icon: '🐦', audio: 'العصافير تغرد بأصوات جميلة' },
            ].map((a, idx) => (
              <div
                key={idx}
                onClick={() => {
                  playSoundEffect.click();
                  speakText(a.audio, 'ar');
                }}
                className="bg-white p-4 rounded-2xl border-2 border-amber-200 shadow-sm space-y-2 cursor-pointer hover:bg-amber-50/70 active:scale-98 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{a.icon}</span>
                    <h4 className="text-xs font-black text-amber-950">{a.title}</h4>
                  </div>
                  <SpeakButton text={a.audio} size="xs" />
                </div>
                <p className="text-[11px] text-amber-900 bg-amber-50 p-2.5 rounded-xl font-medium">
                  {a.desc}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              playSoundEffect.star();
              onAddStars(5);
              onCompleteLesson('science_animals');
              speakText('أحسنتِ يا جنى! أتممتِ درس الحيوانات بنجاح!', 'ar');
            }}
            className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-700 text-white rounded-2xl font-bold text-xs shadow-md flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            <span>إتمام درس الحيوانات والحصول على النجوم ⭐ +5</span>
          </button>
        </div>
      )}

      {/* Water & Environment Screen */}
      {activeTab === 'water' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTab('menu')}
              className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl hover:bg-emerald-200 transition cursor-pointer flex items-center gap-1"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>العودة لقائمة العلوم</span>
            </button>
            <SpeakButton text="الماء والهواء والبيئة: أساس الحياة على الأرض" size="xs" />
          </div>

          <VirtualTeacher
            speechText="الماء سر الحياة يا جنى! نشربه لنسقي أنفسنا والنباتات، والهواء النقي يمنحنا الصحة والنشاط."
            lang="ar"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { title: 'أهمية الماء', desc: 'الماء العذب ضروري لشرب الإنسان والحيوان وسقي النباتات.', icon: '💧', audio: 'الماء هو سر الحياة يا جنى' },
              { title: 'الشمس والطقس', desc: 'الشمس تمنحنا الدفء والنور وتساعد النبات على النمو.', icon: '☀️', audio: 'الشمس تمنحنا النور والدفء' },
            ].map((w, idx) => (
              <div
                key={idx}
                onClick={() => {
                  playSoundEffect.click();
                  speakText(w.audio, 'ar');
                }}
                className="bg-white p-4 rounded-2xl border-2 border-cyan-200 shadow-sm space-y-2 cursor-pointer hover:bg-cyan-50/70 active:scale-98 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{w.icon}</span>
                    <h4 className="text-xs font-black text-cyan-950">{w.title}</h4>
                  </div>
                  <SpeakButton text={w.audio} size="xs" />
                </div>
                <p className="text-[11px] text-cyan-900 bg-cyan-50 p-2.5 rounded-xl font-medium">
                  {w.desc}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              playSoundEffect.star();
              onAddStars(5);
              onCompleteLesson('science_water');
              speakText('أحسنتِ يا جنى! أتممتِ درس الماء والبيئة بنجاح!', 'ar');
            }}
            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-700 text-white rounded-2xl font-bold text-xs shadow-md flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            <span>إتمام درس الماء والبيئة والحصول على النجوم ⭐ +5</span>
          </button>
        </div>
      )}
    </div>
  );
};
