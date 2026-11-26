"use client";
// [FRONTEND] Candidate Registration Page | Route: /register | Uses: apiFetch (POST /api/register)
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { EditorialAuthShell } from "@/components/story/EditorialAuthShell";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }
        setLoading(true);
        try {
            const res = await apiFetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Registration failed");
            } else {
                router.push("/login?registered=true");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <EditorialAuthShell
            rightActionHref="/login"
            rightActionLabel="Sign In"
            studioBadge="NEW SKILL PASSPORT"
            studioTitle="Build your"
            studioItalic="NSQF readiness profile."
            studioNote="Create a persistent MongoDB account to analyze resumes, verify NOS competencies, and enroll in PMKVY 4.0 courses."
        >
            <div className="w-full max-w-[440px] mx-auto">
                <div className="mb-6">
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#4F46E5] font-semibold">
                        02 // CANDIDATE ONBOARDING
                    </span>
                    <h1 className="font-display text-[28px] sm:text-[32px] font-semibold text-[#111113] tracking-[-0.03em] mt-1 leading-tight">
                        Create your{" "}
                        <span className="font-editorial italic font-normal text-[#4F46E5]">
                            passport.
                        </span>
                    </h1>
                    <p className="text-[13.5px] text-[#52525B] mt-1">
                        Start tracking NSQF readiness benchmarks and subsidized PMKVY courses.
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 text-[12px] text-[#991B1B] bg-[#FEF2F2] border border-[#FECACA] rounded-xl font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                            <User className="absolute left-3.5 top-3 h-4 w-4 text-[#71717A]" />
                            <Input
                                id="name"
                                type="text"
                                placeholder="Arun Kumar"
                                className="pl-10"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[#71717A]" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                className="pl-10"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[#71717A]" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-10"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="confirmPassword">Confirm</Label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[#71717A]" />
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-10"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <Button type="submit" className="w-full h-11 text-[14px] mt-2" disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                        <span>Create Account</span>
                    </Button>

                    <p className="text-[12.5px] text-[#52525B] text-center pt-4 border-t border-black/[0.08]">
                        Already registered?{" "}
                        <Link href="/login" className="text-[#4F46E5] font-semibold hover:underline">
                            Sign in here
                        </Link>
                    </p>
                </form>
            </div>
        </EditorialAuthShell>
    );
}
