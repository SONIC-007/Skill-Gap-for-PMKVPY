"use client";
// [FRONTEND] Section 6: Parallax Bento Story Grid & Compact Sector Tracks (Video Ref 00:24-00:30)
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CheckCircle2, Compass, Play, ShieldCheck, Sparkles } from "lucide-react";
import { RevealBlock, useScrollProgress } from "@/components/story/scrollEngine";

const SECTOR_CHIPS = [
    { title: "Full Stack Web", code: "SSC/Q0508", roles: "18 Tracks", level: "NSQF Level 5", mono: "W", circle: "bg-[#111113] text-white" },
    { title: "AI & Data Science", code: "SSC/Q8101", roles: "12 Tracks", level: "NSQF Level 6", mono: "A", circle: "bg-[#EEF4FF] text-[#2563EB]" },
    { title: "EV & Robotics", code: "ASC/Q1402", roles: "9 Tracks", level: "NSQF Level 4", mono: "E", circle: "bg-[#ECFDF5] text-[#059669]" },
    { title: "Cloud & Security", code: "SSC/Q0901", roles: "14 Tracks", level: "NSQF Level 5", mono: "C", circle: "bg-[#FFF7ED] text-[#EA580C]" },
];

export function Features() {
    const bentoRef = useRef(null);
    const leftColRef = useRef(null);
    const rightColRef = useRef(null);

    useScrollProgress(bentoRef, {
        mode: "span",
        damping: 0.12,
        onProgress: (p) => {
            const delta = (p - 0.5) * 28;
            if (leftColRef.current) {
                leftColRef.current.style.transform = `translate3d(0, ${(-delta * 0.5).toFixed(1)}px, 0)`;
            }
            if (rightColRef.current) {
                rightColRef.current.style.transform = `translate3d(0, ${(delta * 0.65).toFixed(1)}px, 0)`;
            }
        },
    });

    return (
        <section id="section-features" ref={bentoRef} className="bg-[#F4F5F7] border-t border-black/[0.06] py-12 sm:py-16 px-4 sm:px-8 overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-9">
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#52525B] font-semibold">
                        STORYTELLING TELEMETRY
                    </span>
                    <h2 className="mt-1.5 font-display text-3xl sm:text-[40px] leading-[1.06] tracking-[-0.03em] font-semibold text-[#111113]">
                        Every resume tells a <span className="font-editorial italic font-normal text-[#4F46E5]">story</span>
                    </h2>
                </div>

                {/* Parallax Asymmetric 2x2 Bento Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <div ref={leftColRef} className="lg:col-span-7 flex flex-col gap-4 will-change-transform">
                        {/* Top-Left Mini Fan */}
                        <div className="prepp-card p-6 flex flex-col justify-between min-h-[225px] group">
                            <div className="flex items-center justify-between">
                                <Link
                                    href="/login?callbackUrl=/resume-analyser"
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-black/[0.08] text-[11.5px] font-medium text-[#111113] shadow-xs hover:bg-[#111113] hover:text-white transition-colors"
                                >
                                    <Play className="h-3 w-3 fill-current" />
                                    <span>Run Demo</span>
                                </Link>
                                <span className="px-3 py-0.5 rounded-full bg-[#3B82F6] text-white font-mono text-[10.5px] -rotate-3">
                                    @gemini-ai
                                </span>
                            </div>

                            <div className="my-3 flex items-center justify-center">
                                <div className="relative flex items-center justify-center h-22 w-60">
                                    <div className="w-20 h-20 rounded-2xl bg-[#111113] text-white p-2.5 -rotate-12 -translate-x-9 shadow-md flex flex-col justify-between group-hover:-translate-x-11 group-hover:-rotate-15 transition-all duration-500">
                                        <span className="font-mono text-[8.5px] text-white/70">CV.PDF</span>
                                        <span className="font-display text-[11.5px] font-semibold">Parsed</span>
                                    </div>
                                    <div className="w-22 h-24 rounded-2xl bg-[#4F46E5] text-white p-2.5 z-10 shadow-xl flex flex-col justify-between group-hover:scale-105 transition-transform duration-500">
                                        <Sparkles className="h-3.5 w-3.5" />
                                        <span className="font-display text-[12.5px] font-semibold">84% Fit</span>
                                    </div>
                                    <div className="w-20 h-20 rounded-2xl bg-[#10B981] text-white p-2.5 rotate-12 translate-x-9 shadow-md flex flex-col justify-between group-hover:translate-x-11 group-hover:rotate-15 transition-all duration-500">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        <span className="font-display text-[11.5px] font-semibold">PMKVY</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                                <div>
                                    <h3 className="font-display text-[17px] font-semibold text-[#111113]">
                                        Connect, Benchmark, Bridge
                                    </h3>
                                    <p className="text-[12.5px] text-[#52525B]">
                                        Pair CVs with Qualification Packs or live job URLs in seconds.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Bottom-Left Clean Vector Telemetry Banner */}
                        <div className="relative prepp-card overflow-hidden min-h-[205px] p-6 flex flex-col justify-between group">
                            <img
                                src="/images/vec-learner.jpg"
                                alt="Candidate Skill Readiness Vector Illustration"
                                className="hidden sm:block absolute right-2 bottom-2 w-48 h-36 object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="relative z-10 max-w-xs space-y-1.5">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#EFECE6] text-[#111113] font-mono text-[10px] font-semibold">
                                    QP-NOS TELEMETRY
                                </span>
                                <h3 className="font-display text-[20px] font-semibold text-[#111113] leading-snug">
                                    Turn your resume into placement proof.
                                </h3>
                            </div>
                            <div className="relative z-10 pt-3">
                                <Link
                                    href="/login?callbackUrl=/dashboard"
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#111113] text-white text-[12px] font-medium hover:bg-[#27272A] transition-colors"
                                >
                                    <span>Open Dashboard</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div ref={rightColRef} className="lg:col-span-5 flex flex-col gap-4 will-change-transform">
                        {/* Top-Right Sage Highlight Card (Ref 3 Bento Aesthetic) */}
                        <div className="bento-sage-card relative overflow-hidden p-6 flex flex-col justify-between min-h-[215px] group">
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute -top-4 right-5 w-16 h-16 rounded-full bg-gradient-to-br from-[#FA9A78] to-[#DE6A45] opacity-90 shadow-md"
                            />
                            <div className="relative z-10 flex items-center justify-between">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white text-[#141913] font-mono text-[10.5px] font-semibold">
                                    #Placement
                                </span>
                                <Compass className="h-5 w-5 text-[#141913]/80" />
                            </div>
                            <div className="relative z-10 mt-10">
                                <h3 className="font-display text-[19px] font-semibold text-[#141913]">
                                    Where Skills Meet Hiring
                                </h3>
                                <p className="text-[12.5px] text-[#141913]/80 mt-0.5 leading-relaxed">
                                    Align with real sector demand through subsidized upskilling labs.
                                </p>
                            </div>
                        </div>

                        {/* Bottom-Right Obsidian Identity Passport */}
                        <div className="prepp-card p-6 flex flex-col justify-between min-h-[205px] group">
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-[10px] uppercase tracking-wider text-[#52525B]">
                                    CREDENTIAL PASSPORT
                                </span>
                                <Link
                                    href="/login?callbackUrl=/profile"
                                    aria-label="Open Skill Passport"
                                    className="h-8 w-8 rounded-full bg-white border border-black/[0.08] flex items-center justify-center text-[#111113] group-hover:bg-[#111113] group-hover:text-white transition-colors"
                                >
                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>

                            <div className="mt-3 rounded-2xl bg-[#141416] text-white p-4 text-center shadow-lg group-hover:-translate-y-1 transition-transform duration-300">
                                <ShieldCheck className="h-4.5 w-4.5 text-[#10B981] mx-auto mb-1.5" />
                                <div className="font-mono text-[9.5px] uppercase tracking-widest text-white/50">
                                    MONGODB PERSISTED
                                </div>
                                <div className="font-display text-[17px] font-semibold mt-0.5">
                                    Verified Identity
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Compact 4-Card Sector Benchmark Row (merged from Showcase) */}
                <div className="mt-8 pt-8 border-t border-black/[0.06]">
                    <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-[10.5px] uppercase tracking-wider text-[#52525B] font-semibold">
                            ACTIVE SECTOR BENCHMARKS
                        </span>
                        <Link href="/login?callbackUrl=/courses" className="text-[12.5px] font-medium text-[#4F46E5] hover:underline">
                            Explore all 97+ roles →
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {SECTOR_CHIPS.map((item, idx) => (
                            <RevealBlock key={item.code} delayMs={idx * 55}>
                                <Link
                                    href="/login?callbackUrl=/courses"
                                    className="group prepp-card-interactive p-5 flex flex-col justify-between block"
                                >
                                    <div>
                                        <div className="flex items-center justify-between gap-2">
                                            <span className={`h-10 w-10 rounded-full flex items-center justify-center font-display text-[14px] font-bold ${item.circle}`}>
                                                {item.mono}
                                            </span>
                                            <span className="rounded-lg border border-black/[0.07] bg-[#F7F8FA] px-2.5 py-0.5 font-mono text-[10.5px] font-medium text-[#52525B]">
                                                {item.code}
                                            </span>
                                        </div>

                                        <div className="mt-4">
                                            <h4 className="font-display text-[16.5px] font-semibold text-[#111113] group-hover:text-[#4F46E5] transition-colors">
                                                {item.title}
                                            </h4>
                                            <div className="mt-2.5 flex flex-wrap gap-1.5">
                                                <span className="bento-chip">{item.level}</span>
                                                <span className="bento-chip">Subsidized</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-5 pt-3.5 border-t border-[#F0F1F3] flex items-center justify-between">
                                        <span className="font-display text-[13.5px] font-bold text-[#111113]">
                                            {item.roles}
                                        </span>
                                        <span className="rounded-xl bg-[#111113] text-white px-3 py-1.5 text-[11.5px] font-medium inline-flex items-center gap-1">
                                            Explore <ArrowRight className="h-3 w-3" />
                                        </span>
                                    </div>
                                </Link>
                            </RevealBlock>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
