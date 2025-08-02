import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

// Komponent för att visa svårighetsgraden visuellt
const DifficultyRating = ({ level = 1 }) => (
    <div className="flex items-center" title={`Svårighetsgrad: ${level} av 4`}>
      <span className="text-xs text-gray-500 mr-2">Nivå:</span>
      <div className="flex items-center gap-1">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className={`w-3 h-3 rounded-full ${index < level ? 'bg-indigo-500' : 'bg-gray-300'}`}></div>
        ))}
      </div>
    </div>
);

// Funktion för att sätta en färggradient på ramen baserat på svårighetsgrad
const getDifficultyBorder = (difficulty) => {
    switch (difficulty) {
      case 1: return 'from-green-400 to-teal-500';
      case 2: return 'from-sky-400 to-blue-500';
      case 3: return 'from-amber-400 to-orange-500';
      case 4: return 'from-rose-500 to-red-600';
      default: return 'from-gray-200 to-gray-300';
    }
};

function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  useEffect(() => {
    api.get('/quizzes')
      .then(response => setQuizzes(response.data))
      .catch(err => console.error("Fel vid hämtning av quiz:", err))
      .finally(() => setLoading(false));
  }, []);

  // Filtrera och sortera quiz
  const processedQuizzes = useMemo(() => {
    let filtered = [...quizzes];

    // Steg 1: Filtrera
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(q => q.difficulty === parseInt(difficultyFilter));
    }

    // Steg 2: Sortera (alltid från lättast till svårast)
    filtered.sort((a, b) => (a.difficulty || 1) - (b.difficulty || 1));
    
    return filtered;
  }, [quizzes, difficultyFilter]);

  if (loading) return <div className="text-center p-10">Laddar quiz...</div>;

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="hidden from-green-400 to-teal-500 from-sky-400 to-blue-500 from-amber-400 to-orange-500 from-rose-500 to-red-600 from-gray-200 to-gray-300"></div>
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
            <h1 className="text-4xl font-bold text-gray-800">Testa dina kunskaper</h1>
            <p className="text-gray-500 mt-1">Välj ett quiz nedan för att se vad du kan.</p>
        </div>
        {/* Filter */}
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">Filtrera på nivå</label>
          <select 
            id="difficulty" 
            value={difficultyFilter} 
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Alla nivåer</option>
            <option value="1">1 (Nybörjare)</option>
            <option value="2">2 (Grundläggande)</option>
            <option value="3">3 (Medel)</option>
            <option value="4">4 (Avancerad)</option>
          </select>
        </div>
      </header>
      <div className="space-y-4">
        {processedQuizzes.map(quiz => (
          <Link to={`/quiz/${quiz._id}`} key={quiz._id} className={`block p-1 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br ${getDifficultyBorder(quiz.difficulty)}`}>
            <div className="bg-white rounded-md p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-indigo-700">{quiz.title}</h2>
                    <p className="text-gray-600 mt-1">{quiz.description}</p>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    {quiz.difficulty && <DifficultyRating level={quiz.difficulty} />}
                  </div>
                </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

export default QuizList;
