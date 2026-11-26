"use client";
// [FRONTEND] Section 2: Centered Editorial Hero with Fanned Overlapping Visual Deck (Video Ref 00:01-00:03)
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Target, Link2, Layers, CheckCircle2 } from "lucide-react";
import { RevealBlock, RevealLine, scrollToSection } from "@/components/story/scrollEngine";

const HERO_FAN_CARDS = [
    {
        id: "parse",
        bg: "bg-[#141416] text-white",
        badge: "RESUME PDF",
        title: "Arun_CV.pdf",
        stat: "14 Tokens",
        icon: Layers,
        restRotate: -11,
        restX: -220,
        restY: 22,
        delay: 80,
        floatClass: "animate-float-slow",
    },
    {
        id: "nos",
        bg: "bg-[#4F46E5] text-white",
        badge: "QP-NOS",
        title: "SSC/Q0508",
        stat: "NSQF L6",
        icon: Target,
        restRotate: -5,
        restX: -112,
        restY: 6,
        delay: 140,
        floatClass: "animate-float-alt",
    },
    {
        id: "portrait",
        bg: "bg-[#F36538] text-white",
        badge: "AI AUDIT",
        title: "84% Match",
        stat: "Gemini Bot",
        image: "/images/bot-mascot.jpg",
        icon: Sparkles,
        restRotate: 0,
        restX: 0,
        restY: -6,
        delay: 200,
        floatClass: "",
    },
    {
        id: "url",
        bg: "bg-[#3B82F6] text-white",
        badge: "JOB LINK",
        title: "Live Hiring JD",
        stat: "URL Synced",
        icon: Link2,
        restRotate: 5,
        restX: 112,
        restY: 6,
        delay: 260,
        floatClass: "animate-float-slow",
    },
    {
        id: "bridge",
        bg: "bg-[#10B981] text-white",
        badge: "PMKVY 4.0",
        title: "Bridge Track",
        stat: "₹0 Govt Fee",
        icon: CheckCircle2,
        restRotate: 11,
        restX: 220,
        restY: 22,
        delay: 320,
        floatClass: "animate-float-alt",
    },
];

export function Hero() {
    const [mounted, setMounted] = useState(false);
    const [scrollSpread, setScrollSpread] = useState(0);

    useEffect(() => {
        const timer = window.setTimeout(() => setMounted(true), 60);
        const onScroll = () => {
            const p = Math.min(1, Math.max(0, window.scrollY / 500));
            setScrollSpread(p);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.clearTimeout(timer);
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    return (
        <section className="relative bg-white pt-8 sm:pt-11 pb-12 sm:pb-14 px-4 sm:px-8 overflow-hidden">
            <div className="max-w-5xl mx-auto text-center">
                {/* Large Bold Centered Heading */}
                <h1 className="font-display text-[40px] sm:text-[58px] lg:text-[66px] leading-[1.03] tracking-[-0.04em] font-semibold text-[#111113] max-w-3xl mx-auto">
                    <span className="block">
                        <RevealLine delayMs={40}>A place to map your</RevealLine>
                    </span>
                    <span className="block">
                        <RevealLine delayMs={150}>career readiness.</RevealLine>
                    </span>
                </h1>

                {/* Floating Speech Tag Bubbles + Scroll-Reactive Fanned Deck */}
                <div className="relative mt-7 sm:mt-8 mx-auto max-w-3xl min-h-[225px] sm:min-h-[245px] flex items-center justify-center">
                    {/* Left Blue Speech Tag (@qp-nos) */}
                    <div
                        className="hidden sm:inline-flex items-center px-4 py-1.5 rounded-full bg-[#4F83FF] text-white font-mono text-[12.5px] font-medium shadow-[0_12px_28px_-8px_rgba(79,131,255,0.5)] absolute left-10 -top-3 z-30 animate-float-slow transition-all duration-700"
                        style={{
                            opacity: mounted ? 1 : 0,
                            transform: mounted
                                ? `translate3d(${(-scrollSpread * 24).toFixed(1)}px,0,0) rotate(${(-6 - scrollSpread * 4).toFixed(1)}deg)`
                                : "translate3d(0,16px,0) rotate(-14deg)",
                        }}
                    >
                        @qp-nos
                        <span className="absolute -bottom-1.5 right-4 w-3 h-3 bg-[#4F83FF] rotate-45 rounded-[2px]" />
                    </div>

                    {/* Right Emerald Speech Tag (@gemini-ai) */}
                    <div
                        className="hidden sm:inline-flex items-center px-4 py-1.5 rounded-full bg-[#38B886] text-white font-mono text-[12.5px] font-medium shadow-[0_12px_28px_-8px_rgba(56,184,134,0.45)] absolute right-8 -top-2 z-30 animate-float-alt transition-all duration-700"
                        style={{
                            opacity: mounted ? 1 : 0,
                            transform: mounted
                                ? `translate3d(${(scrollSpread * 24).toFixed(1)}px,0,0) rotate(${(6 + scrollSpread * 4).toFixed(1)}deg)`
                                : "translate3d(0,16px,0) rotate(14deg)",
                        }}
                    >
                        @gemini-ai
                        <span className="absolute -bottom-1.5 left-4 w-3 h-3 bg-[#38B886] rotate-45 rounded-[2px]" />
                    </div>

                    {/* Desktop 5-Card Overlapping Fan Stage (scroll fans outward!) */}
                    <div className="hidden md:flex relative w-full h-[210px] items-center justify-center">
                        {HERO_FAN_CARDS.map((card, idx) => {
                            const Icon = card.icon;
                            const distFromCenter = idx - 2;
                            const extraX = distFromCenter * scrollSpread * 22;
                            const extraRot = distFromCenter * scrollSpread * 2.5;
                            const extraY = scrollSpread * -10;
                            return (
                                <Link
                                    key={card.id}
                                    href="/login?callbackUrl=/resume-analyser"
                                    className={`group absolute w-[156px] h-[174px] rounded-[22px] p-3.5 flex flex-col justify-between text-left border border-black/[0.08] shadow-[0_22px_45px_-18px_rgba(17,17,19,0.28)] overflow-hidden transition-all duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-4 hover:scale-105 hover:z-40 ${card.bg} ${card.floatClass}`}
                                    style={{
                                        zIndex: idx === 2 ? 20 : 12 - Math.abs(idx - 2) * 2,
                                        transitionDelay: mounted ? "0ms" : `${card.delay}ms`,
                                        transform: mounted
                                            ? `translate3d(${(card.restX + extraX).toFixed(1)}px, ${(card.restY + extraY).toFixed(1)}px, 0) rotate(${(card.restRotate + extraRot).toFixed(2)}deg)`
                                            : "translate3d(0, 32px, 0) rotate(0deg) scale(0.9)",
                                        opacity: mounted ? 1 : 0,
                                    }}
                                >
                                    {card.image && (
                                        <img
                                            src={card.image}
                                            alt={card.title}
                                            className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                                        />
                                    )}
                                    <div className="relative z-10 flex items-center justify-between">
                                        <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/25 backdrop-blur-xs text-white font-semibold">
                                            {card.badge}
                                        </span>
                                        <Icon className="h-3.5 w-3.5 text-white/90" />
                                    </div>

                                    <div className="relative z-10 bg-black/25 backdrop-blur-xs rounded-xl p-2">
                                        <div className="font-display text-[13px] font-semibold leading-tight text-white">
                                            {card.title}
                                        </div>
                                        <div className="font-mono text-[10px] text-white/85 mt-0.5">
                                            {card.stat}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Responsive Mobile/Tablet Grid */}
                    <div className="md:hidden grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
                        {HERO_FAN_CARDS.slice(0, 4).map((card) => {
                            const Icon = card.icon;
                            return (
                                <Link
                                    key={card.id}
                                    href="/login?callbackUrl=/resume-analyser"
                                    className={`relative rounded-2xl p-4 h-36 flex flex-col justify-between text-left border border-black/[0.08] shadow-md overflow-hidden ${card.bg}`}
                                >
                                    {card.image && (
                                        <img
                                            src={card.image}
                                            alt={card.title}
                                            className="absolute inset-0 w-full h-full object-cover opacity-85"
                                        />
                                    )}
                                    <div className="relative z-10 flex items-center justify-between">
                                        <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded-full bg-black/25 text-white">
                                            {card.badge}
                                        </span>
                                        <Icon className="h-3.5 w-3.5 text-white" />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="font-display text-[13px] font-semibold text-white">{card.title}</div>
                                        <div className="font-mono text-[10px] text-white/80">{card.stat}</div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Centered Short Supporting Description + CTA Pair */}
                <RevealBlock delayMs={200} yOffset={14}>
                    <p className="mt-4 text-[14.5px] sm:text-[15.5px] text-[#52525B] max-w-lg mx-auto">
                        Candidates verify their resumes against QP-NOS standards or live job links, and discover 100% funded PMKVY bridge tracks.
                    </p>
                </RevealBlock>

                <RevealBlock delayMs={280} yOffset={14}>
                    <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                        <Link
                            href="/login?callbackUrl=/resume-analyser"
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#111113] hover:bg-[#27272A] text-white text-[13.5px] font-medium shadow-[0_10px_24px_-8px_rgba(17,17,19,0.35)] transition-all"
                        >
                            <span>Sign In &amp; Start Audit</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                        <button
                            type="button"
                            onClick={() => scrollToSection("section-how-it-works")}
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[13.5px] font-medium text-[#111113] hover:bg-[#F4F4F5] transition-colors cursor-pointer"
                        >
                            Explore workflow
                        </button>
                    </div>
                </RevealBlock>
            </div>
        </section>
    );
}
