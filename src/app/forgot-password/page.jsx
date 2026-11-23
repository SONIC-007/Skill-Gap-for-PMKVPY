"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };
    return (<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50/50 px-4 py-8">
      <Card className="w-full max-w-md shadow-lg border border-blue-100">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-900 shadow-md shadow-blue-900/20">
              <GraduationCap className="h-8 w-8 text-white"/>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-blue-950">Reset Password</CardTitle>
          <CardDescription>Enter your email to receive reset instructions</CardDescription>
        </CardHeader>
        {submitted ? (<CardContent className="text-center py-6">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4"/>
            <p className="text-blue-950 font-medium mb-2">Check your email</p>
            <p className="text-sm text-slate-500 mb-4">
              If an account with that email exists, we&apos;ve sent password reset instructions.
            </p>
            <p className="text-xs text-slate-400">
              Note: Password reset is a demonstration feature. In production, this would send an actual email.
            </p>
          </CardContent>) : (<form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400"/>
                  <Input id="email" type="email" placeholder="Enter your email" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800">
                Send Reset Link
              </Button>
            </CardFooter>
          </form>)}
        <div className="p-6 pt-0 text-center">
          <Link href="/login" className="inline-flex items-center gap-1 text-sm text-blue-700 hover:underline">
            <ArrowLeft className="h-4 w-4"/> Back to Sign In
          </Link>
        </div>
      </Card>
    </div>);
}
