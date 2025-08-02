import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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

// Komponent för att visa rekommenderade kurser
const RecommendedCourses = ({ quizId }) => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (quizId) {
      api.get(`/quizzes/${quizId}/recommendations`)
        .then(response => setRecommendations(response.data))
        .catch(err => console.error("Fel vid hämtning av rekommendationer:", err));
    }
  }, [quizId]);

  if (recommendations.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Rekommenderade kurser för dig</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map(course => (
          <Link to={`/course/${course._id}`} key={course._id} className={`block p-1 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br ${getDifficultyBorder(course.difficulty)}`}>
            <div className="bg-white rounded-md p-4 h-full">
              <p className="font-bold text-indigo-700">{course.title}</p>
              <p className="text-sm text-gray-500">av {course.provider}</p>
              <p className="text-sm text-gray-600 mt-2">{course.shortDescription}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Komponent för att visa resultatet
const QuizResults = ({ quiz, userAnswers }) => {
  const score = userAnswers.reduce((acc, answer, index) => {
    return answer === quiz.questions[index].correctAnswerIndex ? acc + 1 : acc;
  }, 0);

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-2">Resultat</h2>
      <p className="text-center text-xl text-gray-700 mb-8">Du fick {score} av {quiz.questions.length} rätt!</p>
      
      <div className="space-y-8">
        {quiz.questions.map((q, index) => {
          const userAnswer = userAnswers[index];
          const isCorrect = userAnswer === q.correctAnswerIndex;
          return (
            <div key={index} className={`p-4 rounded-lg border-2 ${isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
              <p className="font-bold text-gray-800">{index + 1}. {q.questionText}</p>
              <div className="mt-2 space-y-1 text-sm">
                {q.options.map((option, i) => {
                  let styles = "text-gray-700";
                  if (i === q.correctAnswerIndex) styles = "font-bold text-green-700";
                  if (i === userAnswer && !isCorrect) styles = "font-bold text-red-700 line-through";
                  return <p key={i} className={styles}>{option}</p>;
                })}
              </div>
              <div className="mt-4 pt-3 border-t">
                <p className="text-sm text-gray-600"><span className="font-semibold">Förklaring:</span> {q.explanation}</p>
                {q.relatedCourses && q.relatedCourses.length > 0 && (
                  <div className="mt-2 text-sm">
                    <span className="font-semibold text-gray-600">Lär dig mer: </span>
                    {q.relatedCourses.map((course, idx) => (
                      <React.Fragment key={course._id}>
                        <Link to={`/course/${course._id}`} className="text-indigo-600 hover:underline">
                          {course.title}
                        </Link>
                        {idx < q.relatedCourses.length - 1 && ', '}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <RecommendedCourses quizId={quiz._id} />
    </div>
  );
};

// Huvudkomponent för att ta ett quiz
function Quiz() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    api.get(`/quizzes/${quizId}`)
      .then(response => setQuiz(response.data))
      .catch(err => console.error("Fel vid hämtning av quiz:", err))
      .finally(() => setLoading(false));
  }, [quizId]);

  const handleNextQuestion = () => {
    setUserAnswers([...userAnswers, selectedOption]);
    setSelectedOption(null);
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsFinished(true);
    }
  };
  
  if (loading) return <div className="text-center p-10">Laddar quiz...</div>;
  if (!quiz) return <div className="text-center p-10">Kunde inte hitta quizet.</div>;
  if (isFinished) return <main className="container mx-auto px-4 py-8 max-w-4xl"><QuizResults quiz={quiz} userAnswers={userAnswers} /></main>;

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <p className="text-sm text-gray-500">Fråga {currentQuestionIndex + 1} av {quiz.questions.length}</p>
        <h2 className="text-2xl font-bold mt-1 mb-6">{currentQuestion.questionText}</h2>
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => setSelectedOption(index)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${selectedOption === index ? 'bg-indigo-100 border-indigo-500' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
            >
              {option}
            </button>
          ))}
        </div>
        <button
          onClick={handleNextQuestion}
          disabled={selectedOption === null}
          className="mt-8 w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 transition-colors"
        >
          {currentQuestionIndex < quiz.questions.length - 1 ? 'Nästa fråga' : 'Visa resultat'}
        </button>
      </div>
    </main>
  );
}

export default Quiz;
