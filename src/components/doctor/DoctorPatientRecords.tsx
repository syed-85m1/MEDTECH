import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DEMO_PATIENT } from '../../lib/mockData';
import {
  Lock,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Plus,
  Activity,
  Pill,
  FileCheck2,
  Calendar,
  CheckCircle2,
  Clock,
  Send,
  User,
} from 'lucide-react';

interface Props {
  initialPatientId?: string;
}

export const DoctorPatientRecords: React.FC<Props> = ({ initialPatientId }) => {
  const {
    currentUser,
    currentDoctorProfile,
    accessGrants,
    medicalRecords,
    addMedicalRecord,
  } = useApp();

  const docProfile = currentDoctorProfile;
  const currentDocId = docProfile?.userId || currentUser.uid;

  // Patient target: default to Sarah Jenkins
  const patient = DEMO_PATIENT;

  // Check if patient has granted active consent to this doctor
  const hasConsent = accessGrants.some(
    g => g.patientId === patient.uid && g.doctorId === currentDocId && g.status === 'active'
  );

  // Form states to add new encounter entries
  const [showAddForm, setShowAddForm] = useState(false);
  const [formType, setFormType] = useState<'diagnosis' | 'prescription'>('diagnosis');
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild');
  const [description, setDescription] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [instructions, setInstructions] = useState('');
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Filter records belonging to the patient
  const patientRecords = medicalRecords.filter(r => r.patientId === patient.uid);

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (formType === 'diagnosis') {
      addMedicalRecord({
        patientId: patient.uid,
        doctorId: currentDocId,
        doctorName: docProfile?.name || currentUser.displayName,
        doctorSpecialty: docProfile?.specialty || 'Attending Physician',
        date: new Date().toISOString().split('T')[0],
        type: 'diagnosis',
        title: title.trim(),
        code: code.trim() || 'ICD-10 Code',
        severity,
        description: description.trim(),
        doctorSignature: `${docProfile?.name || currentUser.displayName} [Verified Clinical Entry]`,
      });
      setFormSuccess(`Diagnosis "${title}" successfully recorded to patient health timeline.`);
    } else if (formType === 'prescription') {
      addMedicalRecord({
        patientId: patient.uid,
        doctorId: currentDocId,
        doctorName: docProfile?.name || currentUser.displayName,
        doctorSpecialty: docProfile?.specialty || 'Attending Physician',
        date: new Date().toISOString().split('T')[0],
        type: 'prescription',
        title: title.trim(),
        code: code.trim() || 'RxNorm',
        dosage: dosage.trim(),
        frequency: frequency.trim(),
        instructions: instructions.trim(),
        description: description.trim() || 'Prescribed oral medication',
        doctorSignature: `${docProfile?.name || currentUser.displayName} [Electronic Prescription Stamp]`,
      });
      setFormSuccess(`Prescription "${title}" added to patient medication schedule.`);
    }

    // Reset form
    setTitle('');
    setCode('');
    setDescription('');
    setDosage('');
    setFrequency('');
    setInstructions('');
    setTimeout(() => {
      setFormSuccess(null);
      setShowAddForm(false);
    }, 2500);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Lock className="w-6 h-6 text-blue-600" />
            Patient Clinical Record & Health Chart
          </h1>
          <p className="text-sm text-slate-600">
            Attribute-Based Access Control (ABAC) verified chart viewer.
          </p>
        </div>

        {hasConsent && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'Close Encounter Form' : 'Add Diagnosis or Prescription'}</span>
          </button>
        )}
      </div>

      {/* Patient Identifier Banner */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-base">
            SJ
          </div>
          <div>
            <div className="text-base font-bold text-slate-900">{patient.displayName}</div>
            <div className="text-xs text-slate-500">
              DOB: {patient.dateOfBirth} • Blood: {patient.bloodType} • ID: {patient.uid}
            </div>
          </div>
        </div>

        <div>
          {hasConsent ? (
            <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Patient Consent: ACTIVE (Authorized Provider)
            </span>
          ) : (
            <span className="px-3 py-1.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Patient Consent: NOT GRANTED (Access Blocked)
            </span>
          )}
        </div>
      </div>

      {/* STRICT ZERO-TRUST ACCESS GATE */}
      {!hasConsent ? (
        <div className="bg-white rounded-3xl border border-rose-200 p-8 sm:p-12 text-center shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Access Blocked: Explicit Patient Consent Required
          </h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Under MediLink zero-trust clinical isolation, a doctor cannot view health histories or diagnoses simply by possessing a patient's ID. Patient <strong>Sarah Jenkins</strong> has not granted active consent to your doctor account (<strong>{docProfile?.name || currentUser.displayName}</strong>).
          </p>

          <div className="p-4 bg-slate-50 rounded-2xl max-w-md mx-auto text-left text-xs text-slate-600 space-y-2 border border-slate-200">
            <div className="font-bold text-slate-900">How to test access control in this competition prototype:</div>
            <p>1. Switch persona to <strong>Sarah Jenkins (Patient)</strong> via the top-right persona selector.</p>
            <p>2. Navigate to <strong>Record Access Control</strong> and click <strong>"Grant Access to Doctor"</strong>.</p>
            <p>3. Authorize this doctor, then switch back to view the unlocked medical records.</p>
          </div>
        </div>
      ) : (
        /* Unlocked Clinical Chart View */
        <div className="space-y-6">
          {formSuccess && (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{formSuccess}</span>
            </div>
          )}

          {/* Add Clinical Encounter Drawer */}
          {showAddForm && (
            <div className="bg-white rounded-2xl border border-teal-200 p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-600" />
                  Record New Clinical Encounter Entry
                </h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormType('diagnosis')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition ${
                      formType === 'diagnosis' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Diagnosis
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormType('prescription')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition ${
                      formType === 'prescription' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Prescription
                  </button>
                </div>
              </div>

              <form onSubmit={handleCreateRecord} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">
                      {formType === 'diagnosis' ? 'Condition / Diagnosis Name' : 'Medication Name & Formulation'} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={formType === 'diagnosis' ? 'e.g., Atrial Fibrillation' : 'e.g., Metoprolol Tartrate 25mg'}
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">
                      {formType === 'diagnosis' ? 'ICD-10 Code' : 'RxNorm Code / NDC'}
                    </label>
                    <input
                      type="text"
                      placeholder={formType === 'diagnosis' ? 'e.g., I48.0' : 'e.g., 866514'}
                      value={code}
                      onChange={e => setCode(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                    />
                  </div>
                </div>

                {formType === 'diagnosis' ? (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Clinical Severity</label>
                      <select
                        value={severity}
                        onChange={e => setSeverity(e.target.value as any)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs"
                      >
                        <option value="mild">Mild (Early stage, monitor)</option>
                        <option value="moderate">Moderate (Standard treatment required)</option>
                        <option value="severe">Severe (High risk / Intensive intervention)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Clinical Findings & Notes</label>
                      <textarea
                        rows={3}
                        placeholder="Document observations, etiology, baseline vitals, and treatment plan..."
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs resize-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700">Dosage</label>
                        <input
                          type="text"
                          placeholder="e.g., 25 mg twice daily"
                          value={dosage}
                          onChange={e => setDosage(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700">Frequency & Duration</label>
                        <input
                          type="text"
                          placeholder="e.g., Take with meals for 30 days"
                          value={frequency}
                          onChange={e => setFrequency(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Patient Intake Instructions</label>
                      <textarea
                        rows={2}
                        placeholder="Specific intake guidance, warnings, and when to contact physician..."
                        value={instructions}
                        onChange={e => setInstructions(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs resize-none"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold shadow-xs cursor-pointer"
                  >
                    Record to Patient Timeline
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Patient Timeline Overview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Patient Clinical History ({patientRecords.length} Entries)
            </h3>

            <div className="divide-y divide-slate-100">
              {patientRecords.map(rec => (
                <div key={rec.id} className="py-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {rec.type.replace('_', ' ')}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">{rec.title}</span>
                    </div>
                    <span className="text-slate-400 font-medium">{rec.date}</span>
                  </div>

                  <p className="text-slate-600 leading-relaxed">{rec.description}</p>

                  {rec.instructions && (
                    <div className="p-2.5 bg-slate-50 rounded-lg text-slate-700">
                      <strong>Instructions: </strong> {rec.instructions}
                    </div>
                  )}

                  <div className="text-[11px] text-slate-400">
                    Authored by: {rec.doctorName || 'Authorized Clinician'} • {rec.doctorSignature || 'Verified Entry'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
