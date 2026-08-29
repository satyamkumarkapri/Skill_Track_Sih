"use client";

import React from "react";
import Link from "next/link";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
  Badge, StatusBadge, Avatar, ProgressBar, ScoreRing, ConfidenceScore, Button, AIPredictionCard,
} from "@/components/ui";
import { SalaryProgressionChart } from "@/components/charts";
import { getTraineeById } from "@/actions/trainees";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  ArrowLeft, MapPin, GraduationCap, Briefcase, Phone,
  Mail, Calendar, User, CheckCircle2, Clock, AlertTriangle,
  Brain, TrendingUp, Target, Shield, ChevronRight,
} from "lucide-react";

export default function TraineeProfilePage({ params }: { params: { id: string } }) {
  const [trainee, setTrainee] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getTraineeById(params.id).then(data => {
      setTrainee(data);
      setLoading(false);
    });
  }, [params.id]);

  if (loading) {
    return <div className="space-y-6 animate-pulse p-6">
      <div className="h-8 bg-muted rounded w-1/4"></div>
      <div className="h-96 bg-muted rounded w-full"></div>
    </div>;
  }

  if (!trainee) {
    return <div className="p-12 text-center text-muted-foreground">Trainee not found in MongoDB</div>;
  }

  // Generate localized mock structures for complex components for hackathon demo
  const journey = [
    { title: "Enrolled in Training", status: "completed", date: "2024-01-15", description: "Registered for Full Stack Web Development" },
    { title: "Course Completed", status: trainee.employment_status !== "enrolled" ? "completed" : "upcoming", date: "2024-06-30", description: "Completed with 85% score" },
    { title: "Placed in Job", status: trainee.employment_status === "employed" ? "completed" : "upcoming", date: "2025-02-20", description: "Hired as Junior Developer" }
  ];
  
  const salaryHistory = [
    { period: "Month 1", salary: 15000 },
    { period: "Month 6", salary: 18000 },
    { period: "Current", salary: trainee.current_salary || 22000 }
  ];

  const placementPrediction = { 
    title: "High Placement Probability",
    riskLevel: "low" as const,
    prediction: "High Probability", 
    confidence: 85, 
    factors: [
      { factor: "Strong attendance", impact: "positive" as const, weight: 80 },
      { factor: "High assessment score", impact: "positive" as const, weight: 90 }
    ], 
    recommendation: "Ready for interviews." 
  };
  const employmentPrediction = { 
    title: "Stable Employment",
    riskLevel: "medium" as const,
    prediction: "Stable", 
    confidence: 65, 
    factors: [
      { factor: "Average salary growth", impact: "positive" as const, weight: 60 },
      { factor: "Steady role", impact: "positive" as const, weight: 70 }
    ], 
    recommendation: "Monitor next quarter." 
  };
  const attritionPrediction = { 
    title: "Low Attrition Risk",
    riskLevel: "low" as const,
    prediction: "Low Risk", 
    confidence: 15, 
    factors: [
      { factor: "Satisfied with commute", impact: "positive" as const, weight: 70 },
      { factor: "Recent raise", impact: "positive" as const, weight: 85 }
    ], 
    recommendation: "No action needed." 
  };

  const taughtSkills = ["HTML", "CSS", "JavaScript", "SQL", "Git", "Bootstrap"];
  const industrySkills = ["React", "Node.js", "TypeScript", "AWS", "Docker", "MongoDB", "REST APIs"];
  const acquiredSkills = taughtSkills;
  const missingSkills = industrySkills.filter((s) => !taughtSkills.includes(s));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back button */}
      <Link href="/dashboard/trainees" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Trainees
      </Link>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar name={trainee.name} size="lg" />
            <div className="flex-1 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div>
                  <h1 className="text-xl font-bold text-foreground">{trainee.name}</h1>
                  <p className="text-xs font-mono text-muted-foreground mt-0.5">{trainee.trainee_id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={trainee.employment_status} />
                  <StatusBadge status={trainee.certification_status} />
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{trainee.district}, {trainee.taluka}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{trainee.gender} · {trainee.age} years · {trainee.education}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GraduationCap className="h-4 w-4" />
                  <span>{trainee.course_name}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  <span>{trainee.current_salary ? formatCurrency(trainee.current_salary) + "/mo" : "Not employed"}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Outcome Journey Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Outcome Journey</CardTitle>
              <CardDescription>Longitudinal tracking from enrollment to employment outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {journey.map((event, i) => (
                  <div key={i} className="flex gap-4">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        event.status === "completed" ? "bg-emerald-100 text-emerald-600" :
                        event.status === "upcoming" ? "bg-muted text-muted-foreground" :
                        "bg-amber-100 text-amber-600"
                      }`}>
                        {event.status === "completed" ? <CheckCircle2 className="h-4 w-4" /> :
                         event.status === "upcoming" ? <Clock className="h-4 w-4" /> :
                         <AlertTriangle className="h-4 w-4" />}
                      </div>
                      {i < journey.length - 1 && (
                        <div className={`w-0.5 flex-1 min-h-[40px] ${
                          event.status === "completed" ? "bg-emerald-200" : "bg-border"
                        }`} />
                      )}
                    </div>
                    {/* Content */}
                    <div className="pb-6 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-foreground">{event.title}</h4>
                        <StatusBadge status={event.status} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{formatDate(event.date)}</p>
                      <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Salary Progression */}
          <SalaryProgressionChart
            data={salaryHistory}
            title="Salary Progression"
            description="Individual salary growth from placement to current"
          />

          {/* Employment Card */}
          <Card>
            <CardHeader>
              <CardTitle>Current Employment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Employer</p>
                  <p className="text-sm font-medium mt-0.5">TechMaharashtra Solutions Pvt. Ltd.</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Job Role</p>
                  <p className="text-sm font-medium mt-0.5">Junior Developer</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Joining Date</p>
                  <p className="text-sm font-medium mt-0.5">{formatDate("2025-02-20")}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Current Salary</p>
                  <p className="text-sm font-medium mt-0.5">{formatCurrency(22000)}/month</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-sm font-medium mt-0.5">6 months</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Verification</p>
                  <StatusBadge status="verified" />
                </div>
              </div>
              <div className="mt-6">
                <ConfidenceScore score={85} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - 1/3 width */}
        <div className="space-y-6">
          {/* Score Rings */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                <ScoreRing score={trainee.attendance_percentage || 0} label="Attendance" />
                <ScoreRing score={trainee.assessment_score || 0} label="Assessment" />
                <ScoreRing score={trainee.skill_match_score || 0} label="Skill Match" />
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Skills Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Acquired Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {acquiredSkills.map((s) => (
                    <Badge key={s} variant="success">{s}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Industry Demand (Missing)</p>
                <div className="flex flex-wrap gap-1.5">
                  {missingSkills.map((s) => (
                    <Badge key={s} variant="destructive">{s}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <div className="space-y-4">
            <AIPredictionCard prediction={placementPrediction} />
            <AIPredictionCard prediction={employmentPrediction} />
            <AIPredictionCard prediction={attritionPrediction} />
          </div>

          {/* Consent Status */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-india-green" />
                <CardTitle>Consent Status</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { purpose: "Employment Tracking", granted: true },
                  { purpose: "Follow-up Communication", granted: true },
                  { purpose: "Analytics Usage", granted: true },
                  { purpose: "Employer Verification", granted: true },
                  { purpose: "Data Sharing", granted: false },
                ].map((c) => (
                  <div key={c.purpose} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{c.purpose}</span>
                    <Badge variant={c.granted ? "success" : "secondary"}>
                      {c.granted ? "Granted" : "Withdrawn"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
