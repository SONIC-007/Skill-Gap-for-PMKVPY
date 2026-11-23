"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, BarChart3, BookOpen, Compass, TrendingUp, AlertCircle, Sparkles, ChevronRight, } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, } from "recharts";
export default function DashboardPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetch("/api/dashboard")
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
        return (<DashboardLayout>
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#0071e3] border-t-transparent mx-auto mb-3"/>
            <p className="text-[14px] text-[#86868b] font-normal">Loading skill dashboard...</p>
          </div>
        </div>
      </DashboardLayout>);
    }
    const stats = data?.stats || {
        totalSkillsAssessed: 0,
        averageProficiency: 0,
        overallSkillGap: 0,
        coursesEnrolled: 0,
        coursesCompleted: 0,
    };
    const skillDistribution = data?.skillDistribution || [];
    const assessments = data?.assessments || [];
    const enrollments = data?.enrollments || [];
    const recentProgress = data?.recentProgress || [];
    // Prepare radar/comparison chart data
    const radarData = skillDistribution.slice(0, 6).map((s) => ({
        subject: s.name.length > 14 ? s.name.substring(0, 12) + "..." : s.name,
        current: s.proficiency,
        target: 85,
    }));
    // Progress over time chart data
    const progressLineData = recentProgress.length > 0
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
    return (<DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto pb-16 font-sans">
        {/* Apple HomeView Welcome Header */}
        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[12px] font-medium bg-[#0071e3]/10 text-[#0071e3]">
                <Sparkles className="h-3.5 w-3.5"/>
                <span>PMKVY Candidate Overview</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f]">
                Skill Intelligence Dashboard
              </h1>
              <p className="text-[#86868b] text-[14px] max-w-2xl leading-relaxed">
                Track your National Occupational Standards (NOS) benchmarks, monitor subsidized PMKVY
                course progress, and close competency deficits for target industry roles.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <Link href="/resume-analyser">
                <Button className="bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium text-[13px] rounded-full h-[40px] px-5 shadow-none">
                  <Sparkles className="h-3.5 w-3.5 mr-1.5"/> AI Resume Matcher
                </Button>
              </Link>
              <Link href="/assessment">
                <Button variant="outline" className="rounded-full text-[13px] border-[#d2d2d7] text-[#1d1d1f] hover:bg-[#f5f5f7] h-[40px] px-4">
                  Assessment <ChevronRight className="h-3.5 w-3.5 ml-1 text-[#86868b]"/>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* AI Resume & Job Match Feature Card */}
        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-[#0071e3] uppercase tracking-wider">
              Diagnostic Module
            </span>
            <h2 className="text-[18px] font-semibold text-[#1d1d1f] tracking-tight">
              AI Resume Matching & Competency Gap Audit
            </h2>
            <p className="text-[13px] text-[#86868b] max-w-2xl leading-relaxed">
              Upload your resume or paste a LinkedIn job URL to calculate qualification readiness
              and receive personalized PMKVY bridge course recommendations.
            </p>
          </div>
          <Link href="/resume-analyser" className="shrink-0">
            <Button className="bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium text-[14px] rounded-full h-[42px] px-6 shadow-none">
              Launch Diagnostic →
            </Button>
          </Link>
        </div>

        {/* Key Metrics Bento */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#86868b]">
              <span className="text-[12px] font-medium uppercase tracking-wider">Skills Assessed</span>
              <Award className="h-4 w-4 text-[#0071e3]"/>
            </div>
            <div className="mt-3">
              <h3 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight">{stats.totalSkillsAssessed}</h3>
              <p className="text-[12px] text-[#86868b] mt-1">Across technical domains</p>
            </div>
          </div>

          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#86868b]">
              <span className="text-[12px] font-medium uppercase tracking-wider">Avg Proficiency</span>
              <TrendingUp className="h-4 w-4 text-[#34c759]"/>
            </div>
            <div className="mt-3">
              <h3 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight">{stats.averageProficiency}%</h3>
              <div className="w-full bg-[#f5f5f7] h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div className="bg-[#34c759] h-full rounded-full" style={{ width: `${stats.averageProficiency}%` }}/>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#86868b]">
              <span className="text-[12px] font-medium uppercase tracking-wider">Skill Gap</span>
              <BarChart3 className="h-4 w-4 text-[#0071e3]"/>
            </div>
            <div className="mt-3">
              <h3 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight">{stats.overallSkillGap}%</h3>
              <p className="text-[12px] text-[#86868b] mt-1">
                {stats.overallSkillGap > 50 ? "Bridge courses recommended" : "Competency gap is manageable"}
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#86868b]">
              <span className="text-[12px] font-medium uppercase tracking-wider">PMKVY Courses</span>
              <BookOpen className="h-4 w-4 text-[#0071e3]"/>
            </div>
            <div className="mt-3">
              <h3 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight">{stats.coursesEnrolled}</h3>
              <p className="text-[12px] text-[#86868b] mt-1">{stats.coursesCompleted} completed</p>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current vs Target Proficiency Chart */}
          <Card className="border-[#e5e7eb] rounded-2xl">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-[17px] font-semibold text-[#1d1d1f]">
                Skill Proficiency vs Benchmark
              </CardTitle>
              <CardDescription className="text-[13px] text-[#86868b]">
                Verified proficiency compared against standard role target (85%)
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-2">
              {skillDistribution.length > 0 ? (<div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={skillDistribution.slice(0, 6)} margin={{ top: 20, right: 20, left: -10, bottom: 25 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f7"/>
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#86868b" }} interval={0} angle={-15} textAnchor="end"/>
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#86868b" }}/>
                      <Tooltip contentStyle={{
                backgroundColor: "#1d1d1f",
                borderRadius: "12px",
                color: "#fff",
                border: "none",
                fontSize: "12px",
            }}/>
                      <Bar dataKey="proficiency" name="Proficiency %" fill="#0071e3" radius={[6, 6, 0, 0]}/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>) : (<div className="h-72 flex flex-col items-center justify-center text-center p-6 border border-dashed border-[#e5e7eb] rounded-2xl bg-[#f5f5f7]/50">
                  <AlertCircle className="h-8 w-8 text-[#86868b] mb-2"/>
                  <p className="text-[14px] text-[#1d1d1f] font-medium">No assessed skills yet</p>
                  <p className="text-[12px] text-[#86868b] mt-1 mb-4">Complete an assessment to visualize proficiencies</p>
                  <Link href="/assessment">
                    <Button size="sm" className="bg-[#0071e3] text-white rounded-full">Start Assessment</Button>
                  </Link>
                </div>)}
            </CardContent>
          </Card>

          {/* Radar Chart */}
          <Card className="border-[#e5e7eb] rounded-2xl">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-[17px] font-semibold text-[#1d1d1f]">
                Competency Distribution Radar
              </CardTitle>
              <CardDescription className="text-[13px] text-[#86868b]">
                Multi-dimensional visualization of current skill balance
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-2">
              {radarData.length >= 3 ? (<div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                      <PolarGrid stroke="#e5e7eb"/>
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#1d1d1f" }}/>
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: "#86868b" }}/>
                      <Radar name="Your Skill" dataKey="current" stroke="#0071e3" fill="#0071e3" fillOpacity={0.3}/>
                      <Radar name="Benchmark" dataKey="target" stroke="#86868b" fill="#86868b" fillOpacity={0.1}/>
                      <Legend wrapperStyle={{ fontSize: "12px" }}/>
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>) : (<div className="h-72 flex flex-col items-center justify-center text-center p-6 border border-dashed border-[#e5e7eb] rounded-2xl bg-[#f5f5f7]/50">
                  <Compass className="h-8 w-8 text-[#86868b] mb-2"/>
                  <p className="text-[14px] text-[#1d1d1f] font-medium">Radar requires at least 3 assessed skills</p>
                  <p className="text-[12px] text-[#86868b] mt-1 mb-4">Complete an assessment to unlock radar insights</p>
                  <Link href="/assessment">
                    <Button size="sm" className="bg-[#0071e3] text-white rounded-full">Start Assessment</Button>
                  </Link>
                </div>)}
            </CardContent>
          </Card>
        </div>

        {/* Progress & Courses Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-[#e5e7eb] rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between p-6 pb-2">
              <div>
                <CardTitle className="text-[17px] font-semibold text-[#1d1d1f]">Learning Trajectory</CardTitle>
                <CardDescription className="text-[13px] text-[#86868b]">Proficiency progression over time</CardDescription>
              </div>
              <Link href="/progress">
                <Button variant="ghost" size="sm" className="text-[#0071e3] text-[13px] h-auto p-0">
                  View Progress →
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-6 pt-2">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressLineData} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f7"/>
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#86868b" }}/>
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#86868b" }}/>
                    <Tooltip contentStyle={{
            backgroundColor: "#1d1d1f",
            borderRadius: "12px",
            color: "#fff",
            border: "none",
            fontSize: "12px",
        }}/>
                    <Line type="monotone" dataKey="proficiency" name="Proficiency %" stroke="#0071e3" strokeWidth={2.5} dot={{ r: 4, fill: "#0071e3" }} activeDot={{ r: 6 }}/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#e5e7eb] rounded-2xl flex flex-col justify-between">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-[17px] font-semibold text-[#1d1d1f]">My PMKVY Courses</CardTitle>
              <CardDescription className="text-[13px] text-[#86868b]">Enrolled training programs</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-2 space-y-3 flex-1">
              {enrollments.length > 0 ? (enrollments.slice(0, 3).map((enr) => (<div key={enr.id} className="p-3.5 rounded-xl border border-[#e5e7eb] bg-[#f5f5f7] space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-[13px] font-medium text-[#1d1d1f] line-clamp-1">
                        {enr.course.name}
                      </h4>
                      <Badge variant={enr.status === "COMPLETED" ? "success" : "secondary"}>
                        {enr.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#86868b]">
                      <span>Progress</span>
                      <span className="font-medium text-[#1d1d1f]">{enr.progress}%</span>
                    </div>
                    <div className="w-full bg-white h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#0071e3] h-full rounded-full" style={{ width: `${enr.progress}%` }}/>
                    </div>
                  </div>))) : (<div className="text-center py-8">
                  <BookOpen className="h-8 w-8 text-[#86868b] mx-auto mb-2 opacity-50"/>
                  <p className="text-[13px] font-medium text-[#1d1d1f]">No active enrollments</p>
                  <p className="text-[11px] text-[#86868b] mt-0.5">Explore PMKVY courses matching your skill gap</p>
                </div>)}
            </CardContent>
            <div className="p-6 pt-0">
              <Link href="/courses" className="w-full block">
                <Button variant="outline" className="w-full justify-center rounded-full text-[13px] border-[#d2d2d7] text-[#1d1d1f] hover:bg-[#f5f5f7]">
                  Explore Courses →
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>);
}
