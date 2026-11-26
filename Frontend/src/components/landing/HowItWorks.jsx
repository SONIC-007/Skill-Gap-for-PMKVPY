"use client";
// [FRONTEND] Section 5: Compact How It Works with Staggered Tab Reveal Animations (Video Ref 00:18-00:20)
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, ClipboardCheck, Compass, FileText, Link2, Sparkles, Target } from "lucide-react";
import { RevealBlock, RevealLine } from "@/components/story/scrollEngine";

const TAB_DATA = {
    role: {
        label: "QP-NOS Roles",
        cards: [
            { step: "01", title: "Upload Resume PDF", metric: "Extract Projects", bg: "bg-[#EFECE6] text-[#111113]", icon: FileText },
            { step: "02", title: "Select SSC Role", metric: "SSC/Q0508 • L6", bg: "bg-[#10B981] text-white", icon: Target },
            { step: "03", title: "Gemini Synthesis", metric: "Weighted Score", bg: "bg-[#141416] text-white", icon: Sparkles },
            { step: "04", title: "Timed MCQ Arena", metric: "Practical Check", bg: "bg-[#EEF0FF] text-[#111113]", icon: ClipboardCheck },
            { step: "05", title: "Unlock Free Bridges", metric: "₹0 Govt Fee", bg: "bg-[#F36538] text-white", icon: BookOpen },
            { step: "06", title: "Sync Skill Passport", metric: "MongoDB Saved", bg: "bg-[#3B82F6] text-white", icon: CheckCircle2 },
        ],
    },
    link: {
        label: "Live Job Link",
        cards: [
            { step: "01", title: "Paste Job URL", metric: "LinkedIn / Portal", bg: "bg-[#1D4ED8] text-white", icon: Link2 },
            { step: "02", title: "Parse Tech Stack", metric: "AI JD Reader", bg: "bg-[#EFECE6] text-[#111113]", icon: Sparkles },
            { step: "03", title: "Compute Fit Delta", metric: "Instant % Score", bg: "bg-[#141416] text-white", icon: Target },
            { step: "04", title: "Isolate Gaps", metric: "Critical Deficits", bg: "bg-[#FFF7ED] text-[#9E331A]", icon: Compass },
            { step: "05", title: "Map PMKVY Labs", metric: "NSDC Centers", bg: "bg-[#10B981] text-white", icon: BookOpen },
            { step: "06", title: "Track Career Path", metric: "Interview Ready", bg: "bg-[#EEF0FF] text-[#111113]", icon: CheckCircle2 },
        ],
    },
};

const ORBIT_ICONS = [FileText, Target, Link2, Sparkles, BookOpen, Compass];

export function HowItWorks() {
    const [activeTab, setActiveTab] = useState("role");
    const current = TAB_DATA[activeTab];

    return (
        <section id="section-how-it-works" className="bg-white py-12 sm:py-16 px-4 sm:px-8 border-t border-black/[0.06]">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                {/* Left Copy & Animated Icon Stamps */}
                <div className="lg:col-span-5 space-y-5">
                    <RevealBlock delayMs={30}>
                        <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#52525B] font-semibold">
                            HOW IT WORKS
                        </span>
                    </RevealBlock>

                    <h2 className="font-display text-3xl sm:text-[38px] leading-[1.06] tracking-[-0.03em] font-semibold text-[#111113]">
                        <RevealLine delayMs={50}>Six steps to</RevealLine>{" "}
                        <RevealLine delayMs={130}>
                            <span className="text-[#52525B] font-normal">verified readiness.</span>
                        </RevealLine>
                    </h2>

                    <RevealBlock delayMs={180}>
                        <p className="text-[14px] text-[#52525B] leading-relaxed max-w-md">
                            Switch seamlessly between curated National Occupational Standards and live job descriptions inside one clean workspace.
                        </p>
                    </RevealBlock>

                    <RevealBlock delayMs={230}>
                        <Link
                            href="/login?callbackUrl=/assessment"
                            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#111113] hover:text-[#4F46E5] transition-colors"
                        >
                            <span>Try Assessment Arena</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </RevealBlock>

                    <div className="pt-2 flex flex-wrap gap-2.5">
                        {ORBIT_ICONS.map((Icon, i) => (
                            <div
                                key={i}
                                className="h-10 w-10 rounded-xl border border-black/[0.1] bg-[#FAFAFB] flex items-center justify-center text-[#111113] hover:bg-[#111113] hover:text-white hover:-translate-y-1 hover:rotate-6 transition-all duration-300 shadow-xs"
                            >
                                <Icon className="h-4 w-4" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Folder Container with Staggered Animated Grid on Tab Switch */}
                <div className="lg:col-span-7">
                    <div className="rounded-[24px] bg-[#F4F4F5] p-3 border border-black/[0.06]">
                        <div className="flex flex-wrap items-center justify-between gap-2 px-1.5 pb-2.5">
                            <div className="inline-flex items-center gap-1 bg-white p-1 rounded-full border border-black/[0.08]">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("role")}
                                    className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all cursor-pointer ${
                                        activeTab === "role"
                                            ? "bg-[#111113] text-white"
                                            : "text-[#52525B] hover:text-[#111113]"
                                    }`}
                                >
                                    By Job Role (QP-NOS)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("link")}
                                    className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all cursor-pointer ${
                                        activeTab === "link"
                                            ? "bg-[#111113] text-white"
                                            : "text-[#52525B] hover:text-[#111113]"
                                    }`}
                                >
                                    By Job Link / JD
                                </button>
                            </div>

                            <Link
                                href="/login?callbackUrl=/resume-analyser"
                                className="font-mono text-[11px] font-semibold text-[#111113] hover:underline px-2"
                            >
                                + Open Workspace
                            </Link>
                        </div>

                        <div className="rounded-[20px] bg-[#141416] p-4">
                            <div className="flex items-center justify-between text-white/60 font-mono text-[10.5px] mb-3 px-1">
                                <span>WORKFLOW // {current.label.toUpperCase()}</span>
                                <span>6 STAGES</span>
                            </div>

                            <div key={activeTab} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                                {current.cards.map((item, idx) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={`${activeTab}-${item.step}`}
                                            href="/login?callbackUrl=/resume-analyser"
                                            className={`group rounded-2xl p-3.5 min-h-[110px] flex flex-col justify-between border hover:-translate-y-1 transition-all duration-300 animate-[bentoCardIn_420ms_cubic-bezier(0.22,1,0.36,1)_both] ${item.bg}`}
                                            style={{ animationDelay: `${idx * 45}ms` }}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-mono text-[10px] font-bold opacity-75">
                                                    STEP {item.step}
                                                </span>
                                                <Icon className="h-3.5 w-3.5 opacity-80 group-hover:scale-110 transition-transform" />
                                            </div>
                                            <div>
                                                <div className="font-display text-[14px] font-semibold leading-snug">
                                                    {item.title}
                                                </div>
                                                <div className="font-mono text-[10px] opacity-75 mt-0.5">
                                                    {item.metric}
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
