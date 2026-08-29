"use server";

import { verifySession } from "@/lib/session";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

export async function submitTraineeFeedback(data: {
  courseId: string;
  rating: number;
  relevance: string;
  satisfaction: number;
  comments: string;
}) {
  const session = await verifySession();
  if (!session || session.role !== "trainee" || !session.userId) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const db = await getDb();
    
    // Verify course exists
    const course = await db.collection("courses").findOne({ _id: new ObjectId(data.courseId) });
    if (!course) {
      return { success: false, error: "Course not found" };
    }

    // Insert feedback
    await db.collection("feedbacks").insertOne({
      traineeId: session.userId,
      courseId: data.courseId,
      providerId: course.providerId,
      rating: data.rating,
      relevance: data.relevance,
      satisfaction: data.satisfaction,
      comments: data.comments,
      createdAt: new Date()
    });

    // Recalculate average course rating
    const courseFeedbacks = await db.collection("feedbacks").find({ courseId: data.courseId }).toArray();
    const totalRating = courseFeedbacks.reduce((sum, fb) => sum + fb.rating, 0);
    const avgRating = totalRating / courseFeedbacks.length;

    // Update course with new rating
    await db.collection("courses").updateOne(
      { _id: new ObjectId(data.courseId) },
      { $set: { rating: Number(avgRating.toFixed(1)), reviewCount: courseFeedbacks.length } }
    );

    revalidatePath("/dashboard/courses");
    revalidatePath("/provider/courses");
    
    return { success: true };
  } catch (error: any) {
    console.error("Error submitting feedback:", error);
    return { success: false, error: error.message };
  }
}
