"use client";
// [FRONTEND] Dual AI Resume Analyser (QP-NOS & Job Link/JD) | Route: /resume-analyser | Uses: GET/POST /api/ai-resume-analyser, POST /api/ai-resume-analyser/save, document-parser.js, auth-context.jsx
import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api";
import { Sparkles, Upload, Link as LinkIcon, FileText, CheckCircle2, AlertTriangle, XCircle, ExternalLink, BookOpen, ArrowRight, Brain, ShieldCheck, RefreshCw, Download, Search, Eye, Info, Building2, Printer, Check, } from "lucide-react";
import { extractTextFromFile } from "@/lib/document-parser";
// Sector Skill Councils registered under MSDE
const SECTOR_SKILL_COUNCILS = [
    { id: "nasscom", name: "IT-ITeS Sector Skills Council (NASSCOM)", domain: "Web Development" },
    { id: "asdc", name: "Automotive Skills Development Council (ASDC)", domain: "Electric Vehicle Technology" },
    { id: "essci", name: "Electronics & Hardware Sector Skills Council (ESSCI)", domain: "Electronics" },
    { id: "scgj", name: "Skill Council for Green Jobs (SCGJ)", domain: "Renewable Energy" },
];
// High-Demand Pre-seeded Sample Resumes for 1-Click Testing
const SAMPLE_RESUMES = {
    fullstack: {
        label: "Arun Kumar • Jr. Full Stack Developer (1.5 yrs exp)",
        role: "Full Stack Developer",
        domain: "Web Development",
        text: `ARUN KUMAR
Email: arun.kumar@example.com | Mobile: +91 9876543210
Location: Bengaluru, Karnataka

SUMMARY:
Passionate Junior Web Developer with 1.5 years of experience developing responsive client interfaces and RESTful APIs using React.js, JavaScript (ES6+), and Node.js. Eager to advance my career into full-stack cloud enterprise architecture.

TECHNICAL SKILLS:
- Frontend: HTML5 & Modern CSS, Flexbox, Tailwind CSS, JavaScript (ES6+), React.js, Next.js, Redux
- Backend: Node.js & Express, RESTful APIs, basic JWT authentication
- Databases: SQL (MySQL, PostgreSQL queries and joins)
- Tools & Version Control: Git, GitHub, VS Code, Postman
- Soft Skills: Team collaboration, problem-solving, agile sprints

EXPERIENCE:
Junior Web Developer | Innovate Web Solutions (July 2023 - Present)
- Developed responsive dashboard interfaces in React.js and Tailwind CSS for 4 client web applications.
- Built 12+ REST API endpoints using Node.js and Express with MySQL integration.
- Optimized frontend rendering and reduced bundle size by 18%.

EDUCATION:
B.Tech in Computer Science & Engineering | VTU Karnataka (2019 - 2023) - 78% Aggregate`,
    },
    ev_tech: {
        label: "Aaditya Verma • ITI Electrician & EV Service Tech (2 yrs exp)",
        role: "Electric Vehicle Specialist",
        domain: "Electric Vehicle Technology",
        text: `AADITYA VERMA
Email: aaditya.verma@example.com | Mobile: +91 9811223344
Location: Pune, Maharashtra

PROFESSIONAL SUMMARY:
Certified ITI Electrician with 2 years practical experience in automotive maintenance, high voltage battery pack assembly, and basic vehicle diagnostics. Seeking NSQF Level 5 certification as an EV Powertrain & Battery Diagnostics Specialist.

TECHNICAL SKILLS & APPARATUS:
- Electrical Safety: High Voltage EV Safety, NFPA 79 basics, PPE protocols, lockout-tagout (LOTO)
- Automotive: Basic multimeter diagnostics, wiring harness inspection, lead-acid & lithium-ion handling
- Diagnostics: OBD-II error code scanning, basic CAN Bus continuity checks
- Mechanical: Battery pack enclosure mounting, torque wrench calibration

EXPERIENCE:
Automotive Electrical Technician | GreenMobility Service Center (2022 - Present)
- Conducted pre-delivery inspection on 120+ electric 2-wheelers and 3-wheelers.
- Executed high voltage disconnect and safety isolation protocols prior to battery servicing.
- Scanned OBD-II fault logs and coordinated replacement of faulty wiring harnesses.

EDUCATION & CERTIFICATIONS:
- ITI Electrician Trade Certificate | State Council for Vocational Training (SCVT Maharashtra)
- 10th Standard Matriculation | Maharashtra State Board (First Class)`,
    },
    data_analyst: {
        label: "Priya Sharma • Data Analyst Fresher (Python & SQL)",
        role: "Data Scientist",
        domain: "Data Science",
        text: `PRIYA SHARMA
Email: priya.sharma@example.com | Mobile: +91 9723456789
Location: Ahmedabad, Gujarat

SUMMARY:
Recent graduate with strong foundational knowledge in statistical analysis, Python data manipulation, SQL query optimization, and interactive dashboard creation in Tableau.

TECHNICAL EXPERTISE:
- Programming: Python for Data Analysis (NumPy, Pandas, Matplotlib, Seaborn)
- Databases: SQL & Relational Databases (PostgreSQL, MySQL complex queries, aggregations, CTEs)
- BI & Visualization: Tableau, PowerBI dashboard reports, Microsoft Excel (VLOOKUP, Pivot Tables)
- Statistics: Hypothesis testing, descriptive statistics, probability distributions

PROJECTS:
- Retail Sales Performance Dashboard: Extracted and cleaned 50,000 transaction rows using Python Pandas; developed an interactive Tableau dashboard tracking monthly revenue metrics.
- Customer Churn Predictive Analysis: Cleaned categorical customer survey datasets; implemented basic logistic regression model in Python.

EDUCATION:
B.Sc in Statistics & Computer Applications | Gujarat University (2021 - 2024) - CGPA 8.4`,
    },
};
// Sample LinkedIn Job Postings
const SAMPLE_LINKEDIN_JOBS = {
    frontend_fintech: {
        label: "Senior Frontend Engineer @ FinTech India",
        url: "https://www.linkedin.com/jobs/view/3982104928",
        description: `Senior React & Frontend Engineer - PayTech India
Location: Bengaluru (Hybrid) | Full-time | Experience: 3-5 Years

About The Role:
We are looking for an exceptional Frontend Engineer to build high-scale financial trading dashboards.

Required Technical Skills:
- Advanced React.js & Next.js with Server Components
- TypeScript strict typing, generics, and state architecture
- High-performance HTML5, Modern CSS, Tailwind CSS
- Node.js & Express for micro-frontends and BFF layer
- SQL & Relational Databases for query troubleshooting
- CI/CD Pipeline Automation with Docker containerization
- High degree of web security and OWASP compliance

Qualifications:
- Bachelor's in CS, IT, or equivalent vocational credential
- Proven track record delivering responsive web apps`,
    },
    ev_powertrain: {
        label: "EV Diagnostics & Battery Engineer @ AutoTech",
        url: "https://www.linkedin.com/jobs/view/4102941829",
        description: `Electric Vehicle Diagnostics & Battery Engineer - AutoTech Mobility
Location: Pune / Chennai | Experience: 2-4 Years

Job Overview:
Diagnose, calibrate, and troubleshoot high-voltage electric vehicle powertrains and lithium-ion Battery Management Systems (BMS).

Key Competencies Required:
- High Voltage EV Safety & ISO 6469 compliance
- Advanced Battery Management Systems (BMS) telemetry
- J1939 CAN Bus Protocol Sniffing with logic analyzers
- Thermal Runaway Mitigation & liquid cooling diagnostics
- Predictive battery degradation algorithms (SoC / SoH)
- EV Powertrain & Motor Drives inspection

Qualifications:
- Diploma in Electrical / Automobile Engineering or NSQF Level 5 Trade Certification
- Hands-on experience with diagnostic software tools`,
    },
};
export default function AIResumeAnalyserPage() {
    const { data: session } = useSession();
    const fileInputRef = useRef(null);
    // Input Mode & Text States
    const [targetMode, setTargetMode] = useState("QP_NOS");
    const [resumeText, setResumeText] = useState("");
    const [uploadedFileMeta, setUploadedFileMeta] = useState(null);
    const [showTextPreview, setShowTextPreview] = useState(false);
    const [fileParseWarning, setFileParseWarning] = useState(null);
    // Target QP-NOS States
    const [jobRoles, setJobRoles] = useState([]);
    const [selectedJobRoleId, setSelectedJobRoleId] = useState("");
    const [selectedDomain, setSelectedDomain] = useState("Web Development");
    const [selectedNsqfLevel, setSelectedNsqfLevel] = useState("NSQF Level 5");
    // Target LinkedIn States
    const [linkedinUrl, setLinkedinUrl] = useState("");
    const [jobDescriptionText, setJobDescriptionText] = useState("");
    // Diagnostic State Machine
    const [analyzing, setAnalyzing] = useState(false);
    const [diagnosticResult, setDiagnosticResult] = useState(null);
    const [activeMatrixTab, setActiveMatrixTab] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    // In-app Notifications
    const [notification, setNotification] = useState(null);
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileSaved, setProfileSaved] = useState(false);
    const [enrollModalCourse, setEnrollModalCourse] = useState(null);
    // Google Gemini Generative AI Key State (uses shared server key automatically)
    const [serverAiConfigured, setServerAiConfigured] = useState(true);
    const [geminiApiKey, setGeminiApiKey] = useState("");
    const [showApiSettings, setShowApiSettings] = useState(false);
    const [tempApiKey, setTempApiKey] = useState("");
    const [showKeyText, setShowKeyText] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const modeParam = (params.get("mode") || "").toLowerCase();
            if (modeParam === "job-link" || modeParam === "url" || modeParam === "linkedin") {
                setTargetMode("LINKEDIN");
            }
            const saved = localStorage.getItem("pmkvy_gemini_key") || "";
            if (saved) {
                setGeminiApiKey(saved);
                setTempApiKey(saved);
            }
        }
    }, []);

    const saveGeminiKey = (keyToSave) => {
        const clean = (keyToSave || "").trim();
        setGeminiApiKey(clean);
        setTempApiKey(clean);
        if (typeof window !== "undefined") {
            if (clean) {
                localStorage.setItem("pmkvy_gemini_key", clean);
            } else {
                localStorage.removeItem("pmkvy_gemini_key");
            }
        }
        setShowApiSettings(false);
        setNotification({
            type: "success",
            message: clean
                ? "✨ Google Gemini API Key saved! Live generative AI resume analysis enabled."
                : "Google Gemini API key removed. Using offline PMKVY NSQF engine.",
        });
    };
    // Load Public QP-NOS Job Roles & AI status from API
    useEffect(() => {
        async function loadJobRoles() {
            try {
                const res = await apiFetch("/api/ai-resume-analyser");
                if (res.ok) {
                    const data = await res.json();
                    if (typeof data.aiConfigured === "boolean") {
                        setServerAiConfigured(data.aiConfigured);
                    }
                    if (data.jobRoles && data.jobRoles.length > 0) {
                        setJobRoles(data.jobRoles);
                        setSelectedJobRoleId(data.jobRoles[0].id);
                    }
                }
            }
            catch (e) {
                console.error("Failed to load standard job roles:", e);
            }
        }
        loadJobRoles();
    }, []);
    // Handle Drag & Drop / File Input with Robust Parser
    const handleFileSelection = async (file) => {
        setFileParseWarning(null);
        setNotification(null);
        const result = await extractTextFromFile(file);
        if (result.success && result.text) {
            setResumeText(result.text);
            setUploadedFileMeta({
                name: result.fileName,
                size: result.fileSizeFormatted,
                wordCount: result.wordCount,
                charCount: result.characterCount,
            });
            if (result.warning) {
                setFileParseWarning(result.warning);
            }
        }
        else {
            setFileParseWarning(result.warning || "Could not read text from this file.");
            if (result.text) {
                setResumeText(result.text);
            }
        }
    };
    const handleFileInputChange = (e) => {
        const file = e.target.files?.[0];
        if (file)
            handleFileSelection(file);
    };
    // 1-Click Load Sample Resume
    const loadSampleResume = (key) => {
        const sample = SAMPLE_RESUMES[key];
        setResumeText(sample.text);
        setUploadedFileMeta({
            name: `${sample.role.replace(/\s+/g, "_")}_Sample_Resume.txt`,
            size: "2.4 KB",
            wordCount: sample.text.split(/\s+/).length,
            charCount: sample.text.length,
        });
        setSelectedDomain(sample.domain);
        setFileParseWarning(null);
        setNotification(null);
        const matchingRole = jobRoles.find((r) => r.title.toLowerCase().includes(sample.role.toLowerCase()));
        if (matchingRole) {
            setSelectedJobRoleId(matchingRole.id);
        }
    };
    // 1-Click Load Sample LinkedIn Job
    const loadSampleLinkedInJob = (key) => {
        const job = SAMPLE_LINKEDIN_JOBS[key];
        setLinkedinUrl(job.url);
        setJobDescriptionText(job.description);
        setNotification(null);
    };
    // Clear inputs
    const resetInputs = () => {
        setResumeText("");
        setUploadedFileMeta(null);
        setDiagnosticResult(null);
        setFileParseWarning(null);
        setNotification(null);
        setLinkedinUrl("");
        setJobDescriptionText("");
        if (fileInputRef.current)
            fileInputRef.current.value = "";
    };
    // Run Real Diagnostic Engine
    const runDiagnostic = async () => {
        if (!resumeText.trim() || resumeText.trim().length < 25) {
            setNotification({
                type: "error",
                message: "Please upload a resume file or paste your resume text before running the diagnostic.",
            });
            return;
        }
        if (targetMode === "LINKEDIN" && !linkedinUrl.trim() && !jobDescriptionText.trim()) {
            setNotification({
                type: "error",
                message: "Please paste a job posting link or job description to evaluate against your resume.",
            });
            return;
        }
        setAnalyzing(true);
        setNotification(null);
        setProfileSaved(false);
        try {
            const response = await apiFetch("/api/ai-resume-analyser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resumeText,
                    targetMode,
                    jobRoleId: targetMode === "QP_NOS" ? selectedJobRoleId : undefined,
                    linkedinUrl: targetMode === "LINKEDIN" ? linkedinUrl : undefined,
                    jobDescriptionText: targetMode === "LINKEDIN" ? jobDescriptionText : undefined,
                    domain: selectedDomain,
                    apiKey: geminiApiKey || undefined,
                }),
            });
            const data = await response.json();
            if (response.ok && data.success && data.diagnostic) {
                setDiagnosticResult(data.diagnostic);
            }
            else {
                setNotification({
                    type: "error",
                    message: data.error || "Diagnostic processing failed. Please verify the input text.",
                });
            }
        }
        catch (error) {
            setNotification({
                type: "error",
                message: `Network error: ${error.message || "Failed to contact diagnostic server."}`,
            });
        }
        finally {
            setAnalyzing(false);
        }
    };
    // Sync Diagnostic to Candidate Profile
    const syncToProfile = async () => {
        if (!diagnosticResult)
            return;
        setSavingProfile(true);
        setNotification(null);
        try {
            const res = await apiFetch("/api/ai-resume-analyser/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userEmail: session?.user?.email,
                    jobRoleId: targetMode === "QP_NOS" ? selectedJobRoleId : undefined,
                    jobTitle: diagnosticResult.targetJobTitle,
                    matchPercentage: diagnosticResult.matchPercentage,
                    skillsEvaluated: diagnosticResult.skillsMatrix,
                }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setProfileSaved(true);
                setNotification({
                    type: "success",
                    message: "Assessment saved successfully to your candidate profile and Skill Passport.",
                });
            }
            else {
                setNotification({
                    type: "error",
                    message: data.error || "Failed to synchronize assessment with candidate database.",
                });
            }
        }
        catch (e) {
            setNotification({
                type: "error",
                message: `Sync error: ${e.message}`,
            });
        }
        finally {
            setSavingProfile(false);
        }
    };
    // Filter skills in matrix
    const filteredSkills = (diagnosticResult?.skillsMatrix || []).filter((item) => {
        const matchesQuery = item.skillName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.nosCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.resumeEvidence.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesQuery)
            return false;
        if (activeMatrixTab === "ALL")
            return true;
        if (activeMatrixTab === "MATCHED")
            return item.status === "MATCHED";
        if (activeMatrixTab === "CRITICAL")
            return item.status === "CRITICAL_GAP";
        if (activeMatrixTab === "ENHANCEMENT")
            return item.status === "ENHANCEMENT_NEEDED";
        return true;
    });
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-fade-in">
          {/* Breadcrumb & Header Strip (PrepP Style) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[12px] font-mono text-[#64748B]">
              <a href="/dashboard" className="hover:text-[#4F46E5] transition-colors">
                Dashboard
              </a>
              <span className="text-[#CBD5E1]">/</span>
              <span className="text-[#0F172A] font-medium">AI Resume &amp; Job Matcher</span>
            </nav>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] text-[12px] font-medium">
                <Sparkles className="h-3.5 w-3.5 text-[#10B981]" />
                <span>
                  {serverAiConfigured
                    ? "Gemini AI Ready (Shared Platform Key)"
                    : "Local NOS Engine Ready"}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Printer className="h-3.5 w-3.5 text-[#64748B]" />
                <span>Print Audit</span>
              </Button>
            </div>
          </div>

          {/* Page Title Banner */}
          <div className="prepp-card p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-[#EAEDFF] text-[#3525CD] border border-[#C7C4D8]">
                    AI Diagnostic Engine
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                    QP-NOS &amp; Job Link Supported
                  </span>
                </div>
                <h1 className="font-display text-2xl sm:text-[28px] font-semibold text-[#0F172A] tracking-tight">
                  AI Resume &amp; Industry Job Matcher
                </h1>
                <p className="text-[14px] text-[#64748B] max-w-3xl leading-relaxed">
                  Benchmark your CV against National Occupational Standards (QP-NOS job roles) or any live job posting URL using Google Gemini AI, and discover free PMKVY courses.
                </p>
              </div>
            </div>
          </div>

          {/* In-App Notification Banner */}
          {notification && (
            <div
              className={`p-3.5 rounded-lg border flex items-start justify-between gap-3 text-[13px] ${
                notification.type === "error"
                  ? "bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]"
                  : notification.type === "success"
                  ? "bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]"
                  : "bg-[#F2F3FF] border-[#C7C4D8] text-[#3525CD]"
              }`}
            >
              <div className="flex items-start gap-2">
                {notification.type === "error" ? (
                  <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
                ) : notification.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                ) : (
                  <Info className="h-4 w-4 shrink-0 mt-0.5" />
                )}
                <span className="font-medium">{notification.message}</span>
              </div>
              <button onClick={() => setNotification(null)} className="text-xs font-semibold hover:opacity-75 cursor-pointer">
                ✕
              </button>
            </div>
          )}

          {/* Split-Screen Workbench (5 cols Target + 7 cols Resume) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Target Job Benchmark Column */}
            <div className="lg:col-span-5 prepp-card p-5 sm:p-6 flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#EAEDFF] text-[#3525CD] flex items-center justify-center">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="font-display text-[15px] font-semibold text-[#0F172A]">Target Job Benchmark</h2>
                      <p className="text-[12px] text-[#64748B]">Choose QP-NOS or corporate JD</p>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#F1F5F9] border border-[#E2E8F0] text-[#475569] font-semibold">
                    STEP 01
                  </span>
                </div>

                {/* Dual-Mode Segmented Pill Switcher */}
                <div className="flex p-1 bg-[#F1F5F9] rounded-lg border border-[#E2E8F0]">
                  <button
                    type="button"
                    onClick={() => setTargetMode("QP_NOS")}
                    className={`flex-1 py-1.5 text-[12px] font-medium rounded-md transition-all cursor-pointer ${
                      targetMode === "QP_NOS"
                        ? "bg-white text-[#0F172A] shadow-xs border border-[#E2E8F0]/70"
                        : "text-[#64748B] hover:text-[#0F172A]"
                    }`}
                  >
                    By Job Role (QP-NOS)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetMode("LINKEDIN")}
                    className={`flex-1 py-1.5 text-[12px] font-medium rounded-md transition-all cursor-pointer ${
                      targetMode === "LINKEDIN"
                        ? "bg-white text-[#0F172A] shadow-xs border border-[#E2E8F0]/70"
                        : "text-[#64748B] hover:text-[#0F172A]"
                    }`}
                  >
                    By Job Link / JD (AI)
                  </button>
                </div>

                {targetMode === "QP_NOS" ? (
                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-[12px] font-medium text-[#0F172A] mb-1">
                        Sector Skill Council (SSC)
                      </label>
                      <select
                        value={selectedDomain}
                        onChange={(e) => {
                          const domain = e.target.value;
                          setSelectedDomain(domain);
                          const match = jobRoles.find((r) => r.domain.toLowerCase() === domain.toLowerCase());
                          if (match) setSelectedJobRoleId(match.id);
                        }}
                        className="w-full h-9 text-[13px] bg-white border border-[#CBD5E1] rounded-lg px-3 text-[#0F172A] focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15"
                      >
                        {SECTOR_SKILL_COUNCILS.map((ssc) => (
                          <option key={ssc.id} value={ssc.domain}>
                            {ssc.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[12px] font-medium text-[#0F172A] mb-1">
                          Target NSQF Level
                        </label>
                        <select
                          value={selectedNsqfLevel}
                          onChange={(e) => setSelectedNsqfLevel(e.target.value)}
                          className="w-full h-9 text-[13px] bg-white border border-[#CBD5E1] rounded-lg px-2.5 text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                        >
                          <option>NSQF Level 4 (Technician)</option>
                          <option>NSQF Level 5 (Senior)</option>
                          <option>NSQF Level 6 (Supervisor)</option>
                          <option>NSQF Level 7 (Lead)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[12px] font-medium text-[#0F172A] mb-1">
                          QP Standard Code
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={
                            selectedDomain.toLowerCase().includes("electric")
                              ? "ELE/Q9802 - v2.0"
                              : selectedDomain.toLowerCase().includes("data")
                              ? "SSC/Q2101 - v1.0"
                              : "SSC/Q0508 - v2.0"
                          }
                          className="w-full h-9 text-[12px] font-mono bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 text-[#4F46E5] font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[12px] font-medium text-[#0F172A] mb-1">
                        Qualification Pack (Job Role)
                      </label>
                      <select
                        value={selectedJobRoleId}
                        onChange={(e) => setSelectedJobRoleId(e.target.value)}
                        className="w-full h-9 text-[13px] bg-white border border-[#CBD5E1] rounded-lg px-3 text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                      >
                        {jobRoles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.title} ({role.domain})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="font-mono text-[10px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                        1-Click Popular Roles
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {jobRoles.slice(0, 4).map((role) => (
                          <button
                            key={role.id}
                            type="button"
                            onClick={() => {
                              setSelectedJobRoleId(role.id);
                              setSelectedDomain(role.domain);
                            }}
                            className={`px-2.5 py-1 rounded-md text-[12px] font-medium border transition-colors cursor-pointer ${
                              selectedJobRoleId === role.id
                                ? "bg-[#4F46E5] text-white border-[#4F46E5]"
                                : "bg-[#F8FAFC] text-[#0F172A] border-[#E2E8F0] hover:border-[#CBD5E1]"
                            }`}
                          >
                            {role.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-[12px] font-medium text-[#0F172A] mb-1">
                        Job Link URL
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          placeholder="https://careers.company.com/jobs/... or https://www.linkedin.com/jobs/view/..."
                          value={linkedinUrl}
                          onChange={(e) => setLinkedinUrl(e.target.value)}
                          className="w-full h-9 text-[13px] bg-white border border-[#CBD5E1] rounded-lg pl-9 pr-3 text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                        />
                        <LinkIcon className="h-4 w-4 text-[#64748B] absolute left-3 top-2.5" />
                      </div>
                      <p className="mt-1 text-[11px] text-[#64748B]">
                        Public career pages are extracted automatically; paste JD text below if the job portal requires sign-in.
                      </p>
                    </div>

                    <div>
                      <label className="block text-[12px] font-medium text-[#0F172A] mb-1">
                        Job Requirements / Description (Optional if URL is public)
                      </label>
                      <textarea
                        rows={5}
                        placeholder="Paste key responsibilities or required technical stack..."
                        value={jobDescriptionText}
                        onChange={(e) => setJobDescriptionText(e.target.value)}
                        className="w-full text-[12px] font-mono bg-white border border-[#CBD5E1] rounded-lg p-3 text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                      />
                    </div>

                    <div>
                      <div className="font-mono text-[10px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                        Sample Postings (1-Click)
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => loadSampleLinkedInJob("frontend_fintech")}
                          className="px-2.5 py-1 rounded-md text-[12px] bg-[#F1F5F9] hover:bg-[#EAEDFF] text-[#0F172A] border border-[#E2E8F0] font-medium cursor-pointer"
                        >
                          Sr. React Developer @ FinTech
                        </button>
                        <button
                          type="button"
                          onClick={() => loadSampleLinkedInJob("ev_powertrain")}
                          className="px-2.5 py-1 rounded-md text-[12px] bg-[#F1F5F9] hover:bg-[#EAEDFF] text-[#0F172A] border border-[#E2E8F0] font-medium cursor-pointer"
                        >
                          EV Powertrain Engineer @ AutoTech
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-[12px] text-[#64748B]">
                <span className="flex items-center gap-1.5 font-mono text-[11px] text-[#065F46]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" />
                  NSQF Aligned
                </span>
                <a
                  href="https://www.skillindiadigital.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#4F46E5] font-medium hover:underline inline-flex items-center gap-1"
                >
                  Skill India Digital <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Candidate Resume Ingestion Column */}
            <div className="lg:col-span-7 prepp-card p-5 sm:p-6 flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#EAEDFF] text-[#3525CD] flex items-center justify-center">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="font-display text-[15px] font-semibold text-[#0F172A]">Candidate Resume / CV</h2>
                      <p className="text-[12px] text-[#64748B]">Upload document or paste plain resume text</p>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#F1F5F9] border border-[#E2E8F0] text-[#475569] font-semibold">
                    STEP 02
                  </span>
                </div>

                {/* Drop Zone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleFileSelection(file);
                  }}
                  className="border border-dashed border-[#CBD5E1] hover:border-[#4F46E5] rounded-xl p-6 text-center bg-[#F8FAFC] hover:bg-[#F2F3FF]/50 transition-all cursor-pointer group"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                    accept=".pdf,.txt,.md,.rtf,.json,.csv"
                    className="hidden"
                  />

                  <div className="w-10 h-10 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center mx-auto mb-2.5 group-hover:border-[#4F46E5]/40 transition-colors">
                    <Upload className="h-4.5 w-4.5 text-[#4F46E5]" />
                  </div>

                  <div className="text-[13px] font-medium text-[#0F172A]">
                    Drop resume (PDF, TXT, MD) or <span className="text-[#4F46E5] underline">Browse files</span>
                  </div>
                  <p className="font-mono text-[11px] text-[#64748B] mt-1">
                    Parsed securely • Benchmarked against official QP-NOS matrices
                  </p>

                  {uploadedFileMeta && (
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#A7F3D0] text-[12px]">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" />
                      <span className="font-medium text-[#0F172A] truncate max-w-xs">{uploadedFileMeta.name}</span>
                      <span className="font-mono text-[11px] text-[#64748B]">({uploadedFileMeta.size})</span>
                    </div>
                  )}
                </div>

                {fileParseWarning && (
                  <div className="p-3 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-[12px] flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{fileParseWarning}</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <button
                      type="button"
                      onClick={() => setShowTextPreview(!showTextPreview)}
                      className="text-[12px] font-medium text-[#4F46E5] hover:underline flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      {showTextPreview ? "Hide Resume Buffer" : "View / Edit Extracted Text"}
                      {resumeText ? ` (${resumeText.length} chars)` : ""}
                    </button>
                    {resumeText && (
                      <span className="font-mono text-[11px] text-[#065F46] font-medium">✓ Content ready</span>
                    )}
                  </div>

                  {showTextPreview && (
                    <textarea
                      rows={6}
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      placeholder="Paste or edit candidate resume text here..."
                      className="w-full text-[12px] font-mono bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg p-3 text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                    />
                  )}
                </div>

                {/* 1-Click Sample Resumes */}
                <div>
                  <div className="font-mono text-[10px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                    Load Test Resumes (1-Click)
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => loadSampleResume("fullstack")}
                      className="px-2.5 py-1 rounded-md text-[12px] bg-[#F1F5F9] hover:bg-[#EAEDFF] text-[#0F172A] border border-[#E2E8F0] font-medium transition-colors cursor-pointer"
                    >
                      Arun (React / Full Stack)
                    </button>
                    <button
                      type="button"
                      onClick={() => loadSampleResume("ev_tech")}
                      className="px-2.5 py-1 rounded-md text-[12px] bg-[#F1F5F9] hover:bg-[#EAEDFF] text-[#0F172A] border border-[#E2E8F0] font-medium transition-colors cursor-pointer"
                    >
                      Aaditya (ITI EV Tech)
                    </button>
                    <button
                      type="button"
                      onClick={() => loadSampleResume("data_analyst")}
                      className="px-2.5 py-1 rounded-md text-[12px] bg-[#F1F5F9] hover:bg-[#EAEDFF] text-[#0F172A] border border-[#E2E8F0] font-medium transition-colors cursor-pointer"
                    >
                      Priya (Data Analyst)
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Controls */}
              <div className="pt-4 border-t border-[#F1F5F9] flex flex-col sm:flex-row items-center justify-between gap-3">
                <Button type="button" variant="outline" size="sm" onClick={resetInputs} className="w-full sm:w-auto">
                  Clear Buffer
                </Button>

                <Button type="button" onClick={runDiagnostic} disabled={analyzing} size="lg" className="w-full sm:w-auto">
                  {analyzing ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Evaluating Competencies...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Run AI Diagnostic</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Diagnostic Audit Report Section */}
          {diagnosticResult && (
            <section className="prepp-card p-6 sm:p-7 space-y-6 animate-fade-in">
              <div className="border-b border-[#E2E8F0] pb-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EAEDFF] text-[#3525CD] font-mono text-[11px] font-semibold">
                        <Brain className="h-3.5 w-3.5" /> AUDIT REPORT
                      </span>
                      {diagnosticResult.isGeminiPowered ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] font-mono text-[11px] font-medium">
                          {diagnosticResult.geminiModel
                            ? `✨ Google Gemini (${diagnosticResult.geminiModel})`
                            : "✨ Google Gemini AI"}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0] font-mono text-[11px] font-medium">
                          ⚡ PMKVY NOS Local Engine
                        </span>
                      )}
                      {diagnosticResult.jobSourceInfo?.fetchStatus === "fetched" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EAEDFF] text-[#3525CD] border border-[#C7C4D8] font-mono text-[11px] font-medium">
                          🌐 Live Job Page Extracted
                        </span>
                      )}
                      {diagnosticResult.jobSourceInfo?.fetchStatus === "gated" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A] font-mono text-[11px] font-medium">
                          ⚠ URL Login-Gated (Analyzed URL + JD)
                        </span>
                      )}
                    </div>
                    <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#0F172A] tracking-tight">
                      Competency Benchmark Overview
                    </h2>
                    <div className="text-[13px] text-[#64748B] mt-1">
                      Evaluated against:{" "}
                      <strong className="text-[#0F172A] font-semibold">{diagnosticResult.targetJobTitle}</strong> •{" "}
                      <span className="font-mono text-[#4F46E5]">{diagnosticResult.targetJobCode}</span> ({diagnosticResult.targetNSQF})
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Button variant="outline" size="sm" onClick={() => window.print()}>
                      <Download className="h-3.5 w-3.5 text-[#64748B]" />
                      <span>Export PDF</span>
                    </Button>
                    <Button
                      size="sm"
                      onClick={syncToProfile}
                      disabled={savingProfile || profileSaved}
                      className={profileSaved ? "bg-[#10B981] hover:bg-[#059669]" : ""}
                    >
                      {profileSaved ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>Saved to Passport</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-3.5 w-3.5" />
                          <span>{savingProfile ? "Syncing..." : "Sync to Profile"}</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Metric Cards Bento */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="lg:col-span-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 flex items-center gap-4">
                    <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-[#E2E8F0]"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3.5"
                        />
                        <path
                          className={
                            diagnosticResult.matchPercentage >= 75
                              ? "text-[#10B981]"
                              : diagnosticResult.matchPercentage >= 50
                              ? "text-[#4F46E5]"
                              : "text-[#BA1A1A]"
                          }
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeDasharray={`${diagnosticResult.matchPercentage}, 100`}
                          strokeLinecap="round"
                          strokeWidth="3.8"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-mono text-lg font-bold text-[#0F172A]">
                          {diagnosticResult.matchPercentage}%
                        </span>
                      </div>
                    </div>

                    <div>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold mb-1 border ${
                          diagnosticResult.matchPercentage >= 75
                            ? "bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]"
                            : diagnosticResult.matchPercentage >= 50
                            ? "bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]"
                            : "bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]"
                        }`}
                      >
                        {diagnosticResult.readinessGrade}
                      </span>
                      <h3 className="font-display text-[14px] font-semibold text-[#0F172A]">
                        {diagnosticResult.advisory.headline}
                      </h3>
                      <p className="text-[12px] text-[#64748B] mt-0.5 leading-relaxed">
                        {diagnosticResult.advisory.message}
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 flex flex-col justify-between">
                    <span className="font-mono text-[11px] text-[#64748B] uppercase">Total Evaluated</span>
                    <div>
                      <div className="font-mono text-2xl font-bold text-[#0F172A]">
                        {diagnosticResult.summaryMetrics.totalEvaluated}
                      </div>
                      <div className="text-[12px] text-[#64748B]">NOS Competency Units</div>
                    </div>
                    <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full">
                      <div className="bg-[#0F172A] h-1.5 rounded-full w-full" />
                    </div>
                  </div>

                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 flex flex-col justify-between">
                    <span className="font-mono text-[11px] text-[#065F46] uppercase">Verified Match</span>
                    <div>
                      <div className="font-mono text-2xl font-bold text-[#10B981]">
                        {diagnosticResult.summaryMetrics.matchedVerified}
                      </div>
                      <div className="text-[12px] text-[#64748B]">Criteria Met</div>
                    </div>
                    <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full">
                      <div
                        className="bg-[#10B981] h-1.5 rounded-full"
                        style={{
                          width: `${
                            diagnosticResult.summaryMetrics.totalEvaluated > 0
                              ? (diagnosticResult.summaryMetrics.matchedVerified /
                                    diagnosticResult.summaryMetrics.totalEvaluated) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 flex flex-col justify-between">
                    <span className="font-mono text-[11px] text-[#991B1B] uppercase">Critical Gaps</span>
                    <div>
                      <div className="font-mono text-2xl font-bold text-[#BA1A1A]">
                        {diagnosticResult.summaryMetrics.criticalGaps}
                      </div>
                      <div className="text-[12px] text-[#64748B]">Remediation Required</div>
                    </div>
                    <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full">
                      <div
                        className="bg-[#BA1A1A] h-1.5 rounded-full"
                        style={{
                          width: `${
                            diagnosticResult.summaryMetrics.totalEvaluated > 0
                              ? (diagnosticResult.summaryMetrics.criticalGaps /
                                    diagnosticResult.summaryMetrics.totalEvaluated) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Matrix Table */}
              <div className="space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display text-[16px] font-semibold text-[#0F172A]">
                      Competency &amp; NOS Gap Matrix
                    </h3>
                    <p className="text-[12px] text-[#64748B]">
                      Cross-referenced evidence snippets from candidate resume
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Filter skills or NOS..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-8 text-[12px] bg-white border border-[#CBD5E1] rounded-lg pl-8 pr-3 text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                      />
                      <Search className="h-3.5 w-3.5 text-[#64748B] absolute left-2.5 top-2.5" />
                    </div>

                    <div className="inline-flex p-0.5 bg-[#F1F5F9] rounded-lg border border-[#E2E8F0] text-[12px]">
                      <button
                        type="button"
                        onClick={() => setActiveMatrixTab("ALL")}
                        className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                          activeMatrixTab === "ALL" ? "bg-white text-[#0F172A] shadow-xs" : "text-[#64748B]"
                        }`}
                      >
                        All ({diagnosticResult.skillsMatrix.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveMatrixTab("MATCHED")}
                        className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                          activeMatrixTab === "MATCHED" ? "bg-white text-[#065F46] shadow-xs" : "text-[#64748B]"
                        }`}
                      >
                        Matched ({diagnosticResult.summaryMetrics.matchedVerified})
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveMatrixTab("CRITICAL")}
                        className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                          activeMatrixTab === "CRITICAL" ? "bg-white text-[#991B1B] shadow-xs" : "text-[#64748B]"
                        }`}
                      >
                        Gaps ({diagnosticResult.summaryMetrics.criticalGaps})
                      </button>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto border border-[#E2E8F0] rounded-xl">
                  <table className="w-full text-left border-collapse text-[13px]">
                    <thead>
                      <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] font-mono text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                        <th className="py-2.5 px-4">NOS Code</th>
                        <th className="py-2.5 px-4">Competency Unit</th>
                        <th className="py-2.5 px-4">Status</th>
                        <th className="py-2.5 px-4">Resume Evidence</th>
                        <th className="py-2.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0] bg-white">
                      {filteredSkills.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-[#64748B]">
                            No competencies matching filter.
                          </td>
                        </tr>
                      ) : (
                        filteredSkills.map((skill, idx) => (
                          <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors">
                            <td className="py-3.5 px-4 font-mono text-[12px] font-medium text-[#4F46E5] whitespace-nowrap">
                              {skill.nosCode}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-[#0F172A]">{skill.skillName}</div>
                              <div className="font-mono text-[11px] text-[#64748B]">
                                Req: {skill.requiredProficiency}% • {skill.importance}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-medium border ${
                                  skill.status === "MATCHED"
                                    ? "bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]"
                                    : skill.status === "ENHANCEMENT_NEEDED"
                                    ? "bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]"
                                    : "bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]"
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    skill.status === "MATCHED"
                                      ? "bg-[#10B981]"
                                      : skill.status === "ENHANCEMENT_NEEDED"
                                      ? "bg-[#F59E0B]"
                                      : "bg-[#BA1A1A]"
                                  }`}
                                />
                                {skill.statusLabel}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 max-w-md">
                              <div className="p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-[11px] leading-relaxed text-[#334155]">
                                &quot;{skill.resumeEvidence}&quot;
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              {skill.status === "MATCHED" ? (
                                <span className="inline-flex items-center gap-1 text-[#065F46] font-mono font-medium text-[11px]">
                                  <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" /> Verified
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const course = diagnosticResult.recommendedCourses[0];
                                    if (course) setEnrollModalCourse(course);
                                  }}
                                  className="inline-flex items-center gap-1 text-[12px] font-medium text-[#4F46E5] hover:underline cursor-pointer"
                                >
                                  Bridge Course <ArrowRight className="h-3 w-3" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bridge Courses */}
              <div className="pt-5 border-t border-[#E2E8F0] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-display text-[16px] font-semibold text-[#0F172A] flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-[#4F46E5]" />
                      Recommended PMKVY 4.0 Bridge Courses
                    </h3>
                    <p className="text-[12px] text-[#64748B]">
                      Targeted NSDC training matched to your missing competencies
                    </p>
                  </div>
                  <Badge variant="success">100% Govt Subsidized</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {diagnosticResult.recommendedCourses.map((course) => (
                    <Card key={course.id} className="prepp-card-interactive flex flex-col justify-between">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant="secondary">{course.category}</Badge>
                          <span className="font-mono text-[11px] text-[#64748B]">{course.duration}</span>
                        </div>
                        <CardTitle className="text-[15px] leading-snug">{course.name}</CardTitle>
                        <CardDescription className="text-[12px]">{course.provider}</CardDescription>
                      </CardHeader>

                      <CardContent className="p-4 pt-2 space-y-3">
                        <div>
                          <div className="font-mono text-[10px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">
                            Bridges Missing Skills:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {course.skillsAddressed.map((sk, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]"
                              >
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[12px] text-[#334155] space-y-0.5">
                          <div>✓ {course.subsidyStatus}</div>
                          <div>✓ {course.stipend}</div>
                        </div>
                      </CardContent>

                      <CardFooter className="p-4 pt-0">
                        <Button size="sm" onClick={() => setEnrollModalCourse(course)} className="w-full">
                          <span>Enroll via Skill India</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Direct Enrollment Modal */}
          {enrollModalCourse && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/40 backdrop-blur-[4px]">
              <div className="bg-white rounded-xl border border-[#CBD5E1] shadow-[0_12px_32px_-4px_rgba(15,23,42,0.16)] max-w-lg w-full p-6 space-y-4 animate-fade-in">
                <div className="flex items-start justify-between border-b border-[#E2E8F0] pb-3.5">
                  <div>
                    <Badge variant="secondary" className="mb-1">PMKVY 4.0 Direct Enrollment</Badge>
                    <h3 className="font-display text-[17px] font-semibold text-[#0F172A]">{enrollModalCourse.name}</h3>
                    <p className="text-[12px] text-[#64748B]">{enrollModalCourse.provider}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEnrollModalCourse(null)}
                    className="p-1 text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 text-[13px] text-[#0F172A]">
                  <div className="p-3.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Accredited Body:</span>
                      <span className="font-mono font-medium">NSDC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Duration:</span>
                      <span className="font-mono font-medium">{enrollModalCourse.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Tuition Fee:</span>
                      <span className="font-mono font-medium text-[#065F46]">100% Free Subsidized</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Stipend Eligibility:</span>
                      <span className="font-mono font-medium text-[#065F46]">{enrollModalCourse.stipend}</span>
                    </div>
                  </div>

                  <p className="text-[12px] text-[#64748B] leading-relaxed">
                    Your candidate profile can be linked directly to the Skill India Digital portal for batch registration.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2E8F0]">
                  <Button variant="outline" size="sm" onClick={() => setEnrollModalCourse(null)}>
                    Cancel
                  </Button>
                  <a
                    href={enrollModalCourse.officialPortalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium text-[12px] h-8 transition-colors"
                  >
                    Confirm on Portal <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    );
}
