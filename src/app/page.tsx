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
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-border">
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
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            The Missing Link in Skill Development
          </h2>
          <p className="mt-4 text-lg text-slate-600">
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
                className="flex items-start gap-4 p-6 rounded-2xl bg-red-50/50 backdrop-blur-sm border border-red-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="p-3 rounded-xl bg-red-100/80 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-6 w-6 text-red-600" />
                </div>
                <p className="text-sm text-slate-900 leading-relaxed font-medium mt-1">{problem.text}</p>
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
    <section id="how-it-works" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-sm font-semibold text-india-green uppercase tracking-wider mb-3">How It Works</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            From Training to Livelihood
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            A complete longitudinal outcome tracking system that follows the trainee journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                className="relative p-8 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200 hover:border-primary/30 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-150 transition-all duration-500">
                  <Icon className="w-32 h-32 text-primary" />
                </div>
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:shadow-lg transition-all duration-300">
                    <Icon className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 rounded-full px-3 py-1 border border-slate-200">
                    Step {i + 1}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 relative z-10">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed relative z-10">{step.desc}</p>
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
    { icon: BarChart3, title: "Cohort & Provider Analytics", desc: "Compare providers, courses, districts and demographics with real outcome data.", color: "blue" },
    { icon: MapPin, title: "District Intelligence", desc: "Interactive Maharashtra map with district-level employment, retention, and skill gap data.", color: "emerald" },
    { icon: Target, title: "Skill Gap Engine", desc: "Compare skills taught vs. industry demand to identify curriculum gaps.", color: "saffron" },
    { icon: Brain, title: "AI Decision Support", desc: "Predict placement probability, attrition risk, and skill mismatch using ML models.", color: "purple" },
    { icon: Shield, title: "Privacy & Consent", desc: "Consent-based tracking with granular control over data sharing and follow-ups.", color: "rose" },
    { icon: Lightbulb, title: "Intervention Engine", desc: "Generate and track targeted interventions based on data-driven insights.", color: "amber" },
    { icon: Store, title: "Self-Employment Tracking", desc: "Track business creation, survival rates, and income progression.", color: "cyan" },
    { icon: Wrench, title: "Employer Verification", desc: "Multi-source employment verification with confidence scoring.", color: "slate" },
  ];

  const getColorClasses = (color: string) => {
    const map: Record<string, { bg: string, text: string, hoverBg: string, border: string }> = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-600', hoverBg: 'group-hover:bg-blue-500', border: 'hover:border-blue-200' },
      emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', hoverBg: 'group-hover:bg-emerald-500', border: 'hover:border-emerald-200' },
      saffron: { bg: 'bg-orange-50', text: 'text-orange-500', hoverBg: 'group-hover:bg-orange-500', border: 'hover:border-orange-200' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600', hoverBg: 'group-hover:bg-purple-500', border: 'hover:border-purple-200' },
      rose: { bg: 'bg-rose-50', text: 'text-rose-600', hoverBg: 'group-hover:bg-rose-500', border: 'hover:border-rose-200' },
      amber: { bg: 'bg-amber-50', text: 'text-amber-600', hoverBg: 'group-hover:bg-amber-500', border: 'hover:border-amber-200' },
      cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', hoverBg: 'group-hover:bg-cyan-500', border: 'hover:border-cyan-200' },
      slate: { bg: 'bg-slate-100', text: 'text-slate-700', hoverBg: 'group-hover:bg-slate-700', border: 'hover:border-slate-300' },
    };
    return map[color] || map.blue;
  };

  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-widest mb-4">
            Platform Features
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Impact Intelligence
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Powerful tools designed specifically for tracking longitudinal outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            const colors = getColorClasses(feature.color);
            
            return (
              <div
                key={i}
                className={`group relative p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden ${colors.border}`}
              >
                {/* Background Watermark */}
                <div className="absolute -bottom-6 -right-6 opacity-[0.03] group-hover:opacity-10 group-hover:scale-125 transition-all duration-500 transform rotate-12">
                  <Icon className="w-40 h-40 text-slate-900" />
                </div>
                
                {/* Subtle Gradient Overlay */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${colors.bg}`}></div>

                <div className="relative z-10">
                  <div className={`h-14 w-14 rounded-2xl ${colors.bg} flex items-center justify-center mb-6 shadow-sm ${colors.hoverBg} group-hover:shadow-lg transition-all duration-300`}>
                    <Icon className={`h-7 w-7 ${colors.text} group-hover:text-white transition-colors duration-300`} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">{feature.desc}</p>
                </div>
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
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-sm font-semibold text-saffron uppercase tracking-wider mb-3">Role-Based Ecosystem</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Every Stakeholder Connected
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {roles.map((role, i) => {
            const Icon = role.icon;
            return (
              <div key={i} className="p-5 rounded-xl bg-white border border-slate-200 text-center shadow-sm">
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center mx-auto mb-3", role.color)}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">{role.title}</h3>
                <p className="text-xs text-slate-600">{role.desc}</p>
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
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Privacy-Conscious by Design
              </h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
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
                    <span className="text-sm text-slate-900">{item}</span>
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
                    <span className="text-sm text-slate-900">{c.purpose}</span>
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

// ===== PROJECT CONTEXT SECTION =====
function ProjectContextSection() {
  return (
    <section className="py-20 bg-slate-50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-sm font-bold text-saffron tracking-wider uppercase mb-2">The Hackathon Challenge</h2>
            <h3 className="text-3xl font-bold text-slate-900 mb-6">Bridging the Gap Between Training and Livelihood</h3>
            <p className="text-slate-600 mb-4 leading-relaxed">
              Under the Smart India Hackathon 2026 (Problem Statement <strong>SIH26135</strong>), the Government of Maharashtra identified a critical challenge: while millions are trained under various state schemes, tracking their long-term career progression and employment retention remains a black box.
            </p>
            <p className="text-slate-600 mb-6 leading-relaxed">
              SkillTrack was built to solve this exact problem. By integrating machine learning for skill gap analysis and providing longitudinal tracking mechanisms, the platform ensures that training translates into sustainable, long-term employment.
            </p>
            <ul className="space-y-3">
              {[
                "Longitudinal Outcome Tracking (12+ Months)",
                "AI-Powered Skill Demand Forecasting",
                "Unified Dashboard for Government, Providers, & Employers",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-900 font-medium">
                  <div className="h-6 w-6 rounded-full bg-saffron/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-saffron" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-saffron/20 to-india-green/20 rounded-2xl blur-3xl" />
            <div className="relative bg-white border border-border p-8 rounded-2xl shadow-xl">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-slate-700" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Ministry of Skill Development</h4>
                  <p className="text-sm text-slate-500">Government of Maharashtra</p>
                </div>
              </div>
              <blockquote className="text-slate-700 italic">
                "Our goal is not just certification, but meaningful employment. We need a system that tracks candidates post-placement to understand true scheme efficacy."
              </blockquote>
              <div className="mt-6 pt-6 border-t border-border flex justify-between items-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Official SIH 2026 Submission</span>
                <span className="px-3 py-1 bg-saffron text-white text-xs font-bold rounded-full">Team Name</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== IMPACT METRICS SECTION =====
function ImpactMetricsSection() {
  const metrics = [
    { label: "Trainees Tracked", value: "1.2M+", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Active Courses", value: "850+", icon: GraduationCap, color: "text-saffron", bg: "bg-orange-100" },
    { label: "Training Providers", value: "320+", icon: Building2, color: "text-india-green", bg: "bg-green-100" },
    { label: "Placement Rate", value: "78%", icon: Target, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <section className="py-16 bg-white border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-slate-900">Platform Scale & Impact</h2>
          <p className="text-slate-500 mt-2">Simulated metrics demonstrating platform capacity</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {metrics.map((m, i) => (
            <div key={i} className="p-6 bg-slate-50 border border-border rounded-2xl text-center hover:shadow-md transition-shadow">
              <div className={`mx-auto h-12 w-12 rounded-full ${m.bg} flex items-center justify-center mb-4`}>
                <m.icon className={`h-6 w-6 ${m.color}`} />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{m.value}</div>
              <div className="text-sm font-medium text-slate-600">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== FOOTER =====
function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-saffron to-india-green flex items-center justify-center shadow-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white leading-tight">SkillTrack</h3>
                <p className="text-xs font-medium text-slate-300">Maharashtra</p>
              </div>
            </div>
            <p className="text-sm max-w-md leading-relaxed mb-6">
              A comprehensive Skilling Outcomes & Impact Intelligence Platform designed to monitor the longitudinal career progression of trainees post-certification. Built for the Smart India Hackathon 2026.
            </p>
            <div className="flex items-center gap-3 text-xs">
              <span className="px-2.5 py-1 bg-saffron text-white font-semibold rounded-md">SIH 2026</span>
              <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-md border border-slate-700">Problem: SIH26135</span>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#problem" className="hover:text-white transition-colors">The Problem</Link></li>
              <li><Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link></li>
              <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Dashboard Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal & Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Data Security</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact Support</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 SkillTrack Maharashtra. Open source submission for SIH 2026.</p>
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" /> Secure Data Storage</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> GDPR Compliant Design</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ===== MAIN LANDING PAGE =====
export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full relative">
      <LandingHeader />
      <main className="flex-1 w-full overflow-x-hidden">
        <HeroSection />
        <ImpactMetricsSection />
        <ProjectContextSection />
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
