/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { MobileNavigation } from './components/layout/MobileNavigation';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { PWAInstallButton } from './components/pwa/PWAInstallButton';
import { PatientDashboard } from './components/patient/PatientDashboard';
import { DoctorDiscovery } from './components/patient/DoctorDiscovery';
import { PatientAppointments } from './components/patient/PatientAppointments';
import { HealthTimeline } from './components/patient/HealthTimeline';
import { RecordAccessControl } from './components/patient/RecordAccessControl';
import { MedicationSchedule } from './components/patient/MedicationSchedule';
import { AppointmentBookingModal } from './components/patient/AppointmentBookingModal';
import { ExportRecordsModal } from './components/patient/ExportRecordsModal';
import { DoctorDashboard } from './components/doctor/DoctorDashboard';
import { DoctorAppointments } from './components/doctor/DoctorAppointments';
import { DoctorPatientRecords } from './components/doctor/DoctorPatientRecords';
import { DoctorProfileSettings } from './components/doctor/DoctorProfileSettings';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminAuditLogs } from './components/admin/AdminAuditLogs';
import { FirebaseSetupGuideModal } from './components/modals/FirebaseSetupGuideModal';
import { DoctorProfile } from './types';
import {
  ShieldCheck,
  HeartPulse,
  Database,
  Smartphone,
  Info,
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeRole, doctors } = useApp();

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [bookingDoctor, setBookingDoctor] = useState<DoctorProfile | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showFirebaseGuide, setShowFirebaseGuide] = useState(false);
  const [selectedPatientIdForChart, setSelectedPatientIdForChart] = useState<string | undefined>(undefined);

  // Switch tab when active role changes
  React.useEffect(() => {
    if (activeRole === 'patient') {
      setCurrentTab('dashboard');
    } else if (activeRole === 'doctor') {
      setCurrentTab('doctor-dashboard');
    } else if (activeRole === 'admin') {
      setCurrentTab('admin-dashboard');
    }
  }, [activeRole]);

  const handleOpenBooking = (doctorOrId?: DoctorProfile | string) => {
    if (typeof doctorOrId === 'string') {
      const doc = doctors.find(d => d.userId === doctorOrId || d.id === doctorOrId);
      setBookingDoctor(doc || null);
    } else {
      setBookingDoctor(doctorOrId || null);
    }
    setShowBookingModal(true);
  };

  const handleOpenDoctorChart = (patientId: string) => {
    setSelectedPatientIdForChart(patientId);
    setCurrentTab('doctor-patient-records');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* PWA In-App Install Banner */}
      <PWAInstallButton variant="banner" />

      {/* Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenFirebaseGuide={() => setShowFirebaseGuide(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Patient Portal Views */}
        {activeRole === 'patient' && (
          <>
            {currentTab === 'dashboard' && (
              <PatientDashboard
                onSelectTab={setCurrentTab}
                onOpenBookingModal={handleOpenBooking}
                onOpenExportModal={() => setShowExportModal(true)}
              />
            )}
            {currentTab === 'find-doctors' && (
              <DoctorDiscovery
                onBookAppointment={doctor => handleOpenBooking(doctor)}
              />
            )}
            {currentTab === 'appointments' && (
              <PatientAppointments
                onOpenBookingModal={() => handleOpenBooking()}
              />
            )}
            {currentTab === 'timeline' && (
              <HealthTimeline
                onOpenExportModal={() => setShowExportModal(true)}
              />
            )}
            {currentTab === 'medications' && (
              <MedicationSchedule />
            )}
            {currentTab === 'access-control' && (
              <RecordAccessControl />
            )}
          </>
        )}

        {/* Doctor Portal Views */}
        {activeRole === 'doctor' && (
          <>
            {currentTab === 'doctor-dashboard' && (
              <DoctorDashboard onSelectTab={setCurrentTab} />
            )}
            {currentTab === 'doctor-appointments' && (
              <DoctorAppointments onOpenPatientChart={handleOpenDoctorChart} />
            )}
            {currentTab === 'doctor-patient-records' && (
              <DoctorPatientRecords initialPatientId={selectedPatientIdForChart} />
            )}
            {currentTab === 'doctor-profile' && (
              <DoctorProfileSettings />
            )}
          </>
        )}

        {/* Admin Desk Views */}
        {activeRole === 'admin' && (
          <>
            {currentTab === 'admin-dashboard' && (
              <AdminDashboard onSelectTab={setCurrentTab} />
            )}
            {currentTab === 'admin-audit-logs' && (
              <AdminAuditLogs />
            )}
          </>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNavigation
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
      />

      {/* Offline Alert Indicator */}
      <OfflineIndicator />

      {/* Modals */}
      {showBookingModal && (
        <AppointmentBookingModal
          initialDoctor={bookingDoctor}
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => {
            setShowBookingModal(false);
            if (activeRole === 'patient') {
              setCurrentTab('appointments');
            }
          }}
        />
      )}

      {showExportModal && (
        <ExportRecordsModal onClose={() => setShowExportModal(false)} />
      )}

      {showFirebaseGuide && (
        <FirebaseSetupGuideModal onClose={() => setShowFirebaseGuide(false)} />
      )}

      {/* Clean Footer with Prototype & Tech Stack details */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-6 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-teal-600" />
            <span className="font-bold text-slate-800">MediLink — Your Health, Connected</span>
            <span className="text-slate-300">|</span>
            <span>College Innovation Prototype</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <button
              onClick={() => setShowFirebaseGuide(true)}
              className="hover:text-teal-700 flex items-center gap-1 cursor-pointer font-medium"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Firebase Architecture</span>
            </button>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero-Trust ABAC Security</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5 text-teal-600" />
              <span>PWA Ready</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
