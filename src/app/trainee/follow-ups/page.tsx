import React from "react";
import { Card, CardContent } from "@/components/ui";
import { Calendar, ShieldCheck, Clock, UserCheck } from "lucide-react";
import { verifySession } from "@/lib/session";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import FollowUpForm from "./followup-form";

export default async function TraineeFollowUpsPage() {
  const session = await verifySession();
  
  if (!session || !session.userId) {
    return <div className="p-6">Not logged in.</div>;
  }

  const db = await getDb();
  
  // 1. Fetch system follow-ups from the database
  const dbFollowUps = await db.collection("followups").find({ traineeId: session.userId }).toArray();
  
  // 2. Fetch trainee's self-reported follow-ups from their user profile
  const user = await db.collection("users").findOne({ _id: new ObjectId(session.userId) });
  const selfReported = user?.followUps || [];

  const displayFollowUps = dbFollowUps.map(f => ({
    id: f._id.toString(),
    type: f.type || "Scheduled",
    date: f.date || new Date().toISOString().split('T')[0],
    status: f.status === "responded" || f.status === "confirmed" ? "confirmed" : "pending",
    channel: f.channel || "Platform",
    employment: f.employment || "—",
    salary: f.salary ? `₹${f.salary.toLocaleString()}` : "—",
    satisfaction: f.satisfaction || 0,
    source: "System",
  }));

  // Combine with self-reported ones
  const selfReportedMapped = selfReported.map((f: any) => ({
    id: f.id,
    type: "Self-Reported Status",
    date: f.date ? new Date(f.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    status: "confirmed", // self-reported is inherently confirmed by the user
    channel: "Self-Service",
    employment: f.status,
    salary: "—",
    satisfaction: 0,
    source: "Trainee",
    notes: f.notes
  }));

  const allFollowUps = [...displayFollowUps, ...selfReportedMapped].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Status & Follow-ups</h1>
        <p className="text-slate-500 mt-1">Track your post-certification milestones or submit a new status update.</p>
      </div>

      {/* Form for Trainee to submit their own status */}
      <FollowUpForm />
      
      <div className="space-y-4">
        {allFollowUps.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="p-12 text-center text-muted-foreground flex flex-col items-center">
              <Clock className="h-12 w-12 mb-4 opacity-50" />
              <p>No follow-ups recorded yet. Submit your current status above!</p>
            </CardContent>
          </Card>
        ) : (
          allFollowUps.map((f, i) => (
            <Card key={f.id || i} className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className={`p-5 flex items-center justify-between border-b ${
                  f.source === 'Trainee' ? 'bg-blue-50/50 border-blue-100' :
                  f.status === 'confirmed' ? 'bg-emerald-50/50 border-emerald-100' : 
                  'bg-slate-50/50 border-slate-100'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      f.source === 'Trainee' ? 'bg-blue-100 text-blue-600' :
                      f.status === 'confirmed' ? 'bg-emerald-100 text-emerald-600' : 
                      'bg-slate-200 text-slate-500'
                    }`}>
                      {f.source === 'Trainee' ? <UserCheck className="h-5 w-5" /> : f.status === 'confirmed' ? <ShieldCheck className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{f.type}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                        <Calendar className="h-3 w-3" /> {f.date} • {f.source}
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                      f.source === 'Trainee' ? 'bg-blue-100 text-blue-700' :
                      f.status === "confirmed" ? "bg-emerald-100 text-emerald-700" : 
                      "bg-amber-100 text-amber-700"
                    }`}>
                      {f.status}
                    </span>
                  </div>
                </div>
                
                {f.status === "confirmed" && (
                  <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-6 bg-white">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Status</p>
                      <p className="text-sm font-bold text-slate-900">{f.employment}</p>
                    </div>
                    {f.source !== 'Trainee' && (
                      <>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Salary</p>
                          <p className="text-sm font-bold text-slate-900">{f.salary}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Satisfaction</p>
                          <p className="text-sm font-bold text-amber-500 tracking-widest">
                            {"★".repeat(f.satisfaction)}{"☆".repeat(5 - f.satisfaction)}
                          </p>
                        </div>
                      </>
                    )}
                    {f.notes && (
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 relative before:absolute before:text-slate-200 before:font-serif before:text-4xl before:content-[''] before:left-2 before:-top-1">
                        <p className="text-sm text-slate-700 italic relative z-10 pl-2">&quot;{f.notes}&quot;</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
