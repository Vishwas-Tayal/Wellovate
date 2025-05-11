import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const VideoCallPage: React.FC = () => {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    // Check if payment was completed
    const paymentStatus = localStorage.getItem('paymentStatus');
    if (paymentStatus !== 'completed') {
      navigate('/payment');
      return;
    }

    // Simulate connecting to video call
    const timer = setTimeout(() => {
      setIsConnected(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleEndCall = () => {
    // Clear payment status
    localStorage.removeItem('paymentStatus');
    navigate('/');
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white text-lg">Connecting to video call...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Video containers */}
      <div className="flex-1 relative">
        {/* Remote video (doctor) */}
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <p className="text-white text-lg">Waiting for doctor to join...</p>
          </div>
        </div>

        {/* Local video (patient) */}
        <div className="absolute bottom-4 right-4 w-64 h-48 bg-gray-800 rounded-lg overflow-hidden">
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-white text-sm">Your video</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-center space-x-4">
          <button
            onClick={toggleMute}
            className={`p-3 rounded-full ${
              isMuted ? 'bg-red-500' : 'bg-gray-700'
            } text-white hover:bg-opacity-80`}
          >
            {isMuted ? 'Unmute' : 'Mute'}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full ${
              isVideoOff ? 'bg-red-500' : 'bg-gray-700'
            } text-white hover:bg-opacity-80`}
          >
            {isVideoOff ? 'Turn On Video' : 'Turn Off Video'}
          </button>

          <button
            onClick={handleEndCall}
            className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600"
          >
            End Call
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallPage; 