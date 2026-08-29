"use client";

import React, { useState } from "react";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
  Badge, StatusBadge, Avatar, Select,
} from "@/components/ui";
import { getAuditLogs } from "@/actions/entities";
import { formatDateTime } from "@/lib/utils";
import { Shield, Search } from "lucide-react";
import { Input } from "@/components/ui";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    getAuditLogs().then(data => {
      setLogs(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="space-y-6 animate-pulse p-6">
      <div className="h-8 bg-muted rounded w-1/4"></div>
      <div className="h-96 bg-muted rounded w-full"></div>
    </div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
        <p className="text-sm text-muted-foreground mt-1">System activity and access tracking</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search audit logs..." className="pl-9" />
            </div>
            <Select className="w-[160px] h-10">
              <option value="all">All Actions</option>
              <option value="login">Login</option>
              <option value="export_report">Export</option>
              <option value="verify_employment">Verify</option>
              <option value="update_profile">Update</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Timestamp</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">User</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Role</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Action</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 text-xs text-muted-foreground font-mono">{formatDateTime(log.timestamp)}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Avatar name={log.user_name} size="sm" />
                      <span className="font-medium">{log.user_name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline">{log.user_role.replace(/_/g, " ")}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="secondary">{log.action.replace(/_/g, " ")}</Badge>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
