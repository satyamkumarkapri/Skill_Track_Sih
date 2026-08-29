"use server";

import { getDb } from "@/lib/mongodb";
import { createSession, deleteSession, verifySession } from "@/lib/session";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function registerUser(formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    let email = formData.get("email") as string;
    const role = formData.get("role") as string;
    const password = formData.get("password") as string;

    if (email) {
      email = email.trim().toLowerCase();
    }

    if (!firstName || !lastName || !email || !role || !password) {
      return { error: "All fields are required" };
    }

    const db = await getDb();
    const usersCollection = db.collection("users");

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return { error: "Email is already registered. Please sign in." };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user object
    const newUser = {
      name: `${firstName} ${lastName}`,
      email,
      role,
      password: hashedPassword,
      createdAt: new Date(),
      onboardingCompleted: false, // Force new users to complete onboarding
    };

    const result = await usersCollection.insertOne(newUser);

    // After registration, log them in immediately so they can go to onboarding
    await createSession({
      userId: result.insertedId.toString(),
      email,
      role,
      name: newUser.name,
      onboardingCompleted: false,
    });

    return { success: true, userId: result.insertedId.toString() };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "An unexpected error occurred during registration" };
  }
}

export async function loginUser(formData: FormData) {
  try {
    let email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (email) {
      email = email.trim().toLowerCase();
    }

    if (!email || !password) {
      return { error: "Email and password are required" };
    }

    const db = await getDb();
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return { error: "Invalid credentials" };
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return { error: "Invalid credentials" };
    }

    // Create secure session
    await createSession({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
      onboardingCompleted: user.onboardingCompleted !== false, // Default true for older mock users, false if explicitly set
    });

    return { success: true, role: user.role };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "An unexpected error occurred during login" };
  }
}

export async function logoutUser() {
  await deleteSession();
  revalidatePath("/");
  return { success: true };
}

export async function changePassword(formData: FormData) {
  try {
    const session = await verifySession();
    if (!session) {
      return { error: "Unauthorized" };
    }

    const oldPassword = formData.get("oldPassword") as string;
    const newPassword = formData.get("newPassword") as string;

    if (!oldPassword || !newPassword) {
      return { error: "Both old and new passwords are required" };
    }

    const db = await getDb();
    const usersCollection = db.collection("users");
    
    // Fetch current user from DB to get the current password hash
    const user = await usersCollection.findOne({ email: session.email });
    if (!user) {
      return { error: "User not found" };
    }

    // Verify old password
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      return { error: "Incorrect old password" };
    }

    // Hash new password and update
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await usersCollection.updateOne(
      { email: session.email },
      { $set: { password: hashedNewPassword, updatedAt: new Date() } }
    );

    return { success: true };
  } catch (error) {
    console.error("Change password error:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function getSessionAction() {
  return await verifySession();
}

export async function updateProfileAction(formData: FormData) {
  try {
    const session = await verifySession();
    if (!session) return { error: "Unauthorized" };

    const name = formData.get("name") as string;
    const aadhaar = formData.get("aadhaar") as string;
    const education = formData.get("education") as string;
    
    if (!name) return { error: "Name is required" };

    const db = await getDb();
    
    // We update name at root level, and aadhaar/education in onboardingData
    const updateQuery: any = { name, updatedAt: new Date() };
    if (aadhaar || education) {
      updateQuery["onboardingData.aadhaar"] = aadhaar;
      updateQuery["onboardingData.education"] = education;
    }
    
    await db.collection("users").updateOne(
      { email: session.email },
      { $set: updateQuery }
    );

    // Update the session to reflect new name
    await createSession({
      userId: session.userId,
      email: session.email,
      role: session.role,
      name: name,
      onboardingCompleted: session.onboardingCompleted,
    });

    return { success: true, name };
  } catch (error) {
    console.error("Update profile error:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function completeOnboardingAction(formData: FormData) {
  try {
    const session = await verifySession();
    if (!session) return { error: "Unauthorized" };

    const db = await getDb();
    
    // Process form data based on role
    // For prototype, we just save it as a generic metadata object
    const metadata: Record<string, string> = {};
    formData.forEach((value, key) => {
      if (typeof value === "string") {
        metadata[key] = value;
      }
    });

    await db.collection("users").updateOne(
      { email: session.email },
      { 
        $set: { 
          onboardingCompleted: true, 
          onboardingData: metadata,
          updatedAt: new Date() 
        } 
      }
    );

    // Update the session
    await createSession({
      userId: session.userId,
      email: session.email,
      role: session.role,
      name: session.name,
      onboardingCompleted: true,
    });

    return { success: true };
  } catch (error) {
    console.error("Onboarding error:", error);
    return { error: "An unexpected error occurred" };
  }
}

