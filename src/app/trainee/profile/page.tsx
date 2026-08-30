import React from "react";
import { Card, CardHeader, CardTitle, CardContent, StatusBadge, ScoreRing, Badge } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import { MapPin, Mail, Phone, Calendar, GraduationCap, User, Shield, TrendingUp, Award, BookOpen, Briefcase, CheckCircle2, Star, ExternalLink, Edit } from "lucide-react";
import { verifySession } from "@/lib/session";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { EditProfileDialog } from "./edit-profile-dialog";
import Link from "next/link";

export default async function TraineeProfilePage() {
  const session = await verifySession();
  let t: any = null;
  let enrollments: any[] = [];

  if (session && session.userId) {
    try {
      const db = await getDb();
      t = await db.collection("users").findOne({ _id: new ObjectId(session.userId) });
      const rawEnrollments = await db.collection("enrollments").find({ traineeId: session.userId }).toArray();
      enrollments = rawEnrollments.map(e => ({ ...e, _id: e._id.toString() }));
    } catch (e) {
      console.error(e);
    }
  }

  if (!t) {
    return <div className="p-6 text-muted-foreground">Profile not found.</div>;
  }

  const name = t.name || "Unknown Trainee";
  const traineeId = t._id.toString();
  const district = t.onboardingData?.district || "Maharashtra";
  const taluka = t.onboardingData?.taluka || "—";
  const gender = t.onboardingData?.gender || "Not specified";
  const age = t.onboardingData?.age || "—";
  const education = t.onboardingData?.education || "—";
  const email = t.email || "—";
  const phone = t.onboardingData?.phone || "—";
  const enrollmentDate = t.createdAt || new Date();
  const initials = name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

  const attendance = 95;
  const assessment = 88;
  const skillMatch = 92;
  const overallScore = Math.round((attendance + assessment + skillMatch) / 3);

  const completedCourses = enrollments.filter(e => e.status === "Completed").length;
  const activeCourses = enrollments.filter(e => e.status === "In Progress").length;
  const isEmployed = enrollments.some(e => e.outcome === "Employed" || e.outcome === "Self-Employed");

  const safeT = {
    ...t,
    _id: t._id.toString(),
    createdAt: t.createdAt ? t.createdAt.toISOString() : null,
    updatedAt: t.updatedAt ? t.updatedAt.toISOString() : null,
  };

  const infoItems = [
    { label: "Location", value: `${district}, ${taluka}`, icon: MapPin, color: "bg-blue-100 text-blue-600" },
    { label: "Demographics", value: `${gender} · ${age} years`, icon: User, color: "bg-purple-100 text-purple-600" },
    { label: "Education", value: education, icon: GraduationCap, color: "bg-emerald-100 text-emerald-600" },
    { label: "Email", value: email, icon: Mail, color: "bg-orange-100 text-orange-600" },
    { label: "Phone", value: phone, icon: Phone, color: "bg-cyan-100 text-cyan-600" },
    { label: "Enrolled Since", value: formatDate(enrollmentDate), icon: Calendar, color: "bg-rose-100 text-rose-600" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── PAGE HEADER ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Profile</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage your personal information and track your scores.</p>
        </div>
        <EditProfileDialog trainee={safeT} />
      </div>

      {/* ── HERO PROFILE BANNER ── */}
      <div className="relative rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg overflow-hidden">
        {/* Banner */}
        <div className="h-36 w-full bg-gradient-to-r from-primary via-orange-400 to-emerald-500 relative">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:24px_24px]" />
          <div className="absolute top-4 right-6 flex gap-2">
            <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30">
              🇮🇳 SIH26135
            </span>
            <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30">
              SkillTrack Maharashtra
            </span>
          </div>
        </div>

        <div className="px-6 pb-6">
          {/* Profile Avatar overlapping banner */}
          <div className="flex flex-col sm:flex-row gap-5 items-start -mt-14 mb-6 relative z-10">
            <div className="h-28 w-28 rounded-full border-4 border-white bg-gradient-to-br from-primary to-orange-400 shadow-xl flex items-center justify-center flex-shrink-0">
              <span className="text-3xl font-extrabold text-white">{initials}</span>
            </div>
            <div className="sm:mt-16 flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h2 className="text-2xl font-extrabold text-slate-900">{name}</h2>
                <StatusBadge status="certified" />
                {isEmployed && <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">✅ Employed</span>}
              </div>
              <p className="font-mono text-slate-400 text-xs">ID: {traineeId}</p>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Overall Score", value: `${overallScore}%`, icon: TrendingUp, color: "from-primary/10 to-orange-50", text: "text-primary" },
              { label: "Courses Completed", value: completedCourses, icon: CheckCircle2, color: "from-emerald-50 to-green-50", text: "text-emerald-600" },
              { label: "Active Courses", value: activeCourses, icon: BookOpen, color: "from-blue-50 to-indigo-50", text: "text-blue-600" },
              { label: "Status", value: isEmployed ? "Employed" : "In Training", icon: Briefcase, color: "from-amber-50 to-yellow-50", text: "text-amber-600" },
            ].map((stat) => (
              <div key={stat.label} className={`bg-gradient-to-br ${stat.color} rounded-xl p-4 border border-white/80 shadow-sm`}>
                <stat.icon className={`h-5 w-5 ${stat.text} mb-2`} />
                <p className={`text-xl font-extrabold ${stat.text}`}>{stat.value}</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {infoItems.map((item) => (
              <div key={item.label} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50/60 border border-slate-100 hover:bg-slate-50 transition-colors group">
                <div className={`h-10 w-10 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-900 truncate">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PERFORMANCE SCORES ── */}
      <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" /> Performance Scores
          </h3>
          <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
            Overall: {overallScore}%
          </span>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[
              { score: attendance, label: "Attendance", desc: "Maintained strong attendance across all active sessions.", color: "from-blue-50/80", ring: "#3b82f6" },
              { score: assessment, label: "Assessment", desc: "Consistently scoring above the 80th percentile.", color: "from-emerald-50/80", ring: "#10b981" },
              { score: skillMatch, label: "Skill Match", desc: "High alignment with current industry demands.", color: "from-purple-50/80", ring: "#8b5cf6" },
            ].map((item) => (
              <div key={item.label} className={`flex flex-col items-center p-6 rounded-2xl bg-gradient-to-b ${item.color} to-transparent border border-slate-100`}>
                <ScoreRing score={item.score} label={item.label} size={120} />
                <p className="text-center text-sm text-slate-500 mt-4 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Insight Banner */}
          <div className="bg-gradient-to-r from-primary/5 to-emerald-50 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
            <Star className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-slate-800">Above Cohort Average</p>
              <p className="text-sm text-slate-600 mt-0.5">
                Your overall score of <strong className="text-primary">{overallScore}%</strong> puts you in the top 30% of trainees in your batch.
                Keep maintaining this performance to improve your employment prospects!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── ENROLLED COURSES ── */}
      {enrollments.length > 0 && (
        <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" /> Enrolled Courses
            </h3>
            <Link href="/trainee/training" className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">
              View All <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="p-6 space-y-3">
            {enrollments.map((enr: any, i: number) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Award className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm truncate">{enr.courseTitle}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Enrolled on {formatDate(enr.enrollmentDate || new Date())}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    enr.status === "Completed" ? "bg-emerald-100 text-emerald-700" :
                    enr.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                    "bg-slate-100 text-slate-600"
                  }`}>{enr.status}</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    enr.outcome === "Employed" ? "bg-green-100 text-green-700" :
                    enr.outcome === "Pending" ? "bg-amber-100 text-amber-700" :
                    "bg-slate-100 text-slate-600"
                  }`}>{enr.outcome}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SECURITY ── */}
      <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg p-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-emerald-600" /> Privacy & Consent
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: "Data sharing with employers is enabled", ok: true, href: "/trainee/consent" },
            { label: "GDPR-compliant data storage", ok: true, href: "/trainee/consent" },
            { label: "Profile visible to course providers", ok: true, href: "/trainee/consent" },
            { label: "Follow-up tracking: Active", ok: true, href: "/trainee/follow-ups" },
          ].map((item, i) => (
            <Link key={i} href={item.href} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors group">
              <CheckCircle2 className={`h-5 w-5 flex-shrink-0 ${item.ok ? "text-emerald-500" : "text-slate-300"}`} />
              <span className="text-sm font-medium text-slate-700 group-hover:text-primary transition-colors flex-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
