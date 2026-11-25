"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, CheckCircle2, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";

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
        apiFetch("/api/assessment")
            .then((res) => res.json())
            .then((data) => {
                setJobRoles(data.jobRoles || []);
                setDomains(data.domains || []);
                if (data.domains && data.domains.length > 0) {
                    setSelectedDomain(data.domains[0]);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching job roles:", err);
                setLoading(false);
            });
    }, []);

    const handleSelectJobRole = async (roleId) => {
        setSelectedJobRoleId(roleId);
        const role = jobRoles.find((r) => r.id === roleId);
        setSelectedJobRole(role);
        setLoading(true);
        try {
            const res = await apiFetch(`/api/assessment?jobRoleId=${roleId}`);
            const data = await res.json();
            setQuestions(data.questions || []);
            const initialResp = {};
            (data.questions || []).forEach((q) => {
                if (q.type === "RATING") {
                    initialResp[q.id] = { answer: "50", score: 50 };
                } else {
                    initialResp[q.id] = { answer: "0", score: 100 };
                }
            });
            setResponses(initialResp);
            setCurrentStep(2);
        } catch (err) {
            console.error(err);
            setError("Failed to load assessment questions for this role.");
        } finally {
            setLoading(false);
        }
    };

    const handleRatingChange = (questionId, value) => {
        setResponses((prev) => ({
            ...prev,
            [questionId]: { answer: String(value), score: value },
        }));
    };

    const handleMCQChange = (questionId, optionIndex, correctIndex) => {
        const isCorrect = String(optionIndex) === correctIndex;
        setResponses((prev) => ({
            ...prev,
            [questionId]: {
                answer: String(optionIndex),
                score: isCorrect ? 100 : 30,
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
                    score: r.score,
                })),
            };
            const res = await apiFetch("/api/assessment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                throw new Error("Failed to submit assessment");
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
                        <p className="font-mono text-[12px] text-[#64748B]">Loading Skill Assessment Arena...</p>
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
                <nav className="flex items-center gap-2 text-[12px] font-mono text-[#64748B]">
                    <Link href="/dashboard" className="hover:text-[#4F46E5]">Dashboard</Link>
                    <span className="text-[#CBD5E1]">/</span>
                    <span className="text-[#0F172A] font-medium">Technical MCQs &amp; Assessment Arena</span>
                </nav>

                {/* Header */}
                <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <h1 className="font-display text-2xl sm:text-[28px] font-semibold text-[#0F172A] tracking-tight">
                            Competency &amp; MCQ Practice Arena
                        </h1>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                            QP-NOS Verified
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]">
                            Skill Assessment Engine
                        </span>
                    </div>
                    <p className="text-[14px] text-[#64748B]">
                        Benchmark your technical proficiency and workplace competencies against official industry job roles.
                    </p>
                </div>

                {/* Stepper Strip */}
                <div className="prepp-card p-3.5 flex items-center justify-between gap-2">
                    {stepsList.map((st, index) => (
                        <div key={st.num} className="flex items-center flex-1 last:flex-none">
                            <div
                                className={`flex items-center gap-2 text-[12px] font-medium ${
                                    currentStep >= st.num ? "text-[#0F172A]" : "text-[#64748B]"
                                }`}
                            >
                                <span
                                    className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-[11px] font-bold ${
                                        currentStep === st.num
                                            ? "bg-[#4F46E5] text-white"
                                            : currentStep > st.num
                                            ? "bg-[#10B981] text-white"
                                            : "bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]"
                                    }`}
                                >
                                    {currentStep > st.num ? "✓" : st.num}
                                </span>
                                <span className="hidden sm:inline">{st.label}</span>
                            </div>
                            {index < stepsList.length - 1 && (
                                <div className={`h-px flex-1 mx-3 ${currentStep > st.num ? "bg-[#10B981]" : "bg-[#E2E8F0]"}`} />
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
                            <CardHeader className="pb-3 border-b border-[#F1F5F9]">
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
                                                    : "bg-[#F8FAFC] text-[#464555] border-[#E2E8F0] hover:border-[#CBD5E1]"
                                            }`}
                                        >
                                            {dom}
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3 border-b border-[#F1F5F9]">
                                <CardTitle className="text-[16px]">Target Job Roles in {selectedDomain}</CardTitle>
                                <CardDescription>Click any job profile to start its competency assessment</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                    {filteredRoles.map((role) => (
                                        <div
                                            key={role.id}
                                            onClick={() => handleSelectJobRole(role.id)}
                                            className={`p-4 rounded-xl border transition-all cursor-pointer hover:border-[#4F46E5]/50 hover:shadow-[0_1px_3px_rgba(79,70,229,0.08)] ${
                                                selectedJobRoleId === role.id
                                                    ? "border-[#4F46E5] bg-[#F2F3FF]"
                                                    : "border-[#E2E8F0] bg-white"
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-2 mb-1.5">
                                                <h4 className="font-display font-semibold text-[#0F172A] text-[15px]">
                                                    {role.title}
                                                </h4>
                                                <Badge variant="secondary">{role.demandLevel || "High"} Demand</Badge>
                                            </div>
                                            <p className="text-[12px] text-[#64748B] line-clamp-2 mb-3">{role.description}</p>
                                            <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B] pt-2.5 border-t border-[#F1F5F9]">
                                                <span>{role.avgSalary || "Industry Standard"}</span>
                                                <span className="font-semibold text-[#4F46E5] flex items-center gap-1">
                                                    Launch Drill <ArrowRight className="h-3 w-3" />
                                                </span>
                                            </div>
                                        </div>
                                    ))}
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
                                <h2 className="font-display text-[18px] font-semibold text-[#0F172A]">
                                    Technical Competency Workbench
                                </h2>
                                <p className="text-[13px] text-[#64748B]">
                                    Target: <strong className="text-[#4F46E5]">{selectedJobRole?.title}</strong>
                                </p>
                            </div>
                            <Badge variant="default">Technical Questions ({technicalQuestions.length})</Badge>
                        </div>

                        {technicalQuestions.map((q, idx) => (
                            <Card key={q.id} className="overflow-hidden">
                                <div className="px-5 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-[12px] font-semibold text-[#0F172A]">
                                            Question #{idx + 1} of {technicalQuestions.length}
                                        </span>
                                        <span className="text-[#CBD5E1]">•</span>
                                        <Badge variant="secondary">{q.skill?.name}</Badge>
                                    </div>
                                    <Badge variant={q.type === "RATING" ? "muted" : "warning"}>
                                        {q.type === "RATING" ? "Self Rating" : "MCQ Assessment"}
                                    </Badge>
                                </div>
                                <CardContent className="p-5 space-y-4">
                                    <p className="text-[15px] font-medium text-[#0F172A] leading-relaxed">{q.question}</p>

                                    {q.type === "RATING" ? (
                                        <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-2.5">
                                            <div className="flex items-center justify-between text-[12px] font-mono text-[#64748B]">
                                                <span>Beginner (0%)</span>
                                                <span className="px-2 py-0.5 rounded bg-[#EAEDFF] text-[#3525CD] font-bold text-[13px]">
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
                                                className="w-full accent-[#4F46E5] cursor-pointer h-2 bg-[#E2E8F0] rounded-lg"
                                            />
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {JSON.parse(q.options || "[]").map((opt, optIdx) => {
                                                const letter = ["A", "B", "C", "D"][optIdx] || optIdx + 1;
                                                const isSelected = responses[q.id]?.answer === String(optIdx);
                                                return (
                                                    <label
                                                        key={optIdx}
                                                        className={`flex items-start gap-3 p-3 rounded-lg border text-[13px] cursor-pointer transition-all ${
                                                            isSelected
                                                                ? "border-[#4F46E5] bg-[#F2F3FF]/60 text-[#0F172A]"
                                                                : "border-[#E2E8F0] hover:border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#334155]"
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`q-${q.id}`}
                                                            checked={isSelected}
                                                            onChange={() => handleMCQChange(q.id, optIdx, q.correctAnswer || "0")}
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
                                <h2 className="font-display text-[18px] font-semibold text-[#0F172A]">
                                    Workplace &amp; Soft Competencies
                                </h2>
                                <p className="text-[13px] text-[#64748B]">Evaluate communication, analytical, and collaboration skills</p>
                            </div>
                            <Badge variant="secondary">Soft Skills</Badge>
                        </div>

                        {softQuestions.length > 0 ? (
                            softQuestions.map((q, idx) => (
                                <Card key={q.id} className="overflow-hidden">
                                    <div className="px-5 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
                                        <Badge variant="outline">{q.skill?.name}</Badge>
                                        <span className="font-mono text-[11px] text-[#64748B]">Soft Skill #{idx + 1}</span>
                                    </div>
                                    <CardContent className="p-5 space-y-4">
                                        <p className="text-[14px] font-medium text-[#0F172A]">{q.question}</p>
                                        {q.type === "RATING" ? (
                                            <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                                                <div className="flex items-center justify-between font-mono text-[12px] text-[#64748B]">
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
                                                    className="w-full accent-[#4F46E5] cursor-pointer h-2 bg-[#E2E8F0] rounded-lg"
                                                />
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {JSON.parse(q.options || "[]").map((opt, optIdx) => (
                                                    <label
                                                        key={optIdx}
                                                        className={`flex items-start gap-3 p-3 rounded-lg border text-[13px] cursor-pointer ${
                                                            responses[q.id]?.answer === String(optIdx)
                                                                ? "border-[#4F46E5] bg-[#F2F3FF]/60 font-medium"
                                                                : "border-[#E2E8F0] hover:bg-[#F8FAFC]"
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`q-${q.id}`}
                                                            checked={responses[q.id]?.answer === String(optIdx)}
                                                            onChange={() => handleMCQChange(q.id, optIdx, q.correctAnswer || "0")}
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
                            <Card className="p-6 text-center text-[#64748B] text-[13px]">
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
                        <CardHeader className="border-b border-[#F1F5F9]">
                            <CardTitle>Review Assessment Submission</CardTitle>
                            <CardDescription>
                                Confirm your scores for <strong>{selectedJobRole?.title}</strong> before calculating skill gap
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-5 space-y-5">
                            <div className="p-4 rounded-xl bg-[#F2F3FF] border border-[#C7C4D8] flex items-center justify-between">
                                <div>
                                    <h4 className="font-display font-semibold text-[#0F172A]">{selectedJobRole?.title}</h4>
                                    <p className="font-mono text-[11px] text-[#464555]">
                                        {selectedJobRole?.domain} • {questions.length} Assessed Competencies
                                    </p>
                                </div>
                                <Badge variant="success">Ready to Compute</Badge>
                            </div>

                            <div className="max-h-64 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                                {questions.map((q) => (
                                    <div key={q.id} className="flex items-center justify-between p-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[13px]">
                                        <span className="font-medium text-[#0F172A]">{q.skill?.name}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-[11px] text-[#64748B] uppercase">
                                                {q.skill?.category}
                                            </span>
                                            <span className="font-mono font-bold text-[#4F46E5] w-12 text-right">
                                                {responses[q.id]?.score || 0}%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="flex items-center justify-between border-t border-[#F1F5F9] pt-4">
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
