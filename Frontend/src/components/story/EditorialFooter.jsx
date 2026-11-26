"use client";
// [FRONTEND] Chapter V — Architectural Close & Minimal Footer | Overlapping dark curtain transition

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { RevealBlock, RevealLine } from "@/components/story/scrollEngine";

export function EditorialFooter() {
    return (
        <footer
            id="chapter-close"
            className="relative -mt-6 sm:-mt-10 z-40 rounded-t-[36px] sm:rounded-t-[56px] bg-[#111113] text-white pt-20 sm:pt-28 pb-10 px-4 sm:px-8 overflow-hidden"
        >
            <div className="max-w-6xl mx-auto">
                <div className="text-center max-w-3xl mx-auto pb-16 sm:pb-20">
                    <RevealBlock delayMs={30}>
                        <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-white/45 mb-5">
                            CHAPTER 05 // READY FOR WORKSPACE
                        </div>
                    </RevealBlock>

                    <h2 className="font-display text-[44px] sm:text-[64px] lg:text-[72px] leading-[1.03] tracking-[-0.04em] font-semibold">
                        <span className="block">
                            <RevealLine delayMs={80}>Ready when</RevealLine>
                        </span>
                        <span className="block mt-1">
                            <RevealLine delayMs={180}>
                                <span className="font-editorial italic font-normal text-[#C3C0FF]">
                                    you are.
                                </span>
                            </RevealLine>
                        </span>
                    </h2>

                    <RevealBlock delayMs={260}>
                        <p className="mt-5 text-[14.5px] sm:text-[16px] text-white/65 max-w-xl mx-auto leading-relaxed">
                            Sign in to benchmark your resume against QP-NOS standards or live job links with Google Gemini AI and unlock subsidized PMKVY 4.0 training tracks.
                        </p>
                    </RevealBlock>

                    <RevealBlock delayMs={340}>
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link
                                href="/login?callbackUrl=/resume-analyser"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-[#111113] hover:bg-[#FAF8F5] text-[13.5px] font-semibold transition-colors"
                            >
                                <span>Sign In &amp; Open AI Matcher</span>
                                <ArrowUpRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href="/register"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white text-[13.5px] font-medium transition-colors"
                            >
                                Create Candidate Account
                            </Link>
                        </div>
                    </RevealBlock>
                </div>

                {/* Clean Architectural Footer Bar */}
                <div className="pt-8 border-t border-white/[0.1] flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] text-white/55">
                    <div className="flex items-center gap-3">
                        <span className="font-display text-[15px] font-semibold text-white">
                            PMKVY Skill Gap Analyser
                        </span>
                        <span className="text-white/25">•</span>
                        <span>© 2026 Skill India &amp; NSQF Placement Platform.</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-6">
                        <Link href="/login?callbackUrl=/resume-analyser" className="hover:text-white transition-colors">
                            AI Resume Matcher
                        </Link>
                        <Link href="/login?callbackUrl=/dashboard" className="hover:text-white transition-colors">
                            Dashboard
                        </Link>
                        <Link href="/login?callbackUrl=/courses" className="hover:text-white transition-colors">
                            Courses
                        </Link>
                        <a
                            href="https://www.skillindiadigital.gov.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white transition-colors"
                        >
                            Skill India Digital
                        </a>
                        <Link href="/login" className="hover:text-white transition-colors">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
