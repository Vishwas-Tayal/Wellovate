import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppointmentProvider } from './contexts/AppointmentContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import NewAppointmentPage from './pages/NewAppointmentPage';
import AppointmentPage from './pages/AppointmentPage';
import ConsultationPage from './pages/ConsultationPage';
import PaymentPage from './pages/PaymentPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import VideoCallPage from './pages/VideoCallPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppointmentProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="appointments/new" element={<NewAppointmentPage />} />
              <Route path="appointments" element={<AppointmentPage />} />
              <Route path="consultation/:id" element={<ConsultationPage />} />
              <Route path="payment/:id" element={<PaymentPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/video-call" element={<VideoCallPage />} />
          </Routes>
        </AppointmentProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;