import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { auth } from '../firebase';

// --- Komponenter och funktioner ---

const formatDate = (dateString) => {
  if (!dateString) return null;
  try {
    return new Intl.DateTimeFormat('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(dateString));
  } catch (error) {
    console.error("Invalid date:", dateString);
    return null;
  }
};

const EditorsPick = ({ tag, comment }) => (
  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 my-8 text-white shadow-lg">
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <svg className="h-8 w-8 text-yellow-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </div>
      <div className="ml-4">
        <p className="text-lg font-bold">{tag}</p>
        <p className="mt-1 opacity-90">{comment}</p>
      </div>
    </div>
  </div>
);

const DifficultyRating = ({ level = 1 }) => (
    <div className="flex items-center">
      <div className="flex items-center gap-1">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className={`w-4 h-4 rounded-full ${index < level ? 'bg-indigo-500' : 'bg-gray-300'}`}></div>
        ))}
      </div>
    </div>
);

const DetailItem = ({ icon, label, value }) => (
    <div className="flex items-center">
        <div className="flex-shrink-0 w-6 h-6 mr-3 text-indigo-500">{icon}</div>
        <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">{label}:</span>
            <span>{value}</span>
        </div>
    </div>
);

// Komponent för att visa utmaningens guide
const ChallengeGuide = ({ steps }) => (
  <section>
    <h2 className="text-3xl font-bold text-gray-800 border-b-2 border-amber-400 pb-3 mb-6">Din utmaning</h2>
    <div className="space-y-8">
      {steps.map((step, index) => (
        <div key={index} className="flex items-start">
          <div className="flex-shrink-0 flex flex-col items-center mr-4">
            <div className="bg-indigo-500 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold">{index + 1}</div>
            {index < steps.length - 1 && <div className="w-px h-full bg-gray-300 mt-2"></div>}
          </div>
          <div className="flex-grow pb-8">
            {step.type === 'text' && <p className="text-lg text-gray-700 leading-relaxed">{step.content}</p>}
            {step.type === 'image' && <img src={step.content} alt={`Steg ${index + 1}`} className="w-full rounded-lg shadow-md mt-2" />}
            {step.type === 'code' && (
              <div className="bg-gray-800 text-white p-4 rounded-lg mt-2 font-mono text-sm whitespace-pre-wrap">
                <code>{step.content}</code>
              </div>
            )}
          </div>
        </div>
      ))}
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-4">
          <div className="bg-green-500 text-white rounded-full h-8 w-8 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Mål</h3>
          <p className="text-lg text-gray-700">När du har slutfört stegen ovan har du klarat utmaningen. Bra jobbat!</p>
        </div>
      </div>
    </div>
  </section>
);


// --- Huvudkomponent ---

function CourseDetail({ user, onCourseUpdate }) { // ✅ Tar emot 'user' som prop
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    // Hämta alltid den offentliga kursdatan
    api.get(`/courses/${courseId}`)
      .then(response => {
        const courseData = response.data;
        setCourse(courseData);
        setLikeCount(courseData.likes?.length || 0);
        
        // ✅ Hämta bara personlig data OM användaren är inloggad
        if (user) {
          if (courseData.likes?.includes(user.uid)) {
            setIsLiked(true);
          }
          // Hämta status
          api.get(`/enrollments/${courseId}`)
            .then(enrollmentResponse => setEnrollment(enrollmentResponse.data))
            .catch(err => console.error("Fel vid hämtning av status:", err));
        }
      })
      .catch(err => {
        setError('Kunde inte ladda kursen.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [courseId, user]); // Kör om effekten om användarstatusen ändras

  const handleLike = async () => {
    if (!user) {
      alert("Du måste logga in för att kunna gilla en kurs.");
      return;
    }
    setIsLiked(current => !current);
    setLikeCount(current => isLiked ? current - 1 : current + 1);

    try {
      const response = await api.post(`/courses/${courseId}/toggle-like`);
      const updatedCourse = response.data;
      setLikeCount(updatedCourse.likes.length);
      onCourseUpdate(updatedCourse);
    } catch (err) {
      console.error("Kunde inte uppdatera like-status:", err);
      setIsLiked(current => !current);
      setLikeCount(current => isLiked ? current - 1 : current + 1);
      alert("Kunde inte spara din bedömning.");
    }
  };
  
  const handleStatusChange = async (newStatus) => {
    if (!user) {
        alert("Du måste logga in för att kunna sätta en status.");
        return;
    }
    if (!newStatus) return;
    try {
      const response = await api.post('/enrollments', { courseId, status: newStatus });
      setEnrollment(response.data);
    } catch (err) {
      console.error("Kunde inte uppdatera status:", err);
      alert("Kunde inte spara din status. Försök igen.");
    }
  };

  if (loading) return <div className="text-center p-10">Laddar kursinformation...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
  if (!course) return <div className="text-center p-10">Kursen kunde inte hittas.</div>;

  const lastUpdatedDate = formatDate(course.lastUpdated);
  const statusOptions = ['Intresserad', 'Planerar att gå', 'Pågående', 'Avslutad'];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        <div className="mb-8">
          <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Tillbaka till alla kurser
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {course.imageUrl && (
            <div className="w-full h-56 md:h-80 bg-gray-200">
              <img 
                src={course.imageUrl} 
                alt={`Bild för kursen ${course.title}`}
                className="w-full h-full object-cover" 
              />
            </div>
          )}

          <div className="p-8 md:p-12">
            <header className="mb-8">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="text-base font-semibold text-indigo-600 mb-1">{course.category}</p>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">{course.title}</h1>
                  {course.provider && <p className="text-xl text-gray-500 mt-2">av {course.provider}</p>}
                </div>
                <div className="flex-shrink-0">
                  <button 
                    onClick={handleLike}
                    title="Gilla kursen"
                    className={`flex items-center gap-2 py-2 px-4 rounded-full transition-colors border-2 ${
                      isLiked 
                        ? 'bg-red-50 border-red-500 text-red-500' 
                        : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                    <span className="font-semibold text-base">{likeCount}</span>
                  </button>
                </div>
              </div>
            </header>

            {course.editorsPick?.tag && (
              <EditorsPick tag={course.editorsPick.tag} comment={course.editorsPick.comment} />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              <div className="lg:col-span-2">
                {course.courseType === 'Utmaning' && course.challengeSteps?.length > 0 ? (
                  <ChallengeGuide steps={course.challengeSteps} />
                ) : (
                  <>
                    <section>
                      <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">Kursbeskrivning</h2>
                      <p className="text-lg text-gray-700 leading-relaxed">{course.description}</p>
                    </section>
                    {course.targetAudience && course.targetAudience.length > 0 && (
                      <section className="mt-10">
                        <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">För dig som vill...</h2>
                        <ul className="space-y-3">
                          {course.targetAudience.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <svg className="w-6 h-6 mr-3 text-green-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                              <span className="text-lg text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}
                    <section className="mt-10">
                      <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">Förkunskaper</h2>
                      <p className="text-lg text-gray-700">{course.prerequisites}</p>
                    </section>
                  </>
                )}
              </div>

              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6 sticky top-28">
                  {course.courseType !== 'Utmaning' && course.link && (
                    <a 
                      href={course.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-full inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-lg mb-6"
                    >
                      Gå till kurs
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </a>
                  )}
                  
                  {/* ✅ Visa bara de interaktiva delarna om användaren är inloggad */}
                  {user ? (
                    <>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">Min kurs</h3>
                      <select
                        value={enrollment?.status || ''}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Välj status...</option>
                        {statusOptions.map(option => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </>
                  ) : (
                    <div className="text-center p-4 border-2 border-dashed rounded-lg">
                        <p className="text-gray-600">Logga in för att spara din status och gilla kursen!</p>
                        <Link to="/login" className="mt-3 inline-block bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                            Logga in
                        </Link>
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">Kursdetaljer</h3>
                  <div className="space-y-4 text-gray-700">
                    <DetailItem icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>} label="Nivå" value={<DifficultyRating level={course.difficulty} />} />
                    <DetailItem icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>} label="Format" value={course.format} />
                    <DetailItem icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>} label="Längd" value={course.duration} />
                    <DetailItem icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10-5-10M19.754 9H14.25l1.292-3.228a.5.5 0 00-.918-.41z"></path></svg>} label="Språk" value={course.language} />
                    <DetailItem icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>} label="Pris" value={course.price?.amount === 0 ? 'Gratis' : `${course.price?.amount} ${course.price?.currency}`} />
                    <DetailItem icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z"></path></svg>} label="Certifikat" value={course.certificate ? 'Ja' : 'Nej'} />
                    {lastUpdatedDate && <div className="pt-2 mt-2 border-t border-gray-200"><span className="font-semibold text-gray-900">Uppdaterad:</span> {lastUpdatedDate}</div>}
                  </div>
                </div>
              </div>
            </div>

            <footer className="mt-12 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {course.tags?.map(tag => (
                    <span key={tag} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;
