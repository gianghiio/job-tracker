"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function Resume() {
    // holds the selected file or undefined if nothing's chosen
    const [file, setFile] = useState<File | undefined>(undefined);
    const resumeInput = useRef<HTMLInputElement>(null);
    const [error, setError] = useState("");

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            // Save just te first selected file into state 
            setFile(e.target.files[0]);
        }
    }

    const handleUpload = async() =>  {
        if (!file) {
            setError("Please select a PDF file first");
            return;
        }

        const formData = new FormData(); 
        formData.append("resume", file); 
        const response = await fetch("/api/resume",{
            method: "POST",
            body: formData,
        })
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
            <h1 className="page-heading">Resume</h1>
            <p className="page-subtitle">Upload your resume as the PDF file</p>
            <input type="file" accept=".pdf" ref={resumeInput} onChange={onChange} style={{display: "none"}}/>
            <button className='upload-btn' onClick={() => resumeInput.current?.click()}>Choose File</button>
            <button className='upload-btn' onClick={handleUpload}>Upload Resume</button>
            {error && <p className="error-text">{error}</p>}
            {/* Test result */}
            {file && <p>Selected file: {file.name}</p> }
        </div>
    )
}