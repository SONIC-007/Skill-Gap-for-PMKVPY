"use client";
// [FRONTEND] Admin QP-NOS Job Roles Manager | Route: /admin/job-roles | Uses: GET/POST/DELETE /api/admin/job-roles, DashboardLayout
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { EditorialPageHeader } from "@/components/story/EditorialPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Briefcase,
  Plus,
  Search,
  Eye,
  Trash2,
  X,
  ArrowLeft,
  IndianRupee,
} from "lucide-react";

const DOMAINS = [
  "Web Development",
  "Data Science",
  "Artificial Intelligence",
  "Cybersecurity",
  "Cloud Computing",
  "Digital Marketing",
  "Electric Vehicle Technology",
  "General",
];

const DEMAND_STYLES = {
  HIGH: "border-[#A7F3D0] bg-[#ECFDF5] text-[#065F46]",
  "VERY HIGH": "border-[#A7F3D0] bg-[#ECFDF5] text-[#065F46]",
  MEDIUM: "border-[#FDE68A] bg-[#FFFBEB] text-[#92400E]",
  LOW: "border-[#D5D2CA] bg-[#EFECE6] text-[#52525B]",
};

export default function AdminJobRolesPage() {
  const [jobRoles, setJobRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    domain: DOMAINS[0],
    description: "",
    minExperience: "0-2 Years",
    avgSalary: "₹4L – ₹8L",
    demandLevel: "HIGH",
  });

  const reloadJobRoles = useCallback(async () => {
    try {
      const res = await apiFetch("/api/admin/job-roles");
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setJobRoles(data.jobRoles || []);
        setErrorMsg("");
      } else {
        setErrorMsg(data.error || "Failed to load job roles.");
      }
    } catch (error) {
      console.error("Failed to fetch job roles:", error);
      setErrorMsg("Network error while loading job roles.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await apiFetch("/api/admin/job-roles");
        const data = await res.json().catch(() => ({}));
        if (!active) return;
        if (res.ok) {
          setJobRoles(data.jobRoles || []);
        } else {
          setErrorMsg(data.error || "Failed to load job roles.");
        }
      } catch (error) {
        if (!active) return;
        console.error("Failed to fetch job roles:", error);
        setErrorMsg("Network error while loading job roles.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleAddRole = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    setSubmitting(true);
    setErrorMsg("");
    try {
      const res = await apiFetch("/api/admin/job-roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setFormData({
          title: "",
          domain: DOMAINS[0],
          description: "",
          minExperience: "0-2 Years",
          avgSalary: "₹4L – ₹8L",
          demandLevel: "HIGH",
        });
        setShowAddModal(false);
        await reloadJobRoles();
      } else {
        setErrorMsg(data.error || "Failed to create job role.");
      }
    } catch (error) {
      console.error("Failed to create job role:", error);
      setErrorMsg("Network error while creating job role.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRole = async (id) => {
    setDeletingId(id);
    setErrorMsg("");
    try {
      const res = await apiFetch(
        `/api/admin/job-roles?id=${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setJobRoles((prev) => prev.filter((r) => r.id !== id));
      } else {
        setErrorMsg(data.error || "Failed to delete job role.");
      }
    } catch (error) {
      console.error("Error deleting job role:", error);
      setErrorMsg("Network error while deleting job role.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredRoles = jobRoles.filter((role) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      role.title?.toLowerCase().includes(q) ||
      role.domain?.toLowerCase().includes(q) ||
      role.description?.toLowerCase().includes(q)
    );
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Editorial Header */}
        <EditorialPageHeader
          variant="light"
          eyebrow="ADMIN / NSQF JOB ROLES"
          title="Manage Target"
          italicAccent="Job Roles."
          description="Configure Qualification Pack benchmarks, salary bands, and required competency thresholds."
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
                Add Job Role
              </Button>
            </div>
          }
        />

        {/* Search Bar */}
        {errorMsg && (
          <div className="flex items-center justify-between gap-2 rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[13px] font-medium text-[#991B1B]">
            <span>{errorMsg}</span>
            <button type="button" onClick={() => setErrorMsg("")} className="p-1 hover:opacity-75">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <div className="prepp-card p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#52525B]" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search role title, SSC domain, or keyword..."
              className="pl-9"
            />
          </div>
          <span className="font-mono text-[12px] text-[#52525B]">
            {filteredRoles.length} Target Roles
          </span>
        </div>

        {/* Roles Table */}
        <div className="prepp-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-y border-[#E6E4DE] bg-[#F6F5F0] font-mono text-[11px] font-semibold uppercase tracking-wider text-[#52525B]">
                  <th className="px-6 py-3">Role Title</th>
                  <th className="px-6 py-3">SSC Domain</th>
                  <th className="px-6 py-3">Demand</th>
                  <th className="px-6 py-3">Compensation</th>
                  <th className="px-6 py-3">NOS Specs</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E4DE] text-[13px]">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-[#52525B]">
                      Loading job role registry...
                    </td>
                  </tr>
                ) : filteredRoles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-[#52525B]">
                      No job roles match your search query.
                    </td>
                  </tr>
                ) : (
                  filteredRoles.map((role) => {
                    const demandKey = String(role.demandLevel || "MEDIUM").toUpperCase();
                    const demandClass =
                      DEMAND_STYLES[demandKey] || DEMAND_STYLES.MEDIUM;
                    const reqCount = (role.skillRequirements || []).length;

                    return (
                      <tr
                        key={role.id}
                        className="hover:bg-[#F6F5F0] transition-colors"
                      >
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-2 font-semibold text-[#111113]">
                            <Briefcase className="h-3.5 w-3.5 shrink-0 text-[#4F46E5]" />
                            <span>{role.title}</span>
                          </div>
                          <div className="mt-0.5 text-[12px] text-[#52525B] line-clamp-1 max-w-md">
                            {role.description}
                          </div>
                        </td>
                        <td className="px-6 py-3.5 font-mono text-[12px] text-[#52525B] whitespace-nowrap">
                          {role.domain}
                        </td>
                        <td className="px-6 py-3.5 whitespace-nowrap">
                          <span
                            className={`inline-flex whitespace-nowrap rounded border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase ${demandClass}`}
                          >
                            {role.demandLevel || "MEDIUM"}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 font-mono text-[12px] text-[#111113] whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 whitespace-nowrap">
                            <IndianRupee className="h-3 w-3 shrink-0 text-[#10B981]" />
                            {role.avgSalary || "—"}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 font-mono text-[12px] font-semibold text-[#27272A] whitespace-nowrap">
                          {reqCount} skills
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <div className="inline-flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedRole(role)}
                              className="h-8 text-[#4F46E5] hover:bg-[#EEF0FF]"
                              aria-label={`Inspect requirements for ${role.title}`}
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={deletingId === role.id}
                              onClick={() => handleDeleteRole(role.id)}
                              className="h-8 text-[#BA1A1A] hover:bg-[#FEF2F2] hover:text-[#991B1B]"
                              aria-label={`Delete ${role.title}`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
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

      {/* Inspect Skill Requirements Modal */}
      {selectedRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111113]/40 backdrop-blur-[4px]">
          <div className="w-full max-w-lg rounded-xl border border-[#D5D2CA] bg-white shadow-[0_12px_32px_-4px_rgba(15,23,42,0.16)] overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-[#4F46E5] via-[#4F46E5] to-[#10B981]" />
            <div className="p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#4F46E5]">
                    {selectedRole.domain} · {selectedRole.minExperience}
                  </div>
                  <h2 className="mt-1 font-display text-lg font-bold text-[#111113]">
                    {selectedRole.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedRole(null)}
                  className="rounded-lg p-1.5 text-[#52525B] hover:bg-[#EFECE6]"
                  aria-label="Close modal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="mt-2 text-[13px] text-[#52525B]">
                {selectedRole.description}
              </p>

              <div className="mt-5">
                <div className="mb-2.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#52525B]">
                  Required NOS Benchmarks (
                  {(selectedRole.skillRequirements || []).length})
                </div>
                <div className="max-h-72 space-y-2.5 overflow-y-auto pr-1 custom-scrollbar">
                  {(selectedRole.skillRequirements || []).length === 0 ? (
                    <div className="rounded-lg border border-dashed border-[#D5D2CA] bg-[#F6F5F0] p-4 text-center text-[13px] text-[#52525B]">
                      No explicit skill requirements linked to this job role yet.
                    </div>
                  ) : (
                    selectedRole.skillRequirements.map((sr) => (
                      <div
                        key={sr.id}
                        className="rounded-lg border border-[#E6E4DE] bg-[#F6F5F0] p-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-[13px] text-[#111113]">
                            {sr.skill?.name || "Required Skill"}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="rounded border border-[#E6E4DE] bg-white px-1.5 py-0.5 font-mono text-[10px] text-[#52525B]">
                              {sr.skill?.category || "TECHNICAL"}
                            </span>
                            <span className="rounded border border-[#C7D2FE] bg-[#EEF0FF] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#4F46E5]">
                              {sr.importance || "CORE"}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-3">
                          <Progress
                            value={sr.requiredProficiency || 0}
                            className="h-1.5 flex-1"
                            indicatorClassName="bg-[#4F46E5]"
                          />
                          <span className="font-mono text-[11px] font-bold text-[#111113]">
                            {sr.requiredProficiency || 0}%
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end border-t border-[#E6E4DE] pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRole(null)}
                >
                  Close Benchmark
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Job Role Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111113]/40 backdrop-blur-[4px]">
          <div className="w-full max-w-md rounded-xl border border-[#D5D2CA] bg-white shadow-[0_12px_32px_-4px_rgba(15,23,42,0.16)] overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-[#4F46E5] via-[#4F46E5] to-[#10B981]" />
            <form onSubmit={handleAddRole} className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-[#111113]">
                  Create Target Job Role
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
                <Label htmlFor="role-title">Role Title</Label>
                <Input
                  id="role-title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, title: e.target.value }))
                  }
                  placeholder="e.g. Junior EV Diagnostic Technician"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="role-domain">SSC Domain</Label>
                  <select
                    id="role-domain"
                    value={formData.domain}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, domain: e.target.value }))
                    }
                    className="h-9 w-full rounded-lg border border-[#D5D2CA] bg-white px-3 text-[13px] text-[#111113] focus:border-[#4F46E5] focus:outline-none"
                  >
                    {DOMAINS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="role-demand">Demand Level</Label>
                  <select
                    id="role-demand"
                    value={formData.demandLevel}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, demandLevel: e.target.value }))
                    }
                    className="h-9 w-full rounded-lg border border-[#D5D2CA] bg-white px-3 text-[13px] text-[#111113] focus:border-[#4F46E5] focus:outline-none"
                  >
                    <option value="VERY HIGH">VERY HIGH</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="role-exp">Min Experience</Label>
                  <Input
                    id="role-exp"
                    value={formData.minExperience}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        minExperience: e.target.value,
                      }))
                    }
                    placeholder="e.g. 0-2 Years"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="role-salary">Avg Compensation</Label>
                  <Input
                    id="role-salary"
                    value={formData.avgSalary}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, avgSalary: e.target.value }))
                    }
                    placeholder="e.g. ₹4L – ₹8L"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="role-desc">Role Summary</Label>
                <Textarea
                  id="role-desc"
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="Core job duties and NSQF outcome focus..."
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
                  {submitting ? "Saving..." : "Create Role"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
