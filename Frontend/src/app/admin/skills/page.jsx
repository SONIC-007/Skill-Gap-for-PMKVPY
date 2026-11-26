"use client";
// [FRONTEND] Admin Skills Matrix Manager | Route: /admin/skills | Uses: GET/POST/DELETE /api/admin/skills, DashboardLayout
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
  Layers,
  Plus,
  Search,
  Trash2,
  X,
  ArrowLeft,
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

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [domainFilter, setDomainFilter] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    domain: DOMAINS[0],
    category: "TECHNICAL",
    description: "",
  });

  const reloadSkills = useCallback(async () => {
    try {
      const res = await apiFetch("/api/admin/skills");
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setSkills(data.skills || []);
        setErrorMsg("");
      } else {
        setErrorMsg(data.error || "Failed to load skills.");
      }
    } catch (error) {
      console.error("Failed to load skills:", error);
      setErrorMsg("Network error while loading skills.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await apiFetch("/api/admin/skills");
        const data = await res.json().catch(() => ({}));
        if (!active) return;
        if (res.ok) {
          setSkills(data.skills || []);
        } else {
          setErrorMsg(data.error || "Failed to load skills.");
        }
      } catch (error) {
        if (!active) return;
        console.error("Failed to load skills:", error);
        setErrorMsg("Network error while loading skills.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setSubmitting(true);
    setErrorMsg("");
    try {
      const res = await apiFetch("/api/admin/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setFormData({
          name: "",
          domain: DOMAINS[0],
          category: "TECHNICAL",
          description: "",
        });
        setShowAddModal(false);
        await reloadSkills();
      } else {
        setErrorMsg(data.error || "Failed to create skill.");
      }
    } catch (error) {
      console.error("Error creating skill:", error);
      setErrorMsg("Network error while creating skill.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSkill = async (id) => {
    setDeletingId(id);
    setErrorMsg("");
    try {
      const res = await apiFetch(`/api/admin/skills?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setSkills((prev) => prev.filter((s) => s.id !== id));
      } else {
        setErrorMsg(data.error || "Failed to delete skill.");
      }
    } catch (error) {
      console.error("Error deleting skill:", error);
      setErrorMsg("Network error while deleting skill.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredSkills = skills.filter((skill) => {
    const matchDomain =
      domainFilter === "ALL" || skill.domain === domainFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      skill.name?.toLowerCase().includes(q) ||
      skill.domain?.toLowerCase().includes(q) ||
      skill.description?.toLowerCase().includes(q);
    return matchDomain && matchSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Editorial Header */}
        <EditorialPageHeader
          variant="light"
          eyebrow="ADMIN / SKILL TAXONOMY"
          title="Manage Skills"
          italicAccent="Taxonomy."
          description="Define technical and soft competencies across NSDC / SSC domains for role benchmarking."
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
                Add New Skill
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
                placeholder="Search competencies by name, domain, or keyword..."
                className="pl-9"
              />
            </div>

            <div className="md:col-span-3">
              <select
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value)}
                aria-label="Filter skills by domain"
                className="h-9 w-full rounded-lg border border-[#D5D2CA] bg-white px-3 text-[13px] text-[#111113] focus:border-[#4F46E5] focus:outline-none"
              >
                <option value="ALL">All SSC Domains</option>
                {DOMAINS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 text-right font-mono text-[12px] text-[#52525B]">
              {filteredSkills.length} / {skills.length} items
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="prepp-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-y border-[#E6E4DE] bg-[#F6F5F0] font-mono text-[11px] font-semibold uppercase tracking-wider text-[#52525B]">
                  <th className="px-6 py-3">Competency</th>
                  <th className="px-6 py-3">Domain</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Mapped Roles</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E4DE] text-[13px]">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-[#52525B]">
                      Loading skills registry...
                    </td>
                  </tr>
                ) : filteredSkills.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-[#52525B]">
                      No matching skills found in taxonomy.
                    </td>
                  </tr>
                ) : (
                  filteredSkills.map((skill) => (
                    <tr
                      key={skill.id}
                      className="hover:bg-[#F6F5F0] transition-colors"
                    >
                      <td className="px-6 py-3.5 font-semibold text-[#111113]">
                        <div className="flex items-center gap-2">
                          <Layers className="h-3.5 w-3.5 text-[#4F46E5]" />
                          <span>{skill.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 font-mono text-[12px] text-[#52525B]">
                        {skill.domain}
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-flex rounded border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase ${
                            skill.category === "TECHNICAL"
                              ? "border-[#C7D2FE] bg-[#EEF0FF] text-[#4F46E5]"
                              : "border-[#FDE68A] bg-[#FFFBEB] text-[#92400E]"
                          }`}
                        >
                          {skill.category || "TECHNICAL"}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 font-mono text-[12px] font-semibold text-[#27272A]">
                        {skill._count?.jobRequirements ?? 0}
                      </td>
                      <td className="px-6 py-3.5 max-w-xs truncate text-[#52525B]">
                        {skill.description || "—"}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={deletingId === skill.id}
                          onClick={() => handleDeleteSkill(skill.id)}
                          className="h-8 text-[#BA1A1A] hover:bg-[#FEF2F2] hover:text-[#991B1B]"
                          aria-label={`Delete ${skill.name}`}
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

      {/* Add Skill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111113]/40 backdrop-blur-[4px]">
          <div className="w-full max-w-md rounded-xl border border-[#D5D2CA] bg-white shadow-[0_12px_32px_-4px_rgba(15,23,42,0.16)] overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-[#4F46E5] via-[#4F46E5] to-[#10B981]" />
            <form onSubmit={handleAddSkill} className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-[#111113]">
                  Add Taxonomy Competency
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
                <Label htmlFor="skill-name">Competency Name</Label>
                <Input
                  id="skill-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="e.g. Battery Thermal Diagnostics"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="skill-domain">SSC Domain</Label>
                  <select
                    id="skill-domain"
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
                  <Label htmlFor="skill-cat">Category</Label>
                  <select
                    id="skill-cat"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, category: e.target.value }))
                    }
                    className="h-9 w-full rounded-lg border border-[#D5D2CA] bg-white px-3 text-[13px] text-[#111113] focus:border-[#4F46E5] focus:outline-none"
                  >
                    <option value="TECHNICAL">TECHNICAL</option>
                    <option value="SOFT">SOFT</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="skill-desc">Description</Label>
                <Textarea
                  id="skill-desc"
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="Scope of practical proficiency required..."
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
                  {submitting ? "Adding..." : "Create Skill"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
