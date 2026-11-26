"use client";
// [FRONTEND] Admin Courses Manager | Route: /admin/courses | Uses: GET/POST/DELETE /api/admin/courses, DashboardLayout
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { EditorialPageHeader } from "@/components/story/EditorialPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  Plus,
  Search,
  Trash2,
  X,
  ArrowLeft,
  Clock,
} from "lucide-react";

const DIFFICULTY_STYLES = {
  BEGINNER: "border-[#A7F3D0] bg-[#ECFDF5] text-[#065F46]",
  INTERMEDIATE: "border-[#FDE68A] bg-[#FFFBEB] text-[#92400E]",
  ADVANCED: "border-[#C7D2FE] bg-[#EEF0FF] text-[#4F46E5]",
};

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    provider: "NSDC / PMKVY Partner",
    difficulty: "BEGINNER",
    duration: "8 Weeks",
    eligibility: "10+2 / ITI / Diploma",
    category: "Web Development",
  });

  const reloadCourses = useCallback(async () => {
    try {
      const res = await apiFetch("/api/admin/courses");
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setCourses(data.courses || []);
        setErrorMsg("");
      } else {
        setErrorMsg(data.error || "Failed to fetch courses.");
      }
    } catch (error) {
      console.error("Failed to fetch admin courses:", error);
      setErrorMsg("Network error while loading courses.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await apiFetch("/api/admin/courses");
        const data = await res.json().catch(() => ({}));
        if (!active) return;
        if (res.ok) {
          setCourses(data.courses || []);
        } else {
          setErrorMsg(data.error || "Failed to load courses.");
        }
      } catch (error) {
        if (!active) return;
        console.error("Failed to fetch admin courses:", error);
        setErrorMsg("Network error while loading courses.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setSubmitting(true);
    setErrorMsg("");
    try {
      const res = await apiFetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setFormData({
          name: "",
          description: "",
          provider: "NSDC / PMKVY Partner",
          difficulty: "BEGINNER",
          duration: "8 Weeks",
          eligibility: "10+2 / ITI / Diploma",
          category: "Web Development",
        });
        setShowAddModal(false);
        await reloadCourses();
      } else {
        setErrorMsg(data.error || "Failed to add course.");
      }
    } catch (error) {
      console.error("Failed to add course:", error);
      setErrorMsg("Network error while adding course.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCourse = async (id) => {
    setDeletingId(id);
    setErrorMsg("");
    try {
      const res = await apiFetch(
        `/api/admin/courses?id=${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setCourses((prev) => prev.filter((c) => c.id !== id));
      } else {
        setErrorMsg(data.error || "Failed to delete course.");
      }
    } catch (error) {
      console.error("Failed to delete course:", error);
      setErrorMsg("Network error while deleting course.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchDiff =
      difficultyFilter === "ALL" || course.difficulty === difficultyFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      course.name?.toLowerCase().includes(q) ||
      course.provider?.toLowerCase().includes(q) ||
      course.category?.toLowerCase().includes(q);
    return matchDiff && matchSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Editorial Header */}
        <EditorialPageHeader
          variant="light"
          eyebrow="ADMIN / PMKVY COURSES"
          title="Manage PMKVY"
          italicAccent="Course Registry."
          description="Curate accredited Skill India training modules and monitor candidate enrollment volume."
          rightSlot={
            <div className="flex items-center gap-2">
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                  Console
                </Button>
              </Link>
              <Button size="sm" onClick={() => setShowAddModal(true)}>
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Add Course
              </Button>
            </div>
          }
        />

        {/* Filters */}
        {errorMsg && (
          <div className="flex items-center justify-between gap-2 rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[13px] font-medium text-[#991B1B]">
            <span>{errorMsg}</span>
            <button type="button" onClick={() => setErrorMsg("")} className="p-1 hover:opacity-75">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <div className="prepp-card p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-center">
            <div className="relative md:col-span-7">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#52525B]" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by course title, provider, or category..."
                className="pl-9"
              />
            </div>

            <div className="md:col-span-3">
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                aria-label="Filter courses by difficulty"
                className="h-9 w-full rounded-lg border border-[#D5D2CA] bg-white px-3 text-[13px] text-[#111113] focus:border-[#4F46E5] focus:outline-none"
              >
                <option value="ALL">All Difficulty Levels</option>
                <option value="BEGINNER">BEGINNER</option>
                <option value="INTERMEDIATE">INTERMEDIATE</option>
                <option value="ADVANCED">ADVANCED</option>
              </select>
            </div>

            <div className="md:col-span-2 text-right font-mono text-[12px] text-[#52525B]">
              {filteredCourses.length} Courses
            </div>
          </div>
        </div>

        {/* Courses Table */}
        <div className="prepp-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-y border-[#E6E4DE] bg-[#F6F5F0] font-mono text-[11px] font-semibold uppercase tracking-wider text-[#52525B]">
                  <th className="px-6 py-3">Course Name</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Provider</th>
                  <th className="px-6 py-3">Difficulty</th>
                  <th className="px-6 py-3">Duration</th>
                  <th className="px-6 py-3">Enrolled</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E4DE] text-[13px]">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-[#52525B]">
                      Loading courses catalog...
                    </td>
                  </tr>
                ) : filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-[#52525B]">
                      No courses match your filters.
                    </td>
                  </tr>
                ) : (
                  filteredCourses.map((course) => (
                    <tr
                      key={course.id}
                      className="hover:bg-[#F6F5F0] transition-colors"
                    >
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2 font-semibold text-[#111113]">
                          <BookOpen className="h-3.5 w-3.5 shrink-0 text-[#4F46E5]" />
                          <span>{course.name}</span>
                        </div>
                        <div className="mt-0.5 font-mono text-[11px] text-[#52525B]">
                          Eligibility: {course.eligibility || "Open"}
                        </div>
                      </td>
                      <td className="px-6 py-3.5 font-mono text-[12px] text-[#52525B] whitespace-nowrap">
                        {course.category}
                      </td>
                      <td className="px-6 py-3.5 text-[#52525B]">
                        {course.provider}
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex whitespace-nowrap rounded border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase ${
                            DIFFICULTY_STYLES[course.difficulty] ||
                            "border-[#D5D2CA] bg-[#EFECE6] text-[#52525B]"
                          }`}
                        >
                          {course.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 font-mono text-[12px] text-[#52525B] whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 whitespace-nowrap">
                          <Clock className="h-3 w-3 shrink-0 text-[#52525B]" />
                          {course.duration}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 font-mono text-[12px] font-semibold text-[#111113]">
                        {course._count?.enrollments ?? 0}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={deletingId === course.id}
                          onClick={() => handleDeleteCourse(course.id)}
                          className="h-8 text-[#BA1A1A] hover:bg-[#FEF2F2] hover:text-[#991B1B]"
                          aria-label={`Delete ${course.name}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111113]/40 backdrop-blur-[4px]">
          <div className="w-full max-w-lg rounded-xl border border-[#D5D2CA] bg-white shadow-[0_12px_32px_-4px_rgba(15,23,42,0.16)] overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-[#4F46E5] via-[#4F46E5] to-[#10B981]" />
            <form onSubmit={handleAddCourse} className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-[#111113]">
                  Register PMKVY Training Course
                </h2>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg p-1.5 text-[#52525B] hover:bg-[#EFECE6]"
                  aria-label="Close modal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="course-name">Course Name</Label>
                <Input
                  id="course-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="e.g. Junior Full Stack Developer NSQF L4"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="course-cat">Category</Label>
                  <Input
                    id="course-cat"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, category: e.target.value }))
                    }
                    placeholder="e.g. Web Development"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="course-provider">Training Provider</Label>
                  <Input
                    id="course-provider"
                    value={formData.provider}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, provider: e.target.value }))
                    }
                    placeholder="e.g. NSDC / NIELIT"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="course-diff">Difficulty</Label>
                  <select
                    id="course-diff"
                    value={formData.difficulty}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, difficulty: e.target.value }))
                    }
                    className="h-9 w-full rounded-lg border border-[#D5D2CA] bg-white px-3 text-[13px] text-[#111113] focus:border-[#4F46E5] focus:outline-none"
                  >
                    <option value="BEGINNER">BEGINNER</option>
                    <option value="INTERMEDIATE">INTERMEDIATE</option>
                    <option value="ADVANCED">ADVANCED</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="course-dur">Duration</Label>
                  <Input
                    id="course-dur"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, duration: e.target.value }))
                    }
                    placeholder="8 Weeks"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="course-elig">Eligibility</Label>
                  <Input
                    id="course-elig"
                    value={formData.eligibility}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        eligibility: e.target.value,
                      }))
                    }
                    placeholder="10+2 / Graduate"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="course-desc">Description</Label>
                <Textarea
                  id="course-desc"
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="Syllabus modules and NOS certification outcomes..."
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E6E4DE]">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={submitting}>
                  {submitting ? "Creating..." : "Publish Course"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
