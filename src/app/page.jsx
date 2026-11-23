import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, Target, BarChart3, BookOpen, Compass, TrendingUp, ArrowRight, Sparkles, Search, FileCheck, ChevronRight, } from "lucide-react";
const features = [
    {
        icon: Sparkles,
        title: "AI Resume & Job Match",
        description: "Upload your CV or paste any live job listing from LinkedIn or Indeed. Our AI matches competencies against National Occupational Standards in seconds.",
    },
    {
        icon: Target,
        title: "Precision Skill Assessment",
        description: "Benchmark your technical depth and workplace competencies with structured assessments aligned with official Qualification Packs (QP-NOS).",
    },
    {
        icon: BarChart3,
        title: "Instant Gap Diagnostics",
        description: "Identify the exact proficiency gap between your current background and target job requirements with clean, data-driven visual indicators.",
    },
    {
        icon: BookOpen,
        title: "PMKVY Bridge Courses",
        description: "Receive personalized training recommendations from government-subsidized PMKVY 4.0 centers to rapidly close qualification gaps.",
    },
    {
        icon: Compass,
        title: "Career Path Mapping",
        description: "Explore vertical and lateral career transitions with transparent qualification milestones, salary trajectories, and NSQF levels.",
    },
    {
        icon: TrendingUp,
        title: "Verified Skill Credentials",
        description: "Track your learning milestones in real time and prepare for Skill India Digital and NSDC national certifications.",
    },
];
const domains = [
    { name: "Web & Software Engineering", tag: "IT-ITeS SSC", count: "18 Roles" },
    { name: "Data Science & AI", tag: "NASSCOM", count: "12 Roles" },
    { name: "Electric Vehicle Technology", tag: "ASDC", count: "9 Roles" },
    { name: "Cloud & Cybersecurity", tag: "IT-ITeS SSC", count: "14 Roles" },
    { name: "Electronics & Smart Hardware", tag: "ESSCI", count: "11 Roles" },
    { name: "Renewable Energy & Solar", tag: "SCGJ", count: "8 Roles" },
    { name: "Digital Marketing & Analytics", tag: "Media & Ent.", count: "10 Roles" },
    { name: "Advanced Manufacturing", tag: "CGSC", count: "15 Roles" },
];
const steps = [
    {
        step: "01",
        title: "Upload Resume or Job Link",
        description: "Provide your CV or paste a URL from LinkedIn. Our AI extracts core technical proficiencies.",
    },
    {
        step: "02",
        title: "AI Skill Gap Diagnostics",
        description: "Benchmark your background against industry QP-NOS standards to spot critical competency gaps.",
    },
    {
        step: "03",
        title: "Enrol in PMKVY Courses",
        description: "Access curated, subsidized training programs aligned with national skill development goals.",
    },
    {
        step: "04",
        title: "Get Certified & Placed",
        description: "Gain recognized NSQF credentials and fast-track interviews with hiring enterprise partners.",
    },
];
export default function LandingPage() {
    return (<div className="min-h-screen bg-white text-[#1d1d1f] font-sans antialiased selection:bg-[#0071e3]/10 selection:text-[#0071e3]">
      {/* Apple HomeView Restrained Navigation Chrome */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-[#e5e7eb] z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0071e3] text-white">
                <GraduationCap className="h-4 w-4"/>
              </div>
              <span className="text-[15px] font-semibold tracking-tight text-[#1d1d1f]">
                PMKVY Skill Portal
              </span>
            </Link>

            {/* Editorial Nav Links */}
            <div className="hidden md:flex items-center gap-7 text-[13px] font-normal text-[#1d1d1f]/80">
              <Link href="/login?callbackUrl=/resume-analyser" className="hover:text-[#0071e3] transition-colors">
                AI Resume Matcher
              </Link>
              <Link href="/login?callbackUrl=/skill-gap" className="hover:text-[#0071e3] transition-colors">
                Skill Gap
              </Link>
              <Link href="/login?callbackUrl=/courses" className="hover:text-[#0071e3] transition-colors">
                PMKVY Courses
              </Link>
              <Link href="/login?callbackUrl=/career-path" className="hover:text-[#0071e3] transition-colors">
                Career Path
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-[13px] text-[#1d1d1f] hover:bg-[#f5f5f7] h-[36px] px-3.5">
                  Sign In
                </Button>
              </Link>
              <Link href="/login">
                <Button size="sm" className="bg-[#0071e3] hover:bg-[#0077ed] text-white text-[13px] font-medium h-[36px] px-4 rounded-full shadow-none">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section: Apple HomeView Spacious Typography & Product-First Storytelling */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          {/* Subdued Editorial Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f5f5f7] border border-[#e5e7eb] text-[12px] font-medium text-[#1d1d1f] mb-8">
            <span className="w-2 h-2 rounded-full bg-[#0071e3]"/>
            <span>PMKVY 4.0 Skill Intelligence System</span>
          </div>

          {/* Headline Display */}
          <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-bold text-[#1d1d1f] tracking-tight leading-[1.08] mb-6">
            Skill Intelligence.
            <br />
            <span className="text-[#0071e3]">Built for your ambition.</span>
          </h1>

          {/* Subtitle Body-LG */}
          <p className="text-lg sm:text-[21px] text-[#86868b] max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
            Upload your resume or paste a job listing from LinkedIn. Benchmark your proficiencies
            against official National Occupational Standards and discover your PMKVY bridge courses.
          </p>

          {/* Action Pills */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-16">
            <Link href="/login?callbackUrl=/resume-analyser">
              <Button size="lg" className="bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium text-[16px] h-[48px] px-7 rounded-full shadow-none">
                <span>Analyze Resume with AI</span>
                <ArrowRight className="h-4 w-4 ml-1.5"/>
              </Button>
            </Link>
            <Link href="/login?callbackUrl=/courses">
              <Button variant="secondary" size="lg" className="text-[#0071e3] border border-[#0071e3] hover:bg-[#0071e3]/5 font-medium text-[16px] h-[48px] px-7 rounded-full">
                Browse PMKVY Courses
              </Button>
            </Link>
          </div>
        </div>

        {/* Product Preview Card: Minimal Restrained Chrome with Live UI Storytelling */}
        <div className="max-w-5xl mx-auto mt-4 px-2 sm:px-6">
          <div className="rounded-3xl border border-[#e5e7eb] bg-[#f5f5f7] p-3 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
            {/* macOS Chrome Header */}
            <div className="flex items-center justify-between pb-3.5 px-3 border-b border-[#e5e7eb] mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff5f56]"/>
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e]"/>
                <span className="w-3 h-3 rounded-full bg-[#27c93f]"/>
              </div>
              <div className="text-[12px] font-medium text-[#86868b] bg-white px-4 py-1 rounded-full border border-[#e5e7eb]">
                app.pmkvy.gov.in/resume-analyser
              </div>
              <div className="text-[11px] text-[#86868b] font-medium">Apple HomeView UI</div>
            </div>

            {/* Inner Interactive Mockup Screen */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white rounded-2xl p-5 sm:p-7 border border-[#e5e7eb]">
              {/* Left Column: Input Options */}
              <div className="md:col-span-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-[#1d1d1f]">Candidate Input</span>
                  <span className="text-[11px] font-medium text-[#34c759] bg-[#34c759]/10 px-2 py-0.5 rounded-full">
                    Live Diagnostic
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-[#e5e7eb] bg-[#f5f5f7]/60 space-y-2">
                  <div className="flex items-center gap-2 text-[13px] font-medium text-[#1d1d1f]">
                    <FileCheck className="h-4 w-4 text-[#0071e3]"/>
                    <span>Candidate_Resume.pdf</span>
                  </div>
                  <p className="text-[12px] text-[#86868b]">
                    Arun Kumar • Jr. Full Stack Developer (1.5 yrs experience in React, Node.js)
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-[#0071e3]/30 bg-[#0071e3]/5 space-y-1.5">
                  <div className="flex items-center justify-between text-[13px] font-medium text-[#0071e3]">
                    <span className="flex items-center gap-1.5">
                      <Search className="h-3.5 w-3.5"/>
                      Target Role
                    </span>
                    <span className="text-[11px] font-semibold text-[#0071e3]">QP-NOS Aligned</span>
                  </div>
                  <p className="text-[13px] font-medium text-[#1d1d1f]">
                    Senior Cloud Applications Engineer (NSQF Level 6)
                  </p>
                </div>

                <Link href="/login?callbackUrl=/resume-analyser" className="block text-center rounded-full bg-[#0071e3] text-white text-[13px] font-medium py-2.5 hover:bg-[#0077ed] transition-colors">
                  Run Instant Diagnostic →
                </Link>
              </div>

              {/* Right Column: AI Competency Results Preview */}
              <div className="md:col-span-7 border-t md:border-t-0 md:border-l border-[#e5e7eb] pt-4 md:pt-0 md:pl-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-[15px] font-semibold text-[#1d1d1f]">Competency Breakdown</h4>
                    <p className="text-[12px] text-[#86868b]">Matched against SSC NASSCOM QP/N8102</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-[#0071e3]">84%</span>
                    <p className="text-[11px] text-[#34c759] font-medium">Readiness Score</p>
                  </div>
                </div>

                {/* Skill Bars */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[12px] font-medium mb-1">
                      <span className="text-[#1d1d1f]">React & Frontend Engineering</span>
                      <span className="text-[#34c759]">92% Match</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#f5f5f7] rounded-full overflow-hidden">
                      <div className="h-full bg-[#34c759] rounded-full" style={{ width: "92%" }}/>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[12px] font-medium mb-1">
                      <span className="text-[#1d1d1f]">Docker & Containerized Microservices</span>
                      <span className="text-[#ff3b30]">Skill Gap (Critical)</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#f5f5f7] rounded-full overflow-hidden">
                      <div className="h-full bg-[#ff3b30] rounded-full" style={{ width: "35%" }}/>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[12px] font-medium mb-1">
                      <span className="text-[#1d1d1f]">Cloud Infrastructure (AWS / Azure)</span>
                      <span className="text-[#0071e3]">Partial Gap</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#f5f5f7] rounded-full overflow-hidden">
                      <div className="h-full bg-[#0071e3] rounded-full" style={{ width: "60%" }}/>
                    </div>
                  </div>
                </div>

                {/* Recommended Bridge Course Chip */}
                <div className="p-3 rounded-xl bg-[#f5f5f7] border border-[#e5e7eb] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#0071e3]/10 text-[#0071e3] flex items-center justify-center font-bold text-xs">
                      PMKVY
                    </div>
                    <div>
                      <p className="text-[12px] font-medium text-[#1d1d1f]">
                        Cloud Architecture & Containerization
                      </p>
                      <p className="text-[11px] text-[#86868b]">30 Hours • 100% Subsidized • NSQF Level 6</p>
                    </div>
                  </div>
                  <span className="text-[12px] font-semibold text-[#0071e3] hover:underline cursor-pointer">
                    View Center
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: How It Works (Apple Spacious Steps) */}
      <section className="py-24 sm:py-32 px-4 bg-[#f5f5f7] border-y border-[#e5e7eb]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#1d1d1f] tracking-tight mb-3">
              Precision in four simple steps.
            </h2>
            <p className="text-[#86868b] text-[17px] max-w-xl mx-auto leading-relaxed">
              Designed from the ground up for transparent skill diagnostics and career acceleration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((item) => (<div key={item.step} className="bg-white rounded-2xl p-6 border border-[#e5e7eb] text-left transition-all hover:border-[#0071e3]/40">
                <div className="text-[13px] font-semibold text-[#0071e3] mb-3">{item.step}</div>
                <h3 className="text-[16px] font-semibold text-[#1d1d1f] mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-[13px] text-[#86868b] leading-relaxed">{item.description}</p>
              </div>))}
          </div>
        </div>
      </section>

      {/* Section 3: Platform Features */}
      <section className="py-24 sm:py-32 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#1d1d1f] tracking-tight mb-3">
              Engineered for real industry outcomes.
            </h2>
            <p className="text-[#86868b] text-[17px] max-w-xl mx-auto leading-relaxed">
              Every diagnostic module is built on official government-approved skill frameworks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (<div key={feature.title} className="p-7 rounded-2xl bg-white border border-[#e5e7eb] hover:border-[#0071e3]/40 transition-colors">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#f5f5f7] text-[#0071e3] mb-5">
                  <feature.icon className="h-5 w-5"/>
                </div>
                <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-2">{feature.title}</h3>
                <p className="text-[14px] text-[#86868b] leading-relaxed">{feature.description}</p>
              </div>))}
          </div>
        </div>
      </section>

      {/* Section 4: High Demand Career Domains */}
      <section className="py-24 sm:py-32 px-4 bg-[#f5f5f7] border-y border-[#e5e7eb]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#1d1d1f] tracking-tight mb-3">
              Aligned with National Sector Skill Councils.
            </h2>
            <p className="text-[#86868b] text-[17px] max-w-xl mx-auto leading-relaxed">
              Explore job qualification standards curated directly with leading industry bodies.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {domains.map((domain) => (<div key={domain.name} className="p-5 rounded-2xl bg-white border border-[#e5e7eb] flex flex-col justify-between hover:border-[#0071e3]/30 transition-colors">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0071e3] bg-[#0071e3]/10 px-2 py-0.5 rounded-full inline-block mb-3">
                    {domain.tag}
                  </span>
                  <h4 className="text-[15px] font-semibold text-[#1d1d1f] leading-snug">
                    {domain.name}
                  </h4>
                </div>
                <div className="mt-4 pt-3 border-t border-[#f5f5f7] text-[12px] text-[#86868b] flex justify-between items-center">
                  <span>{domain.count}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-[#86868b]"/>
                </div>
              </div>))}
          </div>
        </div>
      </section>

      {/* Section 5: Editorial Call to Action */}
      <section className="py-24 sm:py-32 px-4 bg-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-semibold text-[#1d1d1f] tracking-tight mb-4">
            Start your skill diagnostic today.
          </h2>
          <p className="text-[17px] text-[#86868b] max-w-xl mx-auto mb-8 leading-relaxed">
            Join candidates across India transforming their resumes with certified NSQF competencies.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link href="/login?callbackUrl=/resume-analyser">
              <Button size="lg" className="bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium text-[16px] h-[48px] px-8 rounded-full shadow-none">
                <span>Launch AI Analyser</span>
                <ArrowRight className="h-4 w-4 ml-1.5"/>
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="text-[#1d1d1f] border border-[#d2d2d7] hover:bg-[#f5f5f7] font-medium text-[16px] h-[48px] px-8 rounded-full">
                Sign In to Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Apple HomeView Restrained Footer */}
      <footer className="py-14 px-4 bg-[#f5f5f7] border-t border-[#e5e7eb] text-[12px] text-[#86868b]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h5 className="font-semibold text-[#1d1d1f] mb-3">AI Diagnostic</h5>
              <ul className="space-y-2">
                <li>
                  <Link href="/login?callbackUrl=/resume-analyser" className="hover:text-[#0071e3] transition-colors">
                    Resume Upload
                  </Link>
                </li>
                <li>
                  <Link href="/login?callbackUrl=/resume-analyser" className="hover:text-[#0071e3] transition-colors">
                    Live Job Matching
                  </Link>
                </li>
                <li>
                  <Link href="/login?callbackUrl=/skill-gap" className="hover:text-[#0071e3] transition-colors">
                    Skill Gap Indicators
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold text-[#1d1d1f] mb-3">PMKVY 4.0</h5>
              <ul className="space-y-2">
                <li>
                  <Link href="/login?callbackUrl=/courses" className="hover:text-[#0071e3] transition-colors">
                    Short Term Training (STT)
                  </Link>
                </li>
                <li>
                  <Link href="/login?callbackUrl=/courses" className="hover:text-[#0071e3] transition-colors">
                    Recognition of Prior Learning (RPL)
                  </Link>
                </li>
                <li>
                  <Link href="/login?callbackUrl=/courses" className="hover:text-[#0071e3] transition-colors">
                    Special Projects
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold text-[#1d1d1f] mb-3">Official Links</h5>
              <ul className="space-y-2">
                <li>
                  <a href="https://www.skillindiadigital.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-[#0071e3] transition-colors">
                    Skill India Digital
                  </a>
                </li>
                <li>
                  <a href="https://www.pmkvyofficial.org" target="_blank" rel="noopener noreferrer" className="hover:text-[#0071e3] transition-colors">
                    MSDE Guidelines
                  </a>
                </li>
                <li>
                  <a href="https://nsdcindia.org" target="_blank" rel="noopener noreferrer" className="hover:text-[#0071e3] transition-colors">
                    NSDC Portal
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold text-[#1d1d1f] mb-3">Candidate Account</h5>
              <ul className="space-y-2">
                <li>
                  <Link href="/login" className="hover:text-[#0071e3] transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-[#0071e3] transition-colors">
                    Register New Account
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-[#e5e7eb] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p suppressHydrationWarning>
              Copyright &copy; {new Date().getFullYear()} Ministry of Skill Development & Entrepreneurship (PMKVY 4.0).
            </p>
            <p className="text-[11px] text-[#86868b]">Apple HomeView Design System Applied</p>
          </div>
        </div>
      </footer>
    </div>);
}
