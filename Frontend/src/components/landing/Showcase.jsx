"use client";
// [FRONTEND] Section 7: Readiness Marketplace Cards & Floating Centerpiece Mosaic (Video Ref 00:28-00:34)
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Heart, Sparkles } from "lucide-react";
import { RevealBlock } from "@/components/story/scrollEngine";

const PRISM_SHOWCASE = [
    { title: "Full Stack Web Matrix", code: "SSC/Q0508", roles: "18 Tracks", accent: "from-zinc-900 to-zinc-800", pill: "bg-indigo-500" },
    { title: "AI & Data Pipeline", code: "SSC/Q8101", roles: "12 Tracks", accent: "from-[#1D2BF5] to-[#6366F1]", pill: "bg-emerald-500" },
    { title: "EV & Battery Systems", code: "ASC/Q1402", roles: "9 Tracks", accent: "from-[#9E331A] to-[#F36538]", pill: "bg-amber-400" },
    { title: "Cloud & Zero Trust", code: "SSC/Q0901", roles: "14 Tracks", accent: "from-[#065F46] to-[#10B981]", pill: "bg-white text-[#111113]" },
];

const MOSAIC_LEFT = [
    { title: "Cloud Infra", bg: "bg-[#EFECE6]" },
    { title: "Embedded C", bg: "bg-[#EEF0FF]" },
    { title: "React / TS", bg: "bg-[#ECFDF5]" },
    { title: "Docker Ops", bg: "bg-[#FFFBEB]" },
];

const MOSAIC_RIGHT = [
    { title: "EV BMS", bg: "bg-[#FFF7ED]" },
    { title: "Solar PV", bg: "bg-[#EFECE6]" },
    { title: "PyTorch AI", bg: "bg-[#EEF0FF]" },
    { title: "Cyber SOC", bg: "bg-[#F4F4F5]" },
];

export function Showcase() {
    const [offset, setOffset] = useState(0);
    const [liked, setLiked] = useState(false);

    return (
        <section className="bg-white border-t border-black/[0.06]">
            {/* Part A: Readiness Marketplace Carousel (Video 00:28-00:30) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-20 sm:py-24">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                    <div>
                        <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#52525B] font-semibold">
                            GET CLOSER TO READINESS
                        </span>
                        <h2 className="mt-1.5 font-display text-3xl sm:text-[40px] leading-[1.08] tracking-[-0.03em] font-semibold text-[#111113]">
                            Registry for
                            <br />
                            real placements.
                        </h2>
                        <p className="mt-2 text-[13.5px] text-[#52525B] max-w-md">
                            Explore industry-calibrated PMKVY tracks curated directly around Sector Skill Council benchmarks.
                        </p>
                    </div>

                    <Link
                        href="/login?callbackUrl=/skill-gap"
                        className="self-start sm:self-end inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#A855F7] hover:bg-[#9333EA] text-white text-[12.5px] font-medium transition-colors"
                    >
                        <span>View Matrix</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>

                {/* 4-Card Visual Track Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {PRISM_SHOWCASE.map((item, idx) => (
                        <Link
                            key={item.code}
                            href="/login?callbackUrl=/courses"
                            className={`group rounded-2xl border border-black/[0.08] overflow-hidden bg-white hover:-translate-y-1.5 transition-all duration-300 shadow-xs hover:shadow-xl ${
                                offset % 2 === 1 && idx === 0 ? "lg:opacity-90" : ""
                            }`}
                        >
                            <div className={`h-44 p-5 flex flex-col justify-between bg-gradient-to-br text-white ${item.accent}`}>
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-[10px] uppercase tracking-wider bg-black/25 px-2.5 py-0.5 rounded-full">
                                        {item.code}
                                    </span>
                                    <Sparkles className="h-4 w-4 opacity-80 group-hover:scale-110 transition-transform" />
                                </div>
                                <div className="font-mono text-[12px] opacity-85">{item.roles}</div>
                            </div>
                            <div className="p-4 flex items-center justify-between">
                                <span className="font-display text-[14.5px] font-semibold text-[#111113] group-hover:text-[#4F46E5] transition-colors">
                                    {item.title}
                                </span>
                                <ArrowRight className="h-3.5 w-3.5 text-[#52525B] group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-6 flex items-center gap-2">
                    <button
                        type="button"
                        aria-label="Previous showcase"
                        onClick={() => setOffset((p) => p + 1)}
                        className="h-8 w-8 rounded-full border border-black/[0.1] bg-white hover:bg-[#F4F4F5] flex items-center justify-center text-[#111113] cursor-pointer"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        aria-label="Next showcase"
                        onClick={() => setOffset((p) => p + 1)}
                        className="h-8 w-8 rounded-full border border-black/[0.1] bg-white hover:bg-[#F4F4F5] flex items-center justify-center text-[#111113] cursor-pointer"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Part B: Centered Hero Spotlight Over Floating Mosaic Grid (Video 00:32-00:34) */}
            <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-20 sm:pb-28">
                <RevealBlock className="relative rounded-[32px] bg-[#FAFAFB] border border-black/[0.06] py-12 px-4 sm:px-10 overflow-hidden">
                    <div className="grid grid-cols-2 lg:grid-cols-12 gap-4 items-center">
                        {/* Left Ambient Sector Squares */}
                        <div className="hidden lg:grid lg:col-span-4 grid-cols-2 gap-3 opacity-80">
                            {MOSAIC_LEFT.map((m) => (
                                <div
                                    key={m.title}
                                    className={`h-28 rounded-2xl p-3 flex items-end border border-black/[0.06] ${m.bg}`}
                                >
                                    <span className="font-mono text-[11px] font-semibold text-[#111113]">{m.title}</span>
                                </div>
                            ))}
                        </div>

                        {/* Center Hero Card */}
                        <div className="col-span-2 lg:col-span-4 flex justify-center">
                            <div className="relative w-full max-w-[290px] rounded-[26px] bg-[#F36538] text-white overflow-hidden shadow-[0_28px_64px_-20px_rgba(243,101,56,0.5)] group">
                                <img
                                    src="/images/coral-spotlight.jpg"
                                    alt="Verified Candidate Spotlight"
                                    className="w-full h-72 object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                />

                                <div className="p-4 bg-gradient-to-t from-black/80 via-black/45 to-transparent absolute inset-x-0 bottom-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="px-2.5 py-0.5 rounded-full bg-[#3B82F6] text-white font-mono text-[10.5px]">
                                            @nsqf-ready
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setLiked(!liked)}
                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-[#111113] font-mono text-[10.5px] font-semibold cursor-pointer"
                                        >
                                            <Heart className={`h-3 w-3 ${liked ? "fill-[#EF4444] text-[#EF4444]" : ""}`} />
                                            <span>{liked ? "95%" : "94%"}</span>
                                        </button>
                                    </div>
                                    <div className="font-display text-[15px] font-semibold text-white">
                                        Arun Kumar • SSC/Q0508
                                    </div>
                                    <div className="font-mono text-[11px] text-white/75">
                                        Full Stack &amp; Cloud Certified
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Ambient Sector Squares */}
                        <div className="hidden lg:grid lg:col-span-4 grid-cols-2 gap-3 opacity-80">
                            {MOSAIC_RIGHT.map((m) => (
                                <div
                                    key={m.title}
                                    className={`h-28 rounded-2xl p-3 flex items-end border border-black/[0.06] ${m.bg}`}
                                >
                                    <span className="font-mono text-[11px] font-semibold text-[#111113]">{m.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </RevealBlock>
            </div>
        </section>
    );
}
