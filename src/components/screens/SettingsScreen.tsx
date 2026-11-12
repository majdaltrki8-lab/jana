import React, { useState, useEffect } from 'react';
import { AppSettings } from '../../types';
import {
  playSoundEffect,
  speakText,
  speakJanaWelcome,
  speakJanaTestPhrase,
  JANA_SPECIAL_TEST_PHRASE,
  getAudioDiagnostics,
  AudioDiagnostics,
  convertMathToSpokenArabic,
  stopSpeaking,
} from '../../utils/audio';
import {
  Volume2,
  RefreshCw,
  Play,
  CheckCircle2,
  AlertCircle,
  Activity,
  Cpu,
  RotateCcw,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { SouthYemenFlag } from '../SouthYemenFlag';
import { SpeakButton } from '../SpeakButton';
import { AppIcon } from '../AppIcon';
import { InstallAppBanner } from '../InstallAppBanner';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onResetData: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onResetData,
}) => {
  const [diagnostics, setDiagnostics] = useState<AudioDiagnostics>(getAudioDiagnostics());
  const [testingItem, setTestingItem] = useState<string | null>(null);
  const [showAllVoices, setShowAllVoices] = useState(false);

  const refreshVoices = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
    setDiagnostics(getAudioDiagnostics());
  };

  useEffect(() => {
    refreshVoices();

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = refreshVoices;
      // Also poll a few times because Windows Chrome loads SAPI5 voices asynchronously
      const timer1 = setTimeout(refreshVoices, 300);
      const timer2 = setTimeout(refreshVoices, 1000);
      const timer3 = setTimeout(refreshVoices, 2500);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, []);

  const handleToggleSound = () => {
    playSoundEffect.click();
    onUpdateSettings({ ...settings, soundEffects: !settings.soundEffects });
  };

  const handleChangeSpeed = (rate: number) => {
    playSoundEffect.click();
    const updated = { ...settings, speechRate: rate };
    onUpdateSettings(updated);
    speakText('هذه هي سرعة صوت المعلمة الافتراضية يا جنى!', 'ar');
  };

  const runTest = (key: string, fn: () => void) => {
    stopSpeaking();
    playSoundEffect.click();
    setTestingItem(key);
    fn();
    setTimeout(() => {
      refreshVoices();
    }, 400);
  };

  return (
    <div className="pb-24 pt-2 px-3 sm:px-4 max-w-lg mx-auto space-y-3 select-none">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-800 to-indigo-900 rounded-3xl p-3 text-white shadow-lg mb-3 flex items-center justify-between border-2 border-amber-300">
        <div className="flex items-center gap-2">
          <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow">
            ⚙️
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg font-black text-amber-200">الإعدادات والخيارات</h2>
              <SpeakButton
                text="إعدادات الصوت وخيارات المعلمة الافتراضية وفحص الصوت"
                size="xs"
                className="bg-white/30 text-white"
              />
            </div>
            <p className="text-xs text-white/90 font-medium">ضبط الصوت وسرعة القراءة والمعلمة</p>
          </div>
        </div>
      </div>

      {/* Voice Speed Controls with Slow Speed Option */}
      <div className="bg-white rounded-3xl p-4 border-2 border-purple-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-black text-purple-950">
              سرعة نطق وقراءة المعلمة الافتراضية:
            </h3>
            <SpeakButton
              text="التحكم في سرعة قراءة المعلمة: بطيء جداً، بطيء مناسب للأطفال، أو عادي"
              size="xs"
            />
          </div>
          <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
            {settings.speechRate <= 0.75
              ? 'بطيء جداً (0.75)'
              : settings.speechRate <= 0.85
              ? 'مناسب للصف الأول (0.85)'
              : 'طبيعي (1.0)'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'بطيء جداً', rate: 0.75 },
            { label: 'هادئ ومناسب (٠.٨٥)', rate: 0.85 },
            { label: 'عادي (١.٠)', rate: 1.0 },
          ].map((item) => (
            <button
              key={item.rate}
              type="button"
              onClick={() => handleChangeSpeed(item.rate)}
              className={`py-2 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer ${
                settings.speechRate === item.rate
                  ? 'bg-purple-600 text-white shadow ring-2 ring-purple-900'
                  : 'bg-purple-50 text-purple-900 hover:bg-purple-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sound Effects Toggle */}
      <div className="bg-white rounded-3xl p-4 border-2 border-purple-200 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm font-black text-purple-950">المؤثرات الصوتية وأصوات النجوم</h4>
            <SpeakButton text="تشغيل أو إيقاف المؤثرات الصوتية ونغمات النجوم والتصفيق" size="xs" />
          </div>
          <p className="text-xs text-purple-600">تشغيل نغمات التشجيع والفانفار والتصفيق</p>
        </div>
        <button
          type="button"
          onClick={handleToggleSound}
          className={`w-12 h-7 rounded-full transition-colors relative p-1 cursor-pointer ${
            settings.soundEffects ? 'bg-emerald-500' : 'bg-gray-300'
          }`}
          aria-label="تبديل المؤثرات الصوتية"
        >
          <div
            className={`w-5 h-5 rounded-full bg-white transition-transform ${
              settings.soundEffects ? 'translate-x-0' : '-translate-x-5'
            }`}
          />
        </button>
      </div>

      {/* Dedicated Section: "فحص الصوت وفحص الأصوات المتاحة" */}
      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl p-4 border-2 border-indigo-200 shadow-md space-y-3">
        <div className="flex items-center justify-between border-b border-indigo-200 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-indigo-950">
                صفحة فحص الصوت واختبار النطق
              </h3>
              <p className="text-[10px] text-indigo-700 font-medium">
                فحص أصوات Windows والمتصفح (speechSynthesis.getVoices())
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              refreshVoices();
              playSoundEffect.click();
            }}
            className="p-1.5 bg-white text-indigo-700 hover:bg-indigo-100 rounded-xl border border-indigo-200 shadow-sm transition active:scale-95 cursor-pointer flex items-center gap-1 text-[11px] font-bold"
            title="إعادة فحص الأصوات الآن"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة الفحص</span>
          </button>
        </div>

        {/* Status Alert: Has Arabic Voice or Needs Browser Restart */}
        {diagnostics.hasArabicVoice ? (
          <div className="p-3 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-center justify-between gap-2 shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-black text-emerald-950">
                  {diagnostics.isSaudiVoice
                    ? '🇸🇦 تم تفعيل حزمة الصوت العربية (السعودية ar-SA) بنجاح!'
                    : '✅ تم اكتشاف واختيار الصوت العربي بنجاح!'}
                </p>
                <p className="text-[10px] text-emerald-700 font-bold mt-0.5">
                  الصوت النشط: {diagnostics.selectedArabicVoice || 'الصوت العربي المتاح'}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full shrink-0">
              نشط ومحدد
            </span>
          </div>
        ) : (
          <div className="p-3.5 bg-amber-50 border-2 border-amber-300 rounded-2xl space-y-2 text-xs shadow-sm">
            <div className="flex items-center gap-2 text-amber-900 font-black">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>تنبيه: لم يتعرف متصفح Chrome على حزمة الصوت العربي بعد</span>
            </div>
            <p className="text-amber-800 text-[11px] leading-relaxed">
              إذا قمت بتثبيت حزمة الصوت العربي في إعدادات Windows مؤخرًا، إليك الخطوات المؤكدة لتفعيلها:
            </p>
            <ul className="text-[11px] text-amber-950 space-y-1 list-disc list-inside bg-white/70 p-2.5 rounded-xl border border-amber-200">
              <li>
                <strong>إغلاق متصفح Chrome وإعادة فتحه بالكامل:</strong> متصفح Chrome لا يقرأ حزم SAPI5 الجديدة إلا بعد إعادة تشغيل المتصفح.
              </li>
              <li>
                <strong>التجربة في متصفح Microsoft Edge:</strong> متصفح Edge مدمج بنظام Windows ويتعرف فورًا على أصوات (Microsoft Naayf و Hoda).
              </li>
              <li>
                <strong>البديل الصوتي الحقيقي:</strong> تلاوات القرآن الكريم العذبة للشيخ مشاري العفاسي تعمل بملفات صوتية حقيقية مستقلة، والصوت الإنجليزي يعمل بنطق صحيح.
              </li>
            </ul>
          </div>
        )}

        {/* Special Test Button explicitly requested by user */}
        <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-100 p-3.5 rounded-2xl border-2 border-amber-300 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-black text-amber-950">
                  اختبار النطق الخاص بجنى:
                </span>
                <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                  موصى به
                </span>
              </div>
              <p className="text-xs font-bold text-purple-950 bg-white/80 p-2 rounded-xl border border-amber-200">
                «{JANA_SPECIAL_TEST_PHRASE}»
              </p>
            </div>
            <button
              type="button"
              onClick={() => runTest('jana_special', () => speakJanaTestPhrase())}
              className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow shrink-0 ${
                testingItem === 'jana_special'
                  ? 'bg-amber-400 text-purple-950 animate-pulse ring-2 ring-purple-900'
                  : 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-purple-950'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>استمع للنص 🔊</span>
            </button>
          </div>
        </div>

        {/* Diagnostic Audio Tests */}
        <div className="space-y-2 pt-1">
          {/* 1. اختبار النطق العربي */}
          <div className="bg-white p-3 rounded-2xl border border-indigo-100 flex items-center justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-purple-950">١. اختبار النطق العربي (ar-SA)</span>
                <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold">
                  صوت المعلمة
                </span>
              </div>
              <p className="text-[11px] text-purple-600 mt-0.5">
                «مرحباً بكِ يا جنى، أنا معلمتكِ الافتراضية في مدرسة خديجة للبنات!»
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                runTest('ar', () =>
                  speakText('مرحباً بكِ يا جنى، أنا معلمتكِ الافتراضية في مدرسة خديجة للبنات!', 'ar')
                )
              }
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-sm ${
                testingItem === 'ar'
                  ? 'bg-amber-400 text-purple-950 animate-pulse ring-2 ring-amber-300'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>تشغيل</span>
            </button>
          </div>

          {/* 2. اختبار النطق الإنجليزي */}
          <div className="bg-white p-3 rounded-2xl border border-indigo-100 flex items-center justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-blue-950">٢. اختبار النطق الإنجليزي (en-US)</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">
                  English
                </span>
              </div>
              <p className="text-[11px] text-blue-600 mt-0.5">
                "Hello Jana! Welcome to your English lesson!"
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                runTest('en', () =>
                  speakText('Hello Jana! Welcome to your English class at Khadija School!', 'en')
                )
              }
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-sm ${
                testingItem === 'en'
                  ? 'bg-amber-400 text-purple-950 animate-pulse ring-2 ring-amber-300'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>تشغيل</span>
            </button>
          </div>

          {/* 3. اختبار نطق الرياضيات بالعربية */}
          <div className="bg-white p-3 rounded-2xl border border-indigo-100 flex items-center justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-amber-950">
                  ٣. اختبار نطق الرياضيات بالعربية
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                  تحويل لفظي
                </span>
              </div>
              <p className="text-[11px] text-amber-700 mt-0.5 font-medium">
                «اثنان زائد ثلاثة يساوي خمسة، وسبعة أكبر من أربعة»
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                runTest('math', () =>
                  speakText(
                    convertMathToSpokenArabic('2 + 3 = 5 و 7 > 4 و 5 - 2 = 3'),
                    'ar'
                  )
                )
              }
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-sm ${
                testingItem === 'math'
                  ? 'bg-amber-400 text-purple-950 animate-pulse ring-2 ring-amber-300'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>تشغيل</span>
            </button>
          </div>

          {/* 4. اختبار صوت الترحيب الرسمي بجنى */}
          <div className="bg-white p-3 rounded-2xl border border-indigo-100 flex items-center justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-rose-950">
                  ٤. اختبار صوت الترحيب الرسمي
                </span>
                <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold">
                  الترحيب الكامل
                </span>
              </div>
              <p className="text-[11px] text-rose-700 mt-0.5 font-medium truncate max-w-[200px] sm:max-w-xs">
                «أهلًا يا جَنَى الجميلة! أنتِ ذكية ومجتهدة...»
              </p>
            </div>
            <button
              type="button"
              onClick={() => runTest('welcome', () => speakJanaWelcome())}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-sm ${
                testingItem === 'welcome'
                  ? 'bg-amber-400 text-purple-950 animate-pulse ring-2 ring-amber-300'
                  : 'bg-rose-600 hover:bg-rose-700 text-white'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>تشغيل</span>
            </button>
          </div>
        </div>

        {/* System Voices Status & Engine Information */}
        <div className="bg-white/90 p-3.5 rounded-2xl border border-indigo-100 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-indigo-950 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-600" />
              <span>حالة محرك الصوت:</span>
            </span>
            <span
              className={`px-2 py-0.5 rounded-full font-bold text-[11px] flex items-center gap-1 ${
                diagnostics.supported
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {diagnostics.supported ? (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  <span>مدعوم وجاهز</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3" />
                  <span>غير مدعوم</span>
                </>
              )}
            </span>
          </div>

          <div className="flex items-center justify-between text-indigo-900">
            <span>إجمالي الأصوات المكتشفة بالجهاز:</span>
            <span className="font-bold tabular-nums bg-indigo-50 px-2 py-0.5 rounded-md">
              {diagnostics.totalVoices} أصوات
            </span>
          </div>

          <div className="flex items-center justify-between text-indigo-900">
            <span>الصوت العربي المختار للدروس:</span>
            <span className="font-bold bg-purple-50 px-2 py-0.5 rounded-md text-purple-900 truncate max-w-[200px]">
              {diagnostics.selectedArabicVoice || (diagnostics.arabicVoices.length > 0 ? diagnostics.arabicVoices[0] : 'صوت النظام العربي الافتراضي')}
            </span>
          </div>

          <div className="flex items-center justify-between text-indigo-900">
            <span>الصوت الإنجليزي المختار:</span>
            <span className="font-bold bg-blue-50 px-2 py-0.5 rounded-md text-blue-900 truncate max-w-[200px]">
              {diagnostics.selectedEnglishVoice || (diagnostics.englishVoices.length > 0 ? diagnostics.englishVoices[0] : 'صوت النظام الإنجليزي')}
            </span>
          </div>

          {/* Collapsible Full Detected Voices List */}
          <div className="pt-1 border-t border-indigo-100">
            <button
              type="button"
              onClick={() => setShowAllVoices((prev) => !prev)}
              className="w-full flex items-center justify-between text-[11px] font-bold text-indigo-700 hover:text-indigo-900 py-1 cursor-pointer"
            >
              <span>قائمة جميع الأصوات المكتشفة في المتصفح ({diagnostics.totalVoices})</span>
              {showAllVoices ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showAllVoices && (
              <div className="mt-1.5 p-2 bg-indigo-50/70 rounded-xl border border-indigo-100 max-h-40 overflow-y-auto space-y-1">
                {diagnostics.allVoices.length > 0 ? (
                  diagnostics.allVoices.map((v, i) => (
                    <div
                      key={i}
                      className="text-[10px] bg-white p-1.5 rounded-lg border border-indigo-100 flex items-center justify-between gap-1"
                    >
                      <span className="font-bold text-indigo-950 truncate">{v.name}</span>
                      <span className="bg-indigo-100 text-indigo-900 px-1.5 py-0.2 rounded font-mono shrink-0">
                        {v.lang}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-indigo-600 text-center py-2">
                    جاري تحميل قائمة أصوات المتصفح، اضغطي على زر "إعادة الفحص" أعلاه...
                  </p>
                )}
              </div>
            )}
          </div>

          {diagnostics.lastError && (
            <div className="p-2 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-[11px] flex items-center gap-1.5 mt-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>تنبيه: {diagnostics.lastError}</span>
            </div>
          )}
        </div>
      </div>

      {/* Official App Icon & Android Installation Card */}
      <div className="bg-gradient-to-br from-purple-900 via-indigo-950 to-purple-900 rounded-3xl p-5 border-2 border-amber-400 shadow-xl text-center space-y-3 text-white">
        <div className="flex flex-col items-center justify-center">
          <AppIcon
            size="xl"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl shadow-2xl ring-4 ring-amber-300 transform hover:scale-105 transition duration-300"
          />
          <div className="flex items-center gap-1.5 mt-3">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <h4 className="text-base font-black text-amber-300">
              الأيقونة الرسمية لتطبيق جنى التعليمي
            </h4>
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <p className="text-xs text-purple-200 mt-1 max-w-xs">
            الأيقونة المعتمدة والمحفوظة لبرنامج وتثبيت الأندرويد بشاشة الهاتف
          </p>
        </div>

        <InstallAppBanner />
      </div>

      {/* School & Identity Card */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-4 border border-purple-200 shadow-sm text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <SouthYemenFlag className="w-7 h-4" />
          <h4 className="text-sm font-black text-purple-950">مدرسة خديجة للبنات</h4>
          <SpeakButton
            text="مدرسة خديجة للبنات بالجنوب العربي، تطبيق الطالبة جنى للصف الأول الابتدائي"
            size="xs"
          />
        </div>
        <p className="text-xs font-bold text-purple-700">
          تطبيق جنى التعليمي • الصف الأول الابتدائي • المنهج اليمني
        </p>
        <p className="text-[11px] text-purple-500 leading-relaxed">
          تطبيق تعليمي مخصص بالكامل للطالبة المتفوقة جنى، مع القراءة الصوتية لجميع النصوص وتلاوات
          القرآن الكريم والدخول المباشر.
        </p>
      </div>

      {/* Reset Progress Action */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => {
            if (window.confirm('هل ترغبين في إعادة تصفير نجوم التدريب؟')) {
              onResetData();
            }
          }}
          className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-2xl text-xs font-bold border border-rose-200 flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>إعادة ضبط التقدم التدريبي</span>
        </button>
      </div>
    </div>
  );
};
