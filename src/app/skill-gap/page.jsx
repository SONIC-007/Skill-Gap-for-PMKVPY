"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, CheckCircle2, AlertTriangle, XCircle, BookOpen, Compass, Info, } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, } from "recharts";
function SkillGapContent() {
    const searchParams = useSearchParams();
    const jobRoleIdParam = searchParams.get("jobRoleId");
    const isJustCompleted = searchParams.get("completed") === "true";
    const [assessments, setAssessments] = useState([]);
    const [availableRoles, setAvailableRoles] = useState([]);
    const [selectedJobRoleId, setSelectedJobRoleId] = useState(jobRoleIdParam || "");
    const [analysisData, setAnalysisData] = useState(null);
    const [loading, setLoading] = useState(true);
    // Fetch list of completed assessments and available roles
    useEffect(() => {
        fetch("/api/skill-gap")
            .then((res) => res.json())
            .then((data) => {
            const assList = data.assessments || [];
            const rolesList = data.jobRoles || [];
            setAssessments(assList);
            setAvailableRoles(rolesList);
            if (!selectedJobRoleId) {
                if (assList.length > 0) {
                    setSelectedJobRoleId(assList[0].jobRoleId);
                }
                else if (rolesList.length > 0) {
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
    // Fetch detailed gap analysis whenever selectedJobRoleId changes
    useEffect(() => {
        if (!selectedJobRoleId)
            return;
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
    const skills = analysisData?.skills || [];
    const metSkills = skills.filter((s) => s.status === "met");
    const improvementSkills = skills.filter((s) => s.status === "improvement");
    const missingSkills = skills.filter((s) => s.status === "missing");
    // Chart comparison data
    const chartData = skills.map((s) => ({
        name: s.skillName.length > 15 ? s.skillName.substring(0, 13) + "..." : s.skillName,
        "Required Proficiency": s.requiredProficiency,
        "Your Proficiency": s.candidateProficiency,
        "Gap %": s.gap,
    }));
    return (<div className="space-y-6 max-w-6xl mx-auto pb-16 font-sans">
      {/* Banner if just completed */}
      {isJustCompleted && (<div className="p-4 rounded-2xl bg-[#34c759]/10 border border-[#34c759]/20 text-[#248a3d] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-[#34c759] shrink-0"/>
            <div>
              <p className="font-medium text-[14px]">Assessment Successfully Evaluated</p>
              <p className="text-[12px] opacity-90">
                Your skills have been benchmarked against industry standards.
              </p>
            </div>
          </div>
          <Badge variant="success">Updated</Badge>
        </div>)}

      {/* Apple HomeView Header */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0071e3]/10 text-[#0071e3] text-[12px] font-semibold mb-3">
              <BarChart3 className="h-3.5 w-3.5"/>
              <span>Competency Benchmarking</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f]">
              Skill Gap Analysis
            </h1>
            <p className="text-[14px] text-[#86868b] mt-1 max-w-2xl leading-relaxed">
              Transparent weighted calculation comparing verified candidate proficiency with
              mandatory qualification packs (QP-NOS).
            </p>
          </div>

          {/* Job Role Selector */}
          {(assessments.length > 0 || availableRoles.length > 0) && (<div className="flex items-center gap-2 bg-[#f5f5f7] p-2 rounded-2xl border border-[#e5e7eb]">
              <span className="text-[12px] font-medium text-[#86868b] pl-2">
                {assessments.length > 0 ? "Role:" : "Target:"}
              </span>
              <select value={selectedJobRoleId} onChange={(e) => setSelectedJobRoleId(e.target.value)} className="text-[13px] font-medium text-[#1d1d1f] bg-white border border-[#d2d2d7] rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#0071e3]">
                {assessments.length > 0
                ? assessments.map((a) => (<option key={a.id} value={a.jobRoleId}>
                        {a.jobRole.title} ({Math.round(a.skillGap)}% gap)
                      </option>))
                : availableRoles.map((role) => (<option key={role.id} value={role.id}>
                        {role.title} ({role.domain})
                      </option>))}
              </select>
            </div>)}
        </div>
      </div>

      {/* Formula Card */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-[#0071e3] mt-0.5 shrink-0"/>
          <div className="text-[13px] text-[#86868b] space-y-1">
            <p className="font-semibold text-[#1d1d1f]">Standard Gap Formula:</p>
            <div className="font-mono bg-[#f5f5f7] px-3 py-1.5 rounded-lg border border-[#e5e7eb] text-[#0071e3] inline-block text-[12px]">
              Skill Gap (%) = ((Required Proficiency - Candidate Proficiency) / Required Proficiency) × 100
            </div>
          </div>
        </div>
      </div>

      {/* Summary Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5 flex flex-col justify-between">
          <p className="text-[12px] font-medium text-[#86868b] uppercase tracking-wider">Overall Gap</p>
          <h3 className="text-3xl font-semibold text-[#1d1d1f] mt-2">
            {analysisData?.overallGap ?? 0}%
          </h3>
          <div className="mt-3">
            <div className="w-full bg-[#f5f5f7] h-1.5 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${(analysisData?.overallGap || 0) > 50
            ? "bg-[#ff3b30]"
            : (analysisData?.overallGap || 0) > 25
                ? "bg-[#0071e3]"
                : "bg-[#34c759]"}`} style={{ width: `${analysisData?.overallGap || 0}%` }}/>
            </div>
          </div>
          <p className="text-[11px] text-[#86868b] mt-2">Target: {analysisData?.jobRole?.title}</p>
        </div>

        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-medium text-[#34c759] uppercase tracking-wider">Met Criteria</p>
            <CheckCircle2 className="h-4 w-4 text-[#34c759]"/>
          </div>
          <h3 className="text-3xl font-semibold text-[#34c759] mt-2">{metSkills.length}</h3>
          <p className="text-[12px] text-[#86868b] mt-2">Gap &le; 10% (Deployment ready)</p>
        </div>

        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-medium text-[#0071e3] uppercase tracking-wider">Needs Work</p>
            <AlertTriangle className="h-4 w-4 text-[#0071e3]"/>
          </div>
          <h3 className="text-3xl font-semibold text-[#0071e3] mt-2">{improvementSkills.length}</h3>
          <p className="text-[12px] text-[#86868b] mt-2">Gap between 10% – 50%</p>
        </div>

        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-medium text-[#ff3b30] uppercase tracking-wider">Critical Gaps</p>
            <XCircle className="h-4 w-4 text-[#ff3b30]"/>
          </div>
          <h3 className="text-3xl font-semibold text-[#ff3b30] mt-2">{missingSkills.length}</h3>
          <p className="text-[12px] text-[#86868b] mt-2">Gap &gt; 50% (High priority)</p>
        </div>
      </div>

      {/* Comparison Chart */}
      <Card className="border-[#e5e7eb] rounded-2xl">
        <CardHeader className="p-6 pb-2">
          <CardTitle className="text-[17px] font-semibold text-[#1d1d1f]">
            Required vs. Candidate Proficiency
          </CardTitle>
          <CardDescription className="text-[13px] text-[#86868b]">
            Side-by-side comparison of candidate verified proficiency against target role specifications
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-2">
          {chartData.length > 0 ? (<div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f7"/>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#86868b" }} angle={-15} textAnchor="end" interval={0}/>
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#86868b" }}/>
                  <Tooltip contentStyle={{
                backgroundColor: "#1d1d1f",
                borderRadius: "12px",
                color: "#fff",
                border: "none",
                fontSize: "12px",
            }}/>
                  <Legend wrapperStyle={{ fontSize: "12px" }}/>
                  <Bar dataKey="Required Proficiency" fill="#1d1d1f" radius={[4, 4, 0, 0]}/>
                  <Bar dataKey="Your Proficiency" fill="#0071e3" radius={[4, 4, 0, 0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>) : (<div className="h-64 flex items-center justify-center text-[#86868b] text-[13px]">
              No comparison data available
            </div>)}
        </CardContent>
      </Card>

      {/* Granular Table */}
      <Card className="border-[#e5e7eb] rounded-2xl overflow-hidden">
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-[17px] font-semibold text-[#1d1d1f]">
            Detailed Competency Matrix
          </CardTitle>
          <CardDescription className="text-[13px] text-[#86868b]">
            Individual skill scores, calculated deficiencies, and course recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[13px]">
              <thead>
                <tr className="bg-[#f5f5f7] border-y border-[#e5e7eb] text-[#86868b] text-[11px] font-semibold uppercase tracking-wider">
                  <th className="py-3 px-6">Skill / Competency</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Required</th>
                  <th className="py-3 px-4 text-center">Assessed</th>
                  <th className="py-3 px-4 text-center">Calculated Gap</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e7eb] bg-white">
                {skills.map((s) => (<tr key={s.skillId} className="hover:bg-[#f5f5f7]/60 transition-colors">
                    <td className="py-4 px-6 font-medium text-[#1d1d1f]">
                      <div>{s.skillName}</div>
                      <div className="text-[11px] text-[#86868b] font-normal">Importance: {s.importance}</div>
                    </td>
                    <td className="py-4 px-4 text-[12px] capitalize text-[#86868b]">
                      <Badge variant="muted">{s.category.toLowerCase()}</Badge>
                    </td>
                    <td className="py-4 px-4 text-center font-medium text-[#1d1d1f]">
                      {s.requiredProficiency}%
                    </td>
                    <td className="py-4 px-4 text-center font-medium text-[#0071e3]">
                      {s.candidateProficiency}%
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`font-semibold ${s.status === "met"
                ? "text-[#34c759]"
                : s.status === "improvement"
                    ? "text-[#0071e3]"
                    : "text-[#ff3b30]"}`}>
                        {s.gap}%
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {s.status === "met" && (<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#34c759]/10 text-[#248a3d]">
                          <CheckCircle2 className="h-3.5 w-3.5"/> Met
                        </span>)}
                      {s.status === "improvement" && (<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#0071e3]/10 text-[#0071e3]">
                          <AlertTriangle className="h-3.5 w-3.5"/> Partial
                        </span>)}
                      {s.status === "missing" && (<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#ff3b30]/10 text-[#ff3b30]">
                          <XCircle className="h-3.5 w-3.5"/> Gap
                        </span>)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {s.gap > 10 ? (<Link href={`/courses?skill=${encodeURIComponent(s.skillName)}`}>
                          <Button size="sm" variant="outline" className="rounded-full text-[12px] h-[32px] px-3 border-[#d2d2d7]">
                            Find Course →
                          </Button>
                        </Link>) : (<span className="text-[12px] text-[#34c759] font-medium">Proficient</span>)}
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Action Footer Callout */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 sm:p-7 rounded-2xl bg-white border border-[#e5e7eb]">
        <div>
          <h3 className="text-[17px] font-semibold text-[#1d1d1f]">Ready to close these skill gaps?</h3>
          <p className="text-[13px] text-[#86868b] mt-0.5">
            Enroll in subsidized PMKVY courses matched directly to your detected deficiency scores.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Link href="/courses">
            <Button className="bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium text-[13px] rounded-full h-[40px] px-5 shadow-none">
              <BookOpen className="h-3.5 w-3.5 mr-1.5"/>
              PMKVY Courses
            </Button>
          </Link>
          <Link href="/career-path">
            <Button variant="outline" className="rounded-full text-[13px] border-[#d2d2d7] text-[#1d1d1f] hover:bg-[#f5f5f7] h-[40px] px-4">
              <Compass className="h-3.5 w-3.5 mr-1.5"/>
              Career Roadmap
            </Button>
          </Link>
        </div>
      </div>
    </div>);
}
export default function SkillGapPage() {
    return (<DashboardLayout>
      <Suspense fallback={<div className="flex h-96 items-center justify-center">
          <div className="text-center text-[#86868b] text-[14px]">Loading gap analysis...</div>
        </div>}>
        <SkillGapContent />
      </Suspense>
    </DashboardLayout>);
}
