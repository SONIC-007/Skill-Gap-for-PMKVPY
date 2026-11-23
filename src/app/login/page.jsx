"use client";
import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Mail, Lock, Loader2, ArrowRight, Sparkles } from "lucide-react";
function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
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
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });
            if (result?.error) {
                setError("Invalid email or password");
            }
            else {
                router.push(callbackUrl);
                router.refresh();
            }
        }
        catch {
            setError("Something went wrong. Please try again.");
        }
        finally {
            setLoading(false);
        }
    };
    return (<Card className="w-full max-w-[420px] rounded-3xl border border-[#e5e7eb] bg-white p-2 sm:p-4 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
      <CardHeader className="text-center pb-5 pt-4">
        <div className="flex justify-center mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#0071e3] text-white">
            <GraduationCap className="h-6 w-6"/>
          </div>
        </div>
        <CardTitle className="text-[26px] font-semibold text-[#1d1d1f] tracking-tight">
          Sign In
        </CardTitle>
        <CardDescription className="text-[14px] text-[#86868b] mt-1">
          Access your PMKVY skill profile and AI analysis
        </CardDescription>

        {/* Notice if redirected from an internal page */}
        {callbackUrl && callbackUrl !== "/dashboard" && (<div className="mt-4 p-2.5 rounded-xl bg-[#0071e3]/5 border border-[#0071e3]/20 text-[#0071e3] text-[13px] font-medium flex items-center justify-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5"/>
            <span>
              Sign in to continue to <strong>{callbackUrl.replace("/", "").replace("-", " ")}</strong>
            </span>
          </div>)}
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 px-6">
          {error && (<div className="p-3 text-[13px] text-[#ff3b30] bg-[#ff3b30]/10 border border-[#ff3b30]/20 rounded-xl font-medium">
              {error}
            </div>)}

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[13px] font-medium text-[#1d1d1f]">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[#86868b]"/>
              <Input id="email" type="email" placeholder="name@example.com" className="pl-10 text-[14px] rounded-xl h-[42px]" value={email} onChange={(e) => setEmail(e.target.value)} required/>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-[13px] font-medium text-[#1d1d1f]">
                Password
              </Label>
              <Link href="/forgot-password" className="text-[12px] text-[#0071e3] hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[#86868b]"/>
              <Input id="password" type="password" placeholder="••••••••" className="pl-10 text-[14px] rounded-xl h-[42px]" value={password} onChange={(e) => setPassword(e.target.value)} required/>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3.5 pt-3 px-6 pb-6">
          {/* 1-Click Fast Credentials for Evaluation */}
          <div className="flex gap-2 w-full">
            <Button type="button" variant="outline" size="sm" className="flex-1 text-[12px] rounded-full h-[36px] border-[#d2d2d7] text-[#1d1d1f] hover:bg-[#f5f5f7]" onClick={() => {
            setEmail("candidate@pmkvy.com");
            setPassword("candidate123");
        }}>
              Candidate Demo
            </Button>
            <Button type="button" variant="outline" size="sm" className="flex-1 text-[12px] rounded-full h-[36px] border-[#d2d2d7] text-[#1d1d1f] hover:bg-[#f5f5f7]" onClick={() => {
            setEmail("admin@pmkvy.com");
            setPassword("admin123");
        }}>
              Admin Demo
            </Button>
          </div>

          <Button type="submit" className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium text-[15px] rounded-full h-[44px] shadow-none" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : <ArrowRight className="h-4 w-4 mr-1.5"/>}
            Continue
          </Button>

          <p className="text-[13px] text-[#86868b] text-center pt-2">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-[#0071e3] font-medium hover:underline">
              Create yours now
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>);
}
export default function LoginPage() {
    return (<div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] px-4 py-12">
      <Suspense fallback={<div className="text-[13px] text-[#86868b]">Loading sign in...</div>}>
        <LoginForm />
      </Suspense>
    </div>);
}
