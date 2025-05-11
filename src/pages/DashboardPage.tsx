import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Video, FileText, MessageSquare, Bell, Settings } from 'lucide-react';

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  // Mock data for appointments
  const appointments: Appointment[] = [
    {
      id: '1',
      doctorName: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      date: '2024-03-20',
      time: '10:00 AM',
      status: 'scheduled'
    },
    {
      id: '2',
      doctorName: 'Dr. Michael Chen',
      specialty: 'Dermatology',
      date: '2024-03-22',
      time: '2:30 PM',
      status: 'scheduled'
    }
  ];

  const pastAppointments: Appointment[] = [
    {
      id: '3',
      doctorName: 'Dr. Emily Brown',
      specialty: 'Pediatrics',
      date: '2024-03-15',
      time: '11:00 AM',
      status: 'completed'
    }
  ];

  const quickActions = [
    {
      title: 'Schedule Appointment',
      icon: Calendar,
      action: () => navigate('/appointments'),
      color: 'bg-blue-500'
    },
    {
      title: 'Start Video Call',
      icon: Video,
      action: () => navigate('/payment'),
      color: 'bg-green-500'
    },
    {
      title: 'View Medical Records',
      icon: FileText,
      action: () => navigate('/medical-records'),
      color: 'bg-purple-500'
    },
    {
      title: 'Message Doctor',
      icon: MessageSquare,
      action: () => navigate('/messages'),
      color: 'bg-yellow-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
          <p className="mt-1 text-sm text-gray-500">
            Here's what's happening with your appointments today.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 px-4 sm:px-0">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="relative group bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className={`${action.color} p-3 rounded-lg inline-block mb-4`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">{action.title}</h3>
              </button>
            ))}
          </div>
        </div>

        {/* Appointments Section */}
        <div className="mt-8 px-4 sm:px-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Your Appointments</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-4 py-2 rounded-md ${
                  activeTab === 'upcoming'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`px-4 py-2 rounded-md ${
                  activeTab === 'past'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Past
              </button>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {(activeTab === 'upcoming' ? appointments : pastAppointments).map((appointment) => (
                <li key={appointment.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-2" />
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {appointment.doctorName}
                        </p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          appointment.status === 'scheduled'
                            ? 'bg-green-100 text-green-800'
                            : appointment.status === 'completed'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          {appointment.date}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          {appointment.time}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>{appointment.specialty}</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="mt-8 px-4 sm:px-0">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Notifications</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              <li className="px-4 py-4 sm:px-6">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-indigo-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Your appointment with Dr. Sarah Johnson is tomorrow at 10:00 AM
                    </p>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                </div>
              </li>
              <li className="px-4 py-4 sm:px-6">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-green-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Your medical records have been updated
                    </p>
                    <p className="text-sm text-gray-500">1 day ago</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;