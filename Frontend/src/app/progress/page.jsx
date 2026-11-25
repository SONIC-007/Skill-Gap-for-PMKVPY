"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  CheckCircle2,
  BookOpen,
  Award,
  Clock,
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

  const fetchProgress = async () => {
    try {
      const res = await apiFetch("/api/progress");
      if (res.ok) {
        const data = await res.json();
        setEnrollments(data.enrollments || []);
        setCandidateSkills(data.candidateSkills || []);
        setProgressHistory(data.progressHistory || []);
      }
    } catch (error) {
      console.error("Failed to fetch progress:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const handleUpdateProgress = async (enrollmentId, targetProgress) => {
    const clamped = Math.max(0, Math.min(100, targetProgress));
    const status = clamped >= 100 ? "COMPLETED" : "IN_PROGRESS";
    setUpdatingId(enrollmentId);
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
      if (res.ok) {
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-[#E2E8F0] pb-5">
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#64748B]">
              <span>WORKSPACE</span>
              <span>/</span>
              <span className="text-[#4F46E5]">LEARNING TELEMETRY</span>
            </div>
            <h1 className="mt-1.5 font-display text-2xl sm:text-[28px] font-bold tracking-[-0.025em] text-[#0F172A]">
              Upskilling &amp; Progress Tracker
            </h1>
            <p className="mt-1 text-[14px] text-[#475569]">
              Monitor module completion, milestone readiness trends, and verified PMKVY competencies.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
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
        </div>

        {/* 3 KPI Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="prepp-card p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                Course Completion Avg
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#C7C4D8] bg-[#F2F3FF] text-[#4F46E5]">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-[#0F172A]">
                {avgCompletion}%
              </span>
              <span className="font-mono text-[12px] text-[#64748B]">
                across {enrollments.length} enrolled
              </span>
            </div>
            <div className="mt-3">
              <Progress
                value={avgCompletion}
                className="h-1.5"
                indicatorClassName="bg-[#4F46E5]"
              />
            </div>
          </div>

          <div className="prepp-card p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                Completed Certifications
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#A7F3D0] bg-[#ECFDF5] text-[#10B981]">
                <Award className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-[#0F172A]">
                {completedCourses}
              </span>
              <span className="font-mono text-[12px] text-[#065F46]">
                / {enrollments.length} courses finished
              </span>
            </div>
            <div className="mt-3 font-mono text-[11px] text-[#64748B]">
              NSQF milestone modules synced
            </div>
          </div>

          <div className="prepp-card p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                Verified Competencies
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[#4F46E5]">
                <Layers className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-[#0F172A]">
                {candidateSkills.length}
              </span>
              <span className="font-mono text-[12px] text-[#64748B]">
                active skills logged
              </span>
            </div>
            <div className="mt-3 font-mono text-[11px] text-[#64748B]">
              Updated via Resume &amp; Assessment
            </div>
          </div>
        </div>

        {/* Progress Trajectory Chart */}
        <div className="prepp-card p-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-[#E2E8F0] pb-4">
            <div>
              <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#4F46E5]">
                READINESS TRAJECTORY
              </div>
              <h2 className="mt-0.5 font-display text-lg font-bold text-[#0F172A]">
                Assessment Score &amp; Skill Match Trend
              </h2>
            </div>
            <span className="font-mono text-[11px] text-[#64748B]">
              Historical Evaluation Index (%)
            </span>
          </div>

          <div className="mt-5 h-[260px] w-full">
            {progressHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={progressHistory}
                  margin={{ top: 10, right: 16, left: -12, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#64748B", fontSize: 11, fontFamily: "monospace" }}
                    axisLine={{ stroke: "#CBD5E1" }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
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
                      boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="readiness"
                    name="Readiness %"
                    stroke="#4F46E5"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "#4F46E5", strokeWidth: 2, stroke: "#FFFFFF" }}
                    activeDot={{ r: 6 }}
                  />
                  {progressHistory.some((pt) => pt.score !== undefined) && (
                    <Line
                      type="monotone"
                      dataKey="score"
                      name="Score %"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{ r: 3.5, fill: "#10B981", strokeWidth: 2, stroke: "#FFFFFF" }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-6 text-center">
                <Sparkles className="h-6 w-6 text-[#64748B]" />
                <p className="mt-2 text-[13px] font-medium text-[#334155]">
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
              <h2 className="font-display text-lg font-bold text-[#0F172A]">
                Enrolled PMKVY Courses
              </h2>
              <p className="text-[13px] text-[#64748B]">
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
                  <div className="h-5 w-2/3 rounded bg-[#E2E8F0]" />
                  <div className="h-2.5 w-full rounded bg-[#F1F5F9]" />
                  <div className="h-8 w-1/2 rounded bg-[#E2E8F0]" />
                </div>
              ))}
            </div>
          ) : enrollments.length === 0 ? (
            <div className="prepp-card p-10 text-center">
              <BookOpen className="mx-auto h-8 w-8 text-[#64748B]" />
              <h3 className="mt-3 font-display text-base font-bold text-[#0F172A]">
                No courses enrolled yet
              </h3>
              <p className="mt-1 text-[13px] text-[#475569]">
                Pick bridge courses tailored to your missing NSQF skills to begin tracking completion.
              </p>
              <Link href="/courses" className="mt-4 inline-block">
                <Button size="sm">Explore Catalog</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {enrollments.map((enrollment) => {
                const course = enrollment.course || {};
                const pct = enrollment.progress || 0;
                const isCompleted =
                  enrollment.status === "COMPLETED" || pct >= 100;
                const isUpdating = updatingId === enrollment.id;

                return (
                  <div
                    key={enrollment.id}
                    className="prepp-card flex flex-col justify-between p-5"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#64748B]">
                            {course.category || "PMKVY Module"}
                          </span>
                          <h3 className="mt-1 font-display text-[16px] font-bold text-[#0F172A]">
                            {course.name || "Training Course"}
                          </h3>
                          <div className="mt-1 flex items-center gap-2 font-mono text-[11px] text-[#64748B]">
                            <span>{course.provider || "NSDC"}</span>
                            <span>·</span>
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {course.duration || "Self-paced"}
                            </span>
                          </div>
                        </div>

                        <Badge
                          className={`shrink-0 border font-mono text-[10px] ${
                            isCompleted
                              ? "border-[#A7F3D0] bg-[#ECFDF5] text-[#065F46]"
                              : "border-[#C7C4D8] bg-[#F2F3FF] text-[#3525CD]"
                          }`}
                        >
                          {isCompleted ? "COMPLETED" : "IN PROGRESS"}
                        </Badge>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between font-mono text-[12px]">
                          <span className="text-[#475569]">Module Progress</span>
                          <span className="font-bold text-[#0F172A]">{pct}%</span>
                        </div>
                        <Progress
                          value={pct}
                          className="h-2"
                          indicatorClassName={
                            isCompleted ? "bg-[#10B981]" : "bg-[#4F46E5]"
                          }
                        />
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[#E2E8F0] pt-4">
                      {isCompleted ? (
                        <div className="flex items-center gap-1.5 font-mono text-[12px] font-semibold text-[#065F46]">
                          <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                          Certification Ready
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isUpdating}
                            onClick={() =>
                              handleUpdateProgress(enrollment.id, pct + 20)
                            }
                            className="h-8 font-mono text-[12px]"
                          >
                            +20%
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isUpdating}
                            onClick={() =>
                              handleUpdateProgress(enrollment.id, pct + 40)
                            }
                            className="h-8 font-mono text-[12px]"
                          >
                            +40%
                          </Button>
                        </div>
                      )}

                      {!isCompleted && (
                        <Button
                          size="sm"
                          disabled={isUpdating}
                          onClick={() => handleUpdateProgress(enrollment.id, 100)}
                          className="h-8 text-[12px]"
                        >
                          {isUpdating ? "Saving..." : "Mark Complete"}
                        </Button>
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
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#E2E8F0] pb-4">
            <div>
              <h2 className="font-display text-lg font-bold text-[#0F172A]">
                Verified Skill Inventory
              </h2>
              <p className="text-[13px] text-[#64748B]">
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
            <div className="mt-6 rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-8 text-center">
              <p className="text-[13px] text-[#475569]">
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
                    className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-[13px] text-[#0F172A] truncate">
                        {name}
                      </span>
                      <span className="font-mono text-[12px] font-bold text-[#4F46E5]">
                        {level}%
                      </span>
                    </div>
                    <div className="mt-2">
                      <Progress
                        value={level}
                        className="h-1.5"
                        indicatorClassName={
                          level >= 75
                            ? "bg-[#10B981]"
                            : level >= 50
                            ? "bg-[#4F46E5]"
                            : "bg-[#F59E0B]"
                        }
                      />
                    </div>
                    <div className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-[#64748B]">
                      {domain}
                    </div>
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
