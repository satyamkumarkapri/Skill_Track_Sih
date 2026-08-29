"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Input } from "@/components/ui";
import { getAllUsersForAdmin, updateUserRoleAction, deleteUserAction, resetUserPasswordAction, getAllCoursesForAdmin, deleteCourseAction, getAdminStats } from "@/actions/admin";
import { Users, BookOpen, BarChart3, Trash2, Edit2, Key, Check, X, Shield } from "lucide-react";
import { toast } from "sonner";

const ROLES = ["trainee", "training_provider", "employer", "government_officer", "government_admin"];
const ROLE_COLORS: Record<string, string> = {
  trainee: "bg-blue-100 text-blue-700",
  training_provider: "bg-purple-100 text-purple-700",
  employer: "bg-amber-100 text-amber-700",
  government_officer: "bg-green-100 text-green-700",
  government_admin: "bg-red-100 text-red-700",
};

export default function ManageUsersPage() {
  const [tab, setTab] = useState<"users" | "courses">("users");
  const [users, setUsers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<string>("");
  const [resetPwdUser, setResetPwdUser] = useState<string | null>(null);
  const [newPwd, setNewPwd] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const [u, c, s] = await Promise.all([getAllUsersForAdmin(), getAllCoursesForAdmin(), getAdminStats()]);
    setUsers(u);
    setCourses(c);
    setStats(s);
  };

  useEffect(() => { load(); }, []);

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.role?.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleUpdate = async (userId: string) => {
    if (!newRole) return;
    setLoading(true);
    const result = await updateUserRoleAction(userId, newRole);
    if (result.success) {
      toast.success("Role updated and synced to MongoDB!");
      setEditingRole(null);
      await load();
    }
    setLoading(false);
  };

  const handleDelete = async (userId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete user "${name}"? This cannot be undone.`)) return;
    const result = await deleteUserAction(userId);
    if (result.success) {
      toast.success("User deleted from MongoDB");
      await load();
    }
  };

  const handleResetPwd = async (userId: string) => {
    if (!newPwd || newPwd.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    const result = await resetUserPasswordAction(userId, newPwd);
    if (result.success) {
      toast.success("Password reset in MongoDB!");
      setResetPwdUser(null);
      setNewPwd("");
    }
    setLoading(false);
  };

  const handleDeleteCourse = async (courseId: string, title: string) => {
    if (!confirm(`Delete course "${title}" and all its enrollments?`)) return;
    const result = await deleteCourseAction(courseId);
    if (result.success) {
      toast.success("Course deleted from MongoDB");
      await load();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center">
          <Shield className="h-5 w-5 text-red-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Admin Control Panel</h1>
          <p className="text-sm text-muted-foreground">Manage all users, courses & data — changes sync instantly to MongoDB</p>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 border-l-4 border-l-blue-500">
            <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Users</p>
          </Card>
          <Card className="p-4 border-l-4 border-l-purple-500">
            <p className="text-3xl font-bold text-purple-600">{stats.totalCourses}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Courses</p>
          </Card>
          <Card className="p-4 border-l-4 border-l-green-500">
            <p className="text-3xl font-bold text-green-600">{stats.totalEnrollments}</p>
            <p className="text-xs text-muted-foreground mt-1">Enrollments</p>
          </Card>
          <Card className="p-4 border-l-4 border-l-amber-500">
            <p className="text-3xl font-bold text-amber-600">{stats.roleBreakdown?.find((r: any) => r._id === "trainee")?.count ?? 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Active Trainees</p>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab("users")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${tab === "users" ? "bg-primary text-white shadow" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
        >
          <Users className="h-4 w-4" /> Users ({users.length})
        </button>
        <button
          onClick={() => setTab("courses")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${tab === "courses" ? "bg-primary text-white shadow" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
        >
          <BookOpen className="h-4 w-4" /> Courses ({courses.length})
        </button>
      </div>

      {tab === "users" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <CardTitle>All Registered Users</CardTitle>
              <Input placeholder="Search by name, email, role..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs h-9" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold text-muted-foreground">User</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground">Role</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground">Joined</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground">Onboarding</th>
                    <th className="text-right p-4 font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredUsers.map(user => (
                    <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{user.name || "—"}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        {editingRole === user._id ? (
                          <div className="flex items-center gap-2">
                            <select
                              value={newRole}
                              onChange={e => setNewRole(e.target.value)}
                              className="text-xs border rounded px-2 py-1 bg-white"
                            >
                              <option value="">Select role</option>
                              {ROLES.map(r => <option key={r} value={r}>{r.replace(/_/g, " ")}</option>)}
                            </select>
                            <button onClick={() => handleRoleUpdate(user._id)} disabled={loading} className="h-6 w-6 rounded bg-green-500 text-white flex items-center justify-center hover:bg-green-600">
                              <Check className="h-3 w-3" />
                            </button>
                            <button onClick={() => setEditingRole(null)} className="h-6 w-6 rounded bg-slate-300 flex items-center justify-center hover:bg-slate-400">
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${ROLE_COLORS[user.role] || "bg-gray-100 text-gray-700"}`}>
                            {user.role?.replace(/_/g, " ") || "unknown"}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-xs text-muted-foreground">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN") : "—"}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-xs ${user.onboardingCompleted ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                          {user.onboardingCompleted ? "Complete" : "Pending"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          {/* Edit Role */}
                          <button
                            onClick={() => { setEditingRole(user._id); setNewRole(user.role); }}
                            className="h-7 w-7 rounded border border-border hover:bg-slate-100 flex items-center justify-center transition-colors"
                            title="Change Role"
                          >
                            <Edit2 className="h-3 w-3 text-muted-foreground" />
                          </button>
                          {/* Reset Password */}
                          {resetPwdUser === user._id ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="password"
                                placeholder="New password"
                                value={newPwd}
                                onChange={e => setNewPwd(e.target.value)}
                                className="text-xs border rounded px-2 py-1 w-28 bg-white"
                              />
                              <button onClick={() => handleResetPwd(user._id)} disabled={loading} className="h-6 w-6 rounded bg-blue-500 text-white flex items-center justify-center">
                                <Check className="h-3 w-3" />
                              </button>
                              <button onClick={() => setResetPwdUser(null)} className="h-6 w-6 rounded bg-slate-300 flex items-center justify-center">
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setResetPwdUser(user._id)}
                              className="h-7 w-7 rounded border border-border hover:bg-slate-100 flex items-center justify-center transition-colors"
                              title="Reset Password"
                            >
                              <Key className="h-3 w-3 text-muted-foreground" />
                            </button>
                          )}
                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(user._id, user.name || user.email)}
                            className="h-7 w-7 rounded border border-red-200 hover:bg-red-50 flex items-center justify-center transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="h-3 w-3 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <div className="text-center py-12 text-muted-foreground text-sm">No users found</div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {tab === "courses" && (
        <Card>
          <CardHeader>
            <CardTitle>All Courses in MongoDB</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold text-muted-foreground">Course</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground">Provider</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground">Sector</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground">Status</th>
                    <th className="text-right p-4 font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {courses.map(course => (
                    <tr key={course._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{course.title}</p>
                          <p className="text-xs text-muted-foreground">{course.duration}</p>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">{course.providerName || course.providerEmail || "—"}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs">{course.sector || "General"}</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-xs ${course.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                          {course.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteCourse(course._id, course.title)}
                          className="h-7 w-7 rounded border border-red-200 hover:bg-red-50 flex items-center justify-center transition-colors ml-auto"
                          title="Delete Course"
                        >
                          <Trash2 className="h-3 w-3 text-red-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {courses.length === 0 && (
                <div className="text-center py-12 text-muted-foreground text-sm">No courses found in database</div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
