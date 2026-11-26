"use client";
// [FRONTEND] Chapter I — Editorial Orbital Hero | Inspired by Mindly + iPartyLabs references
// Pure React + rAF GPU-damped parallax transforms (no external animation library).

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Play, Sparkles, Target, Compass, Layers, ArrowDown } from "lucide-react";
import { RevealLine, RevealBlock, clamp01, scrollToSection } from "@/components/story/scrollEngine";

export function EditorialHero() {
    const heroRef = useRef(null);
    const portraitRef = useRef(null);
    const ringRef = useRef(null);
    const leftCardRef = useRef(null);
    const rightCardRef = useRef(null);
    const tile1Ref = useRef(null);
    const tile2Ref = useRef(null);
    const tile3Ref = useRef(null);
    const sealRef = useRef(null);

    useEffect(() => {
        const reduced =
            typeof window !== "undefined" &&
            window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduced) return;

        let current = 0;
        let target = 0;
        let rafId = null;

        const updateDOM = (p) => {
            if (portraitRef.current) {
                const s = 1 + p * 0.08;
                const y = p * -38;
                portraitRef.current.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(${s.toFixed(4)})`;
            }
            if (ringRef.current) {
                ringRef.current.style.transform = `translate3d(0, ${(p * -22).toFixed(2)}px, 0) scale(${(1 + p * 0.12).toFixed(4)})`;
                ringRef.current.style.opacity = `${Math.max(0.15, 1 - p * 0.85)}`;
            }
            if (leftCardRef.current) {
                leftCardRef.current.style.transform = `translate3d(${(p * -64).toFixed(2)}px, ${(p * -28).toFixed(2)}px, 0) rotate(${(-5 - p * 4).toFixed(2)}deg)`;
                leftCardRef.current.style.opacity = `${Math.max(0, 1 - p * 1.15)}`;
            }
            if (rightCardRef.current) {
                rightCardRef.current.style.transform = `translate3d(${(p * 64).toFixed(2)}px, ${(p * -24).toFixed(2)}px, 0) rotate(${(5 + p * 4).toFixed(2)}deg)`;
                rightCardRef.current.style.opacity = `${Math.max(0, 1 - p * 1.15)}`;
            }
            if (tile1Ref.current) {
                tile1Ref.current.style.transform = `translate3d(${(p * -45).toFixed(2)}px, ${(p * -18).toFixed(2)}px, 0) rotate(${(-6 - p * 5).toFixed(2)}deg)`;
            }
            if (tile2Ref.current) {
                tile2Ref.current.style.transform = `translate3d(${(p * 34).toFixed(2)}px, ${(p * -34).toFixed(2)}px, 0) rotate(${(4 + p * 5).toFixed(2)}deg)`;
            }
            if (tile3Ref.current) {
                tile3Ref.current.style.transform = `translate3d(${(p * -24).toFixed(2)}px, ${(p * 20).toFixed(2)}px, 0) rotate(${(-3 - p * 4).toFixed(2)}deg)`;
            }
            if (sealRef.current) {
                sealRef.current.style.transform = `rotate(${(p * 140).toFixed(1)}deg)`;
            }
        };

        const tick = () => {
            const diff = target - current;
            if (Math.abs(diff) < 0.0006) {
                current = target;
                updateDOM(current);
                rafId = null;
                return;
            }
            current += diff * 0.1;
            updateDOM(current);
            rafId = window.requestAnimationFrame(tick);
        };

        const onScroll = () => {
            const vh = window.innerHeight || 850;
            target = clamp01(window.scrollY / (vh * 0.95));
            if (!rafId) rafId = window.requestAnimationFrame(tick);
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            if (rafId) window.cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <section
            id="chapter-hero"
            ref={heroRef}
            className="relative min-h-screen w-full bg-[#FBFBF9] pt-20 sm:pt-24 pb-6 px-4 sm:px-8 flex flex-col justify-between overflow-hidden"
        >
            {/* Subtle studio ambient vignette */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_68%_55%_at_50%_40%,rgba(79,70,229,0.035),transparent_72%)]"
            />

            {/* Top Centered Editorial Title Block */}
            <div className="relative z-20 max-w-4xl mx-auto text-center">
                {/* Rotating Circular Typography Seal (Desktop Top-Right, Mindly Reference) */}
                <div
                    ref={sealRef}
                    className="hidden lg:flex items-center justify-center absolute -right-24 top-2 w-24 h-24 select-none pointer-events-none"
                >
                    <svg viewBox="0 0 120 120" className="w-full h-full animate-spin-slow text-[#111113]/65">
                        <defs>
                            <path
                                id="nsqf-seal-path"
                                d="M 60, 60 m -44, 0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0"
                            />
                        </defs>
                        <text className="font-mono text-[8.3px] uppercase tracking-[0.23em] fill-current">
                            <textPath href="#nsqf-seal-path">
                                • PMKVY 4.0 • VERIFIED NSQF ENGINE • GEMINI AI •
                            </textPath>
                        </text>
                    </svg>
                    <Sparkles className="absolute h-4 w-4 text-[#111113]" />
                </div>

                {/* Announcing Kicker Pill (iPartyLabs style) */}
                <RevealBlock delayMs={40} yOffset={12}>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-black/[0.08] shadow-[0_4px_16px_-4px_rgba(17,17,19,0.06)] mb-3.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                        <span className="font-mono text-[10.5px] tracking-wider uppercase text-[#52525B]">
                            QP-NOS Diagnostics &amp; Live Job Link Matcher
                        </span>
                    </div>
                </RevealBlock>

                {/* Kinetic Staggered Masked Editorial Headline */}
                <h1 className="font-display text-[40px] sm:text-[56px] lg:text-[64px] leading-[1.03] tracking-[-0.04em] text-[#111113] font-semibold">
                    <span className="block">
                        <RevealLine delayMs={90}>National skill clarity</RevealLine>
                    </span>
                    <span className="block mt-0.5">
                        <RevealLine delayMs={210}>
                            <span className="font-editorial italic font-normal text-[44px] sm:text-[60px] lg:text-[68px] tracking-[-0.02em]">
                                for an ambitious career.
                            </span>
                        </RevealLine>
                    </span>
                </h1>

                <RevealBlock delayMs={320} yOffset={14}>
                    <p className="mt-3.5 text-[14.5px] sm:text-[16px] text-[#52525B] max-w-xl mx-auto leading-relaxed font-normal">
                        Step inside a calm, calibrated workspace that reads your resume, intersects it with official QP-NOS roles or any live job description, and unlocks subsidized PMKVY 4.0 bridges.
                    </p>
                </RevealBlock>

                {/* Obsidian Pill CTA Pair */}
                <RevealBlock delayMs={410} yOffset={14}>
                    <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link
                            href="/login?callbackUrl=/resume-analyser"
                            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#111113] hover:bg-[#27272A] text-white text-[13.5px] font-medium shadow-[0_12px_28px_-8px_rgba(17,17,19,0.35)] transition-all duration-300"
                        >
                            <span>Sign In &amp; Start Audit</span>
                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </Link>

                        <button
                            type="button"
                            onClick={() => scrollToSection("chapter-journey")}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-[#F4F4F5] text-[#111113] border border-black/[0.1] text-[13.5px] font-medium transition-all duration-300 cursor-pointer"
                        >
                            <Play className="h-3.5 w-3.5 fill-current" />
                            <span>See how it transforms</span>
                        </button>
                    </div>
                </RevealBlock>
            </div>

            {/* Middle Orbital Stage: Central Silver-Gelatin Portrait + SVG Connectors + Floating Glass Tiles */}
            <div className="relative z-10 max-w-6xl mx-auto w-full mt-4 sm:mt-5 flex items-center justify-center min-h-[290px] sm:min-h-[345px]">
                {/* Curved Orbital Hairline Connectors (SVG like Mindly reference) */}
                <svg
                    viewBox="0 0 1100 360"
                    fill="none"
                    aria-hidden="true"
                    className="hidden md:block absolute inset-0 w-full h-full pointer-events-none"
                >
                    <path
                        d="M 155 80 C 225 180, 330 200, 435 190"
                        stroke="rgba(17,17,19,0.12)"
                        strokeWidth="1.15"
                    />
                    <path
                        d="M 945 95 C 865 200, 760 215, 665 195"
                        stroke="rgba(17,17,19,0.12)"
                        strokeWidth="1.15"
                    />
                    <ellipse
                        cx="550"
                        cy="205"
                        rx="235"
                        ry="105"
                        stroke="rgba(79,70,229,0.13)"
                        strokeWidth="1"
                        strokeDasharray="4 6"
                    />
                </svg>

                {/* Far Left Tilted Editorial Note Card */}
                <div
                    ref={leftCardRef}
                    className="hidden md:block absolute left-2 lg:left-8 top-2 w-52 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-black/[0.08] shadow-[0_20px_48px_-16px_rgba(17,17,19,0.12)] -rotate-[5deg] will-change-transform"
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="h-6 w-6 rounded-lg bg-[#EAEDFF] text-[#4F46E5] flex items-center justify-center">
                            <Layers className="h-3.5 w-3.5" />
                        </span>
                        <span className="font-mono text-[10px] text-[#71717A]">01 // UPLOAD</span>
                    </div>
                    <p className="font-display text-[13px] font-semibold text-[#111113] leading-snug">
                        Turn raw PDFs into calibrated standards.
                    </p>
                    <p className="mt-1 text-[11px] text-[#6B6B73] leading-relaxed">
                        Extract experience automatically with zero manual forms.
                    </p>
                </div>

                {/* Far Right Tilted Editorial Note Card */}
                <div
                    ref={rightCardRef}
                    className="hidden md:block absolute right-2 lg:right-8 top-6 w-56 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-black/[0.08] shadow-[0_20px_48px_-16px_rgba(17,17,19,0.12)] rotate-[5deg] will-change-transform"
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex -space-x-1.5">
                            <span className="h-5 w-5 rounded-full bg-[#4F46E5] text-white text-[9px] font-mono flex items-center justify-center ring-2 ring-white">
                                AI
                            </span>
                            <span className="h-5 w-5 rounded-full bg-[#10B981] text-white text-[9px] font-mono flex items-center justify-center ring-2 ring-white">
                                N
                            </span>
                        </div>
                        <span className="font-mono text-[10px] text-[#065F46] bg-[#ECFDF5] px-2 py-0.5 rounded-full">
                            DUAL MODE
                        </span>
                    </div>
                    <p className="font-display text-[13px] font-semibold text-[#111113] leading-snug">
                        Job Roles or live URLs, anytime.
                    </p>
                    <p className="mt-1 text-[11px] text-[#6B6B73] leading-relaxed">
                        Compare against 97+ QP-NOS packs or any real hiring post.
                    </p>
                </div>

                {/* Subtle Orbital Glow Ring Behind Portrait */}
                <div
                    ref={ringRef}
                    aria-hidden="true"
                    className="absolute w-[265px] sm:w-[330px] h-[265px] sm:h-[330px] rounded-full border border-black/[0.06] bg-white/40 pointer-events-none"
                />

                {/* Central Silver-Gelatin Editorial Portrait (Blends Seamlessly into #FBFBF9) */}
                <div
                    ref={portraitRef}
                    className="relative w-[215px] sm:w-[255px] aspect-[3/4] flex items-end justify-center will-change-transform select-none"
                >
                    <img
                        src="/images/hero-portrait.jpg"
                        alt="PMKVY Candidate Editorial Portrait"
                        className="w-full h-full object-cover object-top mix-blend-multiply"
                        style={{
                            maskImage:
                                "radial-gradient(ellipse 78% 82% at 50% 45%, #000 54%, transparent 96%)",
                            WebkitMaskImage:
                                "radial-gradient(ellipse 78% 82% at 50% 45%, #000 54%, transparent 96%)",
                        }}
                    />

                    {/* Translucent Glass Orbit Tile 1: Bottom-Left of Portrait (Like Mindly "Ideas") */}
                    <div
                        ref={tile1Ref}
                        className="absolute -left-6 sm:-left-20 bottom-6 sm:bottom-10 bg-white/85 backdrop-blur-xl border border-black/[0.09] shadow-[0_16px_40px_-14px_rgba(17,17,19,0.16)] rounded-2xl px-3.5 py-2.5 w-44 sm:w-48 -rotate-6 will-change-transform"
                    >
                        <div className="flex items-center gap-2">
                            <span className="h-6 w-6 rounded-lg bg-[#4F46E5] text-white flex items-center justify-center shrink-0">
                                <Target className="h-3.5 w-3.5" />
                            </span>
                            <div>
                                <div className="text-[12px] font-semibold text-[#111113] leading-none">
                                    QP-NOS Audit
                                </div>
                                <div className="font-mono text-[10px] text-[#52525B] mt-1">
                                    SSC/Q0508 • 84% Ready
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Translucent Glass Orbit Tile 2: Mid-Left Upper (Like Mindly "Focus") */}
                    <div
                        ref={tile3Ref}
                        className="hidden sm:block absolute -left-24 top-10 bg-white/85 backdrop-blur-xl border border-black/[0.09] shadow-[0_16px_40px_-14px_rgba(17,17,19,0.16)] rounded-2xl px-3.5 py-2.5 w-44 -rotate-3 will-change-transform"
                    >
                        <div className="flex items-center gap-2">
                            <span className="h-5 w-5 rounded-md bg-[#10B981]/15 text-[#065F46] flex items-center justify-center shrink-0">
                                <Sparkles className="h-3 w-3" />
                            </span>
                            <div>
                                <div className="text-[11.5px] font-semibold text-[#111113] leading-none">
                                    Gemini Live JD
                                </div>
                                <div className="text-[10px] text-[#6B6B73] mt-0.5">
                                    Instant skill extraction
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Translucent Glass Orbit Tile 3: Right Side of Portrait (Like Mindly "Plan") */}
                    <div
                        ref={tile2Ref}
                        className="absolute -right-6 sm:-right-24 bottom-12 sm:bottom-16 bg-white/85 backdrop-blur-xl border border-black/[0.09] shadow-[0_16px_40px_-14px_rgba(17,17,19,0.16)] rounded-2xl px-3.5 py-2.5 w-44 sm:w-48 rotate-6 will-change-transform"
                    >
                        <div className="flex items-center gap-2">
                            <span className="h-6 w-6 rounded-lg bg-[#F59E0B]/20 text-[#92400E] flex items-center justify-center shrink-0">
                                <Compass className="h-3.5 w-3.5" />
                            </span>
                            <div>
                                <div className="text-[12px] font-semibold text-[#111113] leading-none">
                                    PMKVY 4.0 Bridge
                                </div>
                                <div className="font-mono text-[10px] text-[#065F46] mt-1">
                                    100% Govt Subsidized
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Minimalist Anchors (Trust Bar Left, Scroll Mouse Center, Hairline Axiom Right) */}
            <div className="relative z-20 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-black/[0.06]">
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-1.5">
                        <span className="h-6 w-6 rounded-full bg-[#111113] text-white text-[9px] font-mono flex items-center justify-center ring-2 ring-[#FBFBF9]">
                            IT
                        </span>
                        <span className="h-6 w-6 rounded-full bg-[#4F46E5] text-white text-[9px] font-mono flex items-center justify-center ring-2 ring-[#FBFBF9]">
                            EV
                        </span>
                        <span className="h-6 w-6 rounded-full bg-[#10B981] text-white text-[9px] font-mono flex items-center justify-center ring-2 ring-[#FBFBF9]">
                            AI
                        </span>
                    </div>
                    <p className="text-[12px] text-[#52525B]">
                        Calibrated across <span className="font-semibold text-[#111113]">97+ QP-NOS standards</span> &amp; 8 Sector Councils
                    </p>
                </div>

                {/* Scroll-down indicator matching Screenshot 1 & 4 */}
                <button
                    type="button"
                    onClick={() => scrollToSection("chapter-journey")}
                    aria-label="Scroll to interactive workflow story"
                    className="hidden md:flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-[#71717A] hover:text-[#111113] transition-colors cursor-pointer"
                >
                    <span className="h-6 w-4 rounded-full border border-black/25 flex items-start justify-center p-1">
                        <span className="h-1.5 w-0.5 rounded-full bg-[#111113] animate-bounce" />
                    </span>
                    <span>Scroll Story</span>
                    <ArrowDown className="h-3 w-3" />
                </button>

                <div className="hidden lg:flex items-center gap-2 text-[12px] text-[#6B6B73]">
                    <span className="font-mono text-[#111113]">+</span>
                    <span>Less guesswork. Verified readiness.</span>
                </div>
            </div>
        </section>
    );
}
