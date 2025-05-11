import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mic, MicOff, Video, VideoOff, Phone, MessageSquare, FileText, Share2, MoreHorizontal, Send } from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';
import { useAppointmentContext } from '../contexts/AppointmentContext';

const ConsultationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuthContext();
  const { appointments } = useAppointmentContext();
  const navigate = useNavigate();
  
  const [isCallActive, setIsCallActive] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(true);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<{ id: string; sender: string; text: string; timestamp: Date }[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [transcripts, setTranscripts] = useState<{ text: string; timestamp: Date }[]>([]);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  
  const appointment = appointments.find(a => a.consultationId === id);
  
  // Simulate doctor joining
  useEffect(() => {
    if (!appointment) return;
    
    const timer = setTimeout(() => {
      setIsCallActive(true);
      
      // Generate welcome message
      const welcomeMessage = {
        id: Date.now().toString(),
        sender: appointment.doctorName,
        text: `Hello! I'm ${appointment.doctorName}. How can I help you today?`,
        timestamp: new Date(),
      };
      
      setMessages([welcomeMessage]);
      
      // Start generating "transcripts" after a delay
      setTimeout(() => {
        const transcriptionInterval = setInterval(() => {
          const phrases = [
            "Let me know what symptoms you've been experiencing.",
            "How long have you been feeling this way?",
            "Have you taken any medication for this?",
            "I'm going to recommend a treatment plan for you.",
            "Let's schedule a follow-up in two weeks to see how you're doing.",
            "Do you have any questions about the treatment plan?",
            "I'll send a prescription to your pharmacy.",
            "Make sure to rest and stay hydrated.",
          ];
          
          const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
          
          setTranscripts(prev => [
            ...prev,
            {
              text: randomPhrase,
              timestamp: new Date(),
            },
          ]);
        }, 8000);
        
        return () => clearInterval(transcriptionInterval);
      }, 5000);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [appointment]);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!appointment) {
      navigate('/appointments');
      return;
    }
    
    // Access the user's camera and microphone
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };
    
    getMedia();
    
    return () => {
      // Clean up media streams
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isAuthenticated, appointment, navigate]);
  
  useEffect(() => {
    // Scroll chat to bottom when new messages arrive
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };
  
  const toggleTranscription = () => {
    setIsTranscribing(!isTranscribing);
  };
  
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      sender: user?.name || 'You',
      text: newMessage,
      timestamp: new Date(),
    };
    
    setMessages([...messages, userMessage]);
    setNewMessage('');
    
    // Simulate doctor response after a delay
    setTimeout(() => {
      const doctorResponses = [
        "I understand. Can you provide more details?",
        "That's helpful information. Let me make a note of that.",
        "I see. Have you noticed any other symptoms?",
        "Thanks for sharing that with me.",
        "I'm going to recommend some tests to better understand what's happening.",
      ];
      
      const randomResponse = doctorResponses[Math.floor(Math.random() * doctorResponses.length)];
      
      const doctorMessage = {
        id: (Date.now() + 1).toString(),
        sender: appointment?.doctorName || 'Doctor',
        text: randomResponse,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, doctorMessage]);
    }, 2000);
  };
  
  const handleEndCall = () => {
    if (window.confirm('Are you sure you want to end the consultation?')) {
      navigate('/dashboard');
    }
  };
  
  return (
    <div className="bg-gray-900 min-h-screen flex flex-col fade-in">
      {/* Main video area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Remote video (doctor) */}
        {isCallActive ? (
          <div className="h-full w-full bg-gray-800 flex items-center justify-center">
            <img
              src="https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg"
              alt="Doctor"
              className="max-h-full max-w-full object-cover"
            />
          </div>
        ) : (
          <div className="h-full w-full bg-gray-800 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="animate-pulse mb-4">
                <div className="h-16 w-16 rounded-full bg-primary-500 flex items-center justify-center mx-auto">
                  <Phone className="h-8 w-8 text-white" />
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-2">Connecting to your doctor...</h2>
              <p className="text-gray-400">Please wait while we establish a secure connection</p>
            </div>
          </div>
        )}

        {/* Local video (patient) */}
        <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className={`h-full w-full object-cover ${!isVideoOn && 'hidden'}`}
          />
          {!isVideoOn && (
            <div className="h-full w-full flex items-center justify-center bg-gray-700">
              <User className="h-12 w-12 text-gray-500" />
            </div>
          )}
        </div>
        
        {/* Call controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-gray-800 bg-opacity-75 rounded-full px-6 py-3">
          <button
            className={`p-3 rounded-full focus:outline-none ${
              isMuted ? 'bg-red-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
            onClick={toggleMute}
          >
            {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </button>
          
          <button
            className={`p-3 rounded-full focus:outline-none ${
              !isVideoOn ? 'bg-red-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
            onClick={toggleVideo}
          >
            {!isVideoOn ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
          </button>
          
          <button
            className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700 focus:outline-none"
            onClick={handleEndCall}
          >
            <Phone className="h-6 w-6 transform rotate-135" />
          </button>
          
          <button
            className={`p-3 rounded-full focus:outline-none ${
              isChatOpen ? 'bg-primary-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
            onClick={toggleChat}
          >
            <MessageSquare className="h-6 w-6" />
          </button>
          
          <button
            className={`p-3 rounded-full focus:outline-none ${
              isTranscribing ? 'bg-primary-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
            onClick={toggleTranscription}
          >
            <FileText className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      {/* Chat sidebar */}
      <div
        className={`absolute top-0 right-0 h-full w-80 bg-white transform transition-transform duration-300 ease-in-out ${
          isChatOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Chat</h3>
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={toggleChat}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto" ref={chatRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === (user?.name || 'You') ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs rounded-lg p-3 ${
                      message.sender === (user?.name || 'You')
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm font-medium mb-1">{message.sender}</p>
                    <p>{message.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                type="submit"
                className="bg-primary-600 text-white rounded-r-lg px-4 py-2 hover:bg-primary-700 focus:outline-none"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Transcription panel */}
      {isTranscribing && (
        <div className="bg-white bg-opacity-95 border-t border-gray-200 p-4 max-h-48 overflow-y-auto">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-900">Live Transcription</h3>
            <button
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={toggleTranscription}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-2">
            {transcripts.map((transcript, index) => (
              <div key={index} className="flex">
                <span className="text-xs text-gray-500 mr-2">
                  {transcript.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <p className="text-gray-800">{transcript.text}</p>
              </div>
            ))}
            
            {transcripts.length === 0 && (
              <p className="text-gray-500 italic">Transcription will appear here...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationPage;