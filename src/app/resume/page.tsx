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
    // true while the upload request is in flight (disables the button)
    const [uploading, setUploading] = useState(false);
    // message shown after a successful upload resume
    const [success, setSuccess] = useState("");

    const handleUpload = async() =>  {
        if (!file) {
            setError("Please select a PDF file first");
            return;
        }
        setError("");
        setSuccess("");
        setUploading(true);

        try {
            const formData = new FormData(); 
            formData.append("resume", file); 
            const response = await fetch("/api/resume",{
                method: "POST",
                body: formData,
            })
            // sends JSON for both success and errors
            const data = await response.json();
            if (!response.ok) {
                setError(data.error || "Upload failed");
                return;
            }

            // saved resume if successful, so show the message and reset the drop zone
            setSuccess("Resume uploaded - It will be used for your next analysis");
            setFile(undefined);
        } catch (err) {
            setError("Upload failed - Please try again");
        } finally {
            setUploading(false);
        }
    }


    const pickFile = (f: File | undefined) => {
        if (!f) {
            return;
        }
        // check the type of dragged file
        if (f.type !== "application/pdf") {
            setError("Only PDF files are supported");
            return;
        }

        if (f.size > 4 * 1024 * 1024) {
            setError("File is too large - Keep it under 4 MB");
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

            <input type="file" accept=".pdf" ref={resumeInput} style={{ display: "none" }} onChange={(e) => {
                    pickFile(e.target.files?.[0]);
                    e.target.value = "";
                }}
            />

            <div
                className={`drop-zone ${dragging ? "dragging" : ""}`}
                onClick={() => resumeInput.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {e.preventDefault();setDragging(false); pickFile(e.dataTransfer.files[0]);}}
            >
                <p className="drop-zone-title">{file ? file.name : "Drag a PDF here, or choose a file"}</p>
                <p className="drop-zone-hint">PDF only - under 4 MB</p>
            </div>

            {/*error message and the Upload button (only after a file is chosen) */}
            {error && <p className="error-text">{error}</p>}
            {success && <p className="success-text">{success}</p>}
            {file && (
                <div className="resume-actions">
                    {/*disabled while uploading, and the label changes */}
                    <button className="upload-btn" onClick={handleUpload} disabled={uploading}>
                        {uploading ? "Uploading..." : "Upload resume"}
                    </button>
                </div>
            )}
            {success && (
                <div className="resume-footer-row">
                    <p className="resume-footer-note">Ready to match.</p>
                    <Link href="/tailor" className="cta-button">Analyze a job</Link>
                </div>
            )}
        </div>
        <Footer></Footer>
    </div>
    )
}