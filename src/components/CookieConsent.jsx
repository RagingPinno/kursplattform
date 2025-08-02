import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Kontrollera om användaren redan har gett sitt samtycke
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    // Spara samtycket i localStorage och dölj banderollen
    localStorage.setItem('cookie_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-800 text-white p-4 shadow-lg z-50">
      <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-300">
          Vi använder cookies för att säkerställa att du får den bästa upplevelsen på vår webbplats. Genom att fortsätta använda sidan godkänner du vår {' '}
          <Link to="/privacy-policy" className="font-semibold text-white hover:underline">personuppgiftspolicy</Link>.
        </p>
        <button 
          onClick={handleAccept}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors flex-shrink-0"
        >
          Jag förstår
        </button>
      </div>
    </div>
  );
}

export default CookieConsent;
