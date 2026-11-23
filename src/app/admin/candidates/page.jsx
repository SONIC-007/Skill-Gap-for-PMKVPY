"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, MapPin, GraduationCap, Loader2, Search, } from "lucide-react";
export default function AdminCandidatesPage() {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    useEffect(() => {
        fetch("/api/admin/candidates")
            .then((res) => res.json())
            .then((data) => {
            setCandidates(data.candidates || []);
            setLoading(false);
        })
            .catch((err) => {
            console.error(err);
            setLoading(false);
        });
    }, []);
    const filtered = candidates.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        (c.profile?.location && c.profile.location.toLowerCase().includes(search.toLowerCase())) ||
        (c.profile?.desiredCareerField && c.profile.desiredCareerField.toLowerCase().includes(search.toLowerCase())));
    return (<DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <Link href="/admin" className="hover:text-blue-900 flex items-center gap-1">
                <ArrowLeft className="h-3 w-3"/> Admin Dashboard
              </Link>
              <span>/</span>
              <span>Candidate Directory</span>
            </div>
            <h1 className="text-3xl font-bold text-blue-950">Registered PMKVY Candidates</h1>
            <p className="text-slate-600">
              Overview of all enrolled students, assessments taken, and active learning progress.
            </p>
          </div>
        </div>

        {/* Search */}
        <Card className="border-blue-100 shadow-sm">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"/>
              <Input placeholder="Search candidates by name, email, location, or career field..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)}/>
            </div>
          </CardContent>
        </Card>

        {/* Candidates Grid */}
        {loading ? (<div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-900"/>
          </div>) : filtered.length === 0 ? (<div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-dashed">
            No candidates found matching search
          </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((c) => {
                const latestAssessment = c.assessments && c.assessments.length > 0 ? c.assessments[0] : null;
                return (<Card key={c.id} className="border-blue-100 shadow-sm flex flex-col justify-between">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-base">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <Badge variant="success" className="text-xs">Active</Badge>
                    </div>
                    <CardTitle className="text-lg text-blue-950">{c.name}</CardTitle>
                    <CardDescription className="text-xs text-slate-500 flex items-center gap-1.5 pt-0.5">
                      <Mail className="h-3.5 w-3.5"/> {c.email}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3 text-xs text-slate-600">
                    {c.profile?.location && (<div className="flex items-center gap-1.5 text-slate-500">
                        <MapPin className="h-3.5 w-3.5 text-slate-400"/>
                        <span>{c.profile.location}</span>
                      </div>)}
                    {c.profile?.education && (<div className="flex items-center gap-1.5 text-slate-500">
                        <GraduationCap className="h-3.5 w-3.5 text-slate-400"/>
                        <span className="truncate">{c.profile.education}</span>
                      </div>)}

                    <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-center">
                      <div className="p-2 rounded bg-slate-50">
                        <span className="text-[10px] text-slate-400 block uppercase">Assessed Skills</span>
                        <span className="text-sm font-bold text-blue-900">{c._count?.candidateSkills || 0}</span>
                      </div>
                      <div className="p-2 rounded bg-slate-50">
                        <span className="text-[10px] text-slate-400 block uppercase">Courses</span>
                        <span className="text-sm font-bold text-blue-900">{c.enrollments?.length || 0}</span>
                      </div>
                    </div>

                    {latestAssessment && (<div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-100 space-y-1">
                        <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wider block">
                          Latest Assessment: {latestAssessment.jobRole?.title}
                        </span>
                        <div className="flex items-center justify-between text-xs font-semibold text-blue-950">
                          <span>Calculated Skill Gap:</span>
                          <span className={latestAssessment.skillGap > 40 ? "text-amber-700" : "text-green-700"}>
                            {Math.round(latestAssessment.skillGap)}%
                          </span>
                        </div>
                      </div>)}
                  </CardContent>

                  <div className="p-4 pt-0 text-[11px] text-slate-400 border-t border-slate-50">
                    Registered: {new Date(c.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                </Card>);
            })}
          </div>)}
      </div>
    </DashboardLayout>);
}
