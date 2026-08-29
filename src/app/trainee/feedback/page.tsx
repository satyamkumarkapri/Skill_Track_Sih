"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, Button, Textarea, Label, Select } from "@/components/ui";
import { MessageSquare, Send } from "lucide-react";

export default function TraineeFeedbackPage() {
  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <h1 className="text-2xl font-bold">Feedback</h1>
      <Card>
        <CardHeader><CardTitle>Share Your Experience</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Training Quality</Label>
            <Select className="mt-1"><option value="5">⭐⭐⭐⭐⭐ Excellent</option><option value="4">⭐⭐⭐⭐ Good</option><option value="3">⭐⭐⭐ Average</option><option value="2">⭐⭐ Poor</option><option value="1">⭐ Very Poor</option></Select></div>
          <div><Label>Training Relevance to Job</Label>
            <Select className="mt-1"><option value="highly">Highly Relevant</option><option value="somewhat">Somewhat Relevant</option><option value="not">Not Relevant</option></Select></div>
          <div><Label>Job Satisfaction</Label>
            <Select className="mt-1"><option value="5">Very Satisfied</option><option value="4">Satisfied</option><option value="3">Neutral</option><option value="2">Dissatisfied</option><option value="1">Very Dissatisfied</option></Select></div>
          <div><Label>Additional Comments</Label>
            <Textarea placeholder="Share your feedback about the training program..." className="mt-1" /></div>
          <Button><Send className="h-4 w-4" /> Submit Feedback</Button>
        </CardContent>
      </Card>
    </div>
  );
}
