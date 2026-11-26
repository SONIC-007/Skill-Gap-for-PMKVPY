"use client";
// [FRONTEND] Admin Telemetry Console | Route: /admin | Uses: GET /api/admin/stats, DashboardLayout, Recharts
import { useState, useEffect } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { EditorialPageHeader } from "@/components/story/EditorialPageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Layers,
  Briefcase,
  BookOpen,
  ArrowRight,
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
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let active = true;
    const fetchAdminStats = async () => {
      try {
        const res = await apiFetch("/api/admin/stats");
        const data = await res.json().catch(() => ({}));
        if (!active) return;
        if (res.ok) {
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
        } else {
          setErrorMsg(data.error || "Failed to load admin telemetry.");
        }
      } catch (error) {
        if (!active) return;
        console.error("Failed to load admin stats:", error);
        setErrorMsg("Network error while fetching admin stats.");
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchAdminStats();
    return () => {
      active = false;
    };
  }, []);

  const completionRate =
    stats.totalAssessments > 0
      ? Math.round((stats.completedAssessments / stats.totalAssessments) * 100)
      : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Editorial Studio Admin Header */}
        <EditorialPageHeader
          variant="studio"
          eyebrow="ADMIN CONSOLE • NSDC / PMKVY TELEMETRY"
          title="Program Intelligence &"
          italicAccent="Registry Overview."
          description="Monitor platform-wide candidate skill audits, Sector Skill Council taxonomies, job role mappings, and PMKVY enrollments."
          rightSlot={
            <div className="flex flex-wrap gap-2">
              <Link href="/admin/skills">
                <Button variant="secondary" size="sm">
                  Skills Matrix
                </Button>
              </Link>
              <Link href="/admin/job-roles">
                <Button variant="secondary" size="sm">
                  Job Roles
                </Button>
              </Link>
              <Link href="/admin/courses">
                <Button variant="secondary" size="sm">
                  Courses
                </Button>
              </Link>
              <Link href="/admin/candidates">
                <Button variant="terracotta" size="sm">
                  Candidates
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          }
        />

        {/* KPI Cards Row */}
        {errorMsg && (
          <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[13px] font-medium text-[#991B1B]">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/admin/candidates" className="prepp-card-interactive p-6 flex flex-col justify-between block">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF0FF] text-[#4F46E5]">
                <Users className="h-4.5 w-4.5" />
              </div>
              <span className="bento-chip">Roster</span>
            </div>
            <div className="mt-4">
              <div className="text-[12px] font-medium text-[#71717A]">Registered Candidates</div>
              <div className="mt-0.5 font-display text-3xl font-bold text-[#111113]">
                {loading ? "—" : stats.totalCandidates}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#F0F1F3] flex items-center justify-between text-[11.5px] font-medium text-[#111113]">
              <span>View Roster</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>

          <Link href="/admin/skills" className="prepp-card-interactive p-6 flex flex-col justify-between block">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ECFDF5] text-[#059669]">
                <Layers className="h-4.5 w-4.5" />
              </div>
              <span className="bento-chip">Taxonomies</span>
            </div>
            <div className="mt-4">
              <div className="text-[12px] font-medium text-[#71717A]">Skill Taxonomy Items</div>
              <div className="mt-0.5 font-display text-3xl font-bold text-[#111113]">
                {loading ? "—" : stats.totalSkills}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#F0F1F3] flex items-center justify-between text-[11.5px] font-medium text-[#111113]">
              <span>Manage Skills</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>

          <Link href="/admin/job-roles" className="prepp-card-interactive p-6 flex flex-col justify-between block">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFFBEB] text-[#D97706]">
                <Briefcase className="h-4.5 w-4.5" />
              </div>
              <span className="bento-chip">QP-NOS</span>
            </div>
            <div className="mt-4">
              <div className="text-[12px] font-medium text-[#71717A]">Mapped Job Roles</div>
              <div className="mt-0.5 font-display text-3xl font-bold text-[#111113]">
                {loading ? "—" : stats.totalJobRoles}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#F0F1F3] flex items-center justify-between text-[11.5px] font-medium text-[#111113]">
              <span>Inspect Roles</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>

          <Link href="/admin/courses" className="bento-sage-card p-6 flex flex-col justify-between block group">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white text-[#141913] font-mono text-[10.5px] font-semibold">
                #PMKVY 4.0
              </span>
              <BookOpen className="h-4.5 w-4.5 text-[#141913]/80" />
            </div>
            <div className="mt-4">
              <div className="text-[12px] font-medium text-[#141913]/75">PMKVY Bridge Courses</div>
              <div className="mt-0.5 font-display text-3xl font-bold text-[#141913]">
                {loading ? "—" : stats.totalCourses}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-black/[0.08] flex items-center justify-between text-[11.5px] font-semibold text-[#141913]">
              <span>{completionRate}% audit completion</span>
              <span className="h-7 w-7 rounded-full bg-[#18181B] text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>
        </div>

        {/* Analytics Charts Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="prepp-card p-6">
            <div className="flex items-center justify-between border-b border-[#E6E4DE] pb-3.5">
              <div>
                <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#4F46E5]">
                  TAXONOMY DISTRIBUTION
                </div>
                <h2 className="mt-0.5 font-display text-lg font-bold text-[#111113]">
                  Skills by SSC Domain
                </h2>
              </div>
              <Activity className="h-4 w-4 text-[#52525B]" />
            </div>

            <div className="mt-5 h-[280px] w-full">
              {skillsByDomain.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={skillsByDomain}
                    margin={{ top: 10, right: 16, left: 4, bottom: 26 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E6E4DE" />
                    <XAxis
                      dataKey="domain"
                      height={56}
                      tick={{ fill: "#52525B", fontSize: 10 }}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                      tickFormatter={(v) =>
                        v && v.length > 14 ? `${v.slice(0, 12)}…` : v
                      }
                      axisLine={{ stroke: "#D5D2CA" }}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: "#52525B", fontSize: 11, fontFamily: "monospace" }}
                      axisLine={{ stroke: "#D5D2CA" }}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #E6E4DE",
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
                <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-[#D5D2CA] bg-[#F6F5F0] text-[13px] text-[#52525B]">
                  No domain breakdown records found.
                </div>
              )}
            </div>
          </div>

          <div className="prepp-card p-6">
            <div className="flex items-center justify-between border-b border-[#E6E4DE] pb-3.5">
              <div>
                <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#10B981]">
                  CANDIDATE DEMAND SIGNAL
                </div>
                <h2 className="mt-0.5 font-display text-lg font-bold text-[#111113]">
                  Most Logged Competencies
                </h2>
              </div>
              <Layers className="h-4 w-4 text-[#52525B]" />
            </div>

            <div className="mt-5 h-[280px] w-full">
              {popularSkills.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={popularSkills}
                    margin={{ top: 10, right: 16, left: 4, bottom: 26 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E6E4DE" />
                    <XAxis
                      dataKey="skillName"
                      height={56}
                      tick={{ fill: "#52525B", fontSize: 10 }}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                      tickFormatter={(v) =>
                        v && v.length > 14 ? `${v.slice(0, 12)}…` : v
                      }
                      axisLine={{ stroke: "#D5D2CA" }}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: "#52525B", fontSize: 11, fontFamily: "monospace" }}
                      axisLine={{ stroke: "#D5D2CA" }}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #E6E4DE",
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
                <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-[#D5D2CA] bg-[#F6F5F0] text-[13px] text-[#52525B]">
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
              <h2 className="font-display text-lg font-bold text-[#111113]">
                Recent Candidate Registrations
              </h2>
              <p className="text-[13px] text-[#52525B]">
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
                <tr className="border-y border-[#E6E4DE] bg-[#F6F5F0] font-mono text-[11px] font-semibold uppercase tracking-wider text-[#52525B]">
                  <th className="px-6 py-3">Candidate Name</th>
                  <th className="px-6 py-3">Email Address</th>
                  <th className="px-6 py-3">Joined Date</th>
                  <th className="px-6 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E4DE] text-[13px]">
                {recentCandidates.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-[#52525B]"
                    >
                      No recent candidate registrations found.
                    </td>
                  </tr>
                ) : (
                  recentCandidates.map((cand) => (
                    <tr
                      key={cand.id}
                      className="hover:bg-[#F6F5F0] transition-colors"
                    >
                      <td className="px-6 py-3.5 font-medium text-[#111113]">
                        {cand.name}
                      </td>
                      <td className="px-6 py-3.5 font-mono text-[12px] text-[#52525B]">
                        {cand.email}
                      </td>
                      <td className="px-6 py-3.5 font-mono text-[12px] text-[#52525B]">
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
