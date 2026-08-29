"use server";

import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function getTraineesFromDB() {
  try {
    const db = await getDb();
    const trainees = await db.collection("trainees").find({}).limit(500).toArray();
    
    // We need to parse MongoDB ObjectIds to strings so they can be passed to Client Components
    return trainees.map(t => ({
      ...t,
      _id: t._id.toString(),
      id: t._id.toString(), // mapping to the frontend expectation
      // Adding default mock properties that might be expected by the UI but missing from basic seed
      age: Math.floor(Math.random() * 15) + 18,
      education: "12th Pass",
      training_status: t.employment_status === 'enrolled' ? 'in-progress' : 'completed',
      current_salary: t.employment_status === 'employed' ? Math.floor(Math.random() * 20000) + 15000 : null,
      skill_match_score: Math.floor(Math.random() * 40) + 60,
    }));
  } catch (error) {
    console.error("Error fetching trainees from DB:", error);
    return [];
  }
}

export async function getTraineeById(id: string): Promise<any> {
  try {
    const db = await getDb();
    
    // Attempt to parse ID, fallback to string matching if invalid format
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (e) {
      // Ignore
    }

    // Try finding in users collection first (where live data is)
    let user = null;
    if (objectId) {
      user = await db.collection("users").findOne({ _id: objectId });
    }
    
    // Try finding in trainees collection (mock data)
    let trainee = null;
    if (objectId) {
      trainee = await db.collection("trainees").findOne({ _id: objectId });
    } else {
      trainee = await db.collection("trainees").findOne({ _id: id as any });
    }
    
    if (!trainee && !user) return null;

    // Merge data favoring the users collection
    const base = (trainee || user)!;
    
    return {
      ...base,
      _id: base._id.toString(),
      id: base._id.toString(),
      name: user?.name || trainee?.name || "Unknown",
      email: user?.email || trainee?.email || "",
      age: 24,
      education: "12th Pass",
      taluka: "City Center",
      district: trainee?.district || "Pune",
      training_status: base.employment_status === 'enrolled' ? 'in-progress' : 'completed',
      current_salary: base.employment_status === 'employed' ? Math.floor(Math.random() * 20000) + 15000 : null,
      skill_match_score: Math.floor(Math.random() * 40) + 60,
      course_name: trainee?.course_name || "Full Stack Web Development",
      // Live dynamic fields from users collection
      employmentData: user?.employmentData || null,
      employmentHistory: user?.employmentHistory || [],
      certificates: user?.certificates || [],
      followUps: user?.followUps || [],
    };
  } catch (error) {
    console.error("Error fetching trainee by ID:", error);
    return null;
  }
}

export async function getFirstTrainee() {
  try {
    const db = await getDb();
    const trainee = await db.collection("trainees").findOne({});
    
    if (!trainee) return null;

    return {
      ...trainee,
      _id: trainee._id.toString(),
      id: trainee._id.toString(),
      age: 24,
      education: "12th Pass",
      taluka: "City Center",
      training_status: trainee.employment_status === 'enrolled' ? 'in-progress' : 'completed',
      current_salary: trainee.employment_status === 'employed' ? Math.floor(Math.random() * 20000) + 15000 : null,
      skill_match_score: Math.floor(Math.random() * 40) + 60,
    };
  } catch (error) {
    console.error("Error fetching first trainee:", error);
    return null;
  }
}
