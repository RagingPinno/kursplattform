import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from './firebase';

// En inline SVG-komponent för Google-logotypen
const GoogleIcon = () => (
  <svg className="w-6 h-6 mr-3" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
      s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
      s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039
      l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
      c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
      c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
  </svg>
);

function Login() {
  const login = async () => {
    try {
      // onAuthStateChanged i App.jsx hanterar vad som händer efter inloggning.
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Inloggningen avbröts eller misslyckades", error);
    }
  };

  return (
    // Huvudcontainer som centrerar allt på skärmen
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        
        {/* Ikon och titel */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            {/* En enkel lås-ikon som illustration */}
            <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Välkommen!</h1>
          <p className="text-gray-500 mt-2">Logga in för att se dina kurser.</p>
        </div>

        {/* Inloggningsknapp */}
        <button 
          onClick={login} 
          className="w-full inline-flex items-center justify-center bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg shadow-sm transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          <GoogleIcon />
          <span>Logga in med Google</span>
        </button>

      </div>
      <footer className="mt-8 text-center text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Din Kursplattform</p>
      </footer>
    </div>
  );
}

export default Login;
