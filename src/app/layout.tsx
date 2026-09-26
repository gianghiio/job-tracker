import { Inter } from 'next/font/google';
import './globals.css';
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

// Initialize the font and define a CSS variable name
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', 
  weight: ['400', '700'], 
});

export const metadata: Metadata = {
    title: "Resume Tailor",
    description: "Tailor your resume for every job",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        {/* ClerkProvider goes inside body, wrapping the whole app */}
        <ClerkProvider appearance={{ cssLayerName: "clerk" }}>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}