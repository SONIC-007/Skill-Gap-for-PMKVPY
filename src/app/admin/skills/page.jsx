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
export default function AdminSkillsPage() {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedDomain, setSelectedDomain] = useState("");
    // Add skill form state
    const [showAddModal, setShowAddModal] = useState(false);
    const [newSkill, setNewSkill] = useState({
        name: "",
        domain: "Web Development",
        category: "TECHNICAL",
        description: "",
    });
    const [creating, setCreating] = useState(false);
    const fetchSkills = () => {
        fetch("/api/admin/skills")
            .then((res) => res.json())
            .then((data) => {
            setSkills(data.skills || []);
            setLoading(false);
        })
            .catch((err) => {
            console.error(err);
            setLoading(false);
        });
    };
    useEffect(() => {
        fetchSkills();
    }, []);
    const handleCreateSkill = async (e) => {
        e.preventDefault();
        if (!newSkill.name || !newSkill.domain)
            return;
        setCreating(true);
        try {
            const res = await fetch("/api/admin/skills", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newSkill),
            });
            if (!res.ok)
                throw new Error("Failed to create skill");
            setShowAddModal(false);
            setNewSkill({
                name: "",
                domain: "Web Development",
                category: "TECHNICAL",
                description: "",
            });
            fetchSkills();
        }
        catch (err) {
            alert(err.message || "Failed to add skill");
        }
        finally {
            setCreating(false);
        }
    };
    const handleDeleteSkill = async (id) => {
        if (!confirm("Are you sure you want to delete this skill?"))
            return;
        try {
            const res = await fetch(`/api/admin/skills?id=${id}`, {
                method: "DELETE",
            });
            if (!res.ok)
                throw new Error("Failed to delete skill");
            fetchSkills();
        }
        catch (err) {
            alert(err.message || "Error deleting skill");
        }
    };
    const domains = [...new Set(skills.map((s) => s.domain))];
    const filteredSkills = skills.filter((s) => {
        const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
            (s.description && s.description.toLowerCase().includes(search.toLowerCase()));
        const matchesDomain = !selectedDomain || s.domain === selectedDomain;
        return matchesSearch && matchesDomain;
    });
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
              <span>Skills Directory</span>
            </div>
            <h1 className="text-3xl font-bold text-blue-950">Competency & Skill Management</h1>
            <p className="text-slate-600">
              Maintain standardized skills, classifications, and domain definitions.
            </p>
          </div>

          <Button onClick={() => setShowAddModal(true)} className="bg-blue-900 hover:bg-blue-800">
            <Plus className="h-4 w-4 mr-1.5"/>
            Add New Skill
          </Button>
        </div>

        {/* Filter and Search Bar */}
        <Card className="border-blue-100 shadow-sm">
          <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"/>
              <Input placeholder="Search skills by title or keyword..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)}/>
            </div>
            <select value={selectedDomain} onChange={(e) => setSelectedDomain(e.target.value)} className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-60">
              <option value="">All Domains ({skills.length})</option>
              {domains.map((dom) => (<option key={dom} value={dom}>{dom}</option>))}
            </select>
          </CardContent>
        </Card>

        {/* Skills Table */}
        <Card className="border-blue-100 shadow-sm overflow-hidden">
          <CardHeader className="py-4">
            <CardTitle className="text-base text-blue-950">
              Registered Skills ({filteredSkills.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (<div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-900"/>
              </div>) : filteredSkills.length === 0 ? (<div className="p-12 text-center text-slate-400">No skills found matching search</div>) : (<div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-y border-slate-200 text-slate-600 text-xs font-semibold">
                      <th className="py-3 px-6">Skill Name</th>
                      <th className="py-3 px-4">Domain</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-6">Description</th>
                      <th className="py-3 px-4 text-center">Job Requirements</th>
                      <th className="py-3 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSkills.map((s) => (<tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-6 font-semibold text-blue-950">{s.name}</td>
                        <td className="py-4 px-4">
                          <span className="text-xs text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md font-medium">
                            {s.domain}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant={s.category === "TECHNICAL" ? "default" : "secondary"} className="text-[11px]">
                            {s.category}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-500 max-w-xs truncate">
                          {s.description || "No description provided"}
                        </td>
                        <td className="py-4 px-4 text-center text-xs font-bold text-slate-700">
                          {s._count?.jobRequirements || 0}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0" onClick={() => handleDeleteSkill(s.id)}>
                            <Trash2 className="h-4 w-4"/>
                          </Button>
                        </td>
                      </tr>))}
                  </tbody>
                </table>
              </div>)}
          </CardContent>
        </Card>

        {/* Modal: Add New Skill */}
        {showAddModal && (<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-2xl bg-white border border-blue-100 animate-in fade-in-0 zoom-in-95">
              <CardHeader>
                <CardTitle className="text-xl">Add New Skill Competency</CardTitle>
                <CardDescription>
                  Register a new skill into the PMKVY National Standards database
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleCreateSkill}>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="skill-name">Skill Name *</Label>
                    <Input id="skill-name" placeholder="e.g. Next.js 14, Rust, ROS2, etc." value={newSkill.name} onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })} required/>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="skill-domain">Domain *</Label>
                    <select id="skill-domain" value={newSkill.domain} onChange={(e) => setNewSkill({ ...newSkill, domain: e.target.value })} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="Web Development">Web Development</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Artificial Intelligence">Artificial Intelligence</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Cloud Computing">Cloud Computing</option>
                      <option value="Digital Marketing">Digital Marketing</option>
                      <option value="Electric Vehicle Technology">Electric Vehicle Technology</option>
                      <option value="General">General / Workplace</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="skill-cat">Skill Category *</Label>
                    <select id="skill-cat" value={newSkill.category} onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="TECHNICAL">TECHNICAL</option>
                      <option value="SOFT">SOFT</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="skill-desc">Description</Label>
                    <Input id="skill-desc" placeholder="Brief overview of competencies covered..." value={newSkill.description} onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}/>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} disabled={creating}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-900" disabled={creating}>
                    {creating && <Loader2 className="h-4 w-4 animate-spin mr-1"/>}
                    Create Skill
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>)}
      </div>
    </DashboardLayout>);
}
