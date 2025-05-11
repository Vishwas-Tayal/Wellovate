import React, { createContext, useContext, useState } from 'react';

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  image: string;
  bio: string;
  available: boolean;
};

export type TimeSlot = {
  id: string;
  startTime: string;
  endTime: string;
  date: string;
  doctorId: string;
  available: boolean;
};

export type Appointment = {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  dateTime: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'completed';
  consultationId?: string;
};

type AppointmentContextType = {
  doctors: Doctor[];
  appointments: Appointment[];
  getAvailableTimeSlots: (doctorId: string, date: string) => TimeSlot[];
  bookAppointment: (doctorId: string, timeSlotId: string) => Promise<Appointment>;
  cancelAppointment: (appointmentId: string) => Promise<void>;
  completePayment: (appointmentId: string) => Promise<void>;
  getAppointmentById: (id: string) => Appointment | undefined;
};

// Mock data
const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg',
    bio: 'Dr. Johnson is a board-certified cardiologist with over 15 years of experience in treating heart conditions.',
    available: true,
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Dermatology',
    rating: 4.7,
    image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg',
    bio: 'Dr. Chen specializes in treating various skin conditions and has expertise in cosmetic dermatology.',
    available: true,
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Pediatrics',
    rating: 4.9,
    image: 'https://images.pexels.com/photos/5214959/pexels-photo-5214959.jpeg',
    bio: 'Dr. Rodriguez is a compassionate pediatrician dedicated to providing comprehensive care for children of all ages.',
    available: true,
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    specialty: 'Orthopedics',
    rating: 4.6,
    image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg',
    bio: 'Dr. Wilson is an orthopedic surgeon specializing in sports injuries and joint replacements.',
    available: true,
  },
];

// Create context
const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

// Create provider component
export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors] = useState<Doctor[]>(mockDoctors);

  // Get available time slots for a doctor on a specific date
  const getAvailableTimeSlots = (doctorId: string, date: string): TimeSlot[] => {
    // In a real app, this would fetch from an API
    const timeSlots: TimeSlot[] = [];
    
    // Generate mock time slots from 9 AM to 5 PM
    for (let hour = 9; hour < 17; hour++) {
      const startHour = hour < 10 ? `0${hour}` : `${hour}`;
      const endHour = hour + 1 < 10 ? `0${hour + 1}` : `${hour + 1}`;
      
      timeSlots.push({
        id: `${doctorId}-${date}-${hour}`,
        startTime: `${startHour}:00`,
        endTime: `${endHour}:00`,
        date,
        doctorId,
        available: Math.random() > 0.3, // 70% chance of being available
      });
    }
    
    return timeSlots;
  };

  // Book an appointment
  const bookAppointment = async (doctorId: string, timeSlotId: string): Promise<Appointment> => {
    try {
      // Parse the time slot ID to extract date and time
      const [docId, date, hour] = timeSlotId.split('-');
      const startHour = parseInt(hour) < 10 ? `0${hour}` : hour;
      const dateTime = `${date} ${startHour}:00`;
      
      // Find the doctor
      const doctor = doctors.find(d => d.id === doctorId);
      
      if (!doctor) {
        throw new Error('Doctor not found');
      }
      
      // Create a new appointment
      const newAppointment: Appointment = {
        id: `appt-${Date.now()}`,
        patientId: '1', // Assuming the current user
        doctorId,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        dateTime,
        status: 'scheduled',
        paymentStatus: 'pending',
      };
      
      // Update state
      setAppointments(prevAppointments => [...prevAppointments, newAppointment]);
      
      return newAppointment;
    } catch (error) {
      console.error('Error booking appointment:', error);
      throw error;
    }
  };

  // Cancel an appointment
  const cancelAppointment = async (appointmentId: string): Promise<void> => {
    try {
      setAppointments(prevAppointments =>
        prevAppointments.map(appointment =>
          appointment.id === appointmentId
            ? { ...appointment, status: 'cancelled' }
            : appointment
        )
      );
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  };

  // Complete payment for an appointment
  const completePayment = async (appointmentId: string): Promise<void> => {
    try {
      setAppointments(prevAppointments =>
        prevAppointments.map(appointment =>
          appointment.id === appointmentId
            ? { ...appointment, paymentStatus: 'completed', consultationId: `cons-${Date.now()}` }
            : appointment
        )
      );
    } catch (error) {
      console.error('Error completing payment:', error);
      throw error;
    }
  };

  // Get appointment by ID
  const getAppointmentById = (id: string): Appointment | undefined => {
    return appointments.find(appointment => appointment.id === id);
  };

  const value = {
    doctors,
    appointments,
    getAvailableTimeSlots,
    bookAppointment,
    cancelAppointment,
    completePayment,
    getAppointmentById,
  };

  return <AppointmentContext.Provider value={value}>{children}</AppointmentContext.Provider>;
};

// Create custom hook for using the appointment context
export const useAppointmentContext = () => {
  const context = useContext(AppointmentContext);
  
  if (context === undefined) {
    throw new Error('useAppointmentContext must be used within an AppointmentProvider');
  }
  
  return context;
};