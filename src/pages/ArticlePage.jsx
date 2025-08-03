import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

// Ikon-komponent för tidslinjen
const TimelineIcon = ({ icon }) => {
  let path;
  switch (icon) {
    case 'brain': path = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 8h6m-5 4h4m2 4h-3a4 4 0 100-8h3V5a2 2 0 10-2-2H6a2 2 0 100 4v3a4 4 0 004 4z" />; break;
    case 'chat': path = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />; break;
    case 'game': path = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />; break;
    default: path = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />;
  }
  return (
    <div className="absolute w-10 h-10 bg-indigo-600 rounded-full -left-5 border-4 border-white flex items-center justify-center text-white">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">{path}</svg>
    </div>
  );
};

function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/articles/${slug}`)
      .then(response => setArticle(response.data))
      .catch(err => console.error("Fel vid hämtning av artikel:", err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="text-center p-10">Laddar artikel...</div>;
  if (!article) return <div className="text-center p-10">Artikeln kunde inte hittas.</div>;

  return (
    <div className="bg-white">
      {/* Hero-sektion med bild */}
      <div className="relative h-80">
        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-8 md:p-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">{article.title}</h1>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <p className="text-xl text-gray-600 leading-relaxed mb-12">{article.introduction}</p>
        
        {/* Tidslinje */}
        <div className="relative">
          {/* Den vertikala linjen */}
          <div className="absolute left-0 h-full w-0.5 bg-gray-200 ml-[1px]"></div>
          
          <div className="space-y-12">
            {article.events.map((event, index) => (
              <div key={index} className="relative pl-12">
                <TimelineIcon icon={event.icon} />
                <p className="text-2xl font-bold text-indigo-600">{event.year}</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">{event.title}</h3>
                <p className="text-gray-700 mt-2 text-lg">{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ArticlePage;
