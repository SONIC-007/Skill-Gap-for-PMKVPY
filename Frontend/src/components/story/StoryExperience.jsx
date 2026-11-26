"use client";
// [FRONTEND] Landing Story Orchestrator | Route: / | Coordinates scroll polarity, chapter index, and 5 narrative chapters

import { useEffect, useState } from "react";
import { EditorialNav } from "@/components/story/EditorialNav";
import { EditorialHero } from "@/components/story/EditorialHero";
import { PinnedJourney } from "@/components/story/PinnedJourney";
import { DarkStudioVignette } from "@/components/story/DarkStudioVignette";
import { SectorDeck } from "@/components/story/SectorDeck";
import { EditorialFooter } from "@/components/story/EditorialFooter";

const CHAPTER_IDS = [
    "chapter-hero",
    "chapter-journey",
    "chapter-studio",
    "chapter-sectors",
    "chapter-close",
];

export function StoryExperience() {
    const [activeChapter, setActiveChapter] = useState(0);
    const [isNavDark, setIsNavDark] = useState(false);
    const [scrollPercent, setScrollPercent] = useState(0);

    useEffect(() => {
        let rafId = null;

        const sync = () => {
            const maxScroll = Math.max(
                1,
                document.documentElement.scrollHeight - window.innerHeight
            );
            setScrollPercent(Math.min(1, Math.max(0, window.scrollY / maxScroll)));

            const railTriggerY = window.innerHeight * 0.42;
            const navTriggerY = 48;
            let currentIdx = 0;
            let navIdx = 0;

            for (let i = 0; i < CHAPTER_IDS.length; i++) {
                const el = document.getElementById(CHAPTER_IDS[i]);
                if (!el) continue;
                const rect = el.getBoundingClientRect();
                if (rect.top <= railTriggerY) {
                    currentIdx = i;
                }
                if (rect.top <= navTriggerY) {
                    navIdx = i;
                }
            }
            setActiveChapter(currentIdx);
            setIsNavDark(navIdx === 2 || navIdx === 4);
            rafId = null;
        };

        const onScroll = () => {
            if (!rafId) rafId = window.requestAnimationFrame(sync);
        };

        sync();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            if (rafId) window.cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <div className="min-h-screen w-full bg-[#FBFBF9] text-[#111113] selection:bg-[#4F46E5] selection:text-white">
            <EditorialNav
                isDarkSection={isNavDark}
                isDarkRail={activeChapter === 2 || activeChapter === 4}
                activeChapter={activeChapter}
                scrollPercent={scrollPercent}
            />
            <main>
                <EditorialHero />
                <PinnedJourney />
                <DarkStudioVignette />
                <SectorDeck />
            </main>
            <EditorialFooter />
        </div>
    );
}
