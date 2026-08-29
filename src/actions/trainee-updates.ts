"use server";

import { getDb } from "@/lib/mongodb";
import { verifySession } from "@/lib/session";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

export async function getMyFullProfile() {
  try {
    const session = await verifySession();
    if (!session || session.role !== "trainee") {
      return { error: "Unauthorized" };
    }

    const db = await getDb();
    const user = await db.collection("users").findOne({ _id: new ObjectId(session.userId) });

    if (!user) {
      return { error: "User not found" };
    }

    return {
      success: true,
      profile: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        employmentData: user.employmentData || null,
        employmentHistory: user.employmentHistory || [],
        certificates: user.certificates || [],
        followUps: user.followUps || [],
      }
    };
  } catch (error) {
    console.error("getMyFullProfile error:", error);
    return { error: "Failed to fetch profile" };
  }
}

export async function updateMyEmployment(formData: FormData) {
  try {
    const session = await verifySession();
    if (!session || session.role !== "trainee") {
      return { error: "Unauthorized" };
    }

    const employer = formData.get("employer") as string;
    const role = formData.get("role") as string;
    const joiningDate = formData.get("joiningDate") as string;
    const salary = parseInt(formData.get("salary") as string, 10);
    const type = formData.get("type") as string;

    if (!employer || !role) {
      return { error: "Employer and role are required." };
    }

    const db = await getDb();
    
    // Check for existing employment to archive
    const user = await db.collection("users").findOne({ _id: new ObjectId(session.userId) });
    const currentEmp = user?.employmentData;

    const updates: any = {
      $set: { 
        employmentData: {
          employer,
          role,
          joiningDate,
          salary: isNaN(salary) ? 0 : salary,
          type,
          updatedAt: new Date()
        } 
      }
    };

    // If they are changing employers, push the old one to history
    if (currentEmp && currentEmp.employer !== employer) {
      updates.$push = {
        employmentHistory: {
          ...currentEmp,
          endDate: new Date().toISOString(),
          status: "Changed Job"
        }
      };
    }
    
    await db.collection("users").updateOne({ _id: new ObjectId(session.userId) }, updates);

    revalidatePath("/trainee/employment");
    revalidatePath("/profile/[id]", "page");
    revalidatePath("/dashboard/trainees/[id]", "page");
    return { success: true };
  } catch (error) {
    console.error("updateMyEmployment error:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function endMyEmployment(reason: string) {
  try {
    const session = await verifySession();
    if (!session || session.role !== "trainee") {
      return { error: "Unauthorized" };
    }

    const db = await getDb();
    const user = await db.collection("users").findOne({ _id: new ObjectId(session.userId) });
    
    if (!user || !user.employmentData) {
      return { error: "No active employment to end." };
    }

    const currentEmp = user.employmentData;
    
    await db.collection("users").updateOne(
      { _id: new ObjectId(session.userId) },
      { 
        $unset: { employmentData: "" },
        $push: {
          employmentHistory: {
            ...currentEmp,
            endDate: new Date().toISOString(),
            status: "Ended",
            reason: reason || "Left job"
          }
        }
      }
    );

    revalidatePath("/trainee/employment");
    revalidatePath("/profile/[id]", "page");
    revalidatePath("/dashboard/trainees/[id]", "page");
    return { success: true };
  } catch (error) {
    console.error("endMyEmployment error:", error);
    return { error: "Failed to log job status change" };
  }
}

export async function addMyCertificate(formData: FormData) {
  try {
    const session = await verifySession();
    if (!session || session.role !== "trainee") {
      return { error: "Unauthorized" };
    }

    const name = formData.get("name") as string;
    const authority = formData.get("authority") as string;
    const date = formData.get("date") as string;

    if (!name || !authority || !date) {
      return { error: "All fields are required." };
    }

    const db = await getDb();
    
    const newCertificate = {
      id: new ObjectId().toString(),
      name,
      authority,
      date,
      addedAt: new Date()
    };

    await db.collection("users").updateOne(
      { _id: new ObjectId(session.userId) },
      { $push: { certificates: newCertificate } as any }
    );

    revalidatePath("/trainee/certificates");
    revalidatePath("/dashboard/trainees/[id]", "page");
    return { success: true };
  } catch (error) {
    console.error("addMyCertificate error:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function addMyFollowUp(formData: FormData) {
  try {
    const session = await verifySession();
    if (!session || session.role !== "trainee") {
      return { error: "Unauthorized" };
    }

    const status = formData.get("status") as string;
    const notes = formData.get("notes") as string;

    if (!status) {
      return { error: "Status is required." };
    }

    const db = await getDb();
    
    const newFollowUp = {
      id: new ObjectId().toString(),
      status,
      notes,
      date: new Date(),
      source: "Trainee"
    };

    await db.collection("users").updateOne(
      { _id: new ObjectId(session.userId) },
      { $push: { followUps: newFollowUp } as any }
    );

    // Also insert into global followups collection for the tracker if needed,
    // but saving to user profile is enough for admin visibility on the trainee detail page.
    
    revalidatePath("/trainee/follow-ups");
    revalidatePath("/dashboard/trainees/[id]", "page");
    return { success: true };
  } catch (error) {
    console.error("addMyFollowUp error:", error);
    return { error: "An unexpected error occurred" };
  }
}
