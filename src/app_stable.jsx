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

// App-komponenten måste vara inuti en Router-komponent för att hooks ska fungera
function AppContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allCourses, setAllCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [filters, setFilters] = useState({
    language: 'all',
    difficulty: 'all',
    category: 'all',
    courseType: 'all',
  });
  const [sortBy, setSortBy] = useState('date');

  // Hooks för navigering
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Hämta alla kurser direkt, oavsett inloggningsstatus
    api.get("/courses")
      .then(res => setAllCourses(res.data))
      .catch(err => console.error("Fel vid hämtning av kurser:", err));

    // Lyssna på ändringar i inloggningsstatus
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Om användaren är inloggad, hämta hens personliga data
        api.get("/enrollments/my-courses")
          .then(res => setEnrollments(res.data))
          .catch(err => console.error("Fel vid hämtning av enrollments:", err));
      } else {
        // Om användaren loggar ut, rensa personlig data
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

  const handleLoginClick = () => {
    sessionStorage.setItem('redirectPath', location.pathname + location.search);
    navigate('/login');
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
    <div className="bg-gray-100 min-h-screen font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-3 flex justify-between items-center max-w-7xl">
          <Link to="/" className="text-xl font-bold text-indigo-600">kursplattform</Link>
          <div className="flex items-center gap-4">
            <Link to="/quizzes" className="text-gray-600 hover:text-indigo-600 font-medium">Quiz</Link>
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
        </nav>
      </header>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <>
              <FeaturedCourses courses={featuredCourses} />
              <main className="container mx-auto px-4 py-8 max-w-7xl">
                <FilterControls 
                  courses={allCourses} 
                  onFilterChange={setFilters} 
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                />
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
      </Routes>
    </div>
  );
}

// Wrapper-komponent för att ge AppContent tillgång till router-hooks
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
