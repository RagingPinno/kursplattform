import axios from "axios";
import { auth } from './firebase';

/**
 * Bestämmer vilken backend-URL som ska användas.
 * Under utveckling (när du kör `npm run dev`) kommer den att använda din lokala proxy ('/api').
 * I produktion (efter `npm run build` på Netlify) kommer den att använda den URL 
 * du har angett i miljövariabeln VITE_API_URL.
 */
const baseURL = import.meta.env.DEV ? '/api' : import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: baseURL,
});

// Gör interceptorn "async" för att kunna invänta en token
api.interceptors.request.use(async (config) => {
  if (auth.currentUser) {
    try {
      const token = await auth.currentUser.getIdToken(true);
      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error("Kunde inte hämta token:", error);
    }
  }
  return config;
}, 
(error) => Promise.reject(error)
);

// Svaret-interceptorn kan vara oförändrad
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      sessionStorage.setItem('redirectPath', window.location.pathname);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

