import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Search,
  ArrowRight,
  Shield,
  FileDown,
  Pill,
  HeartPulse,
  ExternalLink,
  ChevronRight,
  Video,
} from 'lucide-react';

interface Props {
  onSelectTab: (tab: string) => void;
  onOpenBookingModal: (doctorId?: string) => void;
  onOpenExportModal: () => void;
}

export const PatientDashboard: React.FC<Props> = ({
  onSelectTab,
  onOpenBookingModal,
  onOpenExportModal,
}) => {
  const {
    currentUser,
    appointments,
    medicalRecords,
    accessGrants,
    followUps,
    completeFollowUp,
  } = useApp();

  // Find next upcoming appointment
  const upcomingAppointment = appointments
    .filter(a => a.status === 'confirmed' || a.status === 'requested')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  // Find most recent completed appointment
  const lastCompletedAppointment = appointments
    .filter(a => a.status === 'completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  // Pending follow-ups
  const activeFollowUps = followUps.filter(fu => fu.status === 'pending');

  // Severe allergies for quick safety badge
  const severeAllergies = medicalRecords.filter(
    r => r.type === 'allergy' && r.severity === 'severe'
  );

  // Active doctor access grants
  const activeGrants = accessGrants.filter(g => g.status === 'active');

  // Recent timeline events
  const recentTimeline = [...medicalRecords]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6 pb-16">
      {/* Patient Welcome Header */}
      <div className="bg-gradient-to-br from-teal-700 via-teal-800 to-sky-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Abstract decorative accents */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5 pointer-events-none blur-xl" />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-teal-400/10 pointer-events-none blur-lg" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-teal-100 text-xs font-semibold backdrop-blur-xs">
                Patient Medical Portal
              </span>
              <span className="text-xs text-teal-200">ID: {currentUser.uid.slice(-6)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good day, {currentUser.displayName}
            </h1>
            <p className="text-sm text-teal-100 max-w-xl">
              Your health timeline is securely encrypted. Only healthcare providers with your active, explicit consent can view your diagnoses and prescriptions.
            </p>

            {/* Quick Health Indicators Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-teal-100">
              {currentUser.bloodType && (
                <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <span>Blood Type: <strong>{currentUser.bloodType}</strong></span>
                </div>
              )}
              {currentUser.emergencyContact && (
                <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full border border-white/10">
                  <span>Emergency: <strong>{currentUser.emergencyContact.name} ({currentUser.emergencyContact.relationship})</strong></span>
                </div>
              )}
              {severeAllergies.length > 0 && (
                <div className="flex items-center gap-1.5 bg-rose-500/25 text-rose-200 px-3 py-1 rounded-full border border-rose-400/40">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-300" />
                  <span>Allergy Alert: <strong>{severeAllergies.map(a => a.title).join(', ')}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Quick CTA cluster */}
          <div className="flex sm:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => onSelectTab('find-doctors')}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white text-teal-800 hover:bg-teal-50 font-semibold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Search className="w-4 h-4 text-teal-600" />
              <span>Find Doctors</span>
            </button>
            <button
              onClick={onOpenExportModal}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-teal-600/60 hover:bg-teal-600 text-white font-medium text-xs border border-white/20 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <FileDown className="w-4 h-4 text-teal-200" />
              <span>Export Records</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Upcoming Appointment & Follow-ups */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Next Appointment & Last Visit */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Appointment Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-teal-50 text-teal-700 rounded-xl">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Next Upcoming Appointment</h2>
                  <p className="text-xs text-slate-500">Your scheduled consultation</p>
                </div>
              </div>
              {upcomingAppointment && (
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${
                  upcomingAppointment.status === 'confirmed'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {upcomingAppointment.status}
                </span>
              )}
            </div>

            {upcomingAppointment ? (
              <div className="mt-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="space-y-1">
                    <div className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                      {upcomingAppointment.doctorSpecialty}
                    </div>
                    <div className="text-lg font-bold text-slate-900">
                      {upcomingAppointment.doctorName}
                    </div>
                    <div className="text-xs text-slate-600 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{upcomingAppointment.clinicName} — {upcomingAppointment.clinicAddress}</span>
                    </div>
                  </div>

                  <div className="text-right sm:border-l sm:border-slate-200 sm:pl-4 space-y-1 shrink-0">
                    <div className="text-xs text-slate-500 font-medium">Scheduled Time</div>
                    <div className="text-base font-bold text-teal-800">
                      {new Date(upcomingAppointment.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                    <div className="text-xs text-slate-600 font-semibold flex items-center justify-end gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {upcomingAppointment.timeSlot}
                    </div>
                    <div className="text-[11px] text-teal-600 font-medium flex items-center justify-end gap-1">
                      {upcomingAppointment.type === 'telehealth' ? (
                        <>
                          <Video className="w-3 h-3" />
                          <span>Telehealth Consult</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-3 h-3" />
                          <span>In-Person Visit</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-teal-50/50 rounded-xl border border-teal-100 text-xs text-slate-700">
                  <span className="font-semibold text-teal-900">Reason for Consultation: </span>
                  {upcomingAppointment.reason}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Clinic verified & reminder active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectTab('appointments')}
                      className="px-3 py-1.5 text-xs text-teal-700 hover:text-teal-900 font-semibold hover:bg-teal-50 rounded-lg transition cursor-pointer"
                    >
                      Manage or Reschedule
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center space-y-3">
                <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm text-slate-600 font-medium">You have no upcoming appointments booked.</p>
                <button
                  onClick={() => onSelectTab('find-doctors')}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold transition shadow-xs cursor-pointer"
                >
                  Book a Consultation Now
                </button>
              </div>
            )}
          </div>

          {/* Last Completed Appointment Summary */}
          {lastCompletedAppointment && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-sky-600" />
                  <h3 className="text-sm font-bold text-slate-900">Last Completed Visit</h3>
                </div>
                <span className="text-xs text-slate-500">
                  {new Date(lastCompletedAppointment.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <div className="text-xs text-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{lastCompletedAppointment.doctorName} ({lastCompletedAppointment.doctorSpecialty})</span>
                  <span className="text-slate-500">{lastCompletedAppointment.clinicName}</span>
                </div>
                {lastCompletedAppointment.doctorNotes && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 italic text-slate-600">
                    "{lastCompletedAppointment.doctorNotes}"
                  </div>
                )}
                {lastCompletedAppointment.followUpRecommended && (
                  <div className="flex items-center justify-between text-teal-800 bg-teal-50 p-2.5 rounded-lg border border-teal-100 font-medium">
                    <span>Follow-up recommended by doctor:</span>
                    <strong>{new Date(lastCompletedAppointment.followUpRecommended).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Chronological Health Timeline Snippet */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Recent Health Records</h3>
                <p className="text-xs text-slate-500">Diagnoses, prescriptions & lab results</p>
              </div>
              <button
                onClick={() => onSelectTab('timeline')}
                className="text-xs font-semibold text-teal-600 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Full Timeline</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {recentTimeline.map(record => (
                <div key={record.id} className="py-3 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        record.type === 'diagnosis'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : record.type === 'prescription'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : record.type === 'allergy'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-sky-50 text-sky-700 border border-sky-200'
                      }`}>
                        {record.type.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-slate-400">{record.date}</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-900">{record.title}</div>
                    <p className="text-xs text-slate-600 line-clamp-1">{record.description}</p>
                  </div>
                  {record.code && (
                    <span className="text-[11px] font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded-md shrink-0">
                      {record.code}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Follow-up Reminders & Patient Consent Control */}
        <div className="space-y-6">
          {/* Follow-up Reminders Alert Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900">Follow-up Reminders</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold">
                {activeFollowUps.length} Pending
              </span>
            </div>

            {activeFollowUps.length > 0 ? (
              <div className="space-y-3">
                {activeFollowUps.map(fu => (
                  <div
                    key={fu.id}
                    className="p-3.5 rounded-xl border border-teal-100 bg-teal-50/40 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{fu.condition}</span>
                      <span className="text-[11px] font-semibold text-teal-800">
                        Due: {new Date(fu.recommendedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-slate-600">{fu.notes}</p>
                    <div className="text-[11px] text-slate-500">
                      Recommended by <strong>{fu.doctorName}</strong>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => completeFollowUp(fu.id)}
                        className="text-slate-500 hover:text-emerald-700 text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Mark Done
                      </button>
                      {!fu.appointmentBooked && (
                        <button
                          onClick={() => onSelectTab('find-doctors')}
                          className="px-2.5 py-1 bg-teal-600 text-white font-semibold rounded-md text-[10px] hover:bg-teal-700 transition cursor-pointer"
                        >
                          Book Visit
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-4">All follow-ups completed.</p>
            )}
          </div>

          {/* Patient Consent & Record Access Summary Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900">Record Access Grants</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                {activeGrants.length} Active
              </span>
            </div>

            <p className="text-xs text-slate-600">
              Doctors cannot view your health timeline without active patient authorization. You can revoke access at any time with instant effect.
            </p>

            <div className="space-y-2">
              {activeGrants.map(grant => (
                <div
                  key={grant.id}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="truncate">
                    <div className="font-bold text-slate-900 truncate">{grant.doctorName}</div>
                    <div className="text-[10px] text-teal-700">{grant.doctorSpecialty}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold shrink-0">
                    Consent Active
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => onSelectTab('access-control')}
              className="w-full py-2 bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Manage Record Permissions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Actions Shortcuts */}
          <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white rounded-2xl p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300">Quick Healthcare Shortcuts</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => onSelectTab('medications')}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition text-left space-y-1 cursor-pointer"
              >
                <Pill className="w-4 h-4 text-teal-300" />
                <div className="font-semibold">Medications</div>
                <div className="text-[10px] text-slate-300">Daily dosage tracker</div>
              </button>

              <button
                onClick={() => onSelectTab('find-doctors')}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition text-left space-y-1 cursor-pointer"
              >
                <Search className="w-4 h-4 text-sky-300" />
                <div className="font-semibold">Nearby Clinics</div>
                <div className="text-[10px] text-slate-300">GPS location search</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
