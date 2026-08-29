"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Label, Card, CardContent, Select } from "@/components/ui";
import { Target, ArrowRight, UploadCloud, CheckCircle2, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { completeOnboardingAction, getSessionAction } from "@/actions/auth";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    getSessionAction().then(s => {
      if (!s) router.push("/login");
      setSession(s);
    });
  }, [router]);

  const handleComplete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please upload the required verification document");
      return;
    }
    
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("documentName", file.name);

    const result = await completeOnboardingAction(formData);
    
    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    } else {
      toast.success("Profile verified successfully!");
      // Force hard navigation to refresh middleware state
      window.location.href = "/dashboard";
    }
  };

  if (!session) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  }

  const renderRoleFields = () => {
    switch (session.role) {
      case "trainee":
        return (
          <>
            <div>
              <Label htmlFor="aadhaar">Aadhaar Number</Label>
              <Input id="aadhaar" name="aadhaar" placeholder="XXXX-XXXX-XXXX" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="education">Highest Education</Label>
              <Select id="education" name="education" required className="mt-1 w-full h-10 px-3 py-2 border rounded-md">
                <option value="">Select Education Level</option>
                <option value="high_school">10th / 12th Pass</option>
                <option value="diploma">ITI / Diploma</option>
                <option value="bachelor">Bachelor's Degree</option>
              </Select>
            </div>
            <div>
              <Label className="mb-2 block">Upload Resume or Government ID</Label>
              <div 
                className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                {file ? (
                  <>
                    <FileText className="h-8 w-8 text-primary mb-2" />
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Attached successfully</p>
                  </>
                ) : (
                  <>
                    <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Click to upload document</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, JPG, or PNG (Max 5MB)</p>
                  </>
                )}
                <input 
                  id="file-upload" 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => e.target.files && setFile(e.target.files[0])}
                />
              </div>
            </div>
          </>
        );
      case "training_provider":
        return (
          <>
            <div>
              <Label htmlFor="institute">Institute Name</Label>
              <Input id="institute" name="institute" placeholder="Enter full institute name" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="accreditation">NSDC/NCVT Accreditation No.</Label>
              <Input id="accreditation" name="accreditation" placeholder="e.g. TC-123456" required className="mt-1" />
            </div>
            <div>
              <Label className="mb-2 block">Upload Accreditation Certificate</Label>
              <div 
                className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                {file ? (
                  <>
                    <FileText className="h-8 w-8 text-primary mb-2" />
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Attached successfully</p>
                  </>
                ) : (
                  <>
                    <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Click to upload certificate</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF format required (Max 10MB)</p>
                  </>
                )}
                <input 
                  id="file-upload" 
                  type="file" 
                  className="hidden" 
                  accept=".pdf"
                  onChange={(e) => e.target.files && setFile(e.target.files[0])}
                />
              </div>
            </div>
          </>
        );
      default:
        // Employer or Government Admin
        return (
          <>
            <div>
              <Label htmlFor="organization">Organization Name</Label>
              <Input id="organization" name="organization" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="designation">Your Designation</Label>
              <Input id="designation" name="designation" required className="mt-1" />
            </div>
            <div>
              <Label className="mb-2 block">Upload Identity / Authorization Letter</Label>
              <div 
                className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                {file ? (
                  <>
                    <FileText className="h-8 w-8 text-primary mb-2" />
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Attached successfully</p>
                  </>
                ) : (
                  <>
                    <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Click to upload document</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, JPG, or PNG (Max 5MB)</p>
                  </>
                )}
                <input 
                  id="file-upload" 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => e.target.files && setFile(e.target.files[0])}
                />
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-xl space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
            <Target className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Welcome to SkillTrack, {session.name.split(' ')[0]}!</h1>
          <p className="text-muted-foreground mt-2">
            Let's complete your profile. We need a few more details to set up your {session.role.replace(/_/g, ' ')} account.
          </p>
        </div>

        <Card className="border-border shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={handleComplete} className="space-y-5">
              
              {renderRoleFields()}
              
              <div className="pt-4 mt-6 border-t border-border">
                <Button type="submit" loading={loading} className="w-full h-11 text-base">
                  Complete Verification & Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="text-center text-xs text-muted-foreground mt-4">
                  By completing this verification, you agree to the Government of Maharashtra's data sharing and retention policies.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
