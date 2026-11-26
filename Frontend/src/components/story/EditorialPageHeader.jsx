"use client";
// [FRONTEND] Shared Editorial Page Header | Unifies typography, chrome & reveal choreography across workspace & admin pages

import { RevealBlock, RevealLine } from "@/components/story/scrollEngine";

export function EditorialPageHeader({
    eyebrow,
    title,
    italicAccent,
    description,
    badges,
    rightSlot,
    variant = "light",
}) {
    const isStudio = variant === "studio";

    return (
        <section
            className={`relative rounded-[24px] p-6 sm:p-8 overflow-hidden border transition-colors ${
                isStudio
                    ? "bg-[#140A0B] text-[#FAF8F5] border-white/[0.08] shadow-[0_22px_54px_-20px_rgba(17,17,19,0.34)]"
                    : "bg-white text-[#111113] border-black/[0.05] shadow-[0_12px_34px_-14px_rgba(17,17,19,0.08),0_2px_8px_-2px_rgba(17,17,19,0.03)]"
            }`}
        >
            {isStudio && (
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-24 -top-24 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(158,51,26,0.22)_0%,rgba(79,70,229,0.1)_48%,transparent_72%)] blur-2xl"
                />
            )}

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                    {eyebrow && (
                        <div className="flex flex-wrap items-center gap-2">
                            <span
                                className={`px-3 py-1 rounded-full font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] ${
                                    isStudio
                                        ? "bg-white/10 text-[#F2CFC2] border border-white/10"
                                        : "bg-[#F3F1EC] text-[#111113] border border-black/[0.07]"
                                }`}
                            >
                                {eyebrow}
                            </span>
                        </div>
                    )}

                    <h1
                        className={`font-display text-2xl sm:text-[32px] lg:text-[36px] leading-[1.1] tracking-[-0.03em] font-semibold ${
                            isStudio ? "text-white" : "text-[#111113]"
                        }`}
                    >
                        <RevealLine delayMs={40}>{title}</RevealLine>{" "}
                        {italicAccent && (
                            <RevealLine delayMs={120}>
                                <span
                                    className={`font-editorial italic font-normal ${
                                        isStudio ? "text-[#F2CFC2]" : "text-[#4F46E5]"
                                    }`}
                                >
                                    {italicAccent}
                                </span>
                            </RevealLine>
                        )}
                    </h1>

                    {description && (
                        <RevealBlock delayMs={160} yOffset={12}>
                            <p
                                className={`text-[14px] sm:text-[15px] leading-relaxed max-w-xl ${
                                    isStudio ? "text-white/70" : "text-[#52525B]"
                                }`}
                            >
                                {description}
                            </p>
                        </RevealBlock>
                    )}

                    {badges && <div className="flex flex-wrap items-center gap-2 pt-1">{badges}</div>}
                </div>

                {rightSlot && <div className="shrink-0 w-full lg:w-auto">{rightSlot}</div>}
            </div>
        </section>
    );
}
