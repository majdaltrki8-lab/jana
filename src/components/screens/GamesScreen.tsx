import React, { useState, useEffect } from 'react';
import { VirtualTeacher } from '../VirtualTeacher';
import { SpeakButton } from '../SpeakButton';
import { playSoundEffect, speakText, triggerConfetti } from '../../utils/audio';
import { Volume2, Trophy, RotateCcw, Sparkles, Award } from 'lucide-react';

interface GamesScreenProps {
  onAddStars: (amount: number) => void;
}

type GameType = 'menu' | 'letters_game' | 'words_game' | 'numbers_game' | 'math_game' | 'memory_game' | 'riddles_game';

export const GamesScreen: React.FC<GamesScreenProps> = ({ onAddStars }) => {
  const [activeGame, setActiveGame] = useState<GameType>('menu');

  // Game 1: Letter Balloon Pop Game
  const [targetLetter, setTargetLetter] = useState('أ');
  const [letterScore, setLetterScore] = useState(0);
  const letterPool = ['أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'د', 'ر', 'س', 'م'];

  // Game 2: Words Match Game
  const wordChallenges = [
    { word: 'تُفَّاحَة', emoji: '🍎', options: ['🍎', '🍌', '🍇'], spoken: 'أين صورة تُفَّاحَة يا جنى؟' },
    { word: 'قِطَّة', emoji: '🐱', options: ['🐶', '🐱', '🐦'], spoken: 'أين صورة قِطَّة يا جنى؟' },
    { word: 'شَمْس', emoji: '☀️', options: ['🌙', '⭐', '☀️'], spoken: 'أين صورة شَمْس يا جنى؟' },
    { word: 'قَلَم', emoji: '✏️', options: ['📖', '✏️', '🎒'], spoken: 'أين صورة قَلَم يا جنى؟' },
    { word: 'كِتَاب', emoji: '📖', options: ['📖', '🎈', '🌸'], spoken: 'أين صورة كِتَاب يا جنى؟' },
  ];
  const [wordGameIndex, setWordGameIndex] = useState(0);
  const [wordGameFeedback, setWordGameFeedback] = useState<string | null>(null);

  // Game 3: Fast Numbers Game
  const numberChallenges = [
    { target: 3, emojis: ['🍎', '🍎', '🍎'], options: [2, 3, 4], spoken: 'عدّي التفاحات واختاري العدد الصحيح يا جنى!' },
    { target: 5, emojis: ['⭐', '⭐', '⭐', '⭐', '⭐'], options: [4, 5, 6], spoken: 'عدّي النجوم واختاري العدد الصحيح يا جنى!' },
    { target: 4, emojis: ['🎈', '🎈', '🎈', '🎈'], options: [3, 4, 5], spoken: 'عدّي البالونات واختاري العدد الصحيح يا جنى!' },
    { target: 6, emojis: ['🌸', '🌸', '🌸', '🌸', '🌸', '🌸'], options: [5, 6, 7], spoken: 'عدّي الزهرات واختاري العدد الصحيح يا جنى!' },
  ];
  const [numberGameIndex, setNumberGameIndex] = useState(0);
  const [numberGameFeedback, setNumberGameFeedback] = useState<string | null>(null);

  // Game 4: Math Addition & Subtraction Game
  const mathChallenges = [
    { expr: '2 + 3 = ؟', answer: 5, options: [4, 5, 6], spoken: 'كم ناتج اثنان زائد ثلاثة يا جنى؟' },
    { expr: '5 - 2 = ؟', answer: 3, options: [2, 3, 4], spoken: 'كم ناتج خمسة ناقص اثنان يا جنى؟' },
    { expr: '4 + 4 = ؟', answer: 8, options: [7, 8, 9], spoken: 'كم ناتج أربعة زائد أربعة يا جنى؟' },
    { expr: '7 - 3 = ؟', answer: 4, options: [3, 4, 5], spoken: 'كم ناتج سبعة ناقص ثلاثة يا جنى؟' },
  ];
  const [mathGameIndex, setMathGameIndex] = useState(0);
  const [mathGameFeedback, setMathGameFeedback] = useState<string | null>(null);

  // Game 5: Memory Match Game
  const initialMemoryCards = [
    { id: 1, val: '🍎', flipped: false, matched: false },
    { id: 2, val: '🍎', flipped: false, matched: false },
    { id: 3, val: '🐱', flipped: false, matched: false },
    { id: 4, val: '🐱', flipped: false, matched: false },
    { id: 5, val: '⭐', flipped: false, matched: false },
    { id: 6, val: '⭐', flipped: false, matched: false },
    { id: 7, val: '🎈', flipped: false, matched: false },
    { id: 8, val: '🎈', flipped: false, matched: false },
  ];
  const [memoryCards, setMemoryCards] = useState(initialMemoryCards);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);

  // Game 6: Riddles Game
  const riddles = [
    {
      q: 'أَنَا لَوْنِي أَحْمَر، طَعْمِي لَذِيذ، وَأَبْدَأُ بِحَرْفِ التَّاءِ.. مَنْ أَنَا؟',
      spokenQ: 'أنا لوني أحمر، طعمي لذيذ، وأبدأ بحرف التاء.. من أنا يا جنى؟',
      options: ['تُفَّاح 🍎', 'مَوْز 🍌', 'عِنَب 🍇'],
      correct: 0,
      answer: 'تُفَّاح 🍎',
    },
    {
      q: 'حَيَوَانٌ أَلِيفٌ يَمْشِي بِلُطْفٍ وَيَقُولُ: مِيَاوْ مِيَاوْ.. مَنْ أَنَا؟',
      spokenQ: 'حيوان أليف يقول مياو مياو، من هو يا جنى؟',
      options: ['حِصَان 🐴', 'قِطَّة 🐱', 'عُصْفُور 🐦'],
      correct: 1,
      answer: 'قِطَّة 🐱',
    },
    {
      q: 'حَاصِلُ جَمْعِ عَدَدِ عَيْنَيْكِ مَعَ عَدَدِ أُذُنَيْكِ هُوَ: ..؟',
      spokenQ: 'حاصل جمع عينيك الاثنتين وأذنيك الاثنتين كم يساوي يا جنى؟',
      options: ['٢', '٣', '٤'],
      correct: 2,
      answer: '٤',
    },
  ];
  const [riddleIndex, setRiddleIndex] = useState(0);
  const [riddleFeedback, setRiddleFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (activeGame === 'letters_game') {
      const rand = letterPool[Math.floor(Math.random() * letterPool.length)];
      setTargetLetter(rand);
    }
  }, [activeGame]);

  const handleLetterBalloonClick = (letter: string) => {
    if (letter === targetLetter) {
      playSoundEffect.pop();
      setLetterScore((s) => s + 1);
      onAddStars(2);
      const nextLetter = letterPool[Math.floor(Math.random() * letterPool.length)];
      setTargetLetter(nextLetter);
      speakText(`ممتازة يا جنى! والآن ابحثي عن حرف: «${nextLetter}»!`, 'ar');
    } else {
      playSoundEffect.error();
      speakText('حاولي مرة ثانية وابحثي عن الحرف المطلوب!', 'ar');
    }
  };

  const handleCardFlip = (idx: number) => {
    if (memoryCards[idx].flipped || memoryCards[idx].matched || flippedIndices.length === 2) return;

    playSoundEffect.click();
    const updated = [...memoryCards];
    updated[idx].flipped = true;
    setMemoryCards(updated);

    const newFlipped = [...flippedIndices, idx];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (updated[first].val === updated[second].val) {
        setTimeout(() => {
          playSoundEffect.success();
          updated[first].matched = true;
          updated[second].matched = true;
          setMemoryCards([...updated]);
          setFlippedIndices([]);
          onAddStars(3);

          if (updated.every((c) => c.matched)) {
            playSoundEffect.fanfare();
            triggerConfetti();
            speakText('رائعة يا جنى! ذاكرتكِ خارقة وقوية جداً!', 'ar');
          }
        }, 500);
      } else {
        setTimeout(() => {
          playSoundEffect.error();
          updated[first].flipped = false;
          updated[second].flipped = false;
          setMemoryCards([...updated]);
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  const resetMemoryGame = () => {
    const shuffled = [...initialMemoryCards]
      .sort(() => Math.random() - 0.5)
      .map((c, i) => ({ ...c, id: i, flipped: false, matched: false }));
    setMemoryCards(shuffled);
    setFlippedIndices([]);
  };

  const gamesCards = [
    {
      id: 'letters_game' as GameType,
      title: 'لعبة الحروف',
      subtitle: 'فرقعة بالونات الحروف',
      spoken: 'لعبة الحروف: فرقعة بالون الحرف المطلوب',
      iconEmoji: '🎈',
      gradient: 'from-pink-500 to-rose-600',
    },
    {
      id: 'words_game' as GameType,
      title: 'لعبة الكلمات',
      subtitle: 'توصيل الصورة بالكلمة',
      spoken: 'لعبة الكلمات ومطابقة الصور اللطيفة',
      iconEmoji: '🔤',
      gradient: 'from-amber-400 to-orange-500',
    },
    {
      id: 'numbers_game' as GameType,
      title: 'لعبة الأرقام',
      subtitle: 'العد السريع مع الجواهر',
      spoken: 'لعبة الأرقام والعد السريع',
      iconEmoji: '🔢',
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      id: 'math_game' as GameType,
      title: 'لعبة الجمع والطرح',
      subtitle: 'مسابقة النجوم السريعة',
      spoken: 'لعبة الجمع والطرح ومسابقة النجوم',
      iconEmoji: '➕',
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'memory_game' as GameType,
      title: 'ذاكرة وتركيز',
      subtitle: 'مطابقة البطاقات المقلوبة',
      spoken: 'لعبة الذاكرة والتركيز ومطابقة البطاقات',
      iconEmoji: '🧠',
      gradient: 'from-purple-500 to-fuchsia-600',
    },
    {
      id: 'riddles_game' as GameType,
      title: 'ألغاز ذكية',
      subtitle: 'فوازير صوتية للأذكياء',
      spoken: 'ألغاز ذكية وفوازير صوتية مشوقة',
      iconEmoji: '🧩',
      gradient: 'from-violet-600 to-purple-800',
    },
  ];

  return (
    <div className="pb-24 pt-2 px-3 sm:px-4 max-w-lg mx-auto">
      {/* Header Banner matching Screen 10 */}
      <div className="relative bg-gradient-to-r from-fuchsia-600 via-pink-600 to-purple-700 rounded-3xl p-3 text-white shadow-lg mb-3 flex items-center justify-between border-2 border-amber-300">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shadow">
            🎮
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg font-black tracking-wide text-amber-200 drop-shadow">
                الألعاب التعليمية
              </h2>
              <SpeakButton
                text="الألعاب التعليمية: ألعاب الذكاء والمرح ومطابقة الحروف والأرقام"
                size="xs"
                className="bg-white/30 text-white"
              />
            </div>
            <p className="text-xs text-white/90 font-medium">ألعاب الذكاء والمرح ومطابقة الحروف</p>
          </div>
        </div>
        <SpeakButton
          text="أهلاً بكِ في واحة الألعاب التعليمية يا جنى! العبي وتعلمي واجمعي الكثير من النجوم اللامعة!"
          size="sm"
          className="bg-amber-400 text-purple-950 hover:bg-amber-300"
        />
      </div>

      {/* Main 6 Games Cards */}
      {activeGame === 'menu' && (
        <>
          <VirtualTeacher
            speechText="هيا نلعب ونتعلم يا جنى! اختاري لعبة الحروف، أو لعبة الذاكرة والتركيز، أو الألغاز الذكية لنتحدى ذكاءكِ ونكسب الجوائز!"
            lang="ar"
          />

          <div className="grid grid-cols-2 gap-3 mt-2">
            {gamesCards.map((card) => (
              <div
                key={card.id}
                onClick={() => {
                  playSoundEffect.click();
                  setActiveGame(card.id);
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

      {/* Game 1: Balloon Letter Pop */}
      {activeGame === 'letters_game' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveGame('menu')}
              className="text-xs font-bold text-pink-800 bg-pink-100 px-3 py-1.5 rounded-xl hover:bg-pink-200 transition cursor-pointer"
            >
              ← العودة للألعاب
            </button>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 bg-amber-400 text-purple-950 px-2.5 py-0.5 rounded-full text-xs font-black">
                <Trophy className="w-3.5 h-3.5" />
                <span>النقاط: {letterScore}</span>
              </div>
              <SpeakButton text={`افقعي بالون الحرف ${targetLetter} يا جنى!`} size="xs" />
            </div>
          </div>

          <div className="bg-gradient-to-b from-pink-50 to-purple-50 rounded-3xl p-4 border-2 border-pink-300 shadow-md text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <h3 className="text-base font-black text-purple-900">
                افقعي بالون الحرف:
              </h3>
              <SpeakButton text={`افقعي بالون حرف ${targetLetter}`} size="xs" />
            </div>
            <div
              onClick={() => speakText(`ابحثي عن حرف ${targetLetter} يا جنى واضغطي عليه!`, 'ar')}
              className="text-5xl font-black text-pink-600 mb-4 animate-bounce cursor-pointer"
              title="اضغطي لإعادة سماع الحرف"
            >
              «{targetLetter}»
            </div>

            {/* Balloon Grid covering full letterPool */}
            <div className="grid grid-cols-5 gap-2">
              {letterPool.map((letter, i) => (
                <button
                  key={i}
                  onClick={() => handleLetterBalloonClick(letter)}
                  className="h-14 rounded-3xl bg-gradient-to-tr from-pink-400 to-rose-500 text-white font-black text-2xl shadow-md border-2 border-white active:scale-90 transition-transform flex items-center justify-center cursor-pointer hover:brightness-110"
                >
                  {letter}
                </button>
              ))}
            </div>

            <button
              onClick={() => speakText(`ابحثي عن حرف ${targetLetter} يا جنى واضغطي عليه!`, 'ar')}
              className="mt-4 text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>تكرار نطق الحرف المطلوب 🔊</span>
            </button>
          </div>
        </div>
      )}

      {/* Game 2: Words Match Game */}
      {activeGame === 'words_game' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveGame('menu')}
              className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1.5 rounded-xl hover:bg-amber-200 transition cursor-pointer"
            >
              ← العودة للألعاب
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-purple-900">توصيل الصورة بالكلمة</span>
              <SpeakButton text={wordChallenges[wordGameIndex].spoken} size="xs" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border-2 border-amber-300 shadow-md text-center space-y-4">
            <div
              onClick={() => speakText(wordChallenges[wordGameIndex].spoken, 'ar')}
              className="bg-amber-50 rounded-2xl p-4 border border-amber-200 cursor-pointer active:scale-98 transition"
            >
              <p className="text-xs font-bold text-amber-700 mb-1">اضغطي على الكلمة للاستماع:</p>
              <h3 className="text-3xl font-black text-purple-950">
                {wordChallenges[wordGameIndex].word} 🔊
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {wordChallenges[wordGameIndex].options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    if (opt === wordChallenges[wordGameIndex].emoji) {
                      playSoundEffect.success();
                      setWordGameFeedback(`ممتازة يا جنى! هذه صورة ${wordChallenges[wordGameIndex].word}!`);
                      speakText('أحسنتِ يا جنى!', 'ar');
                      onAddStars(3);
                      setTimeout(() => {
                        setWordGameFeedback(null);
                        setWordGameIndex((p) => (p + 1) % wordChallenges.length);
                      }, 1600);
                    } else {
                      playSoundEffect.error();
                      setWordGameFeedback('حاولي مرة أخرى يا أميرتي!');
                      speakText('حاولي مرة أخرى يا أميرتي!', 'ar');
                    }
                  }}
                  className="py-5 bg-amber-50 hover:bg-amber-100 border-2 border-amber-200 rounded-2xl text-5xl active:scale-95 transition shadow-sm cursor-pointer"
                >
                  {opt}
                </button>
              ))}
            </div>

            {wordGameFeedback && (
              <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl font-bold text-xs">
                {wordGameFeedback}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Game 3: Fast Numbers Game */}
      {activeGame === 'numbers_game' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveGame('menu')}
              className="text-xs font-bold text-blue-800 bg-blue-100 px-3 py-1.5 rounded-xl hover:bg-blue-200 transition cursor-pointer"
            >
              ← العودة للألعاب
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-purple-900">لعبة العد السريع</span>
              <SpeakButton text={numberChallenges[numberGameIndex].spoken} size="xs" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border-2 border-blue-300 shadow-md text-center space-y-4">
            <div
              onClick={() => speakText(numberChallenges[numberGameIndex].spoken, 'ar')}
              className="bg-blue-50 rounded-2xl p-4 border border-blue-200 cursor-pointer"
            >
              <p className="text-xs font-bold text-blue-800 mb-3">
                كم عدد هذه الأشكال الجميلة؟ (اضغطي للاستماع 🔊)
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 text-4xl">
                {numberChallenges[numberGameIndex].emojis.map((em, idx) => (
                  <span key={idx}>{em}</span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {numberChallenges[numberGameIndex].options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    if (opt === numberChallenges[numberGameIndex].target) {
                      playSoundEffect.success();
                      setNumberGameFeedback(`صحيح يا جنى! العدد هو ${opt}!`);
                      speakText(`ممتاز يا بطلتي!`, 'ar');
                      onAddStars(3);
                      setTimeout(() => {
                        setNumberGameFeedback(null);
                        setNumberGameIndex((p) => (p + 1) % numberChallenges.length);
                      }, 1600);
                    } else {
                      playSoundEffect.error();
                      setNumberGameFeedback('حاولي العد مرة أخرى يا جنى!');
                      speakText('لا بأس يا بطلتي، جربي مرة ثانية!', 'ar');
                    }
                  }}
                  className="py-4 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-2xl text-3xl font-black text-blue-950 active:scale-95 transition shadow-sm cursor-pointer"
                >
                  {opt}
                </button>
              ))}
            </div>

            {numberGameFeedback && (
              <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl font-bold text-xs">
                {numberGameFeedback}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Game 4: Math Challenge Game */}
      {activeGame === 'math_game' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveGame('menu')}
              className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl hover:bg-emerald-200 transition cursor-pointer"
            >
              ← العودة للألعاب
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-purple-900">مسابقة الجمع والطرح</span>
              <SpeakButton text={mathChallenges[mathGameIndex].spoken} size="xs" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border-2 border-emerald-300 shadow-md text-center space-y-4">
            <div
              onClick={() => speakText(mathChallenges[mathGameIndex].spoken, 'ar')}
              className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 cursor-pointer"
            >
              <p className="text-xs font-bold text-emerald-700 mb-1">اضغطي لسماع المسألة 🔊</p>
              <div dir="ltr" className="text-3xl font-black text-emerald-950">
                {mathChallenges[mathGameIndex].expr}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {mathChallenges[mathGameIndex].options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    if (opt === mathChallenges[mathGameIndex].answer) {
                      playSoundEffect.fanfare();
                      setMathGameFeedback(`عبقرية يا جنى! الإجابة الصحيحة ${opt}!`);
                      speakText('أحسنتِ يا جنى!', 'ar');
                      onAddStars(4);
                      setTimeout(() => {
                        setMathGameFeedback(null);
                        setMathGameIndex((p) => (p + 1) % mathChallenges.length);
                      }, 1600);
                    } else {
                      playSoundEffect.error();
                      setMathGameFeedback('فكري بهدوء يا جنى، أنتِ قادرة على حلها!');
                      speakText('فكري بهدوء يا جنى، أنتِ قادرة على حلها!', 'ar');
                    }
                  }}
                  className="py-4 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-200 rounded-2xl text-2xl font-black text-emerald-950 active:scale-95 transition shadow-sm cursor-pointer"
                >
                  {opt}
                </button>
              ))}
            </div>

            {mathGameFeedback && (
              <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl font-bold text-xs">
                {mathGameFeedback}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Game 5: Memory Match Game */}
      {activeGame === 'memory_game' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveGame('menu')}
              className="text-xs font-bold text-purple-800 bg-purple-100 px-3 py-1.5 rounded-xl hover:bg-purple-200 transition cursor-pointer"
            >
              ← العودة للألعاب
            </button>
            <div className="flex items-center gap-2">
              <SpeakButton text="لعبة مطابقة البطاقات المقلوبة لاختبار الذاكرة والتركيز" size="xs" />
              <button
                onClick={resetMemoryGame}
                className="p-1.5 bg-purple-100 text-purple-800 rounded-full hover:bg-purple-200 cursor-pointer"
                title="إعادة خلط البطاقات"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-4 border-2 border-purple-200 shadow-md text-center">
            <h3 className="text-base font-black text-purple-950 mb-1">
              لعبة مطابقة البطاقات (ذاكرة وتركيز)
            </h3>
            <p className="text-xs text-purple-600 mb-4">
              اقلبي بطاقتين واكتشفي الصور المتشابهة!
            </p>

            <div className="grid grid-cols-4 gap-2.5 max-w-xs mx-auto">
              {memoryCards.map((card, idx) => (
                <button
                  key={card.id}
                  onClick={() => handleCardFlip(idx)}
                  className={`h-20 rounded-2xl flex items-center justify-center text-3xl font-black transition-all transform duration-300 shadow-md border-2 cursor-pointer ${
                    card.flipped || card.matched
                      ? 'bg-gradient-to-tr from-purple-100 to-pink-100 border-purple-400 rotate-0 scale-95'
                      : 'bg-gradient-to-tr from-purple-600 to-indigo-700 border-white text-white hover:scale-105'
                  }`}
                >
                  {card.flipped || card.matched ? card.val : '❓'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Game 6: Riddles Game */}
      {activeGame === 'riddles_game' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveGame('menu')}
              className="text-xs font-bold text-purple-800 bg-purple-100 px-3 py-1.5 rounded-xl hover:bg-purple-200 transition cursor-pointer"
            >
              ← العودة للأقسام
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-purple-900">ألغاز وفوازير ذكية</span>
              <SpeakButton text="ألغاز وفوازير صوتية ذكية" size="xs" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border-2 border-violet-300 shadow-md text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-3xl mb-2">
              🧩
            </div>

            <div
              onClick={() => {
                playSoundEffect.click();
                speakText(riddles[riddleIndex].spokenQ, 'ar');
              }}
              className="relative bg-violet-50/70 p-4 rounded-2xl border border-violet-100 mb-4 cursor-pointer active:scale-98 transition"
            >
              <div className="absolute top-2 left-2">
                <SpeakButton text={riddles[riddleIndex].spokenQ} size="sm" />
              </div>
              <p className="text-base font-bold text-purple-950 leading-relaxed">
                {riddles[riddleIndex].q}
              </p>
            </div>

            <button
              onClick={() => {
                playSoundEffect.click();
                speakText(riddles[riddleIndex].spokenQ, 'ar');
              }}
              className="mb-4 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow cursor-pointer active:scale-95"
            >
              <Volume2 className="w-4 h-4" />
              <span>استمعي للغز بصوت المعلمة 🔊</span>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {riddles[riddleIndex].options.map((opt, i) => (
                <div key={opt} className="relative">
                  <button
                    onClick={() => {
                      if (i === riddles[riddleIndex].correct) {
                        playSoundEffect.fanfare();
                        setRiddleFeedback(`صحيح يا جنى! الإجابة هي: ${riddles[riddleIndex].answer}!`);
                        speakText(`أحسنتِ يا عبقرية خديجة! الإجابة هي ${riddles[riddleIndex].answer}`, 'ar');
                        onAddStars(5);
                        setTimeout(() => {
                          setRiddleFeedback(null);
                          setRiddleIndex((p) => (p + 1) % riddles.length);
                        }, 2000);
                      } else {
                        playSoundEffect.error();
                        setRiddleFeedback('حاولي التفكير مرة أخرى يا جنى!');
                        speakText('حاولي التفكير مرة ثانية يا جنى!', 'ar');
                      }
                    }}
                    className="w-full py-3 px-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-2xl text-sm font-black text-purple-950 active:scale-95 transition shadow-sm cursor-pointer"
                  >
                    {opt}
                  </button>
                  <div className="absolute top-1 left-1">
                    <SpeakButton text={opt} size="xs" variant="ghost" />
                  </div>
                </div>
              ))}
            </div>

            {riddleFeedback && (
              <div className="mt-4 p-2 bg-emerald-100 text-emerald-800 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5">
                <span>{riddleFeedback}</span>
                <SpeakButton text={riddleFeedback} size="xs" variant="ghost" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
