"use client";
// [FRONTEND] Candidate Overview Dashboard | Route: /dashboard | Uses: GET /api/dashboard, DashboardLayout, Recharts
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    BarChart3,
    BookOpen,
    Compass,
    AlertCircle,
    Sparkles,
    ChevronRight,
    Play,
    Terminal,
    Clock,
    CheckCircle2,
    Flag,
    ArrowRight,
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

    useEffect(() => {
        apiFetch("/api/dashboard")
            .then((res) => res.json())
            .then((d) => {
                setData(d);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex h-96 items-center justify-center">
                    <div className="text-center space-y-2.5">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#4F46E5] border-t-transparent mx-auto" />
                        <p className="font-mono text-[12px] text-[#64748B]">Loading candidate workspace...</p>
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
    const readinessTicks = Math.round(readinessScore / 10);

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

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fade-in">
                {/* 1. Welcome & Overview Hero Card */}
                <section className="prepp-card p-6 lg:p-7">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="space-y-2.5 max-w-2xl">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="px-2 py-0.5 rounded-full bg-[#EAEDFF] text-[#3525CD] font-mono text-[11px] font-semibold uppercase tracking-wide">
                                    NSQF Sprint Track
                                </span>
                                <span className="text-[#CBD5E1]">•</span>
                                <span className="text-[12px] text-[#64748B] flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" /> Live MongoDB / SQLite Telemetry
                                </span>
                            </div>

                            <h1 className="font-display text-2xl sm:text-[28px] font-semibold text-[#0F172A] tracking-[-0.02em]">
                                Prepare for your placement &amp; certification
                            </h1>

                            <p className="text-[14px] text-[#464555] leading-relaxed">
                                Benchmark technical competencies against National Occupational Standards (QP-NOS), close critical gaps, and track PMKVY training progress.
                            </p>

                            <div className="flex flex-wrap items-center gap-2 pt-1">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] text-[12px] font-medium">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" />
                                    <span className="font-mono">Readiness: {readinessScore}%</span>
                                </div>
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F1F5F9] text-[#464555] border border-[#E2E8F0] text-[12px] font-medium">
                                    <Terminal className="h-3.5 w-3.5 text-[#4F46E5]" />
                                    <span>Skills Verified: {stats.totalSkillsAssessed}</span>
                                </div>
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A] text-[12px] font-medium">
                                    <Flag className="h-3.5 w-3.5 text-[#F59E0B]" />
                                    <span>Skill Gap: {stats.overallSkillGap}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Compact Action Goal Widget */}
                        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 lg:w-72 flex flex-col justify-between shrink-0 space-y-3">
                            <div>
                                <div className="flex items-center justify-between text-[12px] text-[#64748B] mb-1.5">
                                    <span>Certification Readiness Goal</span>
                                    <span className="font-mono font-semibold text-[#0F172A]">{readinessScore} / 100</span>
                                </div>
                                <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                                    <div className="bg-[#4F46E5] h-full rounded-full transition-all duration-500" style={{ width: `${readinessScore}%` }} />
                                </div>
                            </div>

                            <div className="pt-2.5 border-t border-[#E2E8F0] flex items-center justify-between gap-2">
                                <div className="min-w-0">
                                    <div className="text-[11px] text-[#64748B]">Recommended Next Step</div>
                                    <div className="text-[13px] font-semibold text-[#0F172A] truncate">
                                        AI Resume Gap Audit
                                    </div>
                                </div>
                                <Link
                                    href="/resume-analyser"
                                    className="p-2 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white transition-colors shrink-0"
                                    title="Launch AI Resume Analyser"
                                >
                                    <Play className="h-4 w-4 fill-current" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. 4-Card Bento Analytics Grid */}
                <section aria-label="Overall Progress Analytics" className="prepp-card p-6 space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F1F5F9] pb-4">
                        <div>
                            <h2 className="font-display text-[17px] font-semibold text-[#0F172A]">
                                Placement Readiness Index &amp; Overall Progress
                            </h2>
                            <p className="text-[13px] text-[#64748B] mt-0.5">
                                Composite evaluation across QP-NOS competencies, practical assessments, and PMKVY courses.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link href="/skill-gap">
                                <Button variant="outline" size="sm">
                                    View Gap Matrix <ChevronRight className="h-3.5 w-3.5" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 flex items-center justify-between gap-3">
                            <div className="space-y-1">
                                <span className="text-[11px] font-medium text-[#64748B]">Avg Proficiency</span>
                                <div className="font-display text-2xl font-semibold text-[#0F172A] font-mono">
                                    {stats.averageProficiency}%
                                </div>
                                <div className="text-[11px] font-mono text-[#065F46] font-medium">
                                    {stats.averageProficiency >= 70 ? "+On Target" : "Upskilling"}
                                </div>
                            </div>
                            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                                    <path
                                        className="text-[#E2E8F0]"
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3.5"
                                    />
                                    <path
                                        className="text-[#4F46E5]"
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeDasharray={`${stats.averageProficiency}, 100`}
                                        strokeLinecap="round"
                                        strokeWidth="3.5"
                                    />
                                </svg>
                                <span className="absolute font-mono text-[11px] font-semibold text-[#0F172A]">
                                    {stats.averageProficiency}%
                                </span>
                            </div>
                        </div>

                        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 space-y-2">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#64748B]">
                                <span>Skills Verified</span>
                                <BarChart3 className="h-4 w-4 text-[#4F46E5]" />
                            </div>
                            <div className="flex items-baseline gap-1.5">
                                <span className="font-display font-mono text-2xl font-semibold text-[#0F172A]">
                                    {stats.totalSkillsAssessed}
                                </span>
                                <span className="text-[12px] text-[#64748B]">competencies</span>
                            </div>
                            <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
                                <div
                                    className="bg-[#10B981] h-full rounded-full"
                                    style={{ width: `${Math.min(100, Math.max(15, stats.totalSkillsAssessed * 12))}%` }}
                                />
                            </div>
                            <div className="text-[11px] text-[#64748B] flex justify-between font-mono">
                                <span>QP-NOS Tracked</span>
                                <span>{stats.overallSkillGap}% gap</span>
                            </div>
                        </div>

                        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 space-y-2">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#64748B]">
                                <span>Readiness Rating</span>
                                <Sparkles className="h-4 w-4 text-[#4F46E5]" />
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="font-display font-mono text-2xl font-semibold text-[#3525CD]">
                                    {ratingOutOfTen}
                                </span>
                                <span className="text-[12px] text-[#64748B]">/ 10 Index</span>
                            </div>
                            <div className="flex gap-1 pt-0.5">
                                {[...Array(10)].map((_, i) => (
                                    <span
                                        key={i}
                                        className={`h-2 flex-1 rounded-full ${
                                            i < readinessTicks ? "bg-[#10B981]" : "bg-[#E2E8F0]"
                                        }`}
                                    />
                                ))}
                            </div>
                            <div className="text-[11px] font-medium text-[#065F46]">
                                {readinessScore >= 75 ? "Industry Screening Ready" : "Complete Bridge Modules"}
                            </div>
                        </div>

                        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 space-y-2">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#64748B]">
                                <span>PMKVY Courses</span>
                                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#EAEDFF] text-[#3525CD] font-semibold">
                                    {stats.coursesCompleted} Done
                                </span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="font-display font-mono text-2xl font-semibold text-[#0F172A]">
                                    {stats.coursesEnrolled}
                                </span>
                                <span className="text-[12px] text-[#64748B]">enrolled</span>
                            </div>
                            <div className="flex items-end gap-1.5 h-6 pt-0.5">
                                {[35, 55, 45, 75, 90, 60, 40].map((h, idx) => (
                                    <div
                                        key={idx}
                                        className="flex-1 bg-[#4F46E5]/30 hover:bg-[#4F46E5] rounded-t transition-colors"
                                        style={{ height: `${h}%` }}
                                    />
                                ))}
                            </div>
                            <div className="text-[11px] font-mono text-[#64748B] flex justify-between">
                                <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Charts Bento Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader className="pb-2 border-b border-[#F1F5F9]">
                            <CardTitle>Skill Proficiency vs Benchmark</CardTitle>
                            <CardDescription>Verified proficiency compared against 85% role benchmark</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                            {skillDistribution.length > 0 ? (
                                <div className="h-72 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={skillDistribution.slice(0, 6)} margin={{ top: 15, right: 15, left: 4, bottom: 28 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                            <XAxis
                                                dataKey="name"
                                                height={52}
                                                tick={{ fontSize: 11, fill: "#64748B" }}
                                                interval={0}
                                                angle={-15}
                                                textAnchor="end"
                                                tickFormatter={(v) => (v && v.length > 14 ? `${v.slice(0, 12)}…` : v)}
                                            />
                                            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#64748B" }} />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "#0F172A",
                                                    borderRadius: "8px",
                                                    color: "#fff",
                                                    border: "none",
                                                    fontSize: "12px",
                                                }}
                                            />
                                            <Bar dataKey="proficiency" name="Proficiency %" fill="#4F46E5" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="h-72 flex flex-col items-center justify-center text-center p-6 border border-dashed border-[#CBD5E1] rounded-lg bg-[#F8FAFC]">
                                    <AlertCircle className="h-8 w-8 text-[#64748B] mb-2" />
                                    <p className="text-[13px] font-medium text-[#0F172A]">No assessed skills yet</p>
                                    <p className="text-[12px] text-[#64748B] mt-1 mb-4">Run an AI Resume Audit or Assessment to populate telemetry</p>
                                    <Link href="/assessment">
                                        <Button size="sm">Start Assessment →</Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2 border-b border-[#F1F5F9]">
                            <CardTitle>Competency Distribution Radar</CardTitle>
                            <CardDescription>Multi-domain balance across evaluated skills</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                            {radarData.length >= 3 ? (
                                <div className="h-72 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="62%" data={radarData}>
                                            <PolarGrid stroke="#E2E8F0" />
                                            <PolarAngleAxis
                                                dataKey="subject"
                                                tick={{ fontSize: 10, fill: "#0F172A" }}
                                                tickFormatter={(v) => (v && v.length > 14 ? `${v.slice(0, 12)}…` : v)}
                                            />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: "#64748B" }} />
                                            <Radar name="Your Skill" dataKey="current" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.28} isAnimationActive={false} />
                                            <Radar name="Target (85%)" dataKey="target" stroke="#10B981" fill="#10B981" fillOpacity={0.1} isAnimationActive={false} />
                                            <Legend wrapperStyle={{ fontSize: "12px" }} />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "#0F172A",
                                                    borderRadius: "8px",
                                                    color: "#fff",
                                                    border: "none",
                                                    fontSize: "12px",
                                                }}
                                            />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="h-72 flex flex-col items-center justify-center text-center p-6 border border-dashed border-[#CBD5E1] rounded-lg bg-[#F8FAFC]">
                                    <Compass className="h-8 w-8 text-[#64748B] mb-2" />
                                    <p className="text-[13px] font-medium text-[#0F172A]">Radar requires at least 3 assessed skills</p>
                                    <p className="text-[12px] text-[#64748B] mt-1 mb-4">Complete an assessment or resume sync to unlock radar</p>
                                    <Link href="/resume-analyser">
                                        <Button size="sm">Run Resume Diagnostic</Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* 4. Trajectory & Enrolled Courses Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-[#F1F5F9]">
                            <div>
                                <CardTitle>Learning Velocity Trajectory</CardTitle>
                                <CardDescription>Proficiency improvement over recent assessments</CardDescription>
                            </div>
                            <Link href="/progress">
                                <Button variant="ghost" size="sm" className="text-[#4F46E5]">
                                    View Progress <ArrowRight className="h-3.5 w-3.5" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={progressLineData} margin={{ top: 10, right: 20, left: -15, bottom: 10 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748B" }} />
                                        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#64748B" }} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#0F172A",
                                                borderRadius: "8px",
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
                        </CardContent>
                    </Card>

                    <Card className="flex flex-col justify-between">
                        <CardHeader className="pb-2 border-b border-[#F1F5F9]">
                            <CardTitle>Enrolled PMKVY Courses</CardTitle>
                            <CardDescription>Active NSDC training tracks</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-3 flex-1">
                            {enrollments.length > 0 ? (
                                enrollments.slice(0, 3).map((enr) => (
                                    <div key={enr.id} className="p-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] space-y-2">
                                        <div className="flex items-start justify-between gap-2">
                                            <h4 className="text-[13px] font-semibold text-[#0F172A] line-clamp-1">
                                                {enr.course?.name || "PMKVY Training Module"}
                                            </h4>
                                            <Badge variant={enr.status === "COMPLETED" ? "success" : "secondary"}>
                                                {enr.status}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B]">
                                            <span>COMPLETION</span>
                                            <span className="font-semibold text-[#0F172A]">{enr.progress}%</span>
                                        </div>
                                        <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
                                            <div
                                                className="bg-[#10B981] h-full rounded-full"
                                                style={{ width: `${enr.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 border border-dashed border-[#CBD5E1] rounded-lg bg-[#F8FAFC]">
                                    <BookOpen className="h-7 w-7 text-[#64748B] mx-auto mb-2" />
                                    <p className="text-[13px] font-medium text-[#0F172A]">No active enrollments</p>
                                    <p className="text-[11px] text-[#64748B] mt-0.5">Browse PMKVY bridge courses</p>
                                </div>
                            )}
                        </CardContent>
                        <div className="p-5 pt-0">
                            <Link href="/courses" className="w-full block">
                                <Button variant="outline" className="w-full justify-center">
                                    Explore Bridge Courses <ArrowRight className="h-3.5 w-3.5" />
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
