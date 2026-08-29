import React from "react";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { PieChart, BarChart3, TrendingUp, Award } from "lucide-react";
import { getProviderTrainees } from "@/actions/provider";

export default async function ProviderAnalyticsPage() {
  const result = await getProviderTrainees();
  const enrollments = result.enrollments || [];

  // Calculate real analytics based on the DB!
  const completedTrainees = enrollments.filter((e: any) => e.status === "Completed");
  const totalCompleted = completedTrainees.length;
  
  const employed = completedTrainees.filter((e: any) => e.outcome === "Employed" || e.outcome === "Self-Employed").length;
  const apprenticeships = completedTrainees.filter((e: any) => e.outcome === "Apprenticeship").length;
  
  const placementRate = totalCompleted > 0 ? Math.round(((employed + apprenticeships) / totalCompleted) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Performance Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time placement and outcome metrics for your institute.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Total Graduated</p>
                <h3 className="text-2xl font-bold">{totalCompleted}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Placement Rate</p>
                <h3 className="text-2xl font-bold text-emerald-600">{placementRate}%</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Employed</p>
                <h3 className="text-2xl font-bold">{employed}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center">
                <PieChart className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Apprenticeships</p>
                <h3 className="text-2xl font-bold">{apprenticeships}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>Outcome Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {totalCompleted === 0 ? (
              <div className="h-48 flex items-center justify-center text-muted-foreground text-sm border-2 border-dashed rounded-lg">
                Not enough data yet
              </div>
            ) : (
              <div className="space-y-4">
                {["Employed", "Self-Employed", "Apprenticeship", "Seeking Employment", "Not Working"].map(status => {
                  const count = completedTrainees.filter((e: any) => e.outcome === status).length;
                  const percentage = totalCompleted > 0 ? Math.round((count / totalCompleted) * 100) : 0;
                  if (count === 0 && status !== "Employed") return null;
                  
                  return (
                    <div key={status}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-foreground">{status}</span>
                        <span className="text-muted-foreground">{percentage}% ({count})</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            status === "Employed" || status === "Self-Employed" ? "bg-emerald-500" :
                            status === "Apprenticeship" ? "bg-blue-500" :
                            status === "Seeking Employment" ? "bg-amber-500" : "bg-red-400"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm bg-primary/5 border-primary/20">
          <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center">
            <Award className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">SIH 2026 Objective Met</h3>
            <p className="text-muted-foreground text-sm">
              By logging these outcomes, you are directly contributing to the government's skilling intelligence database, helping identify which courses lead to the best employment outcomes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
