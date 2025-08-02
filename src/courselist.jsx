import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

// --- Ikon-komponenter ---
const StatusIcon = ({ status }) => {
  let icon, colorClass, text;

  switch (status) {
    case 'Pågående':
      icon = <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
      colorClass = 'bg-blue-100 text-blue-800';
      text = 'Pågående';
      break;
    case 'Intresserad':
      icon = <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>;
      colorClass = 'bg-teal-100 text-teal-800';
      text = 'Intresserad';
      break;
    case 'Planerar att gå':
      icon = <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>;
      colorClass = 'bg-purple-100 text-purple-800';
      text = 'Planerad';
      break;
    case 'Avslutad':
      icon = <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
      colorClass = 'bg-green-100 text-green-800';
      text = 'Avslutad';
      break;
    default:
      return null;
  }

  return (
    <div title={`Status: ${text}`} className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
      {icon}
      <span>{text}</span>
    </div>
  );
};

const getDifficultyBorder = (difficulty) => {
  switch (difficulty) {
    case 1: return 'from-green-400 to-teal-500';
    case 2: return 'from-sky-400 to-blue-500';
    case 3: return 'from-amber-400 to-orange-500';
    case 4: return 'from-rose-500 to-red-600';
    default: return 'from-gray-200 to-gray-300';
  }
};

const DifficultyRating = ({ level = 1, isChallenge = false }) => {
    const textColor = isChallenge ? 'text-gray-400' : 'text-gray-500';
    return (
        <div className="flex items-center" title={`Svårighetsgrad: ${level} av 4`}>
            <span className={`text-xs ${textColor} mr-2`}>Nivå:</span>
            <div className="flex items-center gap-1">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className={`w-3 h-3 rounded-full ${index < level ? 'bg-indigo-500' : 'bg-gray-300'}`}></div>
                ))}
            </div>
        </div>
    );
};

const TopLeftBadge = ({ course }) => {
  if (course.courseType === 'Utmaning') {
    return (
      <div className="bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full flex items-center">
        <svg className="w-4 h-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
        UTMANING
      </div>
    );
  }
  if (course.editorsPick?.tag) {
    return (
      <div className="inline-flex items-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
        <svg className="w-4 h-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
        {course.editorsPick.tag}
      </div>
    );
  }
  return null;
};

// Komponent för alla kort
const Card = ({ course, userStatus }) => {
  const isChallenge = course.courseType === 'Utmaning';

  return (
    <Link to={`/course/${course._id}`} key={course._id} className={`relative block rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300 ease-in-out p-1 bg-gradient-to-br ${getDifficultyBorder(course.difficulty)}`}>
      <div className={`relative rounded-lg h-full p-6 flex flex-col overflow-hidden ${isChallenge ? 'bg-gradient-to-br from-slate-900 to-indigo-950 text-white' : 'bg-white'}`}>
        
        <div className="flex justify-between items-start mb-4 h-6">
          <div className="z-10">
            <TopLeftBadge course={course} />
          </div>
          <div className="z-10">
            {course.difficulty && <DifficultyRating level={course.difficulty} isChallenge={isChallenge} />}
          </div>
        </div>
        
        <h3 className={`text-2xl font-bold mb-1 z-10 ${isChallenge ? 'text-white' : 'text-gray-900'}`}>{course.title}</h3>
        <p className={`text-sm mb-3 z-10 ${isChallenge ? 'text-gray-400' : 'text-gray-500'}`}>av {course.provider}</p>
        
        <p className={`mb-4 flex-grow z-10 ${isChallenge ? 'text-gray-300' : 'text-gray-600'}`}>{course.shortDescription}</p>
        
        <div className="mb-4 z-10 h-6">
          {userStatus && <StatusIcon status={userStatus} />}
        </div>

        <div className={`flex justify-between items-center mt-auto pt-4 border-t z-10 ${isChallenge ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex flex-wrap gap-2">
            {course.tags && course.tags.map(tag => (
              <span key={tag} className={`px-3 py-1 rounded-full text-xs font-medium ${isChallenge ? 'bg-slate-700 text-slate-200' : 'bg-gray-200 text-gray-800'}`}>
                {tag}
              </span>
            ))}
          </div>
          <div className={`flex items-center text-sm font-semibold ${isChallenge ? 'text-gray-300' : 'text-gray-600'}`}>
            <svg className={`w-5 h-5 mr-1 ${isChallenge ? 'text-red-400' : 'text-red-500'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
            {course.likes?.length || 0}
          </div>
        </div>
      </div>
    </Link>
  );
};

function CourseList({ courses, enrollments }) {
  const enrollmentMap = useMemo(() => {
    if (!enrollments) return new Map();
    return new Map(enrollments.map(e => [e.courseId?._id, e.status]));
  }, [enrollments]);

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-lg shadow-md">
        <p className="text-gray-500 text-lg">Inga kurser hittades med de valda filtren.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map(course => (
        <Card 
          key={course._id} 
          course={course} 
          userStatus={enrollmentMap.get(course._id)} 
        />
      ))}
    </div>
  );
}

export default CourseList;
