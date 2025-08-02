// src/main.jsx
import React from "react"; // ✅ Importera React
import ReactDOM from "react-dom/client"; // ✅ Importera react-dom
import App from "./App"; // ✅ App.jsx innehåller JSX
import './index.css'; // ✅ Importera CSS

const root = ReactDOM.createRoot(document.getElementById("root")); // ✅
root.render(<App></App>); // ✅