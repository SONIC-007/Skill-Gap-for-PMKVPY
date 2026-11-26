"use client";
// [FRONTEND] Section 3: Compact Dual Engine + Animated Coral Spotlight Banner (Video Ref 00:04-00:09)
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Play, Sparkles, Target, Link2 } from "lucide-react";
import { RevealBlock, RevealLine } from "@/components/story/scrollEngine";

const SPOTLIGHT_SLIDES = [
    {
        kicker: "DUAL BENCHMARKING",
        headline: "Audit roles & live job links.",
        copy: "Instant resume parsing, weighted NOS benchmarks, and live hiring link intelligence unified for placement readiness.",
        tag: "@gemini-ai",
        actionText: "Open Matcher",
        ctaHref: "/login?callbackUrl=/resume-analyser",
        themeBg: "bg-[#F36538]",
    },
    {
        kicker: "NATIONAL STANDARDS",
        headline: "Pinpoint exact skill deficits.",
        copy: "Compare verified candidate skills against NSDC Qualification Packs and unlock 100% funded PMKVY 4.0 bridge modules.",
        tag: "@qp-nos",
        actionText: "View Gap Matrix",
        ctaHref: "/login?callbackUrl=/skill-gap",
        themeBg: "bg-[#141416]",
    },
];

export function FeaturedSection() {
    const [slideIdx, setSlideIdx] = useState(0);
    const activeSlide = SPOTLIGHT_SLIDES[slideIdx];

    // Smooth auto-cycle every 6s (keeps animations dynamic even before interaction)
    useEffect(() => {
        const timer = window.setInterval(() => {
            setSlideIdx((prev) => (prev === 0 ? 1 : 0));
        }, 6000);
        return () => window.clearInterval(timer);
    }, []);

    return (
        <section className="bg-white border-t border-black/[0.06] py-12 sm:py-16 px-4 sm:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left Editorial Split (5 cols) */}
                <div className="lg:col-span-5 space-y-5">
                    <RevealBlock delayMs={30}>
                        <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#52525B] font-semibold">
                            AI DUAL ENGINE
                        </span>
                    </RevealBlock>

                    <h2 className="font-display text-[38px] sm:text-[46px] lg:text-[50px] leading-[1.03] tracking-[-0.04em] font-semibold text-[#111113]">
                        <RevealLine delayMs={50}>Audit, Match,</RevealLine>
                        <br />
                        <RevealLine delayMs={130}>&amp; upskill fast.</RevealLine>
                    </h2>

                    <RevealBlock delayMs={180}>
                        <p className="text-[14.5px] text-[#52525B] leading-relaxed">
                            Sign in to pair your resume with official NSDC Qualification Packs or any live job posting URL, isolating missing skills in seconds.
                        </p>
                    </RevealBlock>

                    <RevealBlock delayMs={230} className="grid grid-cols-2 gap-2.5 pt-1">
                        <Link
                            href="/login?callbackUrl=/resume-analyser"
                            className="group p-3.5 rounded-2xl bg-[#FAFAFB] border border-black/[0.08] hover:border-[#4F46E5]/40 hover:-translate-y-0.5 transition-all"
                        >
                            <Target className="h-4 w-4 text-[#4F46E5] mb-1.5" />
                            <div className="font-display text-[13.5px] font-semibold text-[#111113]">By Job Role</div>
                            <div className="font-mono text-[10.5px] text-[#52525B]">Official QP-NOS</div>
                        </Link>
                        <Link
                            href="/login?callbackUrl=/resume-analyser"
                            className="group p-3.5 rounded-2xl bg-[#FAFAFB] border border-black/[0.08] hover:border-[#10B981]/40 hover:-translate-y-0.5 transition-all"
                        >
                            <Link2 className="h-4 w-4 text-[#10B981] mb-1.5" />
                            <div className="font-display text-[13.5px] font-semibold text-[#111113]">By Job Link</div>
                            <div className="font-mono text-[10.5px] text-[#52525B]">Gemini Live JD</div>
                        </Link>
                    </RevealBlock>

                    <RevealBlock delayMs={280} className="flex flex-wrap items-center gap-3 pt-1">
                        <Link
                            href="/login?callbackUrl=/resume-analyser"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#111113] hover:bg-[#27272A] text-white text-[13px] font-medium transition-all"
                        >
                            <span>Launch AI Matcher</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                        <Link
                            href="/login?callbackUrl=/courses"
                            className="inline-flex items-center px-4 py-2.5 rounded-full text-[13px] font-medium text-[#111113] hover:bg-[#F4F4F5] transition-colors"
                        >
                            Browse Bridges
                        </Link>
                    </RevealBlock>
                </div>

                    {/* Right Coral Spotlight Stage (7 cols) with AI Robot Mascot */}
                <div className="lg:col-span-7">
                    <div
                        className={`relative rounded-[28px] overflow-hidden min-h-[340px] sm:min-h-[390px] p-5 sm:p-7 flex flex-col justify-between transition-colors duration-500 shadow-[0_28px_60px_-24px_rgba(243,101,56,0.36)] ${activeSlide.themeBg}`}
                    >
                        <img
                            src="/images/bot-mascot.jpg"
                            alt="PMKVY AI Robot Mascot"
                            className="absolute right-0 top-0 h-full w-full sm:w-2/3 object-cover object-center transition-transform duration-700 hover:scale-[1.03]"
                        />
                        <div
                            aria-hidden="true"
                            className={`absolute inset-0 bg-gradient-to-t ${
                                slideIdx === 0
                                    ? "sm:bg-gradient-to-r from-[#F36538] via-[#F36538]/85 to-transparent"
                                    : "sm:bg-gradient-to-r from-[#141416] via-[#141416]/85 to-transparent"
                            }`}
                        />

                        {/* Top Swatch + Tag Row */}
                        <div className="relative z-20 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-xl border border-black/[0.08]">
                                <button
                                    type="button"
                                    aria-label="Coral slide"
                                    onClick={() => setSlideIdx(0)}
                                    className={`h-4.5 w-4.5 rounded-md bg-[#F36538] transition-transform cursor-pointer ${
                                        slideIdx === 0 ? "scale-110 ring-2 ring-[#111113]" : "opacity-75"
                                    }`}
                                />
                                <button
                                    type="button"
                                    aria-label="Obsidian slide"
                                    onClick={() => setSlideIdx(1)}
                                    className={`h-4.5 w-4.5 rounded-md bg-[#141416] transition-transform cursor-pointer ${
                                        slideIdx === 1 ? "scale-110 ring-2 ring-white" : "opacity-75"
                                    }`}
                                />
                            </div>

                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#111113] text-white font-mono text-[11px] font-medium shadow-md">
                                <Sparkles className="h-3 w-3 text-[#F36538]" />
                                {activeSlide.tag}
                            </span>
                        </div>

                        {/* Animated Keyed Slide Story Copy + Controls */}
                        <div className="relative z-20 flex flex-col gap-4 mt-16 sm:mt-0">
                            <div key={slideIdx} className="max-w-md space-y-1.5 animate-[storyStageIn_420ms_cubic-bezier(0.22,1,0.36,1)]">
                                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/80">
                                    {activeSlide.kicker}
                                </div>
                                <h3 className="font-display text-2xl sm:text-[28px] font-semibold text-white leading-tight">
                                    {activeSlide.headline}
                                </h3>
                                <p className="text-[13.5px] text-white/90 leading-relaxed">
                                    {activeSlide.copy}
                                </p>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <Link
                                    href={activeSlide.ctaHref}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#111113] hover:bg-[#F4F4F5] text-[12.5px] font-semibold shadow-md transition-all"
                                >
                                    <Play className="h-3.5 w-3.5 fill-current" />
                                    <span>{activeSlide.actionText}</span>
                                </Link>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        aria-label="Previous spotlight"
                                        onClick={() => setSlideIdx((p) => (p === 0 ? 1 : 0))}
                                        className="h-8.5 w-8.5 rounded-full bg-white/90 hover:bg-white text-[#111113] flex items-center justify-center shadow-md cursor-pointer transition-colors"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        aria-label="Next spotlight"
                                        onClick={() => setSlideIdx((p) => (p === 1 ? 0 : 1))}
                                        className="h-8.5 w-8.5 rounded-full bg-white/90 hover:bg-white text-[#111113] flex items-center justify-center shadow-md cursor-pointer transition-colors"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
