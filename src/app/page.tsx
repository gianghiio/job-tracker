"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";

export default function Home() {
  const [active, setActive] = useState<number | null>(null);
  type FaqItem = { id: number; question: string; answer: string };
  const faq: FaqItem[] = [
    {id: 1, question: "Is my resume data safe?", answer: "Yes. Your resume is stored securely and only used to generate your own suggestions"},
    {id: 2, question:"Is this free to use?", answer:"Yes, completely free"},
    {id: 3, question:"Do I need to re-upload my resume every time?", answer: "No. upload once, and it's reused for every job you analyze."}
  ]
  const toggleQuestion = (id: number) => {
    if (active === id) {
      // If the question is already opened
      setActive(null);
    } else {
      setActive(id);
    }
  }
  return (
    <div className="page-container">
      <Header></Header>
      <div className="hero-section">
        <div className="hero-left">
          <h1 className="landing-headline">Tailor your resume <span className="accent-text">for every job</span></h1>
          <p className="landing-subtitle">Paste any job description and get AI-matched suggestions from your own resume so you always know what to highlight</p>
          <Link href="/resume" className="cta-button">Get Started</Link>
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
      <div className="story-cta-section">
        <div className="story-content">
          <p className="story-label">The Story</p>
          <h2 className="story-heading">Built out of a real problem</h2>
          <p className="story-text">
            Job hunting means rewriting the same resume dozens of times. I built Resume Tailor to solve that for myself: pasting a job description and instantly seeing what to emphasize, instead of doing it by hand every time.
          </p>
        </div>
        <div className="cta-card">
          <h3 className="cta-card-heading">Ready to tailor your next application?</h3>
          <Link href="/tailor" className="cta-button">Get Started</Link>
        </div>
      </div>
      <div className="faq-section">
          <p className="faq-label">FAQ</p>
          <h2 className="faq-headline">Frequently asked questions</h2>
          {faq.map((item) => (
              <div key={item.id} className="faq-item">
                  <button className="faq-question" onClick={() => toggleQuestion(item.id)}>
                      {item.question}
                      <span className="faq-icon">{active === item.id ? "−" : "+"}</span>
                  </button>
                  {/* only show the answer for the open question */}
                  {active === item.id && <p className="faq-answer">{item.answer}</p>}
              </div>
          ))}
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