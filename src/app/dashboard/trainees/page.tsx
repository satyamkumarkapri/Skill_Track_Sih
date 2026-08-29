"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
  Badge, StatusBadge, Input, Select, Button, Pagination, Avatar,
} from "@/components/ui";
import { getTraineesFromDB } from "@/actions/trainees";
import { formatCurrency, formatDate, formatPercent } from "@/lib/utils";
import { Search, Filter, Download, ChevronRight, Users } from "lucide-react";

export default function TraineesPage() {
  const router = useRouter();
  const [allTrainees, setAllTrainees] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    getTraineesFromDB().then((data) => {
      setAllTrainees(data);
      setIsMounted(true);
    });
  }, []);

  const filtered = useMemo(() => {
    return allTrainees.filter((t) => {
      const matchesSearch = !search || 
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.trainee_id.toLowerCase().includes(search.toLowerCase()) ||
        t.course_name.toLowerCase().includes(search.toLowerCase());
      const matchesDistrict = districtFilter === "all" || t.district === districtFilter;
      const matchesStatus = statusFilter === "all" || t.employment_status === statusFilter;
      return matchesSearch && matchesDistrict && matchesStatus;
    });
  }, [allTrainees, search, districtFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const districts = [...new Set(allTrainees.map((t) => t.district))].sort();

  if (!isMounted) {
    return <div className="space-y-6 animate-pulse p-6">
      <div className="h-8 bg-muted rounded w-1/4"></div>
      <div className="h-96 bg-muted rounded w-full"></div>
    </div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Trainees</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filtered.length.toLocaleString("en-IN")} trainees found
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, ID, or course..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="min-w-[160px]">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">District</label>
              <Select value={districtFilter} onChange={(e) => { setDistrictFilter(e.target.value); setPage(1); }}>
                <option value="all">All Districts</option>
                {districts.map((d) => <option key={d} value={d}>{d}</option>)}
              </Select>
            </div>
            <div className="min-w-[160px]">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Employment Status</label>
              <Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
                <option value="all">All Statuses</option>
                <option value="employed">Employed</option>
                <option value="self-employed">Self-Employed</option>
                <option value="apprentice">Apprentice</option>
                <option value="seeking">Seeking</option>
                <option value="not-working">Not Working</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Trainee</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">ID</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">District</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Course</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Training</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Employment</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Salary</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Skill Match</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((t) => (
                <tr 
                  key={t.id} 
                  onClick={() => router.push(`/dashboard/trainees/${t.id}`)}
                  className="border-b border-border/50 hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={t.name} size="sm" />
                      <div>
                        <p className="font-medium text-foreground">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.gender} · {t.age}y · {t.education}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs font-mono text-muted-foreground">{t.trainee_id}</span>
                  </td>
                  <td className="py-3 px-4 text-sm">{t.district}</td>
                  <td className="py-3 px-4">
                    <span className="text-sm">{t.course_name}</span>
                  </td>
                  <td className="py-3 px-4"><StatusBadge status={t.training_status} /></td>
                  <td className="py-3 px-4"><StatusBadge status={t.employment_status} /></td>
                  <td className="py-3 px-4 text-right text-sm">
                    {t.current_salary ? formatCurrency(t.current_salary) : "—"}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {t.skill_match_score ? (
                      <div className="flex items-center justify-end gap-2">
                        <div className="h-1.5 w-12 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full ${t.skill_match_score >= 75 ? "bg-emerald-500" : t.skill_match_score >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                            style={{ width: `${t.skill_match_score}%` }}
                          />
                        </div>
                        <span className="text-xs">{t.skill_match_score}%</span>
                      </div>
                    ) : "—"}
                  </td>
                  <td className="py-3 px-4">
                    <Link href={`/dashboard/trainees/${t.id}`}>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </Card>
    </div>
  );
}
