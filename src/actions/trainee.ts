"use server";

import { getDb } from "@/lib/mongodb";
import { verifySession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function getTraineeProfile() {
  try {
    const session = await verifySession();
    if (!session || session.role !== "trainee") {
      return { error: "Unauthorized", profile: null };
    }

    const db = await getDb();
    const user = await db.collection("users").findOne({ email: session.email });

    if (!user) {
      return { error: "User not found", profile: null };
    }

    // Return the profile including onboarding data
    return {
      success: true,
      profile: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        onboardingCompleted: user.onboardingCompleted,
        onboardingData: user.onboardingData || {}, // Contains aadhaar, education, etc.
        createdAt: user.createdAt,
      },
    };
  } catch (error) {
    console.error("Get trainee profile error:", error);
    return { error: "Failed to fetch profile", profile: null };
  }
}

export async function getAvailableCourses() {
  try {
    const session = await verifySession();
    if (!session || session.role !== "trainee") return { error: "Unauthorized", courses: [] };

    const db = await getDb();
    const courses = await db.collection("courses").find({}).sort({ createdAt: -1 }).toArray();

    return {
      success: true,
      courses: courses.map((c) => ({
        id: c._id.toString(),
        providerId: c.providerId,
        providerName: c.providerName || "Unknown Provider",
        title: c.title,
        sector: c.sector,
        durationWeeks: c.durationWeeks,
        targetSkills: c.targetSkills || [],
        enrolledTrainees: c.enrolledTrainees || 0,
      })),
    };
  } catch (error) {
    console.error("Get available courses error:", error);
    return { error: "Failed to fetch courses", courses: [] };
  }
}

export async function getMyEnrollments() {
  try {
    const session = await verifySession();
    if (!session || session.role !== "trainee") return { error: "Unauthorized", enrollments: [] };

    const db = await getDb();
    const enrollments = await db.collection("enrollments").find({ traineeId: session.userId }).sort({ enrollmentDate: -1 }).toArray();

    return {
      success: true,
      enrollments: enrollments.map((e) => ({
        id: e._id.toString(),
        courseId: e.courseId,
        courseTitle: e.courseTitle,
        providerId: e.providerId,
        enrollmentDate: e.enrollmentDate,
        status: e.status,
        outcome: e.outcome,
      })),
    };
  } catch (error) {
    console.error("Get enrollments error:", error);
    return { error: "Failed to fetch enrollments", enrollments: [] };
  }
}

export async function enrollInCourse(courseId: string) {
  try {
    const session = await verifySession();
    if (!session || session.role !== "trainee") return { error: "Unauthorized" };

    const db = await getDb();

    // Verify course exists
    const course = await db.collection("courses").findOne({ _id: new (require("mongodb").ObjectId)(courseId) });
    if (!course) return { error: "Course not found" };

    // Verify not already enrolled
    const existing = await db.collection("enrollments").findOne({
      traineeId: session.userId,
      courseId: courseId,
    });

    if (existing) {
      return { error: "You are already enrolled in this course." };
    }

    // Create enrollment
    const newEnrollment = {
      traineeId: session.userId,
      traineeName: session.name,
      courseId: courseId,
      courseTitle: course.title,
      providerId: course.providerId,
      enrollmentDate: new Date(),
      status: "In Progress",
      outcome: "Pending",
    };

    await db.collection("enrollments").insertOne(newEnrollment);

    // Increment course enrollment count
    await db.collection("courses").updateOne(
      { _id: new (require("mongodb").ObjectId)(courseId) },
      { $inc: { enrolledTrainees: 1 } }
    );

    revalidatePath("/trainee/training");
    revalidatePath("/trainee/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Enrollment error:", error);
    return { error: "Failed to enroll in course" };
  }
}
