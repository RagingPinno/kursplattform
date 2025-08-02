import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

// Funktion för att sätta ram-färg baserat på svårighetsgrad
const getDifficultyBorder = (difficulty) => {
  switch (difficulty) {
    case 1: return 'from-green-400 to-teal-500';
    case 2: return 'from-sky-400 to-blue-500';
    case 3: return 'from-amber-400 to-orange-500';
    case 4: return 'from-rose-500 to-red-600';
    default: return 'from-gray-200 to-gray-300';
  }
};

// Komponent för PÅGÅENDE kurser
const OngoingCourseCard = ({ course }) => (
  <div className={`relative rounded-xl shadow-md p-1 bg-gradient-to-br ${getDifficultyBorder(course.difficulty)} transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full`}>
    <div className={`relative bg-white rounded-lg h-full flex flex-col p-4 ${!course.isActive ? 'opacity-60 bg-gray-50' : ''}`}>
      <Link to={`/course/${course._id}`} className="flex-grow">
        <p className="font-bold text-gray-800">{course.title}</p>
        <p className="text-sm text-gray-500 mb-3">av {course.provider}</p>
        <div className="mt-2 text-sm text-gray-600 border-t pt-3">
          <ul className="list-disc list-inside space-y-1">
            {course.targetAudience?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </Link>
      {course.link && (
        <a href={course.link} target="_blank" rel="noopener noreferrer" className="mt-4 w-full inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
          Fortsätt kurs
        </a>
      )}
    </div>
  </div>
);

// Komponent för ÖVRIGA (ej avslutade) kurser
const OtherCourseCard = ({ course, status }) => (
  <div className={`relative rounded-xl shadow-md p-1 bg-gradient-to-br ${getDifficultyBorder(course.difficulty)} transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
    <div className={`relative bg-white rounded-lg h-full flex items-center justify-between p-4 ${!course.isActive ? 'opacity-60 bg-gray-50' : ''}`}>
      <Link to={`/course/${course._id}`} className="flex-grow">
        <div>
          <p className="font-bold text-gray-800 pr-4">{course.title}</p>
          <p className="text-sm text-gray-500">av {course.provider}</p>
        </div>
      </Link>
      <div className="flex-shrink-0 flex items-center justify-end gap-2">
        {!course.isActive && (
          <span className="text-xs font-semibold bg-gray-200 text-gray-600 px-2 py-1 rounded-full">Arkiverad</span>
        )}
        {status === 'Avslutad' && (
          <div className="flex-shrink-0">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
        )}
      </div>
    </div>
  </div>
);

// Uppdaterad komponent för den högra kolumnen
const CompletedCoursesSidebar = ({ enrollments }) => {
  if (!enrollments || enrollments.length === 0) {
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
        <p className="font-semibold text-green-800">Inga avslutade kurser än.</p>
        <p className="text-sm text-green-700 mt-1">Fortsätt din lärresa!</p>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-4 shadow-md">
      <h2 className="text-xl font-bold text-gray-800 pb-2 mb-4 border-b-2 border-green-500 flex items-center">
        <svg className="w-6 h-6 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        Avklarade kurser
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {enrollments.map(({ _id, courseId, status }) => (
          <OtherCourseCard key={_id} course={courseId} status={status} />
        ))}
      </div>
    </div>
  );
};

// Komponent för en hel sektion (nu bara för ej avslutade kurser)
const CourseSection = ({ title, enrollments, color = 'indigo' }) => {
  if (!enrollments || enrollments.length === 0) return null;
  return (
    <section className="mb-10">
      <h2 className={`text-2xl font-bold text-gray-800 pb-2 mb-4 border-b-2 border-${color}-500`}>
        {title} <span className="text-base font-medium text-gray-500">({enrollments.length})</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {enrollments.map(({ _id, courseId, status }) => {
          if (status === 'Pågående') {
            return <OngoingCourseCard key={_id} course={courseId} />;
          }
          return <OtherCourseCard key={_id} course={courseId} status={status} />;
        })}
      </div>
    </section>
  );
};

// Lista med citat
const quotes = [
    { text: "En investering i kunskap betalar alltid den bästa räntan.", author: "Benjamin Franklin" },
    { text: "Det är en magisk värld, Hobbes, gamle vän... Låt oss gå på upptäcktsfärd!", author: "Kalle (Kalle och Hobbe)" },
    { text: "Du är modigare än du tror, starkare än du ser ut och smartare än du tänker.", author: "Nalle Puh" },
    { text: "Det viktiga är att inte sluta ifrågasätta. Nyfikenheten har sin egen anledning att existera.", author: "Albert Einstein" },
    { text: "Lär dig från igår, lev för idag, se mot morgondagen. Vila i eftermiddag.", author: "Snobben" }
];

function MyCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  const randomQuote = useMemo(() => quotes[Math.floor(Math.random() * quotes.length)], []);

  useEffect(() => {
    api.get('/enrollments/my-courses')
      .then(response => setEnrollments(response.data))
      .catch(err => console.error("Fel vid hämtning av mina kurser:", err))
      .finally(() => setLoading(false));
  }, []);

  const validEnrollments = useMemo(() => enrollments.filter(e => e && e.courseId && e.courseId._id), [enrollments]);

  const groupedCourses = useMemo(() => {
    const groups = { 'Pågående': [], 'Planerar att gå': [], 'Intresserad': [], 'Avslutad': [] };
    validEnrollments.forEach(e => {
      const status = e.status ? e.status.trim() : '';
      if (groups[status]) groups[status].push(e);
    });
    return groups;
  }, [validEnrollments]);

  if (loading) return <div className="text-center p-10">Laddar...</div>;

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="relative mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Min resa</h1>
          <p className="text-gray-500 mt-1">Din personliga översikt av kurser och utmaningar.</p>
        </div>
        <div className="absolute top-0 right-0 hidden md:block max-w-xs text-right">
            <p className="text-gray-600 italic">"{randomQuote.text}"</p>
            <p className="text-gray-500 text-sm mt-1">- {randomQuote.author}</p>
        </div>
      </header>

      {validEnrollments.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow-md">
          <p className="text-gray-500 text-lg">Du har inte påbörjat din lärresa ännu.</p>
          <Link to="/" className="mt-4 inline-block bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">Utforska alla kurser</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            <CourseSection title="Pågående" enrollments={groupedCourses['Pågående']} color="blue" />
            <CourseSection title="Planerade" enrollments={groupedCourses['Planerar att gå']} color="purple" />
            <CourseSection title="Intresserad av" enrollments={groupedCourses['Intresserad']} color="teal" />
          </div>
          <aside className="lg:col-span-1">
            {/* ✅ Koden för "sticky" är nu borttagen */}
            <div>
              <CompletedCoursesSidebar enrollments={groupedCourses['Avslutad']} />
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}

export default MyCourses;
