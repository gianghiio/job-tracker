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
          <img src="/demo.png" alt="Example of job description " className="preview-image" />
        </div>
      </div>
      <div className="features-section">
        <p className="features-label">Features</p>
        <h2 className="features-headline">Everything you need to apply with confidence</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3 className="feature-card-title">Smart Resume Matching</h3>
            <p className="feature-card-description">See exactly which parts of your resume to emphasize for each specific job, powered by AI</p>
          </div>
          <div className="feature-card">
            <h3 className="feature-card-title">Track every application</h3>
            <p className="feature-card-description">Every job you analyze is saved automatically, so you can revisit and compare your applications anytime</p>
          </div>
          <div className="feature-card">
            <h3 className="feature-card-title">One Upload, Every Job</h3>
            <p className="feature-card-description">Upload your resume once. Reuse it instantly for every job you apply to, no re-uploading needed</p>
          </div>
        </div>
      </div>
      <div className="cta-section">
        <h2 className="cta-heading">Ready to tailor your next application</h2>
        <button className="cta-button">Get Started</button>
      </div>
      <div className="site-footer">
        <div className="footer-content">
          <p className="footer-brand">Resume Tailor</p>
          <p className="footer-copyright">© 2026 Resume Tailor</p>
          <div className="footer-links">
            <a href="/resume">Your Resume</a>
            <a href="/tailor">Job Description</a>
            <a href="/history">View History</a>
          </div>
        </div>
      </div>
    </div>
  );
}