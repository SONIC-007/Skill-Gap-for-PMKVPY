import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata = {
    title: "PMKVY Skill Gap Analyser — AI Readiness & NSQF Platform",
    description: "Identify skill gaps against National Occupational Standards (QP-NOS), practice competency assessments, and unlock government-subsidized PMKVY 4.0 training.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="font-sans antialiased min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-[#4F46E5] selection:text-white">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
