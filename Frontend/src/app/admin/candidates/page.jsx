"use client";
// [FRONTEND] Admin Candidate Directory | Route: /admin/candidates | Uses: GET /api/admin/candidates, DashboardLayout
import { useState, useEffect } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { EditorialPageHeader } from "@/components/story/EditorialPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  ArrowLeft,
  MapPin,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
} from "lucide-react";

export default function AdminCandidatesPage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let active = true;
    const fetchCandidates = async () => {
      try {
        const res = await apiFetch("/api/admin/candidates");
        const data = await res.json().catch(() => ({}));
        if (!active) return;
        if (res.ok) {
          setCandidates(data.candidates || []);
        } else {
          setErrorMsg(data.error || "Failed to load candidates.");
        }
      } catch (error) {
        if (!active) return;
        console.error("Failed to load candidates:", error);
        setErrorMsg("Network error while loading candidate directory.");
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchCandidates();
    return () => {
      active = false;
    };
  }, []);

  const filteredCandidates = candidates.filter((cand) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      cand.name?.toLowerCase().includes(q) ||
      cand.email?.toLowerCase().includes(q) ||
      cand.profile?.location?.toLowerCase().includes(q) ||
      cand.profile?.desiredCareerField?.toLowerCase().includes(q)
    );
  });

  const totalEnrollments = candidates.reduce(
    (acc, c) => acc + (c.enrollments?.length || 0),
    0
  );
  const assessedCount = candidates.filter(
    (c) => (c.assessments?.length || 0) > 0
  ).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Editorial Header */}
        <EditorialPageHeader
          variant="light"
          eyebrow="ADMIN / CANDIDATE ROSTER"
          title="Registered Candidates"
          italicAccent="Directory."
          description="Track candidate profiles, verified skills count, PMKVY enrollments, and latest readiness gaps."
          rightSlot={
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                Back to Console
              </Button>
            </Link>
          }
        />

        {/* Summary KPI Strip */}
        {errorMsg && (
          <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[13px] font-medium text-[#991B1B]">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="prepp-card p-4 flex items-center justify-between">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-wider text-[#52525B]">
                Total Candidates
              </div>
              <div className="mt-1 font-mono text-2xl font-bold text-[#111113]">
                {candidates.length}
              </div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#C7D2FE] bg-[#EEF0FF] text-[#4F46E5]">
              <Users className="h-4 w-4" />
            </div>
          </div>

          <div className="prepp-card p-4 flex items-center justify-between">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-wider text-[#52525B]">
                Assessed Profiles
              </div>
              <div className="mt-1 font-mono text-2xl font-bold text-[#065F46]">
                {assessedCount}
              </div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#A7F3D0] bg-[#ECFDF5] text-[#10B981]">
              <ClipboardCheck className="h-4 w-4" />
            </div>
          </div>

          <div className="prepp-card p-4 flex items-center justify-between">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-wider text-[#52525B]">
                Active Course Enrollments
              </div>
              <div className="mt-1 font-mono text-2xl font-bold text-[#111113]">
                {totalEnrollments}
              </div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E6E4DE] bg-[#F6F5F0] text-[#4F46E5]">
              <BookOpen className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Search Filter */}
        <div className="prepp-card p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#52525B]" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by candidate name, email, location, or domain..."
              className="pl-9"
            />
          </div>
          <span className="font-mono text-[12px] text-[#52525B]">
            Showing {filteredCandidates.length} of {candidates.length}
          </span>
        </div>

        {/* Roster Table */}
        <div className="prepp-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-y border-[#E6E4DE] bg-[#F6F5F0] font-mono text-[11px] font-semibold uppercase tracking-wider text-[#52525B]">
                  <th className="px-6 py-3">Candidate</th>
                  <th className="px-6 py-3">Location &amp; Education</th>
                  <th className="px-6 py-3">Target Field</th>
                  <th className="px-6 py-3">Verified Skills</th>
                  <th className="px-6 py-3">Courses</th>
                  <th className="px-6 py-3">Latest Assessment</th>
                  <th className="px-6 py-3 text-right">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E4DE] text-[13px]">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-[#52525B]">
                      Loading candidate directory...
                    </td>
                  </tr>
                ) : filteredCandidates.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-[#52525B]">
                      No candidate accounts match your search.
                    </td>
                  </tr>
                ) : (
                  filteredCandidates.map((cand) => {
                    const latestAssessment =
                      cand.assessments && cand.assessments.length > 0
                        ? cand.assessments[0]
                        : null;

                    return (
                      <tr
                        key={cand.id}
                        className="hover:bg-[#F6F5F0] transition-colors"
                      >
                        <td className="px-6 py-3.5">
                          <div className="font-semibold text-[#111113]">
                            {cand.name}
                          </div>
                          <div className="font-mono text-[11px] text-[#52525B]">
                            {cand.email}
                          </div>
                        </td>
                        <td className="px-6 py-3.5 text-[12px] text-[#52525B]">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3 w-3 text-[#52525B]" />
                            <span>{cand.profile?.location || "—"}</span>
                          </div>
                          <div className="mt-0.5 flex items-center gap-1.5 text-[#52525B]">
                            <GraduationCap className="h-3 w-3" />
                            <span>{cand.profile?.education || "Not set"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3.5 font-mono text-[12px] text-[#27272A]">
                          {cand.profile?.desiredCareerField || "General"}
                        </td>
                        <td className="px-6 py-3.5 font-mono text-[12px] font-semibold text-[#111113]">
                          {cand._count?.candidateSkills ?? 0}
                        </td>
                        <td className="px-6 py-3.5 font-mono text-[12px] font-semibold text-[#111113]">
                          {cand.enrollments?.length ?? 0}
                        </td>
                        <td className="px-6 py-3.5">
                          {latestAssessment ? (
                            <div className="space-y-1">
                              <div className="text-[12px] font-medium text-[#111113]">
                                {latestAssessment.jobRole?.title || "Assessed Role"}
                              </div>
                              <span
                                className={`inline-flex rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold ${
                                  (latestAssessment.skillGap ?? 100) <= 25
                                    ? "border-[#A7F3D0] bg-[#ECFDF5] text-[#065F46]"
                                    : "border-[#FDE68A] bg-[#FFFBEB] text-[#92400E]"
                                }`}
                              >
                                {Math.round(latestAssessment.skillGap ?? 0)}% Gap
                              </span>
                            </div>
                          ) : (
                            <span className="font-mono text-[11px] text-[#94A3B8]">
                              Not assessed
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-3.5 text-right font-mono text-[12px] text-[#52525B]">
                          {cand.createdAt
                            ? new Date(cand.createdAt).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "—"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
