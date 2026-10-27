import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import {
  Activity,
  UserCheck,
  ShieldAlert,
  ChevronDown,
  Info,
  RotateCcw,
  Sparkles,
  Database,
  Lock,
} from 'lucide-react';
import { UserRole } from '../../types';

interface Props {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenFirebaseGuide: () => void;
}

export const Navbar: React.FC<Props> = ({ currentTab, onSelectTab, onOpenFirebaseGuide }) => {
  const {
    currentUser,
    activeRole,
    selectPersona,
    resetDemoData,
    accessGrants,
    appointments,
  } = useApp();

  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showInfoBanner, setShowInfoBanner] = useState(true);

  const activeGrantsCount = accessGrants.filter(g => g.status === 'active').length;
  const pendingAppointmentsCount = appointments.filter(a => a.status === 'requested').length;

  const roleColors: Record<UserRole, { bg: string; text: string; label: string; ring: string }> = {
    patient: { bg: 'bg-teal-50', text: 'text-teal-700', label: 'Patient Portal', ring: 'ring-teal-200' },
    doctor: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Doctor Portal', ring: 'ring-blue-200' },
    admin: { bg: 'bg-purple-50', text: 'text-purple-700', label: 'Admin Desk', ring: 'ring-purple-200' },
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Disclaimer Banner for Competition Prototype */}
      {showInfoBanner && (
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-sky-950 text-white text-xs px-4 py-1.5 flex items-center justify-between border-b border-teal-900/50">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="px-1.5 py-0.5 bg-teal-500/20 text-teal-300 font-bold rounded-sm text-[10px] uppercase tracking-wider border border-teal-400/30">
              College Prototype
            </span>
            <span className="text-slate-300">
              MediLink demonstrates ABAC patient-directed consent, doctor credential verification & PWA offline readiness.
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenFirebaseGuide}
              className="text-teal-300 hover:text-white underline text-[11px] flex items-center gap-1 cursor-pointer font-medium"
            >
              <Database className="w-3 h-3" />
              Firebase & Security Guide
            </button>
            <button
              onClick={() => setShowInfoBanner(false)}
              className="text-slate-400 hover:text-white text-xs px-1 cursor-pointer"
              title="Dismiss banner"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div
            className="flex items-center gap-3 cursor-pointer group select-none"
            onClick={() => onSelectTab(activeRole === 'patient' ? 'dashboard' : activeRole === 'doctor' ? 'doctor-dashboard' : 'admin-dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 via-teal-600 to-sky-600 flex items-center justify-center shadow-md shadow-teal-600/20 group-hover:scale-105 transition">
              <Activity className="w-6 h-6 text-white stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent drop-shadow-2xs">
                  MediTech
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-sm font-semibold bg-teal-100 text-teal-800 border border-teal-300/60 uppercase tracking-wider">
                  PWA
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium leading-none hidden sm:block">
                Your Health, Connected
              </p>
            </div>
          </div>

          {/* Desktop Tab Navigation */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            {activeRole === 'patient' && (
              <>
                <button
                  onClick={() => onSelectTab('dashboard')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    currentTab === 'dashboard'
                      ? 'bg-teal-50 text-teal-800 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-teal-700 hover:bg-slate-50'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => onSelectTab('find-doctors')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    currentTab === 'find-doctors'
                      ? 'bg-teal-50 text-teal-800 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-teal-700 hover:bg-slate-50'
                  }`}
                >
                  Find Doctors
                </button>
                <button
                  onClick={() => onSelectTab('appointments')}
                  className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                    currentTab === 'appointments'
                      ? 'bg-teal-50 text-teal-800 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-teal-700 hover:bg-slate-50'
                  }`}
                >
                  Appointments
                  {pendingAppointmentsCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                  )}
                </button>
                <button
                  onClick={() => onSelectTab('timeline')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    currentTab === 'timeline'
                      ? 'bg-teal-50 text-teal-800 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-teal-700 hover:bg-slate-50'
                  }`}
                >
                  Health Timeline
                </button>
                <button
                  onClick={() => onSelectTab('medications')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    currentTab === 'medications'
                      ? 'bg-teal-50 text-teal-800 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-teal-700 hover:bg-slate-50'
                  }`}
                >
                  Medications
                </button>
                <button
                  onClick={() => onSelectTab('access-control')}
                  className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                    currentTab === 'access-control'
                      ? 'bg-teal-50 text-teal-800 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-teal-700 hover:bg-slate-50'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 text-teal-600" />
                  Record Access
                  {activeGrantsCount > 0 && (
                    <span className="px-1.5 py-0.2 bg-teal-100 text-teal-800 text-[11px] font-bold rounded-full">
                      {activeGrantsCount}
                    </span>
                  )}
                </button>
              </>
            )}

            {activeRole === 'doctor' && (
              <>
                <button
                  onClick={() => onSelectTab('doctor-dashboard')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    currentTab === 'doctor-dashboard'
                      ? 'bg-blue-50 text-blue-800 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'
                  }`}
                >
                  Doctor Desk
                </button>
                <button
                  onClick={() => onSelectTab('doctor-appointments')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    currentTab === 'doctor-appointments'
                      ? 'bg-blue-50 text-blue-800 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'
                  }`}
                >
                  Patient Queue
                </button>
                <button
                  onClick={() => onSelectTab('doctor-patient-records')}
                  className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                    currentTab === 'doctor-patient-records'
                      ? 'bg-blue-50 text-blue-800 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 text-blue-600" />
                  Consented Records
                </button>
                <button
                  onClick={() => onSelectTab('doctor-profile')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    currentTab === 'doctor-profile'
                      ? 'bg-blue-50 text-blue-800 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'
                  }`}
                >
                  Profile & Credentials
                </button>
              </>
            )}

            {activeRole === 'admin' && (
              <>
                <button
                  onClick={() => onSelectTab('admin-dashboard')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    currentTab === 'admin-dashboard'
                      ? 'bg-purple-50 text-purple-800 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-purple-700 hover:bg-slate-50'
                  }`}
                >
                  Admin Verification Desk
                </button>
                <button
                  onClick={() => onSelectTab('admin-audit-logs')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    currentTab === 'admin-audit-logs'
                      ? 'bg-purple-50 text-purple-800 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-purple-700 hover:bg-slate-50'
                  }`}
                >
                  Security Audit Logs
                </button>
              </>
            )}
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2.5">
            <PWAInstallButton variant="nav" />

            {/* Persona Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-2xs transition cursor-pointer ring-1 ${roleColors[activeRole].ring}`}
              >
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0 overflow-hidden">
                  {currentUser.displayName.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="font-semibold text-slate-900 leading-tight">
                    {currentUser.displayName}
                  </div>
                  <div className="text-[10px] text-teal-700 font-medium">
                    {roleColors[activeRole].label}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showPersonaMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowPersonaMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white p-2.5 shadow-xl ring-1 ring-black/5 z-50 text-xs text-slate-700">
                    <div className="px-2 py-1.5 font-bold text-[11px] text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Test Competition Personas</span>
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    </div>

                    <div className="space-y-1 mt-1">
                      <button
                        onClick={() => {
                          selectPersona('patient_sarah');
                          onSelectTab('dashboard');
                          setShowPersonaMenu(false);
                        }}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition cursor-pointer ${
                          currentUser.uid === 'patient_sarah_jenkins_001'
                            ? 'bg-teal-50 text-teal-900 font-semibold'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold shrink-0">
                          SJ
                        </div>
                        <div className="truncate">
                          <div className="font-medium text-slate-900">Sarah Jenkins</div>
                          <div className="text-[10px] text-teal-600">Patient (Controls access, views timeline)</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          selectPersona('doctor_patel');
                          onSelectTab('doctor-dashboard');
                          setShowPersonaMenu(false);
                        }}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition cursor-pointer ${
                          currentUser.uid === 'doctor_patel_001'
                            ? 'bg-blue-50 text-blue-900 font-semibold'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
                          <UserCheck className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <div className="font-medium text-slate-900">Dr. Rajesh Patel, MD</div>
                          <div className="text-[10px] text-blue-600">Verified Doctor (Cardiology — Has Consent)</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          selectPersona('doctor_vance');
                          onSelectTab('doctor-dashboard');
                          setShowPersonaMenu(false);
                        }}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition cursor-pointer ${
                          currentUser.uid === 'doctor_vance_002'
                            ? 'bg-amber-50 text-amber-900 font-semibold'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0">
                          <ShieldAlert className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <div className="font-medium text-slate-900">Dr. Elena Vance, MD</div>
                          <div className="text-[10px] text-amber-700">Pending Doctor (Neurology — No Consent)</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          selectPersona('admin');
                          onSelectTab('admin-dashboard');
                          setShowPersonaMenu(false);
                        }}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition cursor-pointer ${
                          currentUser.role === 'admin'
                            ? 'bg-purple-50 text-purple-900 font-semibold'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold shrink-0">
                          A
                        </div>
                        <div className="truncate">
                          <div className="font-medium text-slate-900">Admin Compliance Officer</div>
                          <div className="text-[10px] text-purple-600">Verifies credentials & audits logs</div>
                        </div>
                      </button>
                    </div>

                    <div className="border-t border-slate-100 mt-2 pt-2 flex items-center justify-between">
                      <button
                        onClick={() => {
                          resetDemoData();
                          setShowPersonaMenu(false);
                        }}
                        className="text-[11px] text-slate-500 hover:text-red-600 flex items-center gap-1 font-medium transition cursor-pointer"
                        title="Reset all appointments, timeline, and consent grants back to initial state"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Reset Demo Data
                      </button>

                      <button
                        onClick={() => {
                          setShowPersonaMenu(false);
                          onOpenFirebaseGuide();
                        }}
                        className="text-[11px] text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <Info className="w-3 h-3" />
                        Info
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
