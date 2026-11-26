"use client";
// [FRONTEND] Admin Telemetry Console | Route: /admin | Uses: GET /api/admin/stats, DashboardLayout, Recharts
import { useState, useEffect } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Layers,
  Briefcase,
  BookOpen,
  ClipboardCheck,
  ArrowRight,
  ShieldCheck,
  Activity,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalCandidates: 0,
    totalSkills: 0,
    totalJobRoles: 0,
    totalCourses: 0,
    totalAssessments: 0,
    completedAssessments: 0,
  });
  const [skillsByDomain, setSkillsByDomain] = useState([]);
  const [popularSkills, setPopularSkills] = useState([]);
  const [recentCandidates, setRecentCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await apiFetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats || {});
          setSkillsByDomain(
            (data.skillsByDomain || []).map((item) => ({
              domain: item.domain || "General",
              count: item._count?.id ?? item.count ?? 0,
            }))
          );
          setPopularSkills(
            (data.popularSkills || []).map((item) => ({
              skillName: item.skillName || "Skill",
              count: item._count?.id ?? item.count ?? 0,
            }))
          );
          setRecentCandidates(data.recentCandidates || []);
        }
      } catch (error) {
        console.error("Failed to load admin stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  const completionRate =
    stats.totalAssessments > 0
      ? Math.round((stats.completedAssessments / stats.totalAssessments) * 100)
      : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Admin Header Banner */}
        <div className="prepp-card overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-[#3525CD] via-[#4F46E5] to-[#10B981]" />
          <div className="p-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-md border border-[#C7C4D8] bg-[#F2F3FF] px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#3525CD]">
                <ShieldCheck className="h-3.5 w-3.5" />
                ADMIN CONSOLE · NSDC / PMKVY TELEMETRY
              </div>
              <h1 className="mt-3 font-display text-2xl sm:text-[28px] font-bold tracking-[-0.025em] text-[#0F172A]">
                Program Intelligence &amp; Registry Overview
              </h1>
              <p className="mt-1 text-[14px] text-[#475569]">
                Monitor platform-wide candidate skill audits, Sector Skill Council taxonomies, job role mappings, and PMKVY enrollments.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link href="/admin/skills">
                <Button variant="outline" size="sm">
                  Skills Matrix
                </Button>
              </Link>
              <Link href="/admin/job-roles">
                <Button variant="outline" size="sm">
                  Job Roles
                </Button>
              </Link>
              <Link href="/admin/courses">
                <Button variant="outline" size="sm">
                  Courses
                </Button>
              </Link>
              <Link href="/admin/candidates">
                <Button size="sm">
                  Candidates
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/admin/candidates" className="prepp-card-interactive p-5 block">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                Registered Candidates
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#C7C4D8] bg-[#F2F3FF] text-[#4F46E5]">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 font-mono text-3xl font-bold text-[#0F172A]">
              {loading ? "—" : stats.totalCandidates}
            </div>
            <div className="mt-1.5 font-mono text-[11px] text-[#4F46E5]">
              View Candidate Roster →
            </div>
          </Link>

          <Link href="/admin/skills" className="prepp-card-interactive p-5 block">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                Skill Taxonomy Items
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#A7F3D0] bg-[#ECFDF5] text-[#10B981]">
                <Layers className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 font-mono text-3xl font-bold text-[#0F172A]">
              {loading ? "—" : stats.totalSkills}
            </div>
            <div className="mt-1.5 font-mono text-[11px] text-[#065F46]">
              Manage Domain Taxonomy →
            </div>
          </Link>

          <Link href="/admin/job-roles" className="prepp-card-interactive p-5 block">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                Mapped Job Roles
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#FDE68A] bg-[#FFFBEB] text-[#F59E0B]">
                <Briefcase className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 font-mono text-3xl font-bold text-[#0F172A]">
              {loading ? "—" : stats.totalJobRoles}
            </div>
            <div className="mt-1.5 font-mono text-[11px] text-[#92400E]">
              Inspect NOS Benchmarks →
            </div>
          </Link>

          <Link href="/admin/courses" className="prepp-card-interactive p-5 block">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                PMKVY Bridge Courses
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[#334155]">
                <BookOpen className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 font-mono text-3xl font-bold text-[#0F172A]">
              {loading ? "—" : stats.totalCourses}
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 font-mono text-[11px] text-[#64748B]">
              <ClipboardCheck className="h-3.5 w-3.5 text-[#10B981]" />
              {stats.completedAssessments}/{stats.totalAssessments} audits ({completionRate}%)
            </div>
          </Link>
        </div>

        {/* Analytics Charts Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="prepp-card p-6">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3.5">
              <div>
                <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#4F46E5]">
                  TAXONOMY DISTRIBUTION
                </div>
                <h2 className="mt-0.5 font-display text-lg font-bold text-[#0F172A]">
                  Skills by SSC Domain
                </h2>
              </div>
              <Activity className="h-4 w-4 text-[#64748B]" />
            </div>

            <div className="mt-5 h-[280px] w-full">
              {skillsByDomain.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={skillsByDomain}
                    margin={{ top: 10, right: 16, left: 4, bottom: 26 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis
                      dataKey="domain"
                      height={56}
                      tick={{ fill: "#64748B", fontSize: 10 }}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                      tickFormatter={(v) =>
                        v && v.length > 14 ? `${v.slice(0, 12)}…` : v
                      }
                      axisLine={{ stroke: "#CBD5E1" }}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: "#64748B", fontSize: 11, fontFamily: "monospace" }}
                      axisLine={{ stroke: "#CBD5E1" }}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #E2E8F0",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Bar
                      dataKey="count"
                      name="Skills"
                      fill="#4F46E5"
                      radius={[4, 4, 0, 0]}
                      isAnimationActive={false}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-[#CBD5E1] bg-[#F8FAFC] text-[13px] text-[#64748B]">
                  No domain breakdown records found.
                </div>
              )}
            </div>
          </div>

          <div className="prepp-card p-6">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3.5">
              <div>
                <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#10B981]">
                  CANDIDATE DEMAND SIGNAL
                </div>
                <h2 className="mt-0.5 font-display text-lg font-bold text-[#0F172A]">
                  Most Logged Competencies
                </h2>
              </div>
              <Layers className="h-4 w-4 text-[#64748B]" />
            </div>

            <div className="mt-5 h-[280px] w-full">
              {popularSkills.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={popularSkills}
                    margin={{ top: 10, right: 16, left: 4, bottom: 26 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis
                      dataKey="skillName"
                      height={56}
                      tick={{ fill: "#64748B", fontSize: 10 }}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                      tickFormatter={(v) =>
                        v && v.length > 14 ? `${v.slice(0, 12)}…` : v
                      }
                      axisLine={{ stroke: "#CBD5E1" }}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: "#64748B", fontSize: 11, fontFamily: "monospace" }}
                      axisLine={{ stroke: "#CBD5E1" }}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #E2E8F0",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Bar
                      dataKey="count"
                      name="Candidates"
                      fill="#10B981"
                      radius={[4, 4, 0, 0]}
                      isAnimationActive={false}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-[#CBD5E1] bg-[#F8FAFC] text-[13px] text-[#64748B]">
                  No skill frequency metrics recorded yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Candidates Table */}
        <div className="prepp-card overflow-hidden">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-6 py-4">
            <div>
              <h2 className="font-display text-lg font-bold text-[#0F172A]">
                Recent Candidate Registrations
              </h2>
              <p className="text-[13px] text-[#64748B]">
                Latest accounts onboarded into the skill gap and PMKVY pipeline.
              </p>
            </div>
            <Link href="/admin/candidates">
              <Button variant="outline" size="sm">
                Full Roster
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-y border-[#E2E8F0] bg-[#F8FAFC] font-mono text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                  <th className="px-6 py-3">Candidate Name</th>
                  <th className="px-6 py-3">Email Address</th>
                  <th className="px-6 py-3">Joined Date</th>
                  <th className="px-6 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-[13px]">
                {recentCandidates.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-[#64748B]"
                    >
                      No recent candidate registrations found.
                    </td>
                  </tr>
                ) : (
                  recentCandidates.map((cand) => (
                    <tr
                      key={cand.id}
                      className="hover:bg-[#F8FAFC] transition-colors"
                    >
                      <td className="px-6 py-3.5 font-medium text-[#0F172A]">
                        {cand.name}
                      </td>
                      <td className="px-6 py-3.5 font-mono text-[12px] text-[#475569]">
                        {cand.email}
                      </td>
                      <td className="px-6 py-3.5 font-mono text-[12px] text-[#64748B]">
                        {cand.createdAt
                          ? new Date(cand.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <Badge className="border border-[#A7F3D0] bg-[#ECFDF5] font-mono text-[10px] text-[#065F46]">
                          ACTIVE
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
