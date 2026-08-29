"use client";

import React from "react";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
  KPICard, StatusBadge, Badge, Avatar, ProgressBar, ScoreRing,
} from "@/components/ui";
import { SalaryProgressionChart } from "@/components/charts";
import { getTraineeProfile, getMyEnrollments } from "@/actions/trainee";
import { formatCurrency } from "@/lib/utils";
import {
  GraduationCap, Briefcase, Target, CheckCircle2, Clock,
} from "lucide-react";

export default function TraineeDashboard() {
  const [trainee, setTrainee] = React.useState<any>(null);
  const [enrollments, setEnrollments] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.all([getTraineeProfile(), getMyEnrollments()]).then(([profileData, enrollmentsData]) => {
      if (profileData.success) {
        setTrainee(profileData.profile);
      }
      if (enrollmentsData.success) {
        setEnrollments(enrollmentsData.enrollments);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="space-y-6 animate-pulse p-6">
      <div className="h-8 bg-muted rounded w-1/4"></div>
      <div className="h-96 bg-muted rounded w-full"></div>
    </div>;
  }

  if (!trainee) return <div>No trainee data available</div>;

  const journey = enrollments.length > 0 ? [
    { title: "Enrolled in Training", status: "completed" },
    { title: "Course Completed", status: enrollments[0].status === "Completed" ? "completed" : "upcoming" },
    { title: "Placed in Job", status: enrollments[0].outcome === "Employed" || enrollments[0].outcome === "Self-Employed" ? "completed" : "upcoming" }
  ] : [
    { title: "Register for a Course", status: "upcoming" },
    { title: "Complete Training", status: "upcoming" },
    { title: "Get Placed", status: "upcoming" }
  ];
  
  const salaryHistory = [
    { period: "Month 1", salary: 15000 },
    { period: "Month 6", salary: 18000 },
    { period: "Current", salary: 22000 }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome, {trainee.name.split(" ")[0]}!</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your training and employment journey at a glance
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Courses Enrolled" value={enrollments.length.toString()} icon="GraduationCap" />
        <KPICard label="Courses Completed" value={enrollments.filter(e => e.status === "Completed").length.toString()} icon="Target" />
        <KPICard label="Employment Status" value={enrollments[0]?.outcome || "Pending"} icon="Briefcase" />
        <KPICard label="Current Salary" value={enrollments[0]?.outcome === "Employed" ? formatCurrency(22000) : "N/A"} icon="IndianRupee" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Summary */}
        <Card className="border-slate-100 shadow-sm card-hover bg-white/60 backdrop-blur-md overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/80 via-primary to-indigo-800 z-0" />
          <CardHeader className="relative z-10 pt-6">
            <CardTitle className="text-white drop-shadow-md">My Profile</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 pt-4">
            <div className="flex items-start gap-5 mb-6">
              <div className="rounded-full p-1 bg-white shadow-lg">
                <Avatar name={trainee.name} size="lg" />
              </div>
              <div className="pt-2">
                <h3 className="text-xl font-bold text-slate-900 leading-tight">{trainee.name}</h3>
                <p className="text-xs font-mono text-slate-500 mt-1 uppercase tracking-wider">{trainee.id.substring(0, 8)}</p>
                <div className="flex gap-2 mt-3">
                  <StatusBadge status={enrollments[0]?.outcome || "Pending"} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50/80 rounded-xl p-4 border border-slate-100">
              <div><span className="text-slate-500 block text-xs font-bold uppercase tracking-wider mb-1">Email</span> <span className="font-semibold text-slate-900">{trainee.email}</span></div>
              <div><span className="text-slate-500 block text-xs font-bold uppercase tracking-wider mb-1">Education</span> <span className="font-semibold text-slate-900">{trainee.onboardingData?.education || "Not specified"}</span></div>
              <div className="col-span-2"><span className="text-slate-500 block text-xs font-bold uppercase tracking-wider mb-1">Latest Course</span> <span className="font-semibold text-slate-900">{enrollments[0]?.courseTitle || "None"}</span></div>
            </div>
          </CardContent>
        </Card>

        {/* Scores */}
        <Card className="border-slate-100 shadow-sm card-hover bg-white/60 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-slate-900">Performance Scores</CardTitle>
          </CardHeader>
          <CardContent>
            {enrollments.length > 0 ? (
              <div className="flex justify-around items-center h-full pt-4">
                <ScoreRing score={85} label="Attendance" size={100} />
                <ScoreRing score={92} label="Assessment" size={100} />
                <ScoreRing score={88} label="Skill Match" size={100} />
              </div>
            ) : (
              <div className="h-full min-h-[160px] flex items-center justify-center bg-slate-50 text-slate-500 border border-dashed rounded-xl text-sm p-6 text-center">
                Enroll in a course to start tracking your performance scores!
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Salary Progression */}
      <SalaryProgressionChart data={salaryHistory} title="My Salary Growth" description="From placement to current" />

      {/* Journey */}
      <Card className="border-slate-100 shadow-sm bg-white/60 backdrop-blur-md">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="text-slate-900">My Journey Tracker</CardTitle>
        </CardHeader>
        <CardContent className="pt-8 pb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between relative max-w-4xl mx-auto">
            {/* Background Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 z-0 hidden sm:block rounded-full" />
            
            {journey.map((event, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center group w-full sm:w-auto mb-8 sm:mb-0">
                <div className={`h-14 w-14 rounded-full flex items-center justify-center border-4 border-white shadow-md transition-transform duration-300 group-hover:scale-110 ${
                  event.status === "completed" ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white" :
                  "bg-slate-100 text-slate-400"
                }`}>
                  {event.status === "completed" ? <CheckCircle2 className="h-7 w-7" /> : <Clock className="h-7 w-7" />}
                </div>
                <div className="mt-4 text-center">
                  <span className={`block text-sm font-bold ${event.status === "completed" ? "text-slate-900" : "text-slate-500"}`}>{event.title}</span>
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">{event.status}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
