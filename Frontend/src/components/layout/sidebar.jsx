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

    const lightGlassClass =
        "bg-white/85 backdrop-blur-xl border border-black/[0.09] shadow-[0_10px_28px_-10px_rgba(17,17,19,0.12)]";

    return (
        <>
            {/* Editorial Floating Frosted Pill Workspace Chrome */}
            <header className="sticky top-0 z-40 w-full px-4 sm:px-6 pt-3 sm:pt-4 pointer-events-none">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
                    {/* Left: Brand Pill & ⌘K Trigger */}
                    <div
                        className={cn(
                            "pointer-events-auto flex items-center gap-2 p-1.5 rounded-full shrink-0",
                            lightGlassClass
                        )}
                    >
                        <Link
                            href={isLoggedIn ? (userRole === "ADMIN" ? "/admin" : "/dashboard") : "/"}
                            className="flex items-center gap-2 pl-1 pr-2 focus:outline-none"
                        >
                            <span className="h-6 w-6 rounded-full bg-[#111113] text-white flex items-center justify-center font-mono text-[10px] font-bold shrink-0">
                                &lt;/&gt;
                            </span>
                            <span className="font-display text-[14px] font-semibold tracking-tight text-[#111113]">
                                PMKVY<sup className="font-mono text-[9px] ml-0.5 text-[#4F46E5]">4.0</sup>
                            </span>
                        </Link>

                        <span className="hidden lg:block h-3.5 w-px bg-black/10" />

                        <button
                            type="button"
                            onClick={() => setCmdOpen(true)}
                            title="Quick Jump (Ctrl+K)"
                            className="hidden lg:inline-flex items-center gap-2 h-7 px-3 rounded-full bg-[#F6F5F0] hover:bg-[#EFECE6] text-[11px] text-[#52525B] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                        >
                            <Search className="h-3.5 w-3.5 text-[#52525B] shrink-0" />
                            <kbd className="font-sans font-semibold text-[10.5px] tracking-tight text-[#111113]">⌘ K</kbd>
                        </button>
                    </div>

                    {/* Center: Horizontal Frosted Navigation Pill */}
                    <nav
                        aria-label="Primary Navigation"
                        className={cn(
                            "pointer-events-auto hidden lg:flex items-center gap-0.5 p-1.5 rounded-full shrink-0",
                            lightGlassClass
                        )}
                    >
                        {navItems.map((item) => {
                            const isActive =
                                pathname === item.href ||
                                (item.href !== "/admin" && item.href !== "/dashboard" && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12.5px] whitespace-nowrap transition-all duration-200 shrink-0",
                                        isActive
                                            ? "bg-[#111113] text-white font-medium shadow-xs"
                                            : "text-[#52525B] hover:text-[#111113] hover:bg-black/[0.04]"
                                    )}
                                >
                                    <span>{item.label}</span>
                                    {item.badge && (
                                        <span
                                            className={cn(
                                                "font-mono text-[9.5px] px-1.5 py-0.2 rounded-full font-semibold",
                                                isActive
                                                    ? "bg-[#4F46E5] text-white"
                                                    : "bg-[#EAEDFF] text-[#3525CD]"
                                            )}
                                        >
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right: Status, Candidate Capsule & Auth */}
                    <div
                        className={cn(
                            "pointer-events-auto flex items-center gap-1.5 p-1.5 rounded-full shrink-0",
                            lightGlassClass
                        )}
                    >
                        <div className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[10.5px] font-medium text-[#065F46] whitespace-nowrap shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0" />
                            <span className="font-mono">NSQF</span>
                        </div>

                        {isLoggedIn ? (
                            <div className="flex items-center gap-1 shrink-0">
                                <Link
                                    href={userRole === "ADMIN" ? "/admin" : "/profile"}
                                    className="flex items-center gap-2 pl-1 pr-2 py-0.5 rounded-full hover:bg-black/[0.04] transition-colors shrink-0"
                                    title={userName}
                                >
                                    <span className="w-7 h-7 rounded-full bg-[#111113] text-white flex items-center justify-center font-mono text-[11px] font-semibold shrink-0">
                                        {userName.charAt(0).toUpperCase()}
                                    </span>
                                    <div className="hidden 2xl:flex flex-col text-left">
                                        <span className="text-[12px] font-semibold text-[#111113] leading-tight whitespace-nowrap max-w-[120px] truncate">
                                            {userName}
                                        </span>
                                        <span className="text-[9.5px] font-mono text-[#52525B] leading-tight uppercase">
                                            {userRole}
                                        </span>
                                    </div>
                                </Link>

                                <button
                                    type="button"
                                    onClick={onSignOut}
                                    title="Sign Out"
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[12px] font-medium text-[#52525B] hover:text-[#BA1A1A] hover:bg-[#FEF2F2] rounded-full transition-colors cursor-pointer whitespace-nowrap shrink-0"
                                >
                                    <LogOut className="h-3.5 w-3.5 shrink-0" />
                                    <span className="hidden sm:inline">Sign Out</span>
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                prefetch={false}
                                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#111113] hover:bg-[#27272A] text-white rounded-full text-[12.5px] font-medium transition-all"
                            >
                                <span>Sign In</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        )}

                        <button
                            type="button"
                            aria-label="Toggle Menu"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="lg:hidden p-1.5 rounded-full border border-black/[0.1] bg-white text-[#111113] hover:bg-[#F3F1EC] cursor-pointer"
                        >
                            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Dropdown Drawer */}
                {mobileOpen && (
                    <div className="pointer-events-auto lg:hidden mt-2 mx-auto max-w-md rounded-[22px] border border-black/[0.1] bg-white/95 backdrop-blur-xl px-4 py-3 space-y-1 shadow-[0_24px_48px_-16px_rgba(17,17,19,0.2)] animate-fade-in">
                        <button
                            type="button"
                            onClick={() => {
                                setMobileOpen(false);
                                setCmdOpen(true);
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 mb-2 rounded-xl bg-[#F6F5F0] border border-black/[0.08] text-[12px] text-[#52525B]"
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
                                        "flex items-center justify-between px-3 py-2 rounded-full text-[13px] transition-colors",
                                        isActive
                                            ? "bg-[#111113] text-white font-medium"
                                            : "text-[#111113] hover:bg-[#F6F5F0]"
                                    )}
                                >
                                    <span className="flex items-center gap-2.5">
                                        <item.icon className={cn("h-4 w-4", isActive ? "text-white" : "text-[#52525B]")} />
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
                                    "flex items-center gap-2.5 px-3 py-2 rounded-full text-[13px]",
                                    pathname === "/profile"
                                        ? "bg-[#111113] text-white font-medium"
                                        : "text-[#111113] hover:bg-[#F6F5F0]"
                                )}
                            >
                                <User className="h-4 w-4 text-[#52525B]" />
                                Candidate Profile
                            </Link>
                        )}

                        <div className="pt-2 mt-2 border-t border-black/[0.08] flex items-center justify-between text-[12px] text-[#52525B] px-3">
                            <a
                                href="https://www.skillindiadigital.gov.in"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-[#111113] flex items-center gap-1"
                            >
                                Skill India Digital <ExternalLink className="h-3 w-3" />
                            </a>
                            <a
                                href="https://www.pmkvyofficial.org/find-a-training-centre"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-[#111113] flex items-center gap-1"
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
                    className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-[#111113]/45 backdrop-blur-[6px] animate-fade-in"
                    onClick={() => setCmdOpen(false)}
                >
                    <div
                        className="w-full max-w-md bg-[#FBFBF9] border border-black/[0.1] rounded-[24px] shadow-[0_28px_64px_-20px_rgba(17,17,19,0.28)] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center px-4 py-3 border-b border-black/[0.08]">
                            <Search className="h-4 w-4 text-[#52525B] mr-2.5 shrink-0" />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Jump to workspace page (Dashboard, AI Resume, Skill Gap)..."
                                value={cmdQuery}
                                onChange={(e) => setCmdQuery(e.target.value)}
                                className="w-full bg-transparent text-[13px] text-[#111113] placeholder:text-[#71717A] focus:outline-none"
                            />
                            <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-[#EFECE6] text-[#52525B]">
                                ESC
                            </kbd>
                        </div>
                        <div className="p-2 max-h-72 overflow-y-auto space-y-0.5">
                            {filteredCmdItems.length === 0 ? (
                                <p className="py-6 text-center text-[12px] text-[#52525B]">No matching pages</p>
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
                                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] text-[#111113] hover:bg-black/[0.05] transition-colors cursor-pointer"
                                    >
                                        <span className="flex items-center gap-2.5 font-medium">
                                            <item.icon className="h-4 w-4 text-[#4F46E5]" />
                                            {item.label}
                                        </span>
                                        <span className="font-mono text-[11px] text-[#52525B]">{item.href}</span>
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
