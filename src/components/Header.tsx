import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, Show } from "@clerk/nextjs";

export default function Header() {
    return (
        <div className="header">
            <div className="brand-name">
                <Link href="/" className="brand-link"><h1>Resume Tailor</h1></Link>
            </div>
            <div className="nav-tag">
                <Link href="/resume" className="resume-link">Your Resume</Link>
                <Link href="/tailor" className="job-link">Job Description</Link>
                <Link href="/history" className="history-link">View history</Link>
            </div>
            <div className="auth">
                {/* Show Log In / Sign Up only when logged out */}
                <Show when="signed-out">
                    <SignInButton mode="modal">
                        <button className="log-in">Log In</button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                        <button className="sign-up">Sign Up</button>
                    </SignUpButton>
                </Show>
                {/* Show the profile picture (with Sign out menu) when logged in */}
                <Show when="signed-in">
                    <UserButton />
                </Show>
            </div>
        </div>
    )
}