"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input, Label } from "@/components/ui";
import { Target, ArrowLeft, Loader2, ShieldCheck, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { getUserSecurityQuestion, verifySecurityAnswer, resetPassword } from "@/actions/auth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState(false);
  
  // State
  const [email, setEmail] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await getUserSecurityQuestion(email);
    
    if (result.error) {
      toast.error(result.error);
    } else if (result.success && result.question) {
      setSecurityQuestion(result.question);
      setStep(2);
    }
    setLoading(false);
  };

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await verifySecurityAnswer(email, securityAnswer);
    
    if (result.error) {
      toast.error(result.error);
    } else if (result.success) {
      setStep(3);
    }
    setLoading(false);
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setLoading(true);
    const result = await resetPassword(email, newPassword);
    
    if (result.error) {
      toast.error(result.error);
    } else if (result.success) {
      toast.success("Password reset successfully!");
      setStep(4);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        
        <div className="flex justify-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Target className="h-7 w-7 text-white" />
          </div>
        </div>
        
        {step === 1 && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900">Forgot Password</h1>
              <p className="text-sm text-slate-500 mt-2">Enter your email to answer your security question.</p>
            </div>
            
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 focus:ring-primary/20" 
                />
              </div>
              <Button type="submit" className="w-full h-11" disabled={loading}>
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Continue"}
              </Button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900">Security Question</h1>
              <p className="text-sm text-slate-500 mt-2">Answer the security question you set during registration.</p>
            </div>
            
            <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg mb-6 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium text-amber-800 leading-relaxed">
                {securityQuestion}
              </p>
            </div>
            
            <form onSubmit={handleAnswerSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="answer">Your Answer</Label>
                <Input 
                  id="answer" 
                  required 
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  className="h-11 focus:ring-primary/20" 
                />
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" className="w-full h-11" onClick={() => setStep(1)} disabled={loading}>
                  Back
                </Button>
                <Button type="submit" className="w-full h-11" disabled={loading}>
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900">Reset Password</h1>
              <p className="text-sm text-slate-500 mt-2">Enter your new password below.</p>
            </div>
            
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input 
                  id="newPassword" 
                  type="password" 
                  required 
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-11 focus:ring-primary/20" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  required 
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-11 focus:ring-primary/20" 
                />
              </div>
              <Button type="submit" className="w-full h-11" disabled={loading}>
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Reset Password"}
              </Button>
            </form>
          </div>
        )}

        {step === 4 && (
          <div className="animate-fade-in text-center py-6">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Password Reset!</h1>
            <p className="text-sm text-slate-500 mb-8">You can now sign in with your new password.</p>
            <Link href="/login">
              <Button className="w-full h-11">Go to Login</Button>
            </Link>
          </div>
        )}

        {step === 1 && (
          <div className="mt-8 text-center text-sm">
            <Link href="/login" className="text-primary font-medium hover:underline inline-flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" /> Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
