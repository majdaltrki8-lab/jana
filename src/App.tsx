import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { SplashScreen } from './components/screens/SplashScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { ArabicScreen } from './components/screens/ArabicScreen';
import { EnglishScreen } from './components/screens/EnglishScreen';
import { MathScreen } from './components/screens/MathScreen';
import { QuranScreen } from './components/screens/QuranScreen';
import { IslamicScreen } from './components/screens/IslamicScreen';
import { YemeniCurriculumScreen } from './components/screens/YemeniCurriculumScreen';
import { ScienceScreen } from './components/screens/ScienceScreen';
import { GamesScreen } from './components/screens/GamesScreen';
import { DrawingScreen } from './components/screens/DrawingScreen';
import { QuizzesScreen } from './components/screens/QuizzesScreen';
import { ProfileProgressScreen } from './components/screens/ProfileProgressScreen';
import { LessonsListScreen } from './components/screens/LessonsListScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { NotificationsScreen } from './components/screens/NotificationsScreen';
import { ScreenType, StudentProfile, AppSettings } from './types';
import {
  loadProfile,
  saveProfile,
  updateProgress,
  loadSettings,
  saveSettings,
  defaultProfile,
} from './utils/storage';
import { playSoundEffect } from './utils/audio';
import { Smartphone, Monitor } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('splash');
  const [profile, setProfile] = useState<StudentProfile>(loadProfile);
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);

  // Sync Android/browser hardware Back button across screens cleanly
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      const targetScreen = (e.state && e.state.screen) as ScreenType | undefined;
      if (targetScreen) {
        setCurrentScreen(targetScreen);
      } else {
        setCurrentScreen('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleStartApp = () => {
    window.history.pushState({ screen: 'home' }, '');
    setCurrentScreen('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (screen: ScreenType) => {
    playSoundEffect.click();
    if (screen !== currentScreen) {
      window.history.pushState({ screen }, '');
    }
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddStars = (amount: number) => {
    const updated = updateProgress(undefined, amount);
    setProfile(updated);
  };

  const handleCompleteLesson = (lessonId: string) => {
    const updated = updateProgress(lessonId, 5);
    setProfile(updated);
  };

  const handleRecordQuizScore = (quizId: string, score: number) => {
    const updated = updateProgress(undefined, 0, { quizId, score });
    setProfile(updated);
  };

  const handleToggleSound = () => {
    const newSettings = { ...settings, soundEffects: !settings.soundEffects };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleResetData = () => {
    saveProfile(defaultProfile);
    setProfile(defaultProfile);
    playSoundEffect.star();
  };

  const getScreenTitle = (): string | undefined => {
    switch (currentScreen) {
      case 'arabic':
        return 'اللغة العربية';
      case 'english':
        return 'اللغة الإنجليزية';
      case 'math':
        return 'الرياضيات';
      case 'quran':
        return 'القرآن الكريم';
      case 'islamic':
        return 'التربية الإسلامية';
      case 'yemeni_curriculum':
        return 'المنهج اليمني';
      case 'science':
        return 'العلوم والبيئة';
      case 'games':
        return 'الألعاب التعليمية';
      case 'drawing':
        return 'الرسم والتلوين';
      case 'quizzes':
        return 'الاختبارات التفاعلية';
      case 'profile':
        return 'ملفي وتقدمي';
      case 'lessons_list':
        return 'دروسي';
      case 'notifications':
        return 'التنبيهات';
      case 'settings':
        return 'الإعدادات';
      default:
        return undefined;
    }
  };

  const showBackButton = currentScreen !== 'home' && currentScreen !== 'splash';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fbf5ff] via-[#f7eeff] to-[#fff3f9] text-[#2e1065] flex flex-col items-center justify-start">
      {/* Top Controls for Device Mode Toggle on Desktop */}
      <div className="hidden md:flex items-center justify-between w-full max-w-xl px-4 py-1.5 text-xs font-bold text-purple-700 border-b border-purple-200/60 bg-purple-100/50">
        <span>مدرسة خديجة للبنات • تطبيق جنى التعليمي</span>
        <button
          onClick={() => setIsPhoneFrame(!isPhoneFrame)}
          className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl shadow-sm border border-purple-200 hover:bg-purple-50 transition"
        >
          {isPhoneFrame ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
          <span>{isPhoneFrame ? 'عرض كامل للشاشة' : 'معاينة إطار الهاتف'}</span>
        </button>
      </div>

      {/* Main Container: Mobile Frame or Full Responsive Container */}
      <div
        className={`w-full transition-all duration-300 relative ${
          isPhoneFrame
            ? 'max-w-[420px] my-4 rounded-[40px] shadow-2xl border-[10px] border-purple-950 overflow-hidden bg-gradient-to-b from-[#fbf5ff] to-[#fff3f9] min-h-[820px]'
            : 'max-w-lg min-h-screen shadow-md bg-gradient-to-b from-[#fbf5ff] via-[#f7eeff] to-[#fff3f9]'
        }`}
      >
        {currentScreen === 'splash' ? (
          <SplashScreen onStart={handleStartApp} stars={profile.stars} />
        ) : (
          <>
            <Header
              currentScreen={currentScreen}
              onNavigate={handleNavigate}
              stars={profile.stars}
              soundEnabled={settings.soundEffects}
              onToggleSound={handleToggleSound}
              title={getScreenTitle()}
              showBack={showBackButton}
            />

            <main className="w-full">
              {currentScreen === 'home' && (
                <HomeScreen onNavigate={handleNavigate} stars={profile.stars} />
              )}
              {currentScreen === 'arabic' && (
                <ArabicScreen
                  onAddStars={handleAddStars}
                  onCompleteLesson={handleCompleteLesson}
                />
              )}
              {currentScreen === 'english' && (
                <EnglishScreen
                  onAddStars={handleAddStars}
                  onCompleteLesson={handleCompleteLesson}
                />
              )}
              {currentScreen === 'math' && (
                <MathScreen
                  onAddStars={handleAddStars}
                  onCompleteLesson={handleCompleteLesson}
                />
              )}
              {currentScreen === 'quran' && (
                <QuranScreen
                  onAddStars={handleAddStars}
                  onCompleteLesson={handleCompleteLesson}
                />
              )}
              {currentScreen === 'islamic' && (
                <IslamicScreen
                  onAddStars={handleAddStars}
                  onCompleteLesson={handleCompleteLesson}
                />
              )}
              {currentScreen === 'yemeni_curriculum' && (
                <YemeniCurriculumScreen
                  onAddStars={handleAddStars}
                  onCompleteLesson={handleCompleteLesson}
                />
              )}
              {currentScreen === 'science' && (
                <ScienceScreen
                  onAddStars={handleAddStars}
                  onCompleteLesson={handleCompleteLesson}
                />
              )}
              {currentScreen === 'games' && <GamesScreen onAddStars={handleAddStars} />}
              {currentScreen === 'drawing' && (
                <DrawingScreen
                  onAddStars={handleAddStars}
                  onCompleteLesson={handleCompleteLesson}
                  onBack={() => handleNavigate('home')}
                />
              )}
              {currentScreen === 'quizzes' && (
                <QuizzesScreen
                  onAddStars={handleAddStars}
                  onRecordQuizScore={handleRecordQuizScore}
                />
              )}
              {currentScreen === 'profile' && (
                <ProfileProgressScreen profile={profile} />
              )}
              {currentScreen === 'lessons_list' && (
                <LessonsListScreen
                  onNavigate={handleNavigate}
                  completedLessons={profile.completedLessons}
                />
              )}
              {currentScreen === 'notifications' && <NotificationsScreen />}
              {currentScreen === 'settings' && (
                <SettingsScreen
                  settings={settings}
                  onUpdateSettings={handleUpdateSettings}
                  onResetData={handleResetData}
                />
              )}
            </main>

            {/* Persistent 5-Button Bottom Nav */}
            <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />
          </>
        )}
      </div>
    </div>
  );
}
