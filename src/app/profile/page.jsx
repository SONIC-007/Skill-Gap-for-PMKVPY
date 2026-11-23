"use client";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, GraduationCap, Briefcase, MapPin, CheckCircle2, Loader2, } from "lucide-react";
export default function ProfilePage() {
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        education: "",
        experience: "",
        location: "",
        desiredCareerField: "",
        targetJobRole: "",
        bio: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savedSuccess, setSavedSuccess] = useState(false);
    useEffect(() => {
        fetch("/api/profile")
            .then((res) => res.json())
            .then((data) => {
            setProfile({
                name: data.name || "",
                email: data.email || "",
                phone: data.profile?.phone || "",
                education: data.profile?.education || "",
                experience: data.profile?.experience || "",
                location: data.profile?.location || "",
                desiredCareerField: data.profile?.desiredCareerField || "",
                targetJobRole: data.profile?.targetJobRole || "",
                bio: data.profile?.bio || "",
                role: data.role || "CANDIDATE",
            });
            setLoading(false);
        })
            .catch((err) => {
            console.error(err);
            setLoading(false);
        });
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSavedSuccess(false);
        try {
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profile),
            });
            if (!res.ok)
                throw new Error("Failed to update profile");
            setSavedSuccess(true);
            setTimeout(() => setSavedSuccess(false), 4000);
        }
        catch (err) {
            alert(err.message || "Failed to save profile");
        }
        finally {
            setSaving(false);
        }
    };
    if (loading) {
        return (<DashboardLayout>
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-900"/>
        </div>
      </DashboardLayout>);
    }
    return (<DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-semibold mb-2">
              <User className="h-3.5 w-3.5"/> PMKVY Candidate Dossier
            </div>
            <h1 className="text-3xl font-bold text-blue-950">Candidate Profile</h1>
            <p className="text-slate-600">
              Manage your personal information, educational credentials, and career aspirations.
            </p>
          </div>
          <Badge variant="default" className="text-xs">
            {profile.role || "CANDIDATE"}
          </Badge>
        </div>

        {savedSuccess && (<div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 text-sm font-semibold">
            <CheckCircle2 className="h-5 w-5 text-emerald-600"/>
            Profile updated successfully!
          </div>)}

        <form onSubmit={handleSubmit}>
          <Card className="border-blue-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Personal & Contact Details</CardTitle>
              <CardDescription>
                This information is shared with PMKVY training partners upon course enrollment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Legal Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400"/>
                    <Input id="name" className="pl-10" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} required/>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Registered Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400"/>
                    <Input id="email" className="pl-10 bg-slate-50 text-slate-500" value={profile.email} disabled/>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone / WhatsApp Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400"/>
                    <Input id="phone" className="pl-10" placeholder="+91 98765 43210" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })}/>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">City / State</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400"/>
                    <Input id="location" className="pl-10" placeholder="e.g. New Delhi, Mumbai, Bengaluru" value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })}/>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-base font-bold text-blue-950 mb-4">Educational & Career Aspirations</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="education">Highest Qualification</Label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-slate-400"/>
                      <Input id="education" className="pl-10" placeholder="e.g. B.Tech Computer Science / Diploma" value={profile.education} onChange={(e) => setProfile({ ...profile, education: e.target.value })}/>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-3 h-4 w-4 text-slate-400"/>
                      <Input id="experience" className="pl-10" placeholder="e.g. Fresher / 1 Year" value={profile.experience} onChange={(e) => setProfile({ ...profile, experience: e.target.value })}/>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="desiredCareerField">Desired Career Field</Label>
                    <Input id="desiredCareerField" placeholder="e.g. Web Development, AI, EV Technology" value={profile.desiredCareerField} onChange={(e) => setProfile({ ...profile, desiredCareerField: e.target.value })}/>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetJobRole">Target Job Role</Label>
                    <Input id="targetJobRole" placeholder="e.g. Full Stack Developer, Data Analyst" value={profile.targetJobRole} onChange={(e) => setProfile({ ...profile, targetJobRole: e.target.value })}/>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <Label htmlFor="bio">Professional Bio & Career Objective</Label>
                <Textarea id="bio" rows={4} placeholder="Share your background, current focus areas, and skill goals..." value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })}/>
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t border-slate-100 flex justify-end">
              <Button type="submit" className="bg-blue-900 hover:bg-blue-800" disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2"/>}
                Save Profile Changes
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </DashboardLayout>);
}
