import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-blue-700 text-white py-4">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <p className="text-sm text-blue-100">&copy; {currentYear} Doconcall. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2 text-sm">
          <a href="#" className="text-blue-200 hover:text-white transition">Privacy Policy</a>
          <a href="#" className="text-blue-200 hover:text-white transition">Terms of Service</a>
          <a href="#" className="text-blue-200 hover:text-white transition">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
}