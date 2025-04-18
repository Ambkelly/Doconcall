import { useState, useEffect, useRef } from 'react';
import { Search, Phone, Mail, Map, Hospital, Clock, User, MapPin, MessageSquare, Heart } from 'lucide-react';

export default function DoconcallApp() {
  const [activeTab, setActiveTab] = useState('findDoctor');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState('');
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your Doconcall healthcare assistant. I can help you find information about medical conditions, provide general health advice, or assist with finding the right doctor for your needs. How may I help you today?'
    }
  ]);
  const [userMessage, setUserMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const mapRef = useRef(null);
  const chatContainerRef = useRef(null);
  
  // Nigerian doctors data
  const doctors = [
    { 
      id: 1, 
      name: 'Dr. Adebayo Ogunlesi', 
      specialty: 'Cardiologist', 
      rating: 4.8, 
      distance: '1.2 km', 
      image: '/api/placeholder/80/80', 
      phone: '+234 812 345 6789', 
      email: 'dr.adebayo@lagoshospital.com', 
      availability: 'Mon-Fri: 8am-5pm', 
      lat: 6.5244, 
      lng: 3.3792,
      hospital: 'Lagos University Teaching Hospital'
    },
    { 
      id: 2, 
      name: 'Dr. Ngozi Okonjo', 
      specialty: 'Pediatrician', 
      rating: 4.9, 
      distance: '0.8 km', 
      image: '/api/placeholder/80/80', 
      phone: '+234 813 456 7890', 
      email: 'dr.ngozi@abujaclinic.com', 
      availability: 'Mon-Wed: 8am-6pm, Thu-Fri: 9am-5pm', 
      lat: 9.0579, 
      lng: 7.4951,
      hospital: 'National Hospital Abuja'
    },
    { 
      id: 3, 
      name: 'Dr. Chinedu Eze', 
      specialty: 'Dermatologist', 
      rating: 4.7, 
      distance: '2.1 km', 
      image: '/api/placeholder/80/80', 
      phone: '+234 814 567 8901', 
      email: 'dr.chinedu@portmedical.com', 
      availability: 'Mon, Wed, Fri: 9am-7pm', 
      lat: 4.8156, 
      lng: 7.0498,
      hospital: 'Port Harcourt Medical Center'
    },
    { 
      id: 4, 
      name: 'Dr. Amina Mohammed', 
      specialty: 'Gynecologist', 
      rating: 4.8, 
      distance: '1.5 km', 
      image: '/api/placeholder/80/80', 
      phone: '+234 815 678 9012', 
      email: 'dr.amina@kanomedical.com', 
      availability: 'Tue-Thu: 8am-4pm, Sat: 10am-2pm', 
      lat: 11.9965, 
      lng: 8.5167,
      hospital: 'Aminu Kano Teaching Hospital'
    },
    { 
      id: 5, 
      name: 'Dr. Emeka Okoro', 
      specialty: 'Orthopedic Surgeon', 
      rating: 4.6, 
      distance: '3.0 km', 
      image: '/api/placeholder/80/80', 
      phone: '+234 816 789 0123', 
      email: 'dr.emeka@enuguhospital.com', 
      availability: 'Mon-Fri: 7am-7pm', 
      lat: 6.4584, 
      lng: 7.5464,
      hospital: 'University of Nigeria Teaching Hospital'
    },
  ];

  // Nigerian hospital data
  const hospitals = [
    { 
      id: 1, 
      name: 'Lagos University Teaching Hospital (LUTH)', 
      distance: '1.5 km', 
      address: 'Idi-Araba, Lagos', 
      phone: '+234 807 420 0000', 
      lat: 6.5244, 
      lng: 3.3792 
    },
    { 
      id: 2, 
      name: 'National Hospital Abuja', 
      distance: '2.3 km', 
      address: 'Central Business District, Abuja', 
      phone: '+234 946 29000', 
      lat: 9.0579, 
      lng: 7.4951 
    },
    { 
      id: 3, 
      name: 'University of Nigeria Teaching Hospital (UNTH)', 
      distance: '3.1 km', 
      address: 'Ituku-Ozalla, Enugu', 
      phone: '+234 807 743 1000', 
      lat: 6.4584, 
      lng: 7.5464 
    },
    { 
      id: 4, 
      name: 'Aminu Kano Teaching Hospital', 
      distance: '1.8 km', 
      address: 'Zaria Road, Kano', 
      phone: '+234 803 506 7000', 
      lat: 11.9965, 
      lng: 8.5167 
    },
    { 
      id: 5, 
      name: 'University College Hospital (UCH) Ibadan', 
      distance: '2.5 km', 
      address: 'Queen Elizabeth II Rd, Ibadan', 
      phone: '+234 803 400 0000', 
      lat: 7.4038, 
      lng: 3.9184 
    },
  ];

  // Load Google Maps API
  useEffect(() => {
    if (!window.google && activeTab === 'findHospital' && hasSearched) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initializeMap();
      };
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    } else if (window.google && activeTab === 'findHospital' && hasSearched) {
      initializeMap();
    }
  }, [activeTab, hasSearched]);

  // Initialize map
  const initializeMap = () => {
    if (window.google && window.google.maps && mapRef.current) {
      const lagos = { lat: 6.5244, lng: 3.3792 };
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: lagos,
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
      });
      setMap(newMap);
      
      if (searchResults.length > 0) {
        updateMapMarkers(newMap, searchResults);
      }
    }
  };

  // Update map markers
  const updateMapMarkers = (mapInstance, results) => {
    markers.forEach(marker => marker.setMap(null));
    
    const newMarkers = [];
    
    if (results.length > 0 && window.google && window.google.maps) {
      const bounds = new window.google.maps.LatLngBounds();
      
      results.forEach(result => {
        const position = { lat: result.lat, lng: result.lng };
        bounds.extend(position);
        
        const marker = new window.google.maps.Marker({
          position,
          map: mapInstance,
          title: result.name,
        });
        
        newMarkers.push(marker);
      });

      setMarkers(newMarkers);
      mapInstance.fitBounds(bounds);
    } else {
      mapInstance.setCenter({ lat: 6.5244, lng: 3.3792 });
      mapInstance.setZoom(13);
    }
  };

  // Handle tab changes
  useEffect(() => {
    if (activeTab === 'findHospital' && window.google && window.google.maps && hasSearched) {
      initializeMap();
    }
    
    if (activeTab === 'findHospital') {
      setHasSearched(false);
    }
  }, [activeTab]);

  // Handle search results changes
  useEffect(() => {
    if (map && activeTab === 'findHospital' && hasSearched) {
      updateMapMarkers(map, searchResults);
    }
  }, [searchResults]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isChatOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (activeTab === 'findDoctor') {
      const results = doctors.filter(doctor => 
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    } else if (activeTab === 'findHospital') {
      setHasSearched(true);
      const results = hospitals.filter(hospital => 
        hospital.name.toLowerCase().includes(location.toLowerCase()) || 
        hospital.address.toLowerCase().includes(location.toLowerCase())
      );
      setSearchResults(results);
    }
  };

  const handleContactDoctor = (e) => {
    e.preventDefault();
    alert(`Message sent to ${selectedDoctor.name}: "${message}"`);
    setMessage('');
  };

  const handleGetDirections = (hospital) => {
    if (window.google && window.google.maps) {
      const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`;
      window.open(directionsUrl, '_blank');
    }
  };

  const sendMessageToAI = async (e) => {
    e.preventDefault();
    if (!userMessage.trim()) return;
    
    const newUserMessage = {
      role: 'user',
      content: userMessage
    };
    
    setChatMessages(prev => [...prev, newUserMessage]);
    setUserMessage('');
    setIsLoading(true);
    
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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',
          'HTTP-Referer': 'https://doconcall.com',
          'X-Title': 'Doconcall Health Assistant'
        },
        body: JSON.stringify({
          model: 'openai/gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a helpful healthcare assistant for Doconcall. Provide helpful but cautious health information. 
              Your responses should be:
              1. Professional yet friendly
              2. Focused on Nigerian healthcare context
              3. Provide general advice but always recommend consulting a doctor
              4. Never diagnose conditions or prescribe treatments
              5. Keep responses concise but informative
              6. For serious symptoms, always advise immediate medical attention
              7. When suggesting doctors, recommend relevant specialties based on symptoms`
            },
            ...chatMessages.filter((msg, index) => index !== 0).slice(-5),
            newUserMessage
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.choices?.[0]?.message?.content) {
        setChatMessages(prev => [...prev, {
          role: 'assistant',
          content: data.choices[0].message.content
        }]);
      } else {
        setChatMessages(prev => [...prev, {
          role: 'assistant',
          content: "I'm having some technical difficulties. Here's what I can suggest:\n\n" +
                   "1. Try rephrasing your question\n" +
                   "2. Check your internet connection\n" +
                   "3. For urgent medical help, please call emergency services\n\n" +
                   "You can also try searching for doctors or hospitals using the app features."
        }]);
      }
    } catch (error) {
      console.error('Error calling OpenRouter API:', error);
      
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: "I apologize for the inconvenience. As your health assistant, I want to ensure you get proper care.\n\n" +
                 "While we fix this technical issue, you can:\n" +
                 "• Use the 'Find Doctor' tab to connect with healthcare providers\n" +
                 "• Search nearby hospitals in the 'Find Hospital' section\n" +
                 "• For emergencies, please contact your local hospital immediately"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Logo component
  const Logo = () => (
    <div className="flex items-center justify-center gap-2">
      <div className="relative">
        <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center">
          <Heart className="absolute text-white" size={18} />
        </div>
        <Phone className="absolute bottom-0 right-0 text-white bg-green-500 rounded-full p-1" size={16} />
      </div>
      <h1 className="text-3xl font-bold text-white">Doconcall</h1>
    </div>
  );

  const renderFindDoctor = () => (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by name or specialty"
            className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
          Find Doctor
        </button>
      </form>

      <div className="grid grid-cols-1 gap-4">
        {searchResults.map(doctor => (
          <div key={doctor.id} className="bg-white p-4 rounded-lg shadow-md border border-blue-100 hover:shadow-lg transition">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img src={doctor.image} alt={doctor.name} className="w-16 h-16 rounded-full object-cover border-2 border-blue-500" />
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-4 h-4 border-2 border-white"></div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-800">{doctor.name}</h3>
                <p className="text-gray-600">{doctor.specialty}</p>
                <p className="text-sm text-gray-500">{doctor.hospital}</p>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1">{doctor.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin size={16} className="text-blue-500" />
                    <span className="ml-1">{doctor.distance}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => {
                  setSelectedDoctor(doctor);
                  setActiveTab('contactDoctor');
                }} 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Contact
              </button>
            </div>
          </div>
        ))}
        {searchResults.length === 0 && searchTerm && <p className="text-center text-gray-600 py-4">No doctors found. Try another search.</p>}
      </div>
    </div>
  );

  const renderContactDoctor = () => (
    <div className="flex flex-col gap-6">
      {selectedDoctor ? (
        <div className="bg-white p-6 rounded-lg shadow-md border border-blue-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <img src={selectedDoctor.image} alt={selectedDoctor.name} className="w-20 h-20 rounded-full object-cover border-2 border-blue-500" />
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-4 h-4 border-2 border-white"></div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-800">{selectedDoctor.name}</h3>
              <p className="text-gray-600">{selectedDoctor.specialty}</p>
              <p className="text-gray-500 text-sm">{selectedDoctor.hospital}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Phone size={20} className="text-blue-600" />
              <span>{selectedDoctor.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={20} className="text-blue-600" />
              <span>{selectedDoctor.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-blue-600" />
              <span>{selectedDoctor.availability}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-blue-600" />
              <span>{selectedDoctor.distance}</span>
            </div>
          </div>
          
          <form onSubmit={handleContactDoctor} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Send a message:</label>
              <textarea
                rows="4"
                placeholder="Describe your symptoms or ask about appointment availability..."
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
              <Mail size={16} />
              Send Message
            </button>
          </form>
        </div>
      ) : (
        <div className="text-center py-8 bg-blue-50 rounded-lg">
          <User size={48} className="mx-auto mb-4 text-blue-400" />
          <h3 className="text-xl font-medium text-blue-700">No doctor selected</h3>
          <p className="text-gray-500 mt-2">Please search and select a doctor to contact</p>
          <button 
            onClick={() => setActiveTab('findDoctor')} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Find a Doctor
          </button>
        </div>
      )}
    </div>
  );

  const renderFindHospital = () => (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Enter your location or hospital name"
            className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
          Find Hospital
        </button>
      </form>

      <div className="bg-gray-100 rounded-lg overflow-hidden shadow-md h-64 border border-blue-100">
        {hasSearched ? (
          <div ref={mapRef} className="w-full h-full">
            {/* Google Maps will render here after search */}
          </div>
        ) : (
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d1015531.1949934213!2d6.820221684153715!3d6.141618858518204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1shopstials%20in%20nigeria!5e0!3m2!1sen!2sng!4v1744900770127!5m2!1sen!2sng" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Default Hospitals Map"
          ></iframe>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {searchResults.map(hospital => (
          <div key={hospital.id} className="bg-white p-4 rounded-lg shadow-md border border-blue-100 hover:shadow-lg transition">
            <div className="flex items-start gap-4">
              <Hospital size={24} className="mt-1 text-blue-600" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-800">{hospital.name}</h3>
                <p className="text-gray-600">{hospital.address}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center">
                    <Phone size={16} className="text-blue-500" />
                    <span className="ml-1">{hospital.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin size={16} className="text-blue-500" />
                    <span className="ml-1">{hospital.distance}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleGetDirections(hospital)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-1"
              >
                <Map size={16} />
                Directions
              </button>
            </div>
          </div>
        ))}
        {searchResults.length === 0 && location && hasSearched && (
          <p className="text-center text-gray-600 py-4">No hospitals found. Try another search.</p>
        )}
      </div>
    </div>
  );

  const renderChatBot = () => (
    <div className={`fixed bottom-6 right-6 z-50 w-80 bg-white rounded-lg shadow-xl transition-all duration-300 ${isChatOpen ? 'h-96' : 'h-12'} border border-blue-200 flex flex-col`}>
      <div 
        className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center cursor-pointer flex-shrink-0"
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        <div className="flex items-center gap-2">
          <div className="bg-white rounded-full p-1">
            <Heart size={16} className="text-blue-600" />
          </div>
          <span>Doconcall Health Assistant</span>
        </div>
        <span>{isChatOpen ? '−' : '+'}</span>
      </div>
      
      {isChatOpen && (
        <>
          <div 
            ref={chatContainerRef}
            className="flex-1 p-4 overflow-y-auto bg-gray-50 h-full"
            style={{ maxHeight: "calc(100% - 96px)" }}
          >
            {chatMessages.map((msg, index) => (
              <div 
                key={index} 
                className={`mb-3 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
              >
                <div 
                  className={`inline-block p-3 rounded-lg max-w-xs ${msg.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-800 border border-gray-200 shadow-sm'}`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-left mb-3">
                <div className="inline-block p-3 rounded-lg bg-white text-gray-800 border border-gray-200 shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <form onSubmit={sendMessageToAI} className="p-3 border-t bg-white flex-shrink-0 rounded-b-lg">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask about symptoms, doctors..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                disabled={isLoading}
              />
              <button 
                type="submit" 
                className="bg-blue-600 text-white p-2 rounded-lg disabled:bg-blue-400 flex items-center justify-center"
                disabled={isLoading || !userMessage.trim()}
              >
                <MessageSquare size={18} />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'findDoctor':
        return renderFindDoctor();
      case 'contactDoctor':
        return renderContactDoctor();
      case 'findHospital':
        return renderFindHospital();
      default:
        return renderFindDoctor();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100">
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-4">
          <div className="flex justify-center p-2">
            <Logo />
          </div>
          <p className="text-white text-center mt-2">Your Health, Our Priority - Doctors Online 24/7</p>
        </div>
        
        <div className="p-6">
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-md shadow-sm p-1 bg-gray-100">
              <button
                onClick={() => setActiveTab('findDoctor')}
                className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-1 ${
                  activeTab === 'findDoctor' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <User size={16} />
                Find Doctor
              </button>
              <button
                onClick={() => setActiveTab('contactDoctor')}
                className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-1 ${
                  activeTab === 'contactDoctor' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Phone size={16} />
                Contact Doctor
              </button>
              <button
                onClick={() => setActiveTab('findHospital')}
                className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-1 ${
                  activeTab === 'findHospital' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Hospital size={16} />
                Find Hospital
              </button>
            </div>
          </div>
          
          {renderActiveTab()}
        </div>
      </div>
      
      {renderChatBot()}
    </div>
  );
}