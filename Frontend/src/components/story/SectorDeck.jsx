"use client";
// [FRONTEND] Chapter IV — Swiss Display Header & Scroll-Fanned Sector Deck | Inspired by Screenshot 3 reference
// Smoothly unfolds 5 tilted sector cards horizontally as the user scrolls into the chapter.

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { RevealBlock, RevealLine, useScrollProgress } from "@/components/story/scrollEngine";

const SECTORS = [
    {
        code: "IT-ITeS SSC",
        title: "Web & Cloud Engineering",
        roles: "18 QP Roles",
        level: "NSQF L5–6",
        bg: "bg-[#111113]",
        text: "text-white",
        muted: "text-white/65",
        badge: "bg-white/15 text-white",
        restAngle: -10,
        restY: 18,
    },
    {
        code: "NASSCOM",
        title: "Data Science & AI Systems",
        roles: "12 QP Roles",
        level: "NSQF L6–7",
        bg: "bg-[#4F46E5]",
        text: "text-white",
        muted: "text-indigo-100/80",
        badge: "bg-white/20 text-white",
        restAngle: -5,
        restY: 6,
    },
    {
        code: "ASDC",
        title: "Electric Vehicle & Robotics",
        roles: "9 QP Roles",
        level: "NSQF L4–5",
        bg: "bg-[#065F46]",
        text: "text-white",
        muted: "text-emerald-100/80",
        badge: "bg-white/20 text-white",
        restAngle: 0,
        restY: 0,
    },
    {
        code: "ESSCI",
        title: "Electronics & Embedded VLSI",
        roles: "11 QP Roles",
        level: "NSQF L4–5",
        bg: "bg-[#9E331A]",
        text: "text-white",
        muted: "text-orange-100/80",
        badge: "bg-white/20 text-white",
        restAngle: 5,
        restY: 6,
    },
    {
        code: "SCGJ",
        title: "Renewable Energy & Solar",
        roles: "8 QP Roles",
        level: "NSQF L4",
        bg: "bg-white border border-black/[0.1]",
        text: "text-[#111113]",
        muted: "text-[#52525B]",
        badge: "bg-[#F4F4F5] text-[#111113]",
        restAngle: 10,
        restY: 18,
    },
];

export function SectorDeck() {
    const sectionRef = useRef(null);
    const cardRefs = useRef([]);

    useScrollProgress(sectionRef, {
        mode: "span",
        damping: 0.12,
        onProgress: (p) => {
            const fanT = Math.min(1, Math.max(0, (p - 0.15) / 0.45));
            cardRefs.current.forEach((el, idx) => {
                if (!el) return;
                const s = SECTORS[idx];
                const angle = s.restAngle * fanT;
                const yOffset = (1 - fanT) * (36 + Math.abs(idx - 2) * 12) + s.restY * fanT;
                const scale = 0.92 + fanT * 0.08;
                el.style.transform = `translate3d(0, ${yOffset.toFixed(1)}px, 0) rotate(${angle.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
            });
        },
    });

    return (
        <section
            id="chapter-sectors"
            ref={sectionRef}
            className="relative -mt-6 sm:-mt-10 z-30 rounded-t-[36px] sm:rounded-t-[56px] bg-[#FBFBF9] pt-24 sm:pt-32 pb-24 sm:pb-32 px-4 sm:px-8 overflow-hidden"
        >
            <div className="max-w-7xl mx-auto">
                {/* Swiss Tight-Tracked Poster Header with 4 Directional Annotations */}
                <div className="relative max-w-4xl mx-auto text-center py-6">
                    {/* Top-Left Annotation */}
                    <div className="hidden md:flex flex-col items-start text-left absolute left-0 top-6">
                        <span className="font-mono text-[11px] text-[#4F46E5] mb-1">↗</span>
                        <span className="font-mono text-[11px] text-[#52525B]">97+ Qualification Packs</span>
                        <span className="font-mono text-[10px] text-[#71717A]">Mapped to NSDC standards</span>
                    </div>

                    {/* Top-Right Annotation */}
                    <div className="hidden md:flex flex-col items-end text-right absolute right-0 top-6">
                        <span className="font-mono text-[11px] text-[#4F46E5] mb-1">↗</span>
                        <span className="font-mono text-[11px] text-[#52525B]">NSQF Levels 4 to 7</span>
                        <span className="font-mono text-[10px] text-[#71717A]">Subsidized skill tracks</span>
                    </div>

                    <RevealBlock delayMs={40}>
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-black/[0.08] font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#52525B] mb-5">
                            SECTOR HORIZON
                        </div>
                    </RevealBlock>

                    <h2 className="font-display text-[44px] sm:text-[64px] lg:text-[74px] leading-[1.0] tracking-[-0.045em] font-bold text-[#111113]">
                        <span className="block">
                            <RevealLine delayMs={80}>Built across</RevealLine>
                        </span>
                        <span className="block mt-1">
                            <RevealLine delayMs={180}>
                                <span className="font-editorial italic font-normal text-[#4F46E5]">
                                    eight sectors.
                                </span>
                            </RevealLine>
                        </span>
                    </h2>

                    <RevealBlock delayMs={260} className="mt-6 flex flex-wrap items-center justify-center gap-2">
                        <span className="px-4 py-1.5 rounded-full bg-[#EFECE6] text-[#111113] font-mono text-[12px]">
                            Select Sector Pack:
                        </span>
                        <Link
                            href="/login?callbackUrl=/skill-gap"
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-mono text-[12px] transition-colors"
                        >
                            <span>@pmkvy/qp-nos</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                    </RevealBlock>
                </div>

                {/* Fanned Editorial Card Arc Rising From Scroll */}
                <div className="mt-14 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-3 items-end pt-4 pb-8">
                    {SECTORS.map((sec, idx) => (
                        <Link
                            key={sec.code}
                            ref={(el) => {
                                cardRefs.current[idx] = el;
                            }}
                            href="/login?callbackUrl=/skill-gap"
                            className={`group relative rounded-[24px] p-6 min-h-[250px] flex flex-col justify-between shadow-[0_24px_48px_-18px_rgba(17,17,19,0.22)] transition-[box-shadow] duration-300 hover:z-30 hover:shadow-[0_32px_64px_-12px_rgba(17,17,19,0.34)] will-change-transform ${sec.bg} ${sec.text}`}
                        >
                            <div className="flex items-center justify-between gap-2">
                                <span className={`font-mono text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${sec.badge}`}>
                                    {sec.code}
                                </span>
                                <ArrowUpRight className="h-4 w-4 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </div>

                            <div className="my-6">
                                <h3 className="font-display text-[20px] font-semibold leading-tight tracking-tight">
                                    {sec.title}
                                </h3>
                                <p className={`mt-2 text-[12.5px] leading-relaxed ${sec.muted}`}>
                                    Calibrated NOS skill checks, deficit audit &amp; PMKVY lab enrollment.
                                </p>
                            </div>

                            <div className={`pt-3 border-t border-current/15 flex items-center justify-between font-mono text-[10.5px] ${sec.muted}`}>
                                <span>{sec.roles}</span>
                                <span>{sec.level}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
