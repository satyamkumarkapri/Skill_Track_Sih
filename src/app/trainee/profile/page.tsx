import React from "react";
import { Card, CardHeader, CardTitle, CardContent, Avatar, StatusBadge, Badge, ScoreRing } from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/utils";
import { MapPin, Mail, Phone, Calendar, GraduationCap, User } from "lucide-react";
import { verifySession } from "@/lib/session";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

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

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <h1 className="text-2xl font-bold">My Profile</h1>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <Avatar name={name} size="lg" />
            <div>
              <h2 className="text-lg font-bold">{name}</h2>
              <p className="text-xs font-mono text-muted-foreground">{traineeId}</p>
              <div className="flex gap-2 mt-2">
                <StatusBadge status="certified" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /> {district}, {taluka}</div>
            <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /> {gender} · {age} years</div>
            <div className="flex items-center gap-2"><GraduationCap className="h-4 w-4 text-muted-foreground" /> {education}</div>
            <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /> {email}</div>
            <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> {phone}</div>
            <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /> Enrolled: {formatDate(enrollmentDate)}</div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Performance Scores</CardTitle></CardHeader>
        <CardContent>
          <div className="flex justify-around">
            <ScoreRing score={attendance} label="Attendance" size={100} />
            <ScoreRing score={assessment} label="Assessment" size={100} />
            <ScoreRing score={skillMatch} label="Skill Match" size={100} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
