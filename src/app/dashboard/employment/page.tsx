"use client";

import React, { useMemo, useState } from "react";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
  KPICard, StatusBadge, Badge, Select, Pagination, ConfidenceScore,
} from "@/components/ui";
import { getEmploymentData } from "@/actions/employment";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Briefcase, Store, Wrench, UserCheck } from "lucide-react";

export default function EmploymentPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [selfEmp, setSelfEmp] = useState<any[]>([]);
  const [apprenticeships, setApprenticeships] = useState<any[]>([]);
  const [inProgress, setInProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    getEmploymentData().then(data => {
      setRecords(data.records);
      setSelfEmp(data.selfEmp);
      setApprenticeships(data.apprenticeships);
      setInProgress(data.inProgress || 0);
      setLoading(false);
    });
  }, []);
  const [tab, setTab] = useState<"employed" | "self" | "apprentice">("employed");
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const currentData = tab === "employed" ? records : tab === "self" ? selfEmp : apprenticeships;
  const totalPages = Math.ceil(currentData.length / pageSize);
  const paginated = currentData.slice((page - 1) * pageSize, page * pageSize);

  if (loading) {
    return <div className="space-y-6 animate-pulse p-6">
      <div className="h-8 bg-muted rounded w-1/4"></div>
      <div className="h-96 bg-muted rounded w-full"></div>
    </div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Employment Tracking</h1>
        <p className="text-sm text-muted-foreground mt-1">Employment, self-employment, and apprenticeship records</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Total Employed" value={records.length.toLocaleString()} icon="Briefcase" />
        <KPICard label="Self-Employed" value={selfEmp.length.toLocaleString()} icon="Store" />
        <KPICard label="Apprenticeships" value={apprenticeships.length.toLocaleString()} icon="Wrench" />
        <KPICard label="In Progress" value={inProgress.toLocaleString()} icon="Users" />
      </div>

      <div className="flex items-center gap-1 bg-muted rounded-lg p-1 w-fit">
        {[
          { id: "employed" as const, label: "Employed", count: records.length },
          { id: "self" as const, label: "Self-Employed", count: selfEmp.length },
          { id: "apprentice" as const, label: "Apprenticeships", count: apprenticeships.length },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setPage(1); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === t.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label} <span className="text-xs text-muted-foreground">({t.count})</span>
          </button>
        ))}
      </div>

      <Card>
        <div className="overflow-x-auto">
          {tab === "employed" && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Trainee</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Course</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Employer</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Job Role</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Salary</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Type</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Verification</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr><td colSpan={7} className="py-16 text-center text-muted-foreground text-sm">No employed trainees yet. Enrollment outcomes will appear here automatically.</td></tr>
                ) : (
                  (paginated as typeof records).map((r) => (
                    <tr key={r.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-medium">{r.trainee_name}</td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">{r.course_title}</td>
                      <td className="py-3 px-4 text-muted-foreground">{r.employer_name}</td>
                      <td className="py-3 px-4">{r.job_role}</td>
                      <td className="py-3 px-4 text-right">{formatCurrency(r.current_salary)}</td>
                      <td className="py-3 px-4"><Badge variant="outline">{r.employment_type}</Badge></td>
                      <td className="py-3 px-4"><StatusBadge status={r.verification_status} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
          {tab === "self" && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Trainee</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Business Type</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Sector</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Location</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Income</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {selfEmp.length === 0 ? (
                  <tr><td colSpan={6} className="py-16 text-center text-muted-foreground text-sm">No self-employed trainees yet. Will appear when enrollment outcome is set to Self-Employed.</td></tr>
                ) : (
                  (paginated as typeof selfEmp).map((r) => (
                    <tr key={r.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-medium">{r.trainee_name}</td>
                      <td className="py-3 px-4">{r.business_type}</td>
                      <td className="py-3 px-4">{r.business_sector}</td>
                      <td className="py-3 px-4 text-muted-foreground">{r.location}</td>
                      <td className="py-3 px-4 text-right">{formatCurrency(r.monthly_income)}/mo</td>
                      <td className="py-3 px-4"><StatusBadge status={r.business_status} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
          {tab === "apprentice" && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Trainee</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Company</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Trade</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Duration</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Stipend</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {apprenticeships.length === 0 ? (
                  <tr><td colSpan={6} className="py-16 text-center text-muted-foreground text-sm">No apprenticeships yet. Will appear when enrollment outcome is set to Apprenticeship.</td></tr>
                ) : (
                  (paginated as typeof apprenticeships).map((r) => (
                    <tr key={r.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-medium">{r.trainee_name}</td>
                      <td className="py-3 px-4">{r.company}</td>
                      <td className="py-3 px-4">{r.trade}</td>
                      <td className="py-3 px-4 text-right">{r.duration_months} months</td>
                      <td className="py-3 px-4 text-right">{formatCurrency(r.stipend)}/mo</td>
                      <td className="py-3 px-4"><StatusBadge status={r.status} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </Card>
    </div>
  );
}
