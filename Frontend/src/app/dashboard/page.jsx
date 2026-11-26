"use client";
// [FRONTEND] Candidate Overview Dashboard | Route: /dashboard | Uses: GET /api/dashboard, DashboardLayout, Recharts
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { EditorialPageHeader } from "@/components/story/EditorialPageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    BookOpen,
    Compass,
    AlertCircle,
    Sparkles,
    ChevronRight,
    Play,
    Terminal,
    CheckCircle2,
    Flag,
    ArrowRight,
    Layers,
    Target,
} from "lucide-react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    LineChart,
    Line,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Legend,
} from "recharts";

export default function DashboardPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    const [chartTab, setChartTab] = useState("bar");

    useEffect(() => {
        let active = true;
        apiFetch("/api/dashboard")
            .then(async (res) => {
                const payload = await res.json().catch(() => ({}));
                if (!res.ok) {
                    throw new Error(payload.error || "Unable to load dashboard telemetry.");
                }
                return payload;
            })
            .then((d) => {
                if (!active) return;
                setData(d);
                setLoading(false);
            })
            .catch((err) => {
                if (!active) return;
                console.error(err);
                setErrorMsg(err.message || "Could not load dashboard metrics.");
                setLoading(false);
            });
        return () => {
            active = false;
        };
    }, []);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex h-96 items-center justify-center">
                    <div className="text-center space-y-2.5">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#4F46E5] border-t-transparent mx-auto" />
                        <p className="font-mono text-[12px] text-[#52525B]">Loading candidate workspace...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const stats = data?.stats || {
        totalSkillsAssessed: 0,
        averageProficiency: 0,
        overallSkillGap: 0,
        coursesEnrolled: 0,
        coursesCompleted: 0,
    };
    const skillDistribution = data?.skillDistribution || [];
    const enrollments = data?.enrollments || [];
    const recentProgress = data?.recentProgress || [];
    const readinessScore = Math.max(0, Math.min(100, stats.averageProficiency || Math.max(0, 100 - stats.overallSkillGap)));
    const ratingOutOfTen = (readinessScore / 10).toFixed(1);

    const radarData = skillDistribution.slice(0, 6).map((s) => ({
        subject: s.name.length > 14 ? s.name.substring(0, 12) + "..." : s.name,
        current: s.proficiency,
        target: 85,
    }));

    const progressLineData =
        recentProgress.length > 0
            ? recentProgress.map((p) => ({
                  date: new Date(p.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
                  proficiency: p.proficiency,
                  skill: p.skillName,
              }))
            : [
                  { date: "Week 1", proficiency: 25 },
                  { date: "Week 2", proficiency: 38 },
                  { date: "Week 3", proficiency: 52 },
                  { date: "Week 4", proficiency: 65 },
              ];

    const miniBars =
        skillDistribution.length > 0
            ? skillDistribution.slice(0, 7).map((s) => ({
                  label: s.name.length > 8 ? s.name.slice(0, 7) + "…" : s.name,
                  value: Math.max(8, Math.round(s.proficiency || 0)),
              }))
            : [
                  { label: "Mon", value: 28 },
                  { label: "Tue", value: 52 },
                  { label: "Wed", value: 82 },
                  { label: "Thu", value: 38 },
                  { label: "Fri", value: 64 },
                  { label: "Sat", value: 48 },
                  { label: "Sun", value: 70 },
              ];
    const peakBarValue = Math.max(...miniBars.map((b) => b.value), 0);
    const ringRadius = 52;
    const ringCircumference = 2 * Math.PI * ringRadius;
    const ringDashOffset = ringCircumference - (readinessScore / 100) * ringCircumference;

    const modulePreviewItems =
        enrollments.length > 0
            ? enrollments.slice(0, 3).map((enr, idx) => ({
                  id: enr.id,
                  title: enr.course?.name || "PMKVY Module",
                  sub: `${enr.progress}% • ${enr.status === "COMPLETED" ? "Done" : "Active"}`,
                  tone:
                      idx === 0
                          ? "bg-[#FFF3E6] text-[#D97706]"
                          : idx === 1
                          ? "bg-[#ECFDF5] text-[#059669]"
                          : "bg-[#EEF4FF] text-[#2563EB]",
                  Icon: idx === 0 ? Layers : idx === 1 ? CheckCircle2 : Compass,
              }))
            : [
                  {
                      id: "starter-1",
                      title: "AI Resume Audit",
                      sub: "2 min scan",
                      tone: "bg-[#FFF3E6] text-[#D97706]",
                      Icon: Sparkles,
                  },
                  {
                      id: "starter-2",
                      title: "Skill Gap Matrix",
                      sub: "QP-NOS check",
                      tone: "bg-[#ECFDF5] text-[#059669]",
                      Icon: Target,
                  },
                  {
                      id: "starter-3",
                      title: "Bridge Catalog",
                      sub: "Govt subsidized",
                      tone: "bg-[#EEF4FF] text-[#2563EB]",
                      Icon: BookOpen,
                  },
              ];

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fade-in">
                {errorMsg && (
                    <div className="flex items-center gap-2.5 rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[13px] font-medium text-[#991B1B]">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{errorMsg}</span>
                    </div>
                )}

                {/* 1. Editorial Studio Welcome & Overview Header */}
                <EditorialPageHeader
                    variant="studio"
                    eyebrow="CANDIDATE WORKSPACE • LIVE MONGODB TELEMETRY"
                    title="Prepare for your placement"
                    italicAccent="& certification."
                    description="Benchmark technical competencies against National Occupational Standards (QP-NOS), close critical gaps, and track PMKVY 4.0 training progress."
                    badges={
                        <>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-200 border border-emerald-400/25 text-[12px] font-medium">
                                <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" />
                                <span className="font-mono">Readiness: {readinessScore}%</span>
                            </div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/85 border border-white/10 text-[12px] font-medium">
                                <Terminal className="h-3.5 w-3.5 text-indigo-300" />
                                <span>Skills Verified: {stats.totalSkillsAssessed}</span>
                            </div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-200 border border-amber-400/25 text-[12px] font-medium">
                                <Flag className="h-3.5 w-3.5 text-[#F59E0B]" />
                                <span>Skill Gap: {stats.overallSkillGap}%</span>
                            </div>
                        </>
                    }
                    rightSlot={
                        <div className="bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-2xl p-4 lg:w-72 flex flex-col justify-between space-y-3">
                            <div>
                                <div className="flex items-center justify-between text-[12px] text-white/70 mb-1.5">
                                    <span>Certification Readiness Goal</span>
                                    <span className="font-mono font-semibold text-white">{readinessScore} / 100</span>
                                </div>
                                <div className="w-full bg-white/15 h-2 rounded-full overflow-hidden">
                                    <div className="bg-[#10B981] h-full rounded-full transition-all duration-500" style={{ width: `${readinessScore}%` }} />
                                </div>
                            </div>

                            <div className="pt-2.5 border-t border-white/10 flex items-center justify-between gap-2">
                                <div className="min-w-0">
                                    <div className="text-[11px] text-white/60">Recommended Next Step</div>
                                    <div className="text-[13px] font-semibold text-white truncate">
                                        AI Resume Gap Audit
                                    </div>
                                </div>
                                <Link
                                    href="/resume-analyser"
                                    className="p-2.5 rounded-full bg-[#9E331A] hover:bg-[#B83D20] text-white transition-colors shrink-0 shadow-md"
                                    title="Launch AI Resume Analyser"
                                >
                                    <Play className="h-4 w-4 fill-current" />
                                </Link>
                            </div>
                        </div>
                    }
                />

                {/* 2. Top Bento Strip (Reference 3 Style: Radial Gauge + Sage Spotlight + Minimalist Activity Bars) */}
                <section aria-label="Overall Progress Analytics" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
                    {/* Card A: Radial Readiness Ring */}
                    <div className="lg:col-span-3 prepp-card prepp-card-interactive p-6 flex flex-col items-center justify-between text-center min-h-[250px]">
                        <div className="relative w-32 h-32 flex items-center justify-center">
                            <svg className="w-32 h-32 -rotate-90" viewBox="0 0 128 128">
                                <defs>
                                    <linearGradient id="readinessRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#86BA6C" />
                                        <stop offset="55%" stopColor="#A9B85C" />
                                        <stop offset="100%" stopColor="#DF9A57" />
                                    </linearGradient>
                                </defs>
                                <circle
                                    cx="64"
                                    cy="64"
                                    r={ringRadius}
                                    fill="none"
                                    stroke="#F1F2F4"
                                    strokeWidth="7"
                                />
                                <circle
                                    cx="64"
                                    cy="64"
                                    r={ringRadius}
                                    fill="none"
                                    stroke="url(#readinessRingGrad)"
                                    strokeWidth="7"
                                    strokeLinecap="round"
                                    strokeDasharray={ringCircumference}
                                    strokeDashoffset={ringDashOffset}
                                    className="transition-all duration-700"
                                />
                                <circle cx="64" cy={64 - ringRadius} r="3.5" fill="#86BA6C" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="font-display text-[28px] font-bold tracking-tight text-[#111113]">
                                    {readinessScore}%
                                </span>
                            </div>
                        </div>

                        <div className="space-y-0.5 mt-3">
                            <h2 className="font-display text-[17px] font-semibold text-[#111113]">
                                Readiness Score
                            </h2>
                            <p className="text-[12.5px] text-[#71717A]">
                                {stats.totalSkillsAssessed} competencies verified
                            </p>
                        </div>
                    </div>

                    {/* Card B: Sage Green Featured Action Card (Ref 3 Style) */}
                    <Link
                        href="/resume-analyser"
                        className="lg:col-span-3 bento-sage-card relative overflow-hidden p-6 flex flex-col justify-between min-h-[250px] group"
                    >
                        {/* Soft 3D-style floating geometric accents */}
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -top-5 right-5 w-16 h-16 rounded-full bg-gradient-to-br from-[#FA9A78] to-[#DE6A45] opacity-90 shadow-lg group-hover:scale-105 transition-transform duration-500"
                        />
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute top-14 left-5 w-11 h-11 rounded-xl rotate-12 bg-gradient-to-br from-[#F7E3D4] to-[#E6BFA8] opacity-90 shadow-md group-hover:rotate-6 transition-transform duration-500"
                        />
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute top-16 right-4 w-10 h-10 rounded-full bg-gradient-to-br from-[#4F783C] to-[#27461B] opacity-85 shadow-md"
                        />

                        <div className="relative z-10 flex items-center justify-between">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white text-[#141913] font-mono text-[10.5px] font-semibold shadow-xs">
                                #QP-NOS
                            </span>
                            <span className="font-mono text-[10.5px] font-semibold text-[#141913]/70">
                                {ratingOutOfTen} / 10
                            </span>
                        </div>

                        <div className="relative z-10 mt-16 space-y-3">
                            <h3 className="font-display text-[20px] font-semibold leading-snug text-[#141913]">
                                AI Resume Gap Audit
                            </h3>
                            <div className="flex items-center justify-between">
                                <span className="text-[12px] font-medium text-[#141913]/75">
                                    {stats.overallSkillGap}% gap remaining
                                </span>
                                <span className="h-9 w-9 rounded-full bg-[#18181B] text-white flex items-center justify-center shadow-md group-hover:translate-x-1 transition-transform">
                                    <ChevronRight className="h-4 w-4" />
                                </span>
                            </div>
                        </div>
                    </Link>

                    {/* Card C: Minimalist Slim Bar Metric Card (Ref 3 "Total Hours" Style) */}
                    <div className="lg:col-span-6 prepp-card prepp-card-interactive p-6 flex flex-col justify-between min-h-[250px]">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h2 className="font-display text-[17px] font-semibold text-[#111113]">
                                    Skill Proficiency
                                </h2>
                                <p className="text-[12px] text-[#71717A] mt-0.5">
                                    {skillDistribution.length > 0
                                        ? "Live proficiency bars across top assessed competencies"
                                        : "Weekly readiness momentum preview"}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="font-display text-[20px] font-bold tracking-tight text-[#111113]">
                                    {stats.averageProficiency}%
                                </span>
                                <span className="ml-1 text-[12px] font-medium text-[#71717A]">Avg</span>
                            </div>
                        </div>

                        <div className="relative mt-6 pt-6">
                            {/* Subtle horizontal reference threshold line */}
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute left-8 right-2 top-[42%] border-t border-dashed border-[#E4E6EB]"
                            />

                            <div className="relative flex items-end justify-between gap-3 sm:gap-5 h-32 pl-8 pr-2">
                                {/* Minimal Y labels */}
                                <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10.5px] font-mono text-[#9CA3AF]">
                                    <span>100</span>
                                    <span>75</span>
                                    <span>50</span>
                                    <span>0</span>
                                </div>

                                {miniBars.map((bar, idx) => {
                                    const isPeak = bar.value === peakBarValue;
                                    const barHeightPct = Math.max(12, Math.min(100, bar.value));
                                    return (
                                        <div key={`${bar.label}-${idx}`} className="flex-1 flex flex-col items-center h-full justify-end group">
                                            <div className="relative w-full flex flex-col items-center justify-end h-24">
                                                {isPeak && (
                                                    <span className="mb-1.5 px-2 py-0.5 rounded-md bg-[#18181B] text-white font-mono text-[10px] font-semibold whitespace-nowrap shadow-sm">
                                                        {bar.value}%
                                                    </span>
                                                )}
                                                <div
                                                    className={`w-2 sm:w-2.5 rounded-full transition-all duration-500 ${
                                                        isPeak
                                                            ? "bg-[#86BA6C] shadow-[0_6px_14px_-3px_rgba(134,186,108,0.65)]"
                                                            : "bg-[#E5E7EB] group-hover:bg-[#4F46E5]/55"
                                                    }`}
                                                    style={{ height: `${barHeightPct}%` }}
                                                    title={`${bar.label}: ${bar.value}%`}
                                                />
                                            </div>
                                            <span
                                                className={`mt-2.5 text-[10.5px] font-medium truncate max-w-[54px] ${
                                                    isPeak ? "text-[#111113] font-semibold" : "text-[#9CA3AF]"
                                                }`}
                                            >
                                                {bar.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Lower 2-Column Bento: Nested Bridge Modules + Multi-View Chart Deck */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    {/* Left Bento Card: Bridge Courses & Activity Schedule (Ref 3 Bottom Cards) */}
                    <Card className="lg:col-span-5 flex flex-col justify-between">
                        <CardHeader className="pb-4 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Bridge Modules</CardTitle>
                                <CardDescription>Active NSDC tracks &amp; recent milestones</CardDescription>
                            </div>
                            <span className="font-mono text-[12px] font-medium text-[#71717A]">
                                {enrollments.length} enrolled
                            </span>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {/* 3 Miniature Centered Soft Sub-Cards */}
                            <div className="grid grid-cols-3 gap-2.5">
                                {modulePreviewItems.map((item) => {
                                    const Icon = item.Icon;
                                    return (
                                        <Link
                                            key={item.id}
                                            href={enrollments.length > 0 ? "/progress" : "/courses"}
                                            className="bento-subtile p-3.5 flex flex-col items-center text-center hover:bg-white hover:shadow-[0_10px_24px_-10px_rgba(17,17,19,0.12)] transition-all"
                                        >
                                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-2.5 ${item.tone}`}>
                                                <Icon className="h-4.5 w-4.5" />
                                            </div>
                                            <div className="text-[12px] font-semibold text-[#111113] line-clamp-1">
                                                {item.title}
                                            </div>
                                            <div className="text-[10.5px] text-[#71717A] mt-0.5 font-mono">
                                                {item.sub}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Lavender Tinted Row Items (Matching "Music / 80%" row in Ref 3) */}
                            <div className="space-y-2.5">
                                {enrollments.length > 0 ? (
                                    enrollments.slice(0, 2).map((enr) => (
                                        <Link
                                            key={enr.id}
                                            href="/progress"
                                            className="flex items-center justify-between gap-3 rounded-2xl bg-[#F2F3FB] hover:bg-[#EAECFA] px-4 py-3 transition-colors"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center text-[#4F46E5] shadow-2xs shrink-0">
                                                    <BookOpen className="h-4 w-4" />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-[13px] font-semibold text-[#111113] truncate">
                                                        {enr.course?.name || "PMKVY Training Module"}
                                                    </div>
                                                    <div className="text-[11px] text-[#71717A]">
                                                        {enr.status === "COMPLETED" ? "Certification ready" : "Active NSDC lab"}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="font-mono text-[13px] font-bold text-[#111113] shrink-0">
                                                {enr.progress}%
                                            </span>
                                        </Link>
                                    ))
                                ) : (
                                    <Link
                                        href="/career-path"
                                        className="flex items-center justify-between gap-3 rounded-2xl bg-[#F2F3FB] hover:bg-[#EAECFA] px-4 py-3 transition-colors"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center text-[#4F46E5] shadow-2xs shrink-0">
                                                <Compass className="h-4 w-4" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-[13px] font-semibold text-[#111113] truncate">
                                                    Career Path Benchmarks
                                                </div>
                                                <div className="text-[11px] text-[#71717A]">
                                                    Compare 8+ NSQF sectors
                                                </div>
                                            </div>
                                        </div>
                                        <span className="font-mono text-[12px] font-bold text-[#4F46E5] shrink-0">
                                            Explore →
                                        </span>
                                    </Link>
                                )}
                            </div>
                        </CardContent>

                        <div className="px-6 pb-6 pt-1">
                            <Link href="/courses" className="block">
                                <Button variant="default" className="w-full justify-center rounded-xl h-10">
                                    Explore All Bridge Courses <ArrowRight className="h-3.5 w-3.5" />
                                </Button>
                            </Link>
                        </div>
                    </Card>

                    {/* Right Bento Card: Compact Switchable Analytics Chart Card */}
                    <Card className="lg:col-span-7 flex flex-col justify-between">
                        <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <CardTitle>
                                    {chartTab === "bar"
                                        ? "Skill Proficiency vs Benchmark"
                                        : chartTab === "radar"
                                        ? "Competency Distribution Radar"
                                        : "Learning Velocity Trajectory"}
                                </CardTitle>
                                <CardDescription>
                                    {chartTab === "bar"
                                        ? "Verified candidate scores against 85% role benchmark"
                                        : chartTab === "radar"
                                        ? "Multi-domain skill footprint vs target level"
                                        : "Proficiency improvement across recent audits"}
                                </CardDescription>
                            </div>

                            <div className="inline-flex items-center gap-1 rounded-full bg-[#F4F5F7] p-1 border border-black/[0.04] self-start">
                                {[
                                    { id: "bar", label: "Proficiency" },
                                    { id: "radar", label: "Radar" },
                                    { id: "line", label: "Trajectory" },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setChartTab(tab.id)}
                                        className={`px-3 py-1 rounded-full text-[11.5px] font-medium transition-all cursor-pointer ${
                                            chartTab === tab.id
                                                ? "bg-[#111113] text-white shadow-xs"
                                                : "text-[#52525B] hover:text-[#111113]"
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </CardHeader>

                        <CardContent className="pt-2 flex-1">
                            {chartTab === "bar" && (
                                skillDistribution.length > 0 ? (
                                    <div className="h-72 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={skillDistribution.slice(0, 6)} margin={{ top: 15, right: 15, left: 4, bottom: 28 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                                <XAxis
                                                    dataKey="name"
                                                    height={52}
                                                    tick={{ fontSize: 11, fill: "#52525B" }}
                                                    interval={0}
                                                    angle={-15}
                                                    textAnchor="end"
                                                    tickFormatter={(v) => (v && v.length > 14 ? `${v.slice(0, 12)}…` : v)}
                                                />
                                                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#52525B" }} />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: "#111113",
                                                        borderRadius: "10px",
                                                        color: "#fff",
                                                        border: "none",
                                                        fontSize: "12px",
                                                    }}
                                                />
                                                <Bar dataKey="proficiency" name="Proficiency %" fill="#86BA6C" radius={[8, 8, 8, 8]} isAnimationActive={false} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="h-72 flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-[#F7F8FA] border border-dashed border-[#D5D2CA]">
                                        <AlertCircle className="h-8 w-8 text-[#52525B] mb-2" />
                                        <p className="text-[13px] font-medium text-[#111113]">No assessed skills yet</p>
                                        <p className="text-[12px] text-[#52525B] mt-1 mb-4">Run an AI Resume Audit or Assessment to populate telemetry</p>
                                        <Link href="/assessment">
                                            <Button size="sm">Start Assessment →</Button>
                                        </Link>
                                    </div>
                                )
                            )}

                            {chartTab === "radar" && (
                                radarData.length >= 3 ? (
                                    <div className="h-72 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart cx="50%" cy="50%" outerRadius="62%" data={radarData}>
                                                <PolarGrid stroke="#E5E7EB" />
                                                <PolarAngleAxis
                                                    dataKey="subject"
                                                    tick={{ fontSize: 10, fill: "#111113" }}
                                                    tickFormatter={(v) => (v && v.length > 14 ? `${v.slice(0, 12)}…` : v)}
                                                />
                                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: "#52525B" }} />
                                                <Radar name="Your Skill" dataKey="current" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.25} isAnimationActive={false} />
                                                <Radar name="Target (85%)" dataKey="target" stroke="#86BA6C" fill="#86BA6C" fillOpacity={0.14} isAnimationActive={false} />
                                                <Legend wrapperStyle={{ fontSize: "12px" }} />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: "#111113",
                                                        borderRadius: "10px",
                                                        color: "#fff",
                                                        border: "none",
                                                        fontSize: "12px",
                                                    }}
                                                />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="h-72 flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-[#F7F8FA] border border-dashed border-[#D5D2CA]">
                                        <Compass className="h-8 w-8 text-[#52525B] mb-2" />
                                        <p className="text-[13px] font-medium text-[#111113]">Radar requires at least 3 assessed skills</p>
                                        <p className="text-[12px] text-[#52525B] mt-1 mb-4">Complete an assessment or resume sync to unlock radar</p>
                                        <Link href="/resume-analyser">
                                            <Button size="sm">Run Resume Diagnostic</Button>
                                        </Link>
                                    </div>
                                )
                            )}

                            {chartTab === "line" && (
                                <div className="h-72 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={progressLineData} margin={{ top: 15, right: 20, left: -12, bottom: 10 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#52525B" }} />
                                            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#52525B" }} />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "#111113",
                                                    borderRadius: "10px",
                                                    color: "#fff",
                                                    border: "none",
                                                    fontSize: "12px",
                                                }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="proficiency"
                                                name="Proficiency %"
                                                stroke="#4F46E5"
                                                strokeWidth={2.5}
                                                dot={{ r: 4, fill: "#4F46E5" }}
                                                activeDot={{ r: 6 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
