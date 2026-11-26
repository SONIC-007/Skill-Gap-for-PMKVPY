"use client";
// [FRONTEND] Dual AI Resume Analyser (QP-NOS & Job Link/JD) | Route: /resume-analyser | Uses: GET/POST /api/ai-resume-analyser, POST /api/ai-resume-analyser/save, document-parser.js, auth-context.jsx
import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { EditorialPageHeader } from "@/components/story/EditorialPageHeader";
import { PdfUploadCard } from "@/components/ui/PdfUploadCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";
import { Sparkles, Link as LinkIcon, FileText, CheckCircle2, AlertTriangle, XCircle, ExternalLink, BookOpen, ArrowRight, Brain, ShieldCheck, RefreshCw, Download, Search, Eye, Info, Building2, Printer, Check } from "lucide-react";
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
function ResumeAnalyserContent() {
    const searchParams = useSearchParams();
    const modeParam = (searchParams.get("mode") || "").toLowerCase();
    const initialMode =
        modeParam === "job-link" || modeParam === "url" || modeParam === "linkedin"
            ? "LINKEDIN"
            : "QP_NOS";

    const fileInputRef = useRef(null);
    // Input Mode & Text States
    const [targetMode, setTargetMode] = useState(initialMode);
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
    // Google Gemini Generative AI status (uses shared server key automatically)
    const [serverAiConfigured, setServerAiConfigured] = useState(true);
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
                        const defaultWebRole =
                            data.jobRoles.find((r) => r.domain?.toLowerCase() === "web development") ||
                            data.jobRoles[0];
                        setSelectedJobRoleId(defaultWebRole.id);
                    }
                }
            }
            catch (e) {
                console.error("Failed to load standard job roles:", e);
            }
        }
        loadJobRoles();
    }, []);
    // Handle Drag & Drop / File Input with Robust Client + Server PDF Parser
    const handleFileSelection = async (file) => {
        setFileParseWarning(null);
        setNotification({
            type: "info",
            message: `Extracting text from ${file.name}...`,
        });
        const result = await extractTextFromFile(file);
        if (result.success && result.text) {
            setResumeText(result.text);
            setShowTextPreview(true);
            setUploadedFileMeta({
                name: result.fileName,
                size: result.fileSizeFormatted,
                wordCount: result.wordCount,
                charCount: result.characterCount,
            });
            setNotification({
                type: "success",
                message: `Extracted ${result.wordCount} words from ${result.fileName}. Ready to run diagnostic!`,
            });
            if (result.warning) {
                setFileParseWarning(result.warning);
            }
        }
        else {
            setNotification(null);
            setFileParseWarning(result.warning || "Could not read text from this file.");
            setShowTextPreview(true);
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
        const matchingRole =
            jobRoles.find((r) => r.title?.toLowerCase().includes(sample.role.toLowerCase())) ||
            jobRoles.find((r) => r.domain?.toLowerCase() === sample.domain.toLowerCase());
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
            const customKey =
                typeof window !== "undefined"
                    ? (localStorage.getItem("pmkvy_gemini_key") || "").trim()
                    : "";
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
                    apiKey: customKey || undefined,
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
        <div className="space-y-6 animate-fade-in">
          {/* Breadcrumb & Header Strip (PrepP Style) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[12px] font-mono text-[#52525B]">
              <Link href="/dashboard" className="hover:text-[#4F46E5] transition-colors">
                Dashboard
              </Link>
              <span className="text-[#D5D2CA]">/</span>
              <span className="text-[#111113] font-medium">AI Resume &amp; Job Matcher</span>
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
                <Printer className="h-3.5 w-3.5 text-[#52525B]" />
                <span>Print Audit</span>
              </Button>
            </div>
          </div>

          {/* Editorial Studio Title Banner */}
          <EditorialPageHeader
            variant="studio"
            eyebrow="AI DIAGNOSTIC ENGINE • DUAL PATHWAY"
            title="AI Resume &"
            italicAccent="Industry Job Matcher."
            description="Benchmark your CV against National Occupational Standards (QP-NOS job roles) or any live job posting URL using Google Gemini AI, and discover free PMKVY courses."
            badges={
              <>
                <span className="px-3 py-1 rounded-full text-[11px] font-mono bg-white/10 text-indigo-200 border border-white/10">
                  By Job Role (QP-NOS)
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-mono bg-emerald-500/15 text-emerald-200 border border-emerald-400/25">
                  By Live Job Link / JD
                </span>
              </>
            }
          />

          {/* In-App Notification Banner */}
          {notification && (
            <div
              className={`p-3.5 rounded-lg border flex items-start justify-between gap-3 text-[13px] ${
                notification.type === "error"
                  ? "bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]"
                  : notification.type === "success"
                  ? "bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]"
                  : "bg-[#EEF0FF] border-[#C7D2FE] text-[#4F46E5]"
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
            <div className="lg:col-span-5 prepp-card p-6 flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3.5 border-b border-[#F0F1F3]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#EEF0FF] text-[#4F46E5] flex items-center justify-center">
                      <Building2 className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h2 className="font-display text-[16px] font-semibold text-[#111113]">Target Job Benchmark</h2>
                      <p className="text-[12px] text-[#71717A]">Choose QP-NOS or corporate JD</p>
                    </div>
                  </div>
                  <span className="bento-chip font-mono font-semibold text-[#111113]">
                    STEP 01
                  </span>
                </div>

                {/* Dual-Mode Segmented Pill Switcher */}
                <div className="flex p-1 bg-[#F4F5F7] rounded-xl border border-black/[0.04]">
                  <button
                    type="button"
                    onClick={() => setTargetMode("QP_NOS")}
                    className={`flex-1 py-1.5 text-[12px] font-medium rounded-lg transition-all cursor-pointer ${
                      targetMode === "QP_NOS"
                        ? "bg-white text-[#111113] shadow-xs"
                        : "text-[#52525B] hover:text-[#111113]"
                    }`}
                  >
                    By Job Role (QP-NOS)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetMode("LINKEDIN")}
                    className={`flex-1 py-1.5 text-[12px] font-medium rounded-lg transition-all cursor-pointer ${
                      targetMode === "LINKEDIN"
                        ? "bg-white text-[#111113] shadow-xs"
                        : "text-[#52525B] hover:text-[#111113]"
                    }`}
                  >
                    By Job Link / JD (AI)
                  </button>
                </div>

                {targetMode === "QP_NOS" ? (
                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-[12px] font-medium text-[#111113] mb-1">
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
                        className="w-full h-9 text-[13px] bg-white border border-[#D5D2CA] rounded-lg px-3 text-[#111113] focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15"
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
                        <label className="block text-[12px] font-medium text-[#111113] mb-1">
                          Target NSQF Level
                        </label>
                        <select
                          value={selectedNsqfLevel}
                          onChange={(e) => setSelectedNsqfLevel(e.target.value)}
                          className="w-full h-9 text-[13px] bg-white border border-[#D5D2CA] rounded-lg px-2.5 text-[#111113] focus:outline-none focus:border-[#4F46E5]"
                        >
                          <option>NSQF Level 4 (Technician)</option>
                          <option>NSQF Level 5 (Senior)</option>
                          <option>NSQF Level 6 (Supervisor)</option>
                          <option>NSQF Level 7 (Lead)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[12px] font-medium text-[#111113] mb-1">
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
                          className="w-full h-9 text-[12px] font-mono bg-[#F6F5F0] border border-[#E6E4DE] rounded-lg px-3 text-[#4F46E5] font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[12px] font-medium text-[#111113] mb-1">
                        Qualification Pack (Job Role)
                      </label>
                      <select
                        value={selectedJobRoleId}
                        onChange={(e) => setSelectedJobRoleId(e.target.value)}
                        className="w-full h-9 text-[13px] bg-white border border-[#D5D2CA] rounded-lg px-3 text-[#111113] focus:outline-none focus:border-[#4F46E5]"
                      >
                        {jobRoles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.title} ({role.domain})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="font-mono text-[10px] font-semibold text-[#52525B] uppercase tracking-wider mb-1.5">
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
                                : "bg-[#F6F5F0] text-[#111113] border-[#E6E4DE] hover:border-[#D5D2CA]"
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
                      <label className="block text-[12px] font-medium text-[#111113] mb-1">
                        Job Link URL
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          placeholder="https://careers.company.com/jobs/... or https://www.linkedin.com/jobs/view/..."
                          value={linkedinUrl}
                          onChange={(e) => setLinkedinUrl(e.target.value)}
                          className="w-full h-9 text-[13px] bg-white border border-[#D5D2CA] rounded-lg pl-9 pr-3 text-[#111113] focus:outline-none focus:border-[#4F46E5]"
                        />
                        <LinkIcon className="h-4 w-4 text-[#52525B] absolute left-3 top-2.5" />
                      </div>
                      <p className="mt-1 text-[11px] text-[#52525B]">
                        Public career pages are extracted automatically; paste JD text below if the job portal requires sign-in.
                      </p>
                    </div>

                    <div>
                      <label className="block text-[12px] font-medium text-[#111113] mb-1">
                        Job Requirements / Description (Optional if URL is public)
                      </label>
                      <textarea
                        rows={5}
                        placeholder="Paste key responsibilities or required technical stack..."
                        value={jobDescriptionText}
                        onChange={(e) => setJobDescriptionText(e.target.value)}
                        className="w-full text-[12px] font-mono bg-white border border-[#D5D2CA] rounded-lg p-3 text-[#111113] focus:outline-none focus:border-[#4F46E5]"
                      />
                    </div>

                    <div>
                      <div className="font-mono text-[10px] font-semibold text-[#52525B] uppercase tracking-wider mb-1.5">
                        Sample Postings (1-Click)
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => loadSampleLinkedInJob("frontend_fintech")}
                          className="px-2.5 py-1 rounded-md text-[12px] bg-[#EFECE6] hover:bg-[#EAECFF] text-[#111113] border border-[#E6E4DE] font-medium cursor-pointer"
                        >
                          Sr. React Developer @ FinTech
                        </button>
                        <button
                          type="button"
                          onClick={() => loadSampleLinkedInJob("ev_powertrain")}
                          className="px-2.5 py-1 rounded-md text-[12px] bg-[#EFECE6] hover:bg-[#EAECFF] text-[#111113] border border-[#E6E4DE] font-medium cursor-pointer"
                        >
                          EV Powertrain Engineer @ AutoTech
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#EFECE6] flex items-center justify-between text-[12px] text-[#52525B]">
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
            <div className="lg:col-span-7 prepp-card p-6 flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3.5 border-b border-[#F0F1F3]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#ECFDF5] text-[#059669] flex items-center justify-center">
                      <FileText className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h2 className="font-display text-[16px] font-semibold text-[#111113]">Candidate Resume / CV</h2>
                      <p className="text-[12px] text-[#71717A]">Upload document or paste plain resume text</p>
                    </div>
                  </div>
                  <span className="bento-chip font-mono font-semibold text-[#111113]">
                    STEP 02
                  </span>
                </div>

                {/* Lavender Dashed PDF Drop Zone */}
                <PdfUploadCard
                  fileInputRef={fileInputRef}
                  onFileSelect={handleFileSelection}
                  onFileChange={handleFileInputChange}
                  uploadedFileMeta={uploadedFileMeta}
                  accept=".pdf,.txt,.md,.rtf,.json,.csv"
                  buttonLabel="Upload"
                />

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
                      className="w-full text-[12px] font-mono bg-[#F6F5F0] border border-[#D5D2CA] rounded-lg p-3 text-[#111113] focus:outline-none focus:border-[#4F46E5]"
                    />
                  )}
                </div>

                {/* 1-Click Sample Resumes */}
                <div>
                  <div className="font-mono text-[10px] font-semibold text-[#52525B] uppercase tracking-wider mb-1.5">
                    Load Test Resumes (1-Click)
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => loadSampleResume("fullstack")}
                      className="px-2.5 py-1 rounded-md text-[12px] bg-[#EFECE6] hover:bg-[#EAECFF] text-[#111113] border border-[#E6E4DE] font-medium transition-colors cursor-pointer"
                    >
                      Arun (React / Full Stack)
                    </button>
                    <button
                      type="button"
                      onClick={() => loadSampleResume("ev_tech")}
                      className="px-2.5 py-1 rounded-md text-[12px] bg-[#EFECE6] hover:bg-[#EAECFF] text-[#111113] border border-[#E6E4DE] font-medium transition-colors cursor-pointer"
                    >
                      Aaditya (ITI EV Tech)
                    </button>
                    <button
                      type="button"
                      onClick={() => loadSampleResume("data_analyst")}
                      className="px-2.5 py-1 rounded-md text-[12px] bg-[#EFECE6] hover:bg-[#EAECFF] text-[#111113] border border-[#E6E4DE] font-medium transition-colors cursor-pointer"
                    >
                      Priya (Data Analyst)
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Controls */}
              <div className="pt-4 border-t border-[#EFECE6] flex flex-col sm:flex-row items-center justify-between gap-3">
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
              <div className="border-b border-[#E6E4DE] pb-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EAECFF] text-[#4F46E5] font-mono text-[11px] font-semibold">
                        <Brain className="h-3.5 w-3.5" /> AUDIT REPORT
                      </span>
                      {diagnosticResult.isGeminiPowered ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] font-mono text-[11px] font-medium">
                          {diagnosticResult.geminiModel
                            ? `✨ Google Gemini (${diagnosticResult.geminiModel})`
                            : "✨ Google Gemini AI"}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EFECE6] text-[#52525B] border border-[#E6E4DE] font-mono text-[11px] font-medium">
                          ⚡ PMKVY NOS Local Engine
                        </span>
                      )}
                      {diagnosticResult.jobSourceInfo?.fetchStatus === "fetched" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EAECFF] text-[#4F46E5] border border-[#C7D2FE] font-mono text-[11px] font-medium">
                          🌐 Live Job Page Extracted
                        </span>
                      )}
                      {diagnosticResult.jobSourceInfo?.fetchStatus === "gated" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A] font-mono text-[11px] font-medium">
                          ⚠ URL Login-Gated (Analyzed URL + JD)
                        </span>
                      )}
                    </div>
                    <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#111113] tracking-tight">
                      Competency Benchmark Overview
                    </h2>
                    <div className="text-[13px] text-[#52525B] mt-1">
                      Evaluated against:{" "}
                      <strong className="text-[#111113] font-semibold">{diagnosticResult.targetJobTitle}</strong> •{" "}
                      <span className="font-mono text-[#4F46E5]">{diagnosticResult.targetJobCode}</span> ({diagnosticResult.targetNSQF})
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Button variant="outline" size="sm" onClick={() => window.print()}>
                      <Download className="h-3.5 w-3.5 text-[#52525B]" />
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

                {/* Metric Cards Bento (Ref 3 Radial + Soft Tinted Metric Strip) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="lg:col-span-2 bento-subtile p-5 flex items-center gap-4">
                    <div className="relative w-22 h-22 shrink-0 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-[#E5E7EB]"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3.2"
                        />
                        <path
                          className={
                            diagnosticResult.matchPercentage >= 75
                              ? "text-[#86BA6C]"
                              : diagnosticResult.matchPercentage >= 50
                              ? "text-[#4F46E5]"
                              : "text-[#DF6D51]"
                          }
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeDasharray={`${diagnosticResult.matchPercentage}, 100`}
                          strokeLinecap="round"
                          strokeWidth="3.6"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-display text-lg font-bold text-[#111113]">
                          {diagnosticResult.matchPercentage}%
                        </span>
                      </div>
                    </div>

                    <div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold mb-1.5 ${
                          diagnosticResult.matchPercentage >= 75
                            ? "bg-[#ECFDF5] text-[#065F46]"
                            : diagnosticResult.matchPercentage >= 50
                            ? "bg-[#FFFBEB] text-[#92400E]"
                            : "bg-[#FEF2F2] text-[#991B1B]"
                        }`}
                      >
                        {diagnosticResult.readinessGrade}
                      </span>
                      <h3 className="font-display text-[15px] font-semibold text-[#111113]">
                        {diagnosticResult.advisory.headline}
                      </h3>
                      <p className="text-[12px] text-[#52525B] mt-0.5 leading-relaxed">
                        {diagnosticResult.advisory.message}
                      </p>
                    </div>
                  </div>

                  <div className="bento-subtile p-5 flex flex-col justify-between">
                    <span className="font-mono text-[10.5px] font-semibold text-[#71717A] uppercase">Total Evaluated</span>
                    <div>
                      <div className="font-display text-2xl font-bold text-[#111113]">
                        {diagnosticResult.summaryMetrics.totalEvaluated}
                      </div>
                      <div className="text-[11.5px] text-[#71717A]">NOS Competency Units</div>
                    </div>
                    <div className="w-full bg-[#E5E7EB] h-1.5 rounded-full">
                      <div className="bg-[#111113] h-1.5 rounded-full w-full" />
                    </div>
                  </div>

                  <div className="bento-subtile p-5 flex flex-col justify-between">
                    <span className="font-mono text-[10.5px] font-semibold text-[#065F46] uppercase">Verified Match</span>
                    <div>
                      <div className="font-display text-2xl font-bold text-[#10B981]">
                        {diagnosticResult.summaryMetrics.matchedVerified}
                      </div>
                      <div className="text-[11.5px] text-[#71717A]">Criteria Met</div>
                    </div>
                    <div className="w-full bg-[#E5E7EB] h-1.5 rounded-full">
                      <div
                        className="bg-[#86BA6C] h-1.5 rounded-full"
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

                  <div className="bento-subtile p-5 flex flex-col justify-between">
                    <span className="font-mono text-[10.5px] font-semibold text-[#991B1B] uppercase">Critical Gaps</span>
                    <div>
                      <div className="font-display text-2xl font-bold text-[#BA1A1A]">
                        {diagnosticResult.summaryMetrics.criticalGaps}
                      </div>
                      <div className="text-[11.5px] text-[#71717A]">Remediation Required</div>
                    </div>
                    <div className="w-full bg-[#E5E7EB] h-1.5 rounded-full">
                      <div
                        className="bg-[#DF6D51] h-1.5 rounded-full"
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
                    <h3 className="font-display text-[16px] font-semibold text-[#111113]">
                      Competency &amp; NOS Gap Matrix
                    </h3>
                    <p className="text-[12px] text-[#52525B]">
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
                        className="h-8 text-[12px] bg-white border border-[#D5D2CA] rounded-lg pl-8 pr-3 text-[#111113] focus:outline-none focus:border-[#4F46E5]"
                      />
                      <Search className="h-3.5 w-3.5 text-[#52525B] absolute left-2.5 top-2.5" />
                    </div>

                    <div className="inline-flex p-0.5 bg-[#EFECE6] rounded-lg border border-[#E6E4DE] text-[12px]">
                      <button
                        type="button"
                        onClick={() => setActiveMatrixTab("ALL")}
                        className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                          activeMatrixTab === "ALL" ? "bg-white text-[#111113] shadow-xs" : "text-[#52525B]"
                        }`}
                      >
                        All ({diagnosticResult.skillsMatrix.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveMatrixTab("MATCHED")}
                        className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                          activeMatrixTab === "MATCHED" ? "bg-white text-[#065F46] shadow-xs" : "text-[#52525B]"
                        }`}
                      >
                        Matched ({diagnosticResult.summaryMetrics.matchedVerified})
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveMatrixTab("CRITICAL")}
                        className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                          activeMatrixTab === "CRITICAL" ? "bg-white text-[#991B1B] shadow-xs" : "text-[#52525B]"
                        }`}
                      >
                        Gaps ({diagnosticResult.summaryMetrics.criticalGaps})
                      </button>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto border border-[#E6E4DE] rounded-xl">
                  <table className="w-full text-left border-collapse text-[13px]">
                    <thead>
                      <tr className="bg-[#F6F5F0] border-b border-[#E6E4DE] font-mono text-[11px] font-semibold uppercase tracking-wider text-[#52525B]">
                        <th className="py-2.5 px-4">NOS Code</th>
                        <th className="py-2.5 px-4">Competency Unit</th>
                        <th className="py-2.5 px-4">Status</th>
                        <th className="py-2.5 px-4">Resume Evidence</th>
                        <th className="py-2.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E6E4DE] bg-white">
                      {filteredSkills.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-[#52525B]">
                            No competencies matching filter.
                          </td>
                        </tr>
                      ) : (
                        filteredSkills.map((skill, idx) => (
                          <tr key={idx} className="hover:bg-[#F6F5F0] transition-colors">
                            <td className="py-3.5 px-4 font-mono text-[12px] font-medium text-[#4F46E5] whitespace-nowrap">
                              {skill.nosCode}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-[#111113]">{skill.skillName}</div>
                              <div className="font-mono text-[11px] text-[#52525B]">
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
                              <div className="p-2 rounded-lg bg-[#F6F5F0] border border-[#E6E4DE] font-mono text-[11px] leading-relaxed text-[#27272A]">
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
              <div className="pt-5 border-t border-[#E6E4DE] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-display text-[16px] font-semibold text-[#111113] flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-[#4F46E5]" />
                      Recommended PMKVY 4.0 Bridge Courses
                    </h3>
                    <p className="text-[12px] text-[#52525B]">
                      Targeted NSDC training matched to your missing competencies
                    </p>
                  </div>
                  <Badge variant="success">100% Govt Subsidized</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {diagnosticResult.recommendedCourses.map((course, cIdx) => {
                    const mono = (course.provider || course.category || "P").trim().charAt(0).toUpperCase();
                    const pillColor = [
                      "bg-[#111113] text-white",
                      "bg-[#EEF4FF] text-[#2563EB]",
                      "bg-[#ECFDF5] text-[#059669]",
                    ][cIdx % 3];
                    return (
                      <div
                        key={course.id}
                        className="prepp-card-interactive p-6 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center font-display text-[14px] font-bold ${pillColor}`}>
                              {mono}
                            </div>
                            <span className="rounded-lg border border-[#A7F3D0] bg-[#ECFDF5] px-2.5 py-0.5 text-[11px] font-medium text-[#065F46]">
                              100% Free
                            </span>
                          </div>

                          <div className="mt-4">
                            <div className="flex items-center gap-1.5 text-[11.5px]">
                              <span className="font-semibold text-[#111113] truncate max-w-[140px]">
                                {course.provider}
                              </span>
                              <span className="text-[#9CA3AF]">•</span>
                              <span className="text-[#9CA3AF] truncate">{course.category}</span>
                            </div>
                            <h4 className="mt-1 font-display text-[17px] font-semibold text-[#111113] leading-snug line-clamp-2">
                              {course.name}
                            </h4>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {(course.skillsAddressed || []).slice(0, 3).map((sk, i) => (
                              <span
                                key={i}
                                className="bento-chip bg-[#FEF2F2] text-[#991B1B]"
                              >
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-[#F0F1F3] flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <div className="font-display text-[14px] font-bold text-[#111113] truncate" title={course.stipend}>
                              ₹0 Tuition • Stipend
                            </div>
                            <div className="text-[11px] text-[#9CA3AF] truncate">
                              {course.duration} · PMKVY 4.0
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setEnrollModalCourse(course)}
                            className="shrink-0 rounded-xl bg-[#111113] hover:bg-[#27272A] px-3.5 py-2 text-[12px] font-medium text-white transition-colors cursor-pointer"
                          >
                            Enroll now
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* Direct Enrollment Modal */}
          {enrollModalCourse && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111113]/40 backdrop-blur-[4px]">
              <div className="bg-white rounded-xl border border-[#D5D2CA] shadow-[0_12px_32px_-4px_rgba(15,23,42,0.16)] max-w-lg w-full p-6 space-y-4 animate-fade-in">
                <div className="flex items-start justify-between border-b border-[#E6E4DE] pb-3.5">
                  <div>
                    <Badge variant="secondary" className="mb-1">PMKVY 4.0 Direct Enrollment</Badge>
                    <h3 className="font-display text-[17px] font-semibold text-[#111113]">{enrollModalCourse.name}</h3>
                    <p className="text-[12px] text-[#52525B]">{enrollModalCourse.provider}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEnrollModalCourse(null)}
                    className="p-1 text-[#52525B] hover:text-[#111113] cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 text-[13px] text-[#111113]">
                  <div className="p-3.5 bg-[#F6F5F0] rounded-lg border border-[#E6E4DE] space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#52525B]">Accredited Body:</span>
                      <span className="font-mono font-medium">NSDC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#52525B]">Duration:</span>
                      <span className="font-mono font-medium">{enrollModalCourse.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#52525B]">Tuition Fee:</span>
                      <span className="font-mono font-medium text-[#065F46]">100% Free Subsidized</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#52525B]">Stipend Eligibility:</span>
                      <span className="font-mono font-medium text-[#065F46]">{enrollModalCourse.stipend}</span>
                    </div>
                  </div>

                  <p className="text-[12px] text-[#52525B] leading-relaxed">
                    Your candidate profile can be linked directly to the Skill India Digital portal for batch registration.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E6E4DE]">
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
    );
}

export default function AIResumeAnalyserPage() {
    return (
        <DashboardLayout>
            <Suspense
                fallback={
                    <div className="flex h-96 items-center justify-center font-mono text-[12px] text-[#52525B]">
                        Loading AI Resume Analyser...
                    </div>
                }
            >
                <ResumeAnalyserContent />
            </Suspense>
        </DashboardLayout>
    );
}
