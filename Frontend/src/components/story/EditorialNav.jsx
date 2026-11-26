"use client";
// [FRONTEND] Floating Editorial Pill Navbar & Chapter Rail | Adapts theme polarity across Light & Dark scroll chapters

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { scrollToSection } from "@/components/story/scrollEngine";

const CHAPTERS = [
    { id: "chapter-hero", num: "01", label: "Overview" },
    { id: "chapter-journey", num: "02", label: "How It Works" },
    { id: "chapter-studio", num: "03", label: "Dual Engine" },
    { id: "chapter-sectors", num: "04", label: "Sectors" },
    { id: "chapter-close", num: "05", label: "Start" },
];

export function EditorialNav({
    isDarkSection = false,
    isDarkRail = false,
    activeChapter = 0,
    scrollPercent = 0,
}) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 24);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const lightGlassClass =
        "bg-white/85 backdrop-blur-xl border border-black/[0.09] shadow-[0_10px_28px_-10px_rgba(17,17,19,0.14)] text-[#111113]";
    const darkGlassClass =
        "bg-[#1A1112]/90 backdrop-blur-xl border border-white/[0.14] shadow-[0_14px_34px_-10px_rgba(0,0,0,0.65)] text-white";

    return (
        <>
            {/* Top Editorial Floating Header */}
            <header className="fixed top-0 inset-x-0 z-50 px-4 sm:px-8 pt-4 sm:pt-5 pointer-events-none">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    {/* Left Brand Mark */}
                    <Link
                        href="/"
                        className={`pointer-events-auto inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full transition-all duration-300 ${
                            scrolled
                                ? isDarkSection
                                    ? darkGlassClass
                                    : lightGlassClass
                                : "bg-white/75 backdrop-blur-md border border-black/[0.06] text-[#111113]"
                        }`}
                    >
                        <span
                            className={`h-6 w-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold transition-colors duration-300 ${
                                isDarkSection ? "bg-white text-[#120A0B]" : "bg-[#111113] text-white"
                            }`}
                        >
                            &lt;/&gt;
                        </span>
                        <span className="font-display text-[14px] font-semibold tracking-tight">
                            PMKVY<sup className="font-mono text-[9px] ml-0.5 text-[#4F46E5]">4.0</sup>
                        </span>
                    </Link>

                    {/* Center Frosted Floating Pill Navigation (Mindly / iPartyLabs style) */}
                    <nav
                        aria-label="Story Chapters"
                        className={`pointer-events-auto hidden md:flex items-center gap-1 p-1.5 rounded-full transition-all duration-300 ${
                            isDarkSection ? darkGlassClass : lightGlassClass
                        }`}
                    >
                        {CHAPTERS.slice(0, 4).map((ch, idx) => {
                            const isActive = activeChapter === idx;
                            return (
                                <button
                                    key={ch.id}
                                    type="button"
                                    onClick={() => scrollToSection(ch.id)}
                                    className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-medium transition-all duration-300 cursor-pointer ${
                                        isActive
                                            ? isDarkSection
                                                ? "bg-white text-[#120A0B] shadow-xs"
                                                : "bg-[#111113] text-white shadow-xs"
                                            : isDarkSection
                                                ? "text-white/80 hover:text-white hover:bg-white/10"
                                                : "text-[#3F3F46] hover:text-[#111113] hover:bg-black/[0.05]"
                                    }`}
                                >
                                    {ch.label}
                                </button>
                            );
                        })}
                        <span
                            className={`mx-1 h-3.5 w-px ${isDarkSection ? "bg-white/20" : "bg-black/10"}`}
                        />
                        <Link
                            href="/login?callbackUrl=/resume-analyser"
                            className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-medium transition-colors ${
                                isDarkSection
                                    ? "text-amber-200 hover:bg-white/10"
                                    : "text-[#4F46E5] hover:bg-[#4F46E5]/[0.08]"
                            }`}
                        >
                            AI Matcher
                        </Link>
                    </nav>

                    {/* Right Obsidian Action Capsule */}
                    <div
                        className={`pointer-events-auto flex items-center gap-1 p-1 rounded-full transition-all duration-300 ${
                            isDarkSection ? darkGlassClass : lightGlassClass
                        }`}
                    >
                        <Link
                            href="/login"
                            className={`hidden sm:inline-flex items-center px-3.5 py-1.5 rounded-full text-[12.5px] font-medium transition-colors ${
                                isDarkSection
                                    ? "text-white/90 hover:text-white hover:bg-white/10"
                                    : "text-[#3F3F46] hover:text-[#111113] hover:bg-black/[0.05]"
                            }`}
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/login?callbackUrl=/resume-analyser"
                            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12.5px] font-medium transition-colors ${
                                isDarkSection
                                    ? "bg-[#9E331A] hover:bg-[#B83D20] text-white"
                                    : "bg-[#111113] hover:bg-[#27272A] text-white"
                            }`}
                        >
                            <span>Get Started</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                </div>
            </header>

            {/* Delicate Right-Edge Chapter Index Rail (Desktop) */}
            <aside
                aria-label="Scroll Chapter Indicator"
                className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-end gap-3 pointer-events-auto"
            >
                <div
                    className={`font-mono text-[10px] tracking-widest uppercase transition-colors duration-300 ${
                        isDarkRail ? "text-white/55" : "text-[#71717A]"
                    }`}
                >
                    {CHAPTERS[activeChapter]?.num || "01"} / 05
                </div>

                {/* Hairline vertical scrub track */}
                <div
                    className={`relative w-[2px] h-28 rounded-full overflow-hidden transition-colors duration-300 ${
                        isDarkRail ? "bg-white/15" : "bg-black/10"
                    }`}
                >
                    <div
                        className={`w-full rounded-full transition-colors duration-300 ${
                            isDarkRail ? "bg-[#E07A5F]" : "bg-[#111113]"
                        }`}
                        style={{
                            height: "100%",
                            transformOrigin: "top center",
                            transform: `scaleY(${Math.max(0.08, Math.min(1, scrollPercent))})`,
                        }}
                    />
                </div>

                <div className="flex flex-col items-end gap-1.5 mt-1">
                    {CHAPTERS.map((ch, idx) => (
                        <button
                            key={ch.id}
                            type="button"
                            onClick={() => scrollToSection(ch.id)}
                            title={ch.label}
                            className="group flex items-center gap-2 py-0.5 cursor-pointer"
                        >
                            <span
                                className={`font-mono text-[9.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                                    isDarkRail ? "text-white/85" : "text-[#111113]"
                                }`}
                            >
                                {ch.label}
                            </span>
                            <span
                                className={`block rounded-full transition-all duration-300 ${
                                    activeChapter === idx
                                        ? isDarkRail
                                            ? "w-4 h-1.5 bg-white"
                                            : "w-4 h-1.5 bg-[#111113]"
                                        : isDarkRail
                                            ? "w-1.5 h-1.5 bg-white/30 group-hover:bg-white/70"
                                            : "w-1.5 h-1.5 bg-black/20 group-hover:bg-black/60"
                                }`}
                            />
                        </button>
                    ))}
                </div>
            </aside>
        </>
    );
}
