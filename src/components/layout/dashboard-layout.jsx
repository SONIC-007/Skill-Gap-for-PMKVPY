"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TopNavbar } from "@/components/layout/sidebar";
import { ExternalLink } from "lucide-react";

export function DashboardLayout({ children }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push("/login");
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] font-sans antialiased">
            <TopNavbar
                userRole={session?.user?.role || "CANDIDATE"}
                userName={session?.user?.name || "Candidate"}
                onSignOut={handleSignOut}
                isLoggedIn={status === "authenticated"}
            />

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {children}
            </main>

            <footer className="bg-white border-t border-[#E2E8F0] mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="font-display text-[15px] font-semibold text-[#3525CD] tracking-tight">
                            PMKVY Skill Gap Analyser
                        </span>
                        <span className="text-[#CBD5E1]">•</span>
                        <p className="text-[12px] text-[#64748B]">
                            © 2026 Skill India &amp; NSQF Placement Platform.
                        </p>
                    </div>
                    <nav aria-label="Footer Links" className="flex flex-wrap items-center gap-5 text-[12px] text-[#64748B]">
                        <Link href="/resume-analyser" className="hover:text-[#4F46E5] transition-colors">
                            AI Resume Matcher
                        </Link>
                        <Link href="/skill-gap" className="hover:text-[#4F46E5] transition-colors">
                            Gap Matrix
                        </Link>
                        <Link href="/courses" className="hover:text-[#4F46E5] transition-colors">
                            PMKVY Courses
                        </Link>
                        <a
                            href="https://www.skillindiadigital.gov.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#4F46E5] transition-colors inline-flex items-center gap-1"
                        >
                            Skill India Digital <ExternalLink className="h-3 w-3" />
                        </a>
                    </nav>
                </div>
            </footer>
        </div>
    );
}
