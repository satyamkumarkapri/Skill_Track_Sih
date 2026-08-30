"use client";

import React from "react";
import {
  Card, CardHeader, CardTitle, CardContent,
  KPICard, StatusBadge, Avatar, ScoreRing,
} from "@/components/ui";
import { SalaryProgressionChart } from "@/components/charts";
import { getTraineeProfile, getMyEnrollments } from "@/actions/trainee";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import {
  GraduationCap, Briefcase, Target, CheckCircle2, Clock,
  TrendingUp, BookOpen, Award, ArrowRight, Bell, Star,
  IndianRupee, Calendar, MapPin, ChevronRight, Zap,
} from "lucide-react";

export default function TraineeDashboard() {
  const [trainee, setTrainee] = React.useState<any>(null);
  const [enrollments, setEnrollments] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.all([getTraineeProfile(), getMyEnrollments()]).then(([profileData, enrollmentsData]) => {
      if (profileData.success) setTrainee(profileData.profile);
      if (enrollmentsData.success) setEnrollments(enrollmentsData.enrollments);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse p-2">
        <div className="h-32 bg-gradient-to-r from-slate-200 to-slate-100 rounded-2xl" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-slate-100 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => <div key={i} className="h-64 bg-slate-100 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (!trainee) return <div className="p-8 text-center text-slate-500">No trainee data available.</div>;

  const completedCount = enrollments.filter(e => e.status === "Completed").length;
  const isEmployed = enrollments[0]?.outcome === "Employed" || enrollments[0]?.outcome === "Self-Employed";

  const journey = enrollments.length > 0 ? [
    { title: "Enrolled in Training", desc: "Course started", status: "completed", icon: BookOpen },
    { title: "Course Completed", desc: completedCount > 0 ? `${completedCount} done` : "In Progress", status: enrollments[0].status === "Completed" ? "completed" : "active", icon: Award },
    { title: "Skill Certified", desc: "Assessment passed", status: enrollments[0].status === "Completed" ? "completed" : "upcoming", icon: Star },
    { title: "Placed in Job", desc: isEmployed ? enrollments[0].outcome : "Awaiting", status: isEmployed ? "completed" : "upcoming", icon: Briefcase },
  ] : [
    { title: "Register for a Course", desc: "Get started", status: "active", icon: BookOpen },
    { title: "Complete Training", desc: "Build skills", status: "upcoming", icon: Award },
    { title: "Get Certified", desc: "Earn credential", status: "upcoming", icon: Star },
    { title: "Get Placed", desc: "Start career", status: "upcoming", icon: Briefcase },
  ];

  const salaryHistory = [
    { period: "Month 1", salary: 15000 },
    { period: "Month 3", salary: 17000 },
    { period: "Month 6", salary: 18500 },
    { period: "Month 9", salary: 20000 },
    { period: "Current", salary: 22000 },
  ];

  const quickLinks = [
    { label: "My Courses", href: "/trainee/training", icon: BookOpen, color: "bg-blue-50 text-blue-600" },
    { label: "Employment", href: "/trainee/employment", icon: Briefcase, color: "bg-emerald-50 text-emerald-600" },
    { label: "Certificates", href: "/trainee/certificates", icon: Award, color: "bg-amber-50 text-amber-600" },
    { label: "My Profile", href: "/trainee/profile", icon: Target, color: "bg-purple-50 text-purple-600" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── HERO WELCOME BANNER ── */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary via-orange-500 to-indigo-700 p-6 shadow-lg">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-16 w-32 h-32 rounded-full border-4 border-white" />
          <div className="absolute bottom-4 right-4 w-20 h-20 rounded-full border-2 border-white" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="rounded-full p-1 bg-white/20 backdrop-blur-sm shadow-lg">
              <Avatar name={trainee.name} size="lg" />
            </div>
            <div>
              <p className="text-white/80 text-sm font-medium">Welcome back 👋</p>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">{trainee.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={enrollments[0]?.outcome || "Pending"} />
                <span className="text-white/60 text-xs font-mono">{trainee.id?.substring(0, 8)}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Courses", value: enrollments.length, icon: GraduationCap },
              { label: "Completed", value: completedCount, icon: CheckCircle2 },
              { label: "Salary", value: isEmployed ? "₹22k" : "N/A", icon: IndianRupee },
            ].map((s, i) => (
              <div key={i} className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 text-white text-center min-w-[80px] border border-white/20">
                <s.icon className="h-4 w-4 mx-auto mb-1 opacity-80" />
                <div className="text-xl font-extrabold">{s.value}</div>
                <div className="text-xs opacity-75">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── KPI CARDS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Courses Enrolled" value={enrollments.length.toString()} icon="GraduationCap" />
        <KPICard label="Courses Completed" value={completedCount.toString()} icon="Target" />
        <KPICard label="Employment Status" value={enrollments[0]?.outcome || "Pending"} icon="Briefcase" />
        <KPICard label="Current Salary" value={isEmployed ? formatCurrency(22000) : "N/A"} icon="IndianRupee" />
      </div>

      {/* ── QUICK LINKS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickLinks.map((q) => (
          <Link key={q.href} href={q.href} className="group flex items-center gap-3 bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className={`h-10 w-10 rounded-lg ${q.color} flex items-center justify-center flex-shrink-0`}>
              <q.icon className="h-5 w-5" />
            </div>
            <span className="text-sm font-semibold text-slate-700 group-hover:text-primary transition-colors">{q.label}</span>
            <ChevronRight className="h-4 w-4 text-slate-300 ml-auto group-hover:text-primary transition-colors" />
          </Link>
        ))}
      </div>

      {/* ── PROFILE + PERFORMANCE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Summary */}
        <Card className="border-slate-100 shadow-sm card-hover bg-white/60 backdrop-blur-md">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" /> My Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: "Email", value: trainee.email },
                { label: "Education", value: trainee.onboardingData?.education || "Not specified" },
                { label: "District", value: trainee.onboardingData?.district || "Not specified" },
                { label: "Mobile", value: trainee.onboardingData?.mobile || "Not specified" },
              ].map((item) => (
                <div key={item.label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <span className="text-slate-400 block text-xs font-bold uppercase tracking-wider mb-1">{item.label}</span>
                  <span className="font-semibold text-slate-800 text-sm break-all">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <span className="text-slate-400 block text-xs font-bold uppercase tracking-wider mb-1">Latest Course</span>
              <span className="font-semibold text-slate-800">{enrollments[0]?.courseTitle || "None enrolled yet"}</span>
            </div>
            <Link href="/trainee/profile" className="flex items-center justify-center gap-2 w-full h-10 border border-primary text-primary text-sm font-semibold rounded-xl hover:bg-primary/5 transition-colors">
              View Full Profile <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>

        {/* Performance Scores */}
        <Card className="border-slate-100 shadow-sm card-hover bg-white/60 backdrop-blur-md">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" /> Performance Scores
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {enrollments.length > 0 ? (
              <>
                <div className="flex justify-around items-center py-4">
                  <ScoreRing score={85} label="Attendance" size={100} />
                  <ScoreRing score={92} label="Assessment" size={100} />
                  <ScoreRing score={88} label="Skill Match" size={100} />
                </div>
                <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-emerald-700 font-medium">
                    Your overall score of <span className="font-extrabold">88%</span> is above the cohort average of 74%.
                  </p>
                </div>
              </>
            ) : (
              <div className="h-full min-h-[160px] flex flex-col items-center justify-center bg-slate-50 text-slate-500 border border-dashed rounded-xl text-sm p-6 text-center gap-3">
                <BookOpen className="h-10 w-10 text-slate-300" />
                <p>Enroll in a course to start tracking your performance scores!</p>
                <Link href="/trainee/training" className="text-sm font-semibold text-primary hover:underline">Browse Courses →</Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── SALARY PROGRESSION ── */}
      <SalaryProgressionChart data={salaryHistory} title="My Salary Growth" description="Monthly progression from placement to current" />

      {/* ── JOURNEY TRACKER ── */}
      <Card className="border-slate-100 shadow-sm bg-white/60 backdrop-blur-md">
        <CardHeader className="border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
          <CardTitle className="text-slate-900 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" /> My Journey Tracker
          </CardTitle>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {journey.filter(j => j.status === "completed").length}/{journey.length} Completed
          </span>
        </CardHeader>
        <CardContent className="pt-8 pb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between relative">
            {/* Background progress bar */}
            <div className="absolute top-7 left-0 w-full h-1 bg-slate-100 z-0 hidden sm:block rounded-full">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${(journey.filter(j => j.status === "completed").length / journey.length) * 100}%` }}
              />
            </div>
            {journey.map((event, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center group w-full sm:w-auto mb-10 sm:mb-0">
                <div className={`h-14 w-14 rounded-full flex items-center justify-center border-4 border-white shadow-md transition-all duration-300 group-hover:scale-110 ${
                  event.status === "completed" ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-emerald-200" :
                  event.status === "active" ? "bg-gradient-to-br from-primary to-orange-500 text-white shadow-orange-200 ring-4 ring-orange-100" :
                  "bg-slate-100 text-slate-400"
                }`}>
                  {event.status === "completed" ? <CheckCircle2 className="h-7 w-7" /> :
                   event.status === "active" ? <event.icon className="h-6 w-6 animate-pulse" /> :
                   <Clock className="h-6 w-6" />}
                </div>
                <div className="mt-4 text-center px-2">
                  <span className={`block text-sm font-bold ${event.status !== "upcoming" ? "text-slate-900" : "text-slate-400"}`}>{event.title}</span>
                  <span className="text-xs text-slate-400 mt-0.5">{event.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── UPCOMING ACTIONS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-slate-100 shadow-sm bg-white/60 backdrop-blur-md">
          <CardHeader className="border-b border-slate-100 pb-3">
            <CardTitle className="text-slate-900 text-base flex items-center gap-2">
              <Bell className="h-4 w-4 text-amber-500" /> Upcoming Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {[
              { label: "Update employment status", href: "/trainee/employment", urgent: true },
              { label: "Submit monthly feedback", href: "/trainee/feedback", urgent: false },
              { label: "Review consent settings", href: "/trainee/consent", urgent: false },
            ].map((item, i) => (
              <Link key={i} href={item.href} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors group">
                <div className={`h-2 w-2 rounded-full flex-shrink-0 ${item.urgent ? "bg-red-400 animate-pulse" : "bg-slate-300"}`} />
                <span className="text-sm font-medium text-slate-700 group-hover:text-primary transition-colors flex-1">{item.label}</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm bg-white/60 backdrop-blur-md">
          <CardHeader className="border-b border-slate-100 pb-3">
            <CardTitle className="text-slate-900 text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" /> Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {enrollments.slice(0, 3).length > 0 ? enrollments.slice(0, 3).map((enr: any, i: number) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{enr.courseTitle}</p>
                  <p className="text-xs text-slate-500">{enr.status} · {enr.outcome}</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-6 text-slate-400 text-sm">
                <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-40" />
                No activity yet. Enroll in a course!
              </div>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
