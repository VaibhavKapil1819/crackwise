import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login";
import Dashboard from "./pages/Dashboard";
import QuestionPage from "./pages/QuestionPage"; // ✅ New Page for coding editor
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<LoginPage />} />

        {/* Dashboard Page (Displays all questions) */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Question Page (Displays a single question + editor) */}
        <Route path="/question/:id" element={<QuestionPage />} />
      </Routes>
    </Router>
  );
}

export default App;
