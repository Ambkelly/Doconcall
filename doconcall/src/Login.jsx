// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdFheQqiKjt9lgZY1gtmeQk05zekzQTBs",
  authDomain: "doconcall-42f50.firebaseapp.com",
  projectId: "doconcall-42f50",
  storageBucket: "doconcall-42f50.firebasestorage.app",
  messagingSenderId: "696722823807",
  appId: "1:696722823807:web:0438b2f69e04d4574e7d4a",
  measurementId: "G-PEF6J1VT9L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

import { useState } from 'react';
import { User, Eye, EyeOff, Mail, Lock, ChevronRight, ArrowLeft, Heart, Phone } from 'lucide-react';

export default function AuthComponent({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [sex, setSex] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [genotype, setGenotype] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [allergies, setAllergies] = useState('');
  
  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      setError(getFirebaseErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };
  
  // Handle signup
  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (currentStep < 2) {
      setCurrentStep(2);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // First create the user with email/password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Here you would typically save the additional user data to Firestore or Realtime Database
      // For now, we'll just log it and proceed
      const userData = {
        uid: user.uid,
        email,
        fullName,
        phone,
        sex,
        bloodGroup,
        genotype,
        height,
        weight,
        allergies
      };
      
      console.log('User created with data:', userData);
      
      // In a real app, you would save this to your database:
      // await setDoc(doc(db, "users", user.uid), userData);
      
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      setError(getFirebaseErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to convert Firebase error codes to user-friendly messages
  const getFirebaseErrorMessage = (code) => {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'This email is already in use. Please use a different email.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.';
      default:
        return 'An error occurred. Please try again.';
    }
  };
  
  // Handle mode toggle (login/signup)
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setCurrentStep(1);
    setError(null);
  };
  
  // Logo component
  const Logo = () => (
    <div className="flex items-center justify-center gap-2">
      <div className="relative">
        <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center">
          <Heart className="absolute text-white" size={16} />
        </div>
        <Phone className="absolute bottom-0 right-0 text-white bg-green-500 rounded-full p-0.5" size={12} />
      </div>
      <h1 className="text-2xl font-bold text-blue-700">Doconcall</h1>
    </div>
  );
  
  // Login form
  const renderLoginForm = () => (
    <form onSubmit={handleLogin} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-gray-700 mb-1 text-sm font-medium">Email Address</label>
        <div className="relative">
          <input
            type="email"
            placeholder="your@email.com"
            className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
        </div>
      </div>
      
      <div>
        <label className="block text-gray-700 mb-1 text-sm font-medium">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
          />
          <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
          <button 
            type="button"
            className="absolute right-3 top-3 text-gray-400"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
      
      <div className="text-right">
        <a href="#" className="text-blue-600 text-sm hover:underline">Forgot password?</a>
      </div>
      
      <button 
        type="submit" 
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-70"
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
        {!loading && <ChevronRight size={18} />}
      </button>
    </form>
  );
  
  // Signup form - Step 1 (Basic Info)
  const renderSignupStep1 = () => (
    <form onSubmit={handleSignup} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-gray-700 mb-1 text-sm font-medium">Full Name</label>
        <div className="relative">
          <input
            type="text"
            placeholder="John Doe"
            className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <User className="absolute left-3 top-3 text-gray-400" size={20} />
        </div>
      </div>
      
      <div>
        <label className="block text-gray-700 mb-1 text-sm font-medium">Email Address</label>
        <div className="relative">
          <input
            type="email"
            placeholder="your@email.com"
            className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
        </div>
      </div>
      
      <div>
        <label className="block text-gray-700 mb-1 text-sm font-medium">Phone Number</label>
        <div className="relative">
          <input
            type="tel"
            placeholder="+234 812 345 6789"
            className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
        </div>
      </div>
      
      <div>
        <label className="block text-gray-700 mb-1 text-sm font-medium">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="•••••••• (min 6 characters)"
            className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
          />
          <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
          <button 
            type="button"
            className="absolute right-3 top-3 text-gray-400"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
      
      <button 
        type="submit" 
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-70"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Continue'}
        {!loading && <ChevronRight size={18} />}
      </button>
    </form>
  );
  
  // Signup form - Step 2 (Health Info)
  const renderSignupStep2 = () => (
    <form onSubmit={handleSignup} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 mb-1 text-sm font-medium">Sex</label>
          <select
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={sex}
            onChange={(e) => setSex(e.target.value)}
            required
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1 text-sm font-medium">Blood Group</label>
          <select
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            required
          >
            <option value="">Select</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-gray-700 mb-1 text-sm font-medium">Genotype</label>
        <select
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={genotype}
          onChange={(e) => setGenotype(e.target.value)}
          required
        >
          <option value="">Select</option>
          <option value="AA">AA</option>
          <option value="AS">AS</option>
          <option value="AC">AC</option>
          <option value="SS">SS</option>
          <option value="SC">SC</option>
          <option value="CC">CC</option>
        </select>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 mb-1 text-sm font-medium">Height (cm)</label>
          <input
            type="number"
            placeholder="170"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1 text-sm font-medium">Weight (kg)</label>
          <input
            type="number"
            placeholder="70"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-gray-700 mb-1 text-sm font-medium">Allergies (if any)</label>
        <textarea
          rows="3"
          placeholder="List any allergies or write 'None'"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
        ></textarea>
      </div>
      
      <div className="flex gap-2">
        <button 
          type="button" 
          onClick={() => setCurrentStep(1)}
          className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition flex items-center justify-center gap-2 disabled:opacity-70"
          disabled={loading}
        >
          <ArrowLeft size={18} />
          Back
        </button>
        
        <button 
          type="submit" 
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-70"
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Complete Signup'}
          {!loading && <ChevronRight size={18} />}
        </button>
      </div>
    </form>
  );
  
  return (
    <div className="max-w-lg mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100">
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-6 flex flex-col items-center">
          <Logo />
          <p className="text-white text-center mt-2">Your Health, Our Priority - Doctors Online 24/7</p>
        </div>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center mb-6 text-blue-800">
            {isLogin ? 'Welcome Back' : (currentStep === 1 ? 'Create Account' : 'Health Information')}
          </h2>
          
          {isLogin ? (
            renderLoginForm()
          ) : (
            currentStep === 1 ? renderSignupStep1() : renderSignupStep2()
          )}
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button"
                onClick={toggleMode}
                className="text-blue-600 font-medium hover:underline"
                disabled={loading}
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}