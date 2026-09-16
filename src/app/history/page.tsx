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

    return (
        <div className="page-container">
            <h1 className="page-loading">History</h1>
            <p className="page-subtitle">Your analyzed job applications</p>

            {loading && <p>Loading...</p>}
            {!loading && applications.length === 0 && (
                <p>No applications found</p>
            )}

            {applications.map((app) => (
                <div key={app.id} className="history-item">
                    <h2 className="history-title">{app.jobTitle}</h2>
                    <p className="history-company">{app.companyName}</p>
                    <p className="history-date">{new Date(app.createdAt).toLocaleDateString()}</p>
                </div>
            ))}
        </div>
    )

}