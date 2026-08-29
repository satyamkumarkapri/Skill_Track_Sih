"use client";

import React, { useMemo, useState } from "react";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
  StatusBadge, Badge, Select, Button, Avatar, Pagination,
} from "@/components/ui";
import { getProviders } from "@/actions/entities";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { Building2, Download, ArrowUpDown, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function ProvidersPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    getProviders().then(data => {
      setProviders(data);
      setLoading(false);
    });
  }, []);
  const [sortBy, setSortBy] = useState("score");

  const sorted = useMemo(() => {
    return [...providers].sort((a, b) => {
      switch (sortBy) {
        case "score": return b.outcome_effectiveness_score - a.outcome_effectiveness_score;
        case "placement": return b.placement_rate - a.placement_rate;
        case "retention": return b.retention_rate_6m - a.retention_rate_6m;
        case "salary": return b.avg_salary - a.avg_salary;
        default: return 0;
      }
    });
  }, [providers, sortBy]);

  if (loading) {
    return <div className="space-y-6 animate-pulse p-6">
      <div className="h-8 bg-muted rounded w-1/4"></div>
      <div className="h-96 bg-muted rounded w-full"></div>
    </div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Training Providers</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {providers.length} registered providers · live from MongoDB
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-8 text-xs w-[180px]"
          >
            <option value="score">Sort by Effectiveness Score</option>
            <option value="placement">Sort by Placement Rate</option>
            <option value="retention">Sort by Retention Rate</option>
            <option value="salary">Sort by Avg Salary</option>
          </Select>
        </div>
      </div>

      {providers.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">No Providers Registered Yet</h3>
            <p className="text-sm text-muted-foreground">
              Training providers who sign up and are assigned the <code className="bg-muted px-1 rounded">training_provider</code> role will appear here automatically.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sorted.map((provider, i) => (
            <Card key={provider.id} hover className="animate-fade-in-up" style={{ animationDelay: `${i * 30}ms` }}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{provider.name}</h3>
                      <p className="text-xs text-muted-foreground">{provider.district} · {provider.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{(provider.outcome_effectiveness_score || 0).toFixed(0)}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">OE Score</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 text-center">
                  <div>
                    <p className="text-lg font-semibold text-foreground">{provider.total_courses}</p>
                    <p className="text-[10px] text-muted-foreground">Courses</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground">{provider.total_trainees}</p>
                    <p className="text-[10px] text-muted-foreground">Trainees</p>
                  </div>
                  <div>
                    <p className={`text-lg font-semibold ${provider.placement_rate >= 70 ? "text-emerald-600" : provider.placement_rate >= 50 ? "text-amber-600" : "text-red-600"}`}>
                      {provider.placement_rate}%
                    </p>
                    <p className="text-[10px] text-muted-foreground">Placement</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground">{provider.retention_rate_6m}%</p>
                    <p className="text-[10px] text-muted-foreground">Retention</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/50">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      provider.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}>● {provider.status}</span>
                    <span className="text-muted-foreground text-[10px]">
                      Joined {provider.createdAt ? new Date(provider.createdAt).toLocaleDateString("en-IN") : "—"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
