require("dotenv").config({ path: ".env.local" });
const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");

async function checkLogin() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("skilltrack");
    const users = db.collection("users");
    
    const email = "satyamkumarkapri10@gmail.com";
    const password = "12345678";

    const user = await users.findOne({ email });
    console.log("Found user:", user ? "YES" : "NO");

    if (user) {
      console.log("Password hash in DB:", user.password);
      const match = await bcrypt.compare(password, user.password);
      console.log("Password match?", match);
    }
  } catch (error) {
    console.error("MongoDB error:", error);
  } finally {
    await client.close();
  }
}

checkLogin();
