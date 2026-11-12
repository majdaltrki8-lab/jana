import React, { useState } from 'react';
import { usePWAInstall } from '../utils/usePWAInstall';
import { AppIcon } from './AppIcon';
import { Download, Smartphone, X, CheckCircle, Share2, PlusSquare } from 'lucide-react';
import { playSoundEffect, speakText } from '../utils/audio';

export const InstallAppBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (isInstalled || dismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    playSoundEffect.click();
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // Direct instruction guide for Android Chrome
      speakText('لتثبيت تطبيق جنى على هاتفك، اضغطي على خيارات المتصفح ثم اختاري تثبيت التطبيق أو إضافة إلى الشاشة الرئيسية', 'ar');
      alert('لتثبيت تطبيق جنى التعليمي على هاتفك:\n1. اضغطي على قائمة المتصفح (⋮) في أعلى أو أسفل الشاشة\n2. اختاري "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية"');
    }
  };

  return (
    <>
      <div className="bg-gradient-to-r from-purple-900 via-fuchsia-900 to-indigo-950 text-white rounded-3xl p-3 border-2 border-amber-300 shadow-xl flex items-center justify-between gap-3 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute -right-8 -top-8 w-24 h-24 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />

        {/* Official App Icon */}
        <div className="relative shrink-0">
          <AppIcon size="sm" className="w-12 h-12 ring-2 ring-amber-300 shadow-md" />
          <div className="absolute -bottom-1 -left-1 bg-amber-400 text-purple-950 rounded-full p-0.5 shadow">
            <Smartphone className="w-3 h-3" />
          </div>
        </div>

        {/* Text info */}
        <div className="flex-1 min-w-0 text-right">
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs sm:text-sm font-black text-amber-200 truncate">
              تثبيت تطبيق جنى على الهاتف
            </h4>
            <span className="text-[10px] bg-emerald-500/80 text-white px-1.5 py-0.2 rounded-full font-bold shrink-0">
              أندرويد
            </span>
          </div>
          <p className="text-[11px] text-purple-200 mt-0.5 leading-tight">
            ثبّتي التطبيق كبرنامج مستقل على شاشة جوالكِ مع الأيقونة الرسمية
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleInstallClick}
            className="px-3 py-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-purple-950 rounded-2xl text-xs font-black flex items-center gap-1.5 shadow-lg active:scale-95 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تثبيت</span>
          </button>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-1 rounded-full text-purple-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="إخفاء"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* iOS Safari Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border-2 border-amber-300 text-purple-950 space-y-4 text-center">
            <div className="flex justify-center">
              <AppIcon size="lg" className="w-20 h-20 shadow-xl ring-4 ring-amber-300" />
            </div>

            <div>
              <h3 className="text-base font-black text-purple-950">
                تثبيت تطبيق جنى على iPhone / iPad
              </h3>
              <p className="text-xs text-purple-700 mt-1">
                اتبعي الخطوات البسيطة التالية لإضافة أيقونة التطبيق لشاشتكِ:
              </p>
            </div>

            <div className="bg-purple-50 p-3 rounded-2xl border border-purple-200 space-y-2 text-xs text-right font-medium">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] shrink-0 font-bold">
                  ١
                </span>
                <p className="flex items-center gap-1">
                  <span>اضغطي على زر المشاركة</span>
                  <Share2 className="w-4 h-4 text-blue-600 inline" />
                  <span>في شريط Safari.</span>
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] shrink-0 font-bold">
                  ٢
                </span>
                <p className="flex items-center gap-1">
                  <span>مرري للأسفل واختاري</span>
                  <strong className="text-purple-900 flex items-center gap-1">
                    <PlusSquare className="w-3.5 h-3.5 text-purple-700 inline" />
                    «إضافة إلى الشاشة الرئيسية»
                  </strong>
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] shrink-0 font-bold">
                  ٣
                </span>
                <p>
                  اضغطي على <strong>«إضافة» (Add)</strong> في أعلى اليمين.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 bg-gradient-to-r from-purple-700 to-indigo-800 text-white rounded-2xl font-bold text-xs shadow-md transition active:scale-95 cursor-pointer"
            >
              تم وفهمت الخطوات
            </button>
          </div>
        </div>
      )}
    </>
  );
};
