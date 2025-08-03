import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

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

const getDifficultyBorder = (difficulty) => {
    switch (difficulty) {
      case 1: return 'from-green-400 to-teal-500';
      case 2: return 'from-sky-400 to-blue-500';
      case 3: return 'from-amber-400 to-orange-500';
      case 4: return 'from-rose-500 to-red-600';
      default: return 'from-gray-200 to-gray-300';
    }
};

function FlashcardDecks() {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/flashcards')
      .then(response => setDecks(response.data))
      .catch(err => console.error("Fel vid hämtning av kortlekar:", err))
      .finally(() => setLoading(false));
  }, []);

  // ✅ Sortera kortlekarna efter svårighetsgrad
  const sortedDecks = useMemo(() => {
    return [...decks].sort((a, b) => (a.difficulty || 1) - (b.difficulty || 1));
  }, [decks]);

  if (loading) return <div className="text-center p-10">Laddar kortlekar...</div>;

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="hidden from-green-400 to-teal-500 from-sky-400 to-blue-500 from-amber-400 to-orange-500 from-rose-500 to-red-600 from-gray-200 to-gray-300"></div>
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Flashcards</h1>
        <p className="text-gray-500 mt-1">Repetera och lär dig nya begrepp med våra interaktiva kortlekar.</p>
      </header>
      <div className="space-y-4">
        {sortedDecks.map(deck => (
          <Link to={`/flashcards/${deck._id}`} key={deck._id} className={`block p-1 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br ${getDifficultyBorder(deck.difficulty)}`}>
            <div className="bg-white rounded-md p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-indigo-700">{deck.deckTitle}</h2>
                    <p className="text-gray-600 mt-1">{deck.description}</p>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    {deck.difficulty && <DifficultyRating level={deck.difficulty} />}
                  </div>
                </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

export default FlashcardDecks;
