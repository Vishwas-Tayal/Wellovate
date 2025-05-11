import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Calendar, MapPin, FileText, Shield, Save, Edit2 } from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';
import { userAPI } from '../services/api';
import { User as UserType } from '../types';

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
  };
  medicalHistory: {
    allergies: string[];
    medications: string[];
    surgeries: string[];
    conditions: string[];
    familyHistory: string[];
  };
  privacySettings: {
    shareData: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
  };
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  dob?: string;
  address?: string;
  emergencyContact?: {
    name?: string;
    phone?: string;
  };
}

const ProfilePage: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthContext();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'medical' | 'privacy'>('profile');
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    email: '',
    phone: '',
    dob: '',
    address: '',
    emergencyContact: {
      name: '',
      phone: '',
    },
    medicalHistory: {
      allergies: [],
      medications: [],
      surgeries: [],
      conditions: [],
      familyHistory: [],
    },
    privacySettings: {
      shareData: true,
      emailNotifications: true,
      smsNotifications: true,
    },
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await userAPI.getProfile();
        const formData: ProfileFormData = {
          name: profile.name,
          email: profile.email,
          phone: profile.phone || '',
          dob: profile.dob || '',
          address: profile.address || '',
          emergencyContact: profile.emergencyContact || { name: '', phone: '' },
          medicalHistory: profile.medicalHistory || {
            allergies: [],
            medications: [],
            surgeries: [],
            conditions: [],
            familyHistory: [],
          },
          privacySettings: profile.privacySettings || {
            shareData: true,
            emailNotifications: true,
            smsNotifications: true,
          },
        };
        setFormData(formData);
      } catch (err) {
        setError('Failed to load profile');
      }
    };

    fetchProfile();
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'emergencyContact') {
        setFormData(prev => ({
          ...prev,
          emergencyContact: {
            ...prev.emergencyContact,
            [child]: value,
          },
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
    setError('');
    setSuccess('');
  };
  
  const handleArrayInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [parent, child] = name.split('.');
    if (parent === 'medicalHistory') {
      setFormData(prev => ({
        ...prev,
        medicalHistory: {
          ...prev.medicalHistory,
          [child]: value.split(',').map(item => item.trim()),
        },
      }));
    }
    setError('');
    setSuccess('');
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const [parent, child] = name.split('.');
    if (parent === 'privacySettings') {
      setFormData(prev => ({
        ...prev,
        privacySettings: {
          ...prev.privacySettings,
          [child]: checked,
        },
      }));
    }
    setError('');
    setSuccess('');
  };
  
  const validateForm = () => {
    const errors: FormErrors = {};
    if (!formData.name) {
      errors.name = 'Name is required';
    }
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    if (!formData.phone) {
      errors.phone = 'Phone is required';
    }
    if (!formData.dob) {
      errors.dob = 'Date of birth is required';
    }
    if (!formData.address) {
      errors.address = 'Address is required';
    }
    if (!formData.emergencyContact.name) {
      errors.emergencyContact = {
        ...errors.emergencyContact,
        name: 'Emergency contact name is required',
      };
    }
    if (!formData.emergencyContact.phone) {
      errors.emergencyContact = {
        ...errors.emergencyContact,
        phone: 'Emergency contact phone is required',
      };
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await userAPI.updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob,
        address: formData.address,
        emergencyContact: formData.emergencyContact,
      });
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleMedicalHistorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await userAPI.updateMedicalHistory(formData.medicalHistory);
      setSuccess('Medical history updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update medical history');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePrivacySettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await userAPI.updatePrivacySettings(formData.privacySettings);
      setSuccess('Privacy settings updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update privacy settings');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      setIsLoading(true);
      setError('');
      setSuccess('');

      try {
        await userAPI.deleteAccount();
        logout();
        navigate('/login');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete account');
        setIsLoading(false);
      }
    }
  };
  
  if (!isAuthenticated || !user) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="bg-gray-50 min-h-screen fade-in">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-primary-600 p-6 text-white text-center">
                <div className="h-24 w-24 mx-auto rounded-full bg-white flex items-center justify-center mb-4">
                  <User className="h-12 w-12 text-primary-600" />
                </div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-primary-100">{user.role === 'patient' ? 'Patient' : 'Healthcare Provider'}</p>
              </div>
              
              <nav className="p-4">
                <ul className="space-y-1">
                  <li>
                    <button
                      className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${
                        activeTab === 'profile'
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveTab('profile')}
                    >
                      <User className="h-5 w-5 mr-3" />
                      Personal Information
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${
                        activeTab === 'medical'
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveTab('medical')}
                    >
                      <FileText className="h-5 w-5 mr-3" />
                      Medical History
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${
                        activeTab === 'privacy'
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveTab('privacy')}
                    >
                      <Shield className="h-5 w-5 mr-3" />
                      Privacy & Security
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          
          {/* Main content */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {/* Profile tab */}
              {activeTab === 'profile' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                    <button
                      className="btn-outline flex items-center"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </>
                      ) : (
                        <>
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit
                        </>
                      )}
                    </button>
                  </div>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            className="input pl-10"
                            disabled={!isEditing}
                            value={formData.name}
                            onChange={handleChange}
                          />
                        </div>
                        {formErrors.name && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            className="input pl-10"
                            disabled={!isEditing}
                            value={formData.email}
                            onChange={handleChange}
                          />
                        </div>
                        {formErrors.email && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            className="input pl-10"
                            disabled={!isEditing}
                            value={formData.phone}
                            onChange={handleChange}
                          />
                        </div>
                        {formErrors.phone && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                          Date of Birth
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="dob"
                            name="dob"
                            type="date"
                            className="input pl-10"
                            disabled={!isEditing}
                            value={formData.dob}
                            onChange={handleChange}
                          />
                        </div>
                        {formErrors.dob && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.dob}</p>
                        )}
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="address"
                            name="address"
                            type="text"
                            className="input pl-10"
                            disabled={!isEditing}
                            value={formData.address}
                            onChange={handleChange}
                          />
                        </div>
                        {formErrors.address && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="emergencyContact.name" className="block text-sm font-medium text-gray-700 mb-1">
                          Emergency Contact
                        </label>
                        <input
                          id="emergencyContact.name"
                          name="emergencyContact.name"
                          type="text"
                          className="input"
                          disabled={!isEditing}
                          value={formData.emergencyContact.name}
                          onChange={handleChange}
                        />
                        {formErrors.emergencyContact?.name && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.emergencyContact.name}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="emergencyContact.phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Emergency Contact Phone
                        </label>
                        <input
                          id="emergencyContact.phone"
                          name="emergencyContact.phone"
                          type="tel"
                          className="input"
                          disabled={!isEditing}
                          value={formData.emergencyContact.phone}
                          onChange={handleChange}
                        />
                        {formErrors.emergencyContact?.phone && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.emergencyContact.phone}</p>
                        )}
                      </div>
                    </div>
                    
                    {isEditing && (
                      <div className="mt-6 text-right">
                        <button
                          type="button"
                          className="btn-outline mr-3"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                          Save Changes
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              )}
              
              {/* Medical History tab */}
              {activeTab === 'medical' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Medical History</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Allergies</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Penicillin</li>
                          <li>Peanuts</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Current Medications</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Lisinopril (10mg, once daily)</li>
                          <li>Metformin (500mg, twice daily)</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Past Surgeries</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Appendectomy (2010)</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Chronic Conditions</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Hypertension</li>
                          <li>Type 2 Diabetes</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Family Medical History</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Father: Hypertension, Heart Disease</li>
                          <li>Mother: Type 2 Diabetes</li>
                          <li>Sibling: Asthma</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-right">
                    <button className="btn-primary">
                      Update Medical History
                    </button>
                  </div>
                </div>
              )}
              
              {/* Privacy & Security tab */}
              {activeTab === 'privacy' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Privacy & Security</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Password</h3>
                      <p className="text-gray-600 mb-4">
                        Change your password regularly to keep your account secure.
                      </p>
                      <button className="btn-primary">
                        Change Password
                      </button>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Two-Factor Authentication</h3>
                      <p className="text-gray-600 mb-4">
                        Add an extra layer of security to your account by enabling two-factor authentication.
                      </p>
                      <button className="btn-outline">
                        Enable Two-Factor Authentication
                      </button>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Privacy Preferences</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="privacySettings.shareData"
                              type="checkbox"
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                              checked={formData.privacySettings.shareData}
                              onChange={handleCheckboxChange}
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="privacySettings.shareData" className="font-medium text-gray-700">
                              Share medical data with healthcare providers
                            </label>
                            <p className="text-gray-500">
                              Allow your healthcare providers to share your medical information with each other for better coordinated care.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="privacySettings.emailNotifications"
                              type="checkbox"
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                              checked={formData.privacySettings.emailNotifications}
                              onChange={handleCheckboxChange}
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="privacySettings.emailNotifications" className="font-medium text-gray-700">
                              Email notifications
                            </label>
                            <p className="text-gray-500">
                              Receive email notifications about your appointments, consultations, and health updates.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="privacySettings.smsNotifications"
                              type="checkbox"
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                              checked={formData.privacySettings.smsNotifications}
                              onChange={handleCheckboxChange}
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="privacySettings.smsNotifications" className="font-medium text-gray-700">
                              SMS notifications
                            </label>
                            <p className="text-gray-500">
                              Receive text message reminders about your upcoming appointments.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Data & Privacy</h3>
                      <p className="text-gray-600 mb-4">
                        Control how your personal data is used and download a copy of your data.
                      </p>
                      <div className="flex space-x-4">
                        <button className="btn-outline">
                          Download Your Data
                        </button>
                        <button className="btn-outline text-red-600 border-red-300 hover:bg-red-50">
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;