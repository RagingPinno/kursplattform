import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

function FlashcardPage() {
  const { deckId } = useParams();
  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    api.get(`/flashcards/${deckId}`)
      .then(response => setDeck(response.data))
      .catch(err => console.error("Fel vid hämtning av kortlek:", err))
      .finally(() => setLoading(false));
  }, [deckId]);

  const handleFlip = () => setIsFlipped(!isFlipped);
  const handleNext = () => {
    setIsFlipped(false);
    // Liten fördröjning för att vändningen ska hinna slutföras innan kortet byts
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % deck.cards.length);
    }, 150);
  };
  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + deck.cards.length) % deck.cards.length);
    }, 150);
  };

  if (loading) return <div className="text-center p-10">Laddar kort...</div>;
  if (!deck || deck.cards.length === 0) return <div className="text-center p-10">Kunde inte hitta kortleken.</div>;

  const currentCard = deck.cards[currentIndex];

  return (
    <main className="container mx-auto px-4 py-8 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">{deck.deckTitle}</h1>
        <p className="text-center text-gray-500 mb-6">Kort {currentIndex + 1} av {deck.cards.length}</p>

        {/* ✅ Ny, mer robust struktur för kortet */}
        <div className="[perspective:1000px]">
          <div 
            onClick={handleFlip}
            className={`relative w-full h-80 transition-transform duration-700 ease-in-out [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
          >
            {/* Framsida */}
            <div className="absolute w-full h-full rounded-lg shadow-xl flex items-center justify-center p-8 text-center bg-white [backface-visibility:hidden]">
              <p className="text-2xl font-semibold text-gray-800">{currentCard.question}</p>
            </div>
            {/* Baksida */}
            <div className="absolute w-full h-full bg-indigo-600 text-white rounded-lg p-8 flex items-center justify-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
              <p className="text-lg">{currentCard.answer}</p>
            </div>
          </div>
        </div>

        {/* Kontroller */}
        <div className="mt-6 flex justify-between items-center">
          <button onClick={handlePrev} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">Föregående</button>
          <button onClick={handleFlip} className="font-semibold text-indigo-600">Vänd kort</button>
          <button onClick={handleNext} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">Nästa</button>
        </div>
        
        <div className="text-center mt-8">
            <Link to="/flashcards" className="text-sm text-gray-500 hover:underline">Tillbaka till alla kortlekar</Link>
        </div>
      </div>
    </main>
  );
}

export default FlashcardPage;
