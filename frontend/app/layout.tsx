import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Psychiatric Disorder Screening Tool | DASS-42 Assessment",
  description:
    "Research-grade mental health screening tool based on the DASS-42 questionnaire. Assess depression, anxiety, and stress levels for educational purposes.",
  keywords: [
    "DASS-42",
    "mental health",
    "psychiatric screening",
    "depression assessment",
    "anxiety assessment",
    "stress assessment",
    "psychological research",
  ],
  authors: [{ name: "Research Team" }],
  robots: "noindex, nofollow", // Research tool, not for public indexing
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
