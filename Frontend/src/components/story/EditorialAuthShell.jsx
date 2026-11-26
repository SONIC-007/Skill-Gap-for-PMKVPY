"use client";
// [FRONTEND] Shared Split Editorial Auth Stage | Unifies /login, /register, /forgot-password with Landing Story Studio theme

import Link from "next/link";
import { ArrowLeft, Link2, Sparkles } from "lucide-react";
import { RevealBlock, RevealLine } from "@/components/story/scrollEngine";

export function EditorialAuthShell({
    children,
    rightActionHref = "/",
    rightActionLabel = "Back to Story",
    studioBadge = "CANDIDATE WORKSPACE",
    studioTitle = "Skill clarity,",
    studioItalic = "calibrated cleanly.",
    studioNote = "Sign in to benchmark your resume against QP-NOS standards or live job links with Google Gemini AI.",
}) {
    return (
        <div className="min-h-screen flex flex-col bg-[#FBFBF9] text-[#111113] selection:bg-[#4F46E5] selection:text-white">
            {/* Floating Frosted Auth Top Bar */}
            <header className="w-full px-4 sm:px-8 pt-4 sm:pt-5">
                <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/85 backdrop-blur-xl border border-black/[0.09] shadow-[0_8px_24px_-8px_rgba(17,17,19,0.12)]"
                    >
                        <span className="h-6 w-6 rounded-full bg-[#111113] text-white flex items-center justify-center font-mono text-[10px] font-bold">
                            &lt;/&gt;
                        </span>
                        <span className="font-display text-[14px] font-semibold tracking-tight text-[#111113]">
                            PMKVY<sup className="font-mono text-[9px] ml-0.5 text-[#4F46E5]">4.0</sup>
                        </span>
                    </Link>

                    <Link
                        href={rightActionHref}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/85 backdrop-blur-xl border border-black/[0.09] text-[12.5px] font-medium text-[#52525B] hover:text-[#111113] transition-colors shadow-[0_8px_24px_-8px_rgba(17,17,19,0.08)]"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>{rightActionLabel}</span>
                    </Link>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
                <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* Left Deep Espresso Vignette Card (Desktop) */}
                    <aside className="hidden lg:flex lg:col-span-5 rounded-[28px] bg-[#140A0B] text-[#FAF8F5] p-7 flex-col justify-between relative overflow-hidden shadow-[0_28px_64px_-22px_rgba(17,17,19,0.35)]">
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -right-20 top-10 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(158,51,26,0.28)_0%,rgba(79,70,229,0.12)_50%,transparent_72%)] blur-2xl"
                        />

                        <div className="relative z-10 flex items-center justify-between">
                            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#E07A5F]">
                                {studioBadge}
                            </span>
                            <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/10">
                                NSQF L4–7
                            </span>
                        </div>

                        <div className="relative z-10 my-4 flex justify-center">
                            <div className="w-48 aspect-square flex items-center justify-center rounded-3xl overflow-hidden bg-white p-2 shadow-xl">
                                <img
                                    src="/images/vec-mentor.jpg"
                                    alt="PMKVY Career Consultation Illustration"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>

                        <div className="relative z-10 space-y-4">
                            <h2 className="font-display text-[30px] leading-[1.08] tracking-[-0.03em] font-semibold text-white">
                                <RevealLine delayMs={40}>{studioTitle}</RevealLine>{" "}
                                <RevealLine delayMs={120}>
                                    <span className="font-editorial italic font-normal text-[#F2CFC2]">
                                        {studioItalic}
                                    </span>
                                </RevealLine>
                            </h2>

                            <RevealBlock delayMs={180} yOffset={10}>
                                <p className="text-[13px] text-white/65 leading-relaxed">{studioNote}</p>
                            </RevealBlock>

                            <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px] font-mono text-white/80">
                                <div className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-white/[0.05] border border-white/10">
                                    <Sparkles className="h-3.5 w-3.5 text-[#E07A5F] shrink-0" />
                                    <span className="truncate">By Job Role</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-white/[0.05] border border-white/10">
                                    <Link2 className="h-3.5 w-3.5 text-indigo-300 shrink-0" />
                                    <span className="truncate">By Job Link</span>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Right Clean White Studio Auth Card */}
                    <div className="lg:col-span-7 flex items-center justify-center">
                        <div className="w-full bg-white border border-black/[0.08] rounded-[28px] shadow-[0_24px_56px_-24px_rgba(17,17,19,0.12)] overflow-hidden p-7 sm:p-10">
                            {children}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
