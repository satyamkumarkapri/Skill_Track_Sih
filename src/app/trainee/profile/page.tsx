"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, Avatar, StatusBadge, Badge, ScoreRing } from "@/components/ui";
// Using static sample data
import { formatCurrency, formatDate } from "@/lib/utils";
import { MapPin, Mail, Phone, Calendar, GraduationCap, User } from "lucide-react";

export default function TraineeProfilePage() {
  const t = {
    trainee_id: "TR-2024-9428",
    name: "Aarti Desai",
    employment_status: "employed",
    certification_status: "certified",
    district: "Pune",
    taluka: "Haveli",
    gender: "Female",
    age: 24,
    education: "HSC",
    email: "aarti.desai@example.com",
    phone: "+91 98765 43210",
    enrollment_date: "2024-01-15T00:00:00Z",
    attendance_percentage: 95,
    assessment_score: 88,
    skill_match_score: 92
  };
  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <h1 className="text-2xl font-bold">My Profile</h1>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <Avatar name={t.name} size="lg" />
            <div>
              <h2 className="text-lg font-bold">{t.name}</h2>
              <p className="text-xs font-mono text-muted-foreground">{t.trainee_id}</p>
              <div className="flex gap-2 mt-2">
                <StatusBadge status={t.employment_status} />
                <StatusBadge status={t.certification_status} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /> {t.district}, {t.taluka}</div>
            <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /> {t.gender} · {t.age} years</div>
            <div className="flex items-center gap-2"><GraduationCap className="h-4 w-4 text-muted-foreground" /> {t.education}</div>
            <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /> {t.email}</div>
            <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> {t.phone}</div>
            <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /> Enrolled: {formatDate(t.enrollment_date)}</div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Performance Scores</CardTitle></CardHeader>
        <CardContent>
          <div className="flex justify-around">
            <ScoreRing score={t.attendance_percentage || 0} label="Attendance" size={100} />
            <ScoreRing score={t.assessment_score || 0} label="Assessment" size={100} />
            <ScoreRing score={t.skill_match_score || 0} label="Skill Match" size={100} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
