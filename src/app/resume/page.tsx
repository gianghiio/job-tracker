"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function Resume() {
    // holds the selected file or undefined if nothing's chosen
    const [file, setFile] = useState<File | undefined>(undefined);
    const resumeInput = useRef<HTMLInputElement>(null);
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            // Save just te first selected file into state 
            setFile(e.target.files[0]);
        }
    }
    return (
        <div className="page-container">
            <div className="nav-tag">
                <Link href="/resume" className="resume-link">Your Resume</Link>
                <Link href="/" className="job-link">Job Description</Link>
                <Link href="/history" className="history-link">View history</Link>
            </div>   
            <h1 className="page-heading">Resume Tailor</h1>
            <p className="page-subtitle">Upload your resume as the PDF file</p>
            <input type="file" accept=".pdf" ref={resumeInput} onChange={onChange} style={{display: "none"}}/>
            <button className='upload-btn' onClick={() => resumeInput.current?.click()}>Choose File</button>
            {/* Test result */}
            {file && <p>Selected file: {file.name}</p> }
        </div>
    )
}