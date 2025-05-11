import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Video, Phone } from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  image: string;
  availableSlots: string[];
}

const NewAppointmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [consultationType, setConsultationType] = useState<'video' | 'phone'>('video');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for doctors
  const doctors: Doctor[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      rating: 4.8,
      image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg',
      availableSlots: ['10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM']
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialty: 'Dermatology',
      rating: 4.9,
      image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg',
      availableSlots: ['9:00 AM', '1:00 PM', '4:00 PM']
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store appointment data in localStorage
      localStorage.setItem('appointment', JSON.stringify({
        doctorId: selectedDoctor,
        date: selectedDate,
        time: selectedTime,
        type: consultationType
      }));
      
      // Navigate to payment page
      navigate('/payment');
    } catch (error) {
      console.error('Error scheduling appointment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Schedule New Appointment</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Doctor Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Doctor
              </label>
              <div className="grid grid-cols-1 gap-4">
                {doctors.map((doctor) => (
                  <button
                    key={doctor.id}
                    type="button"
                    onClick={() => setSelectedDoctor(doctor.id)}
                    className={`flex items-center p-4 border rounded-lg ${
                      selectedDoctor === doctor.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{doctor.name}</p>
                          <p className="text-sm text-gray-500">{doctor.specialty}</p>
                        </div>
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1 text-sm text-gray-600">{doctor.rating}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  min={new Date().toISOString().split('T')[0]}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Time
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {doctors
                    .find((d) => d.id === selectedDoctor)
                    ?.availableSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 px-3 text-sm rounded-md ${
                          selectedTime === time
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Consultation Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Consultation Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setConsultationType('video')}
                  className={`flex items-center justify-center p-4 border rounded-lg ${
                    consultationType === 'video'
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <Video className="h-6 w-6 text-gray-600 mr-2" />
                  <span>Video Consultation</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConsultationType('phone')}
                  className={`flex items-center justify-center p-4 border rounded-lg ${
                    consultationType === 'phone'
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <Phone className="h-6 w-6 text-gray-600 mr-2" />
                  <span>Phone Consultation</span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={!selectedDoctor || !selectedDate || !selectedTime || isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? 'Scheduling...' : 'Schedule Appointment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewAppointmentPage; 