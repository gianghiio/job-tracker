"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Show, SignInButton } from "@clerk/nextjs";

type Application = {
    id: number;
    companyName: string;
    createdAt: string;
    jobTitle: string;
    jobDescription: string;
    result: string | null;
    status: string;
}

const statusList = ["Saved", "Applied", "Interviewing", "Offer", "Rejected"];

export default function History() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    // run once right when the page loads
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await fetch("/api/applications");
                if (!response.ok) {
                    setApplications([]);
                    return;
                }

                const data = await response.json();
                setApplications(data.applications ?? []);
            } catch (error) {
                console.error("Failed to load history", error);
            } finally {
                setLoading(false);
            }
        }
        fetchApplications();
    }, []);

    // Delete specific application
    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        // Confirm deletion
        const isConfirmed = confirm("Are you sure you want to delete this?");
        if (!isConfirmed) {
            return;
        }
        try {
            await fetch("/api/applications", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
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
            const matchesTerm = app.companyName.toLowerCase().includes(term) || app.jobTitle.toLowerCase().includes(term); 
            const matchesStatus = statusFilter === "All" || app.status === statusFilter;
            return (
                matchesTerm && matchesStatus
            )
        } catch (error) {
            console.error("Error searching for application", error)
        }
    })

    // change an application's status
    const handleStatusChange = async (id: number, newStatus: string) => {
        try {
            const response = await fetch("/api/applications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: newStatus }),
            });

            // the server refused: the dropdown goes back
            if (!response.ok) {
                console.error("Failed to change status");
                return;
            }

            // same list, with only the matching entry changed
            setApplications((prev) =>
                prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
            );
        } catch (error) {
            console.error("Error changing status application", error);
        }
    };

    return (
        <div className="page-container">
            <Header></Header>
            <Show when="signed-out">
                <p className="page-subtitle">Log in to see your analyzed jobs.</p>
            </Show>

            <Show when="signed-in">
                <h1 className="page-heading">History</h1>
                <p className="page-subtitle">Your analyzed job applications</p>

                <div className="search-function">
                    <input className="search-area" placeholder="Search for Company Name or Job Title" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}></input>
                </div>
                <div className="status-filters">
                    {["All", ...statusList].map((status)=> (
                        <button 
                            key={status}
                            className={`filter-btn ${statusFilter === status ? "active": ""}`}
                            onClick ={() => setStatusFilter(status)}
                        > {status}
                        </button>
                    ))}
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
                            <select 
                                className={`status-badge status-${app.status.toLowerCase()}`}
                                value={app.status}
                                aria-label={`Change status for ${app.jobTitle}`}
                                onClick ={(e)=> e.stopPropagation()}
                                onChange={(e) => handleStatusChange(app.id, e.target.value)}
                            >
                                {statusList.map((status) => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
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
            </Show>

            <Footer></Footer>
        </div>
    )

}