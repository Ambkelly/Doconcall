import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';
import DoctorFinderApp from './home';
import AuthComponent from './Login';
import Footer from './footer'; // Import the Footer component
import { LogIn, LogOut, Home } from 'lucide-react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Mock login function - replace with your actual authentication logic
  const handleLogin = () => {
    setIsAuthenticated(true);
  };
  
  // Mock logout function
  const handleLogout = () => {
    setIsAuthenticated(false);
  };
  
  return (
    <Router>
      <div className="app-container flex flex-col min-h-screen">
        {/* Header with navigation links */}
        <header className="bg-blue-600 text-white p-3 shadow-md">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <Link to="/" className="text-white font-bold text-xl flex items-center gap-2">
              <Home size={20} />
              Doconcall
            </Link>
            
            <nav>
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="bg-white text-blue-600 px-4 py-1 rounded-md flex items-center gap-1 hover:bg-blue-50 transition"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="bg-white text-blue-600 px-4 py-1 rounded-md flex items-center gap-1 hover:bg-blue-50 transition"
                >
                  <LogIn size={16} />
                  Login
                </Link>
              )}
            </nav>
          </div>
        </header>
        
        {/* Application Routes */}
        <main className="flex-grow">
          <Routes>
            {/* Protected Home Route */}
            <Route
              path="/"
              element={
                isAuthenticated ?
                 <DoctorFinderApp /> :
                 <Navigate to="/login" replace />
              }
            />
            
            {/* Login/Signup Route */}
            <Route
              path="/login"
              element={
                isAuthenticated ?
                 <Navigate to="/" replace /> :
                 <AuthComponent onLoginSuccess={handleLogin} />
              }
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;