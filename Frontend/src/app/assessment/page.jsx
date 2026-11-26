"use client";
// [FRONTEND] Domain Skill Assessment Wizard | Route: /assessment | Uses: GET/POST /api/assessment, DashboardLayout
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { EditorialPageHeader } from "@/components/story/EditorialPageHeader";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";

function parseQuestionOptions(raw) {
    if (Array.isArray(raw)) return raw;
    if (!raw || typeof raw !== "string") return [];
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export default function AssessmentPage() {
    const router = useRouter();
    const [jobRoles, setJobRoles] = useState([]);
    const [domains, setDomains] = useState([]);
    const [selectedDomain, setSelectedDomain] = useState("");
    const [selectedJobRoleId, setSelectedJobRoleId] = useState("");
    const [selectedJobRole, setSelectedJobRole] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentStep, setCurrentStep] = useState(1);
    const [responses, setResponses] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        apiFetch("/api/assessment")
            .then(async (res) => {
                const data = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(data.error || "Failed to load assessment catalog");
                return data;
            })
            .then((data) => {
                if (!active) return;
                setJobRoles(data.jobRoles || []);
                setDomains(data.domains || []);
                if (data.domains && data.domains.length > 0) {
                    setSelectedDomain(data.domains[0]);
                }
                setLoading(false);
            })
            .catch((err) => {
                if (!active) return;
                console.error("Error fetching job roles:", err);
                setError(err.message || "Failed to load job roles for assessment.");
                setLoading(false);
            });
        return () => {
            active = false;
        };
    }, []);

    const handleSelectJobRole = async (roleId) => {
        setSelectedJobRoleId(roleId);
        const role = jobRoles.find((r) => r.id === roleId);
        setSelectedJobRole(role);
        setLoading(true);
        setError("");
        try {
            const res = await apiFetch(`/api/assessment?jobRoleId=${roleId}`);
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.error || "Failed to load questions");
            setQuestions(data.questions || []);
            const initialResp = {};
            (data.questions || []).forEach((q) => {
                if (q.type === "RATING") {
                    initialResp[q.id] = { answer: "50", score: 50, display: "50%" };
                } else {
                    initialResp[q.id] = { answer: "0", display: "Option A" };
                }
            });
            setResponses(initialResp);
            setCurrentStep(2);
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to load assessment questions for this role.");
        } finally {
            setLoading(false);
        }
    };

    const handleRatingChange = (questionId, value) => {
        setResponses((prev) => ({
            ...prev,
            [questionId]: { answer: String(value), score: value, display: `${value}%` },
        }));
    };

    const handleMCQChange = (questionId, optionIndex) => {
        const letter = ["A", "B", "C", "D"][optionIndex] || String(optionIndex + 1);
        setResponses((prev) => ({
            ...prev,
            [questionId]: {
                answer: String(optionIndex),
                display: `Option ${letter}`,
            },
        }));
    };

    const handleSubmitAssessment = async () => {
        setSubmitting(true);
        setError("");
        try {
            const payload = {
                jobRoleId: selectedJobRoleId,
                responses: Object.entries(responses).map(([questionId, r]) => ({
                    questionId,
                    answer: r.answer,
                    ...(typeof r.score === "number" ? { score: r.score } : {}),
                })),
            };
            const res = await apiFetch("/api/assessment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                throw new Error(data.error || "Failed to submit assessment");
            }
            router.push(`/skill-gap?jobRoleId=${selectedJobRoleId}&completed=true`);
        } catch (err) {
            setError(err.message || "Failed to process assessment. Please try again.");
            setSubmitting(false);
        }
    };

    const technicalQuestions = questions.filter((q) => q.skill && q.skill.category === "TECHNICAL");
    const softQuestions = questions.filter((q) => q.skill && q.skill.category === "SOFT");
    const filteredRoles = jobRoles.filter((jr) => !selectedDomain || jr.domain === selectedDomain);

    if (loading && currentStep === 1) {
        return (
            <DashboardLayout>
                <div className="flex h-96 items-center justify-center">
                    <div className="text-center space-y-2">
                        <Loader2 className="h-8 w-8 animate-spin text-[#4F46E5] mx-auto" />
                        <p className="font-mono text-[12px] text-[#52525B]">Loading Skill Assessment Arena...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const stepsList = [
        { num: 1, label: "Select Role" },
        { num: 2, label: "Technical Skills" },
        { num: 3, label: "Soft Skills" },
        { num: 4, label: "Review & Submit" },
    ];

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-[12px] font-mono text-[#52525B]">
                    <Link href="/dashboard" className="hover:text-[#4F46E5]">Dashboard</Link>
                    <span className="text-[#D5D2CA]">/</span>
                    <span className="text-[#111113] font-medium">Technical MCQs &amp; Assessment Arena</span>
                </nav>

                {/* Editorial Header */}
                <EditorialPageHeader
                    variant="light"
                    eyebrow="ASSESSMENT ARENA • QP-NOS VERIFIED"
                    title="Competency &"
                    italicAccent="MCQ Practice Arena."
                    description="Benchmark your technical proficiency and workplace competencies against official industry job roles."
                    badges={
                        <>
                            <span className="px-3 py-1 rounded-full text-[11px] font-mono bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                                QP-NOS Verified
                            </span>
                            <span className="px-3 py-1 rounded-full text-[11px] font-mono bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]">
                                Timed Evaluation
                            </span>
                        </>
                    }
                />

                {/* Stepper Strip */}
                <div className="prepp-card p-3.5 flex items-center justify-between gap-2">
                    {stepsList.map((st, index) => (
                        <div key={st.num} className="flex items-center flex-1 last:flex-none">
                            <div
                                className={`flex items-center gap-2 text-[12px] font-medium ${
                                    currentStep >= st.num ? "text-[#111113]" : "text-[#52525B]"
                                }`}
                            >
                                <span
                                    className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-[11px] font-bold ${
                                        currentStep === st.num
                                            ? "bg-[#4F46E5] text-white"
                                            : currentStep > st.num
                                            ? "bg-[#10B981] text-white"
                                            : "bg-[#EFECE6] text-[#52525B] border border-[#E6E4DE]"
                                    }`}
                                >
                                    {currentStep > st.num ? "✓" : st.num}
                                </span>
                                <span className="hidden sm:inline">{st.label}</span>
                            </div>
                            {index < stepsList.length - 1 && (
                                <div className={`h-px flex-1 mx-3 ${currentStep > st.num ? "bg-[#10B981]" : "bg-[#E6E4DE]"}`} />
                            )}
                        </div>
                    ))}
                </div>

                {error && (
                    <div className="p-3.5 rounded-lg bg-[#FEF2F2] text-[#991B1B] text-[13px] border border-[#FECACA]">
                        {error}
                    </div>
                )}

                {/* STEP 1: Role Selection */}
                {currentStep === 1 && (
                    <div className="space-y-5">
                        <Card>
                            <CardHeader className="pb-3 border-b border-[#EFECE6]">
                                <CardTitle className="text-[16px]">Step 1: Select Industry Domain</CardTitle>
                                <CardDescription>Filter National Occupational Standard profiles by sector</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="flex flex-wrap gap-2">
                                    {domains.map((dom) => (
                                        <button
                                            key={dom}
                                            type="button"
                                            onClick={() => setSelectedDomain(dom)}
                                            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-colors cursor-pointer ${
                                                selectedDomain === dom
                                                    ? "bg-[#4F46E5] text-white border-[#4F46E5]"
                                                    : "bg-[#F6F5F0] text-[#52525B] border-[#E6E4DE] hover:border-[#D5D2CA]"
                                            }`}
                                        >
                                            {dom}
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3 border-b border-[#EFECE6]">
                                <CardTitle className="text-[16px]">Target Job Roles in {selectedDomain}</CardTitle>
                                <CardDescription>Click any job profile to start its competency assessment</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {filteredRoles.map((role, rIdx) => {
                                        const isSelected = selectedJobRoleId === role.id;
                                        const monogram = (role.title || "R").trim().charAt(0).toUpperCase();
                                        const palette = [
                                            "bg-[#111113] text-white",
                                            "bg-[#EEF4FF] text-[#2563EB]",
                                            "bg-[#ECFDF5] text-[#059669]",
                                            "bg-[#FFF7ED] text-[#EA580C]",
                                        ][rIdx % 4];
                                        return (
                                            <div
                                                key={role.id}
                                                onClick={() => handleSelectJobRole(role.id)}
                                                className={`prepp-card-interactive p-5.5 flex flex-col justify-between cursor-pointer ${
                                                    isSelected ? "ring-2 ring-[#4F46E5]" : ""
                                                }`}
                                            >
                                                <div>
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center font-display text-[14px] font-bold ${palette}`}>
                                                            {monogram}
                                                        </div>
                                                        <span className="rounded-lg border border-black/[0.07] bg-[#F7F8FA] px-2.5 py-1 text-[11px] font-medium text-[#52525B]">
                                                            {role.demandLevel || "High"} Demand
                                                        </span>
                                                    </div>

                                                    <div className="mt-4">
                                                        <div className="text-[11.5px] font-medium text-[#71717A]">
                                                            {role.domain}
                                                        </div>
                                                        <h4 className="font-display font-semibold text-[#111113] text-[17px] leading-snug mt-0.5">
                                                            {role.title}
                                                        </h4>
                                                    </div>

                                                    <p className="text-[12.5px] text-[#52525B] line-clamp-2 mt-2">
                                                        {role.description}
                                                    </p>

                                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                                        <span className="bento-chip">QP-NOS Aligned</span>
                                                        <span className="bento-chip">{role.minExperience || "0–2 Years"}</span>
                                                    </div>
                                                </div>

                                                <div className="mt-5 pt-4 border-t border-[#F0F1F3] flex items-center justify-between gap-2">
                                                    <div>
                                                        <div className="font-display text-[14px] font-bold text-[#111113]">
                                                            {role.avgSalary || "Industry Std"}
                                                        </div>
                                                        <div className="text-[10.5px] text-[#9CA3AF]">NSQF Benchmark</div>
                                                    </div>
                                                    <span className="rounded-xl bg-[#111113] text-white px-3.5 py-1.5 text-[12px] font-medium inline-flex items-center gap-1">
                                                        Start Drill <ArrowRight className="h-3 w-3" />
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* STEP 2: Technical Assessment Arena */}
                {currentStep === 2 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="font-display text-[18px] font-semibold text-[#111113]">
                                    Technical Competency Workbench
                                </h2>
                                <p className="text-[13px] text-[#52525B]">
                                    Target: <strong className="text-[#4F46E5]">{selectedJobRole?.title}</strong>
                                </p>
                            </div>
                            <Badge variant="default">Technical Questions ({technicalQuestions.length})</Badge>
                        </div>

                        {technicalQuestions.map((q, idx) => (
                            <Card key={q.id} className="overflow-hidden">
                                <div className="px-5 py-3 bg-[#F6F5F0] border-b border-[#E6E4DE] flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-[12px] font-semibold text-[#111113]">
                                            Question #{idx + 1} of {technicalQuestions.length}
                                        </span>
                                        <span className="text-[#D5D2CA]">•</span>
                                        <Badge variant="secondary">{q.skill?.name}</Badge>
                                    </div>
                                    <Badge variant={q.type === "RATING" ? "muted" : "warning"}>
                                        {q.type === "RATING" ? "Self Rating" : "MCQ Assessment"}
                                    </Badge>
                                </div>
                                <CardContent className="p-5 space-y-4">
                                    <p className="text-[15px] font-medium text-[#111113] leading-relaxed">{q.question}</p>

                                    {q.type === "RATING" ? (
                                        <div className="p-4 rounded-lg bg-[#F6F5F0] border border-[#E6E4DE] space-y-2.5">
                                            <div className="flex items-center justify-between text-[12px] font-mono text-[#52525B]">
                                                <span>Beginner (0%)</span>
                                                <span className="px-2 py-0.5 rounded bg-[#EAECFF] text-[#4F46E5] font-bold text-[13px]">
                                                    {responses[q.id]?.score || 50}%
                                                </span>
                                                <span>Expert (100%)</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                step="5"
                                                value={responses[q.id]?.score || 50}
                                                onChange={(e) => handleRatingChange(q.id, Number(e.target.value))}
                                                className="w-full accent-[#4F46E5] cursor-pointer h-2 bg-[#E6E4DE] rounded-lg"
                                            />
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {parseQuestionOptions(q.options).map((opt, optIdx) => {
                                                const letter = ["A", "B", "C", "D"][optIdx] || optIdx + 1;
                                                const isSelected = responses[q.id]?.answer === String(optIdx);
                                                return (
                                                    <label
                                                        key={optIdx}
                                                        className={`flex items-start gap-3 p-3 rounded-lg border text-[13px] cursor-pointer transition-all ${
                                                            isSelected
                                                                ? "border-[#4F46E5] bg-[#EEF0FF]/60 text-[#111113]"
                                                                : "border-[#E6E4DE] hover:border-[#D5D2CA] bg-white hover:bg-[#F6F5F0] text-[#27272A]"
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`q-${q.id}`}
                                                            checked={isSelected}
                                                            onChange={() => handleMCQChange(q.id, optIdx)}
                                                            className="mt-0.5 accent-[#4F46E5]"
                                                        />
                                                        <span className="flex-1">
                                                            <strong className="font-mono text-[#4F46E5] mr-1.5">{letter})</strong>
                                                            {opt}
                                                        </span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}

                        <div className="flex items-center justify-between pt-2">
                            <Button variant="outline" onClick={() => setCurrentStep(1)}>
                                <ArrowLeft className="h-4 w-4" /> Change Job Role
                            </Button>
                            <Button onClick={() => setCurrentStep(3)}>
                                Proceed to Soft Skills <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* STEP 3: Soft Skills */}
                {currentStep === 3 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="font-display text-[18px] font-semibold text-[#111113]">
                                    Workplace &amp; Soft Competencies
                                </h2>
                                <p className="text-[13px] text-[#52525B]">Evaluate communication, analytical, and collaboration skills</p>
                            </div>
                            <Badge variant="secondary">Soft Skills</Badge>
                        </div>

                        {softQuestions.length > 0 ? (
                            softQuestions.map((q, idx) => (
                                <Card key={q.id} className="overflow-hidden">
                                    <div className="px-5 py-3 bg-[#F6F5F0] border-b border-[#E6E4DE] flex items-center justify-between">
                                        <Badge variant="outline">{q.skill?.name}</Badge>
                                        <span className="font-mono text-[11px] text-[#52525B]">Soft Skill #{idx + 1}</span>
                                    </div>
                                    <CardContent className="p-5 space-y-4">
                                        <p className="text-[14px] font-medium text-[#111113]">{q.question}</p>
                                        {q.type === "RATING" ? (
                                            <div className="p-4 rounded-lg bg-[#F6F5F0] border border-[#E6E4DE] space-y-2">
                                                <div className="flex items-center justify-between font-mono text-[12px] text-[#52525B]">
                                                    <span>Developing (0%)</span>
                                                    <span className="text-[#4F46E5] font-bold">{responses[q.id]?.score || 50}%</span>
                                                    <span>Exemplary (100%)</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    step="5"
                                                    value={responses[q.id]?.score || 50}
                                                    onChange={(e) => handleRatingChange(q.id, Number(e.target.value))}
                                                    className="w-full accent-[#4F46E5] cursor-pointer h-2 bg-[#E6E4DE] rounded-lg"
                                                />
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {parseQuestionOptions(q.options).map((opt, optIdx) => (
                                                    <label
                                                        key={optIdx}
                                                        className={`flex items-start gap-3 p-3 rounded-lg border text-[13px] cursor-pointer ${
                                                            responses[q.id]?.answer === String(optIdx)
                                                                ? "border-[#4F46E5] bg-[#EEF0FF]/60 font-medium"
                                                                : "border-[#E6E4DE] hover:bg-[#F6F5F0]"
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`q-${q.id}`}
                                                            checked={responses[q.id]?.answer === String(optIdx)}
                                                            onChange={() => handleMCQChange(q.id, optIdx)}
                                                            className="mt-0.5 accent-[#4F46E5]"
                                                        />
                                                        <span>{opt}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Card className="p-6 text-center text-[#52525B] text-[13px]">
                                No additional soft skill prompts required for this Qualification Pack.
                            </Card>
                        )}

                        <div className="flex items-center justify-between pt-2">
                            <Button variant="outline" onClick={() => setCurrentStep(2)}>
                                <ArrowLeft className="h-4 w-4" /> Back to Technical
                            </Button>
                            <Button onClick={() => setCurrentStep(4)}>
                                Review Submission <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* STEP 4: Review & Submit */}
                {currentStep === 4 && (
                    <Card>
                        <CardHeader className="border-b border-[#EFECE6]">
                            <CardTitle>Review Assessment Submission</CardTitle>
                            <CardDescription>
                                Confirm your scores for <strong>{selectedJobRole?.title}</strong> before calculating skill gap
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-5 space-y-5">
                            <div className="p-4 rounded-xl bg-[#EEF0FF] border border-[#C7D2FE] flex items-center justify-between">
                                <div>
                                    <h4 className="font-display font-semibold text-[#111113]">{selectedJobRole?.title}</h4>
                                    <p className="font-mono text-[11px] text-[#52525B]">
                                        {selectedJobRole?.domain} • {questions.length} Assessed Competencies
                                    </p>
                                </div>
                                <Badge variant="success">Ready to Compute</Badge>
                            </div>

                            <div className="max-h-64 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                                {questions.map((q) => (
                                    <div key={q.id} className="flex items-center justify-between p-2.5 rounded-lg border border-[#E6E4DE] bg-[#F6F5F0] text-[13px]">
                                        <span className="font-medium text-[#111113]">{q.skill?.name}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-[11px] text-[#52525B] uppercase">
                                                {q.skill?.category}
                                            </span>
                                            <span className="font-mono font-bold text-[#4F46E5] min-w-16 text-right">
                                                {responses[q.id]?.display || (q.type === "RATING" ? "50%" : "Option A")}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="flex items-center justify-between border-t border-[#EFECE6] pt-4">
                            <Button variant="outline" onClick={() => setCurrentStep(3)} disabled={submitting}>
                                <ArrowLeft className="h-4 w-4" /> Edit Ratings
                            </Button>
                            <Button onClick={handleSubmitAssessment} disabled={submitting}>
                                {submitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Computing Skill Gap...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Submit &amp; View Skill Gap</span>
                                        <CheckCircle2 className="h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
}
