"use client";

import React, { useState, useTransition } from "react";
import { Card, CardHeader, CardTitle, CardContent, Button, Textarea, Label } from "@/components/ui";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { submitTraineeFeedback } from "@/actions/feedback";
import { toast } from "sonner";

export function TraineeFeedbackForm({ courses }: { courses: { id: string, title: string, provider: string }[] }) {
  const [isPending, startTransition] = useTransition();
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [courseId, setCourseId] = useState(courses[0]?.id || "");
  const [rating, setRating] = useState(5);
  const [relevance, setRelevance] = useState("highly");
  const [satisfaction, setSatisfaction] = useState(5);
  const [comments, setComments] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) return;

    startTransition(async () => {
      const result = await submitTraineeFeedback({
        courseId,
        rating,
        relevance,
        satisfaction,
        comments
      });

      if (result.success) {
        toast.success("Feedback submitted successfully!");
        setIsSubmitted(true);
      } else {
        toast.error("Failed to submit feedback: " + result.error);
      }
    });
  };

  if (isSubmitted) {
    return (
      <Card className="border-emerald-200 bg-emerald-50">
        <CardContent className="p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h2>
          <p className="text-slate-600 mb-6">Your feedback has been recorded and will help improve future training programs.</p>
          <Button onClick={() => setIsSubmitted(false)} variant="outline">
            Submit Another Feedback
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-slate-200">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50">
        <CardTitle className="text-xl">Share Your Experience</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="p-6 space-y-6">
          
          <div className="space-y-3">
            <Label className="text-base font-semibold">Select Course</Label>
            <select 
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="flex h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.title} ({c.provider})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="font-semibold">Training Quality Rating</Label>
              <select 
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="flex h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="5">⭐⭐⭐⭐⭐ Excellent (5)</option>
                <option value="4">⭐⭐⭐⭐ Good (4)</option>
                <option value="3">⭐⭐⭐ Average (3)</option>
                <option value="2">⭐⭐ Poor (2)</option>
                <option value="1">⭐ Very Poor (1)</option>
              </select>
            </div>

            <div className="space-y-3">
              <Label className="font-semibold">Relevance to Job Market</Label>
              <select 
                value={relevance}
                onChange={(e) => setRelevance(e.target.value)}
                className="flex h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="highly">Highly Relevant</option>
                <option value="somewhat">Somewhat Relevant</option>
                <option value="not">Not Relevant</option>
              </select>
            </div>

            <div className="space-y-3 md:col-span-2">
              <Label className="font-semibold">Overall Job Satisfaction</Label>
              <select 
                value={satisfaction}
                onChange={(e) => setSatisfaction(Number(e.target.value))}
                className="flex h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="5">Very Satisfied (5)</option>
                <option value="4">Satisfied (4)</option>
                <option value="3">Neutral (3)</option>
                <option value="2">Dissatisfied (2)</option>
                <option value="1">Very Dissatisfied (1)</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 border-t border-slate-100 pt-6">
            <Label className="font-semibold">Additional Comments (Optional)</Label>
            <Textarea 
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="What did you like? What could be improved? Did the training directly help you get a job?" 
              className="min-h-[120px] text-base p-4 border-slate-300 focus-visible:ring-primary" 
            />
          </div>
          
          <Button type="submit" disabled={isPending} className="w-full sm:w-auto h-12 px-8 text-base shadow-lg shadow-primary/20">
            {isPending ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Send className="h-5 w-5 mr-2" />}
            {isPending ? "Submitting..." : "Submit Feedback"}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
