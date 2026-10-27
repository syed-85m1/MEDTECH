import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone, X, CheckCircle2, Share } from 'lucide-react';

interface Props {
  variant?: 'nav' | 'banner' | 'card';
  className?: string;
}

export const PWAInstallButton: React.FC<Props> = ({ variant = 'nav', className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already running inside installed standalone PWA app, hide install CTA
  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 rounded-full">
        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
        <span className="hidden sm:inline">Installed PWA App</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => setInstallSuccess(false), 4000);
    }
  };

  if (variant === 'banner') {
    return (
      <div className={`bg-gradient-to-r from-teal-700 via-teal-600 to-sky-700 text-white px-4 py-2.5 text-xs sm:text-sm flex flex-wrap items-center justify-between gap-3 shadow-sm ${className}`}>
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-white/10 rounded-lg">
            <Smartphone className="w-4 h-4 text-teal-200" />
          </div>
          <div>
            <span className="font-semibold">Install MediLink on Android & Desktop</span>
            <span className="hidden md:inline text-teal-100 ml-1.5">— Instant access to health records & appointments offline.</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isInstallable ? (
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-1 bg-white text-teal-800 hover:bg-teal-50 font-medium rounded-lg text-xs shadow transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Install App
            </button>
          ) : isIOS ? (
            <button
              onClick={() => setShowIOSGuide(true)}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white font-medium rounded-lg text-xs transition cursor-pointer"
            >
              Install on iOS
            </button>
          ) : (
            <span className="text-xs text-teal-100 bg-white/10 px-2.5 py-0.5 rounded-full">
              PWA Ready (Menu &gt; Install)
            </span>
          )}
        </div>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-slate-800">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-teal-600" />
                  Install on iPhone / iPad
                </h3>
                <button onClick={() => setShowIOSGuide(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0">1</div>
                  <p>In Safari, tap the <Share className="w-4 h-4 inline text-sky-600" /> <strong>Share</strong> button at bottom.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0">2</div>
                  <p>Scroll down the share sheet and tap <strong>Add to Home Screen</strong>.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0">3</div>
                  <p>Tap <strong>Add</strong> in the top-right corner to finish installing.</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-teal-600 py-2.5 text-sm font-medium text-white hover:bg-teal-700 transition"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Nav bar button
  return (
    <>
      {isInstallable ? (
        <button
          onClick={handleInstallClick}
          className={`flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-teal-700 transition active:scale-95 cursor-pointer ${className}`}
          title="Install MediLink Progressive Web App"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install App</span>
        </button>
      ) : isIOS ? (
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50/50 px-2.5 py-1 text-xs font-medium text-teal-700 hover:bg-teal-100/60 transition ${className}`}
        >
          <Smartphone className="w-3.5 h-3.5 text-teal-600" />
          <span>Install iOS</span>
        </button>
      ) : null}

      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-slate-800">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-teal-600" />
                Install on iPhone / iPad
              </h3>
              <button onClick={() => setShowIOSGuide(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0">1</div>
                <p>In Safari, tap the <Share className="w-4 h-4 inline text-sky-600" /> <strong>Share</strong> icon in the bottom toolbar.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0">2</div>
                <p>Scroll down and select <strong>Add to Home Screen</strong>.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0">3</div>
                <p>Confirm by tapping <strong>Add</strong>.</p>
              </div>
            </div>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full rounded-xl bg-teal-600 py-2.5 text-sm font-medium text-white hover:bg-teal-700 transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {installSuccess && (
        <div className="fixed top-4 right-4 z-50 rounded-xl bg-emerald-600 px-4 py-3 text-white shadow-xl flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-4 h-4" />
          <span>MediLink installed successfully!</span>
        </div>
      )}
    </>
  );
};
