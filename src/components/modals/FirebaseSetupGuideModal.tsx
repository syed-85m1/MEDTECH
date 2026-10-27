import React, { useState } from 'react';
import {
  Database,
  ShieldCheck,
  CheckCircle2,
  X,
  Copy,
  Check,
  ExternalLink,
  Code,
  Smartphone,
  Server,
  Lock,
} from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const FirebaseSetupGuideModal: React.FC<Props> = ({ onClose }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(label);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const sampleRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} { allow read, write: if false; }
    
    // Clinical records strictly require active patient consent
    match /medical_records/{recordId} {
      allow get, list: if request.auth != null && (
        resource.data.patientId == request.auth.uid ||
        (exists(/databases/$(database)/documents/record_access_grants/$(resource.data.patientId + '_' + request.auth.uid)) &&
         get(/databases/$(database)/documents/record_access_grants/$(resource.data.patientId + '_' + request.auth.uid)).data.status == 'active')
      );
    }
  }
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-3xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto space-y-6 text-xs text-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-50 text-teal-700 rounded-2xl">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                MediLink Architecture & Firebase Setup Guide
              </h2>
              <p className="text-xs text-slate-500">
                For College Innovation Competition Judges & Developers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Prototype Status Banner */}
        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 space-y-1.5">
          <div className="font-bold text-teal-900 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span>Interactive Demonstration Mode: Active & Ready</span>
          </div>
          <p className="text-teal-800 leading-relaxed">
            The app is currently preloaded with realistic fictional clinical data, patient-directed access control, and complete appointment workflows. All mutations (booking visits, adding clinical notes, revoking consents, verifying doctors) persist in browser local storage.
          </p>
        </div>

        {/* Competition Test Scenarios */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-teal-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Competition Test Scenarios for Evaluators
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <strong className="text-slate-900 block font-semibold">1. Test Patient Consent Gate</strong>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Switch persona to <strong>Dr. Elena Vance</strong>. Notice that Sarah Jenkins' health records are blocked. Switch to <strong>Sarah Jenkins</strong>, grant access, and watch the records unlock!
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <strong className="text-slate-900 block font-semibold">2. Doctor Credential Verification</strong>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Switch to <strong>Admin Compliance Officer</strong>. In the Verification Desk, review Dr. Vance's medical license and click "Approve & Mark Verified".
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <strong className="text-slate-900 block font-semibold">3. Install PWA on Android / PC</strong>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Click the <strong>"Install App"</strong> button in the navigation header to install MediLink as a standalone app with offline caching.
              </p>
            </div>
          </div>
        </div>

        {/* Step-by-Step Beginner Firebase Setup */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-teal-800 flex items-center gap-2">
            <Server className="w-4 h-4" />
            Beginner's Step-by-Step Firebase Connection Guide
          </h3>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs">1</span>
                <span>Create a Firebase Project</span>
              </div>
              <p className="text-slate-600 pl-7">
                Navigate to the Firebase Console (<a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-teal-600 underline">console.firebase.google.com</a>) and create a new project named <code className="bg-slate-100 px-1 py-0.5 rounded">medilink-health</code>.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs">2</span>
                <span>Enable Authentication & Cloud Firestore</span>
              </div>
              <p className="text-slate-600 pl-7">
                In your Firebase Console, enable <strong>Authentication</strong> (Google & Email/Password providers). Then go to <strong>Firestore Database</strong> and choose "Create Database" in production mode.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs">3</span>
                <span>Deploy MediLink Security Rules (`firestore.rules`)</span>
              </div>
              <p className="text-slate-600 pl-7">
                MediLink includes a pre-written, hardened <code className="bg-slate-100 px-1 py-0.5 rounded">firestore.rules</code> file adhering to the 8 pillars of zero-trust Firestore architecture.
              </p>
              <div className="pl-7 relative">
                <pre className="bg-slate-900 text-slate-200 p-3 rounded-xl overflow-x-auto text-[11px] font-mono leading-relaxed max-h-36">
                  {sampleRules}
                </pre>
                <button
                  onClick={() => copyToClipboard(sampleRules, 'rules')}
                  className="absolute top-2 right-2 px-2 py-1 bg-white/20 hover:bg-white/30 text-white rounded text-[10px] flex items-center gap-1 font-sans"
                >
                  {copiedSection === 'rules' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSection === 'rules' ? 'Copied' : 'Copy Snippet'}</span>
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs">4</span>
                <span>Generate Web App Credentials</span>
              </div>
              <p className="text-slate-600 pl-7">
                Register a Web App in Firebase Project Settings and place the generated credentials in <code className="bg-slate-100 px-1 py-0.5 rounded">firebase-applet-config.json</code> in the workspace root.
              </p>
            </div>
          </div>
        </div>

        {/* PWA & Deployment instructions */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-teal-800 flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            PWA Installation & Production Build Steps
          </h3>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 space-y-2 text-xs">
            <div className="font-semibold text-slate-900">1. Production Build:</div>
            <pre className="bg-slate-900 text-slate-200 p-2.5 rounded-lg font-mono text-[11px]">npm run build</pre>
            <div className="font-semibold text-slate-900 pt-1">2. PWA Verification:</div>
            <p>
              The application automatically generates service workers with <code className="bg-slate-200 px-1 py-0.5 rounded">vite-plugin-pwa</code> and complies with Web App Manifest standards for home screen installation on Android and Chrome.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs transition cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
