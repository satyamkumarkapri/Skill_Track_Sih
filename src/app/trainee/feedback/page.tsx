import React from "react";
import { verifySession } from "@/lib/session";
import { getDb } from "@/lib/mongodb";
import { TraineeFeedbackForm } from "./feedback-form";

export default async function TraineeFeedbackPage() {
  const session = await verifySession();
  
  if (!session || !session.userId) {
    return <div className="p-6">Not logged in.</div>;
  }

  const db = await getDb();
  
  // Fetch active or completed courses for this trainee
  const enrollments = await db.collection("enrollments").find({ 
    traineeId: session.userId 
  }).toArray();
  
  const courses = enrollments.map(e => ({
    id: e.courseId,
    title: e.courseTitle,
    provider: e.providerName
  }));

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <h1 className="text-2xl font-bold">Feedback</h1>
      <p className="text-muted-foreground">Share your experience to help us improve course quality.</p>
      
      {courses.length === 0 ? (
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg text-center text-slate-500">
          You are not enrolled in any courses yet.
        </div>
      ) : (
        <TraineeFeedbackForm courses={courses} />
      )}
    </div>
  );
}
