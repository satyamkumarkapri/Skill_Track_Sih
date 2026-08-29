"use client";

import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";

const COLORS = ["#1a365d", "#e87d2f", "#2d8a4e", "#7c3aed", "#0891b2", "#dc2626", "#ca8a04", "#6366f1"];

// ===== EMPLOYMENT TREND =====
export function EmploymentTrendChart({ data }: { data: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Employment Trend Over Time</CardTitle>
        <CardDescription>Quarterly employment status distribution (2024–2025)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="employedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#059669" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#059669" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="hsl(220 8% 46%)" axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10 }} stroke="hsl(220 8% 46%)" unit="%" axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid hsl(220 13% 91%)",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                fontSize: "12px",
              }}
              formatter={(value: any) => [`${value}%`, undefined]}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
            <Area type="monotone" dataKey="employed" name="Employed" stroke="#059669" fill="url(#employedGrad)" strokeWidth={2} />
            <Line type="monotone" dataKey="selfEmployed" name="Self-employed" stroke="#d97706" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="apprentice" name="Apprenticeship" stroke="#7c3aed" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="seeking" name="Seeking" stroke="#ea580c" strokeWidth={2} dot={false} strokeDasharray="4 4" />
            <Line type="monotone" dataKey="notWorking" name="Not Working" stroke="#dc2626" strokeWidth={2} dot={false} strokeDasharray="4 4" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// ===== EMPLOYMENT STATUS DONUT =====
export function EmploymentStatusDonut({ data }: { data: { name: string; value: number; count: number; color: string }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Employment Status Distribution</CardTitle>
        <CardDescription>Current status of all certified trainees</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <ResponsiveContainer width="100%" height={260} className="max-w-[260px]">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => [`${value}%`, undefined]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(220 13% 91%)",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 flex-1">
            {data.map((item) => (
              <div key={item.name} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ background: item.color }} />
                  <span className="text-sm text-foreground">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold">{item.value}%</span>
                  <span className="text-xs text-muted-foreground">({formatNumber(item.count)})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ===== SALARY PROGRESSION =====
export function SalaryProgressionChart({
  data,
  title = "Salary Progression",
  description = "Average salary growth over time",
}: {
  data: { period: string; salary: number }[];
  title?: string;
  description?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="salaryGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1a365d" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#1a365d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" vertical={false} />
            <XAxis dataKey="period" tick={{ fontSize: 10 }} stroke="hsl(220 8% 46%)" axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 10 }}
              stroke="hsl(220 8% 46%)"
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value: any) => [formatCurrency(value as number), "Salary"]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid hsl(220 13% 91%)",
                fontSize: "12px",
              }}
            />
            <Area
              type="monotone"
              dataKey="salary"
              stroke="#1a365d"
              fill="url(#salaryGrad)"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#1a365d", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// ===== HORIZONTAL BAR CHART =====
export function HorizontalBarChart({
  data,
  dataKey,
  nameKey = "reason",
  title,
  description,
  color = "#1a365d",
  showPercentage = true,
}: {
  data: any[];
  dataKey: string;
  nameKey?: string;
  title: string;
  description?: string;
  color?: string;
  showPercentage?: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={Math.max(200, data.length * 38)}>
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" horizontal={false} vertical={false} />
            <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(220 8% 46%)" axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey={nameKey}
              tick={{ fontSize: 11 }}
              stroke="hsl(220 8% 46%)"
              width={130}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid hsl(220 13% 91%)",
                fontSize: "12px",
              }}
              formatter={(value: any) => [
                showPercentage ? `${value}%` : formatNumber(value as number),
                undefined,
              ]}
            />
            <Bar dataKey={dataKey} fill={color} radius={[0, 4, 4, 0]} maxBarSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// ===== PROVIDER COMPARISON =====
export function ProviderComparisonChart({ data }: { data: any[] }) {
  const top10 = [...data].sort((a, b) => b.score - a.score).slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Provider Outcome Effectiveness</CardTitle>
        <CardDescription>Top 10 providers by composite outcome score</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={top10} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" horizontal={false} vertical={false} />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} stroke="hsl(220 8% 46%)" axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="provider"
              tick={{ fontSize: 10 }}
              stroke="hsl(220 8% 46%)"
              width={160}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid hsl(220 13% 91%)",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="placement" name="Placement %" fill="#059669" stackId="a" radius={[0, 0, 0, 0]} maxBarSize={20} />
            <Bar dataKey="retention" name="Retention %" fill="#1a365d" stackId="b" radius={[0, 0, 0, 0]} maxBarSize={20} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// ===== MINI STAT CHART =====
export function MiniTrendLine({ data, color = "#059669" }: { data: number[]; color?: string }) {
  const chartData = data.map((v, i) => ({ x: i, y: v }));

  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="y"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ===== SKILL GAP BAR =====
export function SkillGapChart({ data }: { data: { skill: string; demand_score: number; supply_score: number; gap_severity: string }[] }) {
  const chartData = data.map((d) => ({
    skill: d.skill.length > 20 ? d.skill.slice(0, 18) + "..." : d.skill,
    fullSkill: d.skill,
    "Industry Demand": d.demand_score,
    "Current Supply": d.supply_score,
    gap: d.demand_score - d.supply_score,
    severity: d.gap_severity,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skill Gap Analysis</CardTitle>
        <CardDescription>Industry demand vs. training supply across key skills</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={420}>
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" vertical={false} />
            <XAxis dataKey="skill" tick={{ fontSize: 10 }} stroke="hsl(220 8% 46%)" angle={-30} textAnchor="end" height={80} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10 }} stroke="hsl(220 8% 46%)" domain={[0, 100]} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid hsl(220 13% 91%)",
                fontSize: "12px",
              }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
            <Bar dataKey="Industry Demand" fill="#1a365d" radius={[4, 4, 0, 0]} maxBarSize={30} />
            <Bar dataKey="Current Supply" fill="#e87d2f" radius={[4, 4, 0, 0]} maxBarSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
