import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DoctorProfile, ConsultationType } from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  X,
  CheckCircle2,
  Stethoscope,
  AlertCircle,
} from 'lucide-react';

interface Props {
  initialDoctor?: DoctorProfile | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const AppointmentBookingModal: React.FC<Props> = ({
  initialDoctor,
  onClose,
  onSuccess,
}) => {
  const { doctors, currentUser, bookAppointment } = useApp();

  const [selectedDoctorId, setSelectedDoctorId] = useState(
    initialDoctor ? initialDoctor.userId || initialDoctor.id : doctors[0]?.userId || ''
  );

  const selectedDoctor =
    doctors.find(d => d.userId === selectedDoctorId || d.id === selectedDoctorId) || doctors[0];

  // Default date: tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const [date, setDate] = useState(minDate);
  const [timeSlot, setTimeSlot] = useState(selectedDoctor?.timeSlots[0] || '10:00 AM');
  const [type, setType] = useState<ConsultationType>('in-person');
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingCompleted, setBookingCompleted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please provide a reason or symptom description for your consultation.');
      return;
    }

    if (!selectedDoctor) {
      setError('Please select a healthcare provider.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      bookAppointment({
        patientId: currentUser.uid,
        patientName: currentUser.displayName,
        doctorId: selectedDoctor.userId,
        doctorName: selectedDoctor.name,
        doctorSpecialty: selectedDoctor.specialty,
        clinicName: selectedDoctor.clinicName,
        clinicAddress: `${selectedDoctor.clinicAddress}, ${selectedDoctor.city}`,
        date,
        timeSlot,
        status: 'confirmed',
        type,
        reason: reason.trim(),
      });

      setBookingCompleted(true);
      setTimeout(() => {
        onSuccess();
      }, 1800);
    } catch (err) {
      setError('An error occurred while booking. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-50 text-teal-700 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Book Medical Appointment</h2>
              <p className="text-xs text-slate-500">Schedule your consultation with verified doctor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {bookingCompleted ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Appointment Confirmed!</h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Your consultation with <strong>{selectedDoctor?.name}</strong> has been scheduled for <strong>{date}</strong> at <strong>{timeSlot}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Doctor Selector */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Select Doctor / Specialist</label>
              <select
                value={selectedDoctorId}
                onChange={e => {
                  setSelectedDoctorId(e.target.value);
                  const doc = doctors.find(d => d.userId === e.target.value || d.id === e.target.value);
                  if (doc?.timeSlots[0]) setTimeSlot(doc.timeSlots[0]);
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              >
                {doctors.map(doc => (
                  <option key={doc.id} value={doc.userId}>
                    {doc.name} ({doc.specialty}) — ${doc.fee}
                  </option>
                ))}
              </select>
            </div>

            {/* Doctor mini preview */}
            {selectedDoctor && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-3">
                <img
                  src={selectedDoctor.avatarUrl}
                  alt={selectedDoctor.name}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div className="truncate">
                  <div className="font-bold text-slate-900 truncate">{selectedDoctor.clinicName}</div>
                  <div className="text-[11px] text-slate-500 truncate">{selectedDoctor.clinicAddress}, {selectedDoctor.city}</div>
                </div>
              </div>
            )}

            {/* Consultation Mode */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Consultation Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType('in-person')}
                  className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
                    type === 'in-person'
                      ? 'border-teal-600 bg-teal-50/60 text-teal-900 font-semibold ring-1 ring-teal-600'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                  <div>
                    <div className="leading-tight">In-Person Visit</div>
                    <div className="text-[10px] text-slate-500 font-normal">Physical clinic exam</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setType('telehealth')}
                  className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
                    type === 'telehealth'
                      ? 'border-teal-600 bg-teal-50/60 text-teal-900 font-semibold ring-1 ring-teal-600'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <Video className="w-4 h-4 text-sky-600 shrink-0" />
                  <div>
                    <div className="leading-tight">Telehealth Video</div>
                    <div className="text-[10px] text-slate-500 font-normal">Remote secure call</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Date and Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Appointment Date</label>
                <input
                  type="date"
                  min={minDate}
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Available Time Slot</label>
                <select
                  value={timeSlot}
                  onChange={e => setTimeSlot(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                >
                  {selectedDoctor?.timeSlots.map(slot => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Chief Complaint / Reason */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">
                Reason for Visit / Primary Symptoms <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Briefly describe your symptoms, duration, or purpose (e.g., routine medication review, checkup, renewal)..."
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 resize-none"
              />
              <div className="text-[10px] text-slate-400">
                This information helps the doctor prepare your clinical chart prior to your consultation.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Confirming...' : 'Confirm Appointment'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
