"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, GraduationCap, Sparkles, CheckCircle2, Building, ArrowRight, ExternalLink, Loader2, MapPin, X, Search, } from "lucide-react";
function CoursesContent() {
    const searchParams = useSearchParams();
    const initialSkillFilter = searchParams.get("skill") || "";
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedDifficulty, setSelectedDifficulty] = useState("");
    const [searchQuery, setSearchQuery] = useState(initialSkillFilter);
    const [loading, setLoading] = useState(true);
    // Enrollment modal state
    const [selectedCourseForEnroll, setSelectedCourseForEnroll] = useState(null);
    const [isEnrollingLocal, setIsEnrollingLocal] = useState(false);
    const [enrolledSuccessId, setEnrolledSuccessId] = useState(null);
    const fetchCourses = () => {
        let url = "/api/courses?";
        if (selectedCategory)
            url += `category=${encodeURIComponent(selectedCategory)}&`;
        if (selectedDifficulty)
            url += `difficulty=${encodeURIComponent(selectedDifficulty)}&`;
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
            setCourses(data.courses || []);
            setCategories(data.categories || []);
            setLoading(false);
        })
            .catch((err) => {
            console.error(err);
            setLoading(false);
        });
    };
    useEffect(() => {
        fetchCourses();
    }, [selectedCategory, selectedDifficulty]);
    const handleEnrollAndSave = async (courseId) => {
        setIsEnrollingLocal(true);
        try {
            const res = await fetch("/api/enroll", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ courseId }),
            });
            const data = await res.json();
            if (!res.ok && data.error !== "Already enrolled") {
                throw new Error(data.error || "Enrollment failed");
            }
            setEnrolledSuccessId(courseId);
            fetchCourses();
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setIsEnrollingLocal(false);
        }
    };
    const handleOpenGovPortal = (url) => {
        if (selectedCourseForEnroll) {
            handleEnrollAndSave(selectedCourseForEnroll.id);
        }
        window.open(url, "_blank", "noopener,noreferrer");
    };
    const filteredCourses = courses.filter((c) => {
        if (!searchQuery)
            return true;
        const q = searchQuery.toLowerCase();
        return (c.name.toLowerCase().includes(q) ||
            (c.description && c.description.toLowerCase().includes(q)) ||
            c.skillsCovered.some((s) => s.toLowerCase().includes(q)));
    });
    return (<div className="space-y-6 max-w-6xl mx-auto pb-16 font-sans">
      {/* Apple HomeView Header */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0071e3]/10 text-[#0071e3] text-[12px] font-semibold mb-3">
              <BookOpen className="h-3.5 w-3.5"/>
              <span>Skill Gap Remediation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f]">
              PMKVY Training Courses
            </h1>
            <p className="text-[14px] text-[#86868b] mt-1 max-w-2xl leading-relaxed">
              Explore 100% government-subsidized courses aligned with National Occupational Standards (QP-NOS)
              to bridge critical competency gaps.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <a href="https://www.skillindiadigital.gov.in" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#d2d2d7] text-[#1d1d1f] hover:bg-[#f5f5f7] text-[13px] font-medium transition-colors">
              <span>Skill India Digital</span>
              <ExternalLink className="h-3 w-3 text-[#86868b]"/>
            </a>
            <Link href="/progress">
              <Button className="bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-full text-[13px] font-medium h-[38px] px-4 shadow-none">
                My Progress →
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="relative">
            <label className="text-[12px] font-medium text-[#1d1d1f] mb-1 block">Search Skill or Keyword</label>
            <div className="relative">
              <input type="text" placeholder="e.g. React, Python, EV, Docker..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full text-[13px] border border-[#d2d2d7] rounded-xl pl-9 pr-3 py-2 text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20"/>
              <Search className="h-4 w-4 text-[#86868b] absolute left-3 top-2.5"/>
            </div>
          </div>

          <div>
            <label className="text-[12px] font-medium text-[#1d1d1f] mb-1 block">Domain / Category</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full text-[13px] border border-[#d2d2d7] rounded-xl px-3 py-2 bg-white text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20">
              <option value="">All Domains ({categories.length})</option>
              {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
            </select>
          </div>

          <div>
            <label className="text-[12px] font-medium text-[#1d1d1f] mb-1 block">Difficulty Level</label>
            <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)} className="w-full text-[13px] border border-[#d2d2d7] rounded-xl px-3 py-2 bg-white text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20">
              <option value="">All Levels</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (<div className="flex h-64 items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-[#0071e3]"/>
        </div>) : filteredCourses.length === 0 ? (<div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[#e5e7eb]">
          <BookOpen className="h-10 w-10 text-[#86868b] mx-auto mb-2 opacity-40"/>
          <h3 className="text-[16px] font-semibold text-[#1d1d1f]">No matching courses</h3>
          <p className="text-[13px] text-[#86868b] mt-1">Try resetting the domain or keyword filters</p>
          <Button variant="outline" size="sm" className="mt-4 rounded-full text-[13px] border-[#d2d2d7]" onClick={() => {
                setSelectedCategory("");
                setSelectedDifficulty("");
                setSearchQuery("");
            }}>
            Reset Filters
          </Button>
        </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((c) => (<Card key={c.id} className="border-[#e5e7eb] rounded-2xl flex flex-col justify-between hover:border-[#0071e3]/30 transition-all">
              <CardHeader className="p-5 pb-2">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#0071e3]/10 text-[#0071e3]">
                    {c.category}
                  </span>
                  {c.relevanceScore > 0 && (<span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#34c759] bg-[#34c759]/10 px-2 py-0.5 rounded-full">
                      <Sparkles className="h-3 w-3"/> Gap Match
                    </span>)}
                </div>
                <CardTitle className="text-[16px] font-semibold text-[#1d1d1f] line-clamp-2 leading-snug">
                  {c.name}
                </CardTitle>
                <CardDescription className="text-[12px] flex items-center gap-1.5 pt-1 text-[#86868b]">
                  <Building className="h-3.5 w-3.5 shrink-0"/>
                  <span className="truncate">{c.provider || "National Skill Training Partner"}</span>
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 pt-1 space-y-3.5 text-[13px] text-[#86868b]">
                <p className="line-clamp-3 leading-relaxed text-[#1d1d1f]">{c.description}</p>

                <div className="flex items-center justify-between pt-2 border-t border-[#e5e7eb] text-[12px] text-[#86868b]">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5"/> {c.duration || "Self-Paced"}
                  </span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#f5f5f7] text-[#1d1d1f]">
                    {c.difficulty}
                  </span>
                </div>

                <div>
                  <span className="font-medium text-[#1d1d1f] text-[12px] block mb-1">Key Skills:</span>
                  <div className="flex flex-wrap gap-1">
                    {c.skillsCovered.map((sk) => (<span key={sk} className="px-2 py-0.5 rounded-full bg-[#f5f5f7] text-[#1d1d1f] text-[11px] font-medium">
                        {sk}
                      </span>))}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-5 pt-3 border-t border-[#e5e7eb] flex items-center justify-between gap-2">
                <span className="text-[11px] text-[#86868b]">NSQF Aligned</span>
                {c.isEnrolled ? (<div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[#248a3d] bg-[#34c759]/10 px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="h-3.5 w-3.5"/> Enrolled
                    </span>
                    <Button size="sm" variant="outline" className="rounded-full text-[12px] h-[34px] border-[#d2d2d7]" onClick={() => setSelectedCourseForEnroll(c)}>
                      Options ↗
                    </Button>
                  </div>) : (<Button size="sm" className="bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-full text-[12px] font-medium h-[36px] px-4 shadow-none" onClick={() => setSelectedCourseForEnroll(c)}>
                    <GraduationCap className="h-3.5 w-3.5 mr-1"/>
                    Enroll (Free)
                  </Button>)}
              </CardFooter>
            </Card>))}
        </div>)}

      {/* POPUP MODAL: PMKVY Official Enrollment & Portal Guide */}
      {selectedCourseForEnroll && (<div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in">
          <Card className="w-full max-w-lg bg-white shadow-2xl border border-[#e5e7eb] rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-[#e5e7eb] relative bg-[#fbfbfd]">
              <button onClick={() => setSelectedCourseForEnroll(null)} className="absolute right-5 top-5 text-[#86868b] hover:text-[#1d1d1f] text-sm font-bold cursor-pointer">
                <X className="h-5 w-5"/>
              </button>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-semibold text-[#0071e3] bg-[#0071e3]/10 px-2.5 py-0.5 rounded-full">
                  PMKVY 4.0 Subsidized Course
                </span>
              </div>
              <h3 className="text-[18px] font-semibold text-[#1d1d1f] leading-snug">
                {selectedCourseForEnroll.name}
              </h3>
              <p className="text-[12px] text-[#86868b] mt-0.5">
                {selectedCourseForEnroll.provider} • {selectedCourseForEnroll.duration}
              </p>
            </div>

            <CardContent className="p-6 space-y-4 text-[13px]">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#34c759]/10 text-[#248a3d] border border-[#34c759]/20">
                  <span className="font-semibold block text-[13px]">100% Free Tuition</span>
                  <span className="text-[11px] opacity-90">Fully subsidized under PMKVY.</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#0071e3]/10 text-[#0071e3] border border-[#0071e3]/20">
                  <span className="font-semibold block text-[13px]">NSQF Verified</span>
                  <span className="text-[11px] opacity-90">National recognition by NSDC.</span>
                </div>
              </div>

              <div className="space-y-2.5 pt-1">
                <h4 className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">
                  Select Enrollment Method
                </h4>

                <button onClick={() => handleOpenGovPortal("https://www.skillindiadigital.gov.in/courses")} className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-[#e5e7eb] hover:border-[#0071e3] hover:bg-[#0071e3]/5 transition-all text-left cursor-pointer group">
                  <div>
                    <h5 className="font-semibold text-[#1d1d1f] text-[13px] group-hover:text-[#0071e3] flex items-center gap-1.5">
                      Register on Skill India Digital Portal
                      <ExternalLink className="h-3.5 w-3.5 text-[#86868b]"/>
                    </h5>
                    <p className="text-[11px] text-[#86868b]">
                      Direct online batch enrollment via skillindiadigital.gov.in
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#86868b] group-hover:text-[#0071e3]"/>
                </button>

                <button onClick={() => handleOpenGovPortal("https://www.pmkvyofficial.org/find-a-training-centre")} className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-[#e5e7eb] hover:border-[#0071e3] hover:bg-[#0071e3]/5 transition-all text-left cursor-pointer group">
                  <div>
                    <h5 className="font-semibold text-[#1d1d1f] text-[13px] flex items-center gap-1.5">
                      Find Nearest PMKK Training Centre
                      <MapPin className="h-3.5 w-3.5 text-[#0071e3]"/>
                    </h5>
                    <p className="text-[11px] text-[#86868b]">
                      Locate physical classrooms in your district
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-[#86868b]"/>
                </button>

                <button onClick={() => {
                handleEnrollAndSave(selectedCourseForEnroll.id);
                setSelectedCourseForEnroll(null);
            }} disabled={isEnrollingLocal} className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-[#e5e7eb] hover:bg-[#f5f5f7] transition-all text-left cursor-pointer">
                  <div>
                    <h5 className="font-semibold text-[#1d1d1f] text-[13px]">
                      Track Course in Dashboard
                    </h5>
                    <p className="text-[11px] text-[#86868b]">
                      Save to your profile to record learning milestones
                    </p>
                  </div>
                  {isEnrollingLocal ? (<Loader2 className="h-4 w-4 animate-spin text-[#0071e3]"/>) : (<CheckCircle2 className="h-4 w-4 text-[#86868b]"/>)}
                </button>
              </div>
            </CardContent>

            <CardFooter className="p-4 bg-[#fbfbfd] border-t border-[#e5e7eb] flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setSelectedCourseForEnroll(null)} className="rounded-full text-[12px] border-[#d2d2d7]">
                Close
              </Button>
            </CardFooter>
          </Card>
        </div>)}
    </div>);
}
export default function CoursesPage() {
    return (<DashboardLayout>
      <Suspense fallback={<div className="flex h-96 items-center justify-center">
          <div className="text-center text-[#86868b] text-[14px]">Loading courses...</div>
        </div>}>
        <CoursesContent />
      </Suspense>
    </DashboardLayout>);
}
