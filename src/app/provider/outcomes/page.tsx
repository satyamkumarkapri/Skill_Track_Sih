"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Select, Label, Input } from "@/components/ui";
import { Target, Search, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { getProviderTrainees, updateTraineeOutcome } from "@/actions/provider";
import { toast } from "sonner";

export default function ProviderOutcomesPage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    fetchTrainees();
  }, []);

  const fetchTrainees = async () => {
    const result = await getProviderTrainees();
    if (result.success) {
      setEnrollments(result.enrollments || []);
    }
    setLoading(false);
  };

  const handleUpdateOutcome = async (e: React.FormEvent<HTMLFormElement>, enrollmentId: string) => {
    e.preventDefault();
    setSavingId(enrollmentId);
    
    const formData = new FormData(e.currentTarget);
    const result = await updateTraineeOutcome(enrollmentId, formData);
    
    if (result.success) {
      toast.success("Trainee outcome updated successfully!");
      await fetchTrainees(); // Refresh the list
    } else {
      toast.error(result.error || "Failed to update outcome");
    }
    setSavingId(null);
  };

  if (loading) {
    return <div className="p-12 text-center text-muted-foreground"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>;
  }

  // Filter to only show completed trainees or those ready for outcome tracking
  const trackableTrainees = enrollments.filter(e => e.status === "Completed" || e.outcome !== "Pending");

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Track Outcomes</h1>
          <p className="text-sm text-muted-foreground mt-1">Update employment and placement status for your graduated trainees.</p>
        </div>
      </div>

      {trackableTrainees.length === 0 ? (
        <Card className="border-border border-dashed">
          <CardContent className="py-16 text-center">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-foreground">No completed trainees yet</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Outcomes can only be tracked for trainees who have completed their courses.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {trackableTrainees.map(trainee => (
            <Card key={trainee.id} className="border-border shadow-sm overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Trainee Info */}
                <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-border/50 bg-muted/10">
                  <h3 className="font-semibold text-lg">{trainee.traineeName}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{trainee.courseTitle}</p>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Current Status:</span>
                    <Badge variant="outline" className={
                      trainee.outcome === "Employed" || trainee.outcome === "Self-Employed"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : trainee.outcome === "Pending"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }>
                      {trainee.outcome}
                    </Badge>
                  </div>
                </div>

                {/* Outcome Form */}
                <div className="p-6 md:w-2/3">
                  <form onSubmit={(e) => handleUpdateOutcome(e, trainee.id)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`outcome-${trainee.id}`}>Update Placement Outcome</Label>
                        <Select 
                          id={`outcome-${trainee.id}`} 
                          name="outcome" 
                          defaultValue={trainee.outcome === "Pending" ? "" : trainee.outcome}
                          required 
                          className="mt-1 w-full h-10 px-3 py-2 border rounded-md bg-background"
                        >
                          <option value="" disabled>Select an outcome...</option>
                          <option value="Employed">Employed (Full-time)</option>
                          <option value="Apprenticeship">Apprenticeship</option>
                          <option value="Self-Employed">Self-Employed</option>
                          <option value="Seeking Employment">Seeking Employment</option>
                          <option value="Not Working">Not Working / Dropped Out</option>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor={`notes-${trainee.id}`}>Details / Company Name</Label>
                        <Input 
                          id={`notes-${trainee.id}`} 
                          name="notes" 
                          placeholder="e.g. Hired by TechCorp Inc." 
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit" disabled={savingId === trainee.id} size="sm">
                        {savingId === trainee.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                        Save Outcome
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
