"use client";
// [FRONTEND] NSQF Career Path Explorer | Route: /career-path | Uses: GET /api/career, DashboardLayout
import { useState, useEffect } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { EditorialPageHeader } from "@/components/story/EditorialPageHeader";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Compass,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Briefcase,
  IndianRupee,
  Layers,
  Award,
  Target,
  ChevronRight,
} from "lucide-react";

const DEMAND_BADGE = {
  HIGH: "bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]",
  "VERY HIGH": "bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]",
  MEDIUM: "bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]",
  LOW: "bg-[#EFECE6] text-[#52525B] border-[#D5D2CA]",
};

export default function CareerPathPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let active = true;
    const fetchRecommendations = async () => {
      try {
        const res = await apiFetch("/api/career");
        const data = await res.json().catch(() => ({}));
        if (!active) return;
        if (res.ok) {
          const list = data.recommendations || [];
          setRecommendations(list);
          if (list.length > 0) {
            setSelectedRole(list[0]);
          }
        } else {
          setErrorMsg(data.error || "Failed to load career recommendations.");
        }
      } catch (error) {
        if (!active) return;
        console.error("Error fetching career recommendations:", error);
        setErrorMsg("Network error while loading career paths.");
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchRecommendations();
    return () => {
      active = false;
    };
  }, []);

  const topReadiness =
    recommendations.length > 0
      ? Math.max(...recommendations.map((r) => r.readinessPercentage || 0))
      : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Editorial Header */}
        <EditorialPageHeader
          variant="studio"
          eyebrow="WORKSPACE / CAREER INTELLIGENCE"
          title="NSQF Career"
          italicAccent="Path Explorer."
          description="Compare verified readiness across high-demand industry roles and map your phased PMKVY upskilling plan."
          rightSlot={
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 font-mono text-[11.5px] font-medium text-white">
                <Compass className="h-3.5 w-3.5 text-[#E07A5F]" />
                {recommendations.length} Roles Mapped
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/25 bg-indigo-500/20 px-3.5 py-1.5 font-mono text-[11.5px] font-semibold text-indigo-200">
                <TrendingUp className="h-3.5 w-3.5" />
                Peak: {topReadiness}%
              </span>
              <Link href="/assessment">
                <Button variant="terracotta" size="sm">Run Assessment</Button>
              </Link>
            </div>
          }
        />

        {errorMsg && (
          <div className="flex items-center gap-2.5 rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[13px] font-medium text-[#991B1B]">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="prepp-card p-4 animate-pulse space-y-2">
                  <div className="h-4 w-1/3 rounded bg-[#E6E4DE]" />
                  <div className="h-5 w-3/4 rounded bg-[#E6E4DE]" />
                  <div className="h-2 w-full rounded bg-[#EFECE6]" />
                </div>
              ))}
            </div>
            <div className="lg:col-span-8 prepp-card p-8 animate-pulse space-y-4">
              <div className="h-7 w-1/2 rounded bg-[#E6E4DE]" />
              <div className="h-20 w-full rounded bg-[#EFECE6]" />
              <div className="h-40 w-full rounded bg-[#EFECE6]" />
            </div>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="prepp-card p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#E6E4DE] bg-[#F6F5F0] text-[#52525B]">
              <Compass className="h-6 w-6" />
            </div>
            <h2 className="mt-4 font-display text-lg font-bold text-[#111113]">
              No career matches computed yet
            </h2>
            <p className="mx-auto mt-1.5 max-w-md text-[13px] text-[#52525B]">
              Analyze your resume or complete a skill assessment so we can calculate your readiness across PMKVY job roles.
            </p>
            <div className="mt-5 flex justify-center gap-2.5">
              <Link href="/resume-analyser">
                <Button variant="outline" size="sm">
                  AI Resume Analyser
                </Button>
              </Link>
              <Link href="/assessment">
                <Button size="sm">Start Assessment</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
            {/* Left 1/3 Column: Ranked Job Roles */}
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#52525B]">
                  Ranked Career Trajectories
                </span>
                <span className="font-mono text-[11px] text-[#52525B]">
                  Readiness %
                </span>
              </div>

              <div className="space-y-3">
                {recommendations.map((role, index) => {
                  const isSelected = selectedRole?.id === role.id;
                  const demandKey = String(role.demandLevel || "MEDIUM").toUpperCase();
                  const demandClass =
                    DEMAND_BADGE[demandKey] || DEMAND_BADGE.MEDIUM;
                  const roleMonogram = (role.title || "R").trim().charAt(0).toUpperCase();

                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role)}
                      className={`w-full text-left rounded-[22px] p-5 transition-all cursor-pointer ${
                        isSelected
                          ? "bg-white ring-2 ring-[#111113] shadow-[0_18px_38px_-14px_rgba(17,17,19,0.14)]"
                          : "bg-white border border-black/[0.05] shadow-[0_8px_24px_-14px_rgba(17,17,19,0.08)] hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-12px_rgba(17,17,19,0.12)]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`h-9 w-9 rounded-full flex items-center justify-center font-display text-[13px] font-bold ${
                              isSelected
                                ? "bg-[#111113] text-white"
                                : "bg-[#F4F5F7] text-[#111113]"
                            }`}
                          >
                            {roleMonogram}
                          </span>
                          <span className="font-mono text-[11px] font-semibold text-[#71717A]">
                            #{String(index + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <span
                          className={`inline-flex rounded-lg border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase ${demandClass}`}
                        >
                          {role.demandLevel} Demand
                        </span>
                      </div>

                      <div className="mt-3.5 flex items-baseline justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-display text-[16px] font-semibold text-[#111113] truncate">
                            {role.title}
                          </h3>
                          <div className="mt-0.5 text-[11.5px] text-[#71717A]">
                            {role.domain}
                          </div>
                        </div>
                        <span
                          className={`font-display text-[18px] font-bold shrink-0 ${
                            role.readinessPercentage >= 75
                              ? "text-[#065F46]"
                              : role.readinessPercentage >= 45
                              ? "text-[#4F46E5]"
                              : "text-[#92400E]"
                          }`}
                        >
                          {role.readinessPercentage}%
                        </span>
                      </div>

                      <div className="mt-3">
                        <Progress
                          value={role.readinessPercentage || 0}
                          className="h-1.5"
                          indicatorClassName={
                            role.readinessPercentage >= 75
                              ? "bg-[#86BA6C]"
                              : role.readinessPercentage >= 45
                              ? "bg-[#4F46E5]"
                              : "bg-[#DF9A57]"
                          }
                        />
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-[#F0F1F3] flex items-center justify-between font-mono text-[11px] text-[#71717A]">
                        <span>
                          {(role.matchedSkills || []).length} matched ·{" "}
                          {(role.missingSkills || []).length} gaps
                        </span>
                        <span className="inline-flex items-center text-[#111113] font-semibold">
                          Inspect
                          <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right 2/3 Column: Selected Role Deep Dive & Roadmap */}
            {selectedRole && (
              <div className="lg:col-span-8 space-y-5">
                {/* Hero Detail Card */}
                <div className="prepp-card p-6 sm:p-7">
                  <div>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="bento-chip bg-[#EEF0FF] text-[#4F46E5] font-semibold">
                            {selectedRole.domain}
                          </span>
                          <span
                            className={`inline-flex rounded-lg border px-2.5 py-0.5 font-mono text-[10.5px] font-semibold ${
                              DEMAND_BADGE[
                                String(selectedRole.demandLevel || "MEDIUM").toUpperCase()
                              ] || DEMAND_BADGE.MEDIUM
                            }`}
                          >
                            {selectedRole.demandLevel} Market Demand
                          </span>
                        </div>

                        <h2 className="mt-3 font-display text-2xl font-bold tracking-[-0.02em] text-[#111113]">
                          {selectedRole.title}
                        </h2>
                        <p className="mt-2 text-[14px] leading-relaxed text-[#52525B]">
                          {selectedRole.description}
                        </p>
                      </div>

                      <div className="shrink-0 rounded-2xl bg-[#F4F5F7] px-5 py-4 text-center sm:min-w-[140px]">
                        <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
                          Role Readiness
                        </div>
                        <div className="mt-1 font-display text-3xl font-bold text-[#111113]">
                          {selectedRole.readinessPercentage}%
                        </div>
                        <div className="mt-1 font-mono text-[10.5px] text-[#71717A]">
                          NSQF Target Fit
                        </div>
                      </div>
                    </div>

                    {/* Key Metrics Strip (Ref 2 Soft Bento Sub-Strip) */}
                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 border-t border-[#F0F1F3] pt-5">
                      <div className="bento-subtile p-4">
                        <div className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-wider text-[#71717A]">
                          <IndianRupee className="h-3.5 w-3.5 text-[#10B981]" />
                          Compensation Band
                        </div>
                        <div className="mt-1.5 font-display text-[16px] font-bold text-[#111113]">
                          {selectedRole.avgSalary || "₹4.5L – ₹8.5L / yr"}
                        </div>
                      </div>

                      <div className="bento-subtile p-4">
                        <div className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-wider text-[#71717A]">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" />
                          Matched Competencies
                        </div>
                        <div className="mt-1.5 font-display text-[16px] font-bold text-[#065F46]">
                          {(selectedRole.matchedSkills || []).length} Skills Verified
                        </div>
                      </div>

                      <div className="bento-subtile p-4">
                        <div className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-wider text-[#71717A]">
                          <Target className="h-3.5 w-3.5 text-[#F59E0B]" />
                          Upskill Delta
                        </div>
                        <div className="mt-1.5 font-display text-[16px] font-bold text-[#92400E]">
                          {(selectedRole.missingSkills || []).length} Modules Required
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Matched vs Missing Skill Cards */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="prepp-card p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="flex items-center gap-2 font-display text-[15px] font-bold text-[#111113]">
                        <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                        Matched Competencies
                      </h3>
                      <span className="font-mono text-[11px] font-semibold text-[#065F46]">
                        {(selectedRole.matchedSkills || []).length}
                      </span>
                    </div>
                    <p className="mt-1 text-[12px] text-[#52525B]">
                      Skills already verified on your profile or recent assessments.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(selectedRole.matchedSkills || []).length > 0 ? (
                        selectedRole.matchedSkills.map((skill, idx) => (
                          <span
                            key={`matched-${idx}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#A7F3D0] bg-[#ECFDF5] px-2.5 py-1 font-mono text-[12px] font-medium text-[#065F46]"
                          >
                            <CheckCircle2 className="h-3 w-3 text-[#10B981]" />
                            {skill}
                          </span>
                        ))
                      ) : (
                        <div className="rounded-lg border border-dashed border-[#D5D2CA] bg-[#F6F5F0] p-3 text-[12px] text-[#52525B] w-full">
                          No matching skills detected yet. Upload a resume or assess this role.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="prepp-card p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="flex items-center gap-2 font-display text-[15px] font-bold text-[#111113]">
                        <AlertCircle className="h-4 w-4 text-[#F59E0B]" />
                        Priority Upskill Targets
                      </h3>
                      <span className="font-mono text-[11px] font-semibold text-[#92400E]">
                        {(selectedRole.missingSkills || []).length}
                      </span>
                    </div>
                    <p className="mt-1 text-[12px] text-[#52525B]">
                      Required NOS competencies to bridge before role readiness hits 100%.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(selectedRole.missingSkills || []).length > 0 ? (
                        selectedRole.missingSkills.map((skill, idx) => (
                          <span
                            key={`missing-${idx}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#FDE68A] bg-[#FFFBEB] px-2.5 py-1 font-mono text-[12px] font-medium text-[#92400E]"
                          >
                            <AlertCircle className="h-3 w-3 text-[#F59E0B]" />
                            {skill}
                          </span>
                        ))
                      ) : (
                        <div className="rounded-lg border border-[#A7F3D0] bg-[#ECFDF5] p-3 text-[12px] font-medium text-[#065F46] w-full">
                          Zero competency gaps! You satisfy all benchmark skills for this role.
                        </div>
                      )}
                    </div>
                    {(selectedRole.missingSkills || []).length > 0 && (
                      <div className="mt-4 pt-3 border-t border-[#E6E4DE]">
                        <Link
                          href="/courses"
                          className="inline-flex items-center gap-1.5 font-mono text-[12px] font-semibold text-[#4F46E5] hover:underline"
                        >
                          Browse PMKVY Bridge Courses
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3-Phase Roadmap Timeline */}
                <div className="prepp-card p-6">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#E6E4DE] pb-4">
                    <div>
                      <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#4F46E5]">
                        STRUCTURED MILESTONES
                      </div>
                      <h3 className="mt-0.5 font-display text-lg font-bold text-[#111113]">
                        3-Phase PMKVY Upskilling Roadmap
                      </h3>
                    </div>
                    <Link href="/courses">
                      <Button variant="outline" size="sm">
                        Start Learning Plan
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>

                  <div className="mt-6 space-y-6">
                    {/* Phase 1 */}
                    <div className="relative flex gap-4 pl-2">
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#C7D2FE] bg-[#EEF0FF] font-mono text-[12px] font-bold text-[#4F46E5]">
                          01
                        </div>
                        <div className="mt-2 h-full w-px bg-[#E6E4DE]" />
                      </div>
                      <div className="pb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-display text-[15px] font-bold text-[#111113]">
                            Diagnostic Baseline &amp; NOS Verification
                          </h4>
                          <span className="rounded border border-[#E6E4DE] bg-[#F6F5F0] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#52525B]">
                            WEEK 1
                          </span>
                        </div>
                        <p className="mt-1 text-[13px] text-[#52525B]">
                          Lock in your baseline across{" "}
                          <span className="font-mono font-semibold text-[#111113]">
                            {(selectedRole.matchedSkills || []).length}
                          </span>{" "}
                          existing skills and benchmark exact proficiency targets for{" "}
                          <span className="font-medium text-[#111113]">
                            {selectedRole.title}
                          </span>
                          .
                        </p>
                        <div className="mt-2.5 flex flex-wrap gap-2">
                          <Link href="/assessment">
                            <Button size="sm" variant="outline" className="h-7 text-[12px]">
                              <Layers className="mr-1.5 h-3 w-3 text-[#4F46E5]" />
                              Take Role Assessment
                            </Button>
                          </Link>
                          <Link href="/resume-analyser">
                            <Button size="sm" variant="ghost" className="h-7 text-[12px]">
                              Audit Resume Fit
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Phase 2 */}
                    <div className="relative flex gap-4 pl-2">
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#FDE68A] bg-[#FFFBEB] font-mono text-[12px] font-bold text-[#92400E]">
                          02
                        </div>
                        <div className="mt-2 h-full w-px bg-[#E6E4DE]" />
                      </div>
                      <div className="pb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-display text-[15px] font-bold text-[#111113]">
                            Bridge Core Domain Skill Gaps
                          </h4>
                          <span className="rounded border border-[#FDE68A] bg-[#FFFBEB] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#92400E]">
                            WEEKS 2–6
                          </span>
                        </div>
                        <p className="mt-1 text-[13px] text-[#52525B]">
                          {(selectedRole.missingSkills || []).length > 0 ? (
                            <>
                              Complete accredited PMKVY lab modules covering{" "}
                              <span className="font-mono font-medium text-[#111113]">
                                {selectedRole.missingSkills.slice(0, 3).join(", ")}
                                {selectedRole.missingSkills.length > 3
                                  ? ` +${selectedRole.missingSkills.length - 3} more`
                                  : ""}
                              </span>{" "}
                              within the {selectedRole.domain} Sector Skill Council curriculum.
                            </>
                          ) : (
                            <>
                              Deepen specialization with advanced {selectedRole.domain} capstone projects and mock technical evaluations.
                            </>
                          )}
                        </p>
                        <div className="mt-2.5">
                          <Link href="/courses">
                            <Button size="sm" variant="outline" className="h-7 text-[12px]">
                              <Briefcase className="mr-1.5 h-3 w-3 text-[#4F46E5]" />
                              Enroll in Recommended Courses
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Phase 3 */}
                    <div className="relative flex gap-4 pl-2">
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#A7F3D0] bg-[#ECFDF5] font-mono text-[12px] font-bold text-[#065F46]">
                          03
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-display text-[15px] font-bold text-[#111113]">
                            NSQF Certification &amp; Placement Readiness
                          </h4>
                          <span className="rounded border border-[#A7F3D0] bg-[#ECFDF5] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#065F46]">
                            MILESTONE 100%
                          </span>
                        </div>
                        <p className="mt-1 text-[13px] text-[#52525B]">
                          Validate all completed courses inside your Progress Tracker, re-run the role readiness check, and earn placement-ready NSQF certification.
                        </p>
                        <div className="mt-2.5">
                          <Link href="/progress">
                            <Button size="sm" variant="outline" className="h-7 text-[12px]">
                              <Award className="mr-1.5 h-3 w-3 text-[#10B981]" />
                              Verify Progress &amp; Badges
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
