// Define common types used across the application

// User type for authentication
export type User = {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor';
  phone?: string;
  dob?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
  };
  medicalHistory?: {
    allergies: string[];
    medications: string[];
    surgeries: string[];
    conditions: string[];
    familyHistory: string[];
  };
  privacySettings?: {
    shareData: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
  };
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type LoginCredentials = {
  username: string;
  password: string;
};

export type RegisterData = LoginCredentials & {
  name: string;
  role: 'patient' | 'doctor';
};

export type ProfileData = {
  name?: string;
  email?: string;
  phone?: string;
  dob?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
  };
};

export type MedicalHistoryData = {
  allergies?: string[];
  medications?: string[];
  surgeries?: string[];
  conditions?: string[];
  familyHistory?: string[];
};

export type PrivacySettingsData = {
  shareData?: boolean;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
};

export type PasswordData = {
  currentPassword: string;
  newPassword: string;
};

// Possible status for appointments
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';

// Possible payment status
export type PaymentStatus = 'pending' | 'completed';

// Medical specialties
export type MedicalSpecialty = 
  | 'Primary Care'
  | 'Pediatrics'
  | 'Cardiology'
  | 'Dermatology'
  | 'Psychiatry'
  | 'Neurology'
  | 'Orthopedics'
  | 'Gynecology'
  | 'Urology'
  | 'Ophthalmology'
  | 'ENT'
  | 'Endocrinology';

// Chat message type
export type ChatMessage = {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
};

// Transcription entry
export type TranscriptionEntry = {
  id: string;
  text: string;
  timestamp: Date;
  speakerId: string;
  speakerName: string;
};

// Medical record type
export type MedicalRecord = {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: Date;
  diagnosis: string;
  prescription?: string;
  notes: string;
  followUp?: Date;
};

// Patient information
export type PatientInfo = {
  id: string;
  userId: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  allergies: string[];
  medications: string[];
  conditions: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
};