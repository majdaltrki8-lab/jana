import confetti from 'canvas-confetti';
import { loadSettings } from './storage';

// Audio Context Singleton for sound effects
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const playSoundEffect = {
  click: () => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // ignore
    }
  },

  success: () => {
    try {
      const ctx = getAudioContext();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = ctx.currentTime + idx * 0.09;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.25);
      });
    } catch {
      // ignore
    }
  },

  star: () => {
    try {
      const ctx = getAudioContext();
      const notes = [784, 880, 988, 1175];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = ctx.currentTime + idx * 0.06;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.3);
      });
    } catch {
      // ignore
    }
  },

  pop: () => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // ignore
    }
  },

  error: () => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(250, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {
      // ignore
    }
  },

  fanfare: () => {
    try {
      const ctx = getAudioContext();
      const chords = [
        { freq: 523.25, time: 0 },
        { freq: 659.25, time: 0.1 },
        { freq: 783.99, time: 0.2 },
        { freq: 1046.5, time: 0.35 },
      ];
      chords.forEach(({ freq, time }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + time);
        gain.gain.setValueAtTime(0.25, ctx.currentTime + time);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + time);
        osc.stop(ctx.currentTime + time + 0.5);
      });
      triggerConfetti();
    } catch {
      // ignore
    }
  },
};

export function triggerConfetti() {
  try {
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'],
    });
  } catch {
    // ignore
  }
}

// Global speech state tracking
let currentActiveText: string | null = null;
let speechListeners: Array<(text: string | null) => void> = [];
let activeUtterance: SpeechSynthesisUtterance | null = null; // Prevent Chrome garbage collection
let lastErrorMsg: string | null = null;

export function subscribeSpeechState(listener: (text: string | null) => void) {
  speechListeners.push(listener);
  return () => {
    speechListeners = speechListeners.filter((l) => l !== listener);
  };
}

function notifySpeechState(text: string | null) {
  currentActiveText = text;
  speechListeners.forEach((fn) => fn(text));
}

export function getCurrentSpokenText(): string | null {
  return currentActiveText;
}

// --- Arabic Math & Number Conversion Rules ---
const arabicOnes: Record<number, string> = {
  0: 'صفر',
  1: 'واحد',
  2: 'اثنان',
  3: 'ثلاثة',
  4: 'أربعة',
  5: 'خمسة',
  6: 'ستة',
  7: 'سبعة',
  8: 'ثمانية',
  9: 'تسعة',
  10: 'عشرة',
  11: 'أحد عشر',
  12: 'اثنا عشر',
  13: 'ثلاثة عشر',
  14: 'أربعة عشر',
  15: 'خمسة عشر',
  16: 'ستة عشر',
  17: 'سبعة عشر',
  18: 'ثمانية عشر',
  19: 'تسعة عشر',
  20: 'عشرون',
};

const arabicTens: Record<number, string> = {
  2: 'عشرون',
  3: 'ثلاثون',
  4: 'أربعون',
  5: 'خمسون',
  6: 'ستون',
  7: 'سبعون',
  8: 'ثمانون',
  9: 'تسعون',
};

export function numberToArabicWords(num: number): string {
  if (num in arabicOnes) return arabicOnes[num];
  if (num === 100) return 'مئة';
  if (num > 20 && num < 100) {
    const tens = Math.floor(num / 10);
    const ones = num % 10;
    if (ones === 0) return arabicTens[tens];
    return `${arabicOnes[ones]} و${arabicTens[tens]}`;
  }
  return String(num);
}

// Converts a math expression like "2 + 3 = 5" or "5 - 2 = 3" or "7 > 4" to pure spoken Arabic words
export function convertMathToSpokenArabic(expr: string): string {
  let res = expr;

  // Normalize Arabic-Indic digits to Western for uniform parsing
  const arabicIndicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  arabicIndicDigits.forEach((d, idx) => {
    res = res.replaceAll(d, String(idx));
  });

  // Replace mathematical operators with proper Arabic words
  res = res
    .replace(/\+/g, ' زائد ')
    .replace(/-(?!\d)/g, ' ناقص ') // avoid negative numbers if any
    .replace(/(?<=\s)-(?=\s)/g, ' ناقص ')
    .replace(/×|\*/g, ' ضرب ')
    .replace(/÷|\//g, ' تقسيم ')
    .replace(/=/g, ' يساوي ')
    .replace(/>=/g, ' أكبر من أو يساوي ')
    .replace(/<=/g, ' أصغر من أو يساوي ')
    .replace(/>/g, ' أكبر من ')
    .replace(/</g, ' أصغر من ')
    .replace(/\?/g, ' كم ')
    .replace(/؟/g, ' كم ');

  // Replace standalone numbers with their Arabic words
  res = res.replace(/\b\d+\b/g, (match) => {
    const val = parseInt(match, 10);
    if (!isNaN(val) && val >= 0 && val <= 100) {
      return numberToArabicWords(val);
    }
    return match;
  });

  // Handle special dual case: "ناقص اثنين" sounds very natural in Arabic math
  res = res.replace(/ناقص اثنان\b/g, 'ناقص اثنين');

  return res.replace(/\s+/g, ' ').trim();
}

// Phonetic pronunciation correction for Arabic TTS engines
// Guarantees crystal-clear pronunciation of Jana's name («جَنَا» / «يَا جَنَا») without misreading as "جنن" or "junan"
export function fixArabicPronunciation(text: string): string {
  let s = text;
  // Replace vocative forms first: "يا جنى" or "يَا جَنَى" -> "يَا جَنَا"
  s = s.replace(/(^|[^\u0621-\u064A])(?:يا\s+|يَا\s+)(?:جَنَى|جنى)(?=[^\u0621-\u064A]|$)/gu, '$1يَا جَنَا');
  // Replace standalone name "جَنَى" or "جنى" -> "جَنَا"
  s = s.replace(/(^|[^\u0621-\u064A])(?:جَنَى|جنى)(?=[^\u0621-\u064A]|$)/gu, '$1جَنَا');
  return s;
}

// Clean text for speech: replace symbols, math, strip emojis so it speaks clearly
export function prepareSpokenText(raw: string, lang: 'ar' | 'en'): string {
  let cleaned = raw;

  // Remove common decorative emojis
  cleaned = cleaned.replace(/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

  if (lang === 'ar') {
    // 1. Convert math expressions & numbers to spoken Arabic words
    cleaned = convertMathToSpokenArabic(cleaned);
    // 2. Phonetically fix pronunciation of Jana's name so it always reads «جَنَا» ("Janaa")
    cleaned = fixArabicPronunciation(cleaned);
  } else {
    // English replacements
    cleaned = cleaned
      .replace(/\+/g, ' plus ')
      .replace(/-/g, ' minus ')
      .replace(/=/g, ' equals ')
      .replace(/>/g, ' greater than ')
      .replace(/</g, ' less than ')
      .replace(/×|\*/g, ' times ')
      .replace(/÷|\//g, ' divided by ');
  }

  return cleaned.trim();
}

let lastSpokenData: { text: string; lang: 'ar' | 'en' } | null = null;

// Stop any playing audio & speech synthesis
export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  // Also pause any HTML audio elements currently playing
  if (typeof document !== 'undefined') {
    const audios = document.querySelectorAll('audio');
    audios.forEach((a) => {
      if (!a.paused) a.pause();
    });
  }
  activeUtterance = null;
  notifySpeechState(null);
}

// Helper to choose the best available voice, prioritizing natural female Arabic teacher voices
export function pickBestVoice(lang: 'ar' | 'en'): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  if (lang === 'ar') {
    // 1. Natural friendly female Arabic teacher voices (Salma, Zari, Hoda, Zeina, Laila, Maryam, Google Arabic Female, etc.)
    const naturalFemaleArabic = voices.find((v) => {
      const code = (v.lang || '').toLowerCase().replace('_', '-');
      const name = (v.name || '').toLowerCase();
      const isArabic = code.startsWith('ar') || name.includes('arabic') || name.includes('عربي');
      if (!isArabic) return false;
      return (
        name.includes('salma') ||
        name.includes('zari') ||
        name.includes('hoda') ||
        name.includes('zeina') ||
        name.includes('laila') ||
        name.includes('maryam') ||
        name.includes('female') ||
        (name.includes('natural') && isArabic)
      );
    });
    if (naturalFemaleArabic) return naturalFemaleArabic;

    // 2. Arabic Saudi Arabia (ar-SA) (e.g. Microsoft Naayf, Microsoft Hoda, Saudi voices)
    const saudiArabic = voices.find((v) => {
      const code = (v.lang || '').toLowerCase().replace('_', '-');
      const name = (v.name || '').toLowerCase();
      return (
        code === 'ar-sa' ||
        code.startsWith('ar-sa') ||
        name.includes('saudi') ||
        name.includes('naayf') ||
        name.includes('السعودية')
      );
    });
    if (saudiArabic) return saudiArabic;

    // 3. Any available Arabic voice
    const anyArabic = voices.find((v) => {
      const code = (v.lang || '').toLowerCase().replace('_', '-');
      const name = (v.name || '').toLowerCase();
      return (
        code.startsWith('ar') ||
        name.includes('arabic') ||
        name.includes('عربي') ||
        name.includes('maged')
      );
    });
    if (anyArabic) return anyArabic;
  } else {
    // English voices
    const preferredEnglish = voices.find((v) => {
      const code = (v.lang || '').toLowerCase().replace('_', '-');
      const name = (v.name || '').toLowerCase();
      return (
        (code.startsWith('en-us') || code.startsWith('en-gb') || code.startsWith('en')) &&
        (name.includes('samantha') ||
          name.includes('victoria') ||
          name.includes('karen') ||
          name.includes('natural') ||
          name.includes('google us english') ||
          name.includes('microsoft'))
      );
    });
    if (preferredEnglish) return preferredEnglish;

    const anyEnglish = voices.find((v) => (v.lang || '').toLowerCase().startsWith('en'));
    if (anyEnglish) return anyEnglish;
  }

  return null;
}

// Web Speech API wrapper with auto-cancel of previous text
export function speakText(
  text: string,
  lang: 'ar' | 'en' = 'ar',
  onStart?: () => void,
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    lastErrorMsg = 'محرك الصوت غير مدعوم في هذا المتصفح';
    return false;
  }

  try {
    // Always stop and cancel previous audio immediately
    stopSpeaking();

    const spokenText = prepareSpokenText(text, lang);
    if (!spokenText) return false;

    lastSpokenData = { text, lang };

    const utterance = new SpeechSynthesisUtterance(spokenText);
    activeUtterance = utterance; // Keep reference to prevent GC

    const settings = loadSettings();

    // Default friendly slow rate (0.85) for 1st grade child
    utterance.rate = settings?.speechRate || 0.85;
    utterance.pitch = 1.15; // Gentle, cheerful female teacher voice

    const bestVoice = pickBestVoice(lang);
    if (bestVoice) {
      utterance.voice = bestVoice;
      utterance.lang = bestVoice.lang || (lang === 'ar' ? 'ar-SA' : 'en-US');
    } else {
      utterance.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
    }

    utterance.onstart = () => {
      lastErrorMsg = null;
      notifySpeechState(text);
      if (onStart) onStart();
    };

    utterance.onend = () => {
      activeUtterance = null;
      notifySpeechState(null);
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      activeUtterance = null;
      notifySpeechState(null);
      // 'canceled' is not a fatal error (user tapped next or stop)
      if (e.error !== 'canceled') {
        lastErrorMsg = `خطأ صوتي: ${e.error || 'تعذر تشغيل الصوت'}`;
        console.warn('SpeechSynthesis error:', e);
      }
      if (onEnd) onEnd();
    };

    // Chrome/Android bug workaround: resume before speak
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    activeUtterance = null;
    notifySpeechState(null);
    lastErrorMsg = String(err);
    console.warn('Speech synthesis exception:', err);
    if (onEnd) onEnd();
    return false;
  }
}

export function replayLastSpeech() {
  if (lastSpokenData) {
    speakText(lastSpokenData.text, lastSpokenData.lang);
  }
}

// --- Official Welcome Message requested by user ---
export const OFFICIAL_JANA_WELCOME =
  'أهلًا يا جَنَى الجميلة! أنتِ ذكية ومجتهدة، هيا نبدأ رحلتنا التعليمية الممتعة!';

export function speakJanaWelcome(onStart?: () => void, onEnd?: () => void): boolean {
  return speakText(OFFICIAL_JANA_WELCOME, 'ar', onStart, onEnd);
}

// --- Special Test Phrase requested by user ---
export const JANA_SPECIAL_TEST_PHRASE = 'مرحبًا يا جنى، أنتِ طالبة ذكية ومجتهدة';

export function speakJanaTestPhrase(onStart?: () => void, onEnd?: () => void): boolean {
  return speakText(JANA_SPECIAL_TEST_PHRASE, 'ar', onStart, onEnd);
}

// --- Encouragement Phrases specified by user ---
export const encouragementPhrases = {
  correct: [
    'أحسنتِ يا جنى!',
    'ممتاز يا بطلتي!',
    'رائعة يا جنى، إجابة صحيحة!',
    'ما شاء الله عليكِ يا جنى، متفوقة دائماً!',
    'أنتِ ذكية جداً يا جنى!',
  ],
  retry: [
    'حاولي مرة أخرى يا أميرتي!',
    'فكري بهدوء يا جنى، أنتِ قادرة على حلها!',
    'لا بأس يا بطلتي، جربي مرة ثانية!',
  ],
  complete: [
    'مبروك يا جنى، لقد أكملتِ الدرس!',
    'أحسنتِ يا جنى! نلتِ وسام التميز والنجوم!',
    'مبارك يا بطلتي إكمال هذا الدرس بنجاح باهر!',
  ],
};

export function speakTeacherPraise(type: 'correct' | 'retry' | 'complete' = 'correct') {
  const list = encouragementPhrases[type];
  const phrase = list[Math.floor(Math.random() * list.length)];
  speakText(phrase, 'ar');
  return phrase;
}

export const teacherPraisePhrases = encouragementPhrases.correct;
export function getRandomPraise(): string {
  return teacherPraisePhrases[Math.floor(Math.random() * teacherPraisePhrases.length)];
}

// Diagnostics data for Settings Screen
export interface AudioDiagnostics {
  supported: boolean;
  totalVoices: number;
  arabicVoices: string[];
  englishVoices: string[];
  allVoices: { name: string; lang: string }[];
  selectedArabicVoice: string | null;
  selectedEnglishVoice: string | null;
  hasArabicVoice: boolean;
  isSaudiVoice: boolean;
  activeLanguage: string;
  speechRate: number;
  lastError: string | null;
}

export function getAudioDiagnostics(): AudioDiagnostics {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return {
      supported: false,
      totalVoices: 0,
      arabicVoices: [],
      englishVoices: [],
      allVoices: [],
      selectedArabicVoice: null,
      selectedEnglishVoice: null,
      hasArabicVoice: false,
      isSaudiVoice: false,
      activeLanguage: 'none',
      speechRate: 0.85,
      lastError: 'المتصفح لا يدعم Web Speech API',
    };
  }

  const voices = window.speechSynthesis.getVoices() || [];
  const arabic = voices
    .filter((v) => {
      const code = (v.lang || '').toLowerCase().replace('_', '-');
      const name = (v.name || '').toLowerCase();
      return code.startsWith('ar') || name.includes('arabic') || name.includes('عربي');
    })
    .map((v) => `${v.name} (${v.lang})`);

  const english = voices
    .filter((v) => {
      const code = (v.lang || '').toLowerCase().replace('_', '-');
      return code.startsWith('en');
    })
    .map((v) => `${v.name} (${v.lang})`);

  const allVoices = voices.map((v) => ({
    name: v.name,
    lang: v.lang,
  }));

  const bestArabic = pickBestVoice('ar');
  const bestEnglish = pickBestVoice('en');

  const settings = loadSettings();

  const isSaudi = Boolean(
    bestArabic &&
      ((bestArabic.lang || '').toLowerCase().includes('sa') ||
        bestArabic.name.toLowerCase().includes('saudi') ||
        bestArabic.name.toLowerCase().includes('naayf') ||
        bestArabic.name.toLowerCase().includes('hoda') ||
        bestArabic.name.toLowerCase().includes('salma'))
  );

  return {
    supported: true,
    totalVoices: voices.length,
    arabicVoices: arabic,
    englishVoices: english,
    allVoices,
    selectedArabicVoice: bestArabic ? `${bestArabic.name} (${bestArabic.lang})` : null,
    selectedEnglishVoice: bestEnglish ? `${bestEnglish.name} (${bestEnglish.lang})` : null,
    hasArabicVoice: arabic.length > 0 || bestArabic !== null,
    isSaudiVoice: isSaudi,
    activeLanguage: bestArabic ? bestArabic.lang : 'ar-SA',
    speechRate: settings?.speechRate || 0.85,
    lastError: lastErrorMsg,
  };
}
