import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Video, MessageSquare, FileText, ShieldCheck, Clock } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="fade-in">
      {/* Hero section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="slide-up">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Healthcare From The Comfort Of Your Home
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-primary-100">
                Consult with top healthcare professionals through secure video calls, anytime, anywhere.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/register" className="btn bg-white text-primary-700 hover:bg-primary-50 focus:ring-white">
                  Get Started
                </Link>
                <Link to="/about" className="btn border border-white text-white hover:bg-primary-500 focus:ring-white">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg" 
                alt="Doctor with patient during telemedicine session" 
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How MediConnect Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our telehealth platform makes it easy to receive quality healthcare from anywhere.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center p-8 hover:shadow-md transition-shadow duration-300">
              <div className="bg-primary-100 p-4 rounded-full inline-block mb-6">
                <Calendar className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Schedule Appointment</h3>
              <p className="text-gray-600">
                Choose your preferred specialist and select an available time slot that works for you.
              </p>
            </div>
            
            <div className="card text-center p-8 hover:shadow-md transition-shadow duration-300">
              <div className="bg-primary-100 p-4 rounded-full inline-block mb-6">
                <ShieldCheck className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Secure Payment</h3>
              <p className="text-gray-600">
                Complete your payment securely before your consultation begins.
              </p>
            </div>
            
            <div className="card text-center p-8 hover:shadow-md transition-shadow duration-300">
              <div className="bg-primary-100 p-4 rounded-full inline-block mb-6">
                <Video className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Virtual Consultation</h3>
              <p className="text-gray-600">
                Connect with your doctor through our secure video platform for a private consultation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Medical Specialties</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform connects you with specialists across various medical fields.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {['Primary Care', 'Pediatrics', 'Cardiology', 'Dermatology', 'Psychiatry', 'Neurology', 'Orthopedics', 'Gynecology', 'Urology', 'Ophthalmology', 'ENT', 'Endocrinology'].map((specialty) => (
              <div key={specialty} className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow duration-300">
                <p className="font-medium text-gray-800">{specialty}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose MediConnect</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience healthcare reimagined for the digital age.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex">
              <div className="flex-shrink-0 mt-1">
                <Clock className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold mb-2">Convenience</h3>
                <p className="text-gray-600">
                  Access healthcare services from anywhere, without travel or waiting rooms.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0 mt-1">
                <ShieldCheck className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold mb-2">Privacy & Security</h3>
                <p className="text-gray-600">
                  HIPAA-compliant platform ensures your medical information remains confidential.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0 mt-1">
                <MessageSquare className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold mb-2">In-App Communication</h3>
                <p className="text-gray-600">
                  Chat with your doctor and share information during your consultation.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0 mt-1">
                <Video className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold mb-2">High-Quality Video</h3>
                <p className="text-gray-600">
                  Crystal-clear video consultations that replicate in-person experiences.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0 mt-1">
                <FileText className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold mb-2">Transcription Services</h3>
                <p className="text-gray-600">
                  Overcome language barriers with real-time transcription during consultations.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0 mt-1">
                <Calendar className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold mb-2">Easy Scheduling</h3>
                <p className="text-gray-600">
                  Book appointments that fit your schedule, with less waiting time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience Virtual Healthcare?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of patients who have already benefited from our telehealth services.
          </p>
          <Link to="/register" className="btn bg-white text-primary-700 hover:bg-primary-50 focus:ring-white">
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;