"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Target,
  CheckCircle2,
  AlertCircle,
  Save,
  FileSearch,
  Sparkles,
} from "lucide-react";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    education: "",
    experience: "",
    location: "",
    desiredCareerField: "",
    targetJobRole: "",
    bio: "",
    role: "CANDIDATE",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiFetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          const u = data.user || {};
          const p = u.profile || data.profile || {};
          setFormData({
            name: u.name || data.name || "",
            email: u.email || data.email || "",
            phone: p.phone ?? data.phone ?? "",
            education: p.education ?? data.education ?? "",
            experience: p.experience ?? data.experience ?? "",
            location: p.location ?? data.location ?? "",
            desiredCareerField:
              p.desiredCareerField ?? data.desiredCareerField ?? "",
            targetJobRole: p.targetJobRole ?? data.targetJobRole ?? "",
            bio: p.bio ?? data.bio ?? "",
            role: u.role || data.role || "CANDIDATE",
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (savedSuccess) setSavedSuccess(false);
    if (errorMsg) setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    setErrorMsg("");

    try {
      const res = await apiFetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSavedSuccess(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || "Failed to update profile details.");
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      setErrorMsg("Network error while saving profile.");
    } finally {
      setSaving(false);
    }
  };

  const initials = (formData.name || "User")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0].toUpperCase())
    .join("");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-[#E2E8F0] pb-5">
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#64748B]">
              <span>ACCOUNT</span>
              <span>/</span>
              <span className="text-[#4F46E5]">CANDIDATE DOSSIER</span>
            </div>
            <h1 className="mt-1.5 font-display text-2xl sm:text-[28px] font-bold tracking-[-0.025em] text-[#0F172A]">
              Profile &amp; Career Preferences
            </h1>
            <p className="mt-1 text-[14px] text-[#475569]">
              Maintain your academic background and PMKVY target role so career readiness rankings stay accurate.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="border border-[#C7C4D8] bg-[#F2F3FF] font-mono text-[11px] font-semibold text-[#3525CD]">
              ROLE: {formData.role || "CANDIDATE"}
            </Badge>
          </div>
        </div>

        {/* Status Alerts */}
        {savedSuccess && (
          <div className="flex items-center gap-2.5 rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] px-4 py-3 text-[13px] font-medium text-[#065F46]">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#10B981]" />
            <span>
              Candidate dossier updated successfully. Career recommendations will reflect your updated preferences.
            </span>
          </div>
        )}

        {errorMsg && (
          <div className="flex items-center gap-2.5 rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[13px] font-medium text-[#991B1B]">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4 prepp-card p-6 animate-pulse space-y-4">
              <div className="h-16 w-16 rounded-xl bg-[#E2E8F0]" />
              <div className="h-5 w-1/2 rounded bg-[#E2E8F0]" />
              <div className="h-4 w-3/4 rounded bg-[#F1F5F9]" />
            </div>
            <div className="lg:col-span-8 prepp-card p-6 animate-pulse space-y-4">
              <div className="h-6 w-1/3 rounded bg-[#E2E8F0]" />
              <div className="h-10 w-full rounded bg-[#F1F5F9]" />
              <div className="h-10 w-full rounded bg-[#F1F5F9]" />
              <div className="h-24 w-full rounded bg-[#F1F5F9]" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
            {/* Left Dossier Summary Card */}
            <div className="lg:col-span-4 space-y-5">
              <div className="prepp-card overflow-hidden">
                <div className="h-1 w-full bg-gradient-to-r from-[#3525CD] via-[#4F46E5] to-[#10B981]" />
                <div className="p-6">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-[#C7C4D8] bg-[#F2F3FF] font-display text-xl font-bold text-[#3525CD]">
                      {initials || "U"}
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-display text-lg font-bold text-[#0F172A] truncate">
                        {formData.name || "Candidate"}
                      </h2>
                      <div className="font-mono text-[12px] text-[#64748B] truncate">
                        {formData.email}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3 border-t border-[#E2E8F0] pt-4 text-[13px]">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-[#64748B]">
                        <MapPin className="h-3.5 w-3.5" />
                        Location
                      </span>
                      <span className="font-medium text-[#0F172A] truncate max-w-[170px]">
                        {formData.location || "Not specified"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-[#64748B]">
                        <GraduationCap className="h-3.5 w-3.5" />
                        Education
                      </span>
                      <span className="font-medium text-[#0F172A] truncate max-w-[170px]">
                        {formData.education || "Not specified"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-[#64748B]">
                        <Target className="h-3.5 w-3.5" />
                        Target Role
                      </span>
                      <span className="font-mono text-[12px] font-semibold text-[#4F46E5] truncate max-w-[170px]">
                        {formData.targetJobRole || "Unassigned"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2 border-t border-[#E2E8F0] pt-4">
                    <Link href="/resume-analyser" className="block">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <FileSearch className="mr-2 h-3.5 w-3.5 text-[#4F46E5]" />
                        Run AI Resume Analyser
                      </Button>
                    </Link>
                    <Link href="/assessment" className="block">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Sparkles className="mr-2 h-3.5 w-3.5 text-[#10B981]" />
                        Take NSQF Assessment
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Edit Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-5">
              {/* Section 1: Identity */}
              <div className="prepp-card p-6">
                <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3.5">
                  <User className="h-4 w-4 text-[#4F46E5]" />
                  <h3 className="font-display text-[16px] font-bold text-[#0F172A]">
                    Identity &amp; Contact
                  </h3>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={handleChange("name")}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email">
                      Email Address{" "}
                      <span className="font-mono text-[10px] text-[#64748B]">
                        (READ-ONLY)
                      </span>
                    </Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#94A3B8]" />
                      <Input
                        id="email"
                        value={formData.email}
                        disabled
                        className="pl-9 bg-[#F8FAFC] font-mono text-[13px] text-[#64748B]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#94A3B8]" />
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange("phone")}
                        placeholder="+91 98765 43210"
                        className="pl-9 font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="location">City / State</Label>
                    <div className="relative">
                      <MapPin className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#94A3B8]" />
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={handleChange("location")}
                        placeholder="e.g. Bengaluru, Karnataka"
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Academic & Experience */}
              <div className="prepp-card p-6">
                <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3.5">
                  <Briefcase className="h-4 w-4 text-[#4F46E5]" />
                  <h3 className="font-display text-[16px] font-bold text-[#0F172A]">
                    Academic &amp; Professional Background
                  </h3>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="education">Highest Qualification</Label>
                    <Input
                      id="education"
                      value={formData.education}
                      onChange={handleChange("education")}
                      placeholder="e.g. B.Tech CSE / ITI / Diploma"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="experience">Work Experience</Label>
                    <Input
                      id="experience"
                      value={formData.experience}
                      onChange={handleChange("experience")}
                      placeholder="e.g. Fresher / 1.5 Years in QA"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="desiredCareerField">
                      Desired SSC Career Domain
                    </Label>
                    <Input
                      id="desiredCareerField"
                      value={formData.desiredCareerField}
                      onChange={handleChange("desiredCareerField")}
                      placeholder="e.g. Web Development, EV Technology"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="targetJobRole">Target NSQF Job Role</Label>
                    <Input
                      id="targetJobRole"
                      value={formData.targetJobRole}
                      onChange={handleChange("targetJobRole")}
                      placeholder="e.g. Junior Software Developer"
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-1.5">
                  <Label htmlFor="bio">Candidate Summary &amp; Skills Bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange("bio")}
                    placeholder="Briefly describe your technical strengths, certifications, and placement objectives..."
                  />
                </div>

                <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#E2E8F0] pt-4">
                  <Button type="submit" disabled={saving}>
                    <Save className="mr-1.5 h-3.5 w-3.5" />
                    {saving ? "Saving Changes..." : "Save Candidate Profile"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
