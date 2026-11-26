"use client";
// [FRONTEND] Candidate Profile Settings | Route: /profile | Uses: GET/PUT /api/profile, DashboardLayout
import { useState, useEffect } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { useSession } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { EditorialPageHeader } from "@/components/story/EditorialPageHeader";
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
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Save,
  FileSearch,
  Sparkles,
} from "lucide-react";

export default function ProfilePage() {
  const { refreshSession } = useSession();
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
        refreshSession().catch(() => {});
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
        {/* Editorial Header */}
        <EditorialPageHeader
          variant="light"
          eyebrow="ACCOUNT / CANDIDATE DOSSIER"
          title="Profile & Career"
          italicAccent="Preferences."
          description="Maintain your academic background and PMKVY target role so career readiness rankings stay accurate."
          rightSlot={
            <Badge variant="secondary" className="font-mono text-[11px] px-3 py-1">
              ROLE: {formData.role || "CANDIDATE"}
            </Badge>
          }
        />

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
              <div className="h-16 w-16 rounded-xl bg-[#E6E4DE]" />
              <div className="h-5 w-1/2 rounded bg-[#E6E4DE]" />
              <div className="h-4 w-3/4 rounded bg-[#EFECE6]" />
            </div>
            <div className="lg:col-span-8 prepp-card p-6 animate-pulse space-y-4">
              <div className="h-6 w-1/3 rounded bg-[#E6E4DE]" />
              <div className="h-10 w-full rounded bg-[#EFECE6]" />
              <div className="h-10 w-full rounded bg-[#EFECE6]" />
              <div className="h-24 w-full rounded bg-[#EFECE6]" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
            {/* Left Dossier Summary Card (Ref 2 Modular Profile Card) */}
            <div className="lg:col-span-4 space-y-5">
              <div className="prepp-card p-6 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#EEF0FF] font-display text-xl font-bold text-[#4F46E5]">
                    {initials || "U"}
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono text-[10.5px] font-semibold uppercase tracking-wider text-[#71717A]">
                      {formData.role || "CANDIDATE"}
                    </div>
                    <h2 className="font-display text-lg font-bold text-[#111113] truncate">
                      {formData.name || "Candidate"}
                    </h2>
                    <div className="text-[12px] text-[#71717A] truncate">
                      {formData.email}
                    </div>
                  </div>
                </div>

                {/* Inner Soft Tinted 3-Stat Strip (Matching Ref 2 Stats Block) */}
                <div className="grid grid-cols-3 gap-2 rounded-2xl bg-[#F4F5F7] p-3.5 text-center">
                  <div className="min-w-0">
                    <div className="text-[10.5px] text-[#71717A]">Location</div>
                    <div className="font-display text-[13px] font-semibold text-[#111113] truncate mt-0.5">
                      {formData.location || "India"}
                    </div>
                  </div>
                  <div className="min-w-0 border-x border-black/[0.06] px-1">
                    <div className="text-[10.5px] text-[#71717A]">Education</div>
                    <div className="font-display text-[13px] font-semibold text-[#111113] truncate mt-0.5">
                      {formData.education || "Unset"}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10.5px] text-[#71717A]">Target</div>
                    <div className="font-display text-[13px] font-semibold text-[#4F46E5] truncate mt-0.5">
                      {formData.targetJobRole || "Unset"}
                    </div>
                  </div>
                </div>

                {/* Dual Action Buttons (Secondary White + Solid Black/Indigo CTA) */}
                <div className="grid grid-cols-2 gap-2.5">
                  <Link href="/assessment" className="block">
                    <Button variant="outline" size="sm" className="w-full justify-center rounded-xl h-9">
                      <Sparkles className="mr-1.5 h-3.5 w-3.5 text-[#10B981]" />
                      NSQF Quiz
                    </Button>
                  </Link>
                  <Link href="/resume-analyser" className="block">
                    <Button variant="default" size="sm" className="w-full justify-center rounded-xl h-9">
                      <FileSearch className="mr-1.5 h-3.5 w-3.5" />
                      Resume AI
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Edit Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-5">
              {/* Section 1: Identity */}
              <div className="prepp-card p-6">
                <div className="flex items-center gap-2 border-b border-[#E6E4DE] pb-3.5">
                  <User className="h-4 w-4 text-[#4F46E5]" />
                  <h3 className="font-display text-[16px] font-bold text-[#111113]">
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
                      <span className="font-mono text-[10px] text-[#52525B]">
                        (READ-ONLY)
                      </span>
                    </Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#94A3B8]" />
                      <Input
                        id="email"
                        value={formData.email}
                        disabled
                        className="pl-9 bg-[#F6F5F0] font-mono text-[13px] text-[#52525B]"
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
                <div className="flex items-center gap-2 border-b border-[#E6E4DE] pb-3.5">
                  <Briefcase className="h-4 w-4 text-[#4F46E5]" />
                  <h3 className="font-display text-[16px] font-bold text-[#111113]">
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

                <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#E6E4DE] pt-4">
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
