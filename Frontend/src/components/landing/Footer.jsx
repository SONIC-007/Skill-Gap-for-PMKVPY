"use client";
// [FRONTEND] Section 9: Ultra-Minimal Architectural Light Footer (Video Ref 00:42)
import Link from "next/link";
import { Globe, Terminal, Share2 } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-[#F7F7F8] border-t border-black/[0.06] text-[#111113]">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-16">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-black/[0.06]">
                    {/* Left Brand Column */}
                    <div className="md:col-span-5 space-y-4">
                        <h3 className="font-display text-[22px] font-semibold tracking-tight text-[#111113]">
                            Our platform, your career.
                        </h3>
                        <p className="text-[13.5px] text-[#52525B] max-w-sm leading-relaxed">
                            Built for Skill India readiness — uniting AI resume diagnostics, QP-NOS skill mapping, and government-subsidized PMKVY 4.0 labs.
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                            <a
                                href="https://www.skillindiadigital.gov.in"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Skill India Digital"
                                className="h-8 w-8 rounded-lg border border-black/[0.1] bg-white hover:bg-[#111113] hover:text-white flex items-center justify-center transition-colors"
                            >
                                <Globe className="h-3.5 w-3.5" />
                            </a>
                            <Link
                                href="/login?callbackUrl=/resume-analyser"
                                aria-label="AI Matcher"
                                className="h-8 w-8 rounded-lg border border-black/[0.1] bg-white hover:bg-[#111113] hover:text-white flex items-center justify-center transition-colors"
                            >
                                <Terminal className="h-3.5 w-3.5" />
                            </Link>
                            <Link
                                href="/login?callbackUrl=/dashboard"
                                aria-label="Workspace"
                                className="h-8 w-8 rounded-lg border border-black/[0.1] bg-white hover:bg-[#111113] hover:text-white flex items-center justify-center transition-colors"
                            >
                                <Share2 className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    </div>

                    {/* Right Navigation Columns */}
                    <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 text-[13px]">
                        <div className="space-y-2.5">
                            <div className="font-semibold text-[#111113]">Workspace</div>
                            <ul className="space-y-2 text-[#52525B]">
                                <li>
                                    <Link href="/login?callbackUrl=/resume-analyser" className="hover:text-[#111113] transition-colors">
                                        AI Resume Matcher
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/login?callbackUrl=/dashboard" className="hover:text-[#111113] transition-colors">
                                        Candidate Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/login?callbackUrl=/skill-gap" className="hover:text-[#111113] transition-colors">
                                        Skill Gap Matrix
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/login?callbackUrl=/assessment" className="hover:text-[#111113] transition-colors">
                                        MCQ Arena
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-2.5">
                            <div className="font-semibold text-[#111113]">Upskilling</div>
                            <ul className="space-y-2 text-[#52525B]">
                                <li>
                                    <Link href="/login?callbackUrl=/courses" className="hover:text-[#111113] transition-colors">
                                        PMKVY 4.0 Courses
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/login?callbackUrl=/career-path" className="hover:text-[#111113] transition-colors">
                                        Career Paths
                                    </Link>
                                </li>
                                <li>
                                    <a
                                        href="https://www.skillindiadigital.gov.in"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-[#111113] transition-colors"
                                    >
                                        Skill India Digital
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-2.5">
                            <div className="font-semibold text-[#111113]">Access</div>
                            <ul className="space-y-2 text-[#52525B]">
                                <li>
                                    <Link href="/login" className="hover:text-[#111113] transition-colors">
                                        Sign In
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/register" className="hover:text-[#111113] transition-colors">
                                        Create Account
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/forgot-password" className="hover:text-[#111113] transition-colors">
                                        Reset Passcode
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#71717A]">
                    <span>© 2026 PMKVY Skill Gap Analyser. All rights reserved.</span>
                    <span className="font-mono text-[11px]">Built for NSDC &amp; NSQF Standards</span>
                </div>
            </div>
        </footer>
    );
}
