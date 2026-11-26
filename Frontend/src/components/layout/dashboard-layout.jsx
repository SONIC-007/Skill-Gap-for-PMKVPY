"use client";
// [FRONTEND] Workspace Frame & Footer | Used by: all workspace & admin pages | Uses: TopNavbar (sidebar.jsx), auth-context.jsx
import { useSession } from "@/lib/auth-context";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { TopNavbar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2, ShieldAlert } from "lucide-react";

export function DashboardLayout({ children }) {
    const { data: session, status, signOutUser } = useSession();
    const pathname = usePathname();

    const isAdminRoute = pathname?.startsWith("/admin");
    const isCheckingAdmin = isAdminRoute && status === "loading";
    const isUnauthorizedAdmin =
        isAdminRoute && status !== "loading" && session?.user?.role !== "ADMIN";

    const handleSignOut = async () => {
        await signOutUser();
        window.location.assign("/login");
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#F4F5F7] text-[#111113] font-sans antialiased">
            <TopNavbar
                userRole={session?.user?.role || "CANDIDATE"}
                userName={session?.user?.name || "Candidate"}
                onSignOut={handleSignOut}
                isLoggedIn={status === "authenticated"}
            />

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-7 sm:py-9">
                {isCheckingAdmin ? (
                    <div className="flex h-64 items-center justify-center">
                        <Loader2 className="h-7 w-7 animate-spin text-[#4F46E5]" />
                    </div>
                ) : isUnauthorizedAdmin ? (
                    <div className="prepp-card max-w-lg mx-auto mt-12 p-8 text-center space-y-4">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FEF2F2] text-[#BA1A1A]">
                            <ShieldAlert className="h-6 w-6" />
                        </div>
                        <h1 className="font-display text-xl font-bold text-[#111113]">
                            Administrator Access Required
                        </h1>
                        <p className="text-[13.5px] text-[#52525B] leading-relaxed">
                            Your current account does not have administrator privileges for the PMKVY Console.
                        </p>
                        <div className="pt-2 flex justify-center gap-2.5">
                            <Link href="/dashboard">
                                <Button size="sm">Return to Dashboard</Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    children
                )}
            </main>

            <footer className="mt-10 rounded-t-[28px] sm:rounded-t-[40px] bg-[#111113] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="font-display text-[15px] font-semibold text-white tracking-tight">
                            PMKVY Skill Gap Analyser
                        </span>
                        <span className="text-white/25">•</span>
                        <p className="text-[12px] text-white/60">
                            © 2026 Skill India &amp; NSQF Placement Platform.
                        </p>
                    </div>
                    <nav aria-label="Footer Links" className="flex flex-wrap items-center gap-5 text-[12px] text-white/60">
                        <Link href="/resume-analyser" className="hover:text-white transition-colors">
                            AI Resume Matcher
                        </Link>
                        <Link href="/skill-gap" className="hover:text-white transition-colors">
                            Gap Matrix
                        </Link>
                        <Link href="/courses" className="hover:text-white transition-colors">
                            PMKVY Courses
                        </Link>
                        <a
                            href="https://www.skillindiadigital.gov.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white transition-colors inline-flex items-center gap-1"
                        >
                            Skill India Digital <ExternalLink className="h-3 w-3" />
                        </a>
                    </nav>
                </div>
            </footer>
        </div>
    );
}
