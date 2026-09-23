"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState ("");
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleAnalyze = async () => {

    if (!companyName || !jobTitle) {
      setErrorMessage("Please fill in Company Name and Job Title");
      return;
    }
    setErrorMessage("");
    setLoading(true);
    try{
      // send the job description to back-end 
      const response = await fetch("/api/tailor", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({companyName, jobTitle,jobDescription}),
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
      <div className="header">
        <div className="brand-name">
          <h1>Resume Tailor</h1>
        </div>
        <div className="nav-tag">
            <Link href="/resume" className="resume-link">Your Resume</Link>
            <Link href="/tailor" className="job-link">Job Description</Link>
            <Link href="/history" className="history-link">View history</Link>
        </div>  
        <div className="auth">
          <button className="log-in">Log In</button>
          <button className="sign-up">Sign Up</button>
        </div>
      </div>
      <div className="hero-section">
        <div className="hero-left">
          <h1 className="landing-headline">Tailor your resume <span className="accent-text">for every job</span></h1>
          <p className="landing-subtitle">Paste any job description and get AI-matched suggestions from your own resume so you always know what to highlight</p>
          <button className="cta-button">Get Started</button>
        </div>
        <div className="hero-right">
          <p>Example</p>
        </div>
      </div>
    </div>
  );
}