"use client";
// [FRONTEND] Skill Gap Diagnostic Matrix | Route: /skill-gap | Uses: GET /api/skill-gap, DashboardLayout, Recharts
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { EditorialPageHeader } from "@/components/story/EditorialPageHeader";
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
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        let active = true;
        apiFetch("/api/skill-gap")
            .then(async (res) => {
                const data = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(data.error || "Failed to load roles");
                return data;
            })
            .then((data) => {
                if (!active) return;
                const assList = data.assessments || [];
                const rolesList = data.jobRoles || [];
                setAssessments(assList);
                setAvailableRoles(rolesList);
                setSelectedJobRoleId((prev) => {
                    if (prev) return prev;
                    if (assList.length > 0 && assList[0].jobRoleId) {
                        return assList[0].jobRoleId;
                    }
                    if (rolesList.length > 0) {
                        return rolesList[0].id;
                    }
                    return "";
                });
                setLoading(false);
            })
            .catch((err) => {
                if (!active) return;
                console.error(err);
                setErrorMsg(err.message || "Failed to load skill gap baselines.");
                setLoading(false);
            });
        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        if (!selectedJobRoleId) return;
        let active = true;
        apiFetch(`/api/skill-gap?jobRoleId=${selectedJobRoleId}`)
            .then(async (res) => {
                const data = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(data.error || "Failed to load role analysis");
                return data;
            })
            .then((data) => {
                if (!active) return;
                setAnalysisData(data);
                setErrorMsg("");
                setLoading(false);
            })
            .catch((err) => {
                if (!active) return;
                console.error(err);
                setErrorMsg(err.message || "Failed to calculate skill gap.");
                setLoading(false);
            });
        return () => {
            active = false;
        };
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
            <nav className="flex items-center gap-2 text-[12px] font-mono text-[#52525B]">
                <Link href="/dashboard" className="hover:text-[#4F46E5]">Dashboard</Link>
                <span className="text-[#D5D2CA]">/</span>
                <span className="text-[#111113] font-medium">Skill Gap Matrix</span>
            </nav>

            {errorMsg && (
                <div className="p-3.5 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-[13px] font-medium">
                    {errorMsg}
                </div>
            )}

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

            {/* Editorial Header Card */}
            <EditorialPageHeader
                variant="light"
                eyebrow="COMPETENCY BENCHMARKING"
                title="Skill Gap"
                italicAccent="Analysis Matrix."
                description="Weighted proficiency calculation comparing candidate evidence against Qualification Pack requirements."
                rightSlot={
                    (assessments.length > 0 || availableRoles.length > 0) && (
                        <div className="flex items-center gap-2 bg-[#F6F5F0] p-2 rounded-full border border-black/[0.08]">
                            <span className="font-mono text-[11px] font-semibold text-[#52525B] pl-2.5">
                                {assessments.length > 0 ? "ROLE:" : "TARGET:"}
                            </span>
                            <select
                                value={selectedJobRoleId}
                                onChange={(e) => {
                                    setLoading(true);
                                    setSelectedJobRoleId(e.target.value);
                                }}
                                className="h-8 text-[13px] font-medium text-[#111113] bg-white border border-black/[0.1] rounded-full px-3 focus:outline-none focus:border-[#111113]"
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
                    )
                }
            />

            {/* Formula Strip */}
            <div className="prepp-card p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 text-[13px] text-[#52525B]">
                    <span className="h-8 w-8 rounded-full bg-[#F4F5F7] flex items-center justify-center text-[#4F46E5] shrink-0">
                        <Info className="h-4 w-4" />
                    </span>
                    <span className="font-medium text-[#111113]">Benchmark Formula</span>
                </div>
                <code className="font-mono bg-[#F4F5F7] px-3.5 py-1.5 rounded-xl text-[#4F46E5] text-[12px]">
                    Gap (%) = ((Required - Candidate) / Required) × 100
                </code>
            </div>

            {/* 4 Metric Bento Cards (Ref 3 Radial + Minimal Gauge Style) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="prepp-card prepp-card-interactive p-5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <span className="font-mono text-[10.5px] font-semibold text-[#71717A] uppercase">Overall Gap</span>
                        <div className="font-display text-3xl font-bold text-[#111113] mt-1">{overallGap}%</div>
                        <p className="text-[11px] text-[#71717A] mt-1 truncate">
                            {analysisData?.jobRole?.title || "Selected Role"}
                        </p>
                    </div>
                    <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                            <path
                                className="text-[#F1F2F4]"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3.5"
                            />
                            <path
                                className={overallGap > 50 ? "text-[#BA1A1A]" : overallGap > 25 ? "text-[#DF9A57]" : "text-[#86BA6C]"}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeDasharray={`${overallGap}, 100`}
                                strokeLinecap="round"
                                strokeWidth="3.5"
                            />
                        </svg>
                    </div>
                </div>

                <div className="prepp-card prepp-card-interactive p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-[10.5px] font-semibold text-[#065F46] uppercase">Met Criteria</span>
                        <span className="h-8 w-8 rounded-full bg-[#ECFDF5] flex items-center justify-center">
                            <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                        </span>
                    </div>
                    <div className="font-display text-3xl font-bold text-[#111113] mt-2">{metSkills.length}</div>
                    <p className="text-[11.5px] text-[#71717A] mt-1">Gap ≤ 10% (Placement Ready)</p>
                </div>

                <div className="prepp-card prepp-card-interactive p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-[10.5px] font-semibold text-[#92400E] uppercase">Needs Work</span>
                        <span className="h-8 w-8 rounded-full bg-[#FFFBEB] flex items-center justify-center">
                            <AlertTriangle className="h-4 w-4 text-[#F59E0B]" />
                        </span>
                    </div>
                    <div className="font-display text-3xl font-bold text-[#111113] mt-2">{improvementSkills.length}</div>
                    <p className="text-[11.5px] text-[#71717A] mt-1">Gap 10% – 50%</p>
                </div>

                <div className="prepp-card prepp-card-interactive p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-[10.5px] font-semibold text-[#991B1B] uppercase">Critical Gaps</span>
                        <span className="h-8 w-8 rounded-full bg-[#FEF2F2] flex items-center justify-center">
                            <XCircle className="h-4 w-4 text-[#BA1A1A]" />
                        </span>
                    </div>
                    <div className="font-display text-3xl font-bold text-[#111113] mt-2">{missingSkills.length}</div>
                    <p className="text-[11.5px] text-[#71717A] mt-1">Gap &gt; 50% (Bridge Priority)</p>
                </div>
            </div>

            {/* Chart */}
            <Card>
                <CardHeader className="pb-2 border-b border-[#EFECE6]">
                    <CardTitle>Required vs. Candidate Proficiency</CardTitle>
                    <CardDescription>Verified candidate scores plotted against target role specifications</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                    {chartData.length > 0 ? (
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 25 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E6E4DE" />
                                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#52525B" }} angle={-15} textAnchor="end" interval={0} />
                                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#52525B" }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#111113",
                                            borderRadius: "8px",
                                            color: "#fff",
                                            border: "none",
                                            fontSize: "12px",
                                        }}
                                    />
                                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                                    <Bar dataKey="Required Proficiency" fill="#111113" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="Your Proficiency" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-[#52525B] text-[13px] font-mono">
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
                                <tr className="bg-[#F6F5F0] border-y border-[#E6E4DE] font-mono text-[11px] font-semibold uppercase tracking-wider text-[#52525B]">
                                    <th className="py-2.5 px-5">Skill / Competency</th>
                                    <th className="py-2.5 px-4">Category</th>
                                    <th className="py-2.5 px-4 text-center">Required</th>
                                    <th className="py-2.5 px-4 text-center">Assessed</th>
                                    <th className="py-2.5 px-4 text-center">Gap %</th>
                                    <th className="py-2.5 px-4">Status</th>
                                    <th className="py-2.5 px-5 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E6E4DE] bg-white">
                                {skills.map((s, idx) => {
                                    const assessed = s.candidateProficiency ?? s.currentProficiency ?? 0;
                                    const isMet = s.status === "met" || s.status === "MET";
                                    const isImp = s.status === "improvement" || s.status === "MODERATE_GAP";
                                    return (
                                        <tr key={s.skillId || idx} className="hover:bg-[#F6F5F0] transition-colors">
                                            <td className="py-3.5 px-5">
                                                <div className="font-semibold text-[#111113]">{s.skillName}</div>
                                                <div className="font-mono text-[11px] text-[#52525B]">
                                                    Importance: {s.importance}
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <Badge variant="muted">{(s.category || "TECHNICAL").toLowerCase()}</Badge>
                                            </td>
                                            <td className="py-3.5 px-4 text-center font-mono font-medium text-[#111113]">
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
            <div className="prepp-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-white to-[#EEF0FF]">
                <div>
                    <h3 className="font-display text-[17px] font-semibold text-[#111113]">Ready to close these skill gaps?</h3>
                    <p className="text-[13px] text-[#52525B] mt-0.5">
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
                    <div className="flex h-96 items-center justify-center font-mono text-[13px] text-[#52525B]">
                        Loading gap analysis...
                    </div>
                }
            >
                <SkillGapContent />
            </Suspense>
        </DashboardLayout>
    );
}
