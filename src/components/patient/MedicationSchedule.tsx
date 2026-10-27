import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Pill,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Calendar,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const MedicationSchedule: React.FC = () => {
  const { medicalRecords, currentUser, toggleMedicationTaken } = useApp();

  const prescriptions = medicalRecords.filter(
    r => r.patientId === currentUser.uid && r.type === 'prescription'
  );

  const takenCount = prescriptions.filter(p => p.isTakenToday).length;

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Pill className="w-6 h-6 text-emerald-600" />
            Active Prescriptions & Medication Schedule
          </h1>
          <p className="text-sm text-slate-600">
            Medication instructions and dosage guidelines entered by your authorized physician.
          </p>
        </div>

        {/* Adherence progress badge */}
        <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
            {prescriptions.length > 0 ? Math.round((takenCount / prescriptions.length) * 100) : 100}%
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-900">Today's Adherence</div>
            <div className="text-[11px] text-emerald-700">
              {takenCount} of {prescriptions.length} doses logged
            </div>
          </div>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl flex items-start gap-3 text-xs text-teal-900">
        <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Authorized Clinical Instructions: </span>
          All medications displayed here were directly entered into your timeline by licensed medical professionals. Always follow the prescribed frequency and contact your clinic with any adverse reactions.
        </div>
      </div>

      {/* Prescription Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {prescriptions.map(med => (
          <div
            key={med.id}
            className={`rounded-2xl border p-6 space-y-4 transition shadow-xs ${
              med.isTakenToday
                ? 'bg-emerald-50/30 border-emerald-200'
                : 'bg-white border-slate-200 hover:shadow-md'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {med.dosage || 'Prescription'}
                </span>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {med.title}
                </h3>
                {med.code && (
                  <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {med.code}
                  </span>
                )}
              </div>

              {/* Adherence Checkbox Button */}
              <button
                onClick={() => toggleMedicationTaken(med.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs ${
                  med.isTakenToday
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{med.isTakenToday ? 'Taken Today' : 'Mark as Taken'}</span>
              </button>
            </div>

            {/* Dosage & Timing */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Frequency</span>
                <strong className="text-slate-800">{med.frequency}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Duration</span>
                <strong className="text-slate-800">{med.duration || 'Ongoing review'}</strong>
              </div>
            </div>

            {/* Doctor Instructions */}
            {med.instructions && (
              <div className="space-y-1 text-xs">
                <span className="font-semibold text-slate-900 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-teal-600" />
                  Prescribing Doctor's Instructions:
                </span>
                <p className="p-3 bg-teal-50/50 rounded-xl border border-teal-100 text-teal-950 leading-relaxed">
                  {med.instructions}
                </p>
              </div>
            )}

            {/* Prescriber Footer */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <div>
                Prescribed by: <strong>{med.doctorName || 'Authorized Physician'}</strong>
              </div>
              <div>Issued: {med.date}</div>
            </div>
          </div>
        ))}
      </div>

      {prescriptions.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <Pill className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Active Prescriptions</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You do not currently have any active medications entered into your clinical record.
          </p>
        </div>
      )}
    </div>
  );
};
