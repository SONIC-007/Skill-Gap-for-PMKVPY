"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, User, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
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
            }
            else {
                router.push("/login?registered=true");
            }
        }
        catch {
            setError("Something went wrong. Please try again.");
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] px-4 py-12">
      <Card className="w-full max-w-[440px] rounded-3xl border border-[#e5e7eb] bg-white p-2 sm:p-4 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
        <CardHeader className="text-center pb-5 pt-4">
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#0071e3] text-white">
              <GraduationCap className="h-6 w-6"/>
            </div>
          </div>
          <CardTitle className="text-[26px] font-semibold text-[#1d1d1f] tracking-tight">
            Create Account
          </CardTitle>
          <CardDescription className="text-[14px] text-[#86868b] mt-1">
            Get started with PMKVY Skill Gap Analyser
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 px-6">
            {error && (<div className="p-3 text-[13px] text-[#ff3b30] bg-[#ff3b30]/10 border border-[#ff3b30]/20 rounded-xl font-medium">
                {error}
              </div>)}

            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-[13px] font-medium text-[#1d1d1f]">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-[#86868b]"/>
                <Input id="name" type="text" placeholder="Arun Kumar" className="pl-10 text-[14px] rounded-xl h-[42px]" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required/>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[13px] font-medium text-[#1d1d1f]">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[#86868b]"/>
                <Input id="email" type="email" placeholder="name@example.com" className="pl-10 text-[14px] rounded-xl h-[42px]" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required/>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[13px] font-medium text-[#1d1d1f]">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[#86868b]"/>
                <Input id="password" type="password" placeholder="••••••••" className="pl-10 text-[14px] rounded-xl h-[42px]" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required/>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-[13px] font-medium text-[#1d1d1f]">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[#86868b]"/>
                <Input id="confirmPassword" type="password" placeholder="••••••••" className="pl-10 text-[14px] rounded-xl h-[42px]" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required/>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3.5 pt-3 px-6 pb-6">
            <Button type="submit" className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium text-[15px] rounded-full h-[44px] shadow-none" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : <ArrowRight className="h-4 w-4 mr-1.5"/>}
              Create Account
            </Button>

            <p className="text-[13px] text-[#86868b] text-center pt-2">
              Already have an account?{" "}
              <Link href="/login" className="text-[#0071e3] font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>);
}
