"use client";

import React, { useMemo, useState } from "react";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
  StatusBadge, Badge, Select, Pagination, Avatar,
} from "@/components/ui";
import { getEmployers } from "@/actions/entities";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Building2, Search } from "lucide-react";
import { Input } from "@/components/ui";

export default function EmployersPage() {
  const [employers, setEmployers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    getEmployers().then(data => {
      setEmployers(data);
      setLoading(false);
    });
  }, []);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const filtered = useMemo(() => {
    return employers.filter((e) =>
      !search || e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.industry.toLowerCase().includes(search.toLowerCase()) ||
      e.district.toLowerCase().includes(search.toLowerCase())
    );
  }, [employers, search]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  if (loading) {
    return <div className="space-y-6 animate-pulse p-6">
      <div className="h-8 bg-muted rounded w-1/4"></div>
      <div className="h-96 bg-muted rounded w-full"></div>
    </div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Employers</h1>
        <p className="text-sm text-muted-foreground mt-1">{filtered.length} registered employers</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employers..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Employer</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Industry</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">District</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Employees</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Verification</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Avg Salary</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Retention</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((e) => (
                <tr key={e.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{e.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{e.industry}</td>
                  <td className="py-3 px-4">{e.district}</td>
                  <td className="py-3 px-4 text-right">{e.total_employees_from_program}</td>
                  <td className="py-3 px-4 text-right">{(e.verification_rate ?? 0).toFixed(0)}%</td>
                  <td className="py-3 px-4 text-right">{formatCurrency(e.avg_salary_offered)}</td>
                  <td className="py-3 px-4 text-right">{(e.retention_rate ?? 0).toFixed(0)}%</td>
                  <td className="py-3 px-4"><StatusBadge status={e.status} /></td>
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
