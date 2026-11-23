"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, ClipboardCheck, BarChart3, BookOpen, Compass, TrendingUp, User, Settings, LogOut, Menu, X, GraduationCap, Shield, Users, Briefcase, FileText, ExternalLink, MapPin, Sparkles, } from "lucide-react";
import { Button } from "@/components/ui/button";
const candidateNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/resume-analyser", label: "AI Resume & Job Match", icon: Sparkles, badge: "AI" },
    { href: "/assessment", label: "Skill Assessment", icon: ClipboardCheck },
    { href: "/skill-gap", label: "Skill Gap Analysis", icon: BarChart3 },
    { href: "/courses", label: "Training Courses", icon: BookOpen },
    { href: "/career-path", label: "Career Path", icon: Compass },
    { href: "/progress", label: "Learning Progress", icon: TrendingUp },
    { href: "/profile", label: "My Profile", icon: User },
];
const adminNavItems = [
    { href: "/admin", label: "Admin Dashboard", icon: Shield },
    { href: "/admin/skills", label: "Manage Skills", icon: Settings },
    { href: "/admin/job-roles", label: "Manage Job Roles", icon: Briefcase },
    { href: "/admin/courses", label: "Manage Courses", icon: FileText },
    { href: "/admin/candidates", label: "Candidates", icon: Users },
];
export function Sidebar({ userRole = "CANDIDATE", userName = "Candidate", onSignOut, isLoggedIn = false, }) {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const navItems = userRole === "ADMIN" ? adminNavItems : candidateNavItems;
    return (<>
      {/* Mobile toggle */}
      <Button variant="outline" size="icon" className="fixed top-3 left-4 z-50 lg:hidden shadow-sm" onClick={() => setIsMobileOpen(!isMobileOpen)}>
        {isMobileOpen ? <X className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (<div className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40 lg:hidden" onClick={() => setIsMobileOpen(false)}/>)}

      {/* Apple HomeView Sidebar */}
      <aside className={cn("fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-[#e5e7eb] transition-transform duration-300 lg:translate-x-0 flex flex-col font-sans", isMobileOpen ? "translate-x-0" : "-translate-x-full")}>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-[#e5e7eb]">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#0071e3] text-white">
            <GraduationCap className="h-5 w-5"/>
          </div>
          <div>
            <h1 className="text-[15px] font-semibold text-[#1d1d1f] tracking-tight">PMKVY Portal</h1>
            <p className="text-[11px] text-[#86868b]">Skill Gap Analyser</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (<Link key={item.href} href={item.href} onClick={() => setIsMobileOpen(false)} className={cn("flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] transition-all duration-150", isActive
                    ? "bg-[#0071e3]/10 text-[#0071e3] font-semibold"
                    : "text-[#1d1d1f] hover:bg-[#f5f5f7] font-medium")}>
                <item.icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-[#0071e3]" : "text-[#86868b]")}/>
                <span className="flex-1">{item.label}</span>
                {item.badge && (<span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#0071e3] text-white">
                    {item.badge}
                  </span>)}
              </Link>);
        })}

          {/* Official Govt Portals Section */}
          <div className="pt-5 mt-4 border-t border-[#e5e7eb]">
            <p className="px-3 text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-2">
              Govt Portals
            </p>
            <div className="space-y-1">
              <a href="https://www.skillindiadigital.gov.in" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl px-3 py-2 text-[13px] text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors">
                <span className="flex items-center gap-2">
                  <span className="text-[13px]">🇮🇳</span> Skill India Digital
                </span>
                <ExternalLink className="h-3 w-3 text-[#86868b]"/>
              </a>

              <a href="https://www.pmkvyofficial.org/find-a-training-centre" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl px-3 py-2 text-[13px] text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors">
                <span className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-[#0071e3]"/> Find PMKK Center
                </span>
                <ExternalLink className="h-3 w-3 text-[#86868b]"/>
              </a>
            </div>
          </div>
        </nav>

        {/* User Account / Footer */}
        <div className="border-t border-[#e5e7eb] p-4 shrink-0 bg-[#fbfbfd]">
          {isLoggedIn ? (<>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0071e3]/10 text-[#0071e3] text-xs font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-[#1d1d1f] truncate">{userName}</p>
                  <p className="text-[12px] text-[#86868b] capitalize">{userRole.toLowerCase()}</p>
                </div>
              </div>
              <button onClick={onSignOut} className="flex items-center gap-2 w-full rounded-xl px-3 py-2 text-[13px] text-[#86868b] hover:text-[#ff3b30] hover:bg-[#ff3b30]/10 transition-colors cursor-pointer font-medium">
                <LogOut className="h-3.5 w-3.5"/>
                Sign Out
              </button>
            </>) : (<div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#f5f5f7] border border-[#e5e7eb] flex items-center justify-center text-xs font-medium text-[#86868b]">
                  👤
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[#1d1d1f] truncate">Guest User</p>
                  <p className="text-[11px] text-[#34c759] font-medium">Session Active</p>
                </div>
              </div>
              <Link href="/login" className="flex items-center justify-center gap-1.5 w-full rounded-full bg-[#0071e3] hover:bg-[#0077ed] h-[38px] text-[13px] font-medium text-white transition-colors">
                <span>Sign In / Register</span>
                <span>→</span>
              </Link>
            </div>)}
        </div>
      </aside>
    </>);
}
