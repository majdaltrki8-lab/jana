import React, { useState } from 'react';
import { VirtualTeacher } from '../VirtualTeacher';
import { SpeakButton } from '../SpeakButton';
import { quizzesData } from '../../utils/curriculumData';
import { playSoundEffect, speakText, triggerConfetti } from '../../utils/audio';
import { Volume2, ChevronLeft, CheckCircle2, XCircle, Trophy, Award, Sparkles, Star } from 'lucide-react';
import { QuizQuestion } from '../../types';

interface QuizzesScreenProps {
  onAddStars: (amount: number) => void;
  onRecordQuizScore: (quizId: string, score: number) => void;
}

export const QuizzesScreen: React.FC<QuizzesScreenProps> = ({
  onAddStars,
  onRecordQuizScore,
}) => {
  const [selectedQuiz, setSelectedQuiz] = useState<(typeof quizzesData)[0] | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleStartQuiz = (quiz: (typeof quizzesData)[0]) => {
    playSoundEffect.click();
    setSelectedQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setQuizFinished(false);
    const lang = quiz.id === 'en_quiz_1' ? 'en' : 'ar';
    if (lang === 'en') {
      speakText(`Starting ${quiz.title}! Good luck, Jana!`, 'en');
    } else {
      speakText(`بدأنا الآن ${quiz.title}! ركزي جيداً يا جنى وبالتوفيق!`, 'ar');
    }
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered || !selectedQuiz) return;

    setSelectedAnswer(idx);
    setIsAnswered(true);
    const q = selectedQuiz.questions[currentQuestionIndex];
    const isEnglish = selectedQuiz.id === 'en_quiz_1';

    if (idx === q.correctIndex) {
      playSoundEffect.success();
      setCorrectCount((c) => c + 1);
      speakText(q.explanation, isEnglish ? 'en' : 'ar');
    } else {
      playSoundEffect.error();
      if (isEnglish) {
        speakText(`Close try, Jana! The correct answer is: ${q.options[q.correctIndex]}`, 'en');
      } else {
        speakText(`إجابة قريبة يا جنى، الإجابة الصحيحة هي: ${q.options[q.correctIndex]}`, 'ar');
      }
    }
  };

  const handleNextQuestion = () => {
    if (!selectedQuiz) return;
    playSoundEffect.click();

    if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex((p) => p + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // Quiz finished!
      setQuizFinished(true);
      const total = selectedQuiz.questions.length;
      const finalScore = Math.round((correctCount / total) * 100);
      onRecordQuizScore(selectedQuiz.id, finalScore);
      onAddStars(correctCount * 5);
      playSoundEffect.fanfare();
      triggerConfetti();
      speakText(
        `مبارك يا جنى! أتممتِ ${selectedQuiz.subject} بنجاح، وحصلتِ على درجة ${finalScore} في المئة! أنتِ فخر مدرسة خديجة للبنات!`,
        'ar'
      );
    }
  };

  return (
    <div className="pb-24 pt-2 px-3 sm:px-4 max-w-lg mx-auto">
      {/* Header Banner matching Screen 11 */}
      <div className="relative bg-gradient-to-r from-amber-500 via-rose-500 to-red-500 rounded-3xl p-3 text-white shadow-lg mb-3 flex items-center justify-between border-2 border-amber-300">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shadow">
            📋
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg font-black tracking-wide text-white drop-shadow">
                الاختبارات التفاعلية
              </h2>
              <SpeakButton
                text="الاختبارات التفاعلية: أسئلة مصورة وصوتية وتصحيح فوري وشهادات تفوق"
                size="xs"
                className="bg-white/30 text-white"
              />
            </div>
            <p className="text-xs text-white/90 font-medium">أسئلة مصورة وصوتية وتصحيح فوري</p>
          </div>
        </div>
        <SpeakButton
          text="أهلاً بكِ في قسم الاختبارات الذكية يا جنى! اختبري معلوماتكِ واحصلي على شهادات التفوق والنجوم الذهبية!"
          size="sm"
          className="bg-white text-rose-600 hover:bg-rose-50"
        />
      </div>

      {/* Main Quizzes List matching Screen 11 */}
      {!selectedQuiz && (
        <>
          <VirtualTeacher
            speechText="أهلاً يا جنى! هذه هي اختبارات المواد المقررة. اختاري أي اختبار لتبدئي بحله مع تصحيح فوري ونجوم تشجيعية!"
            lang="ar"
          />

          <div className="space-y-2.5 mt-3">
            {quizzesData.map((quiz) => (
              <div
                key={quiz.id}
                onClick={() => handleStartQuiz(quiz)}
                className="w-full bg-white hover:bg-rose-50/80 rounded-2xl p-3.5 border-2 border-rose-200/80 shadow-sm flex items-center justify-between transition-all active:scale-98 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-rose-100 flex items-center justify-center text-2xl group-hover:scale-105 transition">
                    {quiz.icon}
                  </div>
                  <div className="text-right">
                    <h3 className="text-sm font-black text-purple-950 group-hover:text-rose-700 transition">
                      {quiz.title}
                    </h3>
                    <p className="text-[11px] text-purple-600 font-medium">
                      {quiz.questions.length} أسئلة • تصحيح فوري
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <SpeakButton text={quiz.title} size="xs" />
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-200">
                    بدء الاختبار
                  </span>
                  <ChevronLeft className="w-5 h-5 text-rose-400 group-hover:text-rose-700 transition transform group-hover:-translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Active Quiz Question View */}
      {selectedQuiz && !quizFinished && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedQuiz(null)}
              className="text-xs font-bold text-rose-700 bg-rose-100 px-3 py-1.5 rounded-xl hover:bg-rose-200 transition cursor-pointer"
            >
              ← إنهاء الاختبار
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-purple-900">
                السؤال {currentQuestionIndex + 1} من {selectedQuiz.questions.length}
              </span>
              <SpeakButton text={`السؤال رقم ${currentQuestionIndex + 1}`} size="xs" />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-purple-100 rounded-full overflow-hidden border border-purple-200">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-rose-500 rounded-full transition-all duration-300"
              style={{
                width: `${
                  ((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100
                }%`,
              }}
            />
          </div>

          {/* Question Card */}
          {(() => {
            const q = selectedQuiz.questions[currentQuestionIndex];
            const isEnglish = selectedQuiz.id === 'en_quiz_1';

            return (
              <div className="bg-white rounded-3xl p-5 border-2 border-rose-200 shadow-md">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full">
                    {selectedQuiz.subject}
                  </span>
                  <SpeakButton
                    text={q.audioPrompt || q.question}
                    lang={isEnglish ? 'en' : 'ar'}
                    size="sm"
                    label="استمعي للسؤال"
                    variant="pill"
                  />
                </div>

                <h3 className="text-base sm:text-lg font-black text-purple-950 text-right leading-relaxed mb-4">
                  {q.question}
                </h3>

                {/* Options Grid */}
                <div className="space-y-2.5">
                  {q.options.map((opt, idx) => {
                    let btnStyle =
                      'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-950';

                    if (isAnswered) {
                      if (idx === q.correctIndex) {
                        btnStyle =
                          'bg-emerald-100 border-emerald-500 text-emerald-950 ring-2 ring-emerald-300';
                      } else if (idx === selectedAnswer) {
                        btnStyle =
                          'bg-rose-100 border-rose-500 text-rose-950 ring-2 ring-rose-300';
                      } else {
                        btnStyle = 'opacity-50 bg-gray-50 border-gray-200 text-gray-500';
                      }
                    }

                    return (
                      <div key={opt} className="relative">
                        <button
                          disabled={isAnswered}
                          onClick={() => handleSelectOption(idx)}
                          className={`w-full p-3.5 rounded-2xl border-2 text-right font-black text-sm flex items-center justify-between transition-all active:scale-98 shadow-sm cursor-pointer ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          <div className="flex items-center gap-2">
                            {isAnswered && idx === q.correctIndex && (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                            )}
                            {isAnswered && idx === selectedAnswer && idx !== q.correctIndex && (
                              <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                            )}
                          </div>
                        </button>
                        <div className="absolute top-3 left-3">
                          <SpeakButton
                            text={opt}
                            lang={isEnglish ? 'en' : 'ar'}
                            size="xs"
                            variant="ghost"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation & Next */}
                {isAnswered && (
                  <div className="mt-4 p-3 bg-purple-50 rounded-2xl border border-purple-200 animate-fadeIn">
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <p className="text-xs font-bold text-purple-900 leading-relaxed">
                        {q.explanation}
                      </p>
                      <SpeakButton text={q.explanation} lang={isEnglish ? 'en' : 'ar'} size="xs" />
                    </div>
                    <button
                      onClick={handleNextQuestion}
                      className="w-full py-3 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-black text-xs rounded-xl shadow active:scale-95 transition cursor-pointer"
                    >
                      {currentQuestionIndex < selectedQuiz.questions.length - 1
                        ? 'السؤال التالي ❯'
                        : 'عرض النتيجة النهائية 🏆'}
                    </button>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Quiz Finished Result & Certificate Card */}
      {selectedQuiz && quizFinished && (
        <div className="bg-white rounded-3xl p-6 border-4 border-amber-300 shadow-xl text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 p-1 flex items-center justify-center shadow-lg animate-bounce">
            <Trophy className="w-12 h-12 text-purple-950" />
          </div>

          <div>
            <span className="text-xs font-black text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
              شهادة تفوق وتقدير
            </span>
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <h3 className="text-xl font-black text-purple-950">
                مبارك يا جنى! أتممتِ {selectedQuiz.subject}!
              </h3>
              <SpeakButton
                text={`مبارك يا جنى! أتممتِ ${selectedQuiz.subject} بنجاح باهر!`}
                size="xs"
              />
            </div>
            <p className="text-xs text-purple-600 mt-1">
              مدرسة خديجة للبنات تفخر بإنجازكِ وتفوقكِ الدائم!
            </p>
          </div>

          {/* Score Badge */}
          <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 p-4 rounded-2xl border-2 border-purple-200">
            <div className="text-4xl font-black text-purple-900 tabular-nums">
              {Math.round((correctCount / selectedQuiz.questions.length) * 100)}%
            </div>
            <p className="text-xs font-bold text-purple-700 mt-1">
              أجبتِ عن {correctCount} من {selectedQuiz.questions.length} إجابات صحيحة!
            </p>
            <div className="flex items-center justify-center gap-1 mt-2 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setSelectedQuiz(null)}
              className="w-full py-3 bg-gradient-to-r from-purple-700 to-indigo-800 text-white font-black text-xs rounded-2xl shadow active:scale-95 transition cursor-pointer"
            >
              العودة لقائمة الاختبارات
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
