import React from 'react';
import { Link } from 'react-router-dom';

function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Om Kursplattformen</h1>
        
        <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
          <p>
            Välkommen! Denna plattform är ett litet hobbyprojekt, skapat med en stor passion för lärande och en ännu större nyfikenhet på artificiell intelligens.
          </p>
          <p>
            Målet är enkelt: att samla och presentera intressanta kurser, utmaningar och kunskapstester för att stimulera till ökade kunskaper och en djupare förståelse för AI och digitalisering. I en värld som förändras snabbt är livslångt lärande inte bara en möjlighet, utan en nödvändighet.
          </p>
          
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg my-6">
            <h2 className="text-xl font-semibold text-indigo-800">Byggd med AI</h2>
            <p className="mt-1 text-indigo-700">
              En rolig detalj är att hela denna tjänst – från backend-logik i Node.js till frontend-komponenter i React – har byggts med hjälp av en AI-assistent som en aktiv samarbetspartner i kodningen. Det är ett levande exempel på hur AI kan användas som ett kraftfullt verktyg för att förverkliga idéer.
            </p>
          </div>
          
          <p>
            Vi hoppas att du hittar något som väcker din nyfikenhet och inspirerar dig på din egen lärresa.
          </p>
        </div>

        <div className="mt-8 pt-6 border-t">
            <Link to="/" className="text-indigo-600 hover:underline font-semibold">
                &larr; Tillbaka till startsidan
            </Link>
        </div>
      </div>
    </main>
  );
}

export default AboutPage;
