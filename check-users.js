require("dotenv").config({ path: ".env.local" });
const { MongoClient } = require("mongodb");

async function checkUsers() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("skilltrack");
    const users = db.collection("users");
    
    const allUsers = await users.find({}).toArray();
    console.log("All users in DB:", allUsers.map(u => ({ email: u.email, role: u.role })));
  } catch (error) {
    console.error("MongoDB error:", error);
  } finally {
    await client.close();
  }
}

checkUsers();
