// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9VbzsDNtDkTU2NdPkUIUrooSO5wbmQbE",
  authDomain: "course-platform-cccec.firebaseapp.com",
  projectId: "course-platform-cccec",
  storageBucket: "course-platform-cccec.firebasestorage.app",
  messagingSenderId: "657753165755",
  appId: "1:657753165755:web:ae5407ac37215b733c3e9e",
  measurementId: "G-PGRMTKNGMR"
};

// ✅ Initiera Firebase-appen
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ✅ Exportera för att använda i andra filer
export { auth, provider };