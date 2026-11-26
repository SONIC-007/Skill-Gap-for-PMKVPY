"use client";
// [FRONTEND] Recovery & Demo Credentials Helper | Route: /forgot-password | Uses: UI Input/Button
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { EditorialAuthShell } from "@/components/story/EditorialAuthShell";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <EditorialAuthShell
            rightActionHref="/login"
            rightActionLabel="Back to Sign In"
            studioBadge="ACCOUNT RECOVERY"
            studioTitle="Recover access,"
            studioItalic="keep your progress."
            studioNote="Need quick workspace access during local evaluation? Use the 1-Click Candidate Demo or Admin Demo on the Sign In screen."
        >
            <div className="w-full max-w-[420px] mx-auto">
                <div className="mb-6">
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#4F46E5] font-semibold">
                        03 // PASSCODE RESET
                    </span>
                    <h1 className="font-display text-[28px] sm:text-[32px] font-semibold text-[#111113] tracking-[-0.03em] mt-1 leading-tight">
                        Reset{" "}
                        <span className="font-editorial italic font-normal text-[#4F46E5]">
                            passcode.
                        </span>
                    </h1>
                    <p className="text-[13.5px] text-[#52525B] mt-1">
                        Enter your registered email to receive recovery guidance.
                    </p>
                </div>

                {submitted ? (
                    <div className="text-center py-4 space-y-3">
                        <div className="w-12 h-12 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] flex items-center justify-center mx-auto">
                            <CheckCircle2 className="h-6 w-6 text-[#10B981]" />
                        </div>
                        <p className="font-display text-[17px] font-semibold text-[#111113]">
                            Check your inbox
                        </p>
                        <p className="text-[13px] text-[#52525B]">
                            If an account exists for <strong className="font-mono text-[#111113]">{email}</strong>, recovery instructions have been prepared.
                        </p>
                        <p className="text-[11px] font-mono text-[#52525B] bg-[#F6F5F0] border border-black/[0.08] rounded-xl p-3">
                            Local demo mode does not send outbound email. Use Candidate/Admin Demo buttons on login.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[#71717A]" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="candidate@pmkvy.com"
                                    className="pl-10"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-11 text-[14px]">
                            Send Reset Instructions
                        </Button>
                    </form>
                )}

                <div className="mt-6 pt-4 border-t border-black/[0.08] text-center">
                    <Link href="/login" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#4F46E5] hover:underline">
                        <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
                    </Link>
                </div>
            </div>
        </EditorialAuthShell>
    );
}
