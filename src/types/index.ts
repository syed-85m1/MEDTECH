export type UserRole = 'patient' | 'doctor' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  bloodType?: string;
  avatarUrl?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface DoctorProfile {
  id: string;
  userId: string;
  name: string;
  avatarUrl?: string;
  specialty: string;
  clinicName: string;
  clinicAddress: string;
  city: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  phone: string;
  email: string;
  consultationHours: string;
  fee: number;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  verificationStatus: 'pending' | 'verified' | 'rejected' | 'flagged';
  licenseNumber: string;
  medicalBoard: string;
  bio: string;
  education: string;
  yearsExperience: number;
  availableDays: string[];
  timeSlots: string[];
  fraudReportCount?: number;
  fraudFlagReason?: string;
}

export type AppointmentStatus = 'requested' | 'confirmed' | 'completed' | 'cancelled';
export type ConsultationType = 'in-person' | 'telehealth';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  clinicName: string;
  clinicAddress: string;
  date: string; // YYYY-MM-DD
  timeSlot: string;
  status: AppointmentStatus;
  type: ConsultationType;
  reason: string;
  doctorNotes?: string;
  cancellationReason?: string;
  followUpRecommended?: string;
  createdAt: string;
}

export type MedicalRecordType = 'diagnosis' | 'prescription' | 'allergy' | 'lab_report' | 'visit_summary';

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId?: string;
  doctorName?: string;
  doctorSpecialty?: string;
  date: string; // YYYY-MM-DD
  type: MedicalRecordType;
  title: string;
  description: string;
  code?: string; // ICD-10 or RxNorm
  severity?: 'mild' | 'moderate' | 'severe';
  // Medication specific
  dosage?: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
  isTakenToday?: boolean;
  // Lab report specific
  reportCategory?: string;
  metrics?: {
    name: string;
    value: string;
    unit: string;
    normalRange: string;
    isAbnormal: boolean;
  }[];
  attachmentName?: string;
  attachmentSize?: string;
  doctorSignature?: string;
}

export interface RecordAccessGrant {
  id: string; // `${patientId}_${doctorId}`
  patientId: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  clinicName: string;
  status: 'active' | 'revoked';
  grantedAt: string;
  expiresAt: string; // e.g., 30 days or custom
  purpose?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole | 'system';
  action: string;
  targetPatientId?: string;
  targetPatientName?: string;
  details: string;
  securityLevel: 'info' | 'warning' | 'critical';
}

export interface FollowUpReminder {
  id: string;
  patientId: string;
  doctorName: string;
  recommendedDate: string;
  condition: string;
  notes: string;
  status: 'pending' | 'completed';
  appointmentBooked?: boolean;
}
