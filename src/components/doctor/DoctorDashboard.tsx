import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Stethoscope,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock,
  Users,
  Lock,
  ArrowRight,
  FilePlus,
  Shield,
  Activity,
  UserCheck,
} from 'lucide-react';

interface Props {
  onSelectTab: (tab: string) => void;
}

export const DoctorDashboard: React.FC<Props> = ({ onSelectTab }) => {
  const {
    currentUser,
    currentDoctorProfile,
    appointments,
    accessGrants,
    medicalRecords,
  } = useApp();

  const docProfile = currentDoctorProfile;

  // Doctor's appointments
  const docAppointments = appointments.filter(
    a => a.doctorId === currentUser.uid || (docProfile && a.doctorId === docProfile.userId)
  );

  const upcomingApts = docAppointments.filter(
    a => a.status === 'confirmed' || a.status === 'requested'
  );

  // Consented patients (who have active grants for this doctor)
  const activeConsents = accessGrants.filter(
    g => (g.doctorId === currentUser.uid || (docProfile && g.doctorId === docProfile.userId)) && g.status === 'active'
  );

  return (
    <div className="space-y-6 pb-16">
      {/* Verification Status Banner */}
      {docProfile?.isVerified ? (
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <span className="font-bold text-emerald-950 text-sm">
                Verified Medical Practitioner
              </span>
              <p className="text-emerald-700">
                License #{docProfile.licenseNumber} verified with {docProfile.medicalBoard}. Your profile is prominently featured to patients.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-600 text-white font-semibold rounded-full text-[11px] shrink-0">
            Active Status
          </span>
        </div>
      ) : (
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <span className="font-bold text-amber-950 text-sm">
                Credential Verification Under Administrator Review
              </span>
              <p className="text-amber-700">
                Your medical license credentials ({docProfile?.licenseNumber}) are queued for Administrator verification. You can still view scheduled appointments and manage your profile.
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectTab('doctor-profile')}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-xs shrink-0 transition cursor-pointer"
          >
            Review Credentials
          </button>
        </div>
      )}

      {/* Doctor Welcome Header */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold border border-blue-400/30">
              Physician Consultation Desk
            </span>
            <span className="text-xs text-slate-400">{docProfile?.specialty}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {docProfile?.name || currentUser.displayName}
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            {docProfile?.clinicName} — {docProfile?.clinicAddress}
          </p>
        </div>

        {/* Quick CTA buttons */}
        <div className="flex sm:flex-col gap-2.5 shrink-0">
          <button
            onClick={() => onSelectTab('doctor-patient-records')}
            className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Lock className="w-4 h-4" />
            <span>Consented Patient Records</span>
          </button>
          <button
            onClick={() => onSelectTab('doctor-appointments')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Calendar className="w-4 h-4" />
            <span>Consultation Queue ({upcomingApts.length})</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Upcoming Consultations</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{upcomingApts.length}</div>
          <div className="text-[11px] text-teal-600 font-medium">Scheduled visits</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Active Patient Consents</span>
            <Lock className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{activeConsents.length}</div>
          <div className="text-[11px] text-teal-600 font-medium">Authorized clinical access</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Completed Consultations</span>
            <Activity className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {docAppointments.filter(a => a.status === 'completed').length}
          </div>
          <div className="text-[11px] text-slate-500">Historical encounters</div>
        </div>
      </div>

      {/* Main Grid: Upcoming queue & quick records access */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Today's Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h2 className="text-base font-bold text-slate-900">Upcoming Patient Consultations</h2>
              </div>
              <button
                onClick={() => onSelectTab('doctor-appointments')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Full Queue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {upcomingApts.length > 0 ? (
              <div className="space-y-3">
                {upcomingApts.map(apt => (
                  <div
                    key={apt.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{apt.patientName}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          apt.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                      <div className="text-slate-600 line-clamp-1">
                        <strong>Reason:</strong> {apt.reason}
                      </div>
                      <div className="text-slate-400 text-[11px]">Type: {apt.type}</div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="font-bold text-slate-900">{apt.date}</div>
                        <div className="text-teal-700 font-semibold">{apt.timeSlot}</div>
                      </div>
                      <button
                        onClick={() => onSelectTab('doctor-patient-records')}
                        className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold transition cursor-pointer"
                      >
                        Open Chart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-500">
                No consultations currently in queue.
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 col): Consented Patient Access Gate */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900">Consented Patients</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold">
                {activeConsents.length} Granted
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              In accordance with Zero-Trust access control, you can only view health histories for patients who have granted your profile active consent.
            </p>

            <div className="space-y-2.5">
              {activeConsents.map(grant => (
                <div
                  key={grant.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">Sarah Jenkins</div>
                    <div className="text-[10px] text-slate-500">Expires: {new Date(grant.expiresAt).toLocaleDateString()}</div>
                  </div>
                  <button
                    onClick={() => onSelectTab('doctor-patient-records')}
                    className="px-2.5 py-1 bg-white hover:bg-teal-50 border border-slate-200 text-teal-800 font-semibold rounded-lg text-xs transition cursor-pointer"
                  >
                    View Timeline
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => onSelectTab('doctor-patient-records')}
              className="w-full py-2.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-900 text-slate-700 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FilePlus className="w-4 h-4 text-teal-600" />
              <span>Record Clinical Encounter</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
