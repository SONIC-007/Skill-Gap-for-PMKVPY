"use client";
// [FRONTEND] Recovery & Demo Credentials Helper | Route: /forgot-password | Uses: UI Input/Button
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
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
                    <Link href="/login" className="text-[12px] font-medium text-[#64748B] hover:text-[#4F46E5]">
                        Sign In →
                    </Link>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center px-4 py-10">
                <div className="w-full max-w-[420px] bg-white border border-[#E2E8F0] rounded-xl shadow-[0_4px_16px_-2px_rgba(15,23,42,0.06)] relative overflow-hidden">
                    <div className="h-1 w-full bg-gradient-to-r from-[#3525CD] via-[#4D44E3] to-[#10B981]" />

                    <div className="p-7 sm:p-8">
                        <div className="text-center mb-6">
                            <div className="inline-flex h-11 w-11 rounded-xl bg-[#EAEDFF] text-[#3525CD] border border-[#C7C4D8]/60 items-center justify-center font-mono text-[16px] font-bold mb-3">
                                &lt;/&gt;
                            </div>
                            <h1 className="font-display text-[22px] font-semibold text-[#0F172A] tracking-tight">
                                Reset Passcode
                            </h1>
                            <p className="text-[13px] text-[#64748B] mt-1">
                                Enter your registered email to receive password recovery instructions.
                            </p>
                        </div>

                        {submitted ? (
                            <div className="text-center py-4 space-y-3">
                                <div className="w-12 h-12 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="h-6 w-6 text-[#10B981]" />
                                </div>
                                <p className="font-display text-[16px] font-semibold text-[#0F172A]">
                                    Check your inbox
                                </p>
                                <p className="text-[13px] text-[#64748B]">
                                    If an account exists for <strong className="font-mono text-[#0F172A]">{email}</strong>, recovery steps have been dispatched.
                                </p>
                                <p className="text-[11px] font-mono text-[#64748B] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2.5">
                                    Note: Local/demo mode does not send outbound email. Use Candidate/Admin Demo buttons on login.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#64748B]" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="candidate@pmkvy.com"
                                            className="pl-9"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full h-10 text-[14px]">
                                    Send Reset Instructions
                                </Button>
                            </form>
                        )}

                        <div className="mt-6 pt-4 border-t border-[#E2E8F0] text-center">
                            <Link href="/login" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#4F46E5] hover:underline">
                                <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
