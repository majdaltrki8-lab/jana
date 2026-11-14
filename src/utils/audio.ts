import confetti from 'canvas-confetti';
import { loadSettings } from './storage';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { Capacitor } from '@capacitor/core';
import {
  LOCAL_TTS_AUDIO_MAP,
  MISSING_TTS_ITEMS,
  AUDIO_MANIFEST_STATS,
  MissingAudioEntry,
} from './audioManifest';

// Audio Context Singleton for playful UI sound effects (100% offline Web Audio API)
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
      if (!loadSettings()?.soundEffects) return;
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
      if (!loadSettings()?.soundEffects) return;
      const ctx = getAudioContext();
      const notes = [523.25, 659.25, 783.99, 1046.5];
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
      if (!loadSettings()?.soundEffects) return;
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
      if (!loadSettings()?.soundEffects) return;
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
      if (!loadSettings()?.soundEffects) return;
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
      if (loadSettings()?.soundEffects) {
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
      }
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
let activeAudioElement: HTMLAudioElement | null = null;
let speechSessionId = 0;
let lastErrorMsg: string | null = null;
const runtimeMissingAudioMap = new Map<string, MissingAudioEntry>();

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

function normalizeArabicDigits(input: string): string {
  let res = input;
  const arabicIndicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  arabicIndicDigits.forEach((d, idx) => {
    res = res.replaceAll(d, String(idx));
  });
  return res;
}

export function convertMathToSpokenArabic(expr: string): string {
  let res = normalizeArabicDigits(expr);

  res = res
    .replace(/\+/g, ' زائد ')
    .replace(/-(?!\d)/g, ' ناقص ')
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

  res = res.replace(/\b\d+\b/g, (match) => {
    const val = parseInt(match, 10);
    if (!isNaN(val) && val >= 0 && val <= 100) {
      return numberToArabicWords(val);
    }
    return match;
  });

  res = res.replace(/ناقص اثنان\b/g, 'ناقص اثنين');
  return res.replace(/\s+/g, ' ').trim();
}

export function fixArabicPronunciation(text: string): string {
  let s = text;
  s = s.replace(/(^|[^\u0621-\u064A])(?:يا\s+|يَا\s+)(?:جَنَى|جنى)(?=[^\u0621-\u064A]|$)/gu, '$1يَا جَنَا');
  s = s.replace(/(^|[^\u0621-\u064A])(?:جَنَى|جنى)(?=[^\u0621-\u064A]|$)/gu, '$1جَنَا');
  return s;
}

export function prepareSpokenText(raw: string, lang: 'ar' | 'en'): string {
  let cleaned = String(raw || '');
  cleaned = cleaned.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '');

  if (lang === 'ar') {
    cleaned = convertMathToSpokenArabic(cleaned);
    cleaned = fixArabicPronunciation(cleaned);
  } else {
    cleaned = cleaned
      .replace(/\+/g, ' plus ')
      .replace(/-/g, ' minus ')
      .replace(/=/g, ' equals ')
      .replace(/>/g, ' greater than ')
      .replace(/</g, ' less than ')
      .replace(/×|\*/g, ' times ')
      .replace(/÷|\//g, ' divided by ');
  }

  return cleaned.replace(/\s+/g, ' ').trim();
}

// Identical key normalization as collect.cjs
export function normalizeAudioLookupKey(raw: string, lang: 'ar' | 'en'): string {
  let s = prepareSpokenText(raw, lang);
  s = s.replace(/[\u064B-\u065F\u0670\u0640]/g, '');
  s = s.replace(/[«»"'.،,:;!?؟\-—_()\[\]{}/\\*+~`@#$%^&|<>۞]/g, ' ');
  s = s.replace(/\s+/g, ' ').trim();
  if (lang === 'en') s = s.toLowerCase();
  return `${lang}:${s}`;
}

function lookupLocalClip(raw: string, lang: 'ar' | 'en'): string | null {
  const key = normalizeAudioLookupKey(raw, lang);
  return LOCAL_TTS_AUDIO_MAP[key] || null;
}

function numberToClipSequence(num: number): string[] | null {
  if (!Number.isFinite(num) || num < 0) return null;
  if (num <= 100) {
    const direct = lookupLocalClip(String(num), 'ar');
    return direct ? [direct] : null;
  }
  if (num < 1000) {
    const hundreds = Math.floor(num / 100) * 100;
    const rem = num % 100;
    const hClip = lookupLocalClip(String(hundreds), 'ar');
    if (!hClip) return null;
    if (rem === 0) return [hClip];
    const remClip = lookupLocalClip(String(rem), 'ar');
    return remClip ? [hClip, remClip] : null;
  }
  if (num === 1000) {
    const kClip = lookupLocalClip('1000', 'ar');
    return kClip ? [kClip] : null;
  }
  return null;
}

function resolveDynamicAudioSequence(raw: string, lang: 'ar' | 'en'): string[] | null {
  if (lang !== 'ar') return null;
  const cleaned = normalizeArabicDigits(raw).trim();

  // Pattern 1: HomeScreen dynamic stars counter
  let m = cleaned.match(/^أحسنتِ يا جنى! لقد جمعتِ (\d+) نجمة تفوق حتى الآن! بارك الله فيكِ!$/);
  if (m) {
    const prefix = lookupLocalClip('أحسنتِ يا جنى! لقد جمعتِ', 'ar');
    const numClips = numberToClipSequence(parseInt(m[1], 10));
    const suffix = lookupLocalClip('نجمة تفوق حتى الآن! بارك الله فيكِ!', 'ar');
    if (prefix && numClips && suffix) return [prefix, ...numClips, suffix];
  }

  // Pattern 2: ProfileProgressScreen stars / badges / lessons
  m = cleaned.match(/^(\d+) نجمة مجمعة حتى الآن$/);
  if (m) {
    const numClips = numberToClipSequence(parseInt(m[1], 10));
    const suffix = lookupLocalClip('نجمة مجمعة حتى الآن', 'ar');
    if (numClips && suffix) return [...numClips, suffix];
  }

  m = cleaned.match(/^(\d+) أوسمة مكتسبة$/);
  if (m) {
    const numClips = numberToClipSequence(parseInt(m[1], 10));
    const suffix = lookupLocalClip('أوسمة مكتسبة', 'ar');
    if (numClips && suffix) return [...numClips, suffix];
  }

  m = cleaned.match(/^(\d+) درساً مكتملاً$/);
  if (m) {
    const numClips = numberToClipSequence(parseInt(m[1], 10));
    const suffix = lookupLocalClip('درساً مكتملاً', 'ar');
    if (numClips && suffix) return [...numClips, suffix];
  }

  // Pattern 3: Profile progress bar
  m = cleaned.match(/^مستوى التقدم (\d+) بالمئة، أحسنتِ يا جنى واصلي التعلم$/);
  if (m) {
    const prefix = lookupLocalClip('مستوى التقدم', 'ar');
    const numClips = numberToClipSequence(parseInt(m[1], 10));
    const suffix = lookupLocalClip('بالمئة، أحسنتِ يا جنى واصلي التعلم', 'ar');
    if (prefix && numClips && suffix) return [prefix, ...numClips, suffix];
  }

  m = cleaned.match(/^ملف الطالبة جنى، الصف الأول الابتدائي، مدرسة خديجة للبنات، نسبة التقدم (\d+) بالمئة$/);
  if (m) {
    const prefix = lookupLocalClip('ملف الطالبة جنى، الصف الأول الابتدائي، مدرسة خديجة للبنات، نسبة التقدم', 'ar');
    const numClips = numberToClipSequence(parseInt(m[1], 10));
    const suffix = lookupLocalClip('بالمئة', 'ar');
    if (prefix && numClips && suffix) return [prefix, ...numClips, suffix];
  }

  // Pattern 4: Profile quiz scores
  m = cleaned.match(/^(اختبار [^:]+): الدرجة (\d+) في المئة، ممتاز جداً$/);
  if (m) {
    const prefix = lookupLocalClip(`${m[1]}: الدرجة`, 'ar');
    const numClips = numberToClipSequence(parseInt(m[2], 10));
    const suffix = lookupLocalClip('في المئة، ممتاز جداً', 'ar');
    if (prefix && numClips && suffix) return [prefix, ...numClips, suffix];
  }

  // Pattern 5: Quiz completion certificate
  m = cleaned.match(/^مبارك يا جنى! أتممتِ (.+) بنجاح، وحصلتِ على درجة (\d+) في المئة! أنتِ فخر مدرسة خديجة للبنات!$/);
  if (m) {
    const prefix = lookupLocalClip(`مبارك يا جنى! أتممتِ ${m[1]} بنجاح، وحصلتِ على درجة`, 'ar');
    const numClips = numberToClipSequence(parseInt(m[2], 10));
    const suffix = lookupLocalClip('في المئة! أنتِ فخر مدرسة خديجة للبنات!', 'ar');
    if (prefix && numClips && suffix) return [prefix, ...numClips, suffix];
  }

  return null;
}

let lastSpokenData: { text: string; lang: 'ar' | 'en' } | null = null;

// Stop any playing local MP3, Quran <audio>, native TTS, or Web Speech synthesis
export function stopSpeaking() {
  speechSessionId++;

  if (activeAudioElement) {
    try {
      activeAudioElement.onended = null;
      activeAudioElement.onerror = null;
      activeAudioElement.pause();
      activeAudioElement.currentTime = 0;
    } catch {
      // ignore
    }
    activeAudioElement = null;
  }

  if (Capacitor.isNativePlatform()) {
    TextToSpeech.stop().catch(() => {});
  } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  if (typeof document !== 'undefined') {
    const audios = document.querySelectorAll('audio');
    audios.forEach((a) => {
      if (!a.paused) a.pause();
    });
  }
  notifySpeechState(null);
}

export function pickBestVoice(lang: 'ar' | 'en'): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  if (lang === 'ar') {
    const localFemale = voices.find((v) => {
      const code = (v.lang || '').toLowerCase().replace('_', '-');
      const name = (v.name || '').toLowerCase();
      return (
        v.localService &&
        (code.startsWith('ar') || name.includes('arabic')) &&
        (name.includes('zari') || name.includes('salma') || name.includes('hoda') || name.includes('female'))
      );
    });
    if (localFemale) return localFemale;

    const anyArabic = voices.find((v) => {
      const code = (v.lang || '').toLowerCase().replace('_', '-');
      const name = (v.name || '').toLowerCase();
      return code.startsWith('ar') || name.includes('arabic') || name.includes('عربي');
    });
    if (anyArabic) return anyArabic;
  } else {
    const anyEnglish = voices.find((v) => (v.lang || '').toLowerCase().startsWith('en'));
    if (anyEnglish) return anyEnglish;
  }

  return null;
}

function playOfflineClipSequence(
  clips: string[],
  rawText: string,
  lang: 'ar' | 'en',
  sessionId: number,
  onStart?: () => void,
  onEnd?: () => void
) {
  const settings = loadSettings();
  const baseRate = settings?.speechRate || 0.85;
  // Local Neural MP3s already have a gentle natural pace; scale slightly with user speed setting
  const playbackRate = baseRate <= 0.75 ? 0.88 : baseRate <= 0.85 ? 0.98 : 1.08;

  let index = 0;
  lastErrorMsg = null;
  notifySpeechState(rawText);
  if (onStart) onStart();

  const playNext = () => {
    if (sessionId !== speechSessionId) return;
    if (index >= clips.length) {
      activeAudioElement = null;
      notifySpeechState(null);
      if (onEnd) onEnd();
      return;
    }

    const src = clips[index++];
    const audio = new Audio(src);
    audio.playbackRate = playbackRate;
    activeAudioElement = audio;

    audio.onended = () => {
      if (sessionId !== speechSessionId) return;
      playNext();
    };

    audio.onerror = () => {
      if (sessionId !== speechSessionId) return;
      lastErrorMsg = `تعذر تشغيل الملف الصوتي المحلي (${src})`;
      runtimeMissingAudioMap.set(normalizeAudioLookupKey(rawText, lang), {
        key: normalizeAudioLookupKey(rawText, lang),
        text: rawText,
        lang,
      });
      activeAudioElement = null;
      // Offline fallback to device native TTS ONLY if local clip fails to load
      speakOfflineDeviceFallback(rawText, lang, sessionId, undefined, onEnd);
    };

    audio.play().catch(() => {
      if (sessionId !== speechSessionId) return;
      activeAudioElement = null;
      speakOfflineDeviceFallback(rawText, lang, sessionId, undefined, onEnd);
    });
  };

  playNext();
}

function speakOfflineDeviceFallback(
  text: string,
  lang: 'ar' | 'en',
  sessionId: number,
  onStart?: () => void,
  onEnd?: () => void
): boolean {
  const spokenText = prepareSpokenText(text, lang);
  if (!spokenText || sessionId !== speechSessionId) {
    notifySpeechState(null);
    if (onEnd) onEnd();
    return false;
  }

  const settings = loadSettings();
  const rate = settings?.speechRate || 0.85;

  if (Capacitor.isNativePlatform()) {
    if (onStart) onStart();
    notifySpeechState(text);
    TextToSpeech.speak({
      text: spokenText,
      lang: lang === 'ar' ? 'ar-SA' : 'en-US',
      rate,
      pitch: 1.15,
      volume: 1.0,
      category: 'ambient',
    })
      .then(() => {
        if (sessionId === speechSessionId) {
          notifySpeechState(null);
          if (onEnd) onEnd();
        }
      })
      .catch((err) => {
        lastErrorMsg = `محرك الجهاز الصوتي غير متوفر دون إنترنت (${String(err)})`;
        if (sessionId === speechSessionId) {
          notifySpeechState(null);
          if (onEnd) onEnd();
        }
      });
    return true;
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.rate = rate;
    utterance.pitch = 1.1;
    const bestVoice = pickBestVoice(lang);
    if (bestVoice) {
      utterance.voice = bestVoice;
      utterance.lang = bestVoice.lang || (lang === 'ar' ? 'ar-SA' : 'en-US');
    } else {
      utterance.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
    }

    utterance.onstart = () => {
      if (sessionId === speechSessionId) {
        notifySpeechState(text);
        if (onStart) onStart();
      }
    };
    utterance.onend = () => {
      if (sessionId === speechSessionId) {
        notifySpeechState(null);
        if (onEnd) onEnd();
      }
    };
    utterance.onerror = () => {
      if (sessionId === speechSessionId) {
        notifySpeechState(null);
        if (onEnd) onEnd();
      }
    };

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    window.speechSynthesis.speak(utterance);
    return true;
  }

  notifySpeechState(null);
  if (onEnd) onEnd();
  return false;
}

// Unified 100% Offline-First speakText (Pre-generated local female MP3 clips -> dynamic composer -> local device TTS fallback)
export function speakText(
  text: string,
  lang: 'ar' | 'en' = 'ar',
  onStart?: () => void,
  onEnd?: () => void
): boolean {
  try {
    stopSpeaking();
    const trimmed = String(text || '').trim();
    if (!trimmed) return false;

    const mySessionId = speechSessionId;
    lastSpokenData = { text: trimmed, lang };

    // 1. Direct offline pre-recorded teacher MP3 match
    const directClip = lookupLocalClip(trimmed, lang);
    if (directClip) {
      playOfflineClipSequence([directClip], trimmed, lang, mySessionId, onStart, onEnd);
      return true;
    }

    // 2. Offline dynamic multi-clip composer (e.g. arbitrary stars count or quiz percentage)
    const sequence = resolveDynamicAudioSequence(trimmed, lang);
    if (sequence && sequence.length > 0) {
      playOfflineClipSequence(sequence, trimmed, lang, mySessionId, onStart, onEnd);
      return true;
    }

    // 3. Log unmapped text honestly (never hide missing entries!) & try offline device TTS fallback
    const missingKey = normalizeAudioLookupKey(trimmed, lang);
    runtimeMissingAudioMap.set(missingKey, {
      key: missingKey,
      text: trimmed,
      lang,
    });
    return speakOfflineDeviceFallback(trimmed, lang, mySessionId, onStart, onEnd);
  } catch (err) {
    notifySpeechState(null);
    lastErrorMsg = String(err);
    if (onEnd) onEnd();
    return false;
  }
}

export function replayLastSpeech() {
  if (lastSpokenData) {
    speakText(lastSpokenData.text, lastSpokenData.lang);
  }
}

export const OFFICIAL_JANA_WELCOME =
  'أهلًا يا جَنَى الجميلة! أنتِ ذكية ومجتهدة، هيا نبدأ رحلتنا التعليمية الممتعة!';

export function speakJanaWelcome(onStart?: () => void, onEnd?: () => void): boolean {
  return speakText(OFFICIAL_JANA_WELCOME, 'ar', onStart, onEnd);
}

export const JANA_SPECIAL_TEST_PHRASE = 'مرحبًا يا جنى، أنتِ طالبة ذكية ومجتهدة';

export function speakJanaTestPhrase(onStart?: () => void, onEnd?: () => void): boolean {
  return speakText(JANA_SPECIAL_TEST_PHRASE, 'ar', onStart, onEnd);
}

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

export interface AudioDiagnostics {
  supported: boolean;
  offlinePackReady: boolean;
  verifiedTtsCount: number;
  missingTtsCount: number;
  verifiedQuranSurahCount: number;
  verifiedQuranAyahCount: number;
  missingItems: MissingAudioEntry[];
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
  isNativeAndroid: boolean;
}

export function getAudioDiagnostics(): AudioDiagnostics {
  const isNative = Capacitor.isNativePlatform();
  const offlineReady = AUDIO_MANIFEST_STATS.verifiedTtsCount > 0;
  const combinedMissing = [
    ...MISSING_TTS_ITEMS,
    ...Array.from(runtimeMissingAudioMap.values()),
  ];

  const voices =
    typeof window !== 'undefined' && 'speechSynthesis' in window
      ? window.speechSynthesis.getVoices() || []
      : [];

  const arabic = voices
    .filter((v) => {
      const code = (v.lang || '').toLowerCase().replace('_', '-');
      const name = (v.name || '').toLowerCase();
      return code.startsWith('ar') || name.includes('arabic') || name.includes('عربي');
    })
    .map((v) => `${v.name} (${v.lang})`);

  const english = voices
    .filter((v) => (v.lang || '').toLowerCase().startsWith('en'))
    .map((v) => `${v.name} (${v.lang})`);

  const allVoices = voices.map((v) => ({
    name: v.name,
    lang: v.lang,
  }));

  const bestArabic = pickBestVoice('ar');
  const bestEnglish = pickBestVoice('en');
  const settings = loadSettings();

  return {
    supported: offlineReady || isNative || (typeof window !== 'undefined' && 'speechSynthesis' in window),
    offlinePackReady: offlineReady,
    verifiedTtsCount: AUDIO_MANIFEST_STATS.verifiedTtsCount,
    missingTtsCount: combinedMissing.length,
    verifiedQuranSurahCount: AUDIO_MANIFEST_STATS.verifiedQuranSurahCount,
    verifiedQuranAyahCount: AUDIO_MANIFEST_STATS.verifiedQuranAyahCount,
    missingItems: combinedMissing,
    totalVoices: offlineReady ? AUDIO_MANIFEST_STATS.verifiedTtsCount : voices.length,
    arabicVoices: ['حزمة صوت المعلمة المدمجة دون إنترنت (ar-SA-Zariyah)', ...arabic],
    englishVoices: ['حزمة صوت الإنجليزية المدمجة دون إنترنت (en-US-Jenny)', ...english],
    allVoices,
    selectedArabicVoice: 'صوت المعلمة المدمج دون إنترنت (حزمة محلية MP3)',
    selectedEnglishVoice: 'صوت اللغة الإنجليزية المدمج دون إنترنت (حزمة محلية MP3)',
    hasArabicVoice: true,
    isSaudiVoice: true,
    activeLanguage: 'ar-SA (Offline MP3)',
    speechRate: settings?.speechRate || 0.85,
    lastError: lastErrorMsg,
    isNativeAndroid: isNative,
  };
}
