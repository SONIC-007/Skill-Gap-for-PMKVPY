"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, ArrowLeft, Loader2, Search, } from "lucide-react";
export default function AdminCoursesPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCourse, setNewCourse] = useState({
        name: "",
        description: "",
        provider: "National Skill Training Institute (NSTI)",
        difficulty: "BEGINNER",
        duration: "12 Weeks (240 Hours)",
        eligibility: "12th Pass or Equivalent",
        category: "Web Development",
    });
    const [creating, setCreating] = useState(false);
    const fetchCourses = () => {
        fetch("/api/admin/courses")
            .then((res) => res.json())
            .then((data) => {
            setCourses(data.courses || []);
            setLoading(false);
        })
            .catch((err) => {
            console.error(err);
            setLoading(false);
        });
    };
    useEffect(() => {
        fetchCourses();
    }, []);
    const handleCreateCourse = async (e) => {
        e.preventDefault();
        if (!newCourse.name)
            return;
        setCreating(true);
        try {
            const res = await fetch("/api/admin/courses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCourse),
            });
            if (!res.ok)
                throw new Error("Failed to create course");
            setShowAddModal(false);
            setNewCourse({
                name: "",
                description: "",
                provider: "National Skill Training Institute (NSTI)",
                difficulty: "BEGINNER",
                duration: "12 Weeks (240 Hours)",
                eligibility: "12th Pass or Equivalent",
                category: "Web Development",
            });
            fetchCourses();
        }
        catch (err) {
            alert(err.message || "Failed to create course");
        }
        finally {
            setCreating(false);
        }
    };
    const handleDeleteCourse = async (id) => {
        if (!confirm("Are you sure you want to delete this training course?"))
            return;
        try {
            const res = await fetch(`/api/admin/courses?id=${id}`, {
                method: "DELETE",
            });
            if (!res.ok)
                throw new Error("Failed to delete course");
            fetchCourses();
        }
        catch (err) {
            alert(err.message || "Error deleting course");
        }
    };
    const filteredCourses = courses.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.provider && c.provider.toLowerCase().includes(search.toLowerCase())) ||
        (c.category && c.category.toLowerCase().includes(search.toLowerCase())));
    return (<DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <Link href="/admin" className="hover:text-blue-900 flex items-center gap-1">
                <ArrowLeft className="h-3 w-3"/> Admin Dashboard
              </Link>
              <span>/</span>
              <span>Training Curricula</span>
            </div>
            <h1 className="text-3xl font-bold text-blue-950">PMKVY Course Management</h1>
            <p className="text-slate-600">
              Manage training programs, affiliated skill councils, and course eligibility requirements.
            </p>
          </div>

          <Button onClick={() => setShowAddModal(true)} className="bg-blue-900 hover:bg-blue-800">
            <Plus className="h-4 w-4 mr-1.5"/>
            Add Training Course
          </Button>
        </div>

        {/* Search */}
        <Card className="border-blue-100 shadow-sm">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"/>
              <Input placeholder="Search courses by title, provider, or category..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)}/>
            </div>
          </CardContent>
        </Card>

        {/* Courses Table */}
        <Card className="border-blue-100 shadow-sm overflow-hidden">
          <CardHeader className="py-4">
            <CardTitle className="text-base text-blue-950">
              Training Courses Catalog ({filteredCourses.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (<div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-900"/>
              </div>) : filteredCourses.length === 0 ? (<div className="p-12 text-center text-slate-400">No courses found</div>) : (<div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-y border-slate-200 text-slate-600 text-xs font-semibold">
                      <th className="py-3 px-6">Course Name</th>
                      <th className="py-3 px-4">Provider / Partner</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Difficulty</th>
                      <th className="py-3 px-4">Duration</th>
                      <th className="py-3 px-4 text-center">Enrolled</th>
                      <th className="py-3 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCourses.map((c) => (<tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-6 font-semibold text-blue-950 max-w-xs truncate">
                          {c.name}
                        </td>
                        <td className="py-4 px-4 text-xs text-slate-600 max-w-[200px] truncate">
                          {c.provider || "NSDC Partner"}
                        </td>
                        <td className="py-4 px-4 text-xs">
                          <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium">
                            {c.category || "General"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant="outline" className="text-[10px] uppercase">
                            {c.difficulty}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-xs text-slate-500 whitespace-nowrap">
                          {c.duration}
                        </td>
                        <td className="py-4 px-4 text-center font-bold text-xs text-blue-900">
                          {c._count?.enrollments || 0}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteCourse(c.id)} title="Delete Course">
                            <Trash2 className="h-4 w-4"/>
                          </Button>
                        </td>
                      </tr>))}
                  </tbody>
                </table>
              </div>)}
          </CardContent>
        </Card>

        {/* Modal: Add New Course */}
        {showAddModal && (<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-2xl bg-white border border-blue-100 animate-in fade-in-0 zoom-in-95">
              <CardHeader>
                <CardTitle className="text-xl">Add Training Course</CardTitle>
                <CardDescription>
                  Register a PMKVY-aligned training course offering
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleCreateCourse}>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="c-name">Course Title *</Label>
                    <Input id="c-name" placeholder="e.g. Advanced Cloud Security Practitioner" value={newCourse.name} onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })} required/>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="c-prov">Training Provider / Sector Council</Label>
                    <Input id="c-prov" placeholder="e.g. Sector Skill Council NASSCOM" value={newCourse.provider} onChange={(e) => setNewCourse({ ...newCourse, provider: e.target.value })}/>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="c-cat">Domain Category</Label>
                      <select id="c-cat" value={newCourse.category} onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="Web Development">Web Development</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Artificial Intelligence">Artificial Intelligence</option>
                        <option value="Cybersecurity">Cybersecurity</option>
                        <option value="Cloud Computing">Cloud Computing</option>
                        <option value="Digital Marketing">Digital Marketing</option>
                        <option value="Electric Vehicle Technology">Electric Vehicle Technology</option>
                        <option value="Soft Skills">Soft Skills</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="c-diff">Difficulty Level</Label>
                      <select id="c-diff" value={newCourse.difficulty} onChange={(e) => setNewCourse({ ...newCourse, difficulty: e.target.value })} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="BEGINNER">BEGINNER</option>
                        <option value="INTERMEDIATE">INTERMEDIATE</option>
                        <option value="ADVANCED">ADVANCED</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="c-dur">Duration</Label>
                      <Input id="c-dur" placeholder="e.g. 14 Weeks (280 Hrs)" value={newCourse.duration} onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}/>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="c-elig">Eligibility</Label>
                      <Input id="c-elig" placeholder="e.g. Diploma / Graduate" value={newCourse.eligibility} onChange={(e) => setNewCourse({ ...newCourse, eligibility: e.target.value })}/>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="c-desc">Description</Label>
                    <Input id="c-desc" placeholder="Course summary and learning outcomes..." value={newCourse.description} onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}/>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} disabled={creating}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-900" disabled={creating}>
                    {creating && <Loader2 className="h-4 w-4 animate-spin mr-1"/>}
                    Add Course
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>)}
      </div>
    </DashboardLayout>);
}
