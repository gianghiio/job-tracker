"use client";

import { useState } from "react";

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const handleAnalyze = () => {
    console.log("Analyzing:", jobDescription);
  }
  const [result, setResult] = useState("");

  return (
    <div className="page-container">
      <h1 className="page-heading">Resume Tailor</h1>
      <p className="page-subtitle">Paste the Job Description to see what to emphasize</p>

      <textarea
        className="job-textarea"
        placeholder="Senior Frontend Engineer — React, TypeScript, GraphQL. 5+ years experience..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        rows={10}
      />
      <button className="analyze-button" onClick={handleAnalyze} disabled={!jobDescription.trim()}>Analyze</button>
      {result && (
          <div className="results-box">
            <h2 className="results-heading">Key Requirements</h2>
            <pre className="results-text">{result}</pre>
          </div>
      )}
    </div>
  );
}