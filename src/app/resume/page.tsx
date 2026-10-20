"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Resume() {
    // holds the selected file or undefined if nothing's chosen
    const [file, setFile] = useState<File | undefined>(undefined);
    const resumeInput = useRef<HTMLInputElement>(null);
    const [error, setError] = useState("");
    const [dragging, setDragging] = useState(false);

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

    const pickFile = (f:File | undefined) => {
        if (!f) {
            return;
        }
        if (f.type !== "application/pdf") {
            setError("Only PDF files are supported");
            return;
        }
        setError("");
        setFile(f);
    }
    return (
    <div className="page-container">
        <Header></Header>
        <div className="resume-wrap">
            <h1 className="page-heading">Your resume</h1>
            <p className="page-subtitle">Upload once. It's matched against every job you analyze.</p>

            <div className="resume-status">
                <div>
                    <p className="resume-status-title">Resume on file</p>
                    <p className="resume-status-meta">Uploaded your resume</p>
                </div>
                <button className="delete-button">Delete</button>
            </div>

            <div className="drop-zone">
                <p className="drop-zone-title">Drag a PDF here, or choose a file</p>
                <p className="drop-zone-hint">PDF only</p>
            </div>

            <div className="resume-preview">
                <p className="resume-preview-label">What we read from your resume</p>
            </div>

            <div className="resume-footer-row">
                <p className="resume-footer-note">Resume updated - Ready to match</p>
                <Link href="/tailor" className="cta-button">Analyze a job </Link>
            </div>
        </div>
        <Footer></Footer>
    </div>
    )
}