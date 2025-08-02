// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()], // ✅ Måste ha `@vitejs/plugin-react`
  server: {
    proxy: {
      "/api": "http://localhost:3000" // ✅ Proxy till backend
    }
  }
});