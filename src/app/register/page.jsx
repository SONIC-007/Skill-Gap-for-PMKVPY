"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, Loader2, ArrowRight } from "lucide-react";

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
            const res = await fetch("/api/register", {
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
        <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
            <header className="w-full bg-white border-b border-[#E2E8F0]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="h-7 w-7 rounded-lg bg-[#4F46E5] text-white flex items-center justify-center font-mono text-[12px] font-bold">
                            &lt;/&gt;
                        </span>
                        <span className="font-display text-[15px] font-semibold text-[#3525CD]">PMKVY Skill Gap</span>
                    </Link>
                    <Link href="/login" className="text-[12px] font-medium text-[#4F46E5] hover:underline">
                        Sign In →
                    </Link>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center px-4 py-10">
                <div className="w-full max-w-[440px] bg-white border border-[#E2E8F0] rounded-xl shadow-[0_4px_16px_-2px_rgba(15,23,42,0.06)] relative overflow-hidden">
                    <div className="h-1 w-full bg-gradient-to-r from-[#3525CD] via-[#4D44E3] to-[#10B981]" />

                    <div className="p-7 sm:p-8">
                        <div className="text-center mb-6">
                            <div className="inline-flex h-11 w-11 rounded-xl bg-[#EAEDFF] text-[#3525CD] border border-[#C7C4D8]/60 items-center justify-center font-mono text-[16px] font-bold mb-3">
                                &lt;/&gt;
                            </div>
                            <h1 className="font-display text-[22px] font-semibold text-[#0F172A] tracking-tight">
                                Create Candidate Account
                            </h1>
                            <p className="text-[13px] text-[#64748B] mt-1">
                                Start tracking your NSQF skill readiness and PMKVY courses.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 text-[12px] text-[#991B1B] bg-[#FEF2F2] border border-[#FECACA] rounded-lg font-medium">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="name">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-[#64748B]" />
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Arun Kumar"
                                        className="pl-9"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#64748B]" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        className="pl-9"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#64748B]" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-9"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#64748B]" />
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-9"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-10 text-[14px] mt-2" disabled={loading}>
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                                <span>Create Account</span>
                            </Button>

                            <p className="text-[12px] text-[#64748B] text-center pt-3 border-t border-[#E2E8F0]">
                                Already registered?{" "}
                                <Link href="/login" className="text-[#4F46E5] font-medium hover:underline">
                                    Sign in here
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
