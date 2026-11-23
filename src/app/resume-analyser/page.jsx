"use client";
import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
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
    // Google Gemini Generative AI Key State
    const [geminiApiKey, setGeminiApiKey] = useState("");
    const [showApiSettings, setShowApiSettings] = useState(false);
    const [tempApiKey, setTempApiKey] = useState("");
    const [showKeyText, setShowKeyText] = useState(false);

    useEffect(() => {
        const saved = typeof window !== "undefined" ? localStorage.getItem("pmkvy_gemini_key") : "";
        if (saved) {
            setGeminiApiKey(saved);
            setTempApiKey(saved);
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
    // Load Job Roles from API
    useEffect(() => {
        async function loadJobRoles() {
            try {
                const res = await fetch("/api/skill-gap");
                if (res.ok) {
                    const data = await res.json();
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
        setAnalyzing(true);
        setNotification(null);
        setProfileSaved(false);
        try {
            const response = await fetch("/api/ai-resume-analyser", {
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
            const res = await fetch("/api/ai-resume-analyser/save", {
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
    return (<DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto pb-16 font-sans">
        {/* Apple HomeView Section Header */}
        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0071e3]/10 text-[#0071e3] text-[12px] font-semibold mb-3">
                <Sparkles className="h-3.5 w-3.5"/>
                <span>AI Skill Intelligence</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f]">
                AI Resume & Job Matcher
              </h1>
              <p className="text-[15px] text-[#86868b] mt-1 max-w-2xl leading-relaxed">
                Benchmark your candidate background against National Occupational Standards (QP-NOS)
                or live job listings. Discover competency gaps and unlock government-subsidized PMKVY courses.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowApiSettings(!showApiSettings)}
                className={`rounded-full text-[13px] h-[38px] px-4 transition-all ${
                  geminiApiKey
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                    : "border-[#d2d2d7] text-[#1d1d1f] hover:bg-[#f5f5f7]"
                }`}
              >
                <Sparkles className={`h-3.5 w-3.5 mr-1.5 ${geminiApiKey ? "text-emerald-600" : "text-[#0071e3]"}`} />
                {geminiApiKey ? "Gemini AI: Active" : "Connect Gemini API"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.print()} className="rounded-full text-[13px] border-[#d2d2d7] text-[#1d1d1f] hover:bg-[#f5f5f7] h-[38px] px-4">
                <Printer className="h-3.5 w-3.5 mr-1.5 text-[#86868b]"/>
                Print Audit
              </Button>
            </div>
          </div>
        </div>

        {/* Gemini API Key Configuration Drawer */}
        {showApiSettings && (
          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-sm transition-all animate-fade-in space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e5e7eb]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#0071e3]/10 text-[#0071e3] flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-[#0071e3]" />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-[#1d1d1f]">Google Gemini API Key</h3>
                  <p className="text-[12px] text-[#86868b]">Generative AI analysis for dynamic NSQF mapping & personalized candidate advice</p>
                </div>
              </div>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[12px] text-[#0071e3] hover:underline flex items-center gap-1 font-medium"
              >
                Get Free API Key <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type={showKeyText ? "text" : "password"}
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  placeholder="Paste your Google Gemini API Key (e.g. AIzaSy...)"
                  className="w-full h-[42px] px-3.5 pr-10 rounded-xl bg-[#f5f5f7] border border-[#d2d2d7] text-[13px] text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]"
                />
                <button
                  type="button"
                  onClick={() => setShowKeyText(!showKeyText)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] cursor-pointer"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => saveGeminiKey(tempApiKey)}
                  className="rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-[13px] h-[42px] px-5"
                >
                  Save Key
                </Button>
                {geminiApiKey && (
                  <Button
                    variant="outline"
                    onClick={() => saveGeminiKey("")}
                    className="rounded-full border-[#ff3b30]/30 text-[#ff3b30] hover:bg-[#ff3b30]/10 text-[13px] h-[42px] px-4"
                  >
                    Clear
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={() => setShowApiSettings(false)}
                  className="rounded-full text-[13px] text-[#86868b] h-[42px] px-3"
                >
                  Close
                </Button>
              </div>
            </div>

            <p className="text-[11px] text-[#86868b]">
              🔒 <strong>Local Privacy:</strong> Keys are stored in your local browser and sent securely over HTTPS. You can also configure <code className="bg-[#f5f5f7] px-1.5 py-0.5 rounded border border-[#e5e7eb] font-mono">GEMINI_API_KEY</code> in <code className="bg-[#f5f5f7] px-1.5 py-0.5 rounded border border-[#e5e7eb] font-mono">.env</code>. When omitted, the app uses the built-in offline PMKVY NLP engine.
            </p>
          </div>
        )}

        {/* In-App Notification Banner */}
        {notification && (<div className={`p-4 rounded-2xl border flex items-start justify-between gap-3 transition-all ${notification.type === "error"
                ? "bg-[#ff3b30]/10 border-[#ff3b30]/20 text-[#ff3b30]"
                : notification.type === "success"
                    ? "bg-[#34c759]/10 border-[#34c759]/20 text-[#248a3d]"
                    : "bg-[#0071e3]/10 border-[#0071e3]/20 text-[#0071e3]"}`}>
            <div className="flex items-start gap-2.5 text-[14px]">
              {notification.type === "error" ? (<XCircle className="h-5 w-5 text-[#ff3b30] shrink-0 mt-0.5"/>) : notification.type === "success" ? (<CheckCircle2 className="h-5 w-5 text-[#34c759] shrink-0 mt-0.5"/>) : (<Info className="h-5 w-5 text-[#0071e3] shrink-0 mt-0.5"/>)}
              <span className="font-medium">{notification.message}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-[#86868b] hover:text-[#1d1d1f] text-xs font-semibold ml-2 cursor-pointer">
              ✕
            </button>
          </div>)}

        {/* Input Bento Grid: Target Job + Resume Ingestion */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Target Job Benchmark Column (5 Cols) */}
          <div className="lg:col-span-5 bg-white border border-[#e5e7eb] rounded-2xl p-6 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#0071e3]/10 text-[#0071e3] flex items-center justify-center">
                    <Building2 className="h-4 w-4"/>
                  </div>
                  <div>
                    <h2 className="text-[16px] font-semibold text-[#1d1d1f]">Target Job Benchmark</h2>
                    <p className="text-[12px] text-[#86868b]">Choose standard or live job</p>
                  </div>
                </div>
                <Badge variant="muted" className="text-[11px] font-medium">
                  Step 1
                </Badge>
              </div>

              {/* Mode Switcher Tabs (Apple Segmented Style) */}
              <div className="flex p-1 bg-[#f5f5f7] rounded-xl border border-[#e5e7eb]">
                <button type="button" onClick={() => setTargetMode("QP_NOS")} className={`flex-1 py-1.5 text-[13px] font-medium rounded-lg transition-all ${targetMode === "QP_NOS"
            ? "bg-white text-[#1d1d1f] shadow-xs"
            : "text-[#86868b] hover:text-[#1d1d1f]"}`}>
                  Standard QP-NOS
                </button>
                <button type="button" onClick={() => setTargetMode("LINKEDIN")} className={`flex-1 py-1.5 text-[13px] font-medium rounded-lg transition-all ${targetMode === "LINKEDIN"
            ? "bg-white text-[#1d1d1f] shadow-xs"
            : "text-[#86868b] hover:text-[#1d1d1f]"}`}>
                  Live Job URL (LinkedIn)
                </button>
              </div>

              {targetMode === "QP_NOS" ? (
        /* Mode A: National Qualification Pack Selection */
        <div className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">
                      Sector Skill Council (SSC)
                    </label>
                    <select value={selectedDomain} onChange={(e) => {
                const domain = e.target.value;
                setSelectedDomain(domain);
                const match = jobRoles.find((r) => r.domain.toLowerCase() === domain.toLowerCase());
                if (match)
                    setSelectedJobRoleId(match.id);
            }} className="w-full text-[14px] bg-white border border-[#d2d2d7] rounded-xl px-3.5 py-2 text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20">
                      {SECTOR_SKILL_COUNCILS.map((ssc) => (<option key={ssc.id} value={ssc.domain}>
                          {ssc.name}
                        </option>))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">
                        Target NSQF Level
                      </label>
                      <select value={selectedNsqfLevel} onChange={(e) => setSelectedNsqfLevel(e.target.value)} className="w-full text-[14px] bg-white border border-[#d2d2d7] rounded-xl px-3 py-2 text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20">
                        <option>NSQF Level 4 (Technician)</option>
                        <option>NSQF Level 5 (Senior)</option>
                        <option>NSQF Level 6 (Supervisor)</option>
                        <option>NSQF Level 7 (Lead)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">
                        QP Standard
                      </label>
                      <input type="text" readOnly value={selectedDomain.toLowerCase().includes("electric")
                ? "ELE/Q9802 - v2.0"
                : selectedDomain.toLowerCase().includes("data")
                    ? "SSC/Q2101 - v1.0"
                    : "SSC/Q0508 - v2.0"} className="w-full text-[13px] font-mono bg-[#f5f5f7] border border-[#e5e7eb] rounded-xl px-3 py-2 text-[#86868b]"/>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">
                      Qualification Pack (Job Role)
                    </label>
                    <select value={selectedJobRoleId} onChange={(e) => setSelectedJobRoleId(e.target.value)} className="w-full text-[14px] bg-white border border-[#d2d2d7] rounded-xl px-3.5 py-2 text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20">
                      {jobRoles.map((role) => (<option key={role.id} value={role.id}>
                          {role.title} ({role.domain})
                        </option>))}
                    </select>
                  </div>

                  {/* 1-Click Role Chips */}
                  <div>
                    <div className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-2">
                      Popular Roles (1-Click)
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {jobRoles.slice(0, 4).map((role) => (<button key={role.id} type="button" onClick={() => {
                    setSelectedJobRoleId(role.id);
                    setSelectedDomain(role.domain);
                }} className={`px-3 py-1 rounded-full text-[12px] font-medium transition-all ${selectedJobRoleId === role.id
                    ? "bg-[#0071e3] text-white"
                    : "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e5e5ea]"}`}>
                          {role.title}
                        </button>))}
                    </div>
                  </div>
                </div>) : (
        /* Mode B: Live LinkedIn / Indeed Job Posting */
        <div className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">
                      Job Posting URL
                    </label>
                    <div className="relative">
                      <input type="url" placeholder="https://www.linkedin.com/jobs/view/..." value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} className="w-full text-[13px] bg-white border border-[#d2d2d7] rounded-xl pl-9 pr-3 py-2 text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20"/>
                      <LinkIcon className="h-4 w-4 text-[#86868b] absolute left-3 top-2.5"/>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">
                      Job Requirements / Description
                    </label>
                    <textarea rows={5} placeholder="Paste key responsibilities or skills required..." value={jobDescriptionText} onChange={(e) => setJobDescriptionText(e.target.value)} className="w-full text-[13px] font-mono bg-white border border-[#d2d2d7] rounded-xl p-3 text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20"/>
                  </div>

                  <div>
                    <div className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-2">
                      Sample Postings (1-Click)
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <button type="button" onClick={() => loadSampleLinkedInJob("frontend_fintech")} className="px-3 py-1 rounded-full text-[12px] bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e5e5ea] font-medium">
                        Sr. React Developer @ FinTech
                      </button>
                      <button type="button" onClick={() => loadSampleLinkedInJob("ev_powertrain")} className="px-3 py-1 rounded-full text-[12px] bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e5e5ea] font-medium">
                        EV Powertrain Engineer @ AutoTech
                      </button>
                    </div>
                  </div>
                </div>)}
            </div>

            <div className="mt-5 pt-4 border-t border-[#e5e7eb] flex items-center justify-between text-[12px] text-[#86868b]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#34c759]"/>
                NSQF Aligned
              </span>
              <a href="https://www.skillindiadigital.gov.in" target="_blank" rel="noreferrer" className="text-[#0071e3] font-medium hover:underline inline-flex items-center gap-1">
                Skill India Digital <ExternalLink className="h-3 w-3"/>
              </a>
            </div>
          </div>

          {/* Candidate Resume & Ingestion Column (7 Cols) */}
          <div className="lg:col-span-7 bg-white border border-[#e5e7eb] rounded-2xl p-6 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#0071e3]/10 text-[#0071e3] flex items-center justify-center">
                    <FileText className="h-4 w-4"/>
                  </div>
                  <div>
                    <h2 className="text-[16px] font-semibold text-[#1d1d1f]">Candidate Resume / CV</h2>
                    <p className="text-[12px] text-[#86868b]">Upload file or paste experience text</p>
                  </div>
                </div>
                <Badge variant="muted" className="text-[11px] font-medium">
                  Step 2
                </Badge>
              </div>

              {/* Upload Drop Zone */}
              <div onClick={() => fileInputRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file)
                handleFileSelection(file);
        }} className="border border-dashed border-[#d2d2d7] hover:border-[#0071e3] rounded-2xl p-6 text-center bg-[#f5f5f7]/60 hover:bg-[#0071e3]/5 transition-all cursor-pointer group">
                <input type="file" ref={fileInputRef} onChange={handleFileInputChange} accept=".pdf,.txt,.md,.rtf,.json,.csv" className="hidden"/>

                <div className="w-11 h-11 rounded-full bg-white border border-[#e5e7eb] flex items-center justify-center mx-auto mb-2.5 group-hover:scale-105 transition-transform">
                  <Upload className="h-5 w-5 text-[#0071e3]"/>
                </div>

                <div className="text-[14px] font-medium text-[#1d1d1f]">
                  Drop resume (PDF, TXT, MD) or <span className="text-[#0071e3] underline">Browse files</span>
                </div>
                <p className="text-[12px] text-[#86868b] mt-1">
                  Evaluated locally against official QP-NOS competency maps
                </p>

                {/* Uploaded File Chip */}
                {uploadedFileMeta && (<div className="mt-3.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#e5e7eb] text-[12px]">
                    <CheckCircle2 className="h-4 w-4 text-[#34c759]"/>
                    <span className="font-medium text-[#1d1d1f] truncate max-w-xs">{uploadedFileMeta.name}</span>
                    <span className="text-[#86868b]">({uploadedFileMeta.size})</span>
                  </div>)}
              </div>

              {/* File Parsing Warning */}
              {fileParseWarning && (<div className="p-3 rounded-xl bg-[#ff3b30]/10 border border-[#ff3b30]/20 text-[#ff3b30] text-[12px] flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-[#ff3b30] shrink-0 mt-0.5"/>
                  <span>{fileParseWarning}</span>
                </div>)}

              {/* Text Preview / Edit Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <button type="button" onClick={() => setShowTextPreview(!showTextPreview)} className="text-[13px] font-medium text-[#0071e3] hover:underline flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5"/>
                    {showTextPreview ? "Hide Resume Text" : "View / Edit Resume Text"}
                    {resumeText ? ` (${resumeText.length} chars)` : ""}
                  </button>
                  {resumeText && (<span className="text-[11px] text-[#34c759] font-medium">✓ Content loaded</span>)}
                </div>

                {showTextPreview && (<textarea rows={6} value={resumeText} onChange={(e) => setResumeText(e.target.value)} placeholder="Paste or edit resume text here..." className="w-full text-[13px] font-mono bg-white border border-[#d2d2d7] rounded-xl p-3 text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20"/>)}
              </div>

              {/* Sample Resumes */}
              <div>
                <div className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-2">
                  Load Pre-Verified Resumes (1-Click)
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => loadSampleResume("fullstack")} className="px-3 py-1 rounded-full text-[12px] bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e5e5ea] font-medium transition-colors">
                    Sample 1: Arun (React / Full Stack)
                  </button>
                  <button type="button" onClick={() => loadSampleResume("ev_tech")} className="px-3 py-1 rounded-full text-[12px] bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e5e5ea] font-medium transition-colors">
                    Sample 2: Aaditya (ITI EV Technician)
                  </button>
                  <button type="button" onClick={() => loadSampleResume("data_analyst")} className="px-3 py-1 rounded-full text-[12px] bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e5e5ea] font-medium transition-colors">
                    Sample 3: Priya (Data Analyst)
                  </button>
                </div>
              </div>
            </div>

            {/* Execution Buttons */}
            <div className="mt-5 pt-4 border-t border-[#e5e7eb] flex flex-col sm:flex-row items-center justify-between gap-3">
              <Button type="button" variant="outline" size="sm" onClick={resetInputs} className="rounded-full text-[13px] border-[#d2d2d7] text-[#1d1d1f] hover:bg-[#f5f5f7] h-[40px] px-5">
                Clear Inputs
              </Button>

              <Button type="button" onClick={runDiagnostic} disabled={analyzing} className="w-full sm:w-auto bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium text-[15px] rounded-full h-[44px] px-7 shadow-none flex items-center justify-center gap-2">
                {analyzing ? (<>
                    <RefreshCw className="h-4 w-4 animate-spin text-white"/>
                    <span>Evaluating Competencies...</span>
                  </>) : (<>
                    <Sparkles className="h-4 w-4"/>
                    <span>Run AI Diagnostic</span>
                  </>)}
              </Button>
            </div>
          </div>
        </div>

        {/* Diagnostic Results Section (Apple HomeView Cards & Metrics) */}
        {diagnosticResult && (<section className="bg-white border border-[#e5e7eb] rounded-2xl p-6 sm:p-8 space-y-7 animate-fade-in">
            {/* Header row */}
            <div className="border-b border-[#e5e7eb] pb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#0071e3]/10 text-[#0071e3] text-[12px] font-semibold mb-2">
                    <Brain className="h-3.5 w-3.5"/>
                    AUDIT REPORT
                  </div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-[#1d1d1f] tracking-tight">
                    Competency Benchmark Overview
                  </h2>
                  <div className="text-[13px] text-[#86868b] mt-1">
                    Evaluated against:{" "}
                    <strong className="text-[#1d1d1f] font-medium">{diagnosticResult.targetJobTitle}</strong> •{" "}
                    <span className="font-mono text-[#86868b]">{diagnosticResult.targetJobCode}</span> (
                    {diagnosticResult.targetNSQF})
                  </div>
                  <div className="mt-2.5">
                    {diagnosticResult.isGeminiPowered ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">
                        <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Generative AI: <strong>Google Gemini 1.5 Flash</strong></span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f5f5f7] text-[#1d1d1f] border border-[#e5e7eb] text-xs font-medium">
                        <Brain className="h-3.5 w-3.5 text-[#0071e3]" />
                        <span>Statutory Engine: <strong>PMKVY National Occupational Standards</strong></span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  <Button variant="outline" size="sm" onClick={() => window.print()} className="rounded-full text-[13px] border-[#d2d2d7] text-[#1d1d1f] hover:bg-[#f5f5f7] h-[38px] px-4">
                    <Download className="h-3.5 w-3.5 mr-1 text-[#86868b]"/>
                    Export PDF
                  </Button>
                  <Button size="sm" onClick={syncToProfile} disabled={savingProfile || profileSaved} className={`rounded-full text-[13px] font-medium h-[38px] px-5 shadow-none ${profileSaved
                ? "bg-[#34c759] text-white hover:bg-[#28a745]"
                : "bg-[#0071e3] text-white hover:bg-[#0077ed]"}`}>
                    {profileSaved ? (<>
                        <Check className="h-3.5 w-3.5 mr-1"/>
                        Saved to Passport
                      </>) : (<>
                        <ShieldCheck className="h-3.5 w-3.5 mr-1"/>
                        {savingProfile ? "Syncing..." : "Sync to Profile"}
                      </>)}
                  </Button>
                </div>
              </div>

              {/* Metric Cards Bento */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Gauge Card (2 Cols) */}
                <div className="lg:col-span-2 bg-[#f5f5f7] border border-[#e5e7eb] rounded-2xl p-5 flex items-center gap-5">
                  <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path className="text-[#e5e7eb]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5"/>
                      <path className={`${diagnosticResult.matchPercentage >= 75
                ? "text-[#34c759]"
                : diagnosticResult.matchPercentage >= 50
                    ? "text-[#0071e3]"
                    : "text-[#ff3b30]"}`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${diagnosticResult.matchPercentage}, 100`} strokeLinecap="round" strokeWidth="3.8"/>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-xl font-bold text-[#1d1d1f] leading-none">
                        {diagnosticResult.matchPercentage}%
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full mb-1 ${diagnosticResult.matchPercentage >= 75
                ? "bg-[#34c759]/10 text-[#248a3d]"
                : diagnosticResult.matchPercentage >= 50
                    ? "bg-[#0071e3]/10 text-[#0071e3]"
                    : "bg-[#ff3b30]/10 text-[#ff3b30]"}`}>
                      {diagnosticResult.readinessGrade}
                    </span>
                    <h3 className="text-[14px] font-semibold text-[#1d1d1f]">{diagnosticResult.advisory.headline}</h3>
                    <p className="text-[12px] text-[#86868b] mt-0.5 leading-relaxed">
                      {diagnosticResult.advisory.message}
                    </p>
                  </div>
                </div>

                {/* Total Evaluated */}
                <div className="bg-[#f5f5f7] border border-[#e5e7eb] rounded-2xl p-5 flex flex-col justify-between">
                  <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">
                    Total Skills
                  </span>
                  <div>
                    <div className="text-2xl font-bold text-[#1d1d1f]">
                      {diagnosticResult.summaryMetrics.totalEvaluated}
                    </div>
                    <div className="text-[12px] text-[#86868b]">NOS Units</div>
                  </div>
                  <div className="w-full bg-[#e5e7eb] h-1.5 rounded-full">
                    <div className="bg-[#1d1d1f] h-1.5 rounded-full w-full"/>
                  </div>
                </div>

                {/* Verified Match */}
                <div className="bg-[#f5f5f7] border border-[#e5e7eb] rounded-2xl p-5 flex flex-col justify-between">
                  <span className="text-[11px] font-semibold text-[#34c759] uppercase tracking-wider">
                    Matched Skills
                  </span>
                  <div>
                    <div className="text-2xl font-bold text-[#34c759]">
                      {diagnosticResult.summaryMetrics.matchedVerified}
                    </div>
                    <div className="text-[12px] text-[#86868b]">Verified</div>
                  </div>
                  <div className="w-full bg-[#e5e7eb] h-1.5 rounded-full">
                    <div className="bg-[#34c759] h-1.5 rounded-full" style={{
                width: `${diagnosticResult.summaryMetrics.totalEvaluated > 0
                    ? (diagnosticResult.summaryMetrics.matchedVerified /
                        diagnosticResult.summaryMetrics.totalEvaluated) *
                        100
                    : 0}%`,
            }}/>
                  </div>
                </div>

                {/* Critical Gaps */}
                <div className="bg-[#f5f5f7] border border-[#e5e7eb] rounded-2xl p-5 flex flex-col justify-between">
                  <span className="text-[11px] font-semibold text-[#ff3b30] uppercase tracking-wider">
                    Skill Gaps
                  </span>
                  <div>
                    <div className="text-2xl font-bold text-[#ff3b30]">
                      {diagnosticResult.summaryMetrics.criticalGaps}
                    </div>
                    <div className="text-[12px] text-[#86868b]">Remediation Needed</div>
                  </div>
                  <div className="w-full bg-[#e5e7eb] h-1.5 rounded-full">
                    <div className="bg-[#ff3b30] h-1.5 rounded-full" style={{
                width: `${diagnosticResult.summaryMetrics.totalEvaluated > 0
                    ? (diagnosticResult.summaryMetrics.criticalGaps /
                        diagnosticResult.summaryMetrics.totalEvaluated) *
                        100
                    : 0}%`,
            }}/>
                  </div>
                </div>
              </div>
            </div>

            {/* Competency Gap Matrix Table */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-[17px] font-semibold text-[#1d1d1f]">Competency & NOS Gap Matrix</h3>
                  <p className="text-[13px] text-[#86868b]">
                    Detailed breakdown cross-referenced with your resume evidence
                  </p>
                </div>

                {/* Search & Filter Tabs */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative">
                    <input type="text" placeholder="Filter competencies..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="text-[13px] bg-white border border-[#d2d2d7] rounded-full pl-8 pr-3 py-1.5 text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]"/>
                    <Search className="h-3.5 w-3.5 text-[#86868b] absolute left-3 top-2.5"/>
                  </div>

                  <div className="inline-flex p-1 bg-[#f5f5f7] rounded-full border border-[#e5e7eb] text-[12px]">
                    <button type="button" onClick={() => setActiveMatrixTab("ALL")} className={`px-3 py-1 rounded-full font-medium transition-all ${activeMatrixTab === "ALL"
                ? "bg-white text-[#1d1d1f] shadow-xs"
                : "text-[#86868b] hover:text-[#1d1d1f]"}`}>
                      All ({diagnosticResult.skillsMatrix.length})
                    </button>
                    <button type="button" onClick={() => setActiveMatrixTab("MATCHED")} className={`px-3 py-1 rounded-full font-medium transition-all ${activeMatrixTab === "MATCHED"
                ? "bg-white text-[#34c759] shadow-xs"
                : "text-[#86868b] hover:text-[#34c759]"}`}>
                      Matched ({diagnosticResult.summaryMetrics.matchedVerified})
                    </button>
                    <button type="button" onClick={() => setActiveMatrixTab("CRITICAL")} className={`px-3 py-1 rounded-full font-medium transition-all ${activeMatrixTab === "CRITICAL"
                ? "bg-white text-[#ff3b30] shadow-xs"
                : "text-[#86868b] hover:text-[#ff3b30]"}`}>
                      Gaps ({diagnosticResult.summaryMetrics.criticalGaps})
                    </button>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto border border-[#e5e7eb] rounded-2xl">
                <table className="w-full text-left border-collapse text-[13px]">
                  <thead>
                    <tr className="bg-[#f5f5f7] border-b border-[#e5e7eb] text-[11px] font-semibold uppercase tracking-wider text-[#86868b]">
                      <th className="py-3 px-4">NOS Code</th>
                      <th className="py-3 px-4">Competency Unit</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Evidence in Resume</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e5e7eb] bg-white">
                    {filteredSkills.length === 0 ? (<tr>
                        <td colSpan={5} className="py-8 text-center text-[#86868b]">
                          No competencies found matching your filter.
                        </td>
                      </tr>) : (filteredSkills.map((skill, idx) => (<tr key={idx} className="hover:bg-[#f5f5f7]/50 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-medium text-[#0071e3]">{skill.nosCode}</td>
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-[#1d1d1f]">{skill.skillName}</div>
                            <div className="text-[11px] text-[#86868b]">
                              Required: {skill.requiredProficiency}% • {skill.importance}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium ${skill.status === "MATCHED"
                    ? "bg-[#34c759]/10 text-[#248a3d]"
                    : skill.status === "ENHANCEMENT_NEEDED"
                        ? "bg-[#0071e3]/10 text-[#0071e3]"
                        : "bg-[#ff3b30]/10 text-[#ff3b30]"}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${skill.status === "MATCHED"
                    ? "bg-[#34c759]"
                    : skill.status === "ENHANCEMENT_NEEDED"
                        ? "bg-[#0071e3]"
                        : "bg-[#ff3b30]"}`}/>
                              {skill.statusLabel}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-[#86868b] max-w-md">
                            <div className="p-2.5 rounded-xl bg-[#f5f5f7] border border-[#e5e7eb] text-[12px] leading-relaxed text-[#1d1d1f]">
                              &quot;{skill.resumeEvidence}&quot;
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {skill.status === "MATCHED" ? (<span className="inline-flex items-center gap-1 text-[#34c759] font-medium text-[12px]">
                                <CheckCircle2 className="h-3.5 w-3.5"/> Verified
                              </span>) : (<button type="button" onClick={() => {
                        const course = diagnosticResult.recommendedCourses[0];
                        if (course)
                            setEnrollModalCourse(course);
                    }} className="inline-flex items-center gap-1 text-[12px] font-medium text-[#0071e3] hover:underline cursor-pointer">
                                Bridge Course <ArrowRight className="h-3 w-3"/>
                              </button>)}
                          </td>
                        </tr>)))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recommended PMKVY Bridge Courses */}
            <div className="pt-6 border-t border-[#e5e7eb] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-[17px] font-semibold text-[#1d1d1f] flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-[#0071e3]"/>
                    Recommended PMKVY 4.0 Bridge Courses
                  </h3>
                  <p className="text-[13px] text-[#86868b]">
                    Targeted training to bridge identified skill gaps
                  </p>
                </div>
                <Badge variant="success" className="text-[11px] font-medium self-start sm:self-auto">
                  100% Subsidized
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {diagnosticResult.recommendedCourses.map((course) => (<Card key={course.id} className="border-[#e5e7eb] rounded-2xl flex flex-col justify-between">
                    <CardHeader className="p-5 pb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#0071e3]/10 text-[#0071e3]">
                          {course.category}
                        </span>
                        <span className="text-[12px] text-[#86868b]">{course.duration}</span>
                      </div>
                      <CardTitle className="text-[15px] font-semibold text-[#1d1d1f] leading-snug">
                        {course.name}
                      </CardTitle>
                      <CardDescription className="text-[12px] text-[#86868b]">
                        {course.provider}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="p-5 pt-0 space-y-3">
                      <div>
                        <div className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wide mb-1.5">
                          Bridged Gaps:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {course.skillsAddressed.map((sk, i) => (<span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#ff3b30]/10 text-[#ff3b30]">
                              {sk}
                            </span>))}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-[#f5f5f7] text-[12px] text-[#1d1d1f] space-y-1">
                        <div>✓ {course.subsidyStatus}</div>
                        <div>✓ {course.stipend}</div>
                      </div>
                    </CardContent>

                    <CardFooter className="p-5 pt-0">
                      <Button size="sm" onClick={() => setEnrollModalCourse(course)} className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-[13px] font-medium rounded-full h-[38px] shadow-none">
                        Enroll via Skill India <ArrowRight className="h-3.5 w-3.5 ml-1"/>
                      </Button>
                    </CardFooter>
                  </Card>))}
              </div>
            </div>
          </section>)}

        {/* Enrollment Modal */}
        {enrollModalCourse && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs">
            <div className="bg-white rounded-3xl border border-[#e5e7eb] shadow-xl max-w-lg w-full p-6 sm:p-7 space-y-5 animate-fade-in">
              <div className="flex items-start justify-between border-b border-[#e5e7eb] pb-4">
                <div>
                  <span className="text-[11px] font-semibold text-[#0071e3] bg-[#0071e3]/10 px-2.5 py-0.5 rounded-full inline-block mb-1">
                    PMKVY 4.0 Direct Enrollment
                  </span>
                  <h3 className="text-[18px] font-semibold text-[#1d1d1f]">{enrollModalCourse.name}</h3>
                  <p className="text-[13px] text-[#86868b]">{enrollModalCourse.provider}</p>
                </div>
                <button type="button" onClick={() => setEnrollModalCourse(null)} className="text-[#86868b] hover:text-[#1d1d1f] text-sm font-bold cursor-pointer">
                  ✕
                </button>
              </div>

              <div className="space-y-3.5 text-[13px] text-[#1d1d1f]">
                <div className="p-4 bg-[#f5f5f7] rounded-2xl border border-[#e5e7eb] space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#86868b]">Accredited Body:</span>
                    <span className="font-medium text-[#1d1d1f]">NSDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#86868b]">Training Duration:</span>
                    <span className="font-medium text-[#1d1d1f]">{enrollModalCourse.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#86868b]">Tuition Fee:</span>
                    <span className="font-medium text-[#34c759]">100% Free Subsidized</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#86868b]">Candidate Stipend:</span>
                    <span className="font-medium text-[#34c759]">{enrollModalCourse.stipend}</span>
                  </div>
                </div>

                <p className="text-[13px] text-[#86868b] leading-relaxed">
                  Upon confirmation, your candidate profile is transmitted to the official Skill India Digital
                  training centre for instant batch scheduling.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e5e7eb]">
                <Button variant="outline" size="sm" onClick={() => setEnrollModalCourse(null)} className="rounded-full text-[13px] border-[#d2d2d7] text-[#1d1d1f] hover:bg-[#f5f5f7] h-[40px] px-5">
                  Cancel
                </Button>
                <a href={enrollModalCourse.officialPortalUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-6 py-2 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium text-[13px] h-[40px] transition-colors">
                  Confirm on Portal <ExternalLink className="h-3.5 w-3.5 ml-1"/>
                </a>
              </div>
            </div>
          </div>)}
      </div>
    </DashboardLayout>);
}
