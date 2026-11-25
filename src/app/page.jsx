import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Target,
    BarChart3,
    BookOpen,
    Compass,
    TrendingUp,
    ArrowRight,
    Sparkles,
    Search,
    FileCheck,
    ChevronRight,
    CheckCircle2,
    Terminal,
} from "lucide-react";

const features = [
    {
        icon: Sparkles,
        code: "01 // AI",
        title: "AI Resume & Job Match",
        description:
            "Upload your CV and match against official QP-NOS roles or paste any live job link using Google Gemini AI.",
    },
    {
        icon: Target,
        code: "02 // NOS",
        title: "Precision Skill Assessment",
        description:
            "Benchmark technical depth and workplace competencies with structured assessments mapped to Qualification Packs (QP-NOS).",
    },
    {
        icon: BarChart3,
        code: "03 // GAP",
        title: "Instant Gap Diagnostics",
        description:
            "Quantify exact percentage deficits between your resume background and industry role targets with clear telemetry.",
    },
    {
        icon: BookOpen,
        code: "04 // STT",
        title: "PMKVY Bridge Courses",
        description:
            "Unlock personalized training programs from 100% government-subsidized PMKVY 4.0 centers to eliminate missing skills.",
    },
    {
        icon: Compass,
        code: "05 // PATH",
        title: "Career Path Mapping",
        description:
            "Visualize readiness across multiple engineering and vocational roles with phased upskilling milestones.",
    },
    {
        icon: TrendingUp,
        code: "06 // LOG",
        title: "Verified Skill Passport",
        description:
            "Sync assessment history, track weekly proficiency deltas, and prepare for NSDC & Skill India Digital certification.",
    },
];

const domains = [
    { name: "Web & Software Engineering", tag: "IT-ITeS SSC", count: "18 Roles", level: "NSQF 5-6" },
    { name: "Data Science & AI", tag: "NASSCOM", count: "12 Roles", level: "NSQF 6-7" },
    { name: "Electric Vehicle Technology", tag: "ASDC", count: "9 Roles", level: "NSQF 4-5" },
    { name: "Cloud & Cybersecurity", tag: "IT-ITeS SSC", count: "14 Roles", level: "NSQF 5-6" },
    { name: "Electronics & Hardware", tag: "ESSCI", count: "11 Roles", level: "NSQF 4-5" },
    { name: "Renewable Energy & Solar", tag: "SCGJ", count: "8 Roles", level: "NSQF 4" },
    { name: "Digital Marketing & Analytics", tag: "Media & Ent.", count: "10 Roles", level: "NSQF 5" },
    { name: "Advanced Manufacturing", tag: "CGSC", count: "15 Roles", level: "NSQF 4-5" },
];

const steps = [
    {
        step: "01",
        title: "Sign In & Upload Resume",
        description: "Sign in cleanly and add your CV with either a QP-NOS target role or a live Job Link.",
    },
    {
        step: "02",
        title: "Run AI Competency Audit",
        description: "Compare verified experience against official QP-NOS proficiency thresholds or live job descriptions.",
    },
    {
        step: "03",
        title: "Enroll in PMKVY Bridges",
        description: "Pick government-funded courses targeted specifically at critical gaps.",
    },
    {
        step: "04",
        title: "Verify & Track Readiness",
        description: "Sync results to your Skill Passport and prepare for technical interviews.",
    },
];

export default function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-[#4F46E5] selection:text-white">
            {/* Clean Minimal Sticky Top Navbar */}
            <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-14">
                        <div className="flex items-center gap-4">
                            <Link href="/" className="flex items-center gap-2">
                                <span className="h-7 w-7 rounded-lg bg-[#4F46E5] text-white flex items-center justify-center font-mono text-[12px] font-bold shadow-xs">
                                    &lt;/&gt;
                                </span>
                                <span className="font-display text-[16px] font-semibold tracking-tight text-[#3525CD]">
                                    PMKVY Skill Gap Analyser
                                </span>
                                <span className="hidden sm:inline-block font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-[#EAEDFF] text-[#464555] border border-[#C7C4D8]/60 font-medium">
                                    PMKVY 4.0
                                </span>
                            </Link>
                        </div>

                        <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-[#64748B]">
                            <Link href="/login?callbackUrl=/resume-analyser" className="hover:text-[#4F46E5] transition-colors">
                                AI Resume Matcher
                            </Link>
                            <Link href="/login?callbackUrl=/skill-gap" className="hover:text-[#4F46E5] transition-colors">
                                Skill Gap
                            </Link>
                            <Link href="/login?callbackUrl=/assessment" className="hover:text-[#4F46E5] transition-colors">
                                Assessments
                            </Link>
                            <Link href="/login?callbackUrl=/courses" className="hover:text-[#4F46E5] transition-colors">
                                PMKVY Courses
                            </Link>
                        </nav>

                        <div className="flex items-center gap-2.5">
                            <Link href="/login">
                                <Button variant="ghost" size="sm">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/login?callbackUrl=/dashboard">
                                <Button size="sm">
                                    <span>Launch Workspace</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-14 pb-16 sm:pt-20 sm:pb-20 px-4 sm:px-6 bg-white border-b border-[#E2E8F0]">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2F3FF] border border-[#C7C4D8]/70 text-[12px] font-medium text-[#3525CD] mb-6">
                        <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                        <span className="font-mono text-[11px] uppercase tracking-wide">
                            National Occupational Standards • Placement &amp; Skill Prep
                        </span>
                    </div>

                    <h1 className="font-display text-3xl sm:text-5xl lg:text-[48px] font-semibold text-[#0F172A] tracking-[-0.025em] leading-[1.12] mb-5 max-w-4xl mx-auto">
                        Engineering &amp; Vocational Readiness.{" "}
                        <span className="text-[#4F46E5]">Measured with Precision.</span>
                    </h1>

                    <p className="text-[15px] sm:text-[17px] text-[#464555] max-w-2xl mx-auto leading-relaxed mb-8">
                        Sign in to upload your resume, diagnose competency gaps against QP-NOS standards or live job links with Google Gemini AI, and map free PMKVY 4.0 bridge training.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
                        <Link href="/login?callbackUrl=/resume-analyser">
                            <Button size="lg" className="w-full sm:w-auto px-6">
                                <Sparkles className="h-4 w-4" />
                                <span>Sign In &amp; Open AI Matcher</span>
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="/login?callbackUrl=/dashboard">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto px-6">
                                <Terminal className="h-4 w-4 text-[#4F46E5]" />
                                <span>Candidate Dashboard Demo</span>
                            </Button>
                        </Link>
                    </div>

                    {/* Interactive Clean Minimal Workspace Preview Card */}
                    <div className="max-w-5xl mx-auto text-left rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] p-3 sm:p-4 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.08)]">
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 px-2 border-b border-[#E2E8F0]">
                            <div className="flex items-center gap-2">
                                <span className="h-5 w-5 rounded bg-[#4F46E5] text-white font-mono text-[10px] font-bold flex items-center justify-center">
                                    S
                                </span>
                                <span className="font-mono text-[11px] font-semibold text-[#0F172A]">
                                    pmkvy://skill-gap/resume-analyser
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                                    Gemini AI + NOS Engine
                                </span>
                                <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-white text-[#64748B] border border-[#E2E8F0]">
                                    NSQF Level 5–6
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                            <div className="lg:col-span-5 bg-white rounded-xl border border-[#E2E8F0] p-5 flex flex-col justify-between space-y-4">
                                <div className="space-y-3.5">
                                    <div className="flex items-center justify-between pb-2.5 border-b border-[#F1F5F9]">
                                        <span className="font-display text-[14px] font-semibold text-[#0F172A]">
                                            Candidate Diagnostic Input
                                        </span>
                                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#EAEDFF] text-[#3525CD] font-medium">
                                            STEP 01
                                        </span>
                                    </div>

                                    <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5">
                                        <div className="flex items-center justify-between text-[12px] font-medium text-[#0F172A]">
                                            <span className="flex items-center gap-1.5">
                                                <FileCheck className="h-4 w-4 text-[#4F46E5]" />
                                                Arun_Kumar_Resume.pdf
                                            </span>
                                            <span className="font-mono text-[10px] text-[#065F46] bg-[#ECFDF5] px-1.5 py-0.5 rounded">
                                                PARSED
                                            </span>
                                        </div>
                                        <p className="text-[12px] text-[#64748B]">
                                            Full Stack Developer • React.js, Node.js, SQL (1.5 yrs)
                                        </p>
                                    </div>

                                    <div className="p-3 rounded-lg bg-[#F2F3FF] border border-[#C7C4D8]/80 space-y-1">
                                        <div className="flex items-center justify-between text-[11px] font-mono text-[#3525CD]">
                                            <span className="flex items-center gap-1">
                                                <Search className="h-3 w-3" /> TARGET ROLE OR JOB LINK
                                            </span>
                                            <span>SSC/Q0508</span>
                                        </div>
                                        <p className="text-[13px] font-semibold text-[#0F172A]">
                                            Full Stack Developer • Cloud Architecture
                                        </p>
                                    </div>
                                </div>

                                <Link
                                    href="/login?callbackUrl=/resume-analyser"
                                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-lg text-[13px] font-medium transition-colors"
                                >
                                    <span>Sign In to Run Audit</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>

                            <div className="lg:col-span-7 bg-white rounded-xl border border-[#E2E8F0] p-5 space-y-4">
                                <div className="flex items-center justify-between pb-2.5 border-b border-[#F1F5F9]">
                                    <div>
                                        <h3 className="font-display text-[15px] font-semibold text-[#0F172A]">
                                            Competency Match &amp; Deficit Matrix
                                        </h3>
                                        <p className="text-[12px] text-[#64748B]">
                                            Evaluated against IT-ITeS Sector Skills Council (NASSCOM)
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <span className="font-mono text-[22px] font-bold text-[#3525CD] leading-none">
                                                84%
                                            </span>
                                            <span className="block font-mono text-[10px] text-[#065F46]">
                                                READINESS
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5">
                                        <div className="flex items-center justify-between text-[12px]">
                                            <span className="font-medium text-[#0F172A] flex items-center gap-2">
                                                <span className="font-mono text-[11px] text-[#4F46E5]">SSC/N0508</span>
                                                React.js &amp; Next.js Architecture
                                            </span>
                                            <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                                                92% Verified
                                            </span>
                                        </div>
                                        <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                                            <div className="h-full bg-[#10B981] rounded-full" style={{ width: "92%" }} />
                                        </div>
                                    </div>

                                    <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5">
                                        <div className="flex items-center justify-between text-[12px]">
                                            <span className="font-medium text-[#0F172A] flex items-center gap-2">
                                                <span className="font-mono text-[11px] text-[#4F46E5]">SSC/N0705</span>
                                                Containerization &amp; Docker
                                            </span>
                                            <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]">
                                                Critical Gap (-55%)
                                            </span>
                                        </div>
                                        <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                                            <div className="h-full bg-[#BA1A1A] rounded-full" style={{ width: "30%" }} />
                                        </div>
                                    </div>

                                    <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5">
                                        <div className="flex items-center justify-between text-[12px]">
                                            <span className="font-medium text-[#0F172A] flex items-center gap-2">
                                                <span className="font-mono text-[11px] text-[#4F46E5]">SSC/N0702</span>
                                                Cloud Infrastructure (AWS/Azure)
                                            </span>
                                            <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]">
                                                Needs Work (-20%)
                                            </span>
                                        </div>
                                        <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                                            <div className="h-full bg-[#F59E0B] rounded-full" style={{ width: "60%" }} />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-3 rounded-lg bg-[#ECFDF5]/60 border border-[#A7F3D0] flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2.5">
                                        <CheckCircle2 className="h-4 w-4 text-[#065F46] shrink-0" />
                                        <div className="text-[12px]">
                                            <span className="font-semibold text-[#0F172A]">
                                                PMKVY Bridge Match: Cloud Architecture &amp; Docker
                                            </span>
                                            <span className="block text-[11px] text-[#065F46]">
                                                100% Govt Subsidized • 50 Hours • NSQF Level 6
                                            </span>
                                        </div>
                                    </div>
                                    <span className="font-mono text-[11px] font-semibold text-[#3525CD] shrink-0">
                                        FREE →
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4-Step Pipeline */}
            <section className="py-16 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <span className="font-mono text-[11px] uppercase tracking-wider text-[#4F46E5] font-semibold">
                            WORKFLOW PIPELINE
                        </span>
                        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#0F172A] tracking-tight mt-1">
                            Four deterministic steps to readiness.
                        </h2>
                    </div>
                    <p className="text-[14px] text-[#64748B] max-w-md">
                        Built to mirror real industry ATS audits and India&apos;s National Skills Qualifications Framework.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {steps.map((item) => (
                        <div key={item.step} className="prepp-card prepp-card-interactive p-5 flex flex-col justify-between">
                            <div>
                                <div className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-[#EAEDFF] text-[#3525CD] font-mono text-[11px] font-semibold mb-3">
                                    STEP {item.step}
                                </div>
                                <h3 className="font-display text-[16px] font-semibold text-[#0F172A] mb-1.5">
                                    {item.title}
                                </h3>
                                <p className="text-[13px] text-[#64748B] leading-relaxed">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Core Modules */}
            <section className="py-16 px-4 sm:px-6 bg-white border-y border-[#E2E8F0]">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-10">
                        <span className="font-mono text-[11px] uppercase tracking-wider text-[#4F46E5] font-semibold">
                            PLATFORM MODULES
                        </span>
                        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#0F172A] tracking-tight mt-1">
                            Focused tools for technical placement &amp; upskilling.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {features.map((feature) => (
                            <div key={feature.title} className="prepp-card prepp-card-interactive p-6 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#EAEDFF] text-[#3525CD]">
                                            <feature.icon className="h-4.5 w-4.5" />
                                        </div>
                                        <span className="font-mono text-[11px] text-[#64748B]">{feature.code}</span>
                                    </div>
                                    <h3 className="font-display text-[16px] font-semibold text-[#0F172A] mb-1.5">
                                        {feature.title}
                                    </h3>
                                    <p className="text-[13px] text-[#64748B] leading-relaxed">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SSC Directory */}
            <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full">
                <div className="mb-8">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[#4F46E5] font-semibold">
                        QP-NOS BENCHMARKS
                    </span>
                    <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#0F172A] tracking-tight mt-1">
                        Aligned with National Sector Skill Councils.
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {domains.map((domain) => (
                        <Link
                            key={domain.name}
                            href="/login?callbackUrl=/skill-gap"
                            className="prepp-card prepp-card-interactive p-4 flex flex-col justify-between group"
                        >
                            <div>
                                <div className="flex items-center justify-between gap-2 mb-2.5">
                                    <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EAEDFF] text-[#3525CD]">
                                        {domain.tag}
                                    </span>
                                    <span className="font-mono text-[10px] text-[#64748B]">{domain.level}</span>
                                </div>
                                <h4 className="font-display text-[14px] font-semibold text-[#0F172A] group-hover:text-[#4F46E5] transition-colors">
                                    {domain.name}
                                </h4>
                            </div>
                            <div className="mt-4 pt-2.5 border-t border-[#F1F5F9] flex items-center justify-between text-[12px] text-[#64748B] font-mono">
                                <span>{domain.count}</span>
                                <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Final CTA Banner */}
            <section className="py-14 px-4 sm:px-6 bg-white border-t border-[#E2E8F0]">
                <div className="max-w-4xl mx-auto prepp-card p-8 sm:p-10 bg-gradient-to-br from-white to-[#F2F3FF] text-center space-y-5">
                    <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#0F172A] tracking-tight">
                        Ready to benchmark your skillset?
                    </h2>
                    <p className="text-[14px] sm:text-[15px] text-[#464555] max-w-xl mx-auto">
                        Sign in to run AI resume &amp; job link diagnostics, complete competency checks, and discover free PMKVY bridge courses.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link href="/login?callbackUrl=/resume-analyser">
                            <Button size="lg">
                                <span>Sign In &amp; Launch AI Analyser</span>
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button variant="outline" size="lg">
                                Create Candidate Account
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-[#E2E8F0] mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] text-[#64748B]">
                    <div className="flex items-center gap-3">
                        <span className="font-display text-[15px] font-semibold text-[#3525CD]">
                            PMKVY Skill Gap Analyser
                        </span>
                        <span className="text-[#CBD5E1]">•</span>
                        <span>
                            © 2026 Skill India &amp; NSQF Placement Platform.
                        </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-5">
                        <Link href="/login?callbackUrl=/resume-analyser" className="hover:text-[#4F46E5] transition-colors">
                            AI Resume Matcher
                        </Link>
                        <Link href="/login?callbackUrl=/courses" className="hover:text-[#4F46E5] transition-colors">
                            Courses
                        </Link>
                        <a href="https://www.skillindiadigital.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-[#4F46E5] transition-colors">
                            Skill India Digital
                        </a>
                        <Link href="/login" className="hover:text-[#4F46E5] transition-colors">
                            Sign In
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
