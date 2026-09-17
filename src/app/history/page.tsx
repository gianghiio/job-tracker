"use client";

import { useEffect, useState } from "react";

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
        e.stopPropagation;
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

    return (
        <div className="page-container">
            <h1 className="page-loading">History</h1>
            <p className="page-subtitle">Your analyzed job applications</p>

            {loading && <p>Loading...</p>}
            {!loading && applications.length === 0 && (
                <p>No applications found</p>
            )}

            {applications.map((app) => (
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