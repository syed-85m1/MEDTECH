import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  DoctorProfile,
  Appointment,
  MedicalRecord,
  RecordAccessGrant,
  AuditLogEntry,
  FollowUpReminder,
  UserRole,
  AppointmentStatus,
} from '../types';
import {
  DEMO_PATIENT,
  DEMO_DOCTOR_VERIFIED,
  DEMO_DOCTOR_PENDING,
  DEMO_DOCTORS_LIST,
  DEMO_ADMIN,
  INITIAL_APPOINTMENTS,
  INITIAL_MEDICAL_RECORDS,
  INITIAL_RECORD_ACCESS_GRANTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_FOLLOW_UPS,
} from '../lib/mockData';

interface AppContextType {
  currentUser: UserProfile;
  currentDoctorProfile: DoctorProfile | null;
  activeRole: UserRole;
  isDemoMode: boolean;
  doctors: DoctorProfile[];
  appointments: Appointment[];
  medicalRecords: MedicalRecord[];
  accessGrants: RecordAccessGrant[];
  auditLogs: AuditLogEntry[];
  followUps: FollowUpReminder[];
  
  // Role & persona switching
  switchRole: (role: UserRole) => void;
  selectPersona: (personaKey: 'patient_sarah' | 'doctor_patel' | 'doctor_vance' | 'admin') => void;
  
  // Doctor management
  verifyDoctor: (doctorId: string, status: 'verified' | 'rejected') => void;
  flagDoctorFraud: (doctorId: string, reason: string) => void;
  updateDoctorProfile: (doctorId: string, updates: Partial<DoctorProfile>) => void;
  
  // Appointment workflows
  bookAppointment: (apt: Omit<Appointment, 'id' | 'createdAt'>) => string;
  updateAppointmentStatus: (id: string, status: AppointmentStatus, notes?: string) => void;
  cancelAppointment: (id: string, reason: string) => void;
  
  // Medical records
  addMedicalRecord: (record: Omit<MedicalRecord, 'id'>) => string;
  toggleMedicationTaken: (recordId: string) => void;
  
  // Patient consent & access control
  grantAccess: (doctorId: string, durationDays?: number, purpose?: string) => void;
  revokeAccess: (doctorId: string) => void;
  hasAccessToPatientRecords: (patientId: string, doctorId: string) => boolean;
  
  // Audit logging
  logAuditAction: (
    action: string,
    details: string,
    targetPatientId?: string,
    securityLevel?: 'info' | 'warning' | 'critical'
  ) => void;
  
  // Follow-ups
  completeFollowUp: (id: string) => void;
  
  // Reset demo data
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemoMode] = useState(true);
  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    return (localStorage.getItem('medilink_role') as UserRole) || 'patient';
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('medilink_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return DEMO_PATIENT;
  });

  const [doctors, setDoctors] = useState<DoctorProfile[]>(() => {
    const saved = localStorage.getItem('medilink_doctors');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return DEMO_DOCTORS_LIST;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('medilink_appointments');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_APPOINTMENTS;
  });

  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(() => {
    const saved = localStorage.getItem('medilink_medical_records');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_MEDICAL_RECORDS;
  });

  const [accessGrants, setAccessGrants] = useState<RecordAccessGrant[]>(() => {
    const saved = localStorage.getItem('medilink_access_grants');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_RECORD_ACCESS_GRANTS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('medilink_audit_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_AUDIT_LOGS;
  });

  const [followUps, setFollowUps] = useState<FollowUpReminder[]>(() => {
    const saved = localStorage.getItem('medilink_follow_ups');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_FOLLOW_UPS;
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('medilink_role', activeRole);
    localStorage.setItem('medilink_current_user', JSON.stringify(currentUser));
  }, [activeRole, currentUser]);

  useEffect(() => {
    localStorage.setItem('medilink_doctors', JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem('medilink_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('medilink_medical_records', JSON.stringify(medicalRecords));
  }, [medicalRecords]);

  useEffect(() => {
    localStorage.setItem('medilink_access_grants', JSON.stringify(accessGrants));
  }, [accessGrants]);

  useEffect(() => {
    localStorage.setItem('medilink_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('medilink_follow_ups', JSON.stringify(followUps));
  }, [followUps]);

  // Derive current doctor profile if role is doctor
  const currentDoctorProfile =
    activeRole === 'doctor'
      ? doctors.find(d => d.userId === currentUser.uid) || DEMO_DOCTOR_VERIFIED
      : null;

  const logAuditAction = (
    action: string,
    details: string,
    targetPatientId?: string,
    securityLevel: 'info' | 'warning' | 'critical' = 'info'
  ) => {
    const targetPatient = targetPatientId ? DEMO_PATIENT.displayName : undefined;
    const newEntry: AuditLogEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      actorId: currentUser.uid,
      actorName: currentUser.displayName,
      actorRole: currentUser.role,
      action,
      targetPatientId,
      targetPatientName: targetPatient,
      details,
      securityLevel,
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  const switchRole = (role: UserRole) => {
    setActiveRole(role);
    if (role === 'patient') {
      setCurrentUser(DEMO_PATIENT);
    } else if (role === 'doctor') {
      setCurrentUser({
        uid: DEMO_DOCTOR_VERIFIED.userId,
        email: DEMO_DOCTOR_VERIFIED.email,
        displayName: DEMO_DOCTOR_VERIFIED.name,
        role: 'doctor',
      });
    } else {
      setCurrentUser(DEMO_ADMIN);
    }
    logAuditAction('SWITCH_ROLE', `Switched active session view to ${role.toUpperCase()}`, undefined, 'info');
  };

  const selectPersona = (personaKey: 'patient_sarah' | 'doctor_patel' | 'doctor_vance' | 'admin') => {
    if (personaKey === 'patient_sarah') {
      setActiveRole('patient');
      setCurrentUser(DEMO_PATIENT);
      logAuditAction('PERSONA_SWITCH', 'Switched to Patient persona: Sarah Jenkins');
    } else if (personaKey === 'doctor_patel') {
      setActiveRole('doctor');
      setCurrentUser({
        uid: DEMO_DOCTOR_VERIFIED.userId,
        email: DEMO_DOCTOR_VERIFIED.email,
        displayName: DEMO_DOCTOR_VERIFIED.name,
        role: 'doctor',
      });
      logAuditAction('PERSONA_SWITCH', 'Switched to Verified Doctor persona: Dr. Rajesh Patel');
    } else if (personaKey === 'doctor_vance') {
      setActiveRole('doctor');
      setCurrentUser({
        uid: DEMO_DOCTOR_PENDING.userId,
        email: DEMO_DOCTOR_PENDING.email,
        displayName: DEMO_DOCTOR_PENDING.name,
        role: 'doctor',
      });
      logAuditAction('PERSONA_SWITCH', 'Switched to Pending Doctor persona: Dr. Elena Vance');
    } else {
      setActiveRole('admin');
      setCurrentUser(DEMO_ADMIN);
      logAuditAction('PERSONA_SWITCH', 'Switched to Admin Compliance Officer persona');
    }
  };

  const verifyDoctor = (doctorId: string, status: 'verified' | 'rejected') => {
    setDoctors(prev =>
      prev.map(doc => {
        if (doc.id === doctorId || doc.userId === doctorId) {
          return {
            ...doc,
            isVerified: status === 'verified',
            verificationStatus: status,
          };
        }
        return doc;
      })
    );
    const docTarget = doctors.find(d => d.id === doctorId || d.userId === doctorId);
    logAuditAction(
      'DOCTOR_CREDENTIAL_VERIFICATION',
      `Administrator marked doctor "${docTarget?.name || doctorId}" as ${status.toUpperCase()}. State license verified: ${docTarget?.licenseNumber || 'Active'}.`,
      undefined,
      status === 'verified' ? 'info' : 'warning'
    );
  };

  const flagDoctorFraud = (doctorId: string, reason: string) => {
    setDoctors(prev =>
      prev.map(doc => {
        if (doc.id === doctorId || doc.userId === doctorId) {
          return {
            ...doc,
            isVerified: false,
            verificationStatus: 'flagged',
            fraudReportCount: (doc.fraudReportCount || 0) + 1,
            fraudFlagReason: reason,
          };
        }
        return doc;
      })
    );
    logAuditAction(
      'FRAUDULENT_PROFILE_FLAGGED',
      `Administrator flagged doctor profile ID ${doctorId} as potentially fraudulent: "${reason}". Credentials suspended pending investigation.`,
      undefined,
      'critical'
    );
  };

  const updateDoctorProfile = (doctorId: string, updates: Partial<DoctorProfile>) => {
    setDoctors(prev =>
      prev.map(doc => {
        if (doc.id === doctorId || doc.userId === doctorId) {
          return { ...doc, ...updates };
        }
        return doc;
      })
    );
    logAuditAction('DOCTOR_PROFILE_UPDATED', `Doctor updated profile information for ${doctorId}`);
  };

  const bookAppointment = (aptData: Omit<Appointment, 'id' | 'createdAt'>): string => {
    const newId = `apt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newApt: Appointment = {
      ...aptData,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    setAppointments(prev => [newApt, ...prev]);
    logAuditAction(
      'APPOINTMENT_REQUESTED',
      `Patient ${aptData.patientName} requested appointment with ${aptData.doctorName} for ${aptData.date} at ${aptData.timeSlot}.`,
      aptData.patientId
    );
    return newId;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus, notes?: string) => {
    setAppointments(prev =>
      prev.map(apt => {
        if (apt.id === id) {
          return {
            ...apt,
            status,
            doctorNotes: notes !== undefined ? notes : apt.doctorNotes,
          };
        }
        return apt;
      })
    );
    logAuditAction(
      'APPOINTMENT_STATUS_UPDATE',
      `Appointment ${id} status updated to ${status.toUpperCase()}${notes ? `. Notes added.` : ''}`
    );
  };

  const cancelAppointment = (id: string, reason: string) => {
    setAppointments(prev =>
      prev.map(apt => {
        if (apt.id === id) {
          return {
            ...apt,
            status: 'cancelled',
            cancellationReason: reason,
          };
        }
        return apt;
      })
    );
    logAuditAction('APPOINTMENT_CANCELLED', `Appointment ${id} cancelled. Reason: "${reason}"`);
  };

  const addMedicalRecord = (recordData: Omit<MedicalRecord, 'id'>): string => {
    const newId = `rec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newRecord: MedicalRecord = {
      ...recordData,
      id: newId,
    };
    setMedicalRecords(prev => [newRecord, ...prev]);
    logAuditAction(
      'CLINICAL_RECORD_ADDED',
      `Doctor ${recordData.doctorName || currentUser.displayName} recorded a new ${recordData.type.toUpperCase()}: "${recordData.title}".`,
      recordData.patientId,
      'info'
    );
    return newId;
  };

  const toggleMedicationTaken = (recordId: string) => {
    setMedicalRecords(prev =>
      prev.map(rec => {
        if (rec.id === recordId) {
          const newState = !rec.isTakenToday;
          return { ...rec, isTakenToday: newState };
        }
        return rec;
      })
    );
  };

  const hasAccessToPatientRecords = (patientId: string, doctorId: string): boolean => {
    if (currentUser.role === 'patient' && currentUser.uid === patientId) {
      return true;
    }
    const grant = accessGrants.find(
      g => g.patientId === patientId && g.doctorId === doctorId && g.status === 'active'
    );
    return !!grant;
  };

  const grantAccess = (doctorId: string, durationDays = 365, purpose = 'Direct medical care & consultation') => {
    const doc = doctors.find(d => d.userId === doctorId || d.id === doctorId);
    if (!doc) return;

    const expiresDate = new Date();
    expiresDate.setDate(expiresDate.getDate() + durationDays);

    const existingIndex = accessGrants.findIndex(
      g => g.patientId === currentUser.uid && (g.doctorId === doc.userId || g.doctorId === doc.id)
    );

    const grantObj: RecordAccessGrant = {
      id: `${currentUser.uid}_${doc.userId}`,
      patientId: currentUser.uid,
      doctorId: doc.userId,
      doctorName: doc.name,
      doctorSpecialty: doc.specialty,
      clinicName: doc.clinicName,
      status: 'active',
      grantedAt: new Date().toISOString(),
      expiresAt: expiresDate.toISOString(),
      purpose,
    };

    if (existingIndex >= 0) {
      setAccessGrants(prev => {
        const next = [...prev];
        next[existingIndex] = grantObj;
        return next;
      });
    } else {
      setAccessGrants(prev => [grantObj, ...prev]);
    }

    logAuditAction(
      'CONSENT_GRANTED',
      `Patient ${currentUser.displayName} explicitly granted medical record access to ${doc.name} (${doc.specialty}) for ${durationDays} days. Purpose: "${purpose}".`,
      currentUser.uid,
      'info'
    );
  };

  const revokeAccess = (doctorId: string) => {
    const doc = doctors.find(d => d.userId === doctorId || d.id === doctorId);
    setAccessGrants(prev =>
      prev.map(g => {
        if (g.patientId === currentUser.uid && (g.doctorId === doctorId || (doc && g.doctorId === doc.userId))) {
          return { ...g, status: 'revoked' };
        }
        return g;
      })
    );

    logAuditAction(
      'CONSENT_REVOKED',
      `Patient ${currentUser.displayName} REVOKED medical record access for doctor ID ${doctorId}. Access blocked immediately by ABAC security rules.`,
      currentUser.uid,
      'warning'
    );
  };

  const completeFollowUp = (id: string) => {
    setFollowUps(prev =>
      prev.map(fu => (fu.id === id ? { ...fu, status: 'completed' } : fu))
    );
    logAuditAction('FOLLOW_UP_COMPLETED', `Follow-up reminder ID ${id} marked completed.`);
  };

  const resetDemoData = () => {
    localStorage.removeItem('medilink_doctors');
    localStorage.removeItem('medilink_appointments');
    localStorage.removeItem('medilink_medical_records');
    localStorage.removeItem('medilink_access_grants');
    localStorage.removeItem('medilink_audit_logs');
    localStorage.removeItem('medilink_follow_ups');
    localStorage.removeItem('medilink_current_user');
    localStorage.removeItem('medilink_role');

    setDoctors(DEMO_DOCTORS_LIST);
    setAppointments(INITIAL_APPOINTMENTS);
    setMedicalRecords(INITIAL_MEDICAL_RECORDS);
    setAccessGrants(INITIAL_RECORD_ACCESS_GRANTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setFollowUps(INITIAL_FOLLOW_UPS);
    setCurrentUser(DEMO_PATIENT);
    setActiveRole('patient');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentDoctorProfile,
        activeRole,
        isDemoMode,
        doctors,
        appointments,
        medicalRecords,
        accessGrants,
        auditLogs,
        followUps,
        switchRole,
        selectPersona,
        verifyDoctor,
        flagDoctorFraud,
        updateDoctorProfile,
        bookAppointment,
        updateAppointmentStatus,
        cancelAppointment,
        addMedicalRecord,
        toggleMedicationTaken,
        grantAccess,
        revokeAccess,
        hasAccessToPatientRecords,
        logAuditAction,
        completeFollowUp,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
