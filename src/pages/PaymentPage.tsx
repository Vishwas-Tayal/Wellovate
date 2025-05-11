import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store payment status
      localStorage.setItem('paymentStatus', 'completed');
      
      // Navigate to video call
      navigate('/video-call');
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Complete Your Payment
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            30-minute video consultation
          </p>
        </div>
        
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center mb-8">
            <p className="text-4xl font-bold text-gray-900">$50</p>
            <p className="text-sm text-gray-500">Consultation Fee</p>
          </div>
          
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isProcessing ? 'Processing Payment...' : 'Pay Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;