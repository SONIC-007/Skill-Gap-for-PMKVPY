"use client";
// [FRONTEND] Compact Editorial Landing View (5 punchy sections, ~4 viewports, high animation density)
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { FeaturedSection } from "@/components/landing/FeaturedSection";
import { Statistics } from "@/components/landing/Statistics";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export function LandingHome() {
    return (
        <div className="min-h-screen flex flex-col bg-white text-[#111113] selection:bg-[#111113] selection:text-white overflow-x-clip">
            <Navbar />
            <main className="flex-1">
                <Hero />
                <FeaturedSection />
                <Statistics />
                <HowItWorks />
                <Features />
                <CTA />
            </main>
            <Footer />
        </div>
    );
}
