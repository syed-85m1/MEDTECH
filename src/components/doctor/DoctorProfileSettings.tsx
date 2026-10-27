import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Building2,
  Clock,
  DollarSign,
  GraduationCap,
  Save,
  Shield,
  Upload,
} from 'lucide-react';

export const DoctorProfileSettings: React.FC = () => {
  const { currentDoctorProfile, updateDoctorProfile, currentUser } = useApp();

  const doc = currentDoctorProfile;

  const [clinicName, setClinicName] = useState(doc?.clinicName || '');
  const [clinicAddress, setClinicAddress] = useState(doc?.clinicAddress || '');
  const [city, setCity] = useState(doc?.city || '');
  const [phone, setPhone] = useState(doc?.phone || '');
  const [fee, setFee] = useState(doc?.fee || 150);
  const [consultationHours, setConsultationHours] = useState(doc?.consultationHours || '');
  const [bio, setBio] = useState(doc?.bio || '');
  const [education, setEducation] = useState(doc?.education || '');
  const [licenseNumber, setLicenseNumber] = useState(doc?.licenseNumber || '');
  const [medicalBoard, setMedicalBoard] = useState(doc?.medicalBoard || '');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [credentialSubmitted, setCredentialSubmitted] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doc) return;

    updateDoctorProfile(doc.id, {
      clinicName,
      clinicAddress,
      city,
      phone,
      fee: Number(fee),
      consultationHours,
      bio,
      education,
      licenseNumber,
      medicalBoard,
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResubmitCredentials = () => {
    if (!doc) return;
    updateDoctorProfile(doc.id, {
      licenseNumber,
      medicalBoard,
      verificationStatus: 'pending',
      isVerified: false,
    });
    setCredentialSubmitted(true);
    setTimeout(() => setCredentialSubmitted(false), 4000);
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Professional Profile & Credentials
        </h1>
        <p className="text-sm text-slate-600">
          Manage your clinical practice information, consultation fees, and state licensing credentials.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {credentialSubmitted && (
        <div className="p-3 bg-blue-50 text-blue-800 rounded-xl border border-blue-200 text-xs flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-600" />
          <span>Medical board credentials submitted for Administrator compliance audit.</span>
        </div>
      )}

      {/* Verification Status Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-teal-600" />
            <h3 className="text-base font-bold text-slate-900">Administrator Verification Status</h3>
          </div>
          {doc?.isVerified ? (
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified Physician
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Pending Admin Review
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Medical License Number</label>
            <input
              type="text"
              value={licenseNumber}
              onChange={e => setLicenseNumber(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Medical Board / State Licensing Authority</label>
            <input
              type="text"
              value={medicalBoard}
              onChange={e => setMedicalBoard(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between text-xs">
          <p className="text-slate-500 text-[11px] max-w-md">
            To prevent self-assigned verified badges, all updates to medical license numbers must be audited and approved by the platform Administrator.
          </p>
          <button
            onClick={handleResubmitCredentials}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-semibold transition cursor-pointer"
          >
            Submit for Admin Audit
          </button>
        </div>
      </div>

      {/* Clinic & Profile Settings Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 text-xs">
        <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
          Clinic Information & Consultation Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Clinic / Hospital Affiliation</label>
            <input
              type="text"
              value={clinicName}
              onChange={e => setClinicName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Clinic Phone</label>
            <input
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Clinic Street Address</label>
            <input
              type="text"
              value={clinicAddress}
              onChange={e => setClinicAddress(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">City, State & ZIP</label>
            <input
              type="text"
              value={city}
              onChange={e => setCity(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Standard Consultation Fee ($ USD)</label>
            <input
              type="number"
              value={fee}
              onChange={e => setFee(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Consultation Hours</label>
            <input
              type="text"
              value={consultationHours}
              onChange={e => setConsultationHours(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-slate-700">Medical School & Qualifications</label>
          <input
            type="text"
            value={education}
            onChange={e => setEducation(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200"
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-slate-700">Professional Bio & Clinical Philosophy</label>
          <textarea
            rows={4}
            value={bio}
            onChange={e => setBio(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 resize-none leading-relaxed"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Updates</span>
          </button>
        </div>
      </form>
    </div>
  );
};
