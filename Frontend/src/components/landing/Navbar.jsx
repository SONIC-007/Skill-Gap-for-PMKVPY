"use client";
// [FRONTEND] Section 1: Minimal Sticky Navigation Bar (Video Ref 00:01) | Reusable Landing Navbar
import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, User, ArrowUpRight } from "lucide-react";
import { scrollToSection } from "@/components/story/scrollEngine";

const NAV_LINKS = [
    { label: "Start Audit", href: "/login?callbackUrl=/resume-analyser", dot: true },
    { label: "Process", sectionId: "section-how-it-works" },
    { label: "Sectors", sectionId: "section-features" },
    { label: "Tracks", sectionId: "section-pricing" },
    { label: "Dashboard", href: "/login?callbackUrl=/dashboard" },
];

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [scrollRatio, setScrollRatio] = useState(0);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 18);
            const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
            setScrollRatio(Math.min(1, Math.max(0, window.scrollY / max)));
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${
                scrolled
                    ? "bg-white/90 backdrop-blur-xl border-b border-black/[0.06] shadow-[0_6px_24px_-12px_rgba(17,17,19,0.08)]"
                    : "bg-[#FFFFFF]/80 backdrop-blur-sm border-b border-transparent"
            }`}
        >
            {/* Subtle top scroll progress bar */}
            <div
                aria-hidden="true"
                className="absolute top-0 left-0 h-[2px] bg-[#111113] transition-[transform] duration-75 origin-left"
                style={{ width: "100%", transform: `scaleX(${scrollRatio})` }}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-8 h-14 flex items-center justify-between gap-4">
                {/* Left Brand Mark (Twin Overlapping Circles Signature) */}
                <Link href="/" className="flex items-center gap-2.5 group focus:outline-none">
                    <span className="relative flex items-center justify-center w-7 h-7">
                        <span className="w-4 h-4 rounded-full bg-[#38BDF8] opacity-90 -mr-1.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
                        <span className="w-4 h-4 rounded-full bg-[#4F46E5] opacity-90 mix-blend-multiply transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                    <span className="font-display text-[15px] font-semibold tracking-tight text-[#111113]">
                        PMKVY Skill Gap
                    </span>
                </Link>

                {/* Center Navigation Links */}
                <nav aria-label="Landing Navigation" className="hidden md:flex items-center gap-6">
                    {NAV_LINKS.map((item) =>
                        item.sectionId ? (
                            <button
                                key={item.label}
                                type="button"
                                onClick={() => scrollToSection(item.sectionId)}
                                className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#52525B] hover:text-[#111113] transition-colors cursor-pointer"
                            >
                                <span>{item.label}</span>
                            </button>
                        ) : (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#52525B] hover:text-[#111113] transition-colors"
                            >
                                {item.dot && <span className="h-1.5 w-1.5 rounded-full bg-[#111113]" />}
                                <span>{item.label}</span>
                            </Link>
                        )
                    )}
                </nav>

                {/* Right: Sign In Icon Circle & Primary CTA Pill */}
                <div className="flex items-center gap-2.5">
                    <Link
                        href="/login"
                        aria-label="Sign In"
                        title="Sign In"
                        className="hidden sm:inline-flex items-center justify-center h-9 w-9 rounded-full border border-black/[0.1] bg-white hover:bg-[#F4F4F5] text-[#111113] transition-colors"
                    >
                        <User className="h-4 w-4" />
                    </Link>

                    <Link
                        href="/login?callbackUrl=/resume-analyser"
                        className="hidden sm:inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-[#111113] hover:bg-[#27272A] text-white text-[13px] font-medium transition-all"
                    >
                        <span>Start Free Audit</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>

                    <button
                        type="button"
                        aria-label="Toggle Menu"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-full border border-black/[0.1] bg-white text-[#111113] cursor-pointer"
                    >
                        {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer */}
            {mobileOpen && (
                <div className="md:hidden border-t border-black/[0.06] bg-white px-4 py-4 space-y-2 animate-fade-in">
                    {NAV_LINKS.map((item) =>
                        item.sectionId ? (
                            <button
                                key={item.label}
                                type="button"
                                onClick={() => {
                                    setMobileOpen(false);
                                    scrollToSection(item.sectionId);
                                }}
                                className="block w-full text-left px-3 py-2 rounded-xl text-[14px] font-medium text-[#111113] hover:bg-[#F4F4F5]"
                            >
                                {item.label}
                            </button>
                        ) : (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className="block px-3 py-2 rounded-xl text-[14px] font-medium text-[#111113] hover:bg-[#F4F4F5]"
                            >
                                {item.label}
                            </Link>
                        )
                    )}
                    <div className="pt-2 border-t border-black/[0.06] flex items-center gap-2">
                        <Link
                            href="/login"
                            className="flex-1 text-center py-2.5 rounded-full border border-black/[0.1] text-[13px] font-medium text-[#111113]"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/login?callbackUrl=/resume-analyser"
                            className="flex-1 text-center py-2.5 rounded-full bg-[#111113] text-white text-[13px] font-medium"
                        >
                            Start Audit
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
