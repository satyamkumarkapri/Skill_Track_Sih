"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Target,
  ArrowRight,
  BarChart3,
  Shield,
  Users,
  Briefcase,
  MapPin,
  Brain,
  CheckCircle2,
  Building2,
  GraduationCap,
  IndianRupee,
  Wrench,
  Clock,
  Store,
  ChevronRight,
  ExternalLink,
  TrendingUp,
  Lightbulb,
  Eye,
  Lock,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DemoBadge } from "@/components/ui";
import { toast } from "sonner";

// ===== LANDING HEADER =====
function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
            <Target className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-base font-bold text-foreground">SkillTrack Maharashtra</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="#problem" className="text-sm text-muted-foreground hover:text-foreground transition-colors">The Problem</Link>
          <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</Link>
          <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link>
          <Link href="#privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
        </nav>

        <div className="flex items-center gap-3">
          <DemoBadge />
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center gap-1.5 h-9 px-4 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            Login
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}

// ===== HERO BACKGROUND CAROUSEL =====
function HeroBackgroundCarousel() {
  const images = [
    "/images/slide1.jpg",
    "/images/slide2.jpg",
    "/images/slide3.jpg"
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); 
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="absolute inset-0 z-0">
      {images.map((src, index) => (
        <img
          key={src}
          src={src}
          alt={`SkillTrack Background ${index + 1}`}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000",
            index === currentIndex ? "opacity-100" : "opacity-0"
          )}
        />
      ))}
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/60 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      
      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-300",
              index === currentIndex ? "bg-white w-8 shadow-[0_0_10px_rgba(255,255,255,0.8)]" : "bg-white/50 hover:bg-white/80"
            )}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}

// ===== HERO SECTION =====
function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#0f172a] text-white min-h-[600px] flex flex-col justify-center border-b border-border/10">
      
      <HeroBackgroundCarousel />

      <div className="relative max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 z-10 flex flex-col">
        
        {/* Left text content */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 text-sm border border-white/20 shadow-lg">
            <span className="h-2 w-2 rounded-full bg-saffron" />
            Smart India Hackathon 2026 — SIH26135
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight drop-shadow-lg">
            Track Skills.{" "}
            <span className="text-saffron">Measure</span>{" "}
            Livelihoods.{" "}
            <span className="text-india-green">Improve</span>{" "}
            Outcomes.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-white/90 leading-relaxed max-w-2xl drop-shadow-md">
            SkillTrack Maharashtra connects training, employment and long-term livelihood outcomes
            to help decision-makers understand what happens after certification.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-saffron text-white font-semibold rounded-lg hover:bg-saffron/90 transition-colors shadow-lg shadow-saffron/20"
            >
              Explore Demo Dashboard
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-white/10 backdrop-blur-sm text-white font-medium rounded-lg hover:bg-white/20 transition-colors border border-white/20"
            >
              How It Works
            </Link>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16 pt-8 border-t border-white/20">
            {[
              { label: "Trainees Tracked", value: "1,25,430" },
              { label: "Employment Rate", value: "72.4%" },
              { label: "6-Month Retention", value: "68.2%" },
              { label: "Districts Covered", value: "34" },
            ].map((stat) => (
              <div key={stat.label} className="drop-shadow-md">
                <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-white/70 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== PROBLEM SECTION =====
function ProblemSection() {
  const problems = [
    { icon: Users, text: "High post-certification attrition rates due to lack of continuous engagement and tracking." },
    { icon: Building2, text: "Mismatch between current curriculum and dynamic industry demands (The Skill Gap)." },
    { icon: Brain, text: "Absence of predictive AI insights to forecast trainee placement probability." },
    { icon: Eye, text: "Inability to track longitudinal wage progression and true livelihood impact over time." },
  ];

  return (
    <section id="problem" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-sm font-semibold text-saffron uppercase tracking-wider mb-3">The Problem</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            The Missing Link in Skill Development
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Current systems capture enrolment and certification, but fail to provide predictive insights, 
            track long-term employment, or measure true livelihood outcomes over time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {problems.map((problem, i) => {
            const Icon = problem.icon;
            return (
              <div
                key={i}
                className="flex items-start gap-4 p-6 rounded-xl bg-red-50/50 border border-red-100 hover:shadow-sm transition-all"
              >
                <div className="p-2 rounded-lg bg-red-100 flex-shrink-0">
                  <Icon className="h-5 w-5 text-red-600" />
                </div>
                <p className="text-sm text-foreground leading-relaxed font-medium">{problem.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ===== HOW IT WORKS =====
function HowItWorksSection() {
  const steps = [
    { icon: GraduationCap, title: "Trainee Registration & Enrolment", desc: "Trainees create live profiles and enroll in active courses securely backed by MongoDB." },
    { icon: Briefcase, title: "Real-Time Tracking by Providers", desc: "Training providers use dedicated dashboards to track completion and update employment outcomes." },
    { icon: Brain, title: "AI-Powered Skill Gap Analysis", desc: "ML models analyze historical job market data to identify in-demand skills and predict placement probability." },
    { icon: TrendingUp, title: "Longitudinal Outcome Tracking", desc: "The platform actively monitors post-certification placement, wage progression, and retention." },
    { icon: Users, title: "Dynamic Career Dashboards", desc: "Trainees manage their education, demographics, and track active course progress in one place." },
    { icon: Lightbulb, title: "Evidence-Based Policy Interventions", desc: "Government admins receive actionable insights to trigger targeted bridge interventions based on ML forecasting." },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-sm font-semibold text-india-green uppercase tracking-wider mb-3">How It Works</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            From Training to Livelihood
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A complete longitudinal outcome tracking system that follows the trainee journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                className="relative p-6 rounded-xl bg-card border border-border hover:border-primary/20 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-xs font-bold text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                    Step {i + 1}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ===== KEY FEATURES =====
function FeaturesSection() {
  const features = [
    { icon: BarChart3, title: "Cohort & Provider Analytics", desc: "Compare providers, courses, districts and demographics with real outcome data." },
    { icon: MapPin, title: "District Intelligence", desc: "Interactive Maharashtra map with district-level employment, retention, and skill gap data." },
    { icon: Target, title: "Skill Gap Engine", desc: "Compare skills taught vs. industry demand to identify curriculum gaps." },
    { icon: Brain, title: "AI Decision Support", desc: "Predict placement probability, attrition risk, and skill mismatch using ML models." },
    { icon: Shield, title: "Privacy & Consent", desc: "Consent-based tracking with granular control over data sharing and follow-ups." },
    { icon: Lightbulb, title: "Intervention Engine", desc: "Generate and track targeted interventions based on data-driven insights." },
    { icon: Store, title: "Self-Employment Tracking", desc: "Track business creation, survival rates, and income progression." },
    { icon: Wrench, title: "Employer Verification", desc: "Multi-source employment verification with confidence scoring." },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Platform Features</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Comprehensive Impact Intelligence
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div key={i} className="p-5 rounded-xl border border-border hover:border-primary/20 hover:shadow-sm transition-all">
                <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1.5">{feat.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ===== ROLES SECTION =====
function RolesSection() {
  const roles = [
    { icon: Shield, title: "Government Admin", desc: "Full platform access, policy design, resource allocation", color: "bg-primary/5 text-primary" },
    { icon: BarChart3, title: "Government Officer", desc: "Dashboard analytics, interventions, district management", color: "bg-blue-50 text-blue-700" },
    { icon: GraduationCap, title: "Training Provider", desc: "Manage trainees, courses, track outcomes", color: "bg-purple-50 text-purple-700" },
    { icon: Building2, title: "Employer", desc: "Verify employment, update records, post openings", color: "bg-amber-50 text-amber-700" },
    { icon: Users, title: "Trainee", desc: "View profile, manage consent, provide feedback", color: "bg-emerald-50 text-emerald-700" },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-sm font-semibold text-saffron uppercase tracking-wider mb-3">Role-Based Ecosystem</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Every Stakeholder Connected
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {roles.map((role, i) => {
            const Icon = role.icon;
            return (
              <div key={i} className="p-5 rounded-xl bg-card border border-border text-center">
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center mx-auto mb-3", role.color)}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">{role.title}</h3>
                <p className="text-xs text-muted-foreground">{role.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ===== PRIVACY SECTION =====
function PrivacySection() {
  const [consents, setConsents] = useState([
    { purpose: "Employment Tracking", granted: true },
    { purpose: "Follow-up Communication", granted: true },
    { purpose: "Analytics Usage", granted: true },
    { purpose: "Employer Verification", granted: true },
    { purpose: "Data Sharing", granted: false },
  ]);

  const toggleConsent = (index: number) => {
    const newConsents = [...consents];
    newConsents[index].granted = !newConsents[index].granted;
    setConsents(newConsents);
    
    if (newConsents[index].granted) {
      toast.success(`${newConsents[index].purpose} access granted.`);
    } else {
      toast.info(`${newConsents[index].purpose} access withdrawn.`);
    }
  };

  return (
    <section id="privacy" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <p className="text-sm font-semibold text-india-green uppercase tracking-wider mb-3">Privacy & Consent</p>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Privacy-Conscious by Design
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                SkillTrack is built with a consent-first approach. Every trainee has full control over
                their data, with granular consent for each tracking purpose.
              </p>
              <div className="space-y-3">
                {[
                  "Explicit consent required for each tracking purpose",
                  "Consent can be withdrawn at any time",
                  "Minimum cohort thresholds for demographic analytics",
                  "No sensitive individual data in aggregate reports",
                  "Row-level security on all database tables",
                  "Audit logs for all data access and changes",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-india-green flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 max-w-sm">
              <div className="bg-background rounded-2xl border border-border p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <Lock className="h-5 w-5 text-primary" />
                  <span className="text-sm font-semibold">Consent Dashboard</span>
                </div>
                {consents.map((c, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                    <span className="text-sm text-foreground">{c.purpose}</span>
                    <div 
                      onClick={() => toggleConsent(i)}
                      className={cn(
                        "h-6 w-11 rounded-full relative transition-colors cursor-pointer",
                        c.granted ? "bg-india-green" : "bg-muted"
                      )}
                    >
                      <div className={cn(
                        "h-5 w-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all",
                        c.granted ? "left-5" : "left-0.5"
                      )} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== CTA SECTION =====
function CTASection() {
  return (
    <section className="py-20 bg-[#0f172a] text-white border-t border-white/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Join the SkillTrack Network
        </h2>
        <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
          Register or log in to manage your skilling journey, verify employment, and track outcomes on the official portal.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-saffron text-white font-semibold rounded-lg hover:bg-saffron/90 transition-colors shadow-lg shadow-saffron/20"
          >
            Login to Dashboard
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/login?tab=register"
            className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors border border-white/20"
          >
            Register Now
          </Link>
        </div>
      </div>
    </section>
  );
}

// ===== FOOTER =====
function Footer() {
  return (
    <footer className="bg-[hsl(222,47%,10%)] text-white/60 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Target className="h-4 w-4 text-white/60" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/80">SkillTrack Maharashtra</p>
              <p className="text-xs text-white/40">Skilling Outcomes & Impact Intelligence Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="demo-badge">SIH 2026 Initiative</span>
            <span>Problem Statement: SIH26135</span>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-white/10 text-center text-xs text-white/30">
          This platform is built for Smart India Hackathon 2026. Data is securely managed and tracked in real-time.
        </div>
      </div>
    </footer>
  );
}

// ===== MAIN LANDING PAGE =====
export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      <main className="flex-1">
        <HeroSection />
        <ProblemSection />
        <HowItWorksSection />
        <FeaturesSection />
        <RolesSection />
        <PrivacySection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
