// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login';  // Importing LoginPage component
import Dashboard from './pages/Dashboard';
import './App.css';  // Import your custom styles

function App() {
  return (
    <Router>
      <Routes>
        {/* Define the route for Login Page */}
        <Route path="/" element={<LoginPage />} />
        
        {/* Define the route for Dashboard Page */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
