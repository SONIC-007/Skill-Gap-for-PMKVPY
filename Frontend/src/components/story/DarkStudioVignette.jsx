"use client";
// [FRONTEND] Chapter III — Deep Espresso Dark Studio Vignette | Inspired by Screenshot 1 reference
// Features an overlapping curved top edge and scroll-linked parallax around the central 3D studio portrait.

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Link2, Target } from "lucide-react";
import { RevealBlock, RevealLine, useScrollProgress } from "@/components/story/scrollEngine";

export function DarkStudioVignette() {
    const sectionRef = useRef(null);
    const figureRef = useRef(null);
    const haloRef = useRef(null);

    useScrollProgress(sectionRef, {
        mode: "span",
        damping: 0.1,
        onProgress: (p) => {
            if (figureRef.current) {
                const y = (p - 0.5) * -46;
                const scale = 0.96 + Math.sin(Math.min(1, Math.max(0, p)) * Math.PI) * 0.06;
                figureRef.current.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
            }
            if (haloRef.current) {
                const scale = 0.9 + p * 0.22;
                haloRef.current.style.transform = `scale(${scale.toFixed(4)})`;
            }
        },
    });

    return (
        <section
            id="chapter-studio"
            ref={sectionRef}
            className="relative -mt-6 sm:-mt-10 z-20 rounded-t-[36px] sm:rounded-t-[56px] bg-[#140A0B] text-[#FAF8F5] pt-20 sm:pt-28 pb-16 sm:pb-24 px-4 sm:px-8 overflow-hidden shadow-[0_-24px_60px_rgba(17,17,19,0.18)]"
        >
            {/* Subtle radial studio glow matching portrait rim highlights */}
            <div
                ref={haloRef}
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] rounded-full bg-[radial-gradient(circle,rgba(158,51,26,0.22)_0%,rgba(79,70,229,0.09)_45%,transparent_72%)] blur-2xl will-change-transform"
            />

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Asymmetric 3-Column Studio Showcase */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
                    {/* Left Editorial Block */}
                    <div className="lg:col-span-4 space-y-5 order-2 lg:order-1 text-center lg:text-left">
                        <RevealBlock delayMs={50}>
                            <span className="inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.22em] text-[#E07A5F]">
                                <Target className="h-3.5 w-3.5" />
                                Dual Audit Pathways
                            </span>
                        </RevealBlock>

                        <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] leading-[1.08] tracking-[-0.03em] font-semibold text-white">
                            <RevealLine delayMs={90}>Role Standards &amp;</RevealLine>
                            <br />
                            <RevealLine delayMs={180}>
                                <span className="font-editorial italic font-normal text-[#F2CFC2]">
                                    Live Job Links.
                                </span>
                            </RevealLine>
                        </h2>

                        <RevealBlock delayMs={240}>
                            <p className="text-[14px] sm:text-[15px] text-white/65 leading-relaxed max-w-sm mx-auto lg:mx-0">
                                Run structured diagnostics against official IT-ITeS &amp; NSDC QP-NOS benchmarks, or drop in any active job posting link for live Gemini AI alignment.
                            </p>
                        </RevealBlock>

                        <RevealBlock delayMs={320}>
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1">
                                <Link
                                    href="/login?callbackUrl=/resume-analyser"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#9E331A] hover:bg-[#B83D20] text-white text-[13px] font-medium transition-colors shadow-lg shadow-[#9E331A]/25"
                                >
                                    <span>Launch Dual Analyser</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                                <Link
                                    href="/login?callbackUrl=/dashboard"
                                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/15 text-white/90 text-[13px] font-medium transition-colors"
                                >
                                    <span>Open Dashboard</span>
                                </Link>
                            </div>
                        </RevealBlock>
                    </div>

                    {/* Center Sculptural 3D Portrait Frame */}
                    <div className="lg:col-span-4 order-1 lg:order-2 flex justify-center">
                        <div
                            ref={figureRef}
                            className="relative w-[270px] sm:w-[340px] lg:w-[370px] aspect-square flex items-center justify-center will-change-transform"
                        >
                            <img
                                src="/images/studio-architect.jpg"
                                alt="PMKVY Candidate 3D Studio Visual"
                                className="w-full h-full object-cover rounded-full"
                                style={{
                                    maskImage:
                                        "radial-gradient(circle at 50% 48%, #000 46%, rgba(0,0,0,0.75) 62%, transparent 94%)",
                                    WebkitMaskImage:
                                        "radial-gradient(circle at 50% 48%, #000 46%, rgba(0,0,0,0.75) 62%, transparent 94%)",
                                }}
                            />
                        </div>
                    </div>

                    {/* Right Editorial Block */}
                    <div className="lg:col-span-4 space-y-5 order-3 text-center lg:text-left lg:pl-6">
                        <RevealBlock delayMs={80}>
                            <span className="inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.22em] text-indigo-300">
                                <Link2 className="h-3.5 w-3.5" />
                                Signed-In Workspace
                            </span>
                        </RevealBlock>

                        <h3 className="font-display text-3xl sm:text-[34px] leading-[1.1] tracking-[-0.025em] font-semibold text-white">
                            Join Your{" "}
                            <span className="font-editorial italic font-normal text-[#F2CFC2]">
                                Skill Passport.
                            </span>
                        </h3>

                        <RevealBlock delayMs={200}>
                            <p className="text-[14px] sm:text-[15px] text-white/65 leading-relaxed max-w-sm mx-auto lg:mx-0">
                                Every resume audit, NOS competency check, and subsidized course track persists securely in MongoDB—building an authenticated timeline ready for recruiters.
                            </p>
                        </RevealBlock>

                        <RevealBlock delayMs={280}>
                            <div className="pt-1 flex justify-center lg:justify-start">
                                <Link
                                    href="/register"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#140A0B] hover:bg-[#FAF8F5] text-[13px] font-semibold transition-colors"
                                >
                                    <span>Create Candidate Account</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        </RevealBlock>
                    </div>
                </div>

                {/* Minimalist Architectural Floor Line */}
                <div className="mt-16 pt-6 border-t border-white/[0.1] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10.5px] tracking-widest uppercase text-white/45">
                    <span>VERIFIED NSQF ENGINE • MONGODB PERSISTENCE</span>
                    <div className="flex items-center gap-6">
                        <span className="text-white/75">JOB ROLE</span>
                        <span>JOB LINK</span>
                        <span>QP-NOS</span>
                        <span>PMKVY 4.0</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
