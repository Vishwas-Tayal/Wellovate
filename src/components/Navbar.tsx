import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Calendar, Home } from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthContext();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <svg
                className="h-8 w-8 text-primary-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66" />
                <path d="m18 15-2-2" />
                <path d="m15 18-2-2" />
              </svg>
              <span className="ml-2 text-xl font-semibold text-primary-600">MediConnect</span>
            </Link>
          </div>
          
          <div className="hidden sm:flex sm:items-center sm:ml-6 space-x-4">
            <Link to="/" className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium">
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/appointments" className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                  Appointments
                </Link>
                <Link to="/profile" className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                  Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>
          
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              to="/"
              className="flex items-center text-gray-600 hover:bg-gray-100 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="mr-2 h-5 w-5" />
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard"
                  className="flex items-center text-gray-600 hover:bg-gray-100 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home className="mr-2 h-5 w-5" />
                  Dashboard
                </Link>
                <Link 
                  to="/appointments"
                  className="flex items-center text-gray-600 hover:bg-gray-100 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Appointments
                </Link>
                <Link 
                  to="/profile"
                  className="flex items-center text-gray-600 hover:bg-gray-100 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="mr-2 h-5 w-5" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left text-gray-600 hover:bg-gray-100 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:bg-gray-100 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white hover:bg-primary-700 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;