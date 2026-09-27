import Link from "next/link";

export default function Footer() {
    return (
        <div className="site-footer">
            <div className="footer-content">
                <p className="footer-brand">Resume Tailor</p>
                <p className="footer-copyright">© 2026 Resume Tailor</p>
                <div className="footer-links">
                    <Link href="/resume">Your Resume</Link>
                    <Link href="/tailor">Job Description</Link>
                    <Link href="/history">View History</Link>
                </div>
            </div>
        </div>
    )
}