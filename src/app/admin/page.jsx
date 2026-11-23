"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Briefcase, Award, BarChart3, Settings, ArrowRight, FileText, Loader2, } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, } from "recharts";
const COLORS = ["#1e3a8a", "#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#0284c7", "#0d9488"];
export default function AdminPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetch("/api/admin/stats")
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
          <Loader2 className="h-10 w-10 animate-spin text-blue-900"/>
        </div>
      </DashboardLayout>);
    }
    const stats = data?.stats || {
        totalCandidates: 0,
        totalSkills: 0,
        totalJobRoles: 0,
        totalCourses: 0,
        totalAssessments: 0,
        completedAssessments: 0,
    };
    const skillsByDomain = (data?.skillsByDomain || []).map((d) => ({
        name: d.domain,
        count: d._count.id,
    }));
    const popularSkills = (data?.popularSkills || []).map((ps) => ({
        name: ps.skillName.length > 14 ? ps.skillName.substring(0, 12) + "..." : ps.skillName,
        candidates: ps._count.id,
    }));
    const recentCandidates = data?.recentCandidates || [];
    return (<DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-slate-900 to-blue-950 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800 text-blue-200 text-xs font-semibold">
              <Shield className="h-3.5 w-3.5"/> PMKVY National Administrator Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">System Administration & Oversight</h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Monitor nationwide candidate registrations, manage competency standards, job roles, and training course curricula.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/skills">
              <Button size="sm" variant="outline" className="border-blue-400 text-white hover:bg-blue-800/60">
                <Settings className="h-3.5 w-3.5 mr-1"/> Manage Skills
              </Button>
            </Link>
            <Link href="/admin/job-roles">
              <Button size="sm" variant="outline" className="border-blue-400 text-white hover:bg-blue-800/60">
                <Briefcase className="h-3.5 w-3.5 mr-1"/> Job Roles
              </Button>
            </Link>
            <Link href="/admin/courses">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white">
                <FileText className="h-3.5 w-3.5 mr-1"/> Add Course
              </Button>
            </Link>
          </div>
        </div>

        {/* High-level KPI Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="border-blue-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-500 uppercase">Candidates</p>
                <Users className="h-5 w-5 text-blue-900"/>
              </div>
              <h3 className="text-3xl font-black text-blue-950 mt-2">{stats.totalCandidates}</h3>
              <p className="text-xs text-slate-400 mt-1">Enrolled job seekers</p>
            </CardContent>
          </Card>

          <Card className="border-blue-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-500 uppercase">Job Roles</p>
                <Briefcase className="h-5 w-5 text-blue-900"/>
              </div>
              <h3 className="text-3xl font-black text-blue-950 mt-2">{stats.totalJobRoles}</h3>
              <p className="text-xs text-slate-400 mt-1">Across 7 key domains</p>
            </CardContent>
          </Card>

          <Card className="border-blue-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-500 uppercase">Competencies</p>
                <Award className="h-5 w-5 text-blue-900"/>
              </div>
              <h3 className="text-3xl font-black text-blue-950 mt-2">{stats.totalSkills}</h3>
              <p className="text-xs text-slate-400 mt-1">Technical & Soft Skills</p>
            </CardContent>
          </Card>

          <Card className="border-blue-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-500 uppercase">Assessments</p>
                <BarChart3 className="h-5 w-5 text-blue-900"/>
              </div>
              <h3 className="text-3xl font-black text-blue-950 mt-2">{stats.completedAssessments}</h3>
              <p className="text-xs text-emerald-600 mt-1 font-medium">Completed evaluations</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Skills Distribution by Domain */}
          <Card className="border-blue-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Competencies by Domain</CardTitle>
              <CardDescription>Number of registered skills categorized across national priority sectors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillsByDomain} margin={{ top: 20, right: 30, left: 0, bottom: 45 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} interval={0} angle={-25} textAnchor="end"/>
                    <YAxis tick={{ fontSize: 12, fill: "#64748b" }}/>
                    <Tooltip contentStyle={{
            backgroundColor: "#0f172a",
            borderRadius: "8px",
            color: "#fff",
            border: "none",
        }}/>
                    <Bar dataKey="count" name="Skills" fill="#1e3a8a" radius={[4, 4, 0, 0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Popular Candidate Skills */}
          <Card className="border-blue-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Most Assessed Candidate Skills</CardTitle>
              <CardDescription>Top competencies evaluated by enrolled PMKVY candidates</CardDescription>
            </CardHeader>
            <CardContent>
              {popularSkills.length > 0 ? (<div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={popularSkills} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                      <XAxis type="number" tick={{ fontSize: 12, fill: "#64748b" }}/>
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#475569" }}/>
                      <Tooltip contentStyle={{
                backgroundColor: "#0f172a",
                borderRadius: "8px",
                color: "#fff",
                border: "none",
            }}/>
                      <Bar dataKey="candidates" name="Candidates Evaluated" fill="#0284c7" radius={[0, 4, 4, 0]}/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>) : (<div className="h-80 flex items-center justify-center text-slate-400">
                  No candidate assessments completed yet
                </div>)}
            </CardContent>
          </Card>
        </div>

        {/* Recent Registered Candidates Table */}
        <Card className="border-blue-100 shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recently Registered Candidates</CardTitle>
              <CardDescription>Job seekers registered for skill gap evaluation</CardDescription>
            </div>
            <Link href="/admin/candidates">
              <Button variant="ghost" size="sm" className="text-blue-900">
                View All Candidates <ArrowRight className="h-4 w-4 ml-1"/>
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-y border-slate-200 text-slate-600 text-xs font-semibold">
                    <th className="py-3 px-6">Candidate Name</th>
                    <th className="py-3 px-6">Email Address</th>
                    <th className="py-3 px-6">Registered Date</th>
                    <th className="py-3 px-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentCandidates.map((c) => (<tr key={c.id} className="hover:bg-slate-50/50">
                      <td className="py-4 px-6 font-semibold text-blue-950">{c.name}</td>
                      <td className="py-4 px-6 text-slate-600">{c.email}</td>
                      <td className="py-4 px-6 text-slate-500 text-xs">
                        {new Date(c.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Badge variant="success" className="text-xs">
                          Active
                        </Badge>
                      </td>
                    </tr>))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>);
}
