"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input, Label, Select } from "@/components/ui";
import { Target, ArrowRight, Eye, EyeOff, ShieldCheck, MapPin, Users, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { registerUser } from "@/actions/auth";
import { cn } from "@/lib/utils";

function RegisterBackgroundCarousel() {
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
          alt={`Register Background ${index + 1}`}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000",
            index === currentIndex ? "opacity-30" : "opacity-0"
          )}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-indigo-950/80 to-primary/60" />
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await registerUser(formData);

    setLoading(false);

    if (result?.error) {
      toast.error(result.error);
    } else if (result?.success) {
      toast.success("Account created successfully! You can now sign in.");
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-background flex-row-reverse">
      {/* Right Column (Now on Left visually due to flex-row-reverse): Sign Up Form */}
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
            <h2 className="text-3xl font-bold text-foreground tracking-tight">Create an account</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Join the unified skilling intelligence platform
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                <Input id="firstName" name="firstName" placeholder="John" required className="h-11 focus:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                <Input id="lastName" name="lastName" placeholder="Doe" required className="h-11 focus:ring-primary/20" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="securityQuestion" className="text-sm font-medium">Security Question (For Password Recovery)</Label>
              <select 
                id="securityQuestion" 
                name="securityQuestion" 
                required 
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus:ring-primary/20"
              >
                <option value="">Select a security question</option>
                <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
                <option value="What city were you born in?">What city were you born in?</option>
                <option value="What is the name of your first pet?">What is the name of your first pet?</option>
                <option value="What was the name of your elementary school?">What was the name of your elementary school?</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="securityAnswer" className="text-sm font-medium">Security Answer</Label>
              <Input id="securityAnswer" name="securityAnswer" required className="h-11 focus:ring-primary/20" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium">Account Role</Label>
              <Select id="role" name="role" required className="h-11 focus:ring-primary/20" defaultValue="">
                <option value="" disabled>Select your organizational role</option>
                <option value="government_officer">Government Officer / Admin</option>
                <option value="training_provider">Training Provider</option>
                <option value="employer">Employer / HR</option>
                <option value="trainee">Trainee / Student</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Work Email</Label>
              <Input id="email" name="email" type="email" placeholder="your.email@example.com" required className="h-11 focus:ring-primary/20" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Create Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 8 characters"
                  required
                  className="h-11 focus:ring-primary/20"
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

            <Button type="submit" loading={loading} className="w-full h-11 text-base shadow-lg shadow-primary/20 mt-4 transition-transform active:scale-[0.98]">
              Create Account
            </Button>
          </form>

          {/* Login prompt */}
          <div className="text-center text-sm pt-4 border-t border-border/50">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
              Sign In
            </Link>
          </div>
          
          <div className="text-center pt-4">
            <p className="text-xs text-muted-foreground/60 flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure Portal · Govt. of Maharashtra
            </p>
          </div>
        </div>
      </div>

      {/* Left Column (Now on Right visually): Dynamic Branding */}
      <div className="hidden lg:flex w-1/2 bg-slate-950 relative overflow-hidden items-center justify-center p-12">
        <RegisterBackgroundCarousel />
        
        {/* Glassmorphic Content */}
        <div className="relative z-10 w-full max-w-lg">
          <div className="space-y-6">
            <div>
              <h3 className="text-3xl font-bold text-white mb-2 leading-tight">
                Join the skilling revolution.
              </h3>
              <p className="text-slate-300 text-sm">
                SkillTrack brings transparency, accountability, and AI-driven intelligence to every stakeholder in the Maharashtra skilling ecosystem.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4 mt-8">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Statewide Visibility</h4>
                  <p className="text-slate-400 text-xs mt-0.5">Track outcomes across all 36 districts instantly.</p>
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors">
                <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Longitudinal Tracking</h4>
                  <p className="text-slate-400 text-xs mt-0.5">Monitor post-placement retention and wage growth.</p>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors">
                <div className="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Verified Credentials</h4>
                  <p className="text-slate-400 text-xs mt-0.5">Automated validation of Aadhaar, PF, and employment data.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
