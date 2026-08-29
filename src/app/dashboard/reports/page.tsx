"use client";

import React, { useState } from "react";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
  Button, Select, Badge,
} from "@/components/ui";
import { FileText, Download, Calendar, FileBarChart, Map, Users, Building2 } from "lucide-react";

const reportTypes = [
  { id: "monthly", label: "Monthly Outcome Report", icon: Calendar, description: "Comprehensive monthly outcomes summary across all districts and courses" },
  { id: "district", label: "District Report", icon: Map, description: "District-specific employment, retention, and skill gap analysis" },
  { id: "provider", label: "Provider Performance Report", icon: Building2, description: "Training provider outcome effectiveness scorecards" },
  { id: "course", label: "Course Outcome Report", icon: FileBarChart, description: "Course-wise completion, placement, and salary data" },
  { id: "skill-gap", label: "Skill Gap Report", icon: FileText, description: "Industry demand vs. training supply analysis" },
  { id: "demographic", label: "Demographic Analytics Report", icon: Users, description: "Age, gender, and education-wise outcome analysis" },
];

const recentReports = [
  { name: "Monthly Outcome Report - September 2025", date: "2025-09-30", type: "monthly", status: "ready" },
  { name: "Pune District Report - Q3 2025", date: "2025-09-28", type: "district", status: "ready" },
  { name: "Provider Scorecard - September 2025", date: "2025-09-25", type: "provider", status: "ready" },
  { name: "IT Sector Skill Gap Analysis", date: "2025-09-20", type: "skill-gap", status: "ready" },
  { name: "Monthly Outcome Report - August 2025", date: "2025-08-31", type: "monthly", status: "ready" },
];

export default function ReportsPage() {
  const [generating, setGenerating] = useState<string | null>(null);

  const handleGenerate = (id: string) => {
    setGenerating(id);
    setTimeout(() => setGenerating(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">Generate and download outcome reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <Card key={report.id} hover>
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{report.label}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{report.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleGenerate(report.id)}
                    loading={generating === report.id}
                    className="flex-1"
                  >
                    <Download className="h-3.5 w-3.5" />
                    CSV
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleGenerate(report.id + "-pdf")}
                    loading={generating === report.id + "-pdf"}
                    className="flex-1"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Previously generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentReports.map((report, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{report.name}</p>
                    <p className="text-xs text-muted-foreground">{report.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="success">Ready</Badge>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
