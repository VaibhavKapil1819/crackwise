import React, { useState } from "react";

// Basic English dictionary for spell-check (expand as needed)
const dictionary = new Set([
  "the", "is", "are", "and", "you", "we", "they", "for", "from", "this", "that",
  "hello", "world", "text", "writing", "score", "test", "evaluate", "essay",
  "language", "study", "school", "computer", "science", "learning"
]);

const evaluateEssay = (text) => {
  if (!text.trim()) {
    return { wordCount: 0, sentenceCount: 0, spellingErrors: 0, lexicalDiversity: 0, score: 0 };
  }

  const words = text.split(/\s+/).filter(word => word);
  const wordCount = words.length;
  const sentenceCount = text.split(/[.!?]+/).filter(sentence => sentence.trim().split(" ").length > 3).length;
  const uniqueWords = new Set(words).size;
  const lexicalDiversity = wordCount > 0 ? (uniqueWords / wordCount).toFixed(2) : 0;

  // Spelling Check: Words not found in dictionary
  const misspelledWords = words.filter(word => !dictionary.has(word.toLowerCase()));

  let score = 0;

  // Word Count (20 points)
  if (wordCount >= 150) score += 20;
  else if (wordCount >= 100) score += 15;
  else if (wordCount >= 50) score += 10;
  else score += 5;

  // Sentence Count (20 points)
  if (sentenceCount >= 8) score += 20;
  else if (sentenceCount >= 5) score += 15;
  else if (sentenceCount >= 3) score += 10;
  else score += 5;

  // Grammar & Spelling (30 points)
  if (misspelledWords.length === 0) score += 30;
  else if (misspelledWords.length <= 3) score += 20;
  else if (misspelledWords.length <= 6) score += 10;
  else score += 5;

  // Lexical Diversity (30 points)
  if (lexicalDiversity >= 0.6) score += 30;
  else if (lexicalDiversity >= 0.5) score += 20;
  else if (lexicalDiversity >= 0.4) score += 10;
  else score += 5;

  return { wordCount, sentenceCount, misspelledWords, lexicalDiversity, score };
};

export default function EssayScorer() {
  const [essay, setEssay] = useState("");
  const [result, setResult] = useState(null);

  const handleEvaluate = () => {
    setResult(evaluateEssay(essay));
  };

  return (
    <div className="p-4 max-w-xl mx-auto bg-gray-100 min-h-screen flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4 text-center">Essay Scoring System</h2>

      <textarea
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={6}
        placeholder="Write your essay here..."
        value={essay}
        onChange={(e) => setEssay(e.target.value)}
      />

      <button
        className="mt-3 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
        onClick={handleEvaluate}
      >
        Evaluate Essay
      </button>

      {result && (
        <div className="mt-4 p-4 w-full bg-white shadow-lg rounded-lg border border-gray-200">
          <p><strong>Word Count:</strong> {result.wordCount}</p>
          <p><strong>Sentence Count:</strong> {result.sentenceCount}</p>
          <p><strong>Spelling Errors:</strong> {result.misspelledWords.length}</p>
          <p><strong>Lexical Diversity:</strong> {result.lexicalDiversity}</p>
          <p className="text-xl font-bold mt-2"><strong>Final Score:</strong> {result.score} / 100</p>
        </div>
      )}
    </div>
  );
}
