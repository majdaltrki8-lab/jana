import React, { useState, useEffect } from 'react';
import { Volume2, RotateCcw, ArrowLeft, Mic, MicOff, Sparkles, CheckCircle2 } from 'lucide-react';
import { speakText, stopSpeaking, playSoundEffect, getRandomPraise } from '../utils/audio';

interface VirtualTeacherProps {
  speechText: string;
  lang?: 'ar' | 'en';
  onNextLesson?: () => void;
  nextLessonLabel?: string;
  compact?: boolean;
  autoPlay?: boolean;
}

export const VirtualTeacher: React.FC<VirtualTeacherProps> = ({
  speechText,
  lang = 'ar',
  onNextLesson,
  nextLessonLabel = 'الدرس التالي',
  compact = false,
  autoPlay = false,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechResult, setSpeechResult] = useState<string | null>(null);
  const [praiseText, setPraiseText] = useState<string | null>(null);

  const handleSpeak = () => {
    setIsSpeaking(true);
    setSpeechResult(null);
    setPraiseText(null);
    playSoundEffect.click();

    speakText(
      speechText,
      lang,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const handleStop = () => {
    stopSpeaking();
    setIsSpeaking(false);
  };

  const handleReplay = () => {
    handleStop();
    setTimeout(handleSpeak, 100);
  };

  // Microphone practice (Web Speech Recognition or audio prompt)
  const handleMicPractice = () => {
    playSoundEffect.click();
    const SpeechRec =
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any })
        .SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any })
        .webkitSpeechRecognition;

    if (!SpeechRec) {
      // Fallback for browsers without speech recognition: interactive encouragement simulation
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        playSoundEffect.success();
        const praise = getRandomPraise();
        setPraiseText(praise);
        speakText(praise, 'ar');
      }, 2500);
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      setIsListening(true);
      setSpeechResult('أنا أستمع إليكِ يا جنى، قولي الكلمة الآن...');

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        setSpeechResult(`سمعتكِ تقولين: «${transcript}»`);
        playSoundEffect.success();
        const praise = lang === 'ar' ? `ممتازة يا جنى! نطقتِ «${transcript}» بشكل جميل جداً!` : `Well done Jana! You said "${transcript}" perfectly!`;
        setPraiseText(praise);
        speakText(praise, lang);
      };

      recognition.onerror = () => {
        setIsListening(false);
        // Friendly fallback praise even if mic was quiet
        playSoundEffect.success();
        const praise = getRandomPraise();
        setPraiseText(praise);
        speakText(praise, 'ar');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  useEffect(() => {
    if (autoPlay) {
      const timer = setTimeout(handleSpeak, 400);
      return () => {
        clearTimeout(timer);
        stopSpeaking();
      };
    }
    return () => {
      stopSpeaking();
    };
  }, [speechText]);

  return (
    <div className={`w-full bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 border-2 border-purple-200 rounded-2xl p-3 sm:p-4 shadow-sm mb-4 transition-all ${compact ? 'py-2.5' : ''}`}>
      <div className="flex items-start gap-3">
        {/* Animated Teacher Avatar */}
        <div className="relative shrink-0 flex flex-col items-center">
          <div
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-purple-400 bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-400 p-0.5 shadow-md flex items-center justify-center overflow-hidden transition-transform ${
              isSpeaking ? 'scale-105 ring-4 ring-pink-300 animate-pulse' : ''
            }`}
          >
            {/* Cute Cartoon Teacher Avatar SVG */}
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-3xl select-none">
              👩‍🏫
            </div>
          </div>
          <span className="text-[10px] font-black text-purple-900 mt-1 bg-purple-200/80 px-2 py-0.5 rounded-full">
            أبلة سارة
          </span>
          {isSpeaking && (
            <div className="flex gap-0.5 mt-1">
              <span className="w-1 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}
        </div>

        {/* Speech Bubble & Content */}
        <div className="flex-1">
          <div className="relative bg-white border border-purple-200 rounded-2xl p-3 shadow-sm text-sm text-purple-950 font-medium leading-relaxed">
            {/* Small triangle arrow on right side for RTL */}
            <div className="absolute top-4 -right-2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-white" />

            <div className="flex items-center justify-between gap-1 mb-1 border-b border-purple-100 pb-1">
              <span className="text-xs font-bold text-purple-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                شرح المعلمة الافتراضية لجنى:
              </span>
              <span className="text-[10px] text-purple-500 font-semibold">
                {lang === 'ar' ? 'العربية' : 'English'}
              </span>
            </div>

            <p className="text-sm font-semibold text-purple-900 leading-relaxed">
              {speechText}
            </p>

            {praiseText && (
              <div className="mt-2 p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-1.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{praiseText}</span>
              </div>
            )}

            {speechResult && !praiseText && (
              <div className="mt-2 p-1.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 font-medium">
                {speechResult}
              </div>
            )}
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center gap-2 mt-2.5">
            {/* Listen / Speak Button */}
            <button
              onClick={isSpeaking ? handleStop : handleSpeak}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 shadow-sm ${
                isSpeaking
                  ? 'bg-rose-500 text-white hover:bg-rose-600 animate-pulse'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isSpeaking ? 'إيقاف الصوت' : 'استمع للشرح'}</span>
            </button>

            {/* Replay Button */}
            <button
              onClick={handleReplay}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-purple-100 text-purple-800 hover:bg-purple-200 transition active:scale-95"
              title="إعادة الشرح"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة</span>
            </button>

            {/* Mic Practice Button */}
            <button
              onClick={handleMicPractice}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm'
              }`}
              title="تكرار وتدريب صوتي"
            >
              {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              <span>{isListening ? 'أنا أستمع...' : 'تدريب بالنطق 🎤'}</span>
            </button>

            {/* Next Lesson Button */}
            {onNextLesson && (
              <button
                onClick={onNextLesson}
                className="mr-auto flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-sm transition active:scale-95"
              >
                <span>{nextLessonLabel}</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
