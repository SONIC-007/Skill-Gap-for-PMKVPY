"use client";
// [FRONTEND] PMKVY 4.0 Course Catalog & Enrollment | Route: /courses | Uses: GET /api/courses, POST /api/enroll, DashboardLayout
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Clock,
  CheckCircle2,
  ExternalLink,
  Search,
  Sparkles,
  Award,
  Building2,
  X,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

const DIFFICULTY_STYLES = {
  BEGINNER: "bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]",
  INTERMEDIATE: "bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]",
  ADVANCED: "bg-[#F2F3FF] text-[#3525CD] border-[#C7C4D8]",
};

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);
  const [portalModalCourse, setPortalModalCourse] = useState(null);
  const [feedbackBanner, setFeedbackBanner] = useState(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== "ALL") params.set("category", selectedCategory);
      if (selectedDifficulty !== "ALL") params.set("difficulty", selectedDifficulty);

      const res = await apiFetch(`/api/courses?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses || []);
        if (Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedDifficulty]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleEnroll = async (course) => {
    setEnrollingId(course.id);
    setFeedbackBanner(null);
    try {
      const res = await apiFetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setCourses((prev) =>
          prev.map((c) => (c.id === course.id ? { ...c, isEnrolled: true } : c))
        );
        setFeedbackBanner({
          type: "success",
          message: `Enrolled in "${course.name}". Track modules in Progress or complete Skill India Digital registration.`,
        });
        setPortalModalCourse(course);
      } else {
        setFeedbackBanner({
          type: "error",
          message: data.error || "Unable to enroll in this course right now.",
        });
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      setFeedbackBanner({
        type: "error",
        message: "Network error while enrolling in course.",
      });
    } finally {
      setEnrollingId(null);
    }
  };

  const filteredCourses = courses.filter((course) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchName = course.name?.toLowerCase().includes(q);
    const matchDesc = course.description?.toLowerCase().includes(q);
    const matchProvider = course.provider?.toLowerCase().includes(q);
    const matchCat = course.category?.toLowerCase().includes(q);
    const matchSkill = (course.skillsCovered || []).some((s) =>
      String(s).toLowerCase().includes(q)
    );
    return matchName || matchDesc || matchProvider || matchCat || matchSkill;
  });

  const enrolledCount = courses.filter((c) => c.isEnrolled).length;
  const hasFilters =
    selectedCategory !== "ALL" ||
    selectedDifficulty !== "ALL" ||
    searchQuery.trim().length > 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-[#E2E8F0] pb-5">
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#64748B]">
              <span>WORKSPACE</span>
              <span>/</span>
              <span className="text-[#4F46E5]">PMKVY COURSES</span>
            </div>
            <h1 className="mt-1.5 font-display text-2xl sm:text-[28px] font-bold tracking-[-0.025em] text-[#0F172A]">
              NSQF Course Catalog &amp; Skill Bridge
            </h1>
            <p className="mt-1 text-[14px] text-[#475569]">
              Personalized PMKVY 4.0 and NSDC training tracks ranked by alignment to your detected skill gaps.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 font-mono text-[12px] font-medium text-[#334155]">
              <BookOpen className="h-3.5 w-3.5 text-[#4F46E5]" />
              {courses.length} Courses
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#A7F3D0] bg-[#ECFDF5] px-3 py-1.5 font-mono text-[12px] font-medium text-[#065F46]">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" />
              {enrolledCount} Enrolled
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPortalModalCourse({
                  name: "PMKVY 4.0 National Course Registry",
                  provider: "NSDC / Skill India Digital",
                  category: "All Sector Skill Councils",
                })
              }
            >
              <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
              Skill India Portal
            </Button>
          </div>
        </div>

        {/* Feedback Banner */}
        {feedbackBanner && (
          <div
            className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-[13px] ${
              feedbackBanner.type === "success"
                ? "border-[#A7F3D0] bg-[#ECFDF5] text-[#065F46]"
                : "border-[#FECACA] bg-[#FEF2F2] text-[#991B1B]"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{feedbackBanner.message}</span>
            </div>
            <div className="flex items-center gap-2">
              {feedbackBanner.type === "success" && (
                <Link
                  href="/progress"
                  className="font-semibold underline underline-offset-2 hover:opacity-80"
                >
                  Open Progress
                </Link>
              )}
              <button
                type="button"
                onClick={() => setFeedbackBanner(null)}
                className="rounded p-1 hover:bg-black/5"
                aria-label="Dismiss message"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* PrepP Filter Bar */}
        <div className="prepp-card p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-center">
            <div className="relative md:col-span-5">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses, SSC provider, or skill (e.g. React, EV, Python)..."
                className="pl-9"
              />
            </div>

            <div className="md:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filter by category"
                className="h-9 w-full rounded-lg border border-[#CBD5E1] bg-white px-3 text-[13px] text-[#0F172A] focus:border-[#4F46E5] focus:outline-none"
              >
                <option value="ALL">All Categories ({categories.length || "All"})</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                aria-label="Filter by difficulty"
                className="h-9 w-full rounded-lg border border-[#CBD5E1] bg-white px-3 text-[13px] text-[#0F172A] focus:border-[#4F46E5] focus:outline-none"
              >
                <option value="ALL">All Difficulty Levels</option>
                <option value="BEGINNER">Beginner (NSQF L3–L4)</option>
                <option value="INTERMEDIATE">Intermediate (NSQF L4–L5)</option>
                <option value="ADVANCED">Advanced (NSQF L5–L6)</option>
              </select>
            </div>

            <div className="md:col-span-1 flex justify-end">
              {hasFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("ALL");
                    setSelectedDifficulty("ALL");
                  }}
                  className="w-full md:w-auto text-[#475569]"
                >
                  <RotateCcw className="mr-1 h-3.5 w-3.5" />
                  Reset
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="prepp-card p-5 space-y-4 animate-pulse"
              >
                <div className="flex justify-between">
                  <div className="h-5 w-24 rounded bg-[#E2E8F0]" />
                  <div className="h-5 w-16 rounded bg-[#E2E8F0]" />
                </div>
                <div className="h-6 w-4/5 rounded bg-[#E2E8F0]" />
                <div className="h-12 w-full rounded bg-[#F1F5F9]" />
                <div className="flex gap-2">
                  <div className="h-5 w-16 rounded bg-[#E2E8F0]" />
                  <div className="h-5 w-20 rounded bg-[#E2E8F0]" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="prepp-card p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]">
              <BookOpen className="h-6 w-6" />
            </div>
            <h2 className="mt-4 font-display text-lg font-bold text-[#0F172A]">
              No matching PMKVY courses found
            </h2>
            <p className="mx-auto mt-1.5 max-w-md text-[13px] text-[#475569]">
              Try clearing active domain or difficulty filters, or complete a Skill Gap Assessment to unlock personalized rankings.
            </p>
            <div className="mt-5 flex justify-center gap-2.5">
              {hasFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("ALL");
                    setSelectedDifficulty("ALL");
                  }}
                >
                  Clear All Filters
                </Button>
              )}
              <Link href="/assessment">
                <Button size="sm">Run Assessment</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => {
              const skills = Array.isArray(course.skillsCovered)
                ? course.skillsCovered
                : [];
              const diffStyle =
                DIFFICULTY_STYLES[course.difficulty] ||
                "bg-[#F1F5F9] text-[#334155] border-[#CBD5E1]";

              return (
                <div
                  key={course.id}
                  className="prepp-card-interactive flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-5">
                    {/* Top Metadata Pills */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${diffStyle}`}
                      >
                        {course.difficulty}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {course.relevanceScore > 0 && (
                          <span className="inline-flex items-center gap-1 rounded-md border border-[#C7C4D8] bg-[#F2F3FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#3525CD]">
                            <Sparkles className="h-3 w-3" />
                            {course.relevanceScore}% Fit
                          </span>
                        )}
                        {course.isEnrolled && (
                          <span className="inline-flex items-center gap-1 rounded-md border border-[#A7F3D0] bg-[#ECFDF5] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#065F46]">
                            <CheckCircle2 className="h-3 w-3" />
                            Enrolled
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title & Provider */}
                    <div className="mt-3.5">
                      <div className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#64748B]">
                        {course.category}
                      </div>
                      <h3 className="mt-1 font-display text-[17px] font-bold leading-snug text-[#0F172A]">
                        {course.name}
                      </h3>
                      <div className="mt-1.5 flex items-center gap-1.5 text-[12px] text-[#475569]">
                        <Building2 className="h-3.5 w-3.5 text-[#64748B]" />
                        <span className="truncate">{course.provider}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-[#475569]">
                      {course.description}
                    </p>

                    {/* Covered NOS / Skills */}
                    <div className="mt-4">
                      <div className="mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
                        Competencies Covered
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {skills.slice(0, 4).map((skill, idx) => (
                          <Badge
                            key={`${course.id}-sk-${idx}`}
                            variant="outline"
                            className="bg-[#F8FAFC] font-mono text-[11px] text-[#334155]"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {skills.length > 4 && (
                          <Badge
                            variant="outline"
                            className="bg-[#F1F5F9] font-mono text-[11px] text-[#64748B]"
                          >
                            +{skills.length - 4} more
                          </Badge>
                        )}
                        {skills.length === 0 && (
                          <span className="text-[12px] text-[#94A3B8]">
                            NSQF Standard Curriculum
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="flex items-center justify-between gap-3 border-t border-[#E2E8F0] bg-[#F8FAFC] px-5 py-3">
                    <div className="flex items-center gap-1.5 font-mono text-[12px] font-medium text-[#475569]">
                      <Clock className="h-3.5 w-3.5 text-[#64748B]" />
                      <span>{course.duration}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {course.isEnrolled ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setPortalModalCourse(course)}
                            className="rounded-lg border border-[#CBD5E1] bg-white px-2.5 py-1.5 font-mono text-[11px] font-medium text-[#334155] hover:border-[#4F46E5] hover:text-[#4F46E5] transition-colors"
                          >
                            Portal
                          </button>
                          <Link href="/progress">
                            <Button size="sm" variant="outline" className="h-8 text-[12px]">
                              Track
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          </Link>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleEnroll(course)}
                          disabled={enrollingId === course.id}
                          className="h-8 text-[12px]"
                        >
                          {enrollingId === course.id ? (
                            <span className="inline-flex items-center gap-1.5">
                              <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              Enrolling
                            </span>
                          ) : (
                            <>
                              Enroll Now
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Official Skill India / PMKVY Portal Modal */}
      {portalModalCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/40 backdrop-blur-[4px]">
          <div className="w-full max-w-lg rounded-xl border border-[#CBD5E1] bg-white shadow-[0_12px_32px_-4px_rgba(15,23,42,0.16)] overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-[#3525CD] via-[#4F46E5] to-[#10B981]" />
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#C7C4D8] bg-[#F2F3FF] text-[#4F46E5]">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#4F46E5]">
                      PMKVY 4.0 &amp; Skill India
                    </div>
                    <h2 className="font-display text-lg font-bold text-[#0F172A]">
                      Official Training Registration
                    </h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPortalModalCourse(null)}
                  className="rounded-lg p-1.5 text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
                  aria-label="Close modal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3.5">
                <div className="text-[13px] font-semibold text-[#0F172A]">
                  {portalModalCourse.name}
                </div>
                <div className="mt-1 font-mono text-[11px] text-[#64748B]">
                  Provider: {portalModalCourse.provider || "NSDC Accredited Partner"} ·{" "}
                  {portalModalCourse.category || "Skill Bridge"}
                </div>
              </div>

              <p className="mt-4 text-[13px] leading-relaxed text-[#475569]">
                Your internal learning enrollment is active in your PMKVY Skill Gap tracker. To apply for government-subsidized NSQF certification or locate an accredited nearby Pradhan Mantri Kaushal Kendra (PMKK), visit the official portals below:
              </p>

              <div className="mt-4 space-y-2.5">
                <a
                  href="https://www.skillindiadigital.gov.in/courses"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border border-[#E2E8F0] bg-white p-3.5 hover:border-[#4F46E5] hover:bg-[#F2F3FF]/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-4 w-4 text-[#4F46E5]" />
                    <div>
                      <div className="text-[13px] font-semibold text-[#0F172A]">
                        Skill India Digital Hub — Official Courses
                      </div>
                      <div className="font-mono text-[11px] text-[#64748B]">
                        skillindiadigital.gov.in/courses
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-[#64748B]" />
                </a>

                <a
                  href="https://www.pmkvyofficial.org/find-a-training-centre"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border border-[#E2E8F0] bg-white p-3.5 hover:border-[#10B981] hover:bg-[#ECFDF5]/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-[#10B981]" />
                    <div>
                      <div className="text-[13px] font-semibold text-[#0F172A]">
                        Locate Nearest PMKVY Training Centre (PMKK)
                      </div>
                      <div className="font-mono text-[11px] text-[#64748B]">
                        pmkvyofficial.org/find-a-training-centre
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-[#64748B]" />
                </a>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-[#E2E8F0] pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPortalModalCourse(null)}
                >
                  Close
                </Button>
                <Link href="/progress" onClick={() => setPortalModalCourse(null)}>
                  <Button size="sm">
                    Go to Progress Tracker
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
