import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Search, Filter, Star, Clock } from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';
import { useAppointmentContext, Doctor, TimeSlot } from '../contexts/AppointmentContext';
import { format, addDays } from 'date-fns';

const AppointmentPage: React.FC = () => {
  const { isAuthenticated } = useAuthContext();
  const { doctors, getAvailableTimeSlots, bookAppointment } = useAppointmentContext();
  const navigate = useNavigate();
  
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // List of specialties
  const specialties = [...new Set(doctors.map(doctor => doctor.specialty))];
  
  // Filter doctors based on search term and selected specialty
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      const timeSlots = getAvailableTimeSlots(selectedDoctor.id, selectedDate);
      setAvailableTimeSlots(timeSlots);
      setSelectedTimeSlot(null);
    }
  }, [selectedDoctor, selectedDate, getAvailableTimeSlots]);
  
  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
  };
  
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };
  
  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };
  
  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedTimeSlot) return;
    
    setIsLoading(true);
    
    try {
      const appointment = await bookAppointment(selectedDoctor.id, selectedTimeSlot.id);
      navigate(`/payment/${appointment.id}`);
    } catch (error) {
      console.error('Error booking appointment:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate date options for the next 7 days
  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(), i);
    return {
      value: format(date, 'yyyy-MM-dd'),
      label: format(date, 'EEEE, MMMM d'),
      isToday: i === 0,
    };
  });
  
  return (
    <div className="bg-gray-50 min-h-screen fade-in">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Book an Appointment</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Doctor selection */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Find a Doctor</h2>
              
              {/* Search input */}
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name"
                  className="pl-10 input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Specialty filter */}
              <div className="mb-6">
                <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
                  Specialty
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="specialty"
                    className="pl-10 input"
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                  >
                    <option value="">All Specialties</option>
                    {specialties.map(specialty => (
                      <option key={specialty} value={specialty}>
                        {specialty}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Doctors list */}
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map(doctor => (
                    <div
                      key={doctor.id}
                      className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedDoctor?.id === doctor.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => handleDoctorSelect(doctor)}
                    >
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-gray-900">{doctor.name}</h3>
                          <span className="flex items-center text-yellow-500">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="ml-1 text-sm text-gray-700">{doctor.rating}</span>
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{doctor.specialty}</p>
                        <p className="text-sm text-gray-600 mt-2">{doctor.bio}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No doctors found matching your criteria</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right column - Date and time selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Date selection */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              {selectedDoctor ? (
                <>
                  <div className="flex items-center mb-6">
                    <img
                      src={selectedDoctor.image}
                      alt={selectedDoctor.name}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <h2 className="text-xl font-semibold text-gray-900">{selectedDoctor.name}</h2>
                      <p className="text-gray-600">{selectedDoctor.specialty}</p>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Select a Date</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {dateOptions.map((date) => (
                      <button
                        key={date.value}
                        className={`p-3 rounded-lg text-center focus:outline-none ${
                          selectedDate === date.value
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200'
                        }`}
                        onClick={() => handleDateSelect(date.value)}
                      >
                        <p className="text-sm font-medium">
                          {date.isToday ? 'Today' : format(new Date(date.value), 'EEE')}
                        </p>
                        <p className={`text-xs ${selectedDate === date.value ? 'text-primary-100' : 'text-gray-500'}`}>
                          {format(new Date(date.value), 'MMM d')}
                        </p>
                      </button>
                    ))}
                  </div>
                  
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Select a Time</h3>
                  
                  {availableTimeSlots.length > 0 ? (
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {availableTimeSlots.map((timeSlot) => (
                        <button
                          key={timeSlot.id}
                          className={`p-3 rounded-lg text-center focus:outline-none ${
                            !timeSlot.available
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : selectedTimeSlot?.id === timeSlot.id
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200'
                          }`}
                          onClick={() => timeSlot.available && handleTimeSlotSelect(timeSlot)}
                          disabled={!timeSlot.available}
                        >
                          <div className="flex justify-center items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{timeSlot.startTime}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No available time slots for this date</p>
                    </div>
                  )}
                  
                  {selectedTimeSlot && (
                    <div className="mt-8">
                      <div className="rounded-lg bg-gray-50 p-4 mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Appointment Summary</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-gray-500">Doctor:</div>
                          <div className="font-medium text-gray-900">{selectedDoctor.name}</div>
                          <div className="text-gray-500">Specialty:</div>
                          <div className="font-medium text-gray-900">{selectedDoctor.specialty}</div>
                          <div className="text-gray-500">Date:</div>
                          <div className="font-medium text-gray-900">
                            {format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}
                          </div>
                          <div className="text-gray-500">Time:</div>
                          <div className="font-medium text-gray-900">
                            {selectedTimeSlot.startTime} - {selectedTimeSlot.endTime}
                          </div>
                        </div>
                      </div>
                      
                      <button
                        className="w-full btn-primary"
                        onClick={handleBookAppointment}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Processing...' : 'Confirm Appointment'}
                      </button>
                      
                      <p className="text-sm text-gray-500 mt-2 text-center">
                        You will be redirected to complete payment after confirming.
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Doctor</h3>
                  <p className="text-gray-500">
                    Please select a doctor from the list to see available appointments
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;