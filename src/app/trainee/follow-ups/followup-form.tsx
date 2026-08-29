"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, Button, Label, Input } from "@/components/ui";
import { Send, Loader2 } from "lucide-react";
import { addMyFollowUp } from "@/actions/trainee-updates";
import { toast } from "sonner";

export default function FollowUpForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await addMyFollowUp(formData);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Status update submitted successfully!");
      (e.target as HTMLFormElement).reset();
    }
    setLoading(false);
  };

  return (
    <Card className="border-blue-100 bg-blue-50/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-blue-900">Submit Status Update</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="space-y-2 flex-1 w-full">
            <Label htmlFor="status" className="text-blue-900">Current Status</Label>
            <select 
              id="status" 
              name="status" 
              required 
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <option value="" disabled>Select your status...</option>
              <option value="Employed">Employed</option>
              <option value="Self-Employed">Self-Employed</option>
              <option value="Apprenticeship">Apprenticeship</option>
              <option value="Actively Interviewing">Actively Interviewing</option>
              <option value="Looking for Work">Looking for Work</option>
              <option value="Pursuing Higher Education">Pursuing Higher Education</option>
            </select>
          </div>
          <div className="space-y-2 flex-1 w-full">
            <Label htmlFor="notes" className="text-blue-900">Brief Note (Optional)</Label>
            <Input 
              id="notes" 
              name="notes" 
              placeholder="e.g. Just joined a new company!" 
              className="h-11 bg-white focus-visible:ring-blue-500" 
            />
          </div>
          <Button type="submit" disabled={loading} className="h-11 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
            Submit Update
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
