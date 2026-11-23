"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, CheckCircle2, Clock, BookOpen, Award, Loader2, } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, } from "recharts";
export default function ProgressPage() {
    const [enrollments, setEnrollments] = useState([]);
    const [candidateSkills, setCandidateSkills] = useState([]);
    const [progressHistory, setProgressHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const fetchProgress = () => {
        fetch("/api/progress")
            .then((res) => res.json())
            .then((data) => {
            setEnrollments(data.enrollments || []);
            setCandidateSkills(data.candidateSkills || []);
            setProgressHistory(data.progressHistory || []);
            setLoading(false);
        })
            .catch((err) => {
            console.error(err);
            setLoading(false);
        });
    };
    useEffect(() => {
        fetchProgress();
    }, []);
    const handleUpdateProgress = async (enrollmentId, newProgress, markComplete = false) => {
        setUpdatingId(enrollmentId);
        try {
            const payload = {
                enrollmentId,
                progress: Math.min(100, Math.max(0, newProgress)),
            };
            if (markComplete || newProgress >= 100) {
                payload.status = "COMPLETED";
                payload.progress = 100;
            }
            else {
                payload.status = "IN_PROGRESS";
            }
            const res = await fetch("/api/progress", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok)
                throw new Error("Failed to update progress");
            fetchProgress();
        }
        catch (err) {
            alert(err.message || "Error updating progress");
        }
        finally {
            setUpdatingId(null);
        }
    };
    // Prepare chart data
    const chartData = progressHistory.length > 0
        ? progressHistory.map((p) => ({
            date: new Date(p.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
            Proficiency: p.proficiency,
            Skill: p.skillName,
        }))
        : [
            { date: "Oct 15", Proficiency: 20, Skill: "Baseline Assessment" },
            { date: "Oct 25", Proficiency: 35, Skill: "Module 1" },
            { date: "Nov 05", Proficiency: 50, Skill: "Module 2" },
            { date: "Nov 11", Proficiency: 68, Skill: "Module 3" },
        ];
    const completedCount = enrollments.filter((e) => e.status === "COMPLETED").length;
    const inProgressCount = enrollments.filter((e) => e.status === "IN_PROGRESS").length;
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-semibold mb-2">
              <TrendingUp className="h-3.5 w-3.5"/> PMKVY Skill Journey
            </div>
            <h1 className="text-3xl font-bold text-blue-950">Learning Progress & Development</h1>
            <p className="text-slate-600">
              Track course milestone completions, update module progress, and watch your skill ratings increase.
            </p>
          </div>

          <Link href="/courses">
            <Button className="bg-blue-900 hover:bg-blue-800">
              <BookOpen className="h-4 w-4 mr-1.5"/>
              Enroll in More Courses
            </Button>
          </Link>
        </div>

        {/* Top Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Card className="border-blue-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-500 uppercase">Enrolled Courses</p>
                <BookOpen className="h-5 w-5 text-blue-800"/>
              </div>
              <h3 className="text-3xl font-black text-blue-950 mt-1">{enrollments.length}</h3>
              <p className="text-xs text-slate-400 mt-2">{inProgressCount} currently active</p>
            </CardContent>
          </Card>

          <Card className="border-green-100 bg-green-50/20 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-green-700 uppercase">Completed Training</p>
                <CheckCircle2 className="h-5 w-5 text-green-600"/>
              </div>
              <h3 className="text-3xl font-black text-green-950 mt-1">{completedCount}</h3>
              <p className="text-xs text-green-700 mt-2">Verified PMKVY modules</p>
            </CardContent>
          </Card>

          <Card className="border-blue-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-500 uppercase">Total Skills Tracked</p>
                <Award className="h-5 w-5 text-blue-800"/>
              </div>
              <h3 className="text-3xl font-black text-blue-950 mt-1">{candidateSkills.length}</h3>
              <p className="text-xs text-slate-400 mt-2">Continuous proficiency updates</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Chart */}
        <Card className="border-blue-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Skill Proficiency Velocity</CardTitle>
            <CardDescription>
              Historical growth of assessed competencies as you complete PMKVY training milestones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#64748b" }}/>
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#64748b" }}/>
                  <Tooltip contentStyle={{
            backgroundColor: "#0f172a",
            borderRadius: "8px",
            color: "#fff",
            border: "none",
        }}/>
                  <Line type="monotone" dataKey="Proficiency" stroke="#1e3a8a" strokeWidth={3} dot={{ r: 5, fill: "#1e3a8a" }}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Active Enrolled Courses Management */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-blue-950">Active Enrolled Courses</h2>

          {enrollments.length === 0 ? (<Card className="p-12 text-center text-slate-400 border-dashed">
              <BookOpen className="h-10 w-10 mx-auto mb-2 text-slate-300"/>
              <p className="text-sm font-medium text-slate-600">You are not enrolled in any courses yet</p>
              <Link href="/courses" className="inline-block mt-3">
                <Button size="sm">Browse Recommended Courses</Button>
              </Link>
            </Card>) : (<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrollments.map((enr) => (<Card key={enr.id} className="border-blue-100 shadow-sm flex flex-col justify-between">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <Badge variant={enr.status === "COMPLETED" ? "success" : "default"} className="text-xs">
                        {enr.status}
                      </Badge>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3"/>
                        {new Date(enr.enrolledAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                    <CardTitle className="text-base text-blue-950 leading-snug">
                      {enr.course.name}
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      {enr.course.provider} • {enr.course.duration}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4 text-xs">
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                        <span>Course Completion</span>
                        <span className="text-blue-900 font-bold">{enr.progress}%</span>
                      </div>
                      <Progress value={enr.progress} className="h-2" indicatorClassName={enr.progress >= 100 ? "bg-green-600" : "bg-blue-600"}/>
                    </div>

                    {/* Interactive progress update buttons */}
                    {enr.status !== "COMPLETED" && (<div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-2">
                        <span className="font-semibold text-slate-600 block text-[11px]">
                          Quick Progress Update:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" className="text-xs h-7 px-2.5 bg-white" disabled={updatingId === enr.id} onClick={() => handleUpdateProgress(enr.id, enr.progress + 20)}>
                            +20% Progress
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs h-7 px-2.5 bg-white" disabled={updatingId === enr.id} onClick={() => handleUpdateProgress(enr.id, enr.progress + 40)}>
                            +40% Progress
                          </Button>
                          <Button size="sm" className="text-xs h-7 px-2.5 bg-green-700 hover:bg-green-800 text-white" disabled={updatingId === enr.id} onClick={() => handleUpdateProgress(enr.id, 100, true)}>
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1"/> Mark Complete
                          </Button>
                        </div>
                      </div>)}

                    {enr.status === "COMPLETED" && (<div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 flex items-center gap-2">
                        <Award className="h-4 w-4 text-green-600 shrink-0"/>
                        <span className="text-xs font-medium">
                          Completed on {new Date(enr.completedAt || enr.updatedAt).toLocaleDateString("en-IN")}. Verified +15% proficiency boost applied to associated skills!
                        </span>
                      </div>)}
                  </CardContent>

                  <CardFooter className="pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                    Category: {enr.course.category || "Vocational"}
                  </CardFooter>
                </Card>))}
            </div>)}
        </div>

        {/* Candidate Skills List */}
        <Card className="border-blue-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Verified Candidate Skills & Proficiency</CardTitle>
            <CardDescription>
              Live proficiency levels updated continuously through assessments and completed coursework
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {candidateSkills.map((cs) => (<div key={cs.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-sm text-blue-950">{cs.skill.name}</span>
                    <span className="text-xs font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                      {cs.proficiency}%
                    </span>
                  </div>
                  <Progress value={cs.proficiency} className="h-1.5"/>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{cs.skill.domain}</span>
                    <span>{cs.skill.category.toLowerCase()}</span>
                  </div>
                </div>))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>);
}
