import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Lock,
  Shield,
  ShieldCheck,
  ShieldAlert,
  UserX,
  UserPlus,
  Clock,
  AlertCircle,
  CheckCircle2,
  X,
  FileCheck,
} from 'lucide-react';

export const RecordAccessControl: React.FC = () => {
  const {
    accessGrants,
    doctors,
    currentUser,
    grantAccess,
    revokeAccess,
  } = useApp();

  const [showGrantModal, setShowGrantModal] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.userId || '');
  const [durationDays, setDurationDays] = useState(365);
  const [consentPurpose, setConsentPurpose] = useState('Medical treatment & continuity of clinical care');
  const [revokedNotice, setRevokedNotice] = useState<string | null>(null);

  // Active and past grants for this patient
  const patientGrants = accessGrants.filter(g => g.patientId === currentUser.uid);
  const activeGrants = patientGrants.filter(g => g.status === 'active');
  const revokedGrants = patientGrants.filter(g => g.status === 'revoked');

  const handleRevoke = (doctorId: string, doctorName: string) => {
    revokeAccess(doctorId);
    setRevokedNotice(`Access for ${doctorName} was immediately revoked. This doctor is now blocked from viewing your health records.`);
    setTimeout(() => setRevokedNotice(null), 5000);
  };

  const handleGrantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctorId) return;
    grantAccess(selectedDoctorId, durationDays, consentPurpose);
    setShowGrantModal(false);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Lock className="w-6 h-6 text-teal-600" />
            Patient Consent & Record Access Control
          </h1>
          <p className="text-sm text-slate-600">
            Control which licensed physicians can view your medical diagnoses, prescriptions, and lab tests.
          </p>
        </div>

        <button
          onClick={() => setShowGrantModal(true)}
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Grant Access to a Doctor</span>
        </button>
      </div>

      {revokedNotice && (
        <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-xs text-rose-800 flex items-center gap-3 animate-fade-in">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
          <div className="font-medium">{revokedNotice}</div>
        </div>
      )}

      {/* Security Invariant Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-900 to-slate-900 text-white shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-teal-300 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          <span>MediLink Zero-Trust Clinical Isolation Model</span>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed">
          Unlike legacy medical systems where any provider or administrator with an account can look up patient files by ID, MediLink enforces <strong>mathematical Firestore rules</strong>. A doctor's request to read your records is denied at the database layer unless a cryptographically verified, active consent record exists in <code className="bg-black/30 px-1 py-0.5 rounded text-teal-300">record_access_grants</code>.
        </p>
      </div>

      {/* Active Grants List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Active Healthcare Provider Permissions</h2>
            <p className="text-xs text-slate-500">Physicians who currently possess authorized read access to your timeline</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
            {activeGrants.length} Active Authorizations
          </span>
        </div>

        {activeGrants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeGrants.map(grant => (
              <div
                key={grant.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-teal-200 hover:shadow-xs transition space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{grant.doctorName}</h3>
                    <p className="text-xs font-semibold text-teal-700">{grant.doctorSpecialty}</p>
                    <p className="text-[11px] text-slate-500">{grant.clinicName}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Active
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-100">
                  {grant.purpose && (
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Purpose:</span>
                      <span className="font-medium text-slate-800">{grant.purpose}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                    <span>Granted: {new Date(grant.grantedAt).toLocaleDateString()}</span>
                    <span>Expires: {new Date(grant.expiresAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-end">
                  <button
                    onClick={() => handleRevoke(grant.doctorId, grant.doctorName)}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <UserX className="w-3.5 h-3.5" />
                    <span>Revoke Consent Immediately</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center space-y-2">
            <Shield className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No Active Doctor Permissions</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You have not authorized any doctors to view your medical records. No physician can inspect your health timeline until you grant consent.
            </p>
          </div>
        )}
      </div>

      {/* Revoked Grants History */}
      {revokedGrants.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Revoked / Expired Authorizations</h3>
            <span className="text-xs text-slate-500">{revokedGrants.length} Records</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {revokedGrants.map(grant => (
              <div key={grant.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-slate-900">{grant.doctorName} ({grant.doctorSpecialty})</div>
                  <div className="text-[11px] text-slate-500">{grant.clinicName}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold text-[10px]">
                    Access Blocked
                  </span>
                  <button
                    onClick={() => grantAccess(grant.doctorId, 365, 'Re-authorized care')}
                    className="text-teal-600 hover:text-teal-800 font-semibold text-xs cursor-pointer"
                  >
                    Re-authorize
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grant Access Modal */}
      {showGrantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-bold text-slate-900">Authorize Doctor Record Access</h3>
              </div>
              <button
                onClick={() => setShowGrantModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGrantSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Select Doctor to Authorize</label>
                <select
                  value={selectedDoctorId}
                  onChange={e => setSelectedDoctorId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                >
                  {doctors.map(doc => (
                    <option key={doc.id} value={doc.userId}>
                      {doc.name} ({doc.specialty}) — {doc.clinicName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Authorization Duration</label>
                <select
                  value={durationDays}
                  onChange={e => setDurationDays(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                >
                  <option value={30}>30 Days (Short-term consultation)</option>
                  <option value={90}>90 Days (Quarterly treatment plan)</option>
                  <option value={365}>1 Year (Primary care provider)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Stated Purpose of Access</label>
                <input
                  type="text"
                  value={consentPurpose}
                  onChange={e => setConsentPurpose(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
              </div>

              <div className="p-3 bg-teal-50 rounded-xl text-teal-800 text-[11px] leading-relaxed">
                By clicking Authorize, you grant this physician permission to read your diagnoses, medications, and lab reports. You may revoke this permission at any time.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowGrantModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-xs"
                >
                  Confirm & Authorize
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
