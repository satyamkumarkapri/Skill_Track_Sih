"use server";

import { getDb } from "@/lib/mongodb";
import { verifySession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function createCourse(formData: FormData) {
  try {
    const session = await verifySession();
    if (!session || session.role !== "training_provider") {
      return { error: "Unauthorized. Only Training Providers can create courses." };
    }

    const title = formData.get("title") as string;
    const sector = formData.get("sector") as string;
    const durationWeeks = parseInt(formData.get("duration") as string, 10);
    const targetSkills = (formData.get("targetSkills") as string)
      .split(",")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (!title || !sector || isNaN(durationWeeks)) {
      return { error: "Please fill out all required fields correctly." };
    }

    const db = await getDb();
    
    const newCourse = {
      providerId: session.userId,
      providerName: session.name, // denormalized for easy querying
      title,
      sector,
      durationWeeks,
      targetSkills,
      enrolledTrainees: 0,
      createdAt: new Date(),
    };

    const result = await db.collection("courses").insertOne(newCourse);
    // Revalidate ALL pages that display courses so they update everywhere
    revalidatePath("/provider/courses");
    revalidatePath("/provider/dashboard");
    revalidatePath("/dashboard/training");
    revalidatePath("/trainee/training");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/analytics");
    revalidatePath("/dashboard/manage-users");

    return { success: true, courseId: result.insertedId.toString() };
  } catch (error) {
    console.error("Create course error:", error);
    return { error: "An unexpected error occurred while creating the course." };
  }
}

export async function getProviderCourses() {
  try {
    const session = await verifySession();
    if (!session || session.role !== "training_provider") {
      return { error: "Unauthorized", courses: [] };
    }

    const db = await getDb();
    const courses = await db
      .collection("courses")
      .find({ providerId: session.userId })
      .sort({ createdAt: -1 })
      .toArray();

    return {
      success: true,
      courses: courses.map(c => ({
        id: c._id.toString(),
        title: c.title,
        sector: c.sector,
        durationWeeks: c.durationWeeks,
        targetSkills: c.targetSkills,
        enrolledTrainees: c.enrolledTrainees || 0,
        createdAt: c.createdAt,
        rating: c.rating || 0,
        reviewCount: c.reviewCount || 0,
      })),
    };
  } catch (error) {
    console.error("Get courses error:", error);
    return { error: "Failed to fetch courses", courses: [] };
  }
}

export async function getProviderAnalytics() {
  try {
    const session = await verifySession();
    if (!session || session.role !== "training_provider") {
      return { error: "Unauthorized", data: null };
    }

    const db = await getDb();
    const courses = await db.collection("courses").find({ providerId: session.userId }).toArray();
    const enrollments = await db.collection("enrollments").find({ providerId: session.userId }).toArray();
    
    const totalCourses = courses.length;
    const totalTrainees = enrollments.length;
    
    // Calculate real placement rate
    const completedTrainees = enrollments.filter(e => e.status === "Completed");
    const totalCompleted = completedTrainees.length;
    const employed = completedTrainees.filter(e => e.outcome === "Employed" || e.outcome === "Self-Employed" || e.outcome === "Apprenticeship").length;
    
    const avgPlacementRate = totalCompleted > 0 ? Math.round((employed / totalCompleted) * 100) : 0;
    
    return {
      success: true,
      data: {
        totalCourses,
        totalTrainees,
        avgPlacementRate,
        courses: courses.map(c => ({
          id: c._id.toString(),
          title: c.title,
          enrolledTrainees: c.enrolledTrainees || 0,
        })),
      }
    };
  } catch (error) {
    return { error: "Failed to fetch analytics", data: null };
  }
}

// ====== ADMIN: Get ALL courses from ALL providers ======
export async function getAllCoursesFromDB() {
  try {
    const db = await getDb();
    const courses = await db.collection("courses").find({}).sort({ createdAt: -1 }).toArray();
    return {
      success: true,
      courses: courses.map((c) => ({
        id: c._id.toString(),
        title: c.title,
        sector: c.sector || "General",
        durationWeeks: c.durationWeeks,
        targetSkills: c.targetSkills || [],
        enrolledTrainees: c.enrolledTrainees || 0,
        providerName: c.providerName || "Unknown Provider",
        providerId: c.providerId,
        isActive: c.isActive !== false,
        createdAt: c.createdAt?.toISOString?.() ?? null,
        rating: c.rating || 0,
        reviewCount: c.reviewCount || 0,
      })),
    };
  } catch (error) {
    console.error("getAllCoursesFromDB error:", error);
    return { success: false, courses: [] };
  }
}
