"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input, Label } from "@/components/ui";
import { Target, ArrowRight, Eye, EyeOff, ShieldCheck, MapPin, Users, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { loginUser } from "@/actions/auth";
import { cn } from "@/lib/utils";

function LoginBackgroundCarousel() {
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
          alt={`Login Background ${index + 1}`}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000",
            index === currentIndex ? "opacity-30" : "opacity-0"
          )}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/60 via-slate-900/80 to-slate-950" />
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await loginUser(formData);
    
    setLoading(false);

    if (result?.error) {
      toast.error(result.error);
    } else if (result?.success) {
      toast.success("Welcome back!");
      
      // Route based on role
      switch (result.role) {
        case "government_admin":
        case "government_officer":
          router.push("/dashboard");
          break;
        case "trainee":
          router.push("/trainee/dashboard");
          break;
        case "training_provider":
          router.push("/provider/dashboard");
          break;
        case "employer":
          router.push("/employer/dashboard");
          break;
        default:
          router.push("/dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Left Column: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24">
        <div className="w-full max-w-md mx-auto space-y-8 animate-fade-in-up">
          {/* Header */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3 mb-8">
              <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <Target className="h-7 w-7 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-xl font-bold text-foreground">SkillTrack</h1>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Maharashtra</p>
              </div>
            </Link>
            <h2 className="text-3xl font-bold text-foreground tracking-tight">Sign in to your account</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Access the Skilling Outcomes & Impact Intelligence platform
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Work Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Link href="/forgot-password" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full h-11 text-base shadow-lg shadow-primary/20 mt-2 transition-transform active:scale-[0.98]">
              Sign In
            </Button>
          </form>

          {/* Sign up prompt */}
          <div className="text-center text-sm pt-4 border-t border-border/50">
            <span className="text-muted-foreground">Don&apos;t have an account? </span>
            <Link href="/register" className="font-semibold text-primary hover:text-primary/80 transition-colors">
              Request Access / Sign Up
            </Link>
          </div>
          
          <div className="text-center pt-8">
            <p className="text-xs text-muted-foreground/60 flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure Portal · Govt. of Maharashtra
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Dynamic Branding */}
      <div className="hidden lg:flex w-1/2 bg-slate-950 relative overflow-hidden items-center justify-center p-12">
        <LoginBackgroundCarousel />
        
        {/* Glassmorphic Content */}
        <div className="relative z-10 w-full max-w-lg">
          <div className="space-y-6">
            <div>
              <h3 className="text-3xl font-bold text-white mb-2 leading-tight">
                Empowering the future workforce of Maharashtra.
              </h3>
              <p className="text-slate-300 text-sm">
                Real-time longitudinal tracking of skilling outcomes, employment rates, and wage progression across 36 districts.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-white/[0.15] transition-colors">
                <Users className="h-6 w-6 text-emerald-400 mb-3" />
                <p className="text-2xl font-bold text-white">5.2M+</p>
                <p className="text-xs text-slate-300 uppercase tracking-wider font-medium mt-1">Trainees Tracked</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-white/[0.15] transition-colors">
                <TrendingUp className="h-6 w-6 text-amber-400 mb-3" />
                <p className="text-2xl font-bold text-white">82%</p>
                <p className="text-xs text-slate-300 uppercase tracking-wider font-medium mt-1">Placement Rate</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-white/[0.15] transition-colors col-span-2 flex items-center justify-between">
                <div>
                  <MapPin className="h-6 w-6 text-blue-400 mb-3" />
                  <p className="text-2xl font-bold text-white">36 Districts</p>
                  <p className="text-xs text-slate-300 uppercase tracking-wider font-medium mt-1">Statewide Integration</p>
                </div>
                <div className="h-16 w-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <Target className="h-8 w-8 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
