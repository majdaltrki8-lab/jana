import React, { useState } from 'react';
import { VirtualTeacher } from '../VirtualTeacher';
import { SpeakButton } from '../SpeakButton';
import {
  mathAdditionProblems,
  mathSubtractionProblems,
  mathComparisonItems,
} from '../../utils/curriculumData';
import { playSoundEffect, speakText } from '../../utils/audio';
import { Volume2, CheckCircle2, Award, ArrowUpDown, Plus, Minus } from 'lucide-react';

interface MathScreenProps {
  onAddStars: (amount: number) => void;
  onCompleteLesson: (lessonId: string) => void;
}

type TabType = 'menu' | 'numbers' | 'addition' | 'subtraction' | 'comparison' | 'ordering' | 'problems';

export const MathScreen: React.FC<MathScreenProps> = ({ onAddStars, onCompleteLesson }) => {
  const [activeTab, setActiveTab] = useState<TabType>('menu');
  const [selectedNumber, setSelectedNumber] = useState(5);
  const [addIndex, setAddIndex] = useState(0);
  const [addFeedback, setAddFeedback] = useState<string | null>(null);

  const [subIndex, setSubIndex] = useState(0);
  const [subFeedback, setSubFeedback] = useState<string | null>(null);

  const [compIndex, setCompIndex] = useState(0);
  const [compFeedback, setCompFeedback] = useState<string | null>(null);

  // Ordering game state
  const [orderNumbers, setOrderNumbers] = useState([7, 3, 9, 1, 5]);
  const [sortedSuccess, setSortedSuccess] = useState(false);

  const mathCards = [
    {
      id: 'numbers' as TabType,
      title: 'الأرقام (1 - 100)',
      subtitle: 'العد وقراءة الأرقام',
      spoken: 'الأرقام والعد من واحد إلى مئة',
      iconEmoji: '🔢',
      gradient: 'from-amber-400 to-orange-500',
    },
    {
      id: 'addition' as TabType,
      title: 'الجمع (+)',
      subtitle: 'ضم الأعداد بالصور',
      spoken: 'عملية الجمع البصري وإيجاد ناتج ضم الأعداد',
      iconEmoji: '➕',
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'subtraction' as TabType,
      title: 'الطرح (-)',
      subtitle: 'إنقاص وباقي الأعداد',
      spoken: 'عملية الطرح البصري ومعرفة الباقي',
      iconEmoji: '➖',
      gradient: 'from-rose-500 to-pink-600',
    },
    {
      id: 'comparison' as TabType,
      title: 'مقارنة الأعداد',
      subtitle: 'أكبر من > وأصغر من <',
      spoken: 'مقارنة الأعداد أكبر من وأصغر من ويساوي',
      iconEmoji: '⚖️',
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      id: 'ordering' as TabType,
      title: 'ترتيب الأعداد',
      subtitle: 'تصاعدياً وتنازلياً',
      spoken: 'ترتيب الأعداد تصاعدياً من الأصغر إلى الأكبر',
      iconEmoji: '📊',
      gradient: 'from-purple-500 to-violet-600',
    },
    {
      id: 'problems' as TabType,
      title: 'مسائل تدريبية',
      subtitle: 'مسائل كلامية ذكية',
      spoken: 'مسائل كلامية وتدريبية ذكية',
      iconEmoji: '💡',
      gradient: 'from-cyan-500 to-blue-600',
    },
  ];

  const currentAdd = mathAdditionProblems[addIndex];
  const currentSub = mathSubtractionProblems[subIndex];
  const currentComp = mathComparisonItems[compIndex];

  return (
    <div className="pb-24 pt-2 px-3 sm:px-4 max-w-lg mx-auto">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-3 text-white shadow-lg mb-3 flex items-center justify-between border-2 border-white/60">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shadow">
            🔢
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg font-black tracking-wide text-white drop-shadow">
                الرياضيات الذكية
              </h2>
              <SpeakButton
                text="مادة الرياضيات: الأرقام والجمع والطرح والمقارنة والترتيب"
                size="xs"
                className="bg-white/30 text-white"
              />
            </div>
            <p className="text-xs text-white/90 font-medium">الأرقام والجمع والطرح والمقارنة</p>
          </div>
        </div>
        <SpeakButton
          text="أهلاً يا جنى في عالم الرياضيات الممتع! الأرقام والحساب ألعاب سهلة وجميلة!"
          size="sm"
          className="bg-purple-900 text-amber-300 hover:bg-purple-950"
        />
      </div>

      {/* Main 6 Cards View */}
      {activeTab === 'menu' && (
        <>
          <VirtualTeacher
            speechText="أهلاً يا جنى! اختاري من مهارات الرياضيات: عد الأرقام، الجمع البصري، الطرح، أو مقارنة الأعداد لتكوني بطلة الحساب!"
            lang="ar"
          />

          <div className="grid grid-cols-2 gap-3 mt-2">
            {mathCards.map((card) => (
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

      {/* 1. الأرقام 1-100 */}
      {activeTab === 'numbers' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTab('menu')}
              className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1.5 rounded-xl hover:bg-amber-200 transition cursor-pointer"
            >
              ← العودة للأقسام
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-purple-900">الأرقام والعد (١ - ١٠٠)</span>
              <SpeakButton text="الأرقام والعد من واحد إلى مئة" size="xs" />
            </div>
          </div>

          <VirtualTeacher
            speechText={`العدد ${selectedNumber}. اضغطي على أي رقم لتسمعي صوته يا جنى وتشاهدي عدد العناصر المطابقة!`}
            lang="ar"
          />

          {/* Large Number Showcase */}
          <div
            onClick={() => {
              playSoundEffect.click();
              speakText(`العدد ${selectedNumber}`, 'ar');
            }}
            className="bg-gradient-to-b from-amber-50 to-orange-50 rounded-3xl p-4 border-2 border-amber-300 text-center shadow-md relative cursor-pointer"
          >
            <div className="absolute top-3 left-3">
              <SpeakButton text={`العدد ${selectedNumber}`} size="sm" className="bg-amber-200 text-amber-900" />
            </div>
            <span className="text-7xl font-black text-amber-700 drop-shadow">
              {selectedNumber}
            </span>
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2 max-w-xs mx-auto">
              {Array.from({ length: Math.min(selectedNumber, 20) }).map((_, i) => (
                <span key={i} className="text-2xl animate-bounce" style={{ animationDelay: `${i * 50}ms` }}>
                  🍎
                </span>
              ))}
              {selectedNumber > 20 && (
                <span className="text-xs font-bold text-amber-800 mt-1">
                  (والمزيد من التفاح حتى {selectedNumber}!)
                </span>
              )}
            </div>

            <button
              onClick={() => {
                playSoundEffect.star();
                speakText(`العدد ${selectedNumber}`, 'ar');
                onAddStars(1);
              }}
              className="mt-3 px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow flex items-center gap-2 mx-auto active:scale-95 transition cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>نطق العدد {selectedNumber} 🔊</span>
            </button>
          </div>

          {/* Number Grid 1 - 20 & Milestones */}
          <div className="bg-white p-3 rounded-2xl border border-amber-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-purple-900">الأعداد حتى ٢٠:</p>
              <SpeakButton text="الأعداد من واحد إلى عشرين" size="xs" />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => {
                    setSelectedNumber(n);
                    playSoundEffect.click();
                    speakText(`العدد ${n}`, 'ar');
                  }}
                  className={`h-11 rounded-xl text-lg font-black transition-all flex items-center justify-center cursor-pointer ${
                    selectedNumber === n
                      ? 'bg-amber-500 text-white shadow-md scale-105 ring-2 ring-purple-900'
                      : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between mt-4 mb-2">
              <p className="text-xs font-bold text-purple-900">عشرات الأعداد حتى ١٠٠:</p>
              <SpeakButton text="عشرات الأعداد حتى مئة: ثلاثون، أربعون، خمسون، ستون، سبعون، ثمانون، تسعون، مئة" size="xs" />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[30, 40, 50, 60, 70, 80, 90, 100].map((n) => (
                <button
                  key={n}
                  onClick={() => {
                    setSelectedNumber(n);
                    playSoundEffect.click();
                    speakText(`العدد ${n}`, 'ar');
                  }}
                  className={`h-10 rounded-xl text-sm font-black transition-all flex items-center justify-center cursor-pointer ${
                    selectedNumber === n
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-orange-50 text-orange-900 hover:bg-orange-100'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. الجمع (+) */}
      {activeTab === 'addition' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTab('menu')}
              className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl hover:bg-emerald-200 transition cursor-pointer"
            >
              ← العودة للأقسام
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-purple-900">تحدي الجمع البصري (+)</span>
              <SpeakButton text="تحدي الجمع البصري" size="xs" />
            </div>
          </div>

          <VirtualTeacher
            speechText={`لدينا ${currentAdd.a} عناصر وزدنا عليها ${currentAdd.b} عناصر، كم المجموع الكلي يا جنى؟`}
            lang="ar"
          />

          <div className="bg-white rounded-3xl p-5 border-2 border-emerald-200 shadow-md text-center">
            {/* Visual Addition Illustration */}
            <div className="flex items-center justify-center gap-3 my-2">
              <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 flex flex-col items-center">
                <div className="flex gap-1 text-2xl">
                  {Array.from({ length: currentAdd.a }).map((_, i) => (
                    <span key={i}>{currentAdd.itemEmoji}</span>
                  ))}
                </div>
                <span className="text-2xl font-black text-emerald-800 mt-1">{currentAdd.a}</span>
              </div>

              <div className="text-3xl font-black text-emerald-600 bg-emerald-100 w-10 h-10 rounded-full flex items-center justify-center">
                +
              </div>

              <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 flex flex-col items-center">
                <div className="flex gap-1 text-2xl">
                  {Array.from({ length: currentAdd.b }).map((_, i) => (
                    <span key={i}>{currentAdd.itemEmoji}</span>
                  ))}
                </div>
                <span className="text-2xl font-black text-emerald-800 mt-1">{currentAdd.b}</span>
              </div>

              <div className="text-3xl font-black text-emerald-600">=</div>

              <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-emerald-400 bg-emerald-50/50 flex items-center justify-center text-3xl font-black text-emerald-700">
                ؟
              </div>
            </div>

            <div
              onClick={() => {
                playSoundEffect.click();
                speakText(currentAdd.question, 'ar');
              }}
              className="flex items-center justify-center gap-2 mt-3 cursor-pointer"
            >
              <h3 className="text-base font-black text-purple-900">{currentAdd.question}</h3>
              <SpeakButton text={currentAdd.question} size="xs" />
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[currentAdd.result - 1, currentAdd.result, currentAdd.result + 2].map((opt) => (
                <div key={opt} className="relative">
                  <button
                    onClick={() => {
                      if (opt === currentAdd.result) {
                        playSoundEffect.success();
                        setAddFeedback(`صحيح يا جنى! ${currentAdd.a} زائد ${currentAdd.b} يساوي ${currentAdd.result}`);
                        speakText(`أحسنتِ يا جنى! ${currentAdd.a} زائد ${currentAdd.b} يساوي ${currentAdd.result}`, 'ar');
                        onAddStars(3);
                        setTimeout(() => {
                          setAddFeedback(null);
                          setAddIndex((prev) => (prev + 1) % mathAdditionProblems.length);
                        }, 1800);
                      } else {
                        playSoundEffect.error();
                        setAddFeedback('حاولي العد مرة أخرى يا جنى!');
                        speakText('حاولي مرة ثانية وقومي بعد العناصر معاً!', 'ar');
                      }
                    }}
                    className="w-full py-3 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 rounded-2xl text-2xl font-black text-emerald-950 active:scale-95 transition shadow-sm cursor-pointer"
                  >
                    {opt}
                  </button>
                  <div className="absolute top-1 left-1">
                    <SpeakButton text={`العدد ${opt}`} size="xs" variant="ghost" />
                  </div>
                </div>
              ))}
            </div>

            {addFeedback && (
              <div className="mt-4 p-2 bg-emerald-100 text-emerald-800 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5">
                <span>{addFeedback}</span>
                <SpeakButton text={addFeedback} size="xs" variant="ghost" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. الطرح (-) */}
      {activeTab === 'subtraction' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTab('menu')}
              className="text-xs font-bold text-rose-800 bg-rose-100 px-3 py-1.5 rounded-xl hover:bg-rose-200 transition cursor-pointer"
            >
              ← العودة للأقسام
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-purple-900">تحدي الطرح البصري (-)</span>
              <SpeakButton text="تحدي الطرح البصري" size="xs" />
            </div>
          </div>

          <VirtualTeacher
            speechText={`كان لدينا ${currentSub.a} وأنقصنا منها ${currentSub.b}، كم الباقي يا جنى؟`}
            lang="ar"
          />

          <div className="bg-white rounded-3xl p-5 border-2 border-rose-200 shadow-md text-center">
            <div className="flex items-center justify-center gap-1.5 text-3xl my-2">
              {Array.from({ length: currentSub.a }).map((_, i) => (
                <span
                  key={i}
                  className={i >= currentSub.a - currentSub.b ? 'opacity-30 line-through' : ''}
                >
                  {currentSub.itemEmoji}
                </span>
              ))}
            </div>

            <div
              onClick={() => {
                playSoundEffect.click();
                speakText(currentSub.question, 'ar');
              }}
              className="flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              <h3 className="text-base font-black text-purple-900">{currentSub.question}</h3>
              <SpeakButton text={currentSub.question} size="xs" />
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4">
              {[currentSub.result + 1, currentSub.result, currentSub.result - 1].map((opt) => (
                <div key={opt} className="relative">
                  <button
                    onClick={() => {
                      if (opt === currentSub.result) {
                        playSoundEffect.success();
                        setSubFeedback(`ممتازة يا جنى! الباقي هو ${currentSub.result}`);
                        speakText(`رائعة يا جنى! الإجابة صحيحة: ${currentSub.result}`, 'ar');
                        onAddStars(3);
                        setTimeout(() => {
                          setSubFeedback(null);
                          setSubIndex((prev) => (prev + 1) % mathSubtractionProblems.length);
                        }, 1800);
                      } else {
                        playSoundEffect.error();
                        setSubFeedback('حاولي مرة أخرى يا بطلة خديجة!');
                        speakText('حاولي مرة ثانية يا بطلة خديجة!', 'ar');
                      }
                    }}
                    className="w-full py-3 bg-rose-50 hover:bg-rose-100 border-2 border-rose-300 rounded-2xl text-2xl font-black text-rose-950 active:scale-95 transition shadow-sm cursor-pointer"
                  >
                    {opt}
                  </button>
                  <div className="absolute top-1 left-1">
                    <SpeakButton text={`العدد ${opt}`} size="xs" variant="ghost" />
                  </div>
                </div>
              ))}
            </div>

            {subFeedback && (
              <div className="mt-4 p-2 bg-emerald-100 text-emerald-800 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5">
                <span>{subFeedback}</span>
                <SpeakButton text={subFeedback} size="xs" variant="ghost" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. مقارنة الأعداد (> <=) */}
      {activeTab === 'comparison' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTab('menu')}
              className="text-xs font-bold text-blue-800 bg-blue-100 px-3 py-1.5 rounded-xl hover:bg-blue-200 transition cursor-pointer"
            >
              ← العودة للأقسام
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-purple-900">مقارنة الأعداد (&gt; &lt; =)</span>
              <SpeakButton text="مقارنة الأعداد أكبر من وأصغر من ويساوي" size="xs" />
            </div>
          </div>

          <VirtualTeacher
            speechText={`قارني بين العددين: ${currentComp.num1} و ${currentComp.num2}. أيهما أكبر يا جنى؟`}
            lang="ar"
          />

          <div className="bg-white rounded-3xl p-5 border-2 border-blue-200 shadow-md text-center">
            <div className="flex items-center justify-center gap-4 my-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-3xl font-black text-blue-900 shadow-inner">
                {currentComp.num1}
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-2xl font-black text-amber-700">
                ؟
              </div>
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-3xl font-black text-blue-900 shadow-inner">
                {currentComp.num2}
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-xs font-bold text-purple-900">اختاري العلامة الصحيحة:</span>
              <SpeakButton text={`قارني بين العددين ${currentComp.num1} و ${currentComp.num2}`} size="xs" />
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4">
              {['>', '=', '<'].map((sign) => (
                <button
                  key={sign}
                  onClick={() => {
                    if (sign === currentComp.sign) {
                      playSoundEffect.success();
                      setCompFeedback(`أحسنتِ! ${currentComp.text}`);
                      speakText(`ممتازة يا جنى! ${currentComp.text}`, 'ar');
                      onAddStars(3);
                      setTimeout(() => {
                        setCompFeedback(null);
                        setCompIndex((prev) => (prev + 1) % mathComparisonItems.length);
                      }, 1800);
                    } else {
                      playSoundEffect.error();
                      setCompFeedback('حاولي المقارنة بدقة يا جنى!');
                      speakText('حاولي المقارنة بدقة يا جنى!', 'ar');
                    }
                  }}
                  className="py-3.5 bg-blue-50 hover:bg-blue-100 border-2 border-blue-300 rounded-2xl text-2xl font-black text-blue-950 active:scale-95 transition cursor-pointer"
                >
                  {sign}
                </button>
              ))}
            </div>

            {compFeedback && (
              <div className="mt-4 p-2 bg-emerald-100 text-emerald-800 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5">
                <span>{compFeedback}</span>
                <SpeakButton text={compFeedback} size="xs" variant="ghost" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. ترتيب الأعداد */}
      {activeTab === 'ordering' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTab('menu')}
              className="text-xs font-bold text-purple-800 bg-purple-100 px-3 py-1.5 rounded-xl hover:bg-purple-200 transition cursor-pointer"
            >
              ← العودة للأقسام
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-purple-900">ترتيب الأعداد تصاعدياً</span>
              <SpeakButton text="ترتيب الأعداد تصاعدياً من الأصغر إلى الأكبر" size="xs" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border-2 border-purple-200 shadow-md text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <h3 className="text-base font-black text-purple-900">
                رتبي الأعداد من الأصغر إلى الأكبر (تصاعدياً):
              </h3>
              <SpeakButton text="رتبي الأعداد من الأصغر إلى الأكبر تصاعدياً" size="xs" />
            </div>
            <div className="flex items-center justify-center gap-2 my-4">
              {orderNumbers.map((num) => (
                <span
                  key={num}
                  className="w-11 h-11 rounded-2xl bg-purple-100 flex items-center justify-center text-xl font-black text-purple-900 shadow-sm"
                >
                  {num}
                </span>
              ))}
            </div>

            <button
              onClick={() => {
                const sorted = [...orderNumbers].sort((a, b) => a - b);
                setOrderNumbers(sorted);
                setSortedSuccess(true);
                playSoundEffect.fanfare();
                onAddStars(5);
                speakText('أحسنتِ يا جنى! تم الترتيب التصاعدي بنجاح تام: 1، 3، 5، 7، 9', 'ar');
              }}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold text-xs shadow active:scale-95 transition cursor-pointer"
            >
              الترتيب الصحيح ⭐
            </button>

            {sortedSuccess && (
              <div className="mt-3 p-2 bg-emerald-100 text-emerald-800 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5">
                <span>ممتازة يا جنى! الترتيب التصاعدي: ١، ٣، ٥، ٧، ٩</span>
                <SpeakButton text="ممتازة يا جنى! الترتيب التصاعدي: واحد، ثلاثة، خمسة، سبعة، تسعة" size="xs" variant="ghost" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. مسائل تدريبية */}
      {activeTab === 'problems' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTab('menu')}
              className="text-xs font-bold text-cyan-800 bg-cyan-100 px-3 py-1.5 rounded-xl hover:bg-cyan-200 transition cursor-pointer"
            >
              ← العودة للأقسام
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-purple-900">مسائل تدريبية ذكية</span>
              <SpeakButton text="مسائل تدريبية وحسابية ذكية" size="xs" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border-2 border-cyan-200 shadow-md">
            <div className="flex items-center justify-between gap-2 text-cyan-700 font-black text-sm mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💡</span>
                <h4>مسألة جنى وزميلاتها في مدرسة خديجة:</h4>
              </div>
              <SpeakButton
                text="اشترت جنى أربعة دفاتر جميلة، ثم أهدتها معلمتها دفترين إضافيين لتفوقها. كم دفتراً أصبح مع جنى الآن؟"
                size="xs"
              />
            </div>
            <p className="text-sm font-bold text-purple-950 leading-relaxed bg-cyan-50/60 p-3 rounded-2xl border border-cyan-100">
              اشترت جنى ٤ دفاتر جميلة، ثم أهدتها معلمتها دفترين إضافيين لتفوقها. كم دفتراً أصبح مع جنى الآن؟
            </p>

            <button
              onClick={() => {
                playSoundEffect.click();
                speakText(
                  'اشترت جنى أربعة دفاتر، ثم أهدتها معلمتها دفترين لتفوقها. كم دفتراً أصبح مع جنى الآن؟',
                  'ar'
                );
              }}
              className="mt-3 text-xs font-bold text-cyan-800 bg-cyan-100 hover:bg-cyan-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>استمعي للمسألة 🔊</span>
            </button>

            <div className="grid grid-cols-3 gap-3 mt-4">
              {[5, 6, 7].map((ans) => (
                <div key={ans} className="relative">
                  <button
                    onClick={() => {
                      if (ans === 6) {
                        playSoundEffect.fanfare();
                        onAddStars(5);
                        onCompleteLesson('math_numbers_10');
                        speakText('إجابة عبقرية يا جنى! 4 زائد 2 يساوي 6 دفاتر!', 'ar');
                      } else {
                        playSoundEffect.error();
                        speakText('حاولي مرة أخرى يا جنى!', 'ar');
                      }
                    }}
                    className="w-full py-3 bg-cyan-50 hover:bg-cyan-100 border-2 border-cyan-300 rounded-2xl text-xl font-black text-cyan-950 active:scale-95 transition cursor-pointer"
                  >
                    {ans} دفاتر
                  </button>
                  <div className="absolute top-1 left-1">
                    <SpeakButton text={`${ans} دفاتر`} size="xs" variant="ghost" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
