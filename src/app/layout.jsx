import "./globals.css";
import { Geist, Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers";

const geistSans = Geist({
    subsets: ["latin"],
    variable: "--font-geist-sans",
    weight: ["400", "500", "600", "700"],
});

const interSans = Inter({
    subsets: ["latin"],
    variable: "--font-inter-sans",
    weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-jetbrains-mono",
    weight: ["400", "500", "600"],
});

export const metadata = {
    title: "PMKVY Skill Gap Analyser — AI Readiness & NSQF Platform",
    description: "Identify skill gaps against National Occupational Standards (QP-NOS), practice competency assessments, and unlock government-subsidized PMKVY 4.0 training.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${geistSans.variable} ${interSans.variable} ${jetbrainsMono.variable}`}>
            <body className="font-sans antialiased min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-[#4F46E5] selection:text-white">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
