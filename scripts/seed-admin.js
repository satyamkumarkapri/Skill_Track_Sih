const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");

const MONGODB_URI = "mongodb+srv://2500031975cse1_db_user:root@cluster0.t1vsudk.mongodb.net/skilltrack?retryWrites=true&w=majority";

async function seedAdmin() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db("skilltrack");
    const usersCollection = db.collection("users");
    const adminEmail = "admin@skilltrack.gov.in";
    const adminPassword = "Admin@2026";

    const existing = await usersCollection.findOne({ email: adminEmail });
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    if (existing) {
      await usersCollection.updateOne(
        { email: adminEmail },
        { $set: { password: hashedPassword, role: "government_admin", onboardingCompleted: true, name: "Admin Officer", updatedAt: new Date() } }
      );
      console.log("Admin updated successfully");
    } else {
      await usersCollection.insertOne({
        name: "Admin Officer",
        email: adminEmail,
        role: "government_admin",
        password: hashedPassword,
        createdAt: new Date(),
        onboardingCompleted: true,
        organization: "Government of Maharashtra",
        designation: "Government Administrator",
      });
      console.log("Admin created successfully");
    }

    console.log("\n=====================================");
    console.log("ADMIN LOGIN CREDENTIALS:");
    console.log("  Email:    " + adminEmail);
    console.log("  Password: " + adminPassword);
    console.log("  Role:     Government Admin (Full Access)");
    console.log("=====================================\n");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
  }
}

seedAdmin();
