"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, Button, Input, Label, Badge } from "@/components/ui";
import { CheckCircle2, XCircle, Briefcase, IndianRupee, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export default function EmployerValidationPage() {
  const params = useParams();
  const token = params.token as string; // in a real app, this is a secure hash mapping to an employment_record
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [record, setRecord] = useState<any>(null);
  const [status, setStatus] = useState<"pending" | "verified" | "disputed">("pending");

  useEffect(() => {
    // Simulate fetching the record based on the secure token
    setTimeout(() => {
      setRecord({
        id: "emp-rec-123",
        trainee_name: "Sneha Jadhav",
        job_role: "Junior Developer",
        salary: 22000,
        start_date: "2024-03-01",
        company_name: "TechMaharashtra Solutions Pvt. Ltd."
      });
      setLoading(false);
    }, 1000);
  }, [token]);

  const handleVerify = async (isCorrect: boolean) => {
    setSubmitting(true);
    const newStatus = isCorrect ? "verified" : "disputed";
    
    // In a real app, we update Supabase here:
    /*
    const supabase = createClient();
    await supabase.from("employment_records")
      .update({ verification_status: newStatus })
      .eq("id", record.id);
    */

    setTimeout(() => {
      setStatus(newStatus);
      setSubmitting(false);
      toast.success(isCorrect ? "Employment record verified successfully." : "Record marked for dispute.");
    }, 800);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0 mb-4">
            Employer Validation Portal
          </Badge>
          <h1 className="text-2xl font-bold text-foreground">Verify Employment</h1>
          <p className="text-sm text-muted-foreground">
            Please confirm the employment details for your recent hire to help us track skilling outcomes.
          </p>
        </div>

        {status === "pending" ? (
          <Card className="border-border shadow-lg">
            <CardContent className="p-6 space-y-6">
              <div className="bg-background rounded-lg p-4 border border-border space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Trainee Name</Label>
                  <p className="font-semibold text-foreground">{record.trainee_name}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Job Role</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{record.job_role}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Monthly Salary</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <IndianRupee className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">₹{record.salary.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Joining Date</Label>
                  <p className="text-sm mt-1">{new Date(record.start_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Button 
                  className="w-full bg-india-green hover:bg-india-green/90 text-white"
                  onClick={() => handleVerify(true)}
                  disabled={submitting}
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                  Yes, this information is correct
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleVerify(false)}
                  disabled={submitting}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  No, there is an error
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-india-green bg-india-green/5 shadow-lg">
            <CardContent className="p-8 text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-india-green/20 rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 className="h-6 w-6 text-india-green" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Thank You!</h2>
              <p className="text-sm text-muted-foreground">
                {status === "verified" 
                  ? "Your verification helps the Government of Maharashtra improve skilling initiatives."
                  : "We have logged your dispute. An officer will contact you shortly to correct the record."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
