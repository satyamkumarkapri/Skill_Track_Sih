import React from "react";
import { Card, CardHeader, CardTitle, CardContent, Avatar, StatusBadge, Badge, ScoreRing } from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/utils";
import { MapPin, Mail, Phone, Calendar, GraduationCap, User } from "lucide-react";
import { verifySession } from "@/lib/session";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { EditProfileDialog } from "./edit-profile-dialog";

export default async function TraineeProfilePage() {
  const session = await verifySession();
  let t: any = null;

  if (session && session.userId) {
    try {
      const db = await getDb();
      t = await db.collection("users").findOne({ _id: new ObjectId(session.userId) });
    } catch (e) {
      console.error(e);
    }
  }

  if (!t) {
    return <div className="p-6 text-muted-foreground">Profile not found.</div>;
  }

  // Fallbacks if data is missing
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
  
  // Hardcode scores for now or pull from some other collection
  const attendance = 95;
  const assessment = 88;
  const skillMatch = 92;

  const safeT = {
    ...t,
    _id: t._id.toString(),
    createdAt: t.createdAt ? t.createdAt.toISOString() : null,
    updatedAt: t.updatedAt ? t.updatedAt.toISOString() : null,
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Profile</h1>
          <p className="text-slate-500 mt-1">Manage your personal information and track your scores.</p>
        </div>
        <EditProfileDialog trainee={safeT} />
      </div>

      <div className="relative rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-xl overflow-hidden">
        {/* Banner Gradient matching project colors (Saffron to Green) */}
        <div className="h-32 w-full bg-gradient-to-r from-orange-400 via-amber-400 to-emerald-500 relative">
          <div className="absolute inset-0 bg-white/20 mix-blend-overlay"></div>
          {/* Subtle mesh pattern overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)] [background-size:20px_20px]"></div>
        </div>
        
        <div className="px-8 pb-8 relative">
          {/* Overlapping Profile Header */}
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center -mt-12 mb-8 relative z-10">
            <div className="h-28 w-28 rounded-full border-4 border-white bg-slate-50 shadow-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden">
              <span className="text-3xl font-extrabold text-slate-400 tracking-wider">
                {name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
              </span>
            </div>
            
            <div className="flex-1 mt-12 sm:mt-14">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-1">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{name}</h2>
                <StatusBadge status="certified" />
              </div>
              <p className="font-mono text-slate-500 text-sm flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">ID:</span> {traineeId}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 mt-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-slate-50 transition-colors">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Location</p>
                <p className="text-sm font-semibold text-slate-900">{district}, {taluka}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-slate-50 transition-colors">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Demographics</p>
                <p className="text-sm font-semibold text-slate-900">{gender} · {age} years</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-slate-50 transition-colors">
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Education</p>
                <p className="text-sm font-semibold text-slate-900">{education}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-slate-50 transition-colors">
              <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Email</p>
                <p className="text-sm font-semibold text-slate-900">{email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-slate-50 transition-colors">
              <div className="h-10 w-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Phone</p>
                <p className="text-sm font-semibold text-slate-900">{phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-slate-50 transition-colors">
              <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Enrolled Since</p>
                <p className="text-sm font-semibold text-slate-900">{formatDate(enrollmentDate)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl overflow-hidden p-8">
        <h3 className="text-lg font-bold text-slate-900 mb-8">Performance Scores</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center p-6 rounded-2xl bg-gradient-to-b from-blue-50/50 to-transparent">
            <ScoreRing score={attendance} label="Attendance" size={120} />
            <p className="text-center text-sm text-slate-500 mt-4">Maintained strong attendance across all active sessions.</p>
          </div>
          <div className="flex flex-col items-center p-6 rounded-2xl bg-gradient-to-b from-emerald-50/50 to-transparent">
            <ScoreRing score={assessment} label="Assessment" size={120} />
            <p className="text-center text-sm text-slate-500 mt-4">Consistently scoring above the 80th percentile.</p>
          </div>
          <div className="flex flex-col items-center p-6 rounded-2xl bg-gradient-to-b from-purple-50/50 to-transparent">
            <ScoreRing score={skillMatch} label="Skill Match" size={120} />
            <p className="text-center text-sm text-slate-500 mt-4">High alignment with current industry demands.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
