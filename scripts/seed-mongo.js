/* eslint-disable @typescript-eslint/no-require-imports */
const { MongoClient } = require('mongodb');
const crypto = require('crypto');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("Missing MONGODB_URI in .env.local");
  process.exit(1);
}

// Helper to generate consistent hex strings for MongoDB ObjectIds or just use them as strings
function hashString(str) {
  return crypto.createHash('md5').update(str).digest('hex').substring(0, 24);
}

async function seed() {
  console.log("🌱 Starting MongoDB Seed...");
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('skilltrack');

    // 1. Providers
    const providers = [
      { _id: hashString("prov-01"), name: "Maharashtra Skill Development Centre", district: "Pune" },
      { _id: hashString("prov-02"), name: "TechVoc Institute of Technology", district: "Mumbai" },
      { _id: hashString("prov-03"), name: "Rural Empowerment Skills Academy", district: "Nagpur" },
      { _id: hashString("prov-04"), name: "Future Workforce Training", district: "Nashik" },
      { _id: hashString("prov-05"), name: "Women in Tech Skills Program", district: "Aurangabad" }
    ];

    console.log("Inserting Providers...");
    const provCol = db.collection('providers');
    await provCol.deleteMany({});
    await provCol.insertMany(providers);

    // 2. Employers
    const employers = [
      { _id: hashString("emp-01"), company_name: "TechMaharashtra Solutions Pvt. Ltd.", industry: "IT" },
      { _id: hashString("emp-02"), company_name: "Global Auto Manufacturing", industry: "Manufacturing" },
      { _id: hashString("emp-03"), company_name: "Pune Health Services", industry: "Healthcare" },
      { _id: hashString("emp-04"), company_name: "Nashik Agro Tech", industry: "Agriculture" }
    ];

    console.log("Inserting Employers...");
    const empCol = db.collection('employers');
    await empCol.deleteMany({});
    await empCol.insertMany(employers);

    // 3. Trainees (Generate 100 for seed)
    const trainees = [];
    const employmentRecords = [];
    
    const statuses = ['enrolled', 'in-progress', 'completed', 'dropped'];
    const certStatuses = ['pending', 'passed', 'failed', 'not-attempted'];
    const employmentStatuses = ['employed', 'self-employed', 'apprentice', 'seeking', 'not-working'];

    for (let i = 1; i <= 100; i++) {
      const tId = hashString(`trainee-${i}`);
      const provId = providers[Math.floor(Math.random() * providers.length)]._id;
      const empStatus = employmentStatuses[Math.floor(Math.random() * employmentStatuses.length)];
      
      trainees.push({
        _id: tId,
        provider_id: provId,
        name: `Trainee ${i}`,
        trainee_id: `MH-SKILL-2026-${String(i).padStart(5, '0')}`,
        gender: Math.random() > 0.5 ? 'Male' : 'Female',
        district: providers.find(p => p._id === provId).district,
        course_name: "Full Stack Web Development",
        employment_status: empStatus,
        certification_status: certStatuses[Math.floor(Math.random() * certStatuses.length)],
        attendance_percentage: Math.floor(Math.random() * 40) + 60,
        assessment_score: Math.floor(Math.random() * 40) + 60,
      });

      if (empStatus === 'employed') {
        const empId = employers[Math.floor(Math.random() * employers.length)]._id;
        employmentRecords.push({
          trainee_id: tId,
          employer_id: empId,
          job_role: "Junior Developer",
          salary: Math.floor(Math.random() * 20000) + 15000,
          start_date: new Date().toISOString().split('T')[0],
          status: 'active',
          verification_status: 'verified'
        });
      }
    }

    console.log(`Inserting ${trainees.length} Trainees...`);
    const trCol = db.collection('trainees');
    await trCol.deleteMany({});
    await trCol.insertMany(trainees);

    console.log(`Inserting ${employmentRecords.length} Employment Records...`);
    const erCol = db.collection('employment_records');
    await erCol.deleteMany({});
    if (employmentRecords.length > 0) {
      await erCol.insertMany(employmentRecords);
    }

    console.log("✅ MongoDB Seeding Complete!");
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    await client.close();
  }
}

seed().catch(console.error);
