"use client";
// [FRONTEND] Upskilling & Learning Progress Tracker | Route: /progress | Uses: GET/PUT /api/progress, DashboardLayout, Recharts
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { EditorialPageHeader } from "@/components/story/EditorialPageHeader";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  CheckCircle2,
  BookOpen,
  Award,
  ArrowRight,
  Layers,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function ProgressPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [candidateSkills, setCandidateSkills] = useState([]);
  const [progressHistory, setProgressHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const applyProgressPayload = (data) => {
    setEnrollments(data.enrollments || []);
    setCandidateSkills(data.candidateSkills || []);
    setProgressHistory(data.progressHistory || []);
  };

  const refreshProgress = useCallback(async () => {
    try {
      const res = await apiFetch("/api/progress");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Failed to load learning progress.");
      }
      applyProgressPayload(data);
    } catch (error) {
      console.error("Failed to fetch progress:", error);
      setErrorMsg(error.message || "Failed to load learning progress.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await apiFetch("/api/progress");
        const data = await res.json().catch(() => ({}));
        if (!active) return;
        if (!res.ok) {
          throw new Error(data.error || "Failed to load learning progress.");
        }
        applyProgressPayload(data);
      } catch (error) {
        if (!active) return;
        console.error("Failed to fetch progress:", error);
        setErrorMsg(error.message || "Failed to load learning progress.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleUpdateProgress = async (enrollmentId, targetProgress) => {
    const clamped = Math.max(0, Math.min(100, targetProgress));
    const status = clamped >= 100 ? "COMPLETED" : "IN_PROGRESS";
    setUpdatingId(enrollmentId);
    setErrorMsg("");
    try {
      const res = await apiFetch("/api/progress", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enrollmentId,
          progress: clamped,
          status,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to update course progress.");
        return;
      }
      if (status === "COMPLETED") {
        await refreshProgress();
      } else {
        setEnrollments((prev) =>
          prev.map((enr) =>
            enr.id === enrollmentId
              ? { ...enr, progress: clamped, status }
              : enr
          )
        );
      }
    } catch (error) {
      console.error("Failed to update progress:", error);
      setErrorMsg("Network error while saving progress.");
    } finally {
      setUpdatingId(null);
    }
  };

  const completedCourses = enrollments.filter(
    (e) => e.status === "COMPLETED" || e.progress >= 100
  ).length;

  const avgCompletion =
    enrollments.length > 0
      ? Math.round(
          enrollments.reduce((acc, e) => acc + (e.progress || 0), 0) /
            enrollments.length
        )
      : 0;

  const formattedProgressHistory = progressHistory.map((pt) => ({
    ...pt,
    date: pt.date
      ? new Date(pt.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })
      : "Session",
    readiness: pt.readiness ?? pt.proficiency ?? pt.score ?? 0,
  }));

  const progressRadius = 42;
  const progressCirc = 2 * Math.PI * progressRadius;
  const progressOffset = progressCirc - (avgCompletion / 100) * progressCirc;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Editorial Header */}
        <EditorialPageHeader
          variant="light"
          eyebrow="WORKSPACE / LEARNING TELEMETRY"
          title="Upskilling &"
          italicAccent="Progress Tracker."
          description="Monitor module completion, milestone readiness trends, and verified PMKVY competencies."
          rightSlot={
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/courses">
                <Button variant="outline" size="sm">
                  <BookOpen className="mr-1.5 h-3.5 w-3.5" />
                  Browse Courses
                </Button>
              </Link>
              <Link href="/assessment">
                <Button size="sm">Re-Assess Skills</Button>
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

        {/* 3 KPI Bento Cards (Ref 3 Style) */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Card 1: Radial Progress Card */}
          <div className="prepp-card prepp-card-interactive p-6 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="font-mono text-[10.5px] font-semibold uppercase tracking-wider text-[#71717A]">
                Course Progress
              </span>
              <div className="font-display text-3xl font-bold tracking-tight text-[#111113]">
                {avgCompletion}%
              </div>
              <p className="text-[12px] text-[#71717A]">
                Across {enrollments.length} active tracks
              </p>
            </div>

            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="courseRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#86BA6C" />
                    <stop offset="100%" stopColor="#DF9A57" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r={progressRadius} fill="none" stroke="#F1F2F4" strokeWidth="6.5" />
                <circle
                  cx="50"
                  cy="50"
                  r={progressRadius}
                  fill="none"
                  stroke="url(#courseRingGrad)"
                  strokeWidth="6.5"
                  strokeLinecap="round"
                  strokeDasharray={progressCirc}
                  strokeDashoffset={progressOffset}
                />
                <circle cx="50" cy={50 - progressRadius} r="3" fill="#86BA6C" />
              </svg>
              <span className="absolute font-display text-[15px] font-bold text-[#111113]">
                {avgCompletion}%
              </span>
            </div>
          </div>

          {/* Card 2: Sage Accent Certifications Card */}
          <Link href="/courses" className="bento-sage-card relative overflow-hidden p-6 flex flex-col justify-between group">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-4 right-5 w-14 h-14 rounded-full bg-gradient-to-br from-[#FA9A78] to-[#DE6A45] opacity-90 shadow-md"
            />
            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white text-[#141913] font-mono text-[10.5px] font-semibold shadow-xs">
                #Certifications
              </span>
              <Award className="h-4.5 w-4.5 text-[#141913]/80" />
            </div>
            <div className="relative z-10 mt-5 flex items-end justify-between">
              <div>
                <div className="font-display text-3xl font-bold text-[#141913]">
                  {completedCourses}
                  <span className="text-base font-medium text-[#141913]/70 ml-1.5">
                    / {enrollments.length}
                  </span>
                </div>
                <p className="text-[12px] font-medium text-[#141913]/80 mt-0.5">
                  NSQF milestones completed
                </p>
              </div>
              <span className="h-9 w-9 rounded-full bg-[#18181B] text-white flex items-center justify-center shadow-md group-hover:translate-x-1 transition-transform">
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>

          {/* Card 3: Slim Bar Verified Competencies Card */}
          <div className="prepp-card prepp-card-interactive p-6 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-[10.5px] font-semibold uppercase tracking-wider text-[#71717A]">
                  Verified Skills
                </span>
                <div className="mt-1 font-display text-3xl font-bold tracking-tight text-[#111113]">
                  {candidateSkills.length}
                  <span className="text-sm font-normal text-[#71717A] ml-1.5">logged</span>
                </div>
              </div>
              <span className="h-9 w-9 rounded-full bg-[#F4F5F7] flex items-center justify-center text-[#4F46E5]">
                <Layers className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-4 flex items-end gap-2 h-10">
              {[42, 65, 58, 92, 74, 86].map((h, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-full transition-colors ${
                    i === 3 ? "bg-[#86BA6C]" : "bg-[#E5E7EB]"
                  }`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Progress Trajectory Chart */}
        <div className="prepp-card p-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-[#E6E4DE] pb-4">
            <div>
              <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#4F46E5]">
                READINESS TRAJECTORY
              </div>
              <h2 className="mt-0.5 font-display text-lg font-bold text-[#111113]">
                Assessment Score &amp; Skill Match Trend
              </h2>
            </div>
            <span className="font-mono text-[11px] text-[#52525B]">
              Historical Evaluation Index (%)
            </span>
          </div>

          <div className="mt-5 h-[260px] w-full">
            {formattedProgressHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={formattedProgressHistory}
                  margin={{ top: 10, right: 16, left: -12, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#52525B", fontSize: 11, fontFamily: "monospace" }}
                    axisLine={{ stroke: "#D5D2CA" }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: "#52525B", fontSize: 11, fontFamily: "monospace" }}
                    axisLine={{ stroke: "#D5D2CA" }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111113",
                      border: "none",
                      borderRadius: "10px",
                      color: "#FFFFFF",
                      fontSize: "12px",
                      boxShadow: "0 10px 28px rgba(17, 17, 19, 0.25)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="readiness"
                    name="Proficiency %"
                    stroke="#86BA6C"
                    strokeWidth={3}
                    dot={{ r: 4.5, fill: "#86BA6C", strokeWidth: 2, stroke: "#FFFFFF" }}
                    activeDot={{ r: 6.5 }}
                    isAnimationActive={false}
                  />
                  {formattedProgressHistory.some((pt) => pt.score !== undefined) && (
                    <Line
                      type="monotone"
                      dataKey="score"
                      name="Score %"
                      stroke="#4F46E5"
                      strokeWidth={2}
                      dot={{ r: 3.5, fill: "#4F46E5", strokeWidth: 2, stroke: "#FFFFFF" }}
                      isAnimationActive={false}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-[#D5D2CA] bg-[#F6F5F0] p-6 text-center">
                <Sparkles className="h-6 w-6 text-[#52525B]" />
                <p className="mt-2 text-[13px] font-medium text-[#27272A]">
                  Complete an assessment or upload a resume to populate your readiness trajectory.
                </p>
                <Link href="/assessment" className="mt-3">
                  <Button size="sm" variant="outline">
                    Run First Assessment
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Active Course Progress Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-[#111113]">
                Enrolled PMKVY Courses
              </h2>
              <p className="text-[13px] text-[#52525B]">
                Log completed modules in real time or mark finished tracks complete.
              </p>
            </div>
            <Link
              href="/courses"
              className="inline-flex items-center gap-1 font-mono text-[12px] font-semibold text-[#4F46E5] hover:underline"
            >
              Add Courses
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[1, 2].map((idx) => (
                <div key={idx} className="prepp-card p-5 animate-pulse space-y-3">
                  <div className="h-5 w-2/3 rounded bg-[#E6E4DE]" />
                  <div className="h-2.5 w-full rounded bg-[#EFECE6]" />
                  <div className="h-8 w-1/2 rounded bg-[#E6E4DE]" />
                </div>
              ))}
            </div>
          ) : enrollments.length === 0 ? (
            <div className="prepp-card p-10 text-center">
              <BookOpen className="mx-auto h-8 w-8 text-[#52525B]" />
              <h3 className="mt-3 font-display text-base font-bold text-[#111113]">
                No courses enrolled yet
              </h3>
              <p className="mt-1 text-[13px] text-[#52525B]">
                Pick bridge courses tailored to your missing NSQF skills to begin tracking completion.
              </p>
              <Link href="/courses" className="mt-4 inline-block">
                <Button size="sm">Explore Catalog</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {enrollments.map((enrollment) => {
                const course = enrollment.course || {};
                const pct = enrollment.progress || 0;
                const isCompleted =
                  enrollment.status === "COMPLETED" || pct >= 100;
                const isUpdating = updatingId === enrollment.id;

                return (
                  <div
                    key={enrollment.id}
                    className="prepp-card prepp-card-interactive flex flex-col justify-between p-6"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="h-11 w-11 rounded-full bg-[#F4F5F7] border border-black/[0.05] flex items-center justify-center text-[#111113]">
                          <BookOpen className="h-4.5 w-4.5 text-[#4F46E5]" />
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-medium ${
                            isCompleted
                              ? "bg-[#ECFDF5] text-[#065F46]"
                              : "bg-[#F3F4F6] text-[#111113]"
                          }`}
                        >
                          {isCompleted ? "Completed" : "In Progress"}
                        </span>
                      </div>

                      <div className="mt-4">
                        <div className="flex items-center gap-1.5 text-[12px]">
                          <span className="font-semibold text-[#111113]">
                            {course.provider || "NSDC Partner"}
                          </span>
                          <span className="text-[#9CA3AF]">•</span>
                          <span className="text-[#9CA3AF]">
                            {course.duration || "Self-paced"}
                          </span>
                        </div>
                        <h3 className="mt-1 font-display text-[17px] font-semibold text-[#111113] leading-snug line-clamp-2">
                          {course.name || "Training Course"}
                        </h3>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <span className="bento-chip">
                          {course.category || "PMKVY 4.0"}
                        </span>
                        <span className="bento-chip">
                          {pct}% complete
                        </span>
                      </div>

                      <div className="mt-4">
                        <Progress
                          value={pct}
                          className="h-1.5"
                          indicatorClassName={
                            isCompleted ? "bg-[#86BA6C]" : "bg-[#111113]"
                          }
                        />
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[#F0F1F3] pt-4">
                      {isCompleted ? (
                        <div className="flex items-center gap-1.5 font-mono text-[12px] font-semibold text-[#065F46]">
                          <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                          Certification Ready
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() =>
                                handleUpdateProgress(enrollment.id, pct + 20)
                              }
                              className="px-2.5 py-1 rounded-lg bg-[#F3F4F6] hover:bg-[#E5E7EB] font-mono text-[11px] font-medium text-[#111113] transition-colors cursor-pointer"
                            >
                              +20%
                            </button>
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() =>
                                handleUpdateProgress(enrollment.id, pct + 40)
                              }
                              className="px-2.5 py-1 rounded-lg bg-[#F3F4F6] hover:bg-[#E5E7EB] font-mono text-[11px] font-medium text-[#111113] transition-colors cursor-pointer"
                            >
                              +40%
                            </button>
                          </div>

                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleUpdateProgress(enrollment.id, 100)}
                            className="px-3.5 py-1.5 rounded-lg bg-[#111113] hover:bg-[#27272A] text-white text-[12px] font-medium transition-colors cursor-pointer"
                          >
                            {isUpdating ? "Saving..." : "Mark Complete"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Verified Candidate Skills Grid */}
        <div className="prepp-card p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#E6E4DE] pb-4">
            <div>
              <h2 className="font-display text-lg font-bold text-[#111113]">
                Verified Skill Inventory
              </h2>
              <p className="text-[13px] text-[#52525B]">
                Proficiency ratings synced from your latest skill assessments and resume scans.
              </p>
            </div>
            <Link href="/skill-gap">
              <Button variant="outline" size="sm">
                View Matrix
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          {candidateSkills.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-[#D5D2CA] bg-[#F6F5F0] p-8 text-center">
              <p className="text-[13px] text-[#52525B]">
                No verified skills recorded yet. Run the AI Resume Analyser or complete an Assessment to populate your inventory.
              </p>
              <div className="mt-4 flex justify-center gap-2.5">
                <Link href="/resume-analyser">
                  <Button variant="outline" size="sm">
                    Resume Analyser
                  </Button>
                </Link>
                <Link href="/assessment">
                  <Button size="sm">Start Assessment</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {candidateSkills.map((cs, idx) => {
                const name = cs.skill?.name || cs.name || "Competency";
                const level = cs.proficiency ?? cs.level ?? 0;
                const domain = cs.skill?.domain || cs.domain || "Technical";
                return (
                  <div
                    key={cs.id || `skill-${idx}`}
                    className="rounded-2xl bg-[#F2F3FB] px-4 py-3.5 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-[13.5px] text-[#111113] truncate">
                        {name}
                      </div>
                      <div className="font-mono text-[10.5px] uppercase tracking-wider text-[#71717A] mt-0.5">
                        {domain}
                      </div>
                      <div className="mt-2">
                        <Progress
                          value={level}
                          className="h-1.5 bg-white"
                          indicatorClassName={
                            level >= 75
                              ? "bg-[#86BA6C]"
                              : level >= 50
                              ? "bg-[#4F46E5]"
                              : "bg-[#DF9A57]"
                          }
                        />
                      </div>
                    </div>
                    <span className="font-mono text-[14px] font-bold text-[#111113] shrink-0">
                      {level}%
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
