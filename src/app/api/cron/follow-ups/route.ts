import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    // 1. Verify Authorization (Cron Secret)
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      // For local development testing, we can allow bypass if CRON_SECRET isn't strictly enforced
      if (process.env.NODE_ENV === "production") {
        return new NextResponse("Unauthorized", { status: 401 });
      }
    }

    const supabase = await createClient();

    // 2. Fetch trainees who were placed exactly 30, 90, 180, or 365 days ago
    // In a real database, we would query:
    // SELECT * FROM employment_records WHERE status = 'active' AND start_date = CURRENT_DATE - INTERVAL '30 days'
    
    // For this prototype, we simulate fetching eligible records from the db:
    const { data: employmentRecords, error } = await supabase
      .from("employment_records")
      .select("*, trainees(*)")
      .eq("status", "active")
      .limit(5); // limit for demo

    if (error) {
      console.error("Database query error:", error);
      // Fallback to simulation if DB isn't seeded yet
    }

    // 3. Simulate triggering external API (Twilio / WhatsApp Business)
    const notificationsSent = [];
    const simulatedTrainees = employmentRecords?.length ? employmentRecords : [
      { trainees: { name: "Ravi Patil", phone: "+91 9876543210" }, job_role: "Data Analyst", start_date: "2024-01-15" }
    ];

    for (const record of simulatedTrainees) {
      const traineeName = record.trainees?.name;
      const message = `Hello ${traineeName}, it's been a while since you joined as a ${record.job_role}. SkillTrack Maharashtra would like to check in on your progress! Please reply with 1 if you are still working here, or 2 if you have left.`;
      
      // MOCK: await twilio.messages.create({ to: record.trainees.phone, body: message })
      notificationsSent.push({
        trainee: traineeName,
        message,
        status: "sent (simulated)"
      });
      
      // Also log this in the database follow-ups table or system_logs
      if (!error && record.id) {
        await supabase.from("system_logs").insert({
          action: "automated_follow_up",
          metadata: { trainee_id: record.trainees?.id, message_type: "30_day_checkin" }
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Triggered ${notificationsSent.length} automated follow-up messages.`,
      data: notificationsSent
    });

  } catch (err: any) {
    console.error("Cron Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
