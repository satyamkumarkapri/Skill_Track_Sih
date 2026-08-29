"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Select } from "@/components/ui";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { createCourse } from "@/actions/courses";

const SECTORS = [
  "Information Technology",
  "Manufacturing & Engineering",
  "Healthcare & Life Sciences",
  "Agriculture & Allied",
  "Construction & Infrastructure",
  "Retail & E-Commerce",
  "Tourism & Hospitality",
  "Banking & Finance",
  "Green Jobs",
];

export default function AddCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await createCourse(formData);

    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    } else {
      toast.success("Course created successfully!");
      router.push("/provider/courses");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/provider/courses">
          <Button variant="outline" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create New Course</h1>
          <p className="text-sm text-muted-foreground mt-1">Define a new training program to track enrollments and outcomes.</p>
        </div>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Course Title</Label>
                <Input 
                  id="title" 
                  name="title" 
                  placeholder="e.g. Advanced CNC Machine Operation" 
                  required 
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sector">Industry Sector</Label>
                  <Select id="sector" name="sector" required className="mt-1 w-full h-10 px-3 py-2 border rounded-md bg-background">
                    <option value="">Select Sector...</option>
                    {SECTORS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="duration">Duration (in weeks)</Label>
                  <Input 
                    id="duration" 
                    name="duration" 
                    type="number" 
                    min="1" 
                    max="104"
                    placeholder="e.g. 12" 
                    required 
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="targetSkills">Target Skills (comma separated)</Label>
                <Input 
                  id="targetSkills" 
                  name="targetSkills" 
                  placeholder="e.g. Precision Machining, CAD, Quality Control" 
                  required 
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  List the core skills acquired. This helps in matching trainees with employers later.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-end gap-3">
              <Link href="/provider/courses">
                <Button variant="outline" type="button">Cancel</Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Course
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
