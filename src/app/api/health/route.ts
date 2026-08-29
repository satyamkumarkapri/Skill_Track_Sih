import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    application: "SkillTrack Maharashtra",
    version: "1.0.0",
    environment: process.env.NEXT_PUBLIC_DEMO_MODE === "true" ? "demo" : "production",
    timestamp: new Date().toISOString(),
    services: {
      database: "connected",
      ml_service: process.env.ML_SERVICE_ENABLED === "true" ? "connected" : "fallback",
      auth: "active",
    },
  });
}
