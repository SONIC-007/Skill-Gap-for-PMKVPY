"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Compass, CheckCircle2, AlertCircle, ArrowRight, Milestone, BookOpen, Loader2, } from "lucide-react";
export default function CareerPathPage() {
    const [recommendations, setRecommendations] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetch("/api/career")
            .then((res) => res.json())
            .then((data) => {
            const recs = data.recommendations || [];
            setRecommendations(recs);
            if (recs.length > 0) {
                setSelectedRole(recs[0]);
            }
            setLoading(false);
        })
            .catch((err) => {
            console.error(err);
            setLoading(false);
        });
    }, []);
    if (loading) {
        return (<DashboardLayout>
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-900"/>
        </div>
      </DashboardLayout>);
    }
    return (<DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-16">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-semibold mb-2">
            <Compass className="h-3.5 w-3.5"/> PMKVY Career Advisory Engine
          </div>
          <h1 className="text-3xl font-bold text-blue-950">Career Path Recommendations</h1>
          <p className="text-slate-600">
            Intelligent job role matches and personalized learning roadmaps based on your verified skill profile.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Roles List Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
              Matched Roles ({recommendations.length})
            </h3>
            <div className="space-y-3">
              {recommendations.map((role) => (<div key={role.id} onClick={() => setSelectedRole(role)} className={`p-4 rounded-xl border transition-all cursor-pointer ${selectedRole?.id === role.id
                ? "border-blue-900 bg-blue-50/70 shadow-sm"
                : "border-slate-200 bg-white hover:border-blue-300"}`}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-bold text-blue-950 text-sm">{role.title}</h4>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${role.readinessPercentage >= 75
                ? "bg-green-100 text-green-800"
                : role.readinessPercentage >= 50
                    ? "bg-blue-100 text-blue-800"
                    : "bg-amber-100 text-amber-800"}`}>
                      {role.readinessPercentage}% Ready
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{role.domain}</p>
                  <Progress value={role.readinessPercentage} className="h-1.5"/>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                    <span>{role.matchedSkills.length} Matched Skills</span>
                    <span>{role.missingSkills.length} Gaps</span>
                  </div>
                </div>))}
            </div>
          </div>

          {/* Role Detail & Roadmap Column */}
          <div className="lg:col-span-2 space-y-6">
            {selectedRole ? (<>
                {/* Hero Card for Selected Role */}
                <Card className="border-blue-100 shadow-sm bg-gradient-to-br from-white to-blue-50/40">
                  <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {selectedRole.domain}
                      </Badge>
                      <Badge variant="outline" className="text-xs text-blue-900 border-blue-200">
                        {selectedRole.demandLevel || "High"} Industry Demand
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl text-blue-950 mt-2">
                      {selectedRole.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-slate-600">
                      {selectedRole.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Key Stats Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-white border border-blue-100">
                      <div>
                        <span className="text-xs text-slate-400 block">Candidate Readiness</span>
                        <span className="text-2xl font-black text-blue-900">
                          {selectedRole.readinessPercentage}%
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block">Average Industry Salary</span>
                        <span className="text-sm font-bold text-slate-800 block mt-1">
                          {selectedRole.avgSalary || "Competitive"}
                        </span>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <span className="text-xs text-slate-400 block">Competency Coverage</span>
                        <span className="text-sm font-bold text-slate-800 block mt-1">
                          {selectedRole.matchedSkills.length} of {selectedRole.matchedSkills.length + selectedRole.missingSkills.length} Skills
                        </span>
                      </div>
                    </div>

                    {/* Matched vs Missing Skills */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Matched */}
                      <div className="p-4 rounded-xl border border-green-200 bg-green-50/30 space-y-2">
                        <h4 className="text-xs font-bold text-green-900 uppercase flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-green-600"/>
                          Ready / Verified Skills ({selectedRole.matchedSkills.length})
                        </h4>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {selectedRole.matchedSkills.length > 0 ? (selectedRole.matchedSkills.map((sk) => (<span key={sk} className="px-2.5 py-1 rounded-md bg-green-100 text-green-900 text-xs font-medium">
                                {sk}
                              </span>))) : (<span className="text-xs text-slate-400 italic">No validated skills yet</span>)}
                        </div>
                      </div>

                      {/* Missing */}
                      <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 space-y-2">
                        <h4 className="text-xs font-bold text-amber-900 uppercase flex items-center gap-1.5">
                          <AlertCircle className="h-4 w-4 text-amber-600"/>
                          Skills Requiring Upskilling ({selectedRole.missingSkills.length})
                        </h4>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {selectedRole.missingSkills.length > 0 ? (selectedRole.missingSkills.map((sk) => (<span key={sk} className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 text-xs font-medium">
                                {sk}
                              </span>))) : (<span className="text-xs text-green-700 font-medium">All core requirements met!</span>)}
                        </div>
                      </div>
                    </div>

                    {/* Step-by-Step Learning Roadmap */}
                    <div className="space-y-4 pt-2">
                      <h4 className="font-bold text-blue-950 text-base flex items-center gap-2">
                        <Milestone className="h-5 w-5 text-blue-700"/>
                        Recommended Learning Roadmap to Career Readiness
                      </h4>

                      <div className="space-y-4 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-blue-200">
                        {/* Phase 1 */}
                        <div className="relative flex items-start gap-4 pl-10">
                          <div className="absolute left-2 top-1 w-5 h-5 rounded-full bg-blue-900 text-white text-[10px] font-bold flex items-center justify-center ring-4 ring-white">
                            1
                          </div>
                          <div className="p-4 rounded-xl border border-blue-100 bg-white shadow-sm flex-1">
                            <h5 className="font-bold text-blue-950 text-sm">Phase 1: Core Fundamentals & Highest Gaps</h5>
                            <p className="text-xs text-slate-600 mt-1">
                              Master foundational technical prerequisites and bridge the largest deficiency:{" "}
                              <strong>{selectedRole.missingSkills[0] || "Foundational Knowledge"}</strong>.
                            </p>
                            <Link href="/courses" className="inline-block mt-2">
                              <span className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1">
                                Find PMKVY Phase 1 Courses <ArrowRight className="h-3 w-3"/>
                              </span>
                            </Link>
                          </div>
                        </div>

                        {/* Phase 2 */}
                        <div className="relative flex items-start gap-4 pl-10">
                          <div className="absolute left-2 top-1 w-5 h-5 rounded-full bg-blue-700 text-white text-[10px] font-bold flex items-center justify-center ring-4 ring-white">
                            2
                          </div>
                          <div className="p-4 rounded-xl border border-blue-100 bg-white shadow-sm flex-1">
                            <h5 className="font-bold text-blue-950 text-sm">Phase 2: Applied Projects & Advanced Frameworks</h5>
                            <p className="text-xs text-slate-600 mt-1">
                              Build capstone projects integrating multiple tools and deepen secondary competencies:{" "}
                              <strong>{selectedRole.missingSkills[1] || "Practical Application"}</strong>.
                            </p>
                          </div>
                        </div>

                        {/* Phase 3 */}
                        <div className="relative flex items-start gap-4 pl-10">
                          <div className="absolute left-2 top-1 w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center ring-4 ring-white">
                            3
                          </div>
                          <div className="p-4 rounded-xl border border-blue-100 bg-white shadow-sm flex-1">
                            <h5 className="font-bold text-blue-950 text-sm">Phase 3: Industry Certification & Job Placement</h5>
                            <p className="text-xs text-slate-600 mt-1">
                              Verify competency with PMKVY assessment certification and apply for interview placement drives.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link href={`/assessment`}>
                      <Button variant="outline" size="sm">
                        Re-assess this Role
                      </Button>
                    </Link>
                    <Link href="/courses">
                      <Button size="sm" className="bg-blue-900 hover:bg-blue-800">
                        <BookOpen className="h-4 w-4 mr-1.5"/>
                        Explore Relevant Courses
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </>) : (<div className="p-12 text-center text-slate-400 border-2 border-dashed rounded-xl">
                Select a role to see its detailed roadmap
              </div>)}
          </div>
        </div>
      </div>
    </DashboardLayout>);
}
