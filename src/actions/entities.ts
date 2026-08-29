"use server";

import { getDb } from "@/lib/mongodb";

export async function getProviders() {
  try {
    const db = await getDb();
    const providerUsers = await db.collection("users")
      .find({ role: "training_provider" })
      .sort({ createdAt: -1 })
      .toArray();

    const allCourses = await db.collection("courses").find({}).toArray();
    const allEnrollments = await db.collection("enrollments").find({}).toArray();

    return providerUsers.map(p => {
      const pid = p._id.toString();
      const providerCourses = allCourses.filter(c => c.providerId === pid);
      const providerEnrollments = allEnrollments.filter(e => e.providerId === pid);
      const completedEnrollments = providerEnrollments.filter(e => e.status === "Completed");
      const placedEnrollments = providerEnrollments.filter(e =>
        ["Employed", "Self-Employed", "Apprenticeship"].includes(e.outcome)
      );
      const placementRate = completedEnrollments.length > 0
        ? Math.round((placedEnrollments.length / completedEnrollments.length) * 100)
        : 0;

      return {
        id: pid,
        _id: pid,
        name: p.name || p.email,
        email: p.email,
        total_trainees: providerEnrollments.length,
        total_courses: providerCourses.length,
        placement_rate: placementRate,
        retention_rate_6m: placementRate > 0 ? Math.max(placementRate - 10, 0) : 0,
        avg_salary: 0,
        outcome_effectiveness_score: placementRate,
        certification_pass_rate: 85,
        status: "Active",
        accreditation_status: "Accredited",
        district: p.onboardingData?.district || "Maharashtra",
        organization: p.organization || p.name,
        createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : null,
      };
    });
  } catch (error) {
    console.error("Error fetching providers:", error);
    return [];
  }
}

export async function getEmployers() {
  try {
    const db = await getDb();
    const employerUsers = await db.collection("users")
      .find({ role: "employer" })
      .sort({ createdAt: -1 })
      .toArray();

    const allEnrollments = await db.collection("enrollments").find({}).toArray();

    return employerUsers.map(e => {
      const eid = e._id.toString();
      const empEnrollments = allEnrollments.filter(en => en.employerId === eid);
      return {
        id: eid,
        _id: eid,
        name: e.name || e.email,
        email: e.email,
        industry: e.onboardingData?.industry || "General",
        district: e.onboardingData?.district || "Maharashtra",
        total_employees_from_program: empEnrollments.length,
        verification_rate: 80,
        avg_salary_offered: 0,
        retention_rate: 75,
        status: "Active",
        createdAt: e.createdAt ? new Date(e.createdAt).toISOString() : null,
      };
    });
  } catch (error) {
    console.error("Error fetching employers:", error);
    return [];
  }
}

export async function getAuditLogs() {
  return [];
}
