import React from 'react';
import { Bell, Sparkles, Star, Award, Heart, Volume2 } from 'lucide-react';
import { SpeakButton } from '../SpeakButton';
import { playSoundEffect, speakText } from '../../utils/audio';

export const NotificationsScreen: React.FC = () => {
  const notifications = [
    {
      id: 1,
      title: 'رسالة تشجيع من أبلة سارة 🌸',
      text: 'صباح الخير يا جنى! يوم دراسي جديد مليء بالنجاح والتفوق بمدرسة خديجة للبنات!',
      time: 'اليوم • ٨:٠٠ ص',
      icon: '👩‍🏫',
      color: 'bg-pink-100 text-pink-700',
    },
    {
      id: 2,
      title: 'وسام التفوق في الرياضيات ⭐',
      text: 'مبروك يا جنى! أحرزتِ نتيجة باهرة في اختبار الأرقام والجمع البصري!',
      time: 'أمس • ٤:٣٠ م',
      icon: '🏆',
      color: 'bg-amber-100 text-amber-700',
    },
    {
      id: 3,
      title: 'تذكير بمراجعة سورة الفلق 🕌',
      text: 'ما رأيكِ في الاستماع لتلاوة سورة الفلق وتكرار حفظها مع الشيخ العفاسي؟',
      time: 'أمس • ١:٠٠ م',
      icon: '📖',
      color: 'bg-emerald-100 text-emerald-700',
    },
    {
      id: 4,
      title: 'كلمات اللغة الإنجليزية الجديدة 🇬🇧',
      text: 'تعلمتِ اليوم: Apple, Cat, School بنطق صحيح ورائع جداً!',
      time: 'منذ يومين',
      icon: '🔤',
      color: 'bg-blue-100 text-blue-700',
    },
  ];

  return (
    <div className="pb-24 pt-2 px-3 sm:px-4 max-w-lg mx-auto space-y-3">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-800 to-indigo-900 rounded-3xl p-3 text-white shadow-lg mb-3 flex items-center justify-between border-2 border-amber-300">
        <div className="flex items-center gap-2">
          <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow">
            🔔
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg font-black text-amber-200">التنبيهات والرسائل</h2>
              <SpeakButton text="التنبيهات والرسائل المشجعة من المعلمة سارة ومدرسة خديجة للبنات" size="xs" className="bg-white/30 text-white" />
            </div>
            <p className="text-xs text-white/90 font-medium">رسائل المعلمة وتشجيعات المدرسة</p>
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => {
              playSoundEffect.click();
              speakText(n.text, 'ar');
            }}
            className="bg-white rounded-2xl p-4 border border-purple-200 shadow-sm flex items-start gap-3 hover:bg-purple-50/50 transition cursor-pointer active:scale-98 relative"
          >
            <div
              className={`w-11 h-11 rounded-2xl ${n.color} flex items-center justify-center text-2xl shrink-0 shadow-inner`}
            >
              {n.icon}
            </div>
            <div className="flex-1 text-right">
              <div className="flex items-center justify-between gap-1 mb-1">
                <h4 className="text-xs sm:text-sm font-black text-purple-950">{n.title}</h4>
                <span className="text-[10px] text-purple-400 font-bold">{n.time}</span>
              </div>
              <p className="text-xs text-purple-800 font-medium leading-relaxed">{n.text}</p>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[10px] text-purple-500 font-bold">
                  <Volume2 className="w-3.5 h-3.5 text-purple-600" />
                  <span>اضغطي للاستماع بصوت المعلمة</span>
                </div>
                <SpeakButton text={`${n.title}. ${n.text}`} size="xs" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
