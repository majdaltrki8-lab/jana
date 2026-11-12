import { StudentProfile, AppSettings } from '../types';

const PROFILE_KEY = 'jana_educational_profile';
const SETTINGS_KEY = 'jana_educational_settings';

export const defaultProfile: StudentProfile = {
  name: 'جنى',
  grade: 'الصف الأول الابتدائي',
  school: 'مدرسة خديجة للبنات',
  avatarUrl: '/assets/aistudio/_______________________________________1__2d35e175.png',
  stars: 120,
  completedLessons: [
    'ar_letters_basics',
    'ar_reading_intro',
    'en_alphabet_az',
    'math_numbers_10',
    'quran_fatihah',
    'islamic_pillars',
    'yemeni_ar_unit1',
  ],
  quizScores: {
    ar_quiz_1: 100,
    en_quiz_1: 95,
    math_quiz_1: 100,
    islamic_quiz_1: 90,
  },
  badges: [
    'بطلة الحروف العربية',
    'حافظة سورة الفاتحة',
    'عبقرية الأرقام',
    'نجمة مدرسة خديجة',
    'أميرة التهجئة الإنجليزية',
  ],
  lastActive: new Date().toISOString(),
};

export const defaultSettings: AppSettings = {
  speechRate: 0.85,
  soundEffects: true,
  autoSpeak: true,
  virtualTeacherName: 'أبلة سارة',
};

export function loadProfile(): StudentProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Migrate older avatars to Jana's new studio portrait
      if (
        !parsed.avatarUrl ||
        parsed.avatarUrl.includes('ChatGPT') ||
        parsed.avatarUrl.includes('WhatsApp_Image_2026-11-11_at_10.01.47_PM_50ee0835.jpeg')
      ) {
        parsed.avatarUrl = defaultProfile.avatarUrl;
        saveProfile({ ...defaultProfile, ...parsed });
      }
      return { ...defaultProfile, ...parsed };
    }
  } catch (e) {
    console.error('Error loading profile:', e);
  }
  return defaultProfile;
}

export function saveProfile(profile: StudentProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving profile:', e);
  }
}

export function updateProgress(
  lessonId?: string,
  newStars: number = 0,
  quizResult?: { quizId: string; score: number },
  newBadge?: string
): StudentProfile {
  const current = loadProfile();
  let updatedStars = current.stars + newStars;
  const completed = new Set(current.completedLessons);
  if (lessonId) {
    completed.add(lessonId);
  }

  const scores = { ...current.quizScores };
  if (quizResult) {
    scores[quizResult.quizId] = Math.max(scores[quizResult.quizId] || 0, quizResult.score);
  }

  const badges = new Set(current.badges);
  if (newBadge) {
    badges.add(newBadge);
  }

  const updated: StudentProfile = {
    ...current,
    stars: updatedStars,
    completedLessons: Array.from(completed),
    quizScores: scores,
    badges: Array.from(badges),
    lastActive: new Date().toISOString(),
  };

  saveProfile(updated);
  return updated;
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      return { ...defaultSettings, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Error loading settings:', e);
  }
  return defaultSettings;
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings:', e);
  }
}
