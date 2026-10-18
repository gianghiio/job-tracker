"use client";
import Link from "next/link";
import { Show, SignUpButton } from "@clerk/nextjs";

export default function GetStartedButton() {
    return (
        <>
            {/* signed out: open the sign-up popup and explain why */}
            <Show when="signed-out">
                <SignUpButton mode="modal" forceRedirectUrl="/tailor">
                    <button className="cta-button">Get Started</button>
                </SignUpButton>
                <p className="cta-note">Free account required. Your resume and history stay private to you.</p>
            </Show>

            {/* signed in: go straight to the tool */}
            <Show when="signed-in">
                <Link href="/tailor" className="cta-button">Get Started</Link>
            </Show>
        </>
    );
}