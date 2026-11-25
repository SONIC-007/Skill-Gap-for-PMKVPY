"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
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
  ADVANCED: "border-[#C7C4D8] bg-[#F2F3FF] text-[#3525CD]",
};

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    provider: "NSDC / PMKVY Partner",
    difficulty: "BEGINNER",
    duration: "8 Weeks",
    eligibility: "10+2 / ITI / Diploma",
    category: "Web Development",
  });

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/admin/courses");
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error("Failed to fetch admin courses:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setSubmitting(true);
    try {
      const res = await apiFetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
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
        await fetchCourses();
      }
    } catch (error) {
      console.error("Failed to add course:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCourse = async (id) => {
    setDeletingId(id);
    try {
      const res = await apiFetch(
        `/api/admin/courses?id=${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setCourses((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete course:", error);
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
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-[#E2E8F0] pb-5">
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#64748B]">
              <Link href="/admin" className="hover:text-[#4F46E5]">
                ADMIN
              </Link>
              <span>/</span>
              <span className="text-[#4F46E5]">PMKVY COURSES</span>
            </div>
            <h1 className="mt-1.5 font-display text-2xl sm:text-[28px] font-bold tracking-[-0.025em] text-[#0F172A]">
              Manage PMKVY Course Registry
            </h1>
            <p className="mt-1 text-[14px] text-[#475569]">
              Curate accredited Skill India training modules and monitor candidate enrollment volume.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
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
        </div>

        {/* Filters */}
        <div className="prepp-card p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-center">
            <div className="relative md:col-span-7">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
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
                className="h-9 w-full rounded-lg border border-[#CBD5E1] bg-white px-3 text-[13px] text-[#0F172A] focus:border-[#4F46E5] focus:outline-none"
              >
                <option value="ALL">All Difficulty Levels</option>
                <option value="BEGINNER">BEGINNER</option>
                <option value="INTERMEDIATE">INTERMEDIATE</option>
                <option value="ADVANCED">ADVANCED</option>
              </select>
            </div>

            <div className="md:col-span-2 text-right font-mono text-[12px] text-[#64748B]">
              {filteredCourses.length} Courses
            </div>
          </div>
        </div>

        {/* Courses Table */}
        <div className="prepp-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-y border-[#E2E8F0] bg-[#F8FAFC] font-mono text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                  <th className="px-6 py-3">Course Name</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Provider</th>
                  <th className="px-6 py-3">Difficulty</th>
                  <th className="px-6 py-3">Duration</th>
                  <th className="px-6 py-3">Enrolled</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-[13px]">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-[#64748B]">
                      Loading courses catalog...
                    </td>
                  </tr>
                ) : filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-[#64748B]">
                      No courses match your filters.
                    </td>
                  </tr>
                ) : (
                  filteredCourses.map((course) => (
                    <tr
                      key={course.id}
                      className="hover:bg-[#F8FAFC] transition-colors"
                    >
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2 font-semibold text-[#0F172A]">
                          <BookOpen className="h-3.5 w-3.5 shrink-0 text-[#4F46E5]" />
                          <span>{course.name}</span>
                        </div>
                        <div className="mt-0.5 font-mono text-[11px] text-[#64748B]">
                          Eligibility: {course.eligibility || "Open"}
                        </div>
                      </td>
                      <td className="px-6 py-3.5 font-mono text-[12px] text-[#475569] whitespace-nowrap">
                        {course.category}
                      </td>
                      <td className="px-6 py-3.5 text-[#475569]">
                        {course.provider}
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex whitespace-nowrap rounded border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase ${
                            DIFFICULTY_STYLES[course.difficulty] ||
                            "border-[#CBD5E1] bg-[#F1F5F9] text-[#475569]"
                          }`}
                        >
                          {course.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 font-mono text-[12px] text-[#475569] whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 whitespace-nowrap">
                          <Clock className="h-3 w-3 shrink-0 text-[#64748B]" />
                          {course.duration}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 font-mono text-[12px] font-semibold text-[#0F172A]">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/40 backdrop-blur-[4px]">
          <div className="w-full max-w-lg rounded-xl border border-[#CBD5E1] bg-white shadow-[0_12px_32px_-4px_rgba(15,23,42,0.16)] overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-[#3525CD] via-[#4F46E5] to-[#10B981]" />
            <form onSubmit={handleAddCourse} className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-[#0F172A]">
                  Register PMKVY Training Course
                </h2>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg p-1.5 text-[#64748B] hover:bg-[#F1F5F9]"
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
                    className="h-9 w-full rounded-lg border border-[#CBD5E1] bg-white px-3 text-[13px] text-[#0F172A] focus:border-[#4F46E5] focus:outline-none"
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

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
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
