import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment, AppointmentStatus } from '../../types';
import {
  Calendar,
  Clock,
  Check,
  X,
  FileText,
  User,
  MapPin,
  Video,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface Props {
  onOpenPatientChart: (patientId: string) => void;
}

export const DoctorAppointments: React.FC<Props> = ({ onOpenPatientChart }) => {
  const {
    appointments,
    currentUser,
    currentDoctorProfile,
    updateAppointmentStatus,
  } = useApp();

  const docProfile = currentDoctorProfile;

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeNotesAptId, setActiveNotesAptId] = useState<string | null>(null);
  const [visitNotes, setVisitNotes] = useState('');
  const [recommendedFollowUp, setRecommendedFollowUp] = useState('');

  // Doctor's appointments
  const docApts = appointments.filter(
    a => a.doctorId === currentUser.uid || (docProfile && a.doctorId === docProfile.userId)
  );

  const filteredApts =
    filterStatus === 'all'
      ? docApts
      : docApts.filter(a => a.status === filterStatus);

  const handleCompleteWithNotes = (aptId: string) => {
    updateAppointmentStatus(aptId, 'completed', visitNotes.trim());
    setActiveNotesAptId(null);
    setVisitNotes('');
    setRecommendedFollowUp('');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Consultation Queue & Appointment Management
          </h1>
          <p className="text-sm text-slate-600">
            Accept consultation requests, conduct examinations, and record post-visit clinical summaries.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs">
        {['all', 'requested', 'confirmed', 'completed', 'cancelled'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 rounded-xl capitalize transition cursor-pointer ${
              filterStatus === status
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {status} ({status === 'all' ? docApts.length : docApts.filter(a => a.status === status).length})
          </button>
        ))}
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredApts.map(apt => (
          <div
            key={apt.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 hover:shadow-md transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                    apt.status === 'confirmed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : apt.status === 'requested'
                      ? 'bg-amber-100 text-amber-800'
                      : apt.status === 'completed'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {apt.status}
                  </span>
                  <span className="text-xs text-slate-400">ID: {apt.id}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>{apt.patientName}</span>
                </h3>

                <div className="text-xs text-slate-600 flex items-center gap-2">
                  {apt.type === 'telehealth' ? (
                    <span className="flex items-center gap-1 text-sky-700 font-semibold">
                      <Video className="w-3.5 h-3.5" />
                      Telehealth Video Call
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-teal-700 font-semibold">
                      <MapPin className="w-3.5 h-3.5" />
                      In-Person Clinic Visit
                    </span>
                  )}
                </div>
              </div>

              {/* Date & Time */}
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-right shrink-0">
                <div className="text-xs font-bold text-slate-900">{apt.date}</div>
                <div className="text-xs font-semibold text-blue-700 flex items-center justify-end gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{apt.timeSlot}</span>
                </div>
              </div>
            </div>

            {/* Patient Complaint */}
            <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700">
              <span className="font-semibold text-slate-900">Patient Reason for Visit: </span>
              {apt.reason}
            </div>

            {/* Completed Doctor Notes */}
            {apt.doctorNotes && (
              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-xs text-slate-800 space-y-1">
                <span className="font-semibold text-blue-900">Your Clinical Summary & Recommendations:</span>
                <p className="italic text-slate-700">"{apt.doctorNotes}"</p>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => onOpenPatientChart(apt.patientId)}
                className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
              >
                <span>Check Patient Chart & Consent</span>
              </button>

              <div className="flex items-center gap-2">
                {apt.status === 'requested' && (
                  <>
                    <button
                      onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1 transition cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept Request</span>
                    </button>
                    <button
                      onClick={() => updateAppointmentStatus(apt.id, 'cancelled', 'Schedule conflict')}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-xl text-xs transition cursor-pointer"
                    >
                      Decline
                    </button>
                  </>
                )}

                {apt.status === 'confirmed' && (
                  <button
                    onClick={() => {
                      setActiveNotesAptId(apt.id);
                      setVisitNotes(apt.doctorNotes || '');
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Complete Visit & Add Notes</span>
                  </button>
                )}
              </div>
            </div>

            {/* In-line Visit Notes Form */}
            {activeNotesAptId === apt.id && (
              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-200 space-y-3 mt-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-blue-900 text-xs">Record Post-Visit Clinical Summary</h4>
                  <button onClick={() => setActiveNotesAptId(null)} className="text-slate-400 hover:text-slate-600 text-xs">
                    Cancel
                  </button>
                </div>

                <textarea
                  rows={3}
                  placeholder="Document physical findings, clinical assessment, patient vitals, and next steps..."
                  value={visitNotes}
                  onChange={e => setVisitNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />

                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => setActiveNotesAptId(null)}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg"
                  >
                    Discard
                  </button>
                  <button
                    onClick={() => handleCompleteWithNotes(apt.id)}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs"
                  >
                    Save & Mark Completed
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredApts.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-2">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No {filterStatus} consultations</h3>
            <p className="text-xs text-slate-500">
              There are no consultations matching the selected filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
