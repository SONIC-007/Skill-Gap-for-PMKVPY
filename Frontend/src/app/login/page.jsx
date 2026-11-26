"use client";
// [FRONTEND] Login Page | Route: /login | Uses: auth-context (POST /api/auth/login) & UI Input/Button
import { useState, Suspense } from "react";
import { useSession } from "@/lib/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2, ArrowRight, Sparkles, Zap, ShieldCheck, CheckCircle2 } from "lucide-react";
import { EditorialAuthShell } from "@/components/story/EditorialAuthShell";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { signInWithCredentials } = useSession();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    const isRegistered = searchParams.get("registered") === "true";
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
        <div className="w-full max-w-[440px] mx-auto">
            <div className="mb-7">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#4F46E5] font-semibold">
                    01 // ACCESS PORTAL
                </span>
                <h1 className="font-display text-[30px] sm:text-[34px] font-semibold text-[#111113] tracking-[-0.03em] mt-1 leading-tight">
                    Welcome{" "}
                    <span className="font-editorial italic font-normal text-[#4F46E5]">
                        back.
                    </span>
                </h1>
                <p className="text-[13.5px] text-[#52525B] mt-1.5 leading-relaxed">
                    Sign in to enter your workspace for AI resume audits, gap diagnostics, and subsidized training tracks.
                </p>

                {callbackUrl && callbackUrl !== "/dashboard" && (
                    <div className="mt-3.5 px-3.5 py-2 rounded-full bg-[#F2F3FF] border border-[#4F46E5]/20 text-[#3525CD] text-[12px] font-medium inline-flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 shrink-0" />
                        <span>
                            Continue to <strong className="font-mono">{callbackUrl}</strong>
                        </span>
                    </div>
                )}
            </div>

            {isRegistered && !error && (
                <div className="mb-4 p-3 text-[12px] text-[#065F46] bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl font-medium flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#10B981]" />
                    <span>Account created successfully. Please sign in to continue.</span>
                </div>
            )}

            {error && (
                <div className="mb-4 p-3 text-[12px] text-[#991B1B] bg-[#FEF2F2] border border-[#FECACA] rounded-xl font-medium">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="email">Candidate / Admin Email</Label>
                        <span className="font-mono text-[11px] text-[#71717A]">candidate@pmkvy.com</span>
                    </div>
                    <div className="relative">
                        <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[#71717A]" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            className="pl-10"
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
                        <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[#71717A]" />
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="pl-10"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between pt-0.5 text-[12px]">
                    <span className="text-[#52525B]">Session stored via Signed JWT</span>
                    <span className="font-mono text-[11px] text-[#065F46] flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5 text-[#10B981]" /> Encrypted
                    </span>
                </div>

                <Button type="submit" className="w-full h-11 text-[14px]" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                    <span>Sign In to Workspace</span>
                </Button>
            </form>

            {/* 1-Click Demo Evaluator Access */}
            <div className="mt-6 pt-5 border-t border-black/[0.08] space-y-2.5">
                <div className="flex items-center justify-between">
                    <span className="font-mono text-[10.5px] uppercase tracking-wider text-[#52525B] font-semibold">
                        Quick Demo Sign-In
                    </span>
                    <span className="font-mono text-[10px] text-[#3525CD] bg-[#EAEDFF] px-2 py-0.5 rounded-full">
                        1-CLICK
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        disabled={loading}
                        onClick={() => quickLoginDemo("candidate@pmkvy.com", "candidate123")}
                        className="h-9"
                    >
                        <Zap className="h-3.5 w-3.5 text-[#4F46E5]" />
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

                <p className="text-[12.5px] text-[#52525B] text-center pt-2">
                    New to PMKVY Skill Gap Analyser?{" "}
                    <Link href="/register" className="text-[#4F46E5] font-semibold hover:underline">
                        Create candidate account
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <EditorialAuthShell
            rightActionHref="/"
            rightActionLabel="Back to Story"
            studioBadge="CANDIDATE ACCESS"
            studioTitle="Sign in cleanly."
            studioItalic="Track every skill."
            studioNote="Compare verified experience against official QP-NOS roles or live hiring links, persisted cleanly in MongoDB."
        >
            <Suspense fallback={<div className="text-[13px] font-mono text-[#52525B]">Loading authentication...</div>}>
                <LoginForm />
            </Suspense>
        </EditorialAuthShell>
    );
}
