"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, XCircle, BookOpen, Compass, Info } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

function SkillGapContent() {
    const searchParams = useSearchParams();
    const jobRoleIdParam = searchParams.get("jobRoleId");
    const isJustCompleted = searchParams.get("completed") === "true";
    const [assessments, setAssessments] = useState([]);
    const [availableRoles, setAvailableRoles] = useState([]);
    const [selectedJobRoleId, setSelectedJobRoleId] = useState(jobRoleIdParam || "");
    const [analysisData, setAnalysisData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/skill-gap")
            .then((res) => res.json())
            .then((data) => {
                const assList = data.assessments || [];
                const rolesList = data.jobRoles || [];
                setAssessments(assList);
                setAvailableRoles(rolesList);
                if (!selectedJobRoleId) {
                    if (assList.length > 0 && assList[0].jobRoleId) {
                        setSelectedJobRoleId(assList[0].jobRoleId);
                    } else if (rolesList.length > 0) {
                        setSelectedJobRoleId(rolesList[0].id);
                    }
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (!selectedJobRoleId) return;
        setLoading(true);
        fetch(`/api/skill-gap?jobRoleId=${selectedJobRoleId}`)
            .then((res) => res.json())
            .then((data) => {
                setAnalysisData(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [selectedJobRoleId]);

    const skills = analysisData?.skills || analysisData?.skillGapResults || [];
    const metSkills = skills.filter((s) => s.status === "met" || s.status === "MET");
    const improvementSkills = skills.filter((s) => s.status === "improvement" || s.status === "MODERATE_GAP");
    const missingSkills = skills.filter((s) => s.status === "missing" || s.status === "CRITICAL_GAP");
    const overallGap =
        analysisData?.overallGap ??
        (typeof analysisData?.overallMatchPercentage === "number" ? 100 - analysisData.overallMatchPercentage : 0);

    const chartData = skills.map((s) => ({
        name: s.skillName.length > 15 ? s.skillName.substring(0, 13) + "..." : s.skillName,
        "Required Proficiency": s.requiredProficiency,
        "Your Proficiency": s.candidateProficiency ?? s.currentProficiency ?? 0,
    }));

    return (
        <div className="space-y-6 animate-fade-in">
            <nav className="flex items-center gap-2 text-[12px] font-mono text-[#64748B]">
                <Link href="/dashboard" className="hover:text-[#4F46E5]">Dashboard</Link>
                <span className="text-[#CBD5E1]">/</span>
                <span className="text-[#0F172A] font-medium">Skill Gap Matrix</span>
            </nav>

            {isJustCompleted && (
                <div className="p-3.5 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-[13px]">
                        <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0" />
                        <span>
                            <strong>Assessment Evaluated:</strong> Your skills have been benchmarked against QP-NOS standards.
                        </span>
                    </div>
                    <Badge variant="success">Updated</Badge>
                </div>
            )}

            {/* Header Card */}
            <div className="prepp-card p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">Competency Benchmarking</Badge>
                        </div>
                        <h1 className="font-display text-2xl sm:text-[28px] font-semibold text-[#0F172A] tracking-tight">
                            Skill Gap Analysis
                        </h1>
                        <p className="text-[14px] text-[#64748B] mt-1 max-w-2xl">
                            Weighted proficiency calculation comparing candidate evidence against Qualification Pack requirements.
                        </p>
                    </div>

                    {(assessments.length > 0 || availableRoles.length > 0) && (
                        <div className="flex items-center gap-2 bg-[#F8FAFC] p-2 rounded-lg border border-[#E2E8F0]">
                            <span className="font-mono text-[11px] font-semibold text-[#64748B] pl-1">
                                {assessments.length > 0 ? "ROLE:" : "TARGET:"}
                            </span>
                            <select
                                value={selectedJobRoleId}
                                onChange={(e) => setSelectedJobRoleId(e.target.value)}
                                className="h-8 text-[13px] font-medium text-[#0F172A] bg-white border border-[#CBD5E1] rounded-md px-2.5 focus:outline-none focus:border-[#4F46E5]"
                            >
                                {assessments.length > 0
                                    ? assessments.map((a) => (
                                          <option key={a.id} value={a.jobRoleId}>
                                              {a.jobRole?.title || "Assessed Role"} ({Math.round(a.skillGap || 0)}% gap)
                                          </option>
                                      ))
                                    : availableRoles.map((role) => (
                                          <option key={role.id} value={role.id}>
                                              {role.title} ({role.domain})
                                          </option>
                                      ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>

            {/* Formula Strip */}
            <div className="prepp-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F8FAFC]">
                <div className="flex items-center gap-2.5 text-[13px] text-[#464555]">
                    <Info className="h-4 w-4 text-[#4F46E5] shrink-0" />
                    <span className="font-medium text-[#0F172A]">Gap Formula:</span>
                </div>
                <code className="font-mono bg-white px-3 py-1 rounded-md border border-[#E2E8F0] text-[#3525CD] text-[12px]">
                    Gap (%) = ((Required - Candidate) / Required) × 100
                </code>
            </div>

            {/* 4 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="prepp-card p-5 flex flex-col justify-between">
                    <span className="font-mono text-[11px] font-medium text-[#64748B] uppercase">Overall Gap</span>
                    <div className="font-mono text-3xl font-bold text-[#0F172A] mt-2">{overallGap}%</div>
                    <div className="w-full bg-[#F1F5F9] h-1.5 rounded-full overflow-hidden mt-3">
                        <div
                            className={`h-full rounded-full ${
                                overallGap > 50 ? "bg-[#BA1A1A]" : overallGap > 25 ? "bg-[#F59E0B]" : "bg-[#10B981]"
                            }`}
                            style={{ width: `${overallGap}%` }}
                        />
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-2 truncate">
                        Target: {analysisData?.jobRole?.title || "Selected Role"}
                    </p>
                </div>

                <div className="prepp-card p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] font-medium text-[#065F46] uppercase">Met Criteria</span>
                        <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                    </div>
                    <div className="font-mono text-3xl font-bold text-[#10B981] mt-2">{metSkills.length}</div>
                    <p className="text-[12px] text-[#64748B] mt-2">Gap ≤ 10% (Ready)</p>
                </div>

                <div className="prepp-card p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] font-medium text-[#92400E] uppercase">Needs Work</span>
                        <AlertTriangle className="h-4 w-4 text-[#F59E0B]" />
                    </div>
                    <div className="font-mono text-3xl font-bold text-[#F59E0B] mt-2">{improvementSkills.length}</div>
                    <p className="text-[12px] text-[#64748B] mt-2">Gap 10% – 50%</p>
                </div>

                <div className="prepp-card p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] font-medium text-[#991B1B] uppercase">Critical Gaps</span>
                        <XCircle className="h-4 w-4 text-[#BA1A1A]" />
                    </div>
                    <div className="font-mono text-3xl font-bold text-[#BA1A1A] mt-2">{missingSkills.length}</div>
                    <p className="text-[12px] text-[#64748B] mt-2">Gap &gt; 50% (Priority)</p>
                </div>
            </div>

            {/* Chart */}
            <Card>
                <CardHeader className="pb-2 border-b border-[#F1F5F9]">
                    <CardTitle>Required vs. Candidate Proficiency</CardTitle>
                    <CardDescription>Verified candidate scores plotted against target role specifications</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                    {chartData.length > 0 ? (
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 25 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748B" }} angle={-15} textAnchor="end" interval={0} />
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
                                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                                    <Bar dataKey="Required Proficiency" fill="#0F172A" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="Your Proficiency" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-[#64748B] text-[13px] font-mono">
                            {loading ? "Loading matrix..." : "No comparison data available"}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Detailed Table */}
            <Card className="overflow-hidden">
                <CardHeader className="pb-4">
                    <CardTitle>Detailed Competency Matrix</CardTitle>
                    <CardDescription>Granular skill deficiencies and direct PMKVY bridge triggers</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-[13px]">
                            <thead>
                                <tr className="bg-[#F8FAFC] border-y border-[#E2E8F0] font-mono text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                                    <th className="py-2.5 px-5">Skill / Competency</th>
                                    <th className="py-2.5 px-4">Category</th>
                                    <th className="py-2.5 px-4 text-center">Required</th>
                                    <th className="py-2.5 px-4 text-center">Assessed</th>
                                    <th className="py-2.5 px-4 text-center">Gap %</th>
                                    <th className="py-2.5 px-4">Status</th>
                                    <th className="py-2.5 px-5 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E2E8F0] bg-white">
                                {skills.map((s, idx) => {
                                    const assessed = s.candidateProficiency ?? s.currentProficiency ?? 0;
                                    const isMet = s.status === "met" || s.status === "MET";
                                    const isImp = s.status === "improvement" || s.status === "MODERATE_GAP";
                                    return (
                                        <tr key={s.skillId || idx} className="hover:bg-[#F8FAFC] transition-colors">
                                            <td className="py-3.5 px-5">
                                                <div className="font-semibold text-[#0F172A]">{s.skillName}</div>
                                                <div className="font-mono text-[11px] text-[#64748B]">
                                                    Importance: {s.importance}
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <Badge variant="muted">{(s.category || "TECHNICAL").toLowerCase()}</Badge>
                                            </td>
                                            <td className="py-3.5 px-4 text-center font-mono font-medium text-[#0F172A]">
                                                {s.requiredProficiency}%
                                            </td>
                                            <td className="py-3.5 px-4 text-center font-mono font-medium text-[#4F46E5]">
                                                {assessed}%
                                            </td>
                                            <td className="py-3.5 px-4 text-center">
                                                <span
                                                    className={`font-mono font-bold ${
                                                        isMet ? "text-[#10B981]" : isImp ? "text-[#F59E0B]" : "text-[#BA1A1A]"
                                                    }`}
                                                >
                                                    {s.gap}%
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                {isMet && <Badge variant="success">Met</Badge>}
                                                {isImp && <Badge variant="warning">Partial</Badge>}
                                                {!isMet && !isImp && <Badge variant="destructive">Gap</Badge>}
                                            </td>
                                            <td className="py-3.5 px-5 text-right">
                                                {s.gap > 10 ? (
                                                    <Link href={`/courses?skill=${encodeURIComponent(s.skillName)}`}>
                                                        <Button size="sm" variant="outline">
                                                            Find Course →
                                                        </Button>
                                                    </Link>
                                                ) : (
                                                    <span className="font-mono text-[11px] text-[#065F46] font-medium">Proficient</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Footer Callout */}
            <div className="prepp-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-white to-[#F2F3FF]">
                <div>
                    <h3 className="font-display text-[17px] font-semibold text-[#0F172A]">Ready to close these skill gaps?</h3>
                    <p className="text-[13px] text-[#64748B] mt-0.5">
                        Enroll in subsidized PMKVY courses targeted to your missing competencies.
                    </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                    <Link href="/courses">
                        <Button>
                            <BookOpen className="h-4 w-4" /> PMKVY Courses
                        </Button>
                    </Link>
                    <Link href="/career-path">
                        <Button variant="outline">
                            <Compass className="h-4 w-4" /> Career Roadmap
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function SkillGapPage() {
    return (
        <DashboardLayout>
            <Suspense
                fallback={
                    <div className="flex h-96 items-center justify-center font-mono text-[13px] text-[#64748B]">
                        Loading gap analysis...
                    </div>
                }
            >
                <SkillGapContent />
            </Suspense>
        </DashboardLayout>
    );
}
