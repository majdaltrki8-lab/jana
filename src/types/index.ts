export type ScreenType =
  | 'splash'
  | 'home'
  | 'arabic'
  | 'english'
  | 'math'
  | 'quran'
  | 'islamic'
  | 'yemeni_curriculum'
  | 'science'
  | 'games'
  | 'drawing'
  | 'quizzes'
  | 'profile'
  | 'lessons_list'
  | 'notifications'
  | 'settings';

export interface StudentProfile {
  name: string;
  grade: string;
  school: string;
  avatarUrl?: string;
  stars: number;
  completedLessons: string[];
  quizScores: Record<string, number>; // quizId -> score (0-100)
  badges: string[];
  lastActive: string;
}

export interface QuranSurah {
  id: number;
  name: string;
  englishName: string;
  ayahCount: number;
  revelationType: 'مكية' | 'مدنية';
  audioUrl: string;
  verses: {
    number: number;
    text: string;
    audioAyahUrl?: string;
  }[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  audioPrompt?: string;
  image?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CurriculumLesson {
  id: string;
  unitTitle: string;
  lessonTitle: string;
  content: string;
  teacherSpeech: string;
  exercises?: {
    question: string;
    options: string[];
    correctIndex: number;
  }[];
}

export interface AppSettings {
  speechRate: number; // 0.8 - 1.2
  soundEffects: boolean;
  autoSpeak: boolean;
  virtualTeacherName: string;
}
