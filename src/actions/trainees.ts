"use server";

import { getDb } from "@/lib/mongodb";

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

export async function getTraineeById(id: string) {
  try {
    const db = await getDb();
    const trainee = await db.collection("trainees").findOne({ _id: id as any });
    
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
