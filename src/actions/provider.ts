"use server";

import { getDb } from "@/lib/mongodb";
import { verifySession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";

export async function getProviderTrainees() {
  try {
    const session = await verifySession();
    if (!session || session.role !== "training_provider") {
      return { error: "Unauthorized", enrollments: [] };
    }

    const db = await getDb();
    
    // In a real app we'd do a complex aggregate. For this prototype, we'll fetch all enrollments
    // for this provider, and then manually attach trainee names and course titles if needed,
    // or assume they are stored denormalized.
    const enrollments = await db.collection("enrollments").find({ providerId: session.userId }).toArray();
    
    // If no enrollments exist, let's create some dummy ones for demonstration
    if (enrollments.length === 0) {
      return { success: true, enrollments: [] };
    }

    return {
      success: true,
      enrollments: enrollments.map(e => ({
        id: e._id.toString(),
        traineeId: e.traineeId,
        traineeName: e.traineeName || "Unknown Trainee",
        courseId: e.courseId,
        courseTitle: e.courseTitle || "Unknown Course",
        enrollmentDate: e.enrollmentDate,
        status: e.status || "In Progress", // In Progress, Completed
        outcome: e.outcome || "Pending", // Pending, Employed, Self-Employed, Apprenticeship, Seeking
      })),
    };
  } catch (error) {
    console.error("Get trainees error:", error);
    return { error: "Failed to fetch trainees", enrollments: [] };
  }
}

export async function updateTraineeOutcome(enrollmentId: string, formData: FormData) {
  try {
    const session = await verifySession();
    if (!session || session.role !== "training_provider") {
      return { error: "Unauthorized" };
    }

    const outcome = formData.get("outcome") as string;
    const notes = formData.get("notes") as string;

    if (!outcome) {
      return { error: "Outcome is required" };
    }

    const db = await getDb();
    
    await db.collection("enrollments").updateOne(
      { _id: new ObjectId(enrollmentId), providerId: session.userId },
      { 
        $set: { 
          outcome,
          outcomeNotes: notes,
          outcomeUpdatedAt: new Date(),
          status: "Completed" // Automatically mark completed if outcome is set
        } 
      }
    );

    revalidatePath("/provider/outcomes");
    revalidatePath("/provider/analytics");
    revalidatePath("/provider/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Update outcome error:", error);
    return { error: "Failed to update outcome" };
  }
}

// Helper to seed some mock enrollments if the DB is empty
export async function seedMockEnrollments() {
  try {
    const session = await verifySession();
    if (!session || session.role !== "training_provider") return { error: "Unauthorized" };

    const db = await getDb();
    const existing = await db.collection("enrollments").countDocuments({ providerId: session.userId });
    
    if (existing > 0) return { success: true, message: "Already seeded" };

    const courses = await db.collection("courses").find({ providerId: session.userId }).toArray();
    if (courses.length === 0) return { error: "Please create a course first." };

    const dummyNames = ["Rahul Sharma", "Priya Patel", "Amit Singh", "Neha Gupta", "Vikram Joshi", "Pooja Desai", "Suresh Kumar", "Anita Reddy"];
    
    const newEnrollments = dummyNames.map((name, index) => {
      const course = courses[index % courses.length];
      const isCompleted = index % 3 !== 0;
      return {
        providerId: session.userId,
        traineeId: `dummy-${index}`,
        traineeName: name,
        courseId: course._id.toString(),
        courseTitle: course.title,
        enrollmentDate: new Date(Date.now() - Math.random() * 10000000000),
        status: isCompleted ? "Completed" : "In Progress",
        outcome: isCompleted ? (index % 2 === 0 ? "Employed" : "Seeking Employment") : "Pending",
      };
    });

    await db.collection("enrollments").insertMany(newEnrollments);
    
    // Update course counts
    for (const course of courses) {
      const count = newEnrollments.filter(e => e.courseId === course._id.toString()).length;
      await db.collection("courses").updateOne(
        { _id: course._id },
        { $inc: { enrolledTrainees: count } }
      );
    }

    revalidatePath("/provider/trainees");
    revalidatePath("/provider/outcomes");
    return { success: true };
  } catch (e) {
    return { error: "Failed to seed mock data" };
  }
}
