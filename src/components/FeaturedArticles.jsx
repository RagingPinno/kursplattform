import React from 'react';
import { Link } from 'react-router-dom';

function FeaturedArticles({ articles }) {
  if (!articles || articles.length === 0) {
    return null; // Visa inget om det inte finns några artiklar
  }

  return (
    <section className="bg-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Läs mer</h2>
        {/* Horisontellt scrollande container */}
        <div className="flex overflow-x-auto space-x-6 pb-4">
          {articles.map(article => (
            <Link to={`/article/${article.slug}`} key={article._id} className="flex-shrink-0 w-64 group">
              <div className="rounded-lg overflow-hidden shadow-md">
                <img 
                  src={article.imageUrl || 'https://placehold.co/400x200/e2e8f0/cbd5e0?text=Artikel'} 
                  alt={article.title} 
                  className="w-full h-32 object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="mt-2 font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors">{article.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedArticles;
