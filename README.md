# SkillTrack Maharashtra — Skilling Outcomes & Impact Intelligence Platform

**Smart India Hackathon (SIH) 2026 Submission**  
**Problem Statement ID:** 26135  
**Theme:** Smart Education, Skilling & Skill-Employment Matchmaking  

---

## 📌 Project Overview
SkillTrack Maharashtra is a comprehensive, full-stack intelligence platform built for the Government of Maharashtra to trace the longitudinal journey of skill-development trainees—from enrollment and certification, all the way through to employment, placement retention, and career progression. 

The platform moves away from static, fragmented Excel sheets and implements a unified, data-driven approach. It intelligently aggregates historical job market data, real-time trainee self-reported statuses, and training provider inputs to provide a holistic view of the state's skilling ecosystem.

## 🚀 Key Features

### 1. Data-Driven Government Analytics Dashboard
- **Dynamic Skill Gap Analysis**: A Machine Learning-inspired algorithm that parses historical job market CSV datasets to calculate real-world skill demand vs. our actual trainee supply.
- **Employment Trends**: Live MongoDB aggregations showing employment outcomes (Employed, Seeking, Self-Employed, Apprenticeships) across the platform.
- **Salary Progression Engine**: Calculates average salary growth over 24 months based on real trainee-reported incomes.
- **Provider & Course Intelligence**: Ranks courses and training providers by successful placement rates.

### 2. Trainee Self-Service Portal
- **Employment History Logging**: Trainees can log their current active jobs, and crucially, they can log when they *leave* a job (including the reason). This builds a permanent, immutable career timeline.
- **Certifications Wallet**: Trainees can upload and manage their verified credentials.
- **Follow-Up System**: Trainees can proactively report their status to the government (e.g., "Actively Interviewing" or "Relocated") through custom follow-up forms.
- **Feedback Loop**: Trainees can rate their courses and instructors, providing qualitative data to the government.

### 3. Universal Shared Profile (Full-Stack Visibility)
- We developed a unified, premium profile view (`/profile/[id]`) that utilizes a beautiful Saffron/Green gradient glassmorphism aesthetic.
- **One Source of Truth**: Admins, Training Providers, and Employers all access this same secure public profile to view a trainee's current job, historical work timeline, acquired skills, and credentials. 
- **Privacy Controls**: Trainees have a dedicated Consent page to manage who can view their data.

### 4. Robust Authentication & Recovery
- Secure multi-role login system (Admin, Provider, Employer, Trainee).
- Built-in Password Recovery utilizing encrypted Security Questions/Answers stored securely in MongoDB.

---

## 🛠️ Technology Stack
- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Lucide Icons
- **Backend**: Next.js Server Actions & API Routes (Node.js)
- **Database**: MongoDB (Mongoose/Native Driver)
- **Data Parsing**: Native Node.js `fs` & regex for rapid CSV processing
- **Styling**: Custom CSS variables, Radix UI primitives, Recharts for data visualization

---

## 📁 Database Architecture (MongoDB)
The platform utilizes a NoSQL architecture for maximum flexibility:
- **`users`**: Stores authentication, role (admin/trainee/provider), security questions, and nested full-stack trainee data (`employmentData`, `employmentHistory[]`, `certificates[]`, `followUps[]`).
- **`courses`**: Details of skilling programs, duration, and provider references.
- **`enrollments`**: The connective tissue linking a Trainee to a Course. Stores outcome data (Employed/Seeking) which powers the global analytics.

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local instance or MongoDB Atlas URI)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/satyamkumarkapri/Skill_Track_Sih.git
   cd Skill_Track_Sih
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env.local` file in the root directory and add your MongoDB connection string:
   ```env
   MONGODB_URI="mongodb+srv://<username>:<password>@cluster.mongodb.net/skilltrack"
   ```

4. Seed the Database:
   We have provided a robust seeding script that populates the database with realistic Maharashtra districts, mock courses, and hundreds of enrollments to immediately power the analytics engine.
   ```bash
   node scripts/seed.js
   ```

5. Run the Application:
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:3000` in your browser.

---

## 🔐 Demo Credentials
To explore the different portals, you can use the following pre-configured credentials:

**Government Admin:**
- Email: `admin@skilltrack.gov.in`
- Password: `Admin@2026`

**Training Provider:**
- Email: `techinst@skilltrack.gov.in`
- Password: `Provider@2026`

**Trainee (Example):**
- Email: `trainee1@example.com` (Note: You can register a new Trainee account on the platform to test the full self-service flow!)
- Password: `Password123`

---

## 🎨 UI/UX Philosophy
The platform is designed with a premium, engaging aesthetic to encourage high adoption rates among trainees and professionals. It heavily utilizes the Indian tricolor (Saffron, White, India Green) mapped to modern, accessible UI tokens, smooth micro-animations, and responsive glassmorphic cards to create a "wow" factor suitable for a national-level government dashboard.

---

*Developed with passion for Smart India Hackathon 2026.*
