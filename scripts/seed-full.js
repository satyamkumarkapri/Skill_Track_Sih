const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

const URI = "mongodb+srv://2500031975cse1_db_user:root@cluster0.t1vsudk.mongodb.net/skilltrack?retryWrites=true&w=majority";

const COURSES_PER_PROVIDER = [
  { title: "Full Stack Web Development", sector: "IT & Software", durationWeeks: 16, targetSkills: ["React", "Node.js", "MongoDB", "HTML/CSS"] },
  { title: "Data Science & ML", sector: "IT & Software", durationWeeks: 20, targetSkills: ["Python", "Pandas", "Scikit-learn", "Data Visualization"] },
  { title: "Cloud Computing (AWS)", sector: "IT & Software", durationWeeks: 12, targetSkills: ["AWS", "Docker", "CI/CD", "Linux"] },
  { title: "Mobile App Development", sector: "IT & Software", durationWeeks: 14, targetSkills: ["React Native", "Flutter", "Firebase"] },
  { title: "Cybersecurity Fundamentals", sector: "IT & Software", durationWeeks: 10, targetSkills: ["Network Security", "Ethical Hacking", "SIEM"] },
];

const MAHARASHTRA_DISTRICTS = ["Pune", "Mumbai", "Nagpur", "Nashik", "Aurangabad", "Thane", "Kolhapur", "Solapur"];
const EMPLOYMENT_STATUSES = ["Employed", "Self-Employed", "Apprenticeship", "Seeking Employment", "Not Working"];
const STATUS_WEIGHTS = [0.45, 0.15, 0.10, 0.20, 0.10];
const ENROLLMENT_STATUSES = ["Completed", "In Progress", "Enrolled", "Dropped Out"];

function weightedRandom(items, weights) {
  const r = Math.random();
  let cumulative = 0;
  for (let i = 0; i < items.length; i++) {
    cumulative += weights[i];
    if (r < cumulative) return items[i];
  }
  return items[items.length - 1];
}

function randomSalary(outcome) {
  if (outcome === "Employed") return Math.floor(Math.random() * 25000) + 15000;
  if (outcome === "Self-Employed") return Math.floor(Math.random() * 20000) + 10000;
  if (outcome === "Apprenticeship") return Math.floor(Math.random() * 8000) + 8000;
  return 0;
}

const TRAINEE_NAMES = [
  "Aditya Sharma", "Priya Patel", "Rahul Desai", "Sneha Kulkarni", "Amit Joshi",
  "Pooja Shinde", "Vikas Patil", "Anita Yadav", "Suresh Nair", "Deepa Jadhav",
  "Rohan Mehta", "Kavita More", "Sanjay Bhosale", "Meera Gaikwad", "Nikhil Sawant",
  "Sunita Pawar", "Manoj Deshpande", "Riya Chavan", "Akash Lokhande", "Swati Thorat",
  "Vishal Kale", "Neha Bane", "Kiran Mane", "Poonam Naik", "Sachin Wagh",
  "Aparna Kadam", "Devendra Salve", "Pallavi Shirke", "Tushar Dalvi", "Shruti Ghatge",
  "Ganesh Kamble", "Lata Thakare", "Omkar Patne", "Shobha Misal", "Sandeep Londhe",
  "Komal Petkar", "Nilesh Randive", "Yogita Sabne", "Rajesh Waghmare", "Smita Ingale",
];

async function seed() {
  const client = new MongoClient(URI);
  await client.connect();
  console.log("✅ Connected to MongoDB");
  const db = client.db("skilltrack");

  // ── 1. Fetch existing providers ──
  const providers = await db.collection("users").find({ role: "training_provider" }).toArray();
  console.log(`Found ${providers.length} provider(s)`);

  if (providers.length === 0) {
    console.log("⚠️  No providers found. Creating a sample provider...");
    const hashed = await bcrypt.hash("Provider@2026", 10);
    const res = await db.collection("users").insertOne({
      name: "Maharashtra Skill Institute",
      email: "msi@skilltrack.gov.in",
      role: "training_provider",
      password: hashed,
      createdAt: new Date(),
      onboardingCompleted: true,
      organization: "Maharashtra Skill Institute",
    });
    providers.push({ _id: res.insertedId, name: "Maharashtra Skill Institute", email: "msi@skilltrack.gov.in" });
  }

  // ── 2. Add courses for each provider ──
  console.log("\n📚 Adding courses for each provider...");
  const courseIdMap = [];
  for (const provider of providers) {
    const pid = provider._id.toString();
    // Remove old courses for this provider (so we don't duplicate)
    await db.collection("courses").deleteMany({ providerId: pid });

    for (const courseTpl of COURSES_PER_PROVIDER) {
      const result = await db.collection("courses").insertOne({
        providerId: pid,
        providerName: provider.name,
        providerEmail: provider.email,
        ...courseTpl,
        enrolledTrainees: 0,
        isActive: true,
        createdAt: new Date(),
      });
      courseIdMap.push({ courseId: result.insertedId.toString(), providerId: pid, providerName: provider.name, title: courseTpl.title });
      console.log(`  ✔ [${provider.name}] → ${courseTpl.title}`);
    }
  }

  // ── 3. Add sample trainees & enrollments ──
  console.log("\n👤 Adding sample trainees with enrollments...");
  // First delete all old seeded trainees (keep real ones)
  await db.collection("enrollments").deleteMany({ isSeeded: true });

  // Keep existing real trainees, just add more seeded ones
  const existingTrainees = await db.collection("users").find({ role: "trainee" }).toArray();
  const existingCount = existingTrainees.length;

  const targetCount = 30; // add up to 30 seeded trainees
  const toAdd = Math.max(0, targetCount - existingCount);
  const newTraineeIds = [];

  for (let i = 0; i < toAdd; i++) {
    const name = TRAINEE_NAMES[i % TRAINEE_NAMES.length];
    const email = `trainee${Date.now()}_${i}@skilltrack.in`;
    const hashed = await bcrypt.hash("Trainee@2026", 10);
    const res = await db.collection("users").insertOne({
      name,
      email,
      role: "trainee",
      password: hashed,
      createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000),
      onboardingCompleted: true,
      isSeeded: true,
      onboardingData: {
        district: MAHARASHTRA_DISTRICTS[i % MAHARASHTRA_DISTRICTS.length],
        education: "12th Pass",
        aadhaar: `XXXX-XXXX-${String(1000 + i).padStart(4, "0")}`,
      },
    });
    newTraineeIds.push({ id: res.insertedId.toString(), name });
  }
  console.log(`  ✔ Added ${toAdd} sample trainees (total: ${existingCount + toAdd})`);

  // ── 4. Enroll trainees in courses ──
  console.log("\n📋 Creating enrollments...");
  const allTrainees = await db.collection("users").find({ role: "trainee" }).toArray();

  let enrollCount = 0;
  for (const trainee of allTrainees) {
    // Pick a random course
    const course = courseIdMap[Math.floor(Math.random() * courseIdMap.length)];
    const outcome = weightedRandom(EMPLOYMENT_STATUSES, STATUS_WEIGHTS);
    const enrollStatus = ["Employed","Self-Employed","Apprenticeship","Not Working"].includes(outcome) ? "Completed" :
                         outcome === "Seeking Employment" ? "In Progress" : "Enrolled";
    const salary = randomSalary(outcome);
    const district = trainee.onboardingData?.district || MAHARASHTRA_DISTRICTS[Math.floor(Math.random() * MAHARASHTRA_DISTRICTS.length)];

    // Check if already enrolled in this course
    const existing = await db.collection("enrollments").findOne({ traineeId: trainee._id.toString(), courseId: course.courseId });
    if (!existing) {
      await db.collection("enrollments").insertOne({
        traineeId: trainee._id.toString(),
        traineeName: trainee.name,
        courseId: course.courseId,
        courseTitle: course.title,
        providerId: course.providerId,
        providerName: course.providerName,
        enrollmentDate: new Date(Date.now() - Math.random() * 120 * 24 * 60 * 60 * 1000),
        status: enrollStatus,
        outcome: enrollStatus === "Completed" ? outcome : null,
        salary: enrollStatus === "Completed" ? salary : 0,
        employerName: outcome === "Employed" ? "TechMaharashtra Pvt. Ltd." : null,
        jobRole: outcome === "Employed" ? course.title.replace("Development", "Developer") : null,
        district,
        verificationStatus: enrollStatus === "Completed" ? "verified" : "pending",
        confidenceScore: Math.floor(Math.random() * 30) + 65,
        isSeeded: true,
      });
      enrollCount++;

      // Update enrolledTrainees count on the course
      await db.collection("courses").updateOne(
        { _id: new ObjectId(course.courseId) },
        { $inc: { enrolledTrainees: 1 } }
      );
    }
  }
  console.log(`  ✔ Created ${enrollCount} enrollments`);

  // ── 5. Final stats ──
  const [tc, cc, ec] = await Promise.all([
    db.collection("users").countDocuments({ role: "trainee" }),
    db.collection("courses").countDocuments(),
    db.collection("enrollments").countDocuments(),
  ]);

  console.log("\n========================================");
  console.log("🎉 SEED COMPLETE!");
  console.log(`   Trainees:    ${tc}`);
  console.log(`   Courses:     ${cc}`);
  console.log(`   Enrollments: ${ec}`);
  console.log("========================================\n");

  await client.close();
}

seed().catch(console.error);
