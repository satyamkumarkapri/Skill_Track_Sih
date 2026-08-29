require("dotenv").config({ path: ".env.local" });
const { MongoClient } = require("mongodb");

async function testMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("No MONGODB_URI found");
    return;
  }
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db("skilltrack");
    const users = db.collection("users");
    const testUser = await users.findOne({ email: "test@test.com" });
    console.log("Found user:", testUser);
    
    // Insert dummy if not found
    if (!testUser) {
      await users.insertOne({ email: "test@test.com", test: true });
      console.log("Inserted test user");
    }
  } catch (error) {
    console.error("MongoDB error:", error);
  } finally {
    await client.close();
  }
}

testMongo();
