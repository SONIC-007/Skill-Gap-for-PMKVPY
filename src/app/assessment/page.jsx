"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, CheckCircle2, ArrowRight, ArrowLeft, Loader2, } from "lucide-react";
export default function AssessmentPage() {
    const router = useRouter();
    // State
    const [jobRoles, setJobRoles] = useState([]);
    const [domains, setDomains] = useState([]);
    const [selectedDomain, setSelectedDomain] = useState("");
    const [selectedJobRoleId, setSelectedJobRoleId] = useState("");
    const [selectedJobRole, setSelectedJobRole] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentStep, setCurrentStep] = useState(1); // 1: Select Role, 2: Technical Skills, 3: Soft Skills, 4: Review
    const [responses, setResponses] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    useEffect(() => {
        fetch("/api/assessment")
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
            const res = await fetch(`/api/assessment?jobRoleId=${roleId}`);
            const data = await res.json();
            setQuestions(data.questions || []);
            // Initialize default scores (50% self rating)
            const initialResp = {};
            (data.questions || []).forEach((q) => {
                if (q.type === "RATING") {
                    initialResp[q.id] = { answer: "50", score: 50 };
                }
                else {
                    initialResp[q.id] = { answer: "0", score: 100 };
                }
            });
            setResponses(initialResp);
            setCurrentStep(2);
        }
        catch (err) {
            console.error(err);
            setError("Failed to load assessment questions for this role.");
        }
        finally {
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
                score: isCorrect ? 100 : 30, // partial score for attempting
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
            const res = await fetch("/api/assessment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                throw new Error("Failed to submit assessment");
            }
            const resData = await res.json();
            router.push(`/skill-gap?jobRoleId=${selectedJobRoleId}&completed=true`);
        }
        catch (err) {
            setError(err.message || "Failed to process assessment. Please try again.");
            setSubmitting(false);
        }
    };
    // Filter technical and soft skills questions
    const technicalQuestions = questions.filter((q) => q.skill && q.skill.category === "TECHNICAL");
    const softQuestions = questions.filter((q) => q.skill && q.skill.category === "SOFT");
    const filteredRoles = jobRoles.filter((jr) => !selectedDomain || jr.domain === selectedDomain);
    if (loading && currentStep === 1) {
        return (<DashboardLayout>
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-blue-900 mx-auto mb-4"/>
            <p className="text-slate-500 font-medium">Loading assessment modules...</p>
          </div>
        </div>
      </DashboardLayout>);
    }
    return (<DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-16">
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
            <ClipboardCheck className="h-3.5 w-3.5"/> PMKVY Competency Framework
          </div>
          <h1 className="text-3xl font-bold text-blue-950">Skill Assessment</h1>
          <p className="text-slate-600">
            Assess your technical competencies and soft skills against industry job benchmarks.
          </p>
        </div>

        {/* Wizard Steps Indicator */}
        <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm flex items-center justify-between">
          <div className={`flex items-center gap-2 text-sm font-medium ${currentStep >= 1 ? "text-blue-900" : "text-slate-400"}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${currentStep >= 1 ? "bg-blue-900 text-white" : "bg-slate-200 text-slate-600"}`}>
              1
            </span>
            <span className="hidden sm:inline">Select Role</span>
          </div>
          <div className="h-[2px] flex-1 mx-3 bg-slate-200"/>
          <div className={`flex items-center gap-2 text-sm font-medium ${currentStep >= 2 ? "text-blue-900" : "text-slate-400"}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${currentStep >= 2 ? "bg-blue-900 text-white" : "bg-slate-200 text-slate-600"}`}>
              2
            </span>
            <span className="hidden sm:inline">Technical Skills</span>
          </div>
          <div className="h-[2px] flex-1 mx-3 bg-slate-200"/>
          <div className={`flex items-center gap-2 text-sm font-medium ${currentStep >= 3 ? "text-blue-900" : "text-slate-400"}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${currentStep >= 3 ? "bg-blue-900 text-white" : "bg-slate-200 text-slate-600"}`}>
              3
            </span>
            <span className="hidden sm:inline">Soft Skills</span>
          </div>
          <div className="h-[2px] flex-1 mx-3 bg-slate-200"/>
          <div className={`flex items-center gap-2 text-sm font-medium ${currentStep >= 4 ? "text-blue-900" : "text-slate-400"}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${currentStep >= 4 ? "bg-blue-900 text-white" : "bg-slate-200 text-slate-600"}`}>
              4
            </span>
            <span className="hidden sm:inline">Review & Submit</span>
          </div>
        </div>

        {error && (<div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm border border-red-200">
            {error}
          </div>)}

        {/* STEP 1: Select Career Field and Job Role */}
        {currentStep === 1 && (<div className="space-y-6">
            <Card className="border-blue-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Step 1: Select Your Target Career Field</CardTitle>
                <CardDescription>
                  Choose an industry domain to filter relevant PMKVY job roles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {domains.map((dom) => (<button key={dom} onClick={() => setSelectedDomain(dom)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${selectedDomain === dom
                    ? "bg-blue-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>
                      {dom}
                    </button>))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Target Job Roles in {selectedDomain}</CardTitle>
                <CardDescription>
                  Select the job profile you want to assess your skills against
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredRoles.map((role) => (<div key={role.id} onClick={() => handleSelectJobRole(role.id)} className={`p-5 rounded-xl border transition-all cursor-pointer hover:shadow-md hover:border-blue-400 ${selectedJobRoleId === role.id
                    ? "border-blue-900 bg-blue-50/50"
                    : "border-slate-200 bg-white"}`}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-bold text-blue-950 text-base">{role.title}</h4>
                        <Badge variant="secondary" className="shrink-0 text-xs">
                          {role.demandLevel} Demand
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                        {role.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                        <span>Salary: {role.avgSalary || "Industry Standard"}</span>
                        <span className="font-medium text-blue-700 flex items-center gap-1">
                          Select <ArrowRight className="h-3 w-3"/>
                        </span>
                      </div>
                    </div>))}
                </div>
              </CardContent>
            </Card>
          </div>)}

        {/* STEP 2: Technical Skills Assessment */}
        {currentStep === 2 && (<div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-blue-950">Technical Competency Assessment</h2>
                <p className="text-sm text-slate-600">
                  Target Role: <strong className="text-blue-900">{selectedJobRole?.title}</strong>
                </p>
              </div>
              <Badge variant="default">Technical Skills</Badge>
            </div>

            {technicalQuestions.map((q, idx) => (<Card key={q.id} className="border-blue-100 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {q.skill?.name}
                    </Badge>
                    <span className="text-xs text-slate-400">Question {idx + 1} of {technicalQuestions.length}</span>
                  </div>
                  <CardTitle className="text-base mt-2">{q.question}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {q.type === "RATING" ? (<div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Beginner (0%)</span>
                        <span className="font-bold text-blue-900 text-sm">
                          {responses[q.id]?.score || 50}%
                        </span>
                        <span>Expert (100%)</span>
                      </div>
                      <input type="range" min="0" max="100" step="5" value={responses[q.id]?.score || 50} onChange={(e) => handleRatingChange(q.id, Number(e.target.value))} className="w-full accent-blue-900 cursor-pointer h-2 bg-slate-200 rounded-lg"/>
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>No Experience</span>
                        <span>Basic Familiarity</span>
                        <span>Working Knowledge</span>
                        <span>Advanced</span>
                      </div>
                    </div>) : (<div className="space-y-2">
                      {JSON.parse(q.options || "[]").map((opt, optIdx) => (<label key={optIdx} className={`flex items-start gap-3 p-3 rounded-lg border text-sm cursor-pointer transition-colors ${responses[q.id]?.answer === String(optIdx)
                            ? "border-blue-900 bg-blue-50 text-blue-950 font-medium"
                            : "border-slate-200 hover:bg-slate-50 text-slate-700"}`}>
                          <input type="radio" name={`q-${q.id}`} checked={responses[q.id]?.answer === String(optIdx)} onChange={() => handleMCQChange(q.id, optIdx, q.correctAnswer || "0")} className="mt-0.5 accent-blue-900"/>
                          <span>{opt}</span>
                        </label>))}
                    </div>)}
                </CardContent>
              </Card>))}

            <div className="flex items-center justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                <ArrowLeft className="h-4 w-4 mr-1"/> Change Job Role
              </Button>
              <Button onClick={() => setCurrentStep(3)}>
                Proceed to Soft Skills <ArrowRight className="h-4 w-4 ml-1"/>
              </Button>
            </div>
          </div>)}

        {/* STEP 3: Soft Skills Assessment */}
        {currentStep === 3 && (<div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-blue-950">Soft Skills & Workplace Competencies</h2>
                <p className="text-sm text-slate-600">
                  Assess collaborative, analytical, and professional competencies
                </p>
              </div>
              <Badge variant="secondary">Soft Skills</Badge>
            </div>

            {softQuestions.length > 0 ? (softQuestions.map((q, idx) => (<Card key={q.id} className="border-blue-100 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {q.skill?.name}
                      </Badge>
                      <span className="text-xs text-slate-400">Soft Skill {idx + 1}</span>
                    </div>
                    <CardTitle className="text-base mt-2">{q.question}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {q.type === "RATING" ? (<div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>Developing (0%)</span>
                          <span className="font-bold text-blue-900 text-sm">
                            {responses[q.id]?.score || 50}%
                          </span>
                          <span>Exemplary (100%)</span>
                        </div>
                        <input type="range" min="0" max="100" step="5" value={responses[q.id]?.score || 50} onChange={(e) => handleRatingChange(q.id, Number(e.target.value))} className="w-full accent-blue-900 cursor-pointer h-2 bg-slate-200 rounded-lg"/>
                      </div>) : (<div className="space-y-2">
                        {JSON.parse(q.options || "[]").map((opt, optIdx) => (<label key={optIdx} className={`flex items-start gap-3 p-3 rounded-lg border text-sm cursor-pointer transition-colors ${responses[q.id]?.answer === String(optIdx)
                            ? "border-blue-900 bg-blue-50 text-blue-950 font-medium"
                            : "border-slate-200 hover:bg-slate-50 text-slate-700"}`}>
                            <input type="radio" name={`q-${q.id}`} checked={responses[q.id]?.answer === String(optIdx)} onChange={() => handleMCQChange(q.id, optIdx, q.correctAnswer || "0")} className="mt-0.5 accent-blue-900"/>
                            <span>{opt}</span>
                          </label>))}
                      </div>)}
                  </CardContent>
                </Card>))) : (<Card className="p-6 text-center text-slate-500">
                <p>No additional soft skill questions required for this role.</p>
              </Card>)}

            <div className="flex items-center justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                <ArrowLeft className="h-4 w-4 mr-1"/> Back to Technical
              </Button>
              <Button onClick={() => setCurrentStep(4)}>
                Review Responses <ArrowRight className="h-4 w-4 ml-1"/>
              </Button>
            </div>
          </div>)}

        {/* STEP 4: Review and Submit */}
        {currentStep === 4 && (<div className="space-y-6">
            <Card className="border-blue-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Review Assessment Submission</CardTitle>
                <CardDescription>
                  Confirm your ratings for <strong>{selectedJobRole?.title}</strong> before calculating your skill gap.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-blue-950">{selectedJobRole?.title}</h4>
                    <p className="text-xs text-slate-600">{selectedJobRole?.domain} • {questions.length} Total Assessed Competencies</p>
                  </div>
                  <Badge variant="default">Ready to Calculate</Badge>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-slate-700">Assessed Skill Ratings Summary:</h4>
                  <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                    {questions.map((q) => (<div key={q.id} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 text-sm">
                        <span className="font-medium text-slate-800">{q.skill?.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-500 capitalize">{q.skill?.category.toLowerCase()}</span>
                          <span className="font-bold text-blue-900 w-12 text-right">
                            {responses[q.id]?.score || 0}%
                          </span>
                        </div>
                      </div>))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t border-slate-100 pt-6">
                <Button variant="outline" onClick={() => setCurrentStep(3)} disabled={submitting}>
                  <ArrowLeft className="h-4 w-4 mr-1"/> Edit Ratings
                </Button>
                <Button onClick={handleSubmitAssessment} disabled={submitting} className="bg-blue-900 hover:bg-blue-800">
                  {submitting ? (<>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                      Computing Skill Gap...
                    </>) : (<>
                      Submit & View Skill Gap
                      <CheckCircle2 className="h-4 w-4 ml-1"/>
                    </>)}
                </Button>
              </CardFooter>
            </Card>
          </div>)}
      </div>
    </DashboardLayout>);
}
