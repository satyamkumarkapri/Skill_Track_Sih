"use client";

import React from "react";
import {
  Card, CardContent, KPICard,
} from "@/components/ui";
import {
  EmploymentTrendChart,
  EmploymentStatusDonut,
  SalaryProgressionChart,
  HorizontalBarChart,
} from "@/components/charts";
import { getMongoDBCharts, getMongoDBKPIs } from "@/actions/analytics";

export default function AnalyticsPage() {
  const [charts, setCharts] = React.useState<any>(null);
  const [kpis, setKpis] = React.useState<any[]>([]);

  React.useEffect(() => {
    Promise.all([getMongoDBCharts(), getMongoDBKPIs()]).then(([chartData, kpiData]) => {
      setCharts(chartData);
      setKpis(kpiData);
    });
  }, []);

  if (!charts) {
    return (
      <div className="space-y-6 animate-pulse p-6">
        <div className="h-8 bg-muted rounded w-1/4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="h-24 bg-muted rounded" />)}
        </div>
        <div className="h-96 bg-muted rounded w-full" />
      </div>
    );
  }

  const getKPI = (label: string) => kpis.find((k) => k.label === label)?.value ?? "—";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Comprehensive outcome analytics · live data from MongoDB
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-green-100 text-green-700 border border-green-200 px-3 py-1 rounded-full">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          Real-Time
        </span>
      </div>

      {/* Row 1: User Counts from MongoDB */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Registered Trainees" value={getKPI("Registered Trainees")} icon="Users" />
        <KPICard label="Active Courses" value={getKPI("Active Courses")} icon="Target" />
        <KPICard label="Total Enrollments" value={getKPI("Total Enrollments")} icon="BarChart3" />
        <KPICard label="Placed Trainees" value={getKPI("Placed Trainees")} icon="Briefcase" />
      </div>

      {/* Row 2: Rate Metrics from MongoDB */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Completion Rate" value={getKPI("Completion Rate")} icon="Target" />
        <KPICard label="Employment Rate" value={getKPI("Employment Rate")} icon="TrendingUp" />
        <KPICard label="Training Providers" value={getKPI("Training Providers")} icon="Building2" />
        <KPICard label="Skill Match Score" value={getKPI("Skill Match Score")} icon="Shield" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EmploymentTrendChart data={charts.trendData} />
        <EmploymentStatusDonut data={charts.statusData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalaryProgressionChart data={charts.salaryData} />
        <HorizontalBarChart
          data={charts.nonPlacementData}
          dataKey="percentage"
          nameKey="reason"
          title="Non-Placement Analysis"
          description="Root causes for non-placement of certified trainees"
          color="#ea580c"
        />
      </div>

      <HorizontalBarChart
        data={charts.attritionData}
        dataKey="percentage"
        nameKey="reason"
        title="Attrition Analysis"
        description="Why trainees leave their jobs within the tracking period"
        color="#dc2626"
      />

      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3 text-sm">
            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 text-xs font-bold">ℹ</span>
            </div>
            <div>
              <p className="font-medium text-foreground">Privacy Notice</p>
              <p className="text-muted-foreground mt-0.5">
                Demographic analytics apply a minimum cohort threshold of 30 to prevent individual identification.
                Sensitive individual information is not exposed in aggregate analytics.
                Data sourced live from MongoDB · SIH Problem Statement 26135.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
