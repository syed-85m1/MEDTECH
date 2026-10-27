import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment } from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  XCircle,
  CheckCircle2,
  AlertCircle,
  FileText,
  Plus,
} from 'lucide-react';

interface Props {
  onOpenBookingModal: () => void;
}

export const PatientAppointments: React.FC<Props> = ({ onOpenBookingModal }) => {
  const { appointments, currentUser, cancelAppointment } = useApp();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [cancellingApt, setCancellingApt] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelError, setCancelError] = useState('');

  // Filter patient's appointments
  const patientApts = appointments.filter(a => a.patientId === currentUser.uid);

  const upcomingApts = patientApts.filter(a => a.status === 'confirmed' || a.status === 'requested');
  const completedApts = patientApts.filter(a => a.status === 'completed');
  const cancelledApts = patientApts.filter(a => a.status === 'cancelled');

  const handleConfirmCancel = () => {
    if (!cancelReason.trim()) {
      setCancelError('Please provide a reason for cancelling this appointment.');
      return;
    }
    if (cancellingApt) {
      cancelAppointment(cancellingApt.id, cancelReason.trim());
      setCancellingApt(null);
      setCancelReason('');
      setCancelError('');
    }
  };

  const currentList =
    activeTab === 'upcoming'
      ? upcomingApts
      : activeTab === 'completed'
      ? completedApts
      : cancelledApts;

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            My Appointments
          </h1>
          <p className="text-sm text-slate-600">
            View scheduled consultations, cancel requests, and review post-visit doctor notes.
          </p>
        </div>

        <button
          onClick={onOpenBookingModal}
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Book New Appointment</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === 'upcoming'
              ? 'border-teal-600 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Upcoming & Requested</span>
          <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px]">
            {upcomingApts.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === 'completed'
              ? 'border-teal-600 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Past Completed Visits</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px]">
            {completedApts.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('cancelled')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === 'cancelled'
              ? 'border-teal-600 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <XCircle className="w-4 h-4" />
          <span>Cancelled</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px]">
            {cancelledApts.length}
          </span>
        </button>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {currentList.map(apt => (
          <div
            key={apt.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4 hover:shadow-md transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                    {apt.doctorSpecialty}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                    apt.status === 'confirmed'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : apt.status === 'requested'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : apt.status === 'completed'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {apt.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{apt.doctorName}</h3>
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{apt.clinicName} — {apt.clinicAddress}</span>
                </div>
              </div>

              {/* Date & Time pill */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-right shrink-0 space-y-0.5">
                <div className="text-xs font-bold text-slate-900">
                  {new Date(apt.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
                <div className="text-xs font-semibold text-teal-700 flex items-center justify-end gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{apt.timeSlot}</span>
                </div>
                <div className="text-[10px] text-slate-500 flex items-center justify-end gap-1">
                  {apt.type === 'telehealth' ? (
                    <>
                      <Video className="w-3 h-3 text-sky-600" />
                      <span>Telehealth</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="w-3 h-3 text-teal-600" />
                      <span>In-Person</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Reason */}
            <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700">
              <span className="font-semibold text-slate-900">Patient Reason: </span>
              {apt.reason}
            </div>

            {/* Doctor Clinical Notes (if completed) */}
            {apt.doctorNotes && (
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-slate-800 space-y-1">
                <div className="font-semibold text-blue-900 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-700" />
                  <span>Doctor Visit Summary & Recommendations:</span>
                </div>
                <p className="text-slate-700 italic">"{apt.doctorNotes}"</p>
                {apt.followUpRecommended && (
                  <div className="text-[11px] font-semibold text-teal-800 pt-1">
                    Follow-up due: {new Date(apt.followUpRecommended).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                )}
              </div>
            )}

            {/* Cancellation Reason (if cancelled) */}
            {apt.cancellationReason && (
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 text-xs text-rose-800 space-y-1">
                <span className="font-semibold">Cancellation Reason: </span>
                <span>{apt.cancellationReason}</span>
              </div>
            )}

            {/* Bottom Actions */}
            {activeTab === 'upcoming' && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] text-slate-500">
                  Ref: {apt.id}
                </div>
                <button
                  onClick={() => {
                    setCancellingApt(apt);
                    setCancelReason('');
                    setCancelError('');
                  }}
                  className="px-3 py-1.5 text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition font-medium cursor-pointer"
                >
                  Cancel Appointment
                </button>
              </div>
            )}
          </div>
        ))}

        {currentList.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">
              No {activeTab} appointments found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {activeTab === 'upcoming'
                ? "You don't have any appointments scheduled right now. Connect with a specialist to book."
                : `No ${activeTab} visits recorded in your account history.`}
            </p>
            {activeTab === 'upcoming' && (
              <button
                onClick={onOpenBookingModal}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold transition"
              >
                Book Appointment
              </button>
            )}
          </div>
        )}
      </div>

      {/* Cancellation Modal */}
      {cancellingApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                Cancel Appointment
              </h3>
              <button onClick={() => setCancellingApt(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Are you sure you want to cancel your consultation with <strong>{cancellingApt.doctorName}</strong> on <strong>{cancellingApt.date} at {cancellingApt.timeSlot}</strong>?
            </p>

            {cancelError && (
              <div className="p-2.5 bg-rose-50 rounded-lg text-xs text-rose-700 border border-rose-200">
                {cancelError}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Cancellation Reason <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Please state why you need to cancel (e.g., schedule conflict, resolved issue)..."
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setCancellingApt(null)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
              >
                Keep Appointment
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition cursor-pointer"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
