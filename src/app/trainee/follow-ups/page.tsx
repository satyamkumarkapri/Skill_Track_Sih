"use client";
import React from "react";
import { Card, CardContent, StatusBadge, Badge } from "@/components/ui";
import { MessageSquare, Calendar } from "lucide-react";

const followUps = [
  { type: "30-day", date: "2025-03-20", status: "responded", channel: "App", employment: "Employed", salary: "₹18,000", satisfaction: 4 },
  { type: "90-day", date: "2025-05-20", status: "responded", channel: "SMS", employment: "Employed", salary: "₹20,000", satisfaction: 4 },
  { type: "180-day", date: "2025-08-20", status: "responded", channel: "Call", employment: "Employed", salary: "₹22,000", satisfaction: 5 },
  { type: "365-day", date: "2026-02-20", status: "pending", channel: "App", employment: "—", salary: "—", satisfaction: 0 },
];

export default function TraineeFollowUpsPage() {
  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <h1 className="text-2xl font-bold">Follow-ups</h1>
      <div className="space-y-3">
        {followUps.map((f, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">{f.type} Follow-up</span>
                  <StatusBadge status={f.status} />
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" /> {f.date}
                </div>
              </div>
              {f.status === "responded" && (
                <div className="grid grid-cols-4 gap-3 text-xs mt-3 pt-3 border-t border-border/50">
                  <div><span className="text-muted-foreground">Status:</span><p className="font-medium">{f.employment}</p></div>
                  <div><span className="text-muted-foreground">Salary:</span><p className="font-medium">{f.salary}</p></div>
                  <div><span className="text-muted-foreground">Channel:</span><p className="font-medium">{f.channel}</p></div>
                  <div><span className="text-muted-foreground">Satisfaction:</span><p className="font-medium">{"⭐".repeat(f.satisfaction)}</p></div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
