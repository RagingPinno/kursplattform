import React from 'react';
import { Link } from 'react-router-dom';

function PrivacyPolicy() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Personuppgiftspolicy</h1>
        
        <section className="space-y-4 text-gray-700">
          <p>Denna policy beskriver hur [Ditt Företagsnamn/Plattformsnamn] ("vi", "oss") samlar in, använder och skyddar den information du ger oss när du använder denna webbplats.</p>
          
          <h2 className="text-2xl font-bold pt-4">Vilken information samlar vi in?</h2>
          <p>När du skapar ett konto och använder våra tjänster kan vi samla in följande information:</p>
          <ul className="list-disc list-inside pl-4">
            <li><strong>Användarinformation:</strong> När du loggar in med Google sparas en unik användaridentifierare (user ID) från Firebase Authentication för att koppla dig till dina handlingar på plattformen. Vi sparar inte ditt lösenord.</li>
            <li><strong>Användningsdata:</strong> Vi sparar information om vilka kurser du interagerar med, vilken status du sätter på dem, och vilka kurser du gillar. Detta görs för att kunna erbjuda dig en personlig "Min resa"-sida.</li>
          </ul>

          <h2 className="text-2xl font-bold pt-4">Hur använder vi informationen?</h2>
          <p>Vi använder informationen för att:</p>
          <ul className="list-disc list-inside pl-4">
            <li>Tillhandahålla och personifiera våra tjänster.</li>
            <li>Möjliggöra funktioner som "Min resa" och "Gilla"-markeringar.</li>
            <li>Förbättra vår webbplats och våra tjänster.</li>
          </ul>

          <h2 className="text-2xl font-bold pt-4">Cookies</h2>
          <p>Vår webbplats använder cookies för att förbättra din användarupplevelse. En cookie är en liten textfil som sparas på din dator. Vi använder cookies för att hantera din inloggningssession via Firebase och för att komma ihåg ditt godkännande av denna policy.</p>

          <h2 className="text-2xl font-bold pt-4">Säkerhet</h2>
          <p>Vi är fast beslutna att säkerställa att din information är säker. Vi använder oss av Firebase Authentication och Firestore, tjänster från Google, som har robusta säkerhetsåtgärder för att skydda din data.</p>

          <h2 className="text-2xl font-bold pt-4">Dina rättigheter</h2>
          <p>Du har rätt att begära information om de personuppgifter vi har om dig. Du kan också begära att vi raderar ditt konto och all tillhörande data. Kontakta oss för mer information.</p>
        </section>

        <div className="mt-8 pt-6 border-t">
            <Link to="/" className="text-indigo-600 hover:underline">
                &larr; Tillbaka till startsidan
            </Link>
        </div>
      </div>
    </main>
  );
}

export default PrivacyPolicy;
