"use client";

import { useState } from "react";

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState ("");
  const handleAnalyze = async () => {

    setLoading(true);
    try{
      // send the job description to back-end 
      const response = await fetch("/api/tailor", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({jobDescription}),
      })

    // parse the response body from JSON text
      const data = await response.json();
      setResult(data.result);
    } catch(error) {
      // log for debugging
      console.error("Error analyzing: ", error);
      setResult("ERROR. Please try again")

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-container">
      <h1 className="page-heading">Resume Tailor</h1>
      <p className="page-subtitle">Paste the Job Description to see what to emphasize</p>

      <textarea
        className="job-textarea"
        placeholder=""
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        rows={10}
      />
      <button className="analyze-button" onClick={handleAnalyze} disabled={!jobDescription.trim() || loading}> {loading ? "Analyzing" : "Analyze"}</button>
      {result && (
          <div className="results-box">
            <h2 className="results-heading">Key Requirements</h2>
            <pre className="results-text">{result}</pre>
          </div>
      )}
    </div>
  );
}