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
        <Card>
          <CardHeader><CardTitle>My Profile</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-start gap-4 mb-4">
              <Avatar name={trainee.name} size="lg" />
              <div>
                <h3 className="text-base font-semibold">{trainee.name}</h3>
                <p className="text-xs font-mono text-muted-foreground">{trainee.id.substring(0, 8)}</p>
                <div className="flex gap-2 mt-2">
                  <StatusBadge status={enrollments[0]?.outcome || "Pending"} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">Email:</span> <span className="font-medium ml-1">{trainee.email}</span></div>
              <div><span className="text-muted-foreground">Education:</span> <span className="font-medium ml-1">{trainee.onboardingData?.education || "Not specified"}</span></div>
              <div className="col-span-2"><span className="text-muted-foreground">Latest Course:</span> <span className="font-medium ml-1">{enrollments[0]?.courseTitle || "None"}</span></div>
            </div>
          </CardContent>
        </Card>

        {/* Scores */}
        <Card>
          <CardHeader><CardTitle>Performance</CardTitle></CardHeader>
          <CardContent>
            {enrollments.length > 0 ? (
              <div className="flex justify-around">
                <ScoreRing score={85} label="Attendance" size={90} />
                <ScoreRing score={92} label="Assessment" size={90} />
                <ScoreRing score={88} label="Skill Match" size={90} />
              </div>
            ) : (
              <div className="h-full min-h-[120px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg text-sm p-6 text-center">
                Enroll in a course to start tracking your performance scores!
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Salary Progression */}
      <SalaryProgressionChart data={salaryHistory} title="My Salary Growth" description="From placement to current" />

      {/* Journey */}
      <Card>
        <CardHeader>
          <CardTitle>My Journey</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {journey.map((event, i) => (
              <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${
                event.status === "completed" ? "bg-emerald-50 border-emerald-200 text-emerald-800" :
                "bg-muted border-border text-muted-foreground"
              }`}>
                {event.status === "completed" ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                <span className="font-medium">{event.title}</span>
                {i < journey.length - 1 && <span className="text-muted-foreground hidden sm:inline">→</span>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
