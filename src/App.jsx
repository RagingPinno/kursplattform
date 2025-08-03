import React, { useEffect, useState, useMemo } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import api from './api.js';
import CourseList from "./CourseList";
import Login from "./Login";
import CourseDetail from "./pages/CourseDetail";
import MyCourses from "./pages/MyCourses";
import FilterControls from "./components/FilterControls";
import FeaturedCourses from "./components/FeaturedCourses";
import QuizList from "./pages/QuizList";
import Quiz from "./pages/Quiz";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookieConsent from "./components/CookieConsent";
import ArticlePage from "./pages/ArticlePage"; 
import FeaturedArticles from "./components/FeaturedArticles"; // ✅ Importerar artikelkarusellen

// Dedikerad komponent för sidhuvudet
const Header = ({ user, handleLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginClick = () => {
    sessionStorage.setItem('redirectPath', location.pathname + location.search);
    navigate('/login');
  };
  
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center max-w-7xl">
        <Link to="/" className="text-xl font-bold text-indigo-600" onClick={closeMenu}>
          kursplattform
        </Link>
        <div className="hidden md:flex items-center gap-4">
          <Link to="/quizzes" className="text-gray-600 hover:text-indigo-600 font-medium">Gör ett quiz</Link>
          {user ? (
            <>
              <Link to="/my-courses" className="bg-orange-500 text-white hover:bg-orange-600 font-semibold py-2 px-4 rounded-lg text-sm transition-colors">
                Mina kurser
              </Link>
              <button onClick={handleLogout} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg transition-colors text-sm">
                Logga ut
              </button>
            </>
          ) : (
            <button onClick={handleLoginClick} className="bg-indigo-600 text-white hover:bg-indigo-700 font-semibold py-2 px-4 rounded-lg text-sm transition-colors">
              Logga in
            </button>
          )}
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-indigo-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </button>
        </div>
      </nav>
      <div className={`md:hidden fixed top-0 left-0 w-full h-full bg-white z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-4 border-b">
           <Link to="/" className="text-xl font-bold text-indigo-600" onClick={closeMenu}>kursplattform</Link>
          <button onClick={closeMenu} className="text-gray-600 hover:text-indigo-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div className="flex flex-col items-center gap-6 mt-8">
          <Link to="/quizzes" className="text-lg text-gray-700 font-medium" onClick={closeMenu}>Gör ett quiz</Link>
          {user ? (
            <>
              <Link to="/my-courses" className="text-lg text-gray-700 font-medium" onClick={closeMenu}>Mina kurser</Link>
              <button onClick={() => { handleLogout(); closeMenu(); }} className="text-lg text-gray-700 font-medium">Logga ut</button>
            </>
          ) : (
            <button onClick={() => { handleLoginClick(); closeMenu(); }} className="text-lg text-gray-700 font-medium">Logga in</button>
          )}
        </div>
      </div>
    </header>
  );
};

function AppContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allCourses, setAllCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [articles, setArticles] = useState([]); // ✅ State för artiklar
  const [filters, setFilters] = useState({
    language: 'all',
    difficulty: 'all',
    category: 'all',
    courseType: 'all',
  });
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    // Hämta all offentlig data direkt
    Promise.all([
      api.get("/courses"),
      api.get("/articles") // ✅ Hämta artiklar
    ]).then(([coursesRes, articlesRes]) => {
      setAllCourses(coursesRes.data);
      setArticles(articlesRes.data);
    }).catch(err => {
      console.error("Fel vid hämtning av initial data:", err);
    });

    // Lyssna på ändringar i inloggningsstatus
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        api.get("/enrollments/my-courses")
          .then(res => setEnrollments(res.data))
          .catch(err => console.error("Fel vid hämtning av enrollments:", err));
      } else {
        setEnrollments([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleCourseUpdate = (updatedCourse) => {
    setAllCourses(currentCourses => 
      currentCourses.map(course => 
        course._id === updatedCourse._id ? updatedCourse : course
      )
    );
  };

  const featuredCourses = useMemo(() => {
    return [...allCourses]
      .filter(course => course.isFeatured)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [allCourses]);

  const processedCourses = useMemo(() => {
    let filtered = allCourses.filter(course => {
      const languageMatch = filters.language === 'all' || course.language === filters.language;
      const difficultyMatch = filters.difficulty === 'all' || course.difficulty === parseInt(filters.difficulty);
      const categoryMatch = filters.category === 'all' || course.category === filters.category;
      const typeMatch = filters.courseType === 'all' || course.courseType === filters.courseType;
      return languageMatch && difficultyMatch && categoryMatch && typeMatch;
    });

    if (sortBy === 'popularity') {
      filtered.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
    } else if (sortBy === 'date') {
      filtered.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });
    } else if (sortBy === 'difficulty') {
      filtered.sort((a, b) => (a.difficulty || 0) - (b.difficulty || 0));
    } else if (sortBy === 'category') {
      filtered.sort((a, b) => (a.category || '').localeCompare(b.category || ''));
    }

    return filtered;
  }, [allCourses, filters, sortBy]);

  const handleLogout = () => {
    signOut(auth);
  };

  if (loading) {
    return <p className="text-center p-10">Laddar plattformen...</p>;
  }

  return (
    <div className="bg-gray-100 min-h-screen font-sans flex flex-col">
      <Header user={user} handleLogout={handleLogout} />

      <div className="flex-grow">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <>
                <FeaturedCourses courses={featuredCourses} />
                <FeaturedArticles articles={articles} />
                <main className="container mx-auto px-4 py-8 max-w-7xl">
                  {/* Filterfunktionen är nu dold men finns kvar i koden */}
                  {/* <FilterControls 
                    courses={allCourses} 
                    onFilterChange={setFilters} 
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                  /> 
                  */}
                  <CourseList courses={processedCourses} enrollments={enrollments} />
                </main>
              </>
            }
          />
          <Route 
            path="/course/:courseId" 
            element={<CourseDetail user={user} onCourseUpdate={handleCourseUpdate} />} 
          />
          <Route
            path="/my-courses"
            element={!user ? <Navigate to="/login" /> : <MyCourses />}
          />
          <Route path="/quizzes" element={<QuizList />} />
          <Route path="/quiz/:quizId" element={<Quiz />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/article/:slug" element={<ArticlePage />} />
        </Routes>
      </div>

      <footer className="bg-gray-200 text-gray-600 text-sm text-center p-4">
        <div className="container mx-auto max-w-7xl">
          &copy; {new Date().getFullYear()} kursplattform | <Link to="/privacy-policy" className="hover:underline">Personuppgiftspolicy</Link>
        </div>
      </footer>
      <CookieConsent />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
