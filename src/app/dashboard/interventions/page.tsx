"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
  StatusBadge, Badge, Button, Input, Textarea, Select, Label, AIPredictionCard,
} from "@/components/ui";
import { toast } from "sonner";
// Using static interventions data
import { formatDate } from "@/lib/utils";
import { Lightbulb, Plus, ArrowRight, Target, Calendar, User, ChevronRight, CheckCircle2 } from "lucide-react";

export default function InterventionsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);

  const insights = useMemo(() => [
    { type: "risk", title: "High Attrition Risk", description: "Trainees in Retail sector in Pune show 25% higher attrition this quarter.", affected_count: 450, impact_score: 85 },
    { type: "opportunity", title: "Skill Shortage", description: "High demand for CNC Operators in Aurangabad with low supply.", affected_count: 200, impact_score: 92 },
  ], []);
  
  const interventions = useMemo(() => [
    { 
      id: "INT-001", type: "bridge_course", title: "Retail Retention Program", 
      target_audience: "Pune Retail Cohort", status: "active", budget_allocated: 500000, 
      start_date: "2024-05-01", expected_impact: "+15% retention",
      priority: "high", impact_value: 15, description: "Improve retention",
      created_by: "Admin", assigned_to: "Training Team", created_at: "2024-04-10T00:00:00Z",
      target_district: "Pune"
    },
    { 
      id: "INT-002", type: "policy", title: "CNC Equipment Subsidy", 
      target_audience: "Aurangabad Training Centers", status: "planned", budget_allocated: 2500000, 
      start_date: "2024-08-01", expected_impact: "500 new trainees",
      priority: "medium", impact_value: 10, description: "Subsidy for machinery",
      created_by: "Gov", assigned_to: "Finance", created_at: "2024-04-12T00:00:00Z",
      target_district: "Aurangabad"
    },
  ], []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const skillGapPrediction = { 
    id: "pred-1", type: "skill-gap-detection", risk_level: "high", confidence_score: 89, 
    details: { subject: "React", demand_score: 90, supply_score: 60 } 
  };
  const interventionPrediction = { 
    id: "pred-2", type: "intervention-recommendation", risk_level: "medium", confidence_score: 75,
    details: { recommended_action: "Bridge Course" }
  };

  const filtered = statusFilter === "all"
    ? interventions
    : interventions.filter((i) => i.status === statusFilter);

  const statusCounts = {
    recommended: interventions.filter((i) => i.status === "recommended").length,
    approved: interventions.filter((i) => i.status === "approved").length,
    "in-progress": interventions.filter((i) => i.status === "in-progress").length,
    completed: interventions.filter((i) => i.status === "completed").length,
    measured: interventions.filter((i) => i.status === "measured").length,
  };

  if (!isMounted) {
    return <div className="space-y-6 animate-pulse p-6">
      <div className="h-8 bg-muted rounded w-1/4"></div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4"><div className="h-24 bg-muted rounded"></div></div>
      <div className="h-96 bg-muted rounded w-full"></div>
    </div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Intervention Centre</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Data-driven interventions to improve skilling outcomes
          </p>
        </div>
        <Button onClick={() => setShowCreate(!showCreate)}>
          <Plus className="h-4 w-4" />
          Create Intervention
        </Button>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {Object.entries(statusCounts).map(([status, count]) => (
          <Card key={status} hover onClick={() => setStatusFilter(status === statusFilter ? "all" : status)}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{count}</p>
              <StatusBadge status={status} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI System Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AIPredictionCard prediction={skillGapPrediction} />
        <AIPredictionCard prediction={interventionPrediction} />
      </div>

      {/* Create form */}
      {showCreate && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Create New Intervention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Title</Label>
                <Input placeholder="e.g., React Bridge Course for IT Trainees" className="mt-1" />
              </div>
              <div>
                <Label>Type</Label>
                <Select className="mt-1">
                  <option value="">Select type</option>
                  <option value="bridge-course">Bridge Course</option>
                  <option value="employer-connect">Employer Connect</option>
                  <option value="curriculum-revision">Curriculum Revision</option>
                  <option value="interview-prep">Interview Preparation</option>
                  <option value="apprenticeship">Apprenticeship Expansion</option>
                  <option value="upskilling">Upskilling Program</option>
                  <option value="district-targeted">District Targeted</option>
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Select className="mt-1">
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </Select>
              </div>
              <div>
                <Label>Target District</Label>
                <Select className="mt-1">
                  <option value="">All districts</option>
                  <option value="Pune">Pune</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Nagpur">Nagpur</option>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label>Description</Label>
                <Textarea placeholder="Describe the intervention and its expected impact..." className="mt-1" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button 
              className="w-full sm:w-auto"
              onClick={() => {
                toast.success("Intervention created successfully!");
                setShowCreate(false);
              }}
            >
              Create Intervention
            </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Interventions list */}
      <div className="space-y-4">
        {filtered.map((intervention) => (
          <Card key={intervention.id} hover>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    intervention.priority === "high" ? "bg-red-50 text-red-600" :
                    intervention.priority === "medium" ? "bg-amber-50 text-amber-600" :
                    "bg-emerald-50 text-emerald-600"
                  }`}>
                    <Lightbulb className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{intervention.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge status={intervention.status} />
                      <StatusBadge status={intervention.priority} />
                      <Badge variant="outline">{intervention.type.replace(/-/g, " ")}</Badge>
                    </div>
                  </div>
                </div>
                {intervention.impact_value && (
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-600">+{intervention.impact_value}%</p>
                    <p className="text-[10px] text-muted-foreground">Impact</p>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-3">{intervention.description}</p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {intervention.created_by}
                </span>
                {intervention.assigned_to && (
                  <span className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    {intervention.assigned_to}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(intervention.created_at)}
                </span>
                {intervention.target_district && (
                  <Badge variant="outline">{intervention.target_district}</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
