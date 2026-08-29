"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
  KPICard, StatusBadge, Badge, Select,
} from "@/components/ui";
// Using static data for districts
import { formatCurrency, formatNumber } from "@/lib/utils";
import { MapPin, TrendingUp, AlertTriangle, Users } from "lucide-react";

export default function DistrictsPage() {
  const [districts, setDistricts] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("employment_rate");
  const [metricView, setMetricView] = useState("employment_rate");

  useEffect(() => {
    setDistricts([
      { id: 1, name: "Pune", total_trainees: 15400, employment_rate: 82, retention_rate: 75, avg_salary: 22000, skill_gap_score: 15, training_centres: 42, top_courses: ["IT", "Manufacturing"] },
      { id: 2, name: "Mumbai City", total_trainees: 18200, employment_rate: 78, retention_rate: 72, avg_salary: 24500, skill_gap_score: 12, training_centres: 55, top_courses: ["Finance", "Retail"] },
      { id: 3, name: "Nagpur", total_trainees: 8500, employment_rate: 68, retention_rate: 60, avg_salary: 16500, skill_gap_score: 28, training_centres: 28, top_courses: ["Logistics", "Services"] },
      { id: 4, name: "Nashik", total_trainees: 11200, employment_rate: 72, retention_rate: 65, avg_salary: 18000, skill_gap_score: 22, training_centres: 34, top_courses: ["Agriculture", "Auto"] },
      { id: 5, name: "Aurangabad", total_trainees: 6400, employment_rate: 55, retention_rate: 45, avg_salary: 14000, skill_gap_score: 45, training_centres: 22, top_courses: ["Auto", "Engineering"] },
    ]);
    setIsMounted(true);
  }, []);

  const sorted = useMemo(() => {
    return [...districts].sort((a, b) => {
      const key = sortBy as keyof typeof a;
      return (b[key] as number) - (a[key] as number);
    });
  }, [districts, sortBy]);

  const selected = selectedDistrict ? districts.find((d) => d.name === selectedDistrict) : null;

  const getColor = (value: number, metric: string) => {
    if (metric === "non_placement_rate" || metric === "skill_gap_score") {
      return value < 20 ? "bg-emerald-500" : value < 35 ? "bg-amber-500" : "bg-red-500";
    }
    return value >= 70 ? "bg-emerald-500" : value >= 50 ? "bg-amber-500" : "bg-red-500";
  };

  if (!isMounted) {
    return <div className="space-y-6 animate-pulse p-6">
      <div className="h-8 bg-muted rounded w-1/4"></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4"><div className="h-24 bg-muted rounded"></div></div>
      <div className="h-96 bg-muted rounded w-full"></div>
    </div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">District Intelligence</h1>
          <p className="text-sm text-muted-foreground mt-1">
            District-wise skilling outcomes across Maharashtra ({districts.length} districts)
          </p>
        </div>
        <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-[200px] h-8 text-xs">
          <option value="employment_rate">Sort by Employment Rate</option>
          <option value="retention_rate">Sort by Retention Rate</option>
          <option value="avg_salary">Sort by Avg Salary</option>
          <option value="non_placement_rate">Sort by Non-Placement</option>
          <option value="total_trainees">Sort by Trainees</option>
        </Select>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Total Districts" value="34" icon="MapPin" />
        <KPICard label="High Performing" value={String(districts.filter((d) => d.employment_rate >= 70).length)} icon="TrendingUp" trend="up" change={3} changeLabel="districts" />
        <KPICard label="Need Attention" value={String(districts.filter((d) => d.employment_rate < 50).length)} icon="AlertTriangle" trend="down" change={-2} changeLabel="districts" />
        <KPICard label="Total Trainees" value={formatNumber(districts.reduce((s, d) => s + d.total_trainees, 0))} icon="Users" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* District List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>District Performance</CardTitle>
              <CardDescription>Click a district to view details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase">District</th>
                      <th className="text-right py-2 px-3 text-xs font-semibold text-muted-foreground uppercase">Trainees</th>
                      <th className="text-right py-2 px-3 text-xs font-semibold text-muted-foreground uppercase">Emp Rate</th>
                      <th className="text-right py-2 px-3 text-xs font-semibold text-muted-foreground uppercase">Retention</th>
                      <th className="text-right py-2 px-3 text-xs font-semibold text-muted-foreground uppercase">Avg Salary</th>
                      <th className="text-right py-2 px-3 text-xs font-semibold text-muted-foreground uppercase">Skill Gap</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((d) => (
                      <tr
                        key={d.id}
                        onClick={() => setSelectedDistrict(d.name)}
                        className={`border-b border-border/50 cursor-pointer transition-colors ${
                          selectedDistrict === d.name ? "bg-primary/5" : "hover:bg-muted/30"
                        }`}
                      >
                        <td className="py-2.5 px-3 font-medium">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                            {d.name}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-right">{formatNumber(d.total_trainees)}</td>
                        <td className="py-2.5 px-3 text-right">
                          <span className={d.employment_rate >= 70 ? "text-emerald-600 font-medium" : d.employment_rate >= 50 ? "text-amber-600" : "text-red-600 font-medium"}>
                            {d.employment_rate}%
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">{d.retention_rate}%</td>
                        <td className="py-2.5 px-3 text-right">{formatCurrency(d.avg_salary)}</td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <div className={`h-2 w-2 rounded-full ${d.skill_gap_score > 35 ? "bg-red-500" : d.skill_gap_score > 20 ? "bg-amber-500" : "bg-emerald-500"}`} />
                            {d.skill_gap_score}%
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* District Detail */}
        <div>
          {selected ? (
            <Card className="sticky top-20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <CardTitle>{selected.name} District</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Trainees</p>
                    <p className="text-lg font-bold">{formatNumber(selected.total_trainees)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Centres</p>
                    <p className="text-lg font-bold">{selected.training_centres}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Employment</p>
                    <p className={`text-lg font-bold ${selected.employment_rate >= 70 ? "text-emerald-600" : selected.employment_rate >= 50 ? "text-amber-600" : "text-red-600"}`}>{selected.employment_rate}%</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Retention</p>
                    <p className="text-lg font-bold">{selected.retention_rate}%</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Avg Salary</p>
                    <p className="text-lg font-bold">{formatCurrency(selected.avg_salary)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Non-Placement</p>
                    <p className={`text-lg font-bold ${selected.non_placement_rate > 25 ? "text-red-600" : "text-amber-600"}`}>{selected.non_placement_rate}%</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Top Courses</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.top_courses.map((c: string, i: number) => (
                      <Badge key={i} variant="outline">{c}</Badge>
                    ))}
                  </div>
                </div>
                {selected.employment_rate < 60 && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-100">
                    <p className="text-xs font-medium text-red-800">⚡ This district needs targeted intervention</p>
                    <p className="text-xs text-red-600 mt-1">Low employment rate and high skill gaps detected</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <MapPin className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Click a district to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
