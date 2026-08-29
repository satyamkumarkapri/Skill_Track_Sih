import React from "react";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifySession } from "@/lib/session";
import { Card, CardContent } from "@/components/ui";
import { Star, MessageSquare, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui";

export default async function AdminCourseFeedbackPage({ params }: { params: { id: string } }) {
  const session = await verifySession();
  
  if (!session || session.role !== "admin") {
    return <div className="p-6 text-red-500">Unauthorized.</div>;
  }

  const db = await getDb();
  const courseId = params.id;
  
  const course = await db.collection("courses").findOne({ _id: new ObjectId(courseId) });
  if (!course) {
    return <div className="p-6 text-red-500">Course not found.</div>;
  }

  // Fetch feedback for this course
  const feedbacks = await db.collection("feedbacks").find({ courseId: courseId }).sort({ createdAt: -1 }).toArray();

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/training" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5 text-slate-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Course Reviews (Admin View)</h1>
          <p className="text-sm text-muted-foreground mt-1">{course.title} by {course.providerName}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-amber-50 border-amber-100 shadow-sm">
          <CardContent className="p-6 text-center">
            <h3 className="text-sm font-semibold text-amber-700 uppercase tracking-wider mb-2">Average Rating</h3>
            <div className="flex items-center justify-center gap-2">
              <Star className="h-8 w-8 text-amber-500 fill-amber-500" />
              <span className="text-4xl font-extrabold text-amber-600">{course.rating ? course.rating.toFixed(1) : "N/A"}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-100 shadow-sm">
          <CardContent className="p-6 text-center">
            <h3 className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-2">Total Reviews</h3>
            <div className="flex items-center justify-center gap-2">
              <MessageSquare className="h-8 w-8 text-blue-500" />
              <span className="text-4xl font-extrabold text-blue-600">{course.reviewCount || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-lg font-bold mb-4">Detailed Comments</h2>
      {feedbacks.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <p className="text-slate-500">No reviews submitted yet for this course.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {feedbacks.map(fb => (
            <Card key={fb._id.toString()} className="border-slate-200 shadow-sm">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < fb.rating ? "fill-amber-500" : "fill-transparent border-amber-500 opacity-30"}`} />
                    ))}
                    <span className="ml-2 text-sm font-bold text-slate-700">{fb.rating}/5</span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {fb.createdAt ? new Date(fb.createdAt).toLocaleDateString() : "Recently"}
                  </span>
                </div>
                
                <div className="flex gap-2 mb-3">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-medium">
                    Relevance: {fb.relevance}
                  </Badge>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs font-medium">
                    Satisfaction: {fb.satisfaction}/5
                  </Badge>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-slate-700 text-sm italic">
                  "{fb.comments || "No additional comments provided."}"
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
