"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from "@/components/ui";
import { Shield, CheckCircle2, XCircle } from "lucide-react";

const consents = [
  { purpose: "Employment Tracking", description: "Allow tracking of employment status and employer information", granted: true, timestamp: "2024-09-01T10:30:00Z", version: "1.0" },
  { purpose: "Follow-up Communication", description: "Allow system to send follow-up surveys via SMS, call, or app", granted: true, timestamp: "2024-09-01T10:30:00Z", version: "1.0" },
  { purpose: "Analytics Usage", description: "Allow anonymized data to be used in aggregate analytics", granted: true, timestamp: "2024-09-01T10:30:00Z", version: "1.0" },
  { purpose: "Employer Verification", description: "Allow employer to verify your employment details", granted: true, timestamp: "2024-09-01T10:31:00Z", version: "1.0" },
  { purpose: "Data Sharing with Government", description: "Allow data sharing with authorized government departments", granted: false, timestamp: "2025-06-15T14:20:00Z", version: "1.1" },
];

export default function ConsentPage() {
  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Consent Management</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your data sharing and tracking consents</p>
      </div>
      <Card className="border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground">Your Privacy Matters</p>
              <p className="text-muted-foreground mt-0.5">You have full control over your data. Each consent purpose can be individually managed. Withdrawing consent will stop the corresponding data processing.</p>
            </div>
          </div>
        </CardContent>
      </Card>
      {consents.map((c, i) => (
        <Card key={i}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold">{c.purpose}</h3>
                  <Badge variant={c.granted ? "success" : "secondary"}>{c.granted ? "Granted" : "Withdrawn"}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{c.description}</p>
                <p className="text-[10px] text-muted-foreground mt-2">
                  Version {c.version} · Last updated: {new Date(c.timestamp).toLocaleDateString("en-IN")}
                </p>
              </div>
              <div className={`h-6 w-11 rounded-full relative cursor-pointer transition-colors ${c.granted ? "bg-india-green" : "bg-muted"}`}>
                <div className={`h-5 w-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${c.granted ? "left-5" : "left-0.5"}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
