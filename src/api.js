import axios from "axios";
import { auth } from './firebase'; // Importera auth-instansen

const api = axios.create({
  baseURL: '/api',
});

// Gör interceptorn "async" för att kunna invänta en token
api.interceptors.request.use(async (config) => {
  // Om det finns en inloggad användare...
  if (auth.currentUser) {
    try {
      // ...hämta den senaste och garanterat giltiga token.
      const token = await auth.currentUser.getIdToken(true);
      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error("Kunde inte hämta token:", error);
      // Här kan du eventuellt logga ut användaren om token är ogiltig
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
      // Du kan ta bort localStorage-raden härifrån om du vill,
      // eftersom vi inte längre är beroende av den.
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
