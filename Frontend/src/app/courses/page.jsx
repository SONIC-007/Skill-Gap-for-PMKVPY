"use client";
// [FRONTEND] PMKVY 4.0 Course Catalog & Enrollment | Route: /courses | Uses: GET /api/courses, POST /api/enroll, DashboardLayout
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { EditorialPageHeader } from "@/components/story/EditorialPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
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
  Bookmark,
} from "lucide-react";

function CoursesContent() {
  const searchParams = useSearchParams();
  const initialSkillParam = searchParams.get("skill") || "";

  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState(initialSkillParam);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);
  const [savedIds, setSavedIds] = useState([]);
  const [portalModalCourse, setPortalModalCourse] = useState(null);
  const [feedbackBanner, setFeedbackBanner] = useState(null);

  const toggleSaveCourse = (id) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const params = new URLSearchParams();
        if (selectedCategory !== "ALL") params.set("category", selectedCategory);
        if (selectedDifficulty !== "ALL") params.set("difficulty", selectedDifficulty);

        const res = await apiFetch(`/api/courses?${params.toString()}`);
        const data = await res.json().catch(() => ({}));
        if (!active) return;

        if (res.ok) {
          setCourses(data.courses || []);
          if (Array.isArray(data.categories)) {
            setCategories(data.categories);
          }
        } else {
          setFeedbackBanner({
            type: "error",
            message: data.error || "Unable to load PMKVY courses.",
          });
        }
      } catch (error) {
        if (!active) return;
        console.error("Failed to fetch courses:", error);
        setFeedbackBanner({
          type: "error",
          message: "Network error while loading PMKVY course catalog.",
        });
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [selectedCategory, selectedDifficulty]);

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
    <>
      <div className="space-y-6">
        {/* Editorial Header */}
        <EditorialPageHeader
          variant="light"
          eyebrow="WORKSPACE / PMKVY COURSES"
          title="NSQF Course Catalog"
          italicAccent="& Skill Bridge."
          description="Personalized PMKVY 4.0 and NSDC training tracks ranked by alignment to your detected skill gaps."
          rightSlot={
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-[#F6F5F0] px-3 py-1.5 font-mono text-[11.5px] font-medium text-[#111113]">
                <BookOpen className="h-3.5 w-3.5 text-[#4F46E5]" />
                {courses.length} Courses
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#A7F3D0] bg-[#ECFDF5] px-3 py-1.5 font-mono text-[11.5px] font-medium text-[#065F46]">
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
          }
        />

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
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#52525B]" />
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
                onChange={(e) => {
                  setLoading(true);
                  setSelectedCategory(e.target.value);
                }}
                aria-label="Filter by category"
                className="h-9 w-full rounded-lg border border-[#D5D2CA] bg-white px-3 text-[13px] text-[#111113] focus:border-[#4F46E5] focus:outline-none"
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
                onChange={(e) => {
                  setLoading(true);
                  setSelectedDifficulty(e.target.value);
                }}
                aria-label="Filter by difficulty"
                className="h-9 w-full rounded-lg border border-[#D5D2CA] bg-white px-3 text-[13px] text-[#111113] focus:border-[#4F46E5] focus:outline-none"
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
                    if (selectedCategory !== "ALL" || selectedDifficulty !== "ALL") {
                      setLoading(true);
                    }
                    setSelectedCategory("ALL");
                    setSelectedDifficulty("ALL");
                  }}
                  className="w-full md:w-auto text-[#52525B]"
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
                  <div className="h-5 w-24 rounded bg-[#E6E4DE]" />
                  <div className="h-5 w-16 rounded bg-[#E6E4DE]" />
                </div>
                <div className="h-6 w-4/5 rounded bg-[#E6E4DE]" />
                <div className="h-12 w-full rounded bg-[#EFECE6]" />
                <div className="flex gap-2">
                  <div className="h-5 w-16 rounded bg-[#E6E4DE]" />
                  <div className="h-5 w-20 rounded bg-[#E6E4DE]" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="prepp-card p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#E6E4DE] bg-[#F6F5F0] text-[#52525B]">
              <BookOpen className="h-6 w-6" />
            </div>
            <h2 className="mt-4 font-display text-lg font-bold text-[#111113]">
              No matching PMKVY courses found
            </h2>
            <p className="mx-auto mt-1.5 max-w-md text-[13px] text-[#52525B]">
              Try clearing active domain or difficulty filters, or complete a Skill Gap Assessment to unlock personalized rankings.
            </p>
            <div className="mt-5 flex justify-center gap-2.5">
              {hasFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    if (selectedCategory !== "ALL" || selectedDifficulty !== "ALL") {
                      setLoading(true);
                    }
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
            {filteredCourses.map((course, idx) => {
              const skills = Array.isArray(course.skillsCovered)
                ? course.skillsCovered
                : [];
              const isSaved = savedIds.includes(course.id);
              const badgePalette = [
                "bg-[#111113] text-white",
                "bg-[#EEF4FF] text-[#2563EB]",
                "bg-[#FCE7F3] text-[#DB2777]",
                "bg-[#ECFDF5] text-[#059669]",
                "bg-[#FFF7ED] text-[#EA580C]",
                "bg-[#F3E8FF] text-[#7C3AED]",
              ][idx % 6];
              const monogram = (course.provider || course.category || "P")
                .trim()
                .charAt(0)
                .toUpperCase();
              const diffLabel =
                course.difficulty === "BEGINNER"
                  ? "Beginner"
                  : course.difficulty === "INTERMEDIATE"
                  ? "Intermediate"
                  : course.difficulty === "ADVANCED"
                  ? "Advanced"
                  : "NSQF";

              return (
                <div
                  key={course.id}
                  className="prepp-card-interactive p-6 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Icon Circle + Save / Status Pill (Ref 1 Style) */}
                    <div className="flex items-center justify-between gap-2">
                      <div
                        className={`h-11 w-11 rounded-full border border-black/[0.06] flex items-center justify-center font-display text-[15px] font-bold shadow-2xs ${badgePalette}`}
                      >
                        {monogram}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {course.relevanceScore > 0 && (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-[#EEF0FF] px-2.5 py-1 text-[11px] font-semibold text-[#4F46E5]">
                            <Sparkles className="h-3 w-3" />
                            {course.relevanceScore}% Fit
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => toggleSaveCourse(course.id)}
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11.5px] font-medium transition-colors cursor-pointer ${
                            course.isEnrolled
                              ? "border-[#A7F3D0] bg-[#ECFDF5] text-[#065F46]"
                              : isSaved
                              ? "border-black/[0.08] bg-[#F1F2F4] text-[#111113]"
                              : "border-black/[0.08] bg-white text-[#52525B] hover:text-[#111113] hover:bg-[#F7F8FA]"
                          }`}
                        >
                          <span>
                            {course.isEnrolled
                              ? "Enrolled"
                              : isSaved
                              ? "Saved"
                              : "Save"}
                          </span>
                          <Bookmark
                            className={`h-3 w-3 ${
                              isSaved || course.isEnrolled ? "fill-current" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Provider Meta + Bold Title */}
                    <div className="mt-5">
                      <div className="flex items-center gap-1.5 text-[12px]">
                        <span className="font-semibold text-[#111113] truncate max-w-[170px]">
                          {course.provider || "NSDC Partner"}
                        </span>
                        <span className="text-[#9CA3AF]">•</span>
                        <span className="text-[#9CA3AF] truncate">
                          {course.category}
                        </span>
                      </div>
                      <h3 className="mt-1 font-display text-[18px] font-semibold leading-snug tracking-[-0.02em] text-[#111113] line-clamp-2">
                        {course.name}
                      </h3>
                    </div>

                    {/* Neutral Bento Chips */}
                    <div className="mt-3.5 flex flex-wrap gap-1.5">
                      <span className="bento-chip">{diffLabel}</span>
                      {skills.slice(0, 2).map((skill, sIdx) => (
                        <span
                          key={`${course.id}-sk-${sIdx}`}
                          className="bento-chip max-w-[140px]"
                          title={skill}
                        >
                          <span className="truncate">{skill}</span>
                        </span>
                      ))}
                      {skills.length === 0 && (
                        <span className="bento-chip">NSQF Aligned</span>
                      )}
                    </div>
                  </div>

                  {/* Subtle Divider + Cost/Duration Left + Black CTA Right (Ref 1 Bottom Row) */}
                  <div className="mt-6 pt-4 border-t border-[#F0F1F3] flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-display text-[15px] font-bold text-[#111113]">
                        ₹0 Subsidized
                      </div>
                      <div className="text-[11px] text-[#9CA3AF] mt-0.5 truncate">
                        {course.duration || "Self-paced"} · NSDC Certified
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {course.isEnrolled ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setPortalModalCourse(course)}
                            className="rounded-xl border border-black/[0.09] bg-white px-2.5 py-2 text-[11.5px] font-medium text-[#111113] hover:bg-[#F7F8FA] transition-colors cursor-pointer"
                          >
                            Portal
                          </button>
                          <Link href="/progress">
                            <button
                              type="button"
                              className="rounded-xl bg-[#111113] hover:bg-[#27272A] px-3.5 py-2 text-[12px] font-medium text-white transition-colors cursor-pointer"
                            >
                              Track
                            </button>
                          </Link>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleEnroll(course)}
                          disabled={enrollingId === course.id}
                          className="rounded-xl bg-[#111113] hover:bg-[#27272A] disabled:opacity-60 px-4 py-2 text-[12px] font-medium text-white transition-colors cursor-pointer"
                        >
                          {enrollingId === course.id ? "Enrolling..." : "Enroll now"}
                        </button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111113]/40 backdrop-blur-[4px]">
          <div className="w-full max-w-lg rounded-xl border border-[#D5D2CA] bg-white shadow-[0_12px_32px_-4px_rgba(15,23,42,0.16)] overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-[#4F46E5] via-[#4F46E5] to-[#10B981]" />
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#C7D2FE] bg-[#EEF0FF] text-[#4F46E5]">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#4F46E5]">
                      PMKVY 4.0 &amp; Skill India
                    </div>
                    <h2 className="font-display text-lg font-bold text-[#111113]">
                      Official Training Registration
                    </h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPortalModalCourse(null)}
                  className="rounded-lg p-1.5 text-[#52525B] hover:bg-[#EFECE6] hover:text-[#111113]"
                  aria-label="Close modal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 rounded-lg border border-[#E6E4DE] bg-[#F6F5F0] p-3.5">
                <div className="text-[13px] font-semibold text-[#111113]">
                  {portalModalCourse.name}
                </div>
                <div className="mt-1 font-mono text-[11px] text-[#52525B]">
                  Provider: {portalModalCourse.provider || "NSDC Accredited Partner"} ·{" "}
                  {portalModalCourse.category || "Skill Bridge"}
                </div>
              </div>

              <p className="mt-4 text-[13px] leading-relaxed text-[#52525B]">
                Your internal learning enrollment is active in your PMKVY Skill Gap tracker. To apply for government-subsidized NSQF certification or locate an accredited nearby Pradhan Mantri Kaushal Kendra (PMKK), visit the official portals below:
              </p>

              <div className="mt-4 space-y-2.5">
                <a
                  href="https://www.skillindiadigital.gov.in/courses"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border border-[#E6E4DE] bg-white p-3.5 hover:border-[#4F46E5] hover:bg-[#EEF0FF]/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-4 w-4 text-[#4F46E5]" />
                    <div>
                      <div className="text-[13px] font-semibold text-[#111113]">
                        Skill India Digital Hub — Official Courses
                      </div>
                      <div className="font-mono text-[11px] text-[#52525B]">
                        skillindiadigital.gov.in/courses
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-[#52525B]" />
                </a>

                <a
                  href="https://www.pmkvyofficial.org/find-a-training-centre"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border border-[#E6E4DE] bg-white p-3.5 hover:border-[#10B981] hover:bg-[#ECFDF5]/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-[#10B981]" />
                    <div>
                      <div className="text-[13px] font-semibold text-[#111113]">
                        Locate Nearest PMKVY Training Centre (PMKK)
                      </div>
                      <div className="font-mono text-[11px] text-[#52525B]">
                        pmkvyofficial.org/find-a-training-centre
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-[#52525B]" />
                </a>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-[#E6E4DE] pt-4">
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
    </>
  );
}

export default function CoursesPage() {
  return (
    <DashboardLayout>
      <Suspense
        fallback={
          <div className="flex h-96 items-center justify-center font-mono text-[12px] text-[#52525B]">
            Loading PMKVY course catalog...
          </div>
        }
      >
        <CoursesContent />
      </Suspense>
    </DashboardLayout>
  );
}
