"use client";
// [FRONTEND] TopNavbar & Role Navigation | Used by: dashboard-layout.jsx
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    ClipboardCheck,
    BarChart3,
    BookOpen,
    Compass,
    TrendingUp,
    User,
    Settings,
    LogOut,
    Menu,
    X,
    Shield,
    Users,
    Briefcase,
    FileText,
    ExternalLink,
    Sparkles,
    Search,
    ArrowRight,
    MapPin,
} from "lucide-react";

const candidateNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/resume-analyser", label: "AI Resume", icon: Sparkles, badge: "AI" },
    { href: "/assessment", label: "Assessment", icon: ClipboardCheck },
    { href: "/skill-gap", label: "Skill Gap", icon: BarChart3 },
    { href: "/courses", label: "Courses", icon: BookOpen },
    { href: "/career-path", label: "Career Path", icon: Compass },
    { href: "/progress", label: "Progress", icon: TrendingUp },
];

const adminNavItems = [
    { href: "/admin", label: "Overview", icon: Shield },
    { href: "/admin/skills", label: "Skills", icon: Settings },
    { href: "/admin/job-roles", label: "Job Roles", icon: Briefcase },
    { href: "/admin/courses", label: "Courses", icon: FileText },
    { href: "/admin/candidates", label: "Candidates", icon: Users },
];

export function TopNavbar({
    userRole = "CANDIDATE",
    userName = "Candidate",
    onSignOut,
    isLoggedIn = false,
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [cmdOpen, setCmdOpen] = useState(false);
    const [cmdQuery, setCmdQuery] = useState("");

    const navItems = userRole === "ADMIN" ? adminNavItems : candidateNavItems;
    const allSearchItems = [
        ...navItems,
        ...(userRole !== "ADMIN" ? [{ href: "/profile", label: "Candidate Profile", icon: User }] : []),
    ];

    const filteredCmdItems = allSearchItems.filter((item) =>
        item.label.toLowerCase().includes(cmdQuery.toLowerCase()) ||
        item.href.toLowerCase().includes(cmdQuery.toLowerCase())
    );

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                setCmdOpen((prev) => !prev);
            } else if (e.key === "Escape") {
                setCmdOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <>
            <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-14 gap-4">
                        {/* Left: Brand & Global Quick Jump */}
                        <div className="flex items-center gap-3 shrink-0">
                            <Link
                                href={isLoggedIn ? (userRole === "ADMIN" ? "/admin" : "/dashboard") : "/"}
                                className="flex items-center gap-2 shrink-0 focus:outline-none"
                            >
                                <span className="h-7 w-7 rounded-lg bg-[#4F46E5] text-white flex items-center justify-center font-mono text-[12px] font-bold shadow-xs shrink-0">
                                    &lt;/&gt;
                                </span>
                                <span className="font-display text-[15px] font-semibold tracking-tight text-[#3525CD]">
                                    SkillGap
                                </span>
                            </Link>

                            {/* Quick Command Trigger */}
                            <button
                                type="button"
                                onClick={() => setCmdOpen(true)}
                                title="Quick Jump (Ctrl+K)"
                                className="hidden lg:inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] text-[12px] text-[#64748B] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                            >
                                <Search className="h-3.5 w-3.5 text-[#64748B] shrink-0" />
                                <span className="hidden 2xl:inline">Quick jump</span>
                                <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white border border-[#E2E8F0] text-[#64748B]">
                                    ⌘K
                                </kbd>
                            </button>
                        </div>

                        {/* Center: Horizontal Tab Navigation */}
                        <nav aria-label="Primary Navigation" className="hidden lg:flex items-center gap-0.5 xl:gap-1 h-14 shrink-0">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href || (item.href !== "/admin" && item.href !== "/dashboard" && pathname.startsWith(item.href));
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "relative inline-flex items-center gap-1.5 h-14 px-2 xl:px-2.5 text-[13px] whitespace-nowrap border-b-2 transition-colors shrink-0",
                                            isActive
                                                ? "border-[#4F46E5] text-[#3525CD] font-medium"
                                                : "border-transparent text-[#64748B] hover:text-[#0F172A] font-normal"
                                        )}
                                    >
                                        <span>{item.label}</span>
                                        {item.badge && (
                                            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-[#EAEDFF] text-[#3525CD] border border-[#C7C4D8]/70 font-semibold">
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Right: Status Pill, Profile, Auth */}
                        <div className="flex items-center gap-2 shrink-0">
                            <div className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] text-[11px] font-medium text-[#475569] whitespace-nowrap shrink-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0" />
                                <span className="font-mono">NSQF Ready</span>
                            </div>

                            {isLoggedIn ? (
                                <div className="flex items-center gap-1.5 pl-2 border-l border-[#E2E8F0] shrink-0">
                                    <Link
                                        href={userRole === "ADMIN" ? "/admin" : "/profile"}
                                        className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-[#F1F5F9] transition-colors shrink-0"
                                        title={userName}
                                    >
                                        <span className="w-7 h-7 rounded-lg bg-[#EAEDFF] text-[#3525CD] border border-[#C7C4D8]/70 flex items-center justify-center font-mono text-[11px] font-semibold shrink-0">
                                            {userName.charAt(0).toUpperCase()}
                                        </span>
                                        <div className="hidden xl:flex flex-col text-left">
                                            <span className="text-[12px] font-semibold text-[#0F172A] leading-tight whitespace-nowrap max-w-[140px] truncate">
                                                {userName}
                                            </span>
                                            <span className="text-[10px] font-mono text-[#64748B] leading-tight uppercase">
                                                {userRole}
                                            </span>
                                        </div>
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={onSignOut}
                                        title="Sign Out"
                                        className="inline-flex items-center gap-1 px-2 py-1.5 text-[12px] font-medium text-[#64748B] hover:text-[#BA1A1A] hover:bg-[#FEF2F2] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                                    >
                                        <LogOut className="h-4 w-4 shrink-0" />
                                        <span className="hidden sm:inline">Sign Out</span>
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-lg text-[12px] font-medium shadow-xs transition-all"
                                >
                                    <span>Sign In</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            )}

                            <button
                                type="button"
                                aria-label="Toggle Menu"
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="lg:hidden p-1.5 rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer"
                            >
                                {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Dropdown Drawer */}
                {mobileOpen && (
                    <div className="lg:hidden border-t border-[#E2E8F0] bg-white px-4 py-3 space-y-1 animate-fade-in">
                        <button
                            type="button"
                            onClick={() => {
                                setMobileOpen(false);
                                setCmdOpen(true);
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 mb-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[12px] text-[#64748B]"
                        >
                            <span className="flex items-center gap-2">
                                <Search className="h-3.5 w-3.5" /> Search navigation...
                            </span>
                            <kbd className="font-mono text-[10px]">⌘K</kbd>
                        </button>

                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={cn(
                                        "flex items-center justify-between px-3 py-2 rounded-lg text-[13px] transition-colors",
                                        isActive
                                            ? "bg-[#EAEDFF] text-[#3525CD] font-medium"
                                            : "text-[#0F172A] hover:bg-[#F8FAFC]"
                                    )}
                                >
                                    <span className="flex items-center gap-2.5">
                                        <item.icon className={cn("h-4 w-4", isActive ? "text-[#4F46E5]" : "text-[#64748B]")} />
                                        {item.label}
                                    </span>
                                    {item.badge && (
                                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-[#4F46E5] text-white">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}

                        {userRole !== "ADMIN" && (
                            <Link
                                href="/profile"
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                    "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px]",
                                    pathname === "/profile"
                                        ? "bg-[#EAEDFF] text-[#3525CD] font-medium"
                                        : "text-[#0F172A] hover:bg-[#F8FAFC]"
                                )}
                            >
                                <User className="h-4 w-4 text-[#64748B]" />
                                Candidate Profile
                            </Link>
                        )}

                        <div className="pt-2 mt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[12px] text-[#64748B] px-3">
                            <a
                                href="https://www.skillindiadigital.gov.in"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-[#4F46E5] flex items-center gap-1"
                            >
                                Skill India Digital <ExternalLink className="h-3 w-3" />
                            </a>
                            <a
                                href="https://www.pmkvyofficial.org/find-a-training-centre"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-[#4F46E5] flex items-center gap-1"
                            >
                                <MapPin className="h-3 w-3" /> PMKK Centers
                            </a>
                        </div>
                    </div>
                )}
            </header>

            {/* Quick Command Palette Modal (⌘K) */}
            {cmdOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-[#0F172A]/40 backdrop-blur-[4px] animate-fade-in"
                    onClick={() => setCmdOpen(false)}
                >
                    <div
                        className="w-full max-w-md bg-white border border-[#CBD5E1] rounded-xl shadow-[0_12px_32px_-4px_rgba(15,23,42,0.14)] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center px-3.5 py-2.5 border-b border-[#E2E8F0]">
                            <Search className="h-4 w-4 text-[#64748B] mr-2.5 shrink-0" />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Jump to workspace page (Dashboard, AI Resume, Skill Gap)..."
                                value={cmdQuery}
                                onChange={(e) => setCmdQuery(e.target.value)}
                                className="w-full text-[13px] text-[#0F172A] placeholder:text-[#64748B] focus:outline-none"
                            />
                            <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#F1F5F9] border border-[#E2E8F0] text-[#64748B]">
                                ESC
                            </kbd>
                        </div>
                        <div className="p-2 max-h-72 overflow-y-auto space-y-0.5">
                            {filteredCmdItems.length === 0 ? (
                                <p className="py-6 text-center text-[12px] text-[#64748B]">No matching pages</p>
                            ) : (
                                filteredCmdItems.map((item) => (
                                    <button
                                        key={item.href}
                                        type="button"
                                        onClick={() => {
                                            setCmdOpen(false);
                                            setCmdQuery("");
                                            router.push(item.href);
                                        }}
                                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                                    >
                                        <span className="flex items-center gap-2.5 font-medium">
                                            <item.icon className="h-4 w-4 text-[#4F46E5]" />
                                            {item.label}
                                        </span>
                                        <span className="font-mono text-[11px] text-[#64748B]">{item.href}</span>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export { TopNavbar as Sidebar };
