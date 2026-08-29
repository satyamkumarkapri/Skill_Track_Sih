"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  KPICard,
  Badge,
  Select,
} from "@/components/ui";
import { toast } from "sonner";
import {
  EmploymentTrendChart,
  EmploymentStatusDonut,
  SalaryProgressionChart,
  HorizontalBarChart,
  SkillGapChart,
} from "@/components/charts";
import { getMongoDBKPIs, getMongoDBCharts } from "@/actions/analytics";
import { Search, Bell, User, MapPin, Target, ChevronRight, AlertTriangle, Lightbulb } from "lucide-react";

export default function GovernmentDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    Promise.all([getMongoDBKPIs(), getMongoDBCharts()]).then(([liveKpis, charts]) => {
      if (charts) {
        setData({
          kpis: liveKpis,
          ...charts
        });
      }
    });
  }, []);

  if (!data) {
    return (
      <div className="space-y-6 animate-pulse p-6">
        <div className="h-10 bg-muted rounded w-full"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4"><div className="h-24 bg-muted rounded"></div></div>
        <div className="h-96 bg-muted rounded w-full"></div>
      </div>
    );
  }

  const { kpis, trendData, statusData, salaryData, nonPlacementData, attritionData, providerData, courseData, skillGaps } = data;

  return (
    <div className="space-y-4 animate-fade-in bg-slate-50/50 min-h-screen pb-10">
      
      {/* ROW 1: Welcome + Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-border/50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">SkillTrack Maharashtra — Government Overview</h2>
            <p className="text-xs text-muted-foreground">Live data from MongoDB · SIH Problem Statement 26135</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-1">Date Range</span>
            <Select className="h-8 text-xs bg-slate-50 border-border/50 w-[180px]">
              <option>01 Apr 2024 - 31 Mar 2026</option>
              <option>01 Apr 2023 - 31 Mar 2024</option>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-1">District</span>
            <Select className="h-8 text-xs bg-slate-50 border-border/50 w-[140px]">
              <option>All Districts</option>
              <option>Pune</option>
              <option>Mumbai</option>
              <option>Nagpur</option>
              <option>Nashik</option>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-1">Program Type</span>
            <Select className="h-8 text-xs bg-slate-50 border-border/50 w-[140px]">
              <option>All</option>
              <option>PMKVY</option>
              <option>DDU-GKY</option>
              <option>Skill India</option>
            </Select>
          </div>
        </div>
      </div>

      {/* ROW 2: KPI Grid (8 metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {kpis.map((kpi: any, i: number) => (
          <KPICard key={kpi.label} {...kpi} delay={i * 20} className="shadow-sm border-border/50" />
        ))}
      </div>

      {/* ROW 3: Trend, Donut, Map */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
        <div className="lg:col-span-3">
          <EmploymentTrendChart data={trendData} />
        </div>
        <div className="lg:col-span-2">
          <EmploymentStatusDonut data={statusData} />
        </div>
        <div className="lg:col-span-1">
          <Card className="h-full flex flex-col justify-between overflow-hidden shadow-sm border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">District Performance</CardTitle>
              <CardDescription className="text-xs">by Employment Rate</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center relative p-4">
              {/* Fake Map Visual for layout matching */}
              <div className="relative w-full aspect-square max-h-[160px] opacity-80 mix-blend-multiply">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
                  <path d="M40,20 Q60,10 80,30 T90,60 T60,90 T20,80 T10,50 Z" fill="#fcd34d" />
                  <path d="M40,20 Q60,10 70,25 T60,40 T30,35 Z" fill="#f87171" />
                  <path d="M60,40 Q80,30 90,60 T70,70 T50,55 Z" fill="#34d399" />
                  <path d="M20,80 T10,50 Q30,35 50,55 T60,90 Z" fill="#60a5fa" />
                </svg>
                {/* Heatmap Legend */}
                <div className="absolute bottom-0 right-0 flex flex-col gap-1 items-end">
                  <span className="text-[9px] text-muted-foreground uppercase">High</span>
                  <div className="w-16 h-1.5 bg-gradient-to-r from-red-400 via-amber-400 to-emerald-400 rounded-full" />
                  <span className="text-[9px] text-muted-foreground uppercase">Low</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>


      {/* ROW 4: 4 Bar Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/70 backdrop-blur-md border border-slate-100 rounded-2xl shadow-sm p-4 card-hover transition-all duration-300 h-full">
          <HorizontalBarChart
            data={providerData}
            dataKey="score"
            nameKey="provider"
            title="Top Providers"
            description="by Employment Rate"
            color="#3b82f6"
            showPercentage={true}
          />
        </div>
        <div className="bg-white/70 backdrop-blur-md border border-slate-100 rounded-2xl shadow-sm p-4 card-hover transition-all duration-300 h-full">
          <HorizontalBarChart
            data={courseData}
            dataKey="score"
            nameKey="course"
            title="Top Courses"
            description="by Placement Rate"
            color="#10b981"
            showPercentage={true}
          />
        </div>
        <div className="bg-white/70 backdrop-blur-md border border-slate-100 rounded-2xl shadow-sm p-4 card-hover transition-all duration-300 h-full">
          <HorizontalBarChart
            data={nonPlacementData}
            dataKey="percentage"
            nameKey="reason"
            title="Non-Placement Reasons"
            description="Top 5 factors"
            color="#f59e0b"
            showPercentage={true}
          />
        </div>
        <div className="bg-white/70 backdrop-blur-md border border-slate-100 rounded-2xl shadow-sm p-4 card-hover transition-all duration-300 h-full">
          <HorizontalBarChart
            data={attritionData}
            dataKey="percentage"
            nameKey="reason"
            title="Attrition Reasons"
            description="Top 5 factors"
            color="#ef4444"
            showPercentage={true}
          />
        </div>
      </div>

      {/* ROW 5: Salary, Skills, AI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white/70 backdrop-blur-md border border-slate-100 rounded-2xl shadow-sm p-4 card-hover transition-all duration-300 h-full">
          <SalaryProgressionChart
            data={salaryData}
            title="SALARY PROGRESSION"
            description="(Median Salary)"
          />
        </div>
        
        <div className="bg-white/70 backdrop-blur-md border border-slate-100 rounded-2xl shadow-sm p-4 card-hover transition-all duration-300 h-full">
          <SkillGapChart data={skillGaps} />
        </div>

        <Card className="shadow-sm border-border/50 border-t-4 border-t-indigo-600 bg-gradient-to-b from-indigo-50/50 to-white card-hover transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-indigo-900">
              <Lightbulb className="h-4 w-4 text-indigo-600" />
              AI DECISION SUPPORT
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex flex-col items-center justify-center bg-white p-4 rounded-xl border border-border/50 shadow-sm min-w-[100px]">
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> High Risk
                </span>
                <span className="text-3xl font-black text-slate-900">78%</span>
                <span className="text-[9px] text-muted-foreground mt-1">Attrition Risk</span>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider mb-1">ML Risk Factors</h4>
                  <ul className="text-xs text-slate-600 space-y-1">
                    <li className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-red-400" /> Skill Gap: High</li>
                    <li className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-red-400" /> Job Demand Mismatch</li>
                    <li className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-amber-400" /> District Coverage: Low</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider mb-1">Recommended Actions</h4>
                  <ul className="text-xs text-indigo-700 font-medium space-y-1">
                    <li className="flex items-center gap-1 cursor-pointer hover:underline"><ChevronRight className="h-3 w-3" /> Bridge Training</li>
                    <li className="flex items-center gap-1 cursor-pointer hover:underline"><ChevronRight className="h-3 w-3" /> Employer Connect</li>
                    <li className="flex items-center gap-1 cursor-pointer hover:underline"><ChevronRight className="h-3 w-3" /> Skill Upskilling</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-xs text-indigo-800">
              <span className="font-semibold">ML Insight:</span> Historical data shows Cloud Computing & Data Analysis have highest placement success in Maharashtra. Recommend curriculum update.
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
