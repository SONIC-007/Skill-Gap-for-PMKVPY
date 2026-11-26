"use client";
// [FRONTEND] Login Page | Route: /login | Uses: auth-context (POST /api/auth/login) & UI Input/Button
import { useState, Suspense } from "react";
import { useSession } from "@/lib/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2, ArrowRight, Sparkles, Zap, ShieldCheck } from "lucide-react";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { signInWithCredentials } = useSession();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const result = await signInWithCredentials({ email, password });
            if (result?.error) {
                setError(result.error);
            } else {
                router.push(callbackUrl);
                router.refresh();
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const quickLoginDemo = async (demoEmail, demoPassword, targetUrl) => {
        setEmail(demoEmail);
        setPassword(demoPassword);
        setError("");
        setLoading(true);
        try {
            const result = await signInWithCredentials({
                email: demoEmail,
                password: demoPassword,
            });
            if (!result?.error) {
                router.push(targetUrl || callbackUrl);
                router.refresh();
            } else {
                setError(result.error || "Demo credentials check failed.");
            }
        } catch {
            setError("Sign in failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[440px] bg-white border border-[#E2E8F0] rounded-xl shadow-[0_4px_16px_-2px_rgba(15,23,42,0.06)] relative overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-[#3525CD] via-[#4D44E3] to-[#10B981]" />

            <div className="p-7 sm:p-8">
                <div className="text-center mb-6">
                    <div className="inline-flex h-11 w-11 rounded-xl bg-[#EAEDFF] text-[#3525CD] border border-[#C7C4D8]/60 items-center justify-center font-mono text-[16px] font-bold mb-3">
                        &lt;/&gt;
                    </div>
                    <h1 className="font-display text-[22px] font-semibold text-[#0F172A] tracking-tight">
                        Welcome Back
                    </h1>
                    <p className="text-[13px] text-[#64748B] mt-1 max-w-xs mx-auto">
                        Sign in to PMKVY Skill Gap Analyser for AI resume audits, gap diagnostics, and training tracks.
                    </p>

                    {callbackUrl && callbackUrl !== "/dashboard" && (
                        <div className="mt-3.5 px-3 py-2 rounded-lg bg-[#F2F3FF] border border-[#C7C4D8] text-[#3525CD] text-[12px] font-medium inline-flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5 shrink-0" />
                            <span>
                                Continue to <strong className="font-mono">{callbackUrl}</strong>
                            </span>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="mb-4 p-3 text-[12px] text-[#991B1B] bg-[#FEF2F2] border border-[#FECACA] rounded-lg font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="email">Candidate / Admin Email</Label>
                            <span className="font-mono text-[11px] text-[#64748B]">candidate@pmkvy.com</span>
                        </div>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#64748B]" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                className="pl-9"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <Link href="/forgot-password" className="text-[12px] text-[#4F46E5] hover:underline font-medium">
                                Forgot passcode?
                            </Link>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#64748B]" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="pl-9"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-0.5 text-[12px]">
                        <span className="text-[#64748B]">Session stored via Signed JWT</span>
                        <span className="font-mono text-[11px] text-[#065F46] flex items-center gap-1">
                            <ShieldCheck className="h-3.5 w-3.5 text-[#10B981]" /> Encrypted
                        </span>
                    </div>

                    <Button type="submit" className="w-full h-10 text-[14px]" disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                        <span>Sign In to Workspace</span>
                    </Button>
                </form>

                {/* 1-Click Demo Evaluator Access */}
                <div className="mt-6 pt-5 border-t border-[#E2E8F0] space-y-2.5">
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] uppercase tracking-wider text-[#64748B] font-semibold">
                            Quick Demo Sign-In
                        </span>
                        <span className="font-mono text-[10px] text-[#4F46E5] bg-[#EAEDFF] px-1.5 py-0.5 rounded">
                            1-CLICK
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            disabled={loading}
                            onClick={() => quickLoginDemo("candidate@pmkvy.com", "candidate123")}
                            className="h-9 bg-[#F2F3FF] hover:bg-[#EAEDFF] text-[#3525CD] border-[#C7C4D8]/80"
                        >
                            <Zap className="h-3.5 w-3.5" />
                            <span>Candidate Demo</span>
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={loading}
                            onClick={() => quickLoginDemo("admin@pmkvy.com", "admin123", "/admin")}
                            className="h-9"
                        >
                            <span>Admin Demo</span>
                        </Button>
                    </div>

                    <p className="text-[12px] text-[#64748B] text-center pt-2">
                        New to PMKVY Skill Gap Analyser?{" "}
                        <Link href="/register" className="text-[#4F46E5] font-medium hover:underline">
                            Create candidate account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
            <header className="w-full bg-white border-b border-[#E2E8F0]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="h-7 w-7 rounded-lg bg-[#4F46E5] text-white flex items-center justify-center font-mono text-[12px] font-bold">
                            &lt;/&gt;
                        </span>
                        <span className="font-display text-[15px] font-semibold text-[#3525CD]">PMKVY Skill Gap</span>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-[#EAEDFF] text-[#464555]">
                            PMKVY 4.0
                        </span>
                    </Link>
                    <Link href="/" className="text-[12px] font-medium text-[#64748B] hover:text-[#4F46E5]">
                        ← Back to Overview
                    </Link>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center px-4 py-10">
                <Suspense fallback={<div className="text-[13px] font-mono text-[#64748B]">Loading authentication...</div>}>
                    <LoginForm />
                </Suspense>
            </main>
        </div>
    );
}
