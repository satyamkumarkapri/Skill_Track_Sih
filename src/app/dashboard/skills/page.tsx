"use client";

import React, { useMemo, useState } from "react";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
  KPICard, StatusBadge, Badge, Select, Button,
} from "@/components/ui";
import { SkillGapChart } from "@/components/charts";
import { getMongoDBCharts } from "@/actions/analytics";
import { Target, AlertTriangle, TrendingUp, BookOpen, ArrowRight } from "lucide-react";

export default function SkillsPage() {
  const [skillGaps, setSkillGaps] = useState<any[]>([]);
  const [severity, setSeverity] = useState("all");

  React.useEffect(() => {
    getMongoDBCharts().then((data) => {
      if (data?.skillGaps) {
        // Map the static dashboard data into the format expected by the table below
        // The table expects: skill, gap_severity, affected_courses, demand_score, supply_score, affected_districts
        const mapped = data.skillGaps.map((sg: any) => ({
          ...sg,
          affected_courses: ["Full Stack", "Data Eng"],
          affected_districts: ["Mumbai", "Pune", "Thane"]
        }));
        setSkillGaps(mapped);
      }
    });
  }, []);

  const filtered = severity === "all" ? skillGaps : skillGaps.filter((s) => s.gap_severity.toLowerCase() === severity);

  if (skillGaps.length === 0) {
    return <div className="p-6 animate-pulse">Loading skill gaps...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Skill Gap Intelligence</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Compare skills taught in training with industry demand
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Critical Gaps" value={String(skillGaps.filter((s) => s.gap_severity === "high").length)} icon="AlertTriangle" trend="up" change={2} changeLabel="new this quarter" />
        <KPICard label="Moderate Gaps" value={String(skillGaps.filter((s) => s.gap_severity === "medium").length)} icon="Target" />
        <KPICard label="Avg Gap Score" value="38%" icon="BarChart3" trend="down" change={-5.2} changeLabel="improving" />
        <KPICard label="Courses Affected" value="18" icon="BookOpen" />
      </div>

      <SkillGapChart data={skillGaps} />

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Skill Gap Details</CardTitle>
              <CardDescription>Detailed breakdown of each identified skill gap</CardDescription>
            </div>
            <Select value={severity} onChange={(e) => setSeverity(e.target.value)} className="w-[150px] h-8 text-xs">
              <option value="all">All Severities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filtered.map((gap, i) => (
              <div key={i} className="p-4 rounded-lg border border-border hover:border-primary/20 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">{gap.skill}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Affects: {gap.affected_courses?.join(", ") || "Multiple"}
                    </p>
                  </div>
                  <StatusBadge status={gap.gap_severity.toLowerCase()} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Industry Demand</p>
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${gap.demand_score}%` }} />
                      </div>
                      <span className="text-xs font-medium">{gap.demand_score}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Current Supply</p>
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-saffron rounded-full" style={{ width: `${gap.supply_score}%` }} />
                      </div>
                      <span className="text-xs font-medium">{gap.supply_score}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Gap Size</p>
                    <p className="text-lg font-bold text-red-600">{gap.demand_score - gap.supply_score}pts</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-border/50">
                  <p className="text-xs text-muted-foreground">
                    <strong>Districts affected:</strong> {gap.affected_districts?.join(", ") || "Statewide"}
                  </p>
                  {gap.gap_severity.toLowerCase() === "high" && (
                    <p className="text-xs text-primary mt-1 font-medium">
                      ⚡ Recommendation: Update curriculum to include {gap.skill} training
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
