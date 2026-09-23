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
      <h1 className="page-heading">Resume Tailor</h1>
      <p className="page-subtitle">Landing page coming soon</p>
    </div>
  );
}