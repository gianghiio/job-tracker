"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Application = {
    id: number;
    companyName: string;
    createdAt: string;
    jobTitle: string;
    jobDescription: string;
}

export default function History() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    // run once right when the page loads
    useEffect(() => {
        const fetchApplications = async() => {
            try{
                const response = await fetch("/api/applications");
                const data = await response.json();
                setApplications(data.applications);
            } catch(error) {
                console.error("Failed to load history", error);
            } finally {
                setLoading(false);
            }
        }
        fetchApplications();
    },[]);

    // Delete specific application
    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        // Confirm deletion
        const isConfirmed = confirm("Are you sure you want to delete this?");
        if (!isConfirmed) {
            return;
        }
        try {
            await fetch("/api/applications",{
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({id}),
            });

            //remove it from local state so the UI updates immediately
            setApplications((prev) => prev.filter((app) => app.id !== id));
        } catch (error) {
            console.error("Error deleting application", error);
        }
    }

    // Search for specific job application
    const filteredApplication = applications.filter((app) => {
        try {
            const term = searchTerm.toLowerCase();
            return (
                app.companyName.toLowerCase().includes(term) ||
                app.jobTitle.toLowerCase().includes(term)
            )
        } catch (error){
            console.error("Error searching for application", error)
        }
    }) 

    return (
        <div className="page-container">
            <div className="nav-tag">
                <Link href="/resume" className="resume-link">Your Resume</Link>
                <Link href="/" className="job-link">Job Description</Link>
                <Link href="/history" className="history-link">View history</Link>
            </div>
            <h1 className="page-loading">History</h1>
            <p className="page-subtitle">Your analyzed job applications</p>

            <div className="search-function">
                <input className="search-area" placeholder="Search for Company Name or Job Title" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}></input>
            </div>
            {loading && <p>Loading...</p>}
            {!loading && applications.length === 0 && (
                <p>No applications found</p>
            )}
            {!loading && (
                <p className="results-count">
                    Showing {filteredApplication.length} of {applications.length}
                </p>
            )}

            {filteredApplication.map((app) => (
                <div key={app.id} className="history-item" onClick={() => setSelectedApp(app)}>
                    <div className="history-item-header">
                        <h2 className="history-title">{app.jobTitle}</h2>
                        <button className="delete-button" onClick={(e) => handleDelete(app.id, e)}>Delete</button>
                    </div>
                    <p className="history-company">{app.companyName}</p>
                    <p className="history-date">{new Date(app.createdAt).toLocaleDateString()}</p>
                </div>
            ))}

            {selectedApp && (
                <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedApp(null)}>×</button>
                        <h2 className="history-title">{selectedApp.jobTitle}</h2>
                        <p className="history-company">{selectedApp.companyName}</p>
                        <h3 className="history-subheading">Job Description</h3>
                        <p className="history-job-description">{selectedApp.jobDescription}</p>
                    </div>
                </div>
            )}
        </div>
    )

}