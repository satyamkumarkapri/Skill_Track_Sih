"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, Badge, StatusBadge, ConfidenceScore } from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Briefcase } from "lucide-react";

export default function TraineeEmploymentPage() {
  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <h1 className="text-2xl font-bold">My Employment</h1>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4"><Briefcase className="h-5 w-5 text-primary" /><h3 className="font-semibold">Current Employment</h3></div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-muted-foreground">Employer:</span><p className="font-medium">TechMaharashtra Solutions Pvt. Ltd.</p></div>
            <div><span className="text-muted-foreground">Job Role:</span><p className="font-medium">Junior Developer</p></div>
            <div><span className="text-muted-foreground">Joining Date:</span><p className="font-medium">{formatDate("2025-02-20")}</p></div>
            <div><span className="text-muted-foreground">Current Salary:</span><p className="font-medium">{formatCurrency(22000)}/month</p></div>
            <div><span className="text-muted-foreground">Type:</span><Badge variant="outline">Full-time</Badge></div>
            <div><span className="text-muted-foreground">Verification:</span><StatusBadge status="verified" /></div>
          </div>
          <div className="mt-6"><ConfidenceScore score={85} /></div>
        </CardContent>
      </Card>
    </div>
  );
}
