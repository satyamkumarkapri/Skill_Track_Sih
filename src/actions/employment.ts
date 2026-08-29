"use server";

import { getDb } from "@/lib/mongodb";

export async function getEmploymentData() {
  try {
    const db = await getDb();

    // Fetch all real enrollments from MongoDB
    const enrollments = await db.collection("enrollments").find({}).toArray();

    // Fetch all registered users to get trainee names
    const users = await db.collection("users").find({ role: "trainee" }).toArray();
    const userMap: Record<string, string> = {};
    users.forEach(u => { userMap[u._id.toString()] = u.name || u.email; });

    // Fetch all courses to get course titles
    const courses = await db.collection("courses").find({}).toArray();
    const courseMap: Record<string, string> = {};
    courses.forEach(c => { courseMap[c._id.toString()] = c.title; });

    // Employed — enrollments where outcome is "Employed"
    const employed = enrollments
      .filter(e => e.outcome === "Employed")
      .map((e, i) => ({
        id: e._id.toString(),
        trainee_name: userMap[e.traineeId] || e.traineeName || `Trainee ${i + 1}`,
        employer_name: e.employerName || "Registered Employer",
        job_role: e.jobRole || courseMap[e.courseId] || "Not Specified",
        current_salary: e.salary || 0,
        employment_type: e.employmentType || "Full-time",
        verification_status: e.verificationStatus || "pending",
        confidence_score: e.confidenceScore || 75,
        course_title: courseMap[e.courseId] || e.courseTitle || "—",
        enrolled_date: e.enrollmentDate,
      }));

    // Self-Employed — enrollments where outcome is "Self-Employed"
    const selfEmp = enrollments
      .filter(e => e.outcome === "Self-Employed")
      .map((e, i) => ({
        id: e._id.toString(),
        trainee_name: userMap[e.traineeId] || e.traineeName || `Trainee ${i + 1}`,
        business_type: e.businessType || "Self-Employment",
        business_sector: e.businessSector || courseMap[e.courseId] || "General",
        location: e.location || "Maharashtra",
        monthly_income: e.salary || 0,
        num_workers: e.numWorkers || 1,
        business_status: "active",
        training_relevance: "relevant",
      }));

    // Apprenticeships — enrollments where outcome is "Apprenticeship"
    const apprenticeships = enrollments
      .filter(e => e.outcome === "Apprenticeship")
      .map((e, i) => ({
        id: e._id.toString(),
        trainee_name: userMap[e.traineeId] || e.traineeName || `Trainee ${i + 1}`,
        company: e.employerName || "Company",
        trade: e.jobRole || courseMap[e.courseId] || "Not Specified",
        duration_months: e.durationMonths || 6,
        stipend: e.salary || 0,
        conversion_status: e.conversionStatus || "pending",
        status: e.status === "Completed" ? "completed" : "active",
      }));

    // Also count "In Progress" enrollments as tracking
    const inProgress = enrollments.filter(e => e.status === "In Progress" || e.status === "Enrolled");
    const completed = enrollments.filter(e => e.status === "Completed");

    return { records: employed, selfEmp, apprenticeships, inProgress: inProgress.length, completed: completed.length };
  } catch (error) {
    console.error("Error fetching employment data from MongoDB:", error);
    return { records: [], selfEmp: [], apprenticeships: [], inProgress: 0, completed: 0 };
  }
}
