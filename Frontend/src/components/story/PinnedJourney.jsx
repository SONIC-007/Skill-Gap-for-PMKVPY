"use client";
// [FRONTEND] Chapter II — Pinned Scrollytelling Transformation | Sticky 260vh scroll choreography
// Smoothly morphs a single diagnostic artifact through 3 chapters as the user scrolls.

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, Link2, Sparkles } from "lucide-react";
import { useScrollProgress } from "@/components/story/scrollEngine";

const STAGES = [
    {
        num: "01",
        tag: "DECODE THE RESUME",
        title: "Every project, distilled.",
        accent: "Without manual entry.",
        description:
            "Drop a PDF or DOCX resume. Rather than keyword stuffing, our parser isolates practical engineering exposure, academic foundation, and domain duration cleanly.",
        metricLabel: "Tokens Extracted",
        metricValue: "14 Verified Competencies",
    },
    {
        num: "02",
        tag: "DUAL INTERSECTION ENGINE",
        title: "Two ways to benchmark.",
        accent: "Roles or live links.",
        description:
            "Compare your profile directly against official NSDC QP-NOS Qualification Packs or paste any live hiring URL / Job Description for Gemini AI gap synthesis.",
        metricLabel: "Benchmark Modes",
        metricValue: "QP-NOS + Live Job URL",
    },
    {
        num: "03",
        tag: "ELIMINATE THE DEFICIT",
        title: "Precision bridge courses.",
        accent: "Zero tuition guesswork.",
        description:
            "Instead of endless video playlists, critical gaps map straight into 100% government-subsidized PMKVY 4.0 labs synced directly to your MongoDB Skill Passport.",
        metricLabel: "Projected Uplift",
        metricValue: "58% -> 89% Readiness",
    },
];

export function PinnedJourney() {
    const trackRef = useRef(null);
    const [progress, setProgress] = useState(0);

    useScrollProgress(trackRef, {
        mode: "sticky",
        damping: 0.14,
        onProgress: (p) => {
            setProgress(p);
        },
    });

    const stageIndex = progress < 0.34 ? 0 : progress < 0.68 ? 1 : 2;
    const scanLinePct = Math.max(0, Math.min(100, ((progress - 0.25) / 0.45) * 100));
    const readinessScore =
        progress < 0.34
            ? 58
            : progress < 0.68
                ? Math.round(58 + ((progress - 0.34) / 0.34) * 14)
                : Math.round(72 + ((progress - 0.68) / 0.32) * 17);

    const jumpToStage = (idx) => {
        if (!trackRef.current) return;
        const rect = trackRef.current.getBoundingClientRect();
        const absTop = rect.top + window.scrollY;
        const scrollable = Math.max(1, trackRef.current.offsetHeight - window.innerHeight);
        const targetRatio = idx === 0 ? 0.08 : idx === 1 ? 0.48 : 0.88;
        window.scrollTo({
            top: absTop + scrollable * targetRatio,
            behavior: "smooth",
        });
    };

    return (
        <section id="chapter-journey" ref={trackRef} className="relative lg:h-[245vh] bg-[#FBFBF9]">
            <div className="lg:sticky lg:top-0 lg:h-screen w-full flex items-center py-20 lg:py-0 px-4 sm:px-8 border-t border-black/[0.06] overflow-hidden">
                <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                    {/* Left Pinned Narrative Column */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#4F46E5] font-semibold">
                                CHAPTER {STAGES[stageIndex].num} {"//"} {STAGES[stageIndex].tag}
                            </span>
                        </div>

                        {/* Hairline Scrub Progress Rule + Clickable Stage Tabs */}
                        <div className="grid grid-cols-3 gap-2">
                            {STAGES.map((st, idx) => {
                                const active = idx === stageIndex;
                                const filled =
                                    idx < stageIndex
                                        ? 100
                                        : idx === stageIndex
                                            ? Math.min(100, Math.max(12, ((progress - idx * 0.33) / 0.34) * 100))
                                            : 0;
                                return (
                                    <button
                                        key={st.num}
                                        type="button"
                                        onClick={() => jumpToStage(idx)}
                                        className="text-left group cursor-pointer"
                                    >
                                        <div className="h-[2px] w-full bg-black/[0.08] rounded-full overflow-hidden mb-1.5">
                                            <div
                                                className="h-full bg-[#111113] transition-all duration-150"
                                                style={{ width: `${filled}%` }}
                                            />
                                        </div>
                                        <span
                                            className={`font-mono text-[10px] transition-colors ${
                                                active ? "text-[#111113] font-semibold" : "text-[#71717A] group-hover:text-[#111113]"
                                            }`}
                                        >
                                            {st.num} {st.num === "01" ? "Parse" : st.num === "02" ? "Match" : "Bridge"}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Crossfading Stage Headline + Editorial Copy */}
                        <div className="min-h-[210px] sm:min-h-[185px] flex items-center">
                            <div
                                key={STAGES[stageIndex].num}
                                className="w-full animate-[storyStageIn_420ms_cubic-bezier(0.22,1,0.36,1)]"
                            >
                                <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] leading-[1.08] tracking-[-0.03em] font-semibold text-[#111113]">
                                    {STAGES[stageIndex].title}{" "}
                                    <span className="block font-editorial italic font-normal text-[#4F46E5]">
                                        {STAGES[stageIndex].accent}
                                    </span>
                                </h2>
                                <p className="mt-4 text-[14.5px] sm:text-[15.5px] text-[#52525B] leading-relaxed">
                                    {STAGES[stageIndex].description}
                                </p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-black/[0.07] flex items-center justify-between gap-4">
                            <div>
                                <div className="font-mono text-[10px] uppercase tracking-wider text-[#71717A]">
                                    {STAGES[stageIndex].metricLabel}
                                </div>
                                <div className="font-display text-[14px] font-semibold text-[#111113] mt-0.5">
                                    {STAGES[stageIndex].metricValue}
                                </div>
                            </div>
                            <Link
                                href="/login?callbackUrl=/resume-analyser"
                                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#111113] hover:bg-[#27272A] text-white text-[12.5px] font-medium transition-colors shrink-0"
                            >
                                <span>Try Live Audit</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    </div>

                    {/* Right Pinned Morphing Artifact Canvas */}
                    <div className="lg:col-span-7">
                        <div className="relative rounded-[28px] bg-white border border-black/[0.08] shadow-[0_32px_72px_-24px_rgba(17,17,19,0.12)] p-5 sm:p-7 overflow-hidden">
                            {/* Artifact Chrome Header */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-black/[0.06]">
                                <div className="flex items-center gap-2.5">
                                    <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]" />
                                    <span className="font-mono text-[11px] font-semibold text-[#111113]">
                                        pmkvy://telemetry/audit-session
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`font-mono text-[10.5px] px-2.5 py-0.5 rounded-full border transition-colors ${
                                            stageIndex === 1
                                                ? "bg-[#4F46E5] text-white border-[#4F46E5]"
                                                : "bg-[#F4F4F5] text-[#52525B] border-black/[0.06]"
                                        }`}
                                    >
                                        {stageIndex === 0
                                            ? "DOCUMENT PARSER"
                                            : stageIndex === 1
                                                ? "QP-NOS + GEMINI LINK"
                                                : "PMKVY 4.0 MATCH"}
                                    </span>
                                    <span className="font-mono text-[12px] font-bold text-[#111113] px-2.5 py-0.5 rounded-full bg-[#FBFBF9] border border-black/[0.08]">
                                        {readinessScore}% READY
                                    </span>
                                </div>
                            </div>

                            {/* Continuous Scroll-Linked Transformation Body */}
                            <div className="mt-5 space-y-4 relative">
                                {/* Animated Laser Scan Line during Stage 02 */}
                                {stageIndex === 1 && (
                                    <div
                                        aria-hidden="true"
                                        className="pointer-events-none absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#4F46E5] to-transparent z-20"
                                        style={{
                                            top: `${Math.min(92, Math.max(8, scanLinePct))}%`,
                                        }}
                                    />
                                )}

                                {/* Source Resume + Dual Mode Header Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div
                                        className={`p-3.5 rounded-2xl border transition-all duration-500 ${
                                            stageIndex === 0
                                                ? "bg-[#F2F3FF]/80 border-[#4F46E5]/30 scale-[1.01]"
                                                : "bg-[#FBFBF9] border-black/[0.06]"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between text-[11px] font-mono text-[#52525B] mb-1">
                                            <span className="flex items-center gap-1.5 text-[#111113] font-semibold">
                                                <FileText className="h-3.5 w-3.5 text-[#4F46E5]" />
                                                Arun_Kumar_CV.pdf
                                            </span>
                                            <span className="text-[#065F46]">PARSED</span>
                                        </div>
                                        <p className="text-[12px] text-[#52525B]">
                                            React, Node.js, REST APIs, Git (1.5 yrs)
                                        </p>
                                    </div>

                                    <div
                                        className={`p-3.5 rounded-2xl border transition-all duration-500 ${
                                            stageIndex === 1
                                                ? "bg-[#F2F3FF]/80 border-[#4F46E5]/30 scale-[1.01]"
                                                : "bg-[#FBFBF9] border-black/[0.06]"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between text-[11px] font-mono text-[#52525B] mb-1">
                                            <span className="flex items-center gap-1.5 text-[#111113] font-semibold">
                                                <Link2 className="h-3.5 w-3.5 text-[#4F46E5]" />
                                                By Job Role OR Job Link
                                            </span>
                                            <span>SSC/Q0508</span>
                                        </div>
                                        <p className="text-[12px] text-[#52525B]">
                                            Full Stack Developer • NSQF L6 Target
                                        </p>
                                    </div>
                                </div>

                                {/* Dynamic Competency Matrix Rows */}
                                <div className="space-y-2.5 pt-1">
                                    {[
                                        {
                                            code: "SSC/N0508",
                                            name: "React & Next.js Frontend Systems",
                                            pct: stageIndex === 0 ? 64 : 92,
                                            tag: stageIndex === 0 ? "Detected" : "Verified Match",
                                            tone: "emerald",
                                        },
                                        {
                                            code: "SSC/N0705",
                                            name: "Docker, CI/CD & Container Ops",
                                            pct: stageIndex === 2 ? 84 : 30,
                                            tag: stageIndex === 2 ? "+54% Post-Bridge" : "-55% Critical Gap",
                                            tone: stageIndex === 2 ? "emerald" : "rose",
                                        },
                                        {
                                            code: "SSC/N0702",
                                            name: "Cloud Architecture & IAM Baseline",
                                            pct: stageIndex === 2 ? 88 : 60,
                                            tag: stageIndex === 2 ? "NSQF Ready" : "-20% Needs Work",
                                            tone: stageIndex === 2 ? "emerald" : "amber",
                                        },
                                    ].map((row) => (
                                        <div
                                            key={row.code}
                                            className="p-3 rounded-xl bg-[#FBFBF9] border border-black/[0.06] space-y-2"
                                        >
                                            <div className="flex items-center justify-between text-[12px]">
                                                <span className="font-medium text-[#111113] flex items-center gap-2">
                                                    <span className="font-mono text-[10.5px] text-[#4F46E5]">
                                                        {row.code}
                                                    </span>
                                                    {row.name}
                                                </span>
                                                <span
                                                    className={`font-mono text-[10.5px] px-2 py-0.5 rounded-full border transition-all duration-500 ${
                                                        row.tone === "emerald"
                                                            ? "bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]"
                                                            : row.tone === "rose"
                                                                ? "bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]"
                                                                : "bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]"
                                                    }`}
                                                >
                                                    {row.tag}
                                                </span>
                                            </div>
                                            <div className="h-1.5 w-full bg-black/[0.06] rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                                                        row.tone === "emerald"
                                                            ? "bg-[#10B981]"
                                                            : row.tone === "rose"
                                                                ? "bg-[#BA1A1A]"
                                                                : "bg-[#F59E0B]"
                                                    }`}
                                                    style={{ width: `${row.pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Stage 03 Prescription Reveal Card */}
                                <div
                                    className="rounded-2xl border p-4 transition-all duration-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                                    style={{
                                        backgroundColor: stageIndex === 2 ? "#ECFDF5" : "#F8FAFC",
                                        borderColor: stageIndex === 2 ? "#A7F3D0" : "rgba(17,17,19,0.08)",
                                        transform: stageIndex === 2 ? "translate3d(0,0,0)" : "translate3d(0,6px,0)",
                                        opacity: stageIndex >= 1 ? 1 : 0.65,
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                                stageIndex === 2
                                                    ? "bg-[#10B981] text-white"
                                                    : "bg-[#EAEDFF] text-[#4F46E5]"
                                            }`}
                                        >
                                            {stageIndex === 2 ? (
                                                <CheckCircle2 className="h-4.5 w-4.5" />
                                            ) : (
                                                <Sparkles className="h-4.5 w-4.5" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-[13px] font-semibold text-[#111113]">
                                                {stageIndex === 2
                                                    ? "PMKVY 4.0 Recommended Bridge: Cloud & Docker Lab"
                                                    : "Mapping deficit to PMKVY 4.0 centers..."}
                                            </div>
                                            <div className="font-mono text-[11px] text-[#065F46]">
                                                NSQF Level 6 • 50 Hours • 100% Govt Funded (₹0 Fee)
                                            </div>
                                        </div>
                                    </div>
                                    <span className="font-mono text-[11px] font-semibold text-[#111113] shrink-0">
                                        STAGE {STAGES[stageIndex].num}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
