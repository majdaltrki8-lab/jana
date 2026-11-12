import React from 'react';
import { Home, BookOpen, User, Bell, Settings } from 'lucide-react';
import { ScreenType } from '../types';

interface BottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const navItems = [
    {
      id: 'profile' as ScreenType,
      label: 'ملفي',
      icon: User,
    },
    {
      id: 'lessons_list' as ScreenType,
      label: 'دروسي',
      icon: BookOpen,
    },
    {
      id: 'home' as ScreenType,
      label: 'الرئيسية',
      icon: Home,
      isCenter: true,
    },
    {
      id: 'notifications' as ScreenType,
      label: 'التنبيهات',
      icon: Bell,
    },
    {
      id: 'settings' as ScreenType,
      label: 'الإعدادات',
      icon: Settings,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-purple-900 via-purple-900 to-purple-800 text-white border-t border-purple-700/60 shadow-2xl">
      <div className="max-w-md mx-auto px-4 py-1.5 flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="relative -top-4 flex flex-col items-center group transition active:scale-95"
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform ${
                    isActive
                      ? 'bg-gradient-to-tr from-amber-500 to-yellow-300 ring-4 ring-purple-900 text-purple-950 scale-105'
                      : 'bg-gradient-to-tr from-amber-400 to-yellow-300 ring-4 ring-purple-900 text-purple-900 hover:scale-105'
                  }`}
                >
                  <Icon className="w-7 h-7 stroke-[2.5]" />
                </div>
                <span
                  className={`text-[11px] font-black mt-0.5 ${
                    isActive ? 'text-amber-300' : 'text-purple-200'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center py-1 px-2 rounded-lg transition active:scale-95 ${
                isActive ? 'text-amber-300' : 'text-purple-200/80 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className={`text-[10px] mt-0.5 ${isActive ? 'font-bold' : 'font-normal'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
