import React, { useState } from 'react';
import { VirtualTeacher } from '../VirtualTeacher';
import { SpeakButton } from '../SpeakButton';
import {
  englishAlphabetData,
  englishCategories,
  englishStories,
} from '../../utils/curriculumData';
import { playSoundEffect, speakText } from '../../utils/audio';
import { Volume2, Mic, Headphones, BookOpen, Award, CheckCircle2 } from 'lucide-react';

interface EnglishScreenProps {
  onAddStars: (amount: number) => void;
  onCompleteLesson: (lessonId: string) => void;
}

type TabType = 'menu' | 'letters' | 'words' | 'listening' | 'speaking' | 'reading' | 'practice';

export const EnglishScreen: React.FC<EnglishScreenProps> = ({ onAddStars, onCompleteLesson }) => {
  const [activeTab, setActiveTab] = useState<TabType>('menu');
  const [selectedLetter, setSelectedLetter] = useState(englishAlphabetData[0]);
  const [selectedCategory, setSelectedCategory] = useState(englishCategories[0]);
  const [speakingWord, setSpeakingWord] = useState('Apple');
  const [listeningIndex, setListeningIndex] = useState(0);
  const [listeningFeedback, setListeningFeedback] = useState<string | null>(null);

  const listeningQuestions = [
    { targetWord: 'Apple', options: ['Apple', 'Cat', 'Ball'], correct: 'Apple', emoji: '🍎' },
    { targetWord: 'Cat', options: ['Dog', 'Cat', 'Fish'], correct: 'Cat', emoji: '🐱' },
    { targetWord: 'Red', options: ['Blue', 'Red', 'Yellow'], correct: 'Red', emoji: '🔴' },
    { targetWord: 'Five', options: ['Three', 'Four', 'Five'], correct: 'Five', emoji: '5️⃣' },
  ];

  const handleLetterClick = (item: (typeof englishAlphabetData)[0]) => {
    setSelectedLetter(item);
    playSoundEffect.click();
    speakText(`${item.upper}. ${item.word}.`, 'en');
  };

  const englishCards = [
    {
      id: 'letters' as TabType,
      title: 'الحروف (A - Z)',
      subtitle: 'Alphabet Sounds',
      spoken: 'English Alphabet letters from A to Z',
      iconEmoji: '🔤',
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      id: 'words' as TabType,
      title: 'الكلمات Words',
      subtitle: 'Colors, Numbers, Animals',
      spoken: 'English vocabulary words: Colors, Numbers, Animals, and School',
      iconEmoji: '🍎',
      gradient: 'from-rose-500 to-pink-600',
    },
    {
      id: 'listening' as TabType,
      title: 'الاستماع Listening',
      subtitle: 'Hear & Choose',
      spoken: 'Listening challenge: Hear the English word and choose the answer',
      iconEmoji: '🎧',
      gradient: 'from-amber-400 to-orange-500',
    },
    {
      id: 'speaking' as TabType,
      title: 'التحدث Speaking',
      subtitle: 'Repeat & Pronounce',
      spoken: 'Speaking practice: Repeat and pronounce English words aloud',
      iconEmoji: '🎤',
      gradient: 'from-purple-500 to-fuchsia-600',
    },
    {
      id: 'reading' as TabType,
      title: 'القراءة Reading',
      subtitle: 'Short Stories',
      spoken: 'Reading short English stories for first grade',
      iconEmoji: '📖',
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'practice' as TabType,
      title: 'تدريبات Practice',
      subtitle: 'Quizzes & Stars',
      spoken: 'English practice exercises and star rewards',
      iconEmoji: '📝',
      gradient: 'from-cyan-500 to-blue-600',
    },
  ];

  return (
    <div className="pb-24 pt-2 px-3 sm:px-4 max-w-lg mx-auto">
      {/* Subject Header Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-3 text-white shadow-lg mb-3 flex items-center justify-between border-2 border-amber-300">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shadow">
            🇬🇧
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg font-black tracking-wide text-amber-200 drop-shadow">
                اللغة الإنجليزية
              </h2>
              <SpeakButton
                text="Welcome Jana to English class! Letters, Words, and Speaking!"
                lang="en"
                size="xs"
                className="bg-white/30 text-white"
              />
            </div>
            <p className="text-xs text-white/90 font-medium">English for 1st Grade • Jana</p>
          </div>
        </div>
        <SpeakButton
          text="Welcome Jana! Let us learn English letters and exciting words together!"
          lang="en"
          size="sm"
          className="bg-amber-400 text-purple-950 hover:bg-amber-300"
        />
      </div>

      {/* Main 6 Cards View */}
      {activeTab === 'menu' && (
        <>
          <VirtualTeacher
            speechText="Welcome Jana! Are you ready to practice English? Choose Alphabet, Words, Listening, or Speaking to earn stars!"
            lang="en"
          />

          <div className="grid grid-cols-2 gap-3 mt-2">
            {englishCards.map((card) => (
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
                    lang="en"
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

      {/* 1. الحروف A-Z */}
      {activeTab === 'letters' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTab('menu')}
              className="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1.5 rounded-xl hover:bg-blue-200 transition cursor-pointer"
            >
              ← العودة للأقسام
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-purple-900">
                Alphabet (A to Z)
              </span>
              <SpeakButton text="English Alphabet from A to Z" lang="en" size="xs" />
            </div>
          </div>

          <VirtualTeacher
            speechText={`Letter ${selectedLetter.upper}. ${selectedLetter.upper} is for ${selectedLetter.word}! Listen and repeat after me, Jana!`}
            lang="en"
          />

          {/* Letter Showcase Card */}
          <div
            onClick={() => {
              playSoundEffect.click();
              speakText(`${selectedLetter.upper}. ${selectedLetter.word}.`, 'en');
            }}
            className="bg-gradient-to-b from-blue-50 to-indigo-50 rounded-3xl p-4 border-2 border-blue-200 text-center shadow-md relative cursor-pointer"
          >
            <div className="absolute top-3 left-3">
              <SpeakButton
                text={`Letter ${selectedLetter.upper}. ${selectedLetter.upper} is for ${selectedLetter.word}.`}
                lang="en"
                size="sm"
                className="bg-blue-200 text-blue-900"
              />
            </div>
            <div className="flex items-center justify-center gap-4">
              <span className="text-6xl font-black text-blue-900 drop-shadow">
                {selectedLetter.upper} {selectedLetter.lower}
              </span>
              <div className="text-6xl">{selectedLetter.emoji}</div>
            </div>
            <div className="mt-2 text-2xl font-black text-blue-950 flex items-center justify-center gap-2">
              <span>{selectedLetter.word}</span>
              <SpeakButton text={selectedLetter.word} lang="en" size="xs" />
            </div>
            <p className="text-xs text-blue-600 font-bold mt-0.5">
              Phonics: {selectedLetter.phonetic}
            </p>

            <button
              onClick={() => {
                playSoundEffect.star();
                speakText(`${selectedLetter.upper}. ${selectedLetter.word}.`, 'en');
                onAddStars(2);
              }}
              className="mt-3 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow flex items-center gap-2 mx-auto active:scale-95 transition cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Pronounce: {selectedLetter.upper} for {selectedLetter.word} 🔊</span>
            </button>
          </div>

          {/* Alphabet Grid */}
          <div className="grid grid-cols-6 sm:grid-cols-7 gap-1.5 bg-white p-3 rounded-2xl border border-blue-200 shadow-sm">
            {englishAlphabetData.map((item) => (
              <button
                key={item.upper}
                onClick={() => handleLetterClick(item)}
                className={`h-11 rounded-xl text-base font-black transition-all flex items-center justify-center cursor-pointer ${
                  selectedLetter.upper === item.upper
                    ? 'bg-blue-600 text-white shadow-md scale-105 ring-2 ring-amber-300'
                    : 'bg-blue-50 text-blue-900 hover:bg-blue-100'
                }`}
                title={`Letter ${item.upper}`}
              >
                {item.upper}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. الكلمات Words */}
      {activeTab === 'words' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTab('menu')}
              className="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1.5 rounded-xl hover:bg-blue-200 transition cursor-pointer"
            >
              ← العودة للأقسام
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-purple-900">Vocabulary Words</span>
              <SpeakButton text="Vocabulary words for first grade" lang="en" size="xs" />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {englishCategories.map((cat) => (
              <button
                key={cat.category}
                onClick={() => {
                  setSelectedCategory(cat);
                  playSoundEffect.click();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory.category === cat.category
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'bg-purple-100 text-purple-900 hover:bg-purple-200'
                }`}
              >
                {cat.category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {selectedCategory.items.map((item: any) => (
              <div
                key={item.word}
                onClick={() => {
                  playSoundEffect.click();
                  speakText(item.word, 'en');
                }}
                className="bg-white rounded-2xl p-3 border border-pink-200 shadow-sm flex flex-col items-center text-center hover:bg-pink-50/50 active:scale-95 transition cursor-pointer relative"
              >
                <div className="absolute top-2 left-2">
                  <SpeakButton text={item.word} lang="en" size="xs" />
                </div>
                <div className="text-4xl mb-1">{item.emoji}</div>
                <h4 className="text-base font-black text-purple-950">{item.word}</h4>
                <p className="text-xs font-bold text-pink-600">{item.translation}</p>
                <span className="text-[10px] text-purple-400 mt-1 flex items-center gap-1">
                  <Volume2 className="w-3 h-3" /> اضغطي للاستماع
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. الاستماع Listening */}
      {activeTab === 'listening' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTab('menu')}
              className="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1.5 rounded-xl hover:bg-blue-200 transition cursor-pointer"
            >
              ← العودة للأقسام
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-purple-900">Listening Challenge</span>
              <SpeakButton text="Listening challenge: Listen carefully and choose the correct answer" lang="en" size="xs" />
            </div>
          </div>

          <VirtualTeacher
            speechText={`Listen carefully to the English word, and choose the correct answer, Jana!`}
            lang="en"
          />

          <div className="bg-white rounded-3xl p-5 border-2 border-amber-200 shadow-md text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-3xl mb-3 shadow-inner">
              🎧
            </div>
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <h3 className="text-base font-black text-purple-900">
                Listen and choose the word you hear:
              </h3>
              <SpeakButton text={listeningQuestions[listeningIndex].targetWord} lang="en" size="xs" />
            </div>

            <button
              onClick={() => {
                playSoundEffect.click();
                speakText(listeningQuestions[listeningIndex].targetWord, 'en');
              }}
              className="mt-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold text-xs shadow flex items-center gap-2 mx-auto active:scale-95 transition cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Click to Listen 🔊</span>
            </button>

            {/* Options */}
            <div className="grid grid-cols-3 gap-2.5 mt-6">
              {listeningQuestions[listeningIndex].options.map((opt) => (
                <div key={opt} className="relative">
                  <button
                    onClick={() => {
                      if (opt === listeningQuestions[listeningIndex].correct) {
                        playSoundEffect.success();
                        setListeningFeedback('Great job, Jana! That is correct!');
                        speakText('Great job, Jana! Correct!', 'en');
                        onAddStars(3);
                        setTimeout(() => {
                          setListeningFeedback(null);
                          setListeningIndex((prev) => (prev + 1) % listeningQuestions.length);
                        }, 1800);
                      } else {
                        playSoundEffect.error();
                        setListeningFeedback('Try again, Jana!');
                        speakText('Try again, Jana!', 'en');
                      }
                    }}
                    className="w-full py-3 bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 rounded-2xl text-base font-black text-purple-950 active:scale-95 transition shadow-sm cursor-pointer"
                  >
                    {opt}
                  </button>
                  <div className="absolute top-1 left-1">
                    <SpeakButton text={opt} lang="en" size="xs" variant="ghost" />
                  </div>
                </div>
              ))}
            </div>

            {listeningFeedback && (
              <div className="mt-4 p-2 bg-emerald-100 text-emerald-800 rounded-xl font-bold text-xs">
                {listeningFeedback}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. التحدث Speaking */}
      {activeTab === 'speaking' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTab('menu')}
              className="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1.5 rounded-xl hover:bg-blue-200 transition cursor-pointer"
            >
              ← العودة للأقسام
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-purple-900">Speaking & Pronunciation</span>
              <SpeakButton text="Speaking and English pronunciation training" lang="en" size="xs" />
            </div>
          </div>

          <VirtualTeacher
            speechText={`Practice saying: "${speakingWord}". Press the microphone and speak aloud, Jana!`}
            lang="en"
          />

          <div className="bg-white rounded-3xl p-5 border-2 border-purple-200 shadow-md text-center">
            <div className="text-5xl mb-2">🎤</div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <h3 className="text-2xl font-black text-purple-950">{speakingWord}</h3>
              <SpeakButton text={speakingWord} lang="en" size="sm" />
            </div>
            <p className="text-xs text-purple-600 font-bold mb-4">
              كلمة التدريب: {speakingWord}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
              {['Apple', 'Cat', 'School', 'Teacher', 'Book', 'Happy'].map((w) => (
                <button
                  key={w}
                  onClick={() => {
                    setSpeakingWord(w);
                    playSoundEffect.click();
                    speakText(w, 'en');
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                    speakingWord === w
                      ? 'bg-purple-600 text-white shadow'
                      : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                playSoundEffect.star();
                speakText(speakingWord, 'en');
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-bold text-xs shadow flex items-center gap-2 mx-auto active:scale-95 transition cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>استمعي للنطق الصحيح بالإنجليزية 🔊</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. القراءة Reading */}
      {activeTab === 'reading' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTab('menu')}
              className="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1.5 rounded-xl hover:bg-blue-200 transition cursor-pointer"
            >
              ← العودة للأقسام
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-purple-900">English Stories</span>
              <SpeakButton text="Short English stories for Jana" lang="en" size="xs" />
            </div>
          </div>

          {englishStories.map((story) => (
            <div
              key={story.title}
              className="bg-white rounded-3xl p-5 border-2 border-emerald-200 shadow-md"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <h3 className="text-lg font-black text-emerald-700 text-center">
                  {story.title}
                </h3>
                <SpeakButton text={story.title} lang="en" size="xs" />
              </div>

              <div
                onClick={() => {
                  playSoundEffect.click();
                  speakText(story.text, 'en');
                }}
                className="relative bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 cursor-pointer"
              >
                <div className="absolute top-2 left-2">
                  <SpeakButton text={story.text} lang="en" size="sm" />
                </div>
                <p className="text-base font-bold text-purple-950 text-center leading-relaxed">
                  {story.text}
                </p>
              </div>

              <div className="flex items-center justify-center gap-1.5 mt-2">
                <p className="text-xs text-purple-600 text-center font-medium">
                  {story.translation}
                </p>
                <SpeakButton text={story.translation} lang="ar" size="xs" />
              </div>

              <button
                onClick={() => {
                  playSoundEffect.star();
                  speakText(story.text, 'en');
                  onAddStars(5);
                }}
                className="mt-4 px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl text-xs font-bold shadow flex items-center gap-2 mx-auto active:scale-95 transition cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Listen to Story (قراءة القصة بالإنجليزية) 🔊</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 6. تدريبات Practice */}
      {activeTab === 'practice' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTab('menu')}
              className="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1.5 rounded-xl hover:bg-blue-200 transition cursor-pointer"
            >
              ← العودة للأقسام
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-purple-900">Practice & Stars</span>
              <SpeakButton text="English practice and star rewards" lang="en" size="xs" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border-2 border-blue-200 shadow-md text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl mb-2">
              ⭐
            </div>
            <h3 className="text-base font-black text-purple-900">
              English Star Student Award
            </h3>
            <p className="text-xs text-purple-600 mt-1 max-w-xs mx-auto">
              Well done Jana! You completed your English practice with great pronunciation!
            </p>

            <button
              onClick={() => {
                playSoundEffect.fanfare();
                onAddStars(10);
                onCompleteLesson('en_alphabet_az');
                speakText('Congratulations Jana! You earned 10 stars in English!', 'en');
              }}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs rounded-2xl shadow-lg active:scale-95 transition cursor-pointer"
            >
              Collect 10 Stars ⭐
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
