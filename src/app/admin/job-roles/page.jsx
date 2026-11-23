"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, ArrowLeft, Eye, Loader2, Search, X, } from "lucide-react";
export default function AdminJobRolesPage() {
    const [jobRoles, setJobRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedRoleDetail, setSelectedRoleDetail] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newRole, setNewRole] = useState({
        title: "",
        domain: "Web Development",
        description: "",
        minExperience: "0-2 Years",
        avgSalary: "₹6,00,000 - ₹10,00,000",
        demandLevel: "High",
    });
    const [creating, setCreating] = useState(false);
    const fetchJobRoles = () => {
        fetch("/api/admin/job-roles")
            .then((res) => res.json())
            .then((data) => {
            setJobRoles(data.jobRoles || []);
            setLoading(false);
        })
            .catch((err) => {
            console.error(err);
            setLoading(false);
        });
    };
    useEffect(() => {
        fetchJobRoles();
    }, []);
    const handleCreateRole = async (e) => {
        e.preventDefault();
        if (!newRole.title || !newRole.domain)
            return;
        setCreating(true);
        try {
            const res = await fetch("/api/admin/job-roles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newRole),
            });
            if (!res.ok)
                throw new Error("Failed to create job role");
            setShowAddModal(false);
            setNewRole({
                title: "",
                domain: "Web Development",
                description: "",
                minExperience: "0-2 Years",
                avgSalary: "₹6,00,000 - ₹10,00,000",
                demandLevel: "High",
            });
            fetchJobRoles();
        }
        catch (err) {
            alert(err.message || "Failed to create role");
        }
        finally {
            setCreating(false);
        }
    };
    const handleDeleteRole = async (id) => {
        if (!confirm("Are you sure you want to delete this job role?"))
            return;
        try {
            const res = await fetch(`/api/admin/job-roles?id=${id}`, {
                method: "DELETE",
            });
            if (!res.ok)
                throw new Error("Failed to delete job role");
            fetchJobRoles();
        }
        catch (err) {
            alert(err.message || "Error deleting job role");
        }
    };
    const filteredRoles = jobRoles.filter((jr) => jr.title.toLowerCase().includes(search.toLowerCase()) ||
        jr.domain.toLowerCase().includes(search.toLowerCase()));
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
              <span>Job Roles</span>
            </div>
            <h1 className="text-3xl font-bold text-blue-950">Job Role & Qualification Profiles</h1>
            <p className="text-slate-600">
              Configure job profiles, salary benchmarks, and prerequisite skill requirements.
            </p>
          </div>

          <Button onClick={() => setShowAddModal(true)} className="bg-blue-900 hover:bg-blue-800">
            <Plus className="h-4 w-4 mr-1.5"/>
            Create Job Role
          </Button>
        </div>

        {/* Search */}
        <Card className="border-blue-100 shadow-sm">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"/>
              <Input placeholder="Search job roles by title or domain..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)}/>
            </div>
          </CardContent>
        </Card>

        {/* Job Roles Table */}
        <Card className="border-blue-100 shadow-sm overflow-hidden">
          <CardHeader className="py-4">
            <CardTitle className="text-base text-blue-950">
              National Standard Job Profiles ({filteredRoles.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (<div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-900"/>
              </div>) : filteredRoles.length === 0 ? (<div className="p-12 text-center text-slate-400">No job roles found</div>) : (<div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-y border-slate-200 text-slate-600 text-xs font-semibold">
                      <th className="py-3 px-6">Job Title</th>
                      <th className="py-3 px-4">Domain</th>
                      <th className="py-3 px-4">Experience</th>
                      <th className="py-3 px-4">Avg Salary</th>
                      <th className="py-3 px-4">Demand</th>
                      <th className="py-3 px-4 text-center">Required Skills</th>
                      <th className="py-3 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRoles.map((jr) => (<tr key={jr.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-6 font-semibold text-blue-950">{jr.title}</td>
                        <td className="py-4 px-4 text-xs">
                          <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium">
                            {jr.domain}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-xs text-slate-600">{jr.minExperience || "Entry Level"}</td>
                        <td className="py-4 px-4 text-xs font-medium text-slate-700">{jr.avgSalary || "N/A"}</td>
                        <td className="py-4 px-4">
                          <Badge variant="secondary" className="text-[11px]">
                            {jr.demandLevel}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-center text-xs font-bold text-blue-900">
                          {jr.skillRequirements?.length || 0}
                        </td>
                        <td className="py-4 px-6 text-right space-x-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-700 hover:bg-blue-50" onClick={() => setSelectedRoleDetail(jr)} title="View Skill Requirements">
                            <Eye className="h-4 w-4"/>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteRole(jr.id)} title="Delete Role">
                            <Trash2 className="h-4 w-4"/>
                          </Button>
                        </td>
                      </tr>))}
                  </tbody>
                </table>
              </div>)}
          </CardContent>
        </Card>

        {/* Modal: View Requirements */}
        {selectedRoleDetail && (<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg bg-white shadow-2xl border border-blue-100">
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <Badge variant="secondary" className="text-xs mb-1">{selectedRoleDetail.domain}</Badge>
                  <CardTitle className="text-xl text-blue-950">{selectedRoleDetail.title}</CardTitle>
                  <CardDescription className="text-xs text-slate-500 mt-1">
                    {selectedRoleDetail.description}
                  </CardDescription>
                </div>
                <button onClick={() => setSelectedRoleDetail(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5"/>
                </button>
              </CardHeader>
              <CardContent className="space-y-4">
                <h4 className="text-sm font-bold text-slate-800">Prerequisite Competencies & Benchmarks:</h4>
                <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                  {(selectedRoleDetail.skillRequirements || []).map((sr) => (<div key={sr.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-blue-950 block">{sr.skill?.name}</span>
                        <span className="text-slate-400 text-[11px] capitalize">{sr.importance} • {sr.skill?.category.toLowerCase()}</span>
                      </div>
                      <span className="font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                        Target: {sr.requiredProficiency}%
                      </span>
                    </div>))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t border-slate-100 pt-3">
                <Button variant="outline" size="sm" onClick={() => setSelectedRoleDetail(null)}>
                  Close
                </Button>
              </CardFooter>
            </Card>
          </div>)}

        {/* Modal: Add New Role */}
        {showAddModal && (<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-2xl bg-white border border-blue-100 animate-in fade-in-0 zoom-in-95">
              <CardHeader>
                <CardTitle className="text-xl">Create Job Role</CardTitle>
                <CardDescription>
                  Define a new standard industry profile
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleCreateRole}>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="role-title">Job Title *</Label>
                    <Input id="role-title" placeholder="e.g. Cybersecurity Incident Responder" value={newRole.title} onChange={(e) => setNewRole({ ...newRole, title: e.target.value })} required/>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="role-dom">Domain *</Label>
                    <select id="role-dom" value={newRole.domain} onChange={(e) => setNewRole({ ...newRole, domain: e.target.value })} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="Web Development">Web Development</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Artificial Intelligence">Artificial Intelligence</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Cloud Computing">Cloud Computing</option>
                      <option value="Digital Marketing">Digital Marketing</option>
                      <option value="Electric Vehicle Technology">Electric Vehicle Technology</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="role-sal">Average Salary Benchmark</Label>
                    <Input id="role-sal" placeholder="e.g. ₹6,50,000 - ₹12,00,000" value={newRole.avgSalary} onChange={(e) => setNewRole({ ...newRole, avgSalary: e.target.value })}/>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="role-desc">Job Role Overview</Label>
                    <Input id="role-desc" placeholder="Summary of responsibilities and scope..." value={newRole.description} onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}/>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} disabled={creating}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-900" disabled={creating}>
                    {creating && <Loader2 className="h-4 w-4 animate-spin mr-1"/>}
                    Create Role
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>)}
      </div>
    </DashboardLayout>);
}
