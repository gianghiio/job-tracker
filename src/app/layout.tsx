import { Inter } from 'next/font/google';
import './globals.css';

// Initialize the font and define a CSS variable name
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', 
  weight: ['400', '700'], 
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}