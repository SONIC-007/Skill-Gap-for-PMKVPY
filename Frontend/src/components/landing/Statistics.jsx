"use client";
// [FRONTEND] Section 4: Compact Trust Wordmarks & Viewport Counter Strip (Video Ref 00:10-00:12)
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatedCounter, RevealBlock, RevealLine } from "@/components/story/scrollEngine";

const COUNCIL_LOGOS = [
    "Skill India Digital",
    "NSDC Registry",
    "IT-ITeS SSC",
    "NASSCOM AI",
    "ASDC Automotive",
    "ESSCI Electronics",
    "SCGJ Green Energy",
];

const METRICS = [
    { value: 97, suffix: "+", label: "Official QP-NOS Roles" },
    { value: 8, suffix: "", label: "Sector Skill Councils" },
    { value: 100, suffix: "%", label: "Govt Subsidized Tracks" },
    { value: 30, suffix: "s", label: "Gemini AI Gap Synthesis" },
];

export function Statistics() {
    const [activeSlide, setActiveSlide] = useState(0);

    return (
        <section className="bg-[#FAFAFB] border-t border-black/[0.06] py-10 sm:py-12 px-4 sm:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                    <div>
                        <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-[#111113]">
                            <RevealLine delayMs={40}>Trusted by</RevealLine>{" "}
                            <RevealLine delayMs={110}>
                                <span className="text-[#71717A] font-normal">national standards.</span>
                            </RevealLine>
                        </h2>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            aria-label="Scroll councils left"
                            onClick={() => setActiveSlide((prev) => (prev === 0 ? 1 : 0))}
                            className="h-8 w-8 rounded-full border border-black/[0.1] bg-white hover:bg-[#111113] hover:text-white flex items-center justify-center text-[#111113] cursor-pointer transition-colors"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            aria-label="Scroll councils right"
                            onClick={() => setActiveSlide((prev) => (prev === 1 ? 0 : 1))}
                            className="h-8 w-8 rounded-full border border-black/[0.1] bg-white hover:bg-[#111113] hover:text-white flex items-center justify-center text-[#111113] cursor-pointer transition-colors"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Animated Wordmark Row */}
                <div
                    key={activeSlide}
                    className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-4 border-y border-black/[0.06] animate-[storyStageIn_350ms_cubic-bezier(0.22,1,0.36,1)]"
                >
                    {COUNCIL_LOGOS.slice(activeSlide * 2, activeSlide * 2 + 5).map((name) => (
                        <span
                            key={name}
                            className="font-display text-[15px] sm:text-[17px] font-semibold tracking-tight text-[#71717A] hover:text-[#111113] transition-colors select-none"
                        >
                            {name}
                        </span>
                    ))}
                </div>

                {/* Tight 4-Stat Counters */}
                <div className="mt-7 grid grid-cols-2 lg:grid-cols-4 gap-5">
                    {METRICS.map((m, idx) => (
                        <RevealBlock key={m.label} delayMs={idx * 60} className="space-y-0.5">
                            <div className="font-display text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-[#111113] font-mono">
                                <AnimatedCounter value={m.value} suffix={m.suffix} />
                            </div>
                            <div className="text-[12.5px] text-[#52525B]">{m.label}</div>
                        </RevealBlock>
                    ))}
                </div>
            </div>
        </section>
    );
}
