"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  LOW: "bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]",
};

export default function CareerPathPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch("/api/career");
        if (res.ok) {
          const data = await res.json();
          const list = data.recommendations || [];
          setRecommendations(list);
          if (list.length > 0) {
            setSelectedRole(list[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching career recommendations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  const topReadiness =
    recommendations.length > 0
      ? Math.max(...recommendations.map((r) => r.readinessPercentage || 0))
      : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-[#E2E8F0] pb-5">
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#64748B]">
              <span>WORKSPACE</span>
              <span>/</span>
              <span className="text-[#4F46E5]">CAREER INTELLIGENCE</span>
            </div>
            <h1 className="mt-1.5 font-display text-2xl sm:text-[28px] font-bold tracking-[-0.025em] text-[#0F172A]">
              NSQF Career Path Explorer
            </h1>
            <p className="mt-1 text-[14px] text-[#475569]">
              Compare verified readiness across high-demand industry roles and map your phased PMKVY upskilling plan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 font-mono text-[12px] font-medium text-[#334155]">
              <Compass className="h-3.5 w-3.5 text-[#4F46E5]" />
              {recommendations.length} Roles Mapped
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#C7C4D8] bg-[#F2F3FF] px-3 py-1.5 font-mono text-[12px] font-semibold text-[#3525CD]">
              <TrendingUp className="h-3.5 w-3.5" />
              Peak Readiness: {topReadiness}%
            </span>
            <Link href="/assessment">
              <Button size="sm">Run Assessment</Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="prepp-card p-4 animate-pulse space-y-2">
                  <div className="h-4 w-1/3 rounded bg-[#E2E8F0]" />
                  <div className="h-5 w-3/4 rounded bg-[#E2E8F0]" />
                  <div className="h-2 w-full rounded bg-[#F1F5F9]" />
                </div>
              ))}
            </div>
            <div className="lg:col-span-8 prepp-card p-8 animate-pulse space-y-4">
              <div className="h-7 w-1/2 rounded bg-[#E2E8F0]" />
              <div className="h-20 w-full rounded bg-[#F1F5F9]" />
              <div className="h-40 w-full rounded bg-[#F1F5F9]" />
            </div>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="prepp-card p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]">
              <Compass className="h-6 w-6" />
            </div>
            <h2 className="mt-4 font-display text-lg font-bold text-[#0F172A]">
              No career matches computed yet
            </h2>
            <p className="mx-auto mt-1.5 max-w-md text-[13px] text-[#475569]">
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
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                  Ranked Career Trajectories
                </span>
                <span className="font-mono text-[11px] text-[#64748B]">
                  Readiness %
                </span>
              </div>

              <div className="space-y-2.5">
                {recommendations.map((role, index) => {
                  const isSelected = selectedRole?.id === role.id;
                  const demandKey = String(role.demandLevel || "MEDIUM").toUpperCase();
                  const demandClass =
                    DEMAND_BADGE[demandKey] || DEMAND_BADGE.MEDIUM;

                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role)}
                      className={`w-full text-left rounded-xl border p-4 transition-all ${
                        isSelected
                          ? "border-[#4F46E5] bg-[#F2F3FF]/60 shadow-[0_2px_8px_rgba(79,70,229,0.08)] ring-1 ring-[#4F46E5]/20"
                          : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:bg-[#F8FAFC]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] font-semibold text-[#64748B]">
                              #{String(index + 1).padStart(2, "0")}
                            </span>
                            <span
                              className={`inline-flex rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase ${demandClass}`}
                            >
                              {role.demandLevel} Demand
                            </span>
                          </div>
                          <h3 className="mt-1.5 font-display text-[15px] font-bold text-[#0F172A] truncate">
                            {role.title}
                          </h3>
                          <div className="mt-0.5 font-mono text-[11px] text-[#64748B]">
                            {role.domain}
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <span
                            className={`font-mono text-[16px] font-bold ${
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
                      </div>

                      <div className="mt-3">
                        <Progress
                          value={role.readinessPercentage || 0}
                          className="h-1.5"
                          indicatorClassName={
                            role.readinessPercentage >= 75
                              ? "bg-[#10B981]"
                              : role.readinessPercentage >= 45
                              ? "bg-[#4F46E5]"
                              : "bg-[#F59E0B]"
                          }
                        />
                      </div>

                      <div className="mt-2.5 flex items-center justify-between font-mono text-[11px] text-[#64748B]">
                        <span>
                          {(role.matchedSkills || []).length} matched ·{" "}
                          {(role.missingSkills || []).length} gaps
                        </span>
                        <span className="inline-flex items-center text-[#4F46E5] font-medium">
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
                <div className="prepp-card overflow-hidden">
                  <div className="h-1 w-full bg-gradient-to-r from-[#3525CD] via-[#4F46E5] to-[#10B981]" />
                  <div className="p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className="bg-[#F2F3FF] text-[#3525CD] border border-[#C7C4D8] font-mono text-[11px]">
                            {selectedRole.domain}
                          </Badge>
                          <Badge
                            className={`border font-mono text-[11px] ${
                              DEMAND_BADGE[
                                String(selectedRole.demandLevel || "MEDIUM").toUpperCase()
                              ] || DEMAND_BADGE.MEDIUM
                            }`}
                          >
                            {selectedRole.demandLevel} Market Demand
                          </Badge>
                        </div>

                        <h2 className="mt-3 font-display text-2xl font-bold tracking-[-0.02em] text-[#0F172A]">
                          {selectedRole.title}
                        </h2>
                        <p className="mt-2 text-[14px] leading-relaxed text-[#475569]">
                          {selectedRole.description}
                        </p>
                      </div>

                      <div className="shrink-0 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4 text-center sm:min-w-[140px]">
                        <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
                          Role Readiness
                        </div>
                        <div className="mt-1 font-mono text-3xl font-bold text-[#4F46E5]">
                          {selectedRole.readinessPercentage}%
                        </div>
                        <div className="mt-1 font-mono text-[11px] text-[#64748B]">
                          NSQF Target Fit
                        </div>
                      </div>
                    </div>

                    {/* Key Metrics Strip */}
                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 border-t border-[#E2E8F0] pt-5">
                      <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3.5">
                        <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-[#64748B]">
                          <IndianRupee className="h-3.5 w-3.5 text-[#10B981]" />
                          Compensation Band
                        </div>
                        <div className="mt-1 font-mono text-[15px] font-bold text-[#0F172A]">
                          {selectedRole.avgSalary || "₹4.5L – ₹8.5L / yr"}
                        </div>
                      </div>

                      <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3.5">
                        <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-[#64748B]">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" />
                          Matched Competencies
                        </div>
                        <div className="mt-1 font-mono text-[15px] font-bold text-[#065F46]">
                          {(selectedRole.matchedSkills || []).length} Skills Verified
                        </div>
                      </div>

                      <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3.5">
                        <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-[#64748B]">
                          <Target className="h-3.5 w-3.5 text-[#F59E0B]" />
                          Upskill Delta
                        </div>
                        <div className="mt-1 font-mono text-[15px] font-bold text-[#92400E]">
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
                      <h3 className="flex items-center gap-2 font-display text-[15px] font-bold text-[#0F172A]">
                        <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                        Matched Competencies
                      </h3>
                      <span className="font-mono text-[11px] font-semibold text-[#065F46]">
                        {(selectedRole.matchedSkills || []).length}
                      </span>
                    </div>
                    <p className="mt-1 text-[12px] text-[#64748B]">
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
                        <div className="rounded-lg border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-3 text-[12px] text-[#64748B] w-full">
                          No matching skills detected yet. Upload a resume or assess this role.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="prepp-card p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="flex items-center gap-2 font-display text-[15px] font-bold text-[#0F172A]">
                        <AlertCircle className="h-4 w-4 text-[#F59E0B]" />
                        Priority Upskill Targets
                      </h3>
                      <span className="font-mono text-[11px] font-semibold text-[#92400E]">
                        {(selectedRole.missingSkills || []).length}
                      </span>
                    </div>
                    <p className="mt-1 text-[12px] text-[#64748B]">
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
                      <div className="mt-4 pt-3 border-t border-[#E2E8F0]">
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
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#E2E8F0] pb-4">
                    <div>
                      <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#4F46E5]">
                        STRUCTURED MILESTONES
                      </div>
                      <h3 className="mt-0.5 font-display text-lg font-bold text-[#0F172A]">
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
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#C7C4D8] bg-[#F2F3FF] font-mono text-[12px] font-bold text-[#3525CD]">
                          01
                        </div>
                        <div className="mt-2 h-full w-px bg-[#E2E8F0]" />
                      </div>
                      <div className="pb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-display text-[15px] font-bold text-[#0F172A]">
                            Diagnostic Baseline &amp; NOS Verification
                          </h4>
                          <span className="rounded border border-[#E2E8F0] bg-[#F8FAFC] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#475569]">
                            WEEK 1
                          </span>
                        </div>
                        <p className="mt-1 text-[13px] text-[#475569]">
                          Lock in your baseline across{" "}
                          <span className="font-mono font-semibold text-[#0F172A]">
                            {(selectedRole.matchedSkills || []).length}
                          </span>{" "}
                          existing skills and benchmark exact proficiency targets for{" "}
                          <span className="font-medium text-[#0F172A]">
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
                        <div className="mt-2 h-full w-px bg-[#E2E8F0]" />
                      </div>
                      <div className="pb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-display text-[15px] font-bold text-[#0F172A]">
                            Bridge Core Domain Skill Gaps
                          </h4>
                          <span className="rounded border border-[#FDE68A] bg-[#FFFBEB] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#92400E]">
                            WEEKS 2–6
                          </span>
                        </div>
                        <p className="mt-1 text-[13px] text-[#475569]">
                          {(selectedRole.missingSkills || []).length > 0 ? (
                            <>
                              Complete accredited PMKVY lab modules covering{" "}
                              <span className="font-mono font-medium text-[#0F172A]">
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
                          <h4 className="font-display text-[15px] font-bold text-[#0F172A]">
                            NSQF Certification &amp; Placement Readiness
                          </h4>
                          <span className="rounded border border-[#A7F3D0] bg-[#ECFDF5] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#065F46]">
                            MILESTONE 100%
                          </span>
                        </div>
                        <p className="mt-1 text-[13px] text-[#475569]">
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
