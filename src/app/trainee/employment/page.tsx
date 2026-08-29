"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, Badge, StatusBadge, Button, Input, Label, Select } from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Briefcase, Loader2, Save, Plus, Clock, AlertCircle } from "lucide-react";
import { getMyFullProfile, updateMyEmployment, endMyEmployment } from "@/actions/trainee-updates";
import { toast } from "sonner";

export default function TraineeEmploymentPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEnding, setIsEnding] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const result = await getMyFullProfile();
    if (result.success) {
      setProfile(result.profile);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    const result = await updateMyEmployment(formData);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Employment details updated!");
      setIsEditing(false);
      await fetchData();
    }
    setSaving(false);
  };

  const handleEndJob = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    const reason = formData.get("reason") as string;
    
    const result = await endMyEmployment(reason);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Job marked as ended and archived to history!");
      setIsEnding(false);
      await fetchData();
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="p-12 text-center text-muted-foreground"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>;
  }

  const empData = profile?.employmentData;
  const empHistory = profile?.employmentHistory || [];

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Employment</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your current job and work history.</p>
        </div>
        {!isEditing && !isEnding && (
          <Button onClick={() => setIsEditing(true)} className="gap-2 bg-saffron hover:bg-orange-600 text-white border-none shadow-sm">
            {empData ? "Change Job Details" : "Add Employment"}
          </Button>
        )}
      </div>

      {isEditing ? (
        <Card className="border-saffron/20 shadow-md">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">{empData ? "Update Employment" : "Add New Employment"}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employer">Employer / Company Name</Label>
                  <Input id="employer" name="employer" required defaultValue={empData?.employer || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Job Role</Label>
                  <Input id="role" name="role" required defaultValue={empData?.role || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="joiningDate">Joining Date</Label>
                  <Input id="joiningDate" name="joiningDate" type="date" required defaultValue={empData?.joiningDate || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary">Monthly Salary (INR)</Label>
                  <Input id="salary" name="salary" type="number" required defaultValue={empData?.salary || ""} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="type">Employment Type</Label>
                  <select id="type" name="type" required defaultValue={empData?.type || "Full-time"} className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-saffron">
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Self-Employed">Self-Employed</option>
                    <option value="Apprenticeship">Apprenticeship</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button type="submit" disabled={saving} className="bg-india-green hover:bg-green-700">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Details
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : isEnding ? (
        <Card className="border-red-200 bg-red-50/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <h3 className="font-semibold text-lg">Log Job Departure</h3>
            </div>
            <p className="text-sm text-slate-600 mb-6">Are you sure you want to end your current job? This will archive it to your Employment History.</p>
            <form onSubmit={handleEndJob} className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for leaving (Optional)</Label>
                <select id="reason" name="reason" className="flex h-11 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:ring-red-500">
                  <option value="Resigned">Resigned</option>
                  <option value="Contract Ended">Contract Ended</option>
                  <option value="Better Opportunity">Found Better Opportunity</option>
                  <option value="Relocation">Relocation</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsEnding(false)}>Cancel</Button>
                <Button type="submit" variant="destructive" disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Confirm & Archive Job
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : empData ? (
        <Card className="border-india-green/30 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-india-green/10 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-india-green" />
                </div>
                <h3 className="font-bold text-lg">Current Employment</h3>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsEnding(true)} className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
                Log Job Ended
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-8 text-sm">
              <div>
                <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Employer</span>
                <p className="font-bold text-base mt-1 text-slate-800">{empData.employer}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Job Role</span>
                <p className="font-bold text-base mt-1 text-slate-800">{empData.role}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Joining Date</span>
                <p className="font-medium mt-1">{empData.joiningDate ? formatDate(empData.joiningDate) : "—"}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Monthly Salary</span>
                <p className="font-medium mt-1 text-emerald-600">{empData.salary ? formatCurrency(empData.salary) : "—"}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Type</span>
                <div className="mt-1"><Badge variant="outline">{empData.type}</Badge></div>
              </div>
              <div>
                <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">System Verification</span>
                <div className="mt-1">
                  <StatusBadge status="pending" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed border-2">
          <CardContent className="p-16 text-center text-muted-foreground flex flex-col items-center">
            <Briefcase className="h-12 w-12 mb-4 text-slate-300" />
            <h3 className="text-lg font-semibold text-slate-800">No Active Employment</h3>
            <p className="max-w-sm mt-1 mb-6">You are not currently listed as employed. Click below to add your current job details.</p>
            <Button onClick={() => setIsEditing(true)} className="gap-2 bg-india-green hover:bg-green-700 text-white">
              <Plus className="h-4 w-4" /> Add Employment Details
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Employment History Section */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-slate-400" />
          Employment History
        </h2>
        
        {empHistory.length === 0 ? (
          <p className="text-sm text-slate-500 italic p-4 bg-slate-50 rounded-lg border border-slate-100">No past employment history logged yet.</p>
        ) : (
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            {empHistory.map((job: any, i: number) => (
              <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                {/* Icon */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white bg-slate-200 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <Briefcase className="h-4 w-4" />
                </div>
                
                {/* Card */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-slate-800">{job.role}</h4>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">{job.status}</span>
                  </div>
                  <p className="text-sm text-saffron font-medium">{job.employer}</p>
                  
                  <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-500">
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">Joined</span>
                      {job.joiningDate ? formatDate(job.joiningDate) : "—"}
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">Ended</span>
                      {job.endDate ? formatDate(job.endDate.split('T')[0]) : "—"}
                    </div>
                    {job.reason && (
                      <div className="col-span-2 mt-1">
                        <span className="block text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">Reason</span>
                        <span className="italic">"{job.reason}"</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
