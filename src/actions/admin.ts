"use server";

import { getDb } from "@/lib/mongodb";
import { verifySession } from "@/lib/session";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

async function requireAdmin() {
  const session = await verifySession();
  if (!session || !["government_admin", "government_officer"].includes(session.role)) {
    throw new Error("Unauthorized: Admin access required");
  }
  return session;
}

export async function getAllUsersForAdmin() {
  await requireAdmin();
  const db = await getDb();
  const users = await db.collection("users")
    .find({}, { projection: { password: 0 } })
    .sort({ createdAt: -1 })
    .toArray();
  return users.map(u => ({
    ...u,
    _id: u._id.toString(),
    createdAt: u.createdAt?.toISOString?.() ?? null,
    updatedAt: u.updatedAt?.toISOString?.() ?? null,
  }));
}

export async function updateUserRoleAction(userId: string, newRole: string) {
  await requireAdmin();
  const db = await getDb();
  await db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    { $set: { role: newRole, updatedAt: new Date() } }
  );
  revalidatePath("/dashboard/manage-users");
  return { success: true };
}

export async function deleteUserAction(userId: string) {
  await requireAdmin();
  const db = await getDb();
  // Also remove their enrollments
  await db.collection("enrollments").deleteMany({ userId });
  await db.collection("users").deleteOne({ _id: new ObjectId(userId) });
  revalidatePath("/dashboard/manage-users");
  return { success: true };
}

export async function resetUserPasswordAction(userId: string, newPassword: string) {
  await requireAdmin();
  const db = await getDb();
  const hashed = await bcrypt.hash(newPassword, 10);
  await db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    { $set: { password: hashed, updatedAt: new Date() } }
  );
  return { success: true };
}

export async function getAllCoursesForAdmin() {
  await requireAdmin();
  const db = await getDb();
  const courses = await db.collection("courses")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
  return courses.map(c => ({
    ...c,
    _id: c._id.toString(),
    createdAt: c.createdAt?.toISOString?.() ?? null,
  }));
}

export async function deleteCourseAction(courseId: string) {
  await requireAdmin();
  const db = await getDb();
  await db.collection("enrollments").deleteMany({ courseId });
  await db.collection("courses").deleteOne({ _id: new ObjectId(courseId) });
  revalidatePath("/dashboard/manage-users");
  return { success: true };
}

export async function getAdminStats() {
  await requireAdmin();
  const db = await getDb();
  const [totalUsers, totalCourses, totalEnrollments] = await Promise.all([
    db.collection("users").countDocuments(),
    db.collection("courses").countDocuments(),
    db.collection("enrollments").countDocuments(),
  ]);
  const roleBreakdown = await db.collection("users").aggregate([
    { $group: { _id: "$role", count: { $sum: 1 } } }
  ]).toArray();
  return { totalUsers, totalCourses, totalEnrollments, roleBreakdown };
}
