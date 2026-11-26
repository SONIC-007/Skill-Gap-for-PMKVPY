// [FRONTEND] Root Layout & Typography Providers | Used by: all Next.js routes
import "./globals.css";
import { Geist, Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers";

const geistSans = Geist({
    subsets: ["latin"],
    variable: "--font-display",
});

const interSans = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
});

const instrumentSerif = Instrument_Serif({
    subsets: ["latin"],
    weight: ["400"],
    style: ["normal", "italic"],
    variable: "--font-editorial",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
});

export const metadata = {
    title: "PMKVY Skill Gap Analyser — Editorial Career Intelligence & NSQF Platform",
    description: "Identify skill gaps against National Occupational Standards (QP-NOS), run Gemini AI resume & live job-link audits, and unlock subsidized PMKVY 4.0 training.",
};

export default function RootLayout({ children }) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${interSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
        >
            <body className="font-sans antialiased min-h-screen bg-[#FBFBF9] text-[#111113] selection:bg-[#4F46E5] selection:text-white overflow-x-clip">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
