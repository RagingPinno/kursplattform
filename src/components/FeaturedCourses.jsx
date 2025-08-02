import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function FeaturedCourses({ courses }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!courses || courses.length === 0) return;

    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % courses.length);
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentIndex, courses]);

  if (!courses || courses.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full h-64 md:h-80 bg-gray-800">
      {courses.map((course, index) => (
        <Link 
          to={`/course/${course._id}`} 
          key={course._id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${course.imageUrl || 'https://placehold.co/1200x400/2d3748/ffffff?text=Ingen+bild'})` }}
          >
            {/* Mörkare overlay för bättre textläsbarhet */}
            <div className="w-full h-full bg-gradient-to-t from-black/70 via-black/40 to-transparent">
              {/* ✅ Centrerad container för textinnehållet */}
              <div className="container mx-auto px-4 max-w-7xl h-full flex flex-col justify-end py-8 md:py-12">
                <div className="relative z-10 text-white">
                  <p className="text-sm font-semibold opacity-80">{course.provider}</p>
                  <h3 className="text-2xl md:text-3xl font-bold leading-tight mt-1">{course.title}</h3>
                  <p className="mt-2 text-sm md:text-base opacity-90 max-w-2xl">{course.shortDescription}</p>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
      
      {/* Navigationsprickar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {courses.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50 hover:bg-white'
            }`}
          ></button>
        ))}
      </div>
    </section>
  );
}

export default FeaturedCourses;
