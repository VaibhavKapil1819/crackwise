import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../Styles/Dashboard.css";

const Dashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/questions/all")
      .then((response) => {
        setQuestions(response.data.questions);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
        setIsLoading(false);
      });
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "#4ade80"; // Green
      case "medium":
        return "#fbbf24"; // Yellow
      case "hard":
        return "#f87171"; // Red
      default:
        return "#60a5fa"; // Blue
    }
  };

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Crackwise Dashboard</h1>
      </header>

      <div className="dashboard-content">
        {isLoading ? (
          <div className="loading-indicator">
            <p>Loading questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="empty-state">
            <p>No questions available at the moment.</p>
          </div>
        ) : (
          <div className="questions-grid">
            {questions.map((question) => (
              <Link
                key={question.id}
                to={`/question/${question.id}`}
                className="question-card"
                style={{
                  borderLeft: `4px solid ${getDifficultyColor(question.difficulty)}`
                }}
              >
                <div className="question-card-header">
                  <h3 className="question-title">{question.title}</h3>
                  <span className={`difficulty-badge ${getDifficultyBadge(question.difficulty)}`}>
                    {question.difficulty.toUpperCase()}
                  </span>
                </div>
                <div className="question-card-body">
                  <p className="question-description">
                    {question.description.substring(0, 100)}...
                  </p>
                </div>
                <div className="question-card-footer">
                  <span className="start-coding">Start Coding →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;