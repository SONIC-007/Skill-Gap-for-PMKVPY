"use client";
// [FRONTEND] Section 8: Chartreuse Marquee Ribbon + PDF Upload Poster & Vector Consultation Card
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Compass, Cpu, FileText, Link2, ShieldCheck, Sparkles, Target } from "lucide-react";
import { RevealBlock } from "@/components/story/scrollEngine";
import { PdfUploadCard } from "@/components/ui/PdfUploadCard";

const BADGE_ICONS = [Target, Sparkles, Link2, BookOpen, Compass, ShieldCheck];

export function CTA() {
    const router = useRouter();

    const goToAnalyser = () => {
        router.push("/login?callbackUrl=/resume-analyser");
    };

    return (
        <section id="section-pricing" className="bg-white border-t border-black/[0.06] py-12 sm:py-16 px-4 sm:px-8 space-y-10 sm:space-y-12">
            {/* Compact Vivid Chartreuse Marquee Ribbon */}
            <div className="max-w-7xl mx-auto">
                <div className="relative rounded-[26px] bg-[#ECFF58] text-[#111113] py-6 sm:py-8 overflow-hidden border border-black/[0.06]">
                    <div className="overflow-hidden whitespace-nowrap">
                        <div className="animate-marquee items-center gap-7 font-display text-[22px] sm:text-[32px] font-semibold tracking-[-0.03em]">
                            {[0, 1].map((dup) => (
                                <div key={dup} className="inline-flex items-center gap-5 pr-5">
                                    <span>Powered by Gemini AI &amp; QP-NOS</span>
                                    <span className="inline-flex h-8 w-8 rounded-xl bg-[#111113] text-white items-center justify-center">
                                        <Cpu className="h-4 w-4" />
                                    </span>
                                    <span>₹0 Tuition • 100% Subsidized PMKVY 4.0</span>
                                    <span className="inline-flex h-8 w-8 rounded-xl bg-[#F36538] text-white items-center justify-center">
                                        <FileText className="h-4 w-4" />
                                    </span>
                                    <span>Match Roles or Live Job Links</span>
                                    <span className="inline-flex h-8 w-8 rounded-xl bg-[#1D2BF5] text-white items-center justify-center">
                                        <CheckCircle2 className="h-4 w-4" />
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 px-4">
                        {BADGE_ICONS.map((Icon, i) => (
                            <span
                                key={i}
                                className="h-9 w-9 rounded-full bg-white border border-black/[0.08] shadow-xs flex items-center justify-center text-[#111113] hover:scale-110 hover:rotate-6 transition-all"
                            >
                                <Icon className="h-4 w-4" />
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Dual Interactive Conversion Cards: Lavender PDF Drop Card + Clean Vector Poster */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                <RevealBlock className="rounded-[28px] bg-[#F5F6FF] border border-[#E4E3FE] p-6 sm:p-8 flex flex-col justify-between space-y-5">
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-[10.5px] uppercase tracking-wider text-[#7367F0] font-semibold">
                            INSTANT CV UPLOAD
                        </span>
                        <span className="font-mono text-[10.5px] px-2.5 py-0.5 rounded-full bg-white text-[#111113] border border-[#E4E3FE]">
                            PDF / DOCX
                        </span>
                    </div>

                    {/* Matches uploaded reference upload zone directly */}
                    <PdfUploadCard compact onTrigger={goToAnalyser} buttonLabel="Upload & Match" />
                </RevealBlock>

                <RevealBlock
                    delayMs={90}
                    className="relative rounded-[28px] bg-white text-[#111113] border border-black/[0.08] p-6 sm:p-8 flex flex-col justify-between overflow-hidden group shadow-[0_14px_38px_-22px_rgba(17,17,19,0.08)]"
                >
                    <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFECE6] font-mono text-[10px] font-semibold">
                            100% GOVT SUBSIDIZED
                        </span>
                        <span className="font-mono text-[11px] text-[#52525B]">PMKVY 4.0</span>
                    </div>

                    <div className="my-2 flex justify-center">
                        <img
                            src="/images/vec-coder.jpg"
                            alt="Developer Vector Illustration"
                            className="w-64 h-44 object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-display text-2xl sm:text-[28px] leading-[1.1] font-semibold">
                            Archive of 97+ QP-NOS benchmarks
                        </h3>
                        <p className="text-[13.5px] text-[#52525B] leading-relaxed">
                            Explore Sector Skill Council standards, validate skills in timed assessments, and enroll in free PMKVY bridge labs.
                        </p>
                        <div className="pt-1 flex flex-wrap gap-2.5">
                            <Link
                                href="/login?callbackUrl=/courses"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#111113] text-white hover:bg-[#27272A] text-[12.5px] font-semibold transition-all"
                            >
                                <span>Browse PMKVY Courses</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                            <Link
                                href="/login?callbackUrl=/resume-analyser"
                                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-black/[0.1] hover:bg-[#F6F5F0] text-[12.5px] font-medium text-[#111113] transition-colors"
                            >
                                Run Audit
                            </Link>
                        </div>
                    </div>
                </RevealBlock>
            </div>
        </section>
    );
}
