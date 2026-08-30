"use client";

import React, { useState, useEffect } from "react";
import {
  Card, CardHeader, CardTitle, CardContent,
  Button, Input, Label, Select,
} from "@/components/ui";
import {
  Settings, User, Bell, Shield, Database, Palette,
  CheckCircle2, Sun, Moon, Monitor, Save, Key, Lock,
  Eye, EyeOff, Info, AlertTriangle, ChevronRight,
} from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { changePassword, getSessionAction, updateProfileAction } from "@/actions/auth";

export default function SettingsPage() {
  const { setTheme, theme } = useTheme();
  const [showOldPw, setShowOldPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  const [profile, setProfile] = useState({
    name: "", email: "", role: "", aadhaar: "", education: ""
  });

  useEffect(() => {
    fetch("/api/auth/profile")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.user) {
          setProfile({
            name: data.user.name || "",
            email: data.user.email || "",
            role: data.user.role || "",
            aadhaar: data.user.onboardingData?.aadhaar || "",
            education: data.user.onboardingData?.education || "",
          });
        }
      })
      .catch(() => {
        getSessionAction().then(session => {
          if (session) setProfile(p => ({ ...p, name: session.name || "", email: session.email || "", role: session.role || "" }));
        });
      });
  }, []);

  const [retention, setRetention] = useState("3y");
  const [cohort, setCohort] = useState("30");
  const [notifications, setNotifications] = useState([
    { id: "n1", label: "Follow-up due reminders", desc: "Get notified when a trainee follow-up is overdue", enabled: true, icon: Bell },
    { id: "n2", label: "Verification pending alerts", desc: "Alert when employment records need verification", enabled: true, icon: AlertTriangle },
    { id: "n3", label: "Intervention recommendations", desc: "AI-generated suggestions for at-risk trainees", enabled: true, icon: Info },
    { id: "n4", label: "Monthly report generation", desc: "Auto-generate and send monthly analytics reports", enabled: false, icon: Database },
    { id: "n5", label: "Consent change notifications", desc: "Notify when a trainee updates their consent", enabled: true, icon: Shield },
  ]);

  const toggleNotification = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, enabled: !n.enabled } : n));
    toast.success("Preference saved");
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    const formData = new FormData();
    formData.append("name", profile.name);
    if (profile.role === "trainee") {
      formData.append("aadhaar", profile.aadhaar);
      formData.append("education", profile.education);
    }
    const result = await updateProfileAction(formData);
    setSavingProfile(false);
    result?.error ? toast.error(result.error) : toast.success("Profile updated!");
  };

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (formData.get("newPassword") !== formData.get("confirmPassword")) {
      toast.error("Passwords do not match");
      return;
    }
    setSavingPw(true);
    const result = await changePassword(formData);
    setSavingPw(false);
    if (result?.error) toast.error(result.error);
    else { toast.success("Password updated!"); (e.target as HTMLFormElement).reset(); }
  };

  const roleLabel = profile.role === "govt_official" ? "Government Official" : profile.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : "—";
  const roleColor = profile.role === "govt_official" ? "bg-indigo-100 text-indigo-700" : profile.role === "provider" ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700";

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            Settings
          </h1>
          <p className="text-slate-500 mt-1 text-sm ml-13">Platform configuration and preferences</p>
        </div>
        <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${roleColor}`}>{roleLabel}</span>
      </div>

      {/* ── PROFILE ── */}
      <Card className="border-slate-100 shadow-sm bg-white/80 backdrop-blur-md">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            Profile Information
          </CardTitle>
          <p className="text-xs text-slate-400 mt-1">Update your name and personal details</p>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</Label>
              <Input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} className="bg-slate-50 border-slate-200 focus:bg-white transition-colors" placeholder="Your full name" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</Label>
              <div className="relative">
                <Input value={profile.email} className="bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed pr-20" disabled />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 bg-slate-200 px-2 py-0.5 rounded">Locked</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Role</Label>
              <Input value={roleLabel} className="bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed" disabled />
            </div>
            {profile.role === "trainee" && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Aadhaar / ID</Label>
                  <Input value={profile.aadhaar} onChange={e => setProfile({ ...profile, aadhaar: e.target.value })} className="bg-slate-50 border-slate-200 focus:bg-white transition-colors" placeholder="XXXX-XXXX-XXXX" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Highest Education</Label>
                  <Select value={profile.education} onChange={e => setProfile({ ...profile, education: e.target.value })} className="bg-slate-50 border-slate-200">
                    <option value="" disabled>Select education level</option>
                    <option value="10th Pass">10th Pass</option>
                    <option value="12th Pass">12th Pass</option>
                    <option value="ITI / Diploma">ITI / Diploma</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Post-Graduate">Post-Graduate</option>
                  </Select>
                </div>
              </>
            )}
          </div>
          <div className="flex justify-end mt-5 pt-4 border-t border-slate-100">
            <Button size="sm" onClick={handleSaveProfile} disabled={savingProfile} className="flex items-center gap-2 px-6">
              <Save className="h-4 w-4" />
              {savingProfile ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── NOTIFICATIONS ── */}
      <Card className="border-slate-100 shadow-sm bg-white/80 backdrop-blur-md">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <Bell className="h-4 w-4 text-amber-600" />
            </div>
            Notification Preferences
          </CardTitle>
          <p className="text-xs text-slate-400 mt-1">Control which alerts and reminders you receive</p>
        </CardHeader>
        <CardContent className="pt-4 space-y-2">
          {notifications.map(n => (
            <div key={n.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${n.enabled ? "border-primary/20 bg-primary/3" : "border-slate-100 bg-slate-50/50"}`}>
              <div className="flex items-center gap-3">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${n.enabled ? "bg-primary/10" : "bg-slate-100"}`}>
                  <n.icon className={`h-4 w-4 ${n.enabled ? "text-primary" : "text-slate-400"}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{n.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{n.desc}</p>
                </div>
              </div>
              <button
                onClick={() => toggleNotification(n.id)}
                className={`h-6 w-11 rounded-full relative flex-shrink-0 cursor-pointer transition-colors duration-200 ${n.enabled ? "bg-primary" : "bg-slate-200"}`}
                aria-label={`Toggle ${n.label}`}
              >
                <span className={`h-5 w-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all duration-200 ${n.enabled ? "left-[22px]" : "left-0.5"}`} />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ── SECURITY ── */}
      <Card className="border-slate-100 shadow-sm bg-white/80 backdrop-blur-md">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <div className="h-8 w-8 rounded-lg bg-red-50 flex items-center justify-center">
              <Shield className="h-4 w-4 text-red-600" />
            </div>
            Security & Password
          </CardTitle>
          <p className="text-xs text-slate-400 mt-1">Keep your account secure by using a strong password</p>
        </CardHeader>
        <CardContent className="pt-5">
          <form onSubmit={handleUpdatePassword}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Current Password</Label>
                <div className="relative">
                  <Input name="oldPassword" type={showOldPw ? "text" : "password"} required className="bg-slate-50 border-slate-200 pr-10" placeholder="••••••••" />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" onClick={() => setShowOldPw(!showOldPw)}>
                    {showOldPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">New Password</Label>
                <div className="relative">
                  <Input name="newPassword" type={showNewPw ? "text" : "password"} required className="bg-slate-50 border-slate-200 pr-10" placeholder="••••••••" />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" onClick={() => setShowNewPw(!showNewPw)}>
                    {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Confirm Password</Label>
                <Input name="confirmPassword" type="password" required className="bg-slate-50 border-slate-200" placeholder="••••••••" />
              </div>
            </div>
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
              <div className="flex items-start gap-2 text-xs text-slate-400">
                <Lock className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                <span>Use at least 8 characters with a mix of letters, numbers and symbols.</span>
              </div>
              <Button type="submit" size="sm" variant="outline" disabled={savingPw} className="flex items-center gap-2 px-6">
                <Key className="h-4 w-4" />
                {savingPw ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ── DATA RETENTION ── */}
      <Card className="border-slate-100 shadow-sm bg-white/80 backdrop-blur-md">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Database className="h-4 w-4 text-emerald-600" />
            </div>
            Data Retention & Consent
          </CardTitle>
          <p className="text-xs text-slate-400 mt-1">Configure how long trainee data is retained and privacy thresholds</p>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          {[
            { label: "Data retention period", desc: "How long trainee data is kept after programme completion", value: retention, onChange: (v: string) => { setRetention(v); toast.success("Retention policy updated"); }, options: [{ value: "3y", label: "3 Years" }, { value: "5y", label: "5 Years" }, { value: "7y", label: "7 Years" }] },
            { label: "Minimum cohort threshold", desc: "Minimum group size for demographic analytics (privacy guard)", value: cohort, onChange: (v: string) => { setCohort(v); toast.success("Threshold updated"); }, options: [{ value: "30", label: "30 individuals" }, { value: "50", label: "50 individuals" }, { value: "100", label: "100 individuals" }] },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50/60 border border-slate-100">
              <div className="flex-1 mr-4">
                <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
              </div>
              <Select className="w-[160px] h-9 text-sm border-slate-200 bg-white" value={item.value} onChange={e => item.onChange(e.target.value)}>
                {item.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </Select>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ── APPEARANCE ── */}
      <Card className="border-slate-100 shadow-sm bg-white/80 backdrop-blur-md">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <div className="h-8 w-8 rounded-lg bg-purple-50 flex items-center justify-center">
              <Palette className="h-4 w-4 text-purple-600" />
            </div>
            Appearance
          </CardTitle>
          <p className="text-xs text-slate-400 mt-1">Choose your preferred colour scheme</p>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="grid grid-cols-3 gap-3 max-w-sm">
            {[
              { key: "light", label: "Light", icon: Sun },
              { key: "dark", label: "Dark", icon: Moon },
              { key: "system", label: "System", icon: Monitor },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => { setTheme(t.key); toast.success(`${t.label} mode enabled`); }}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === t.key ? "border-primary bg-primary/5 shadow-sm" : "border-slate-100 hover:border-slate-200 bg-slate-50"}`}
              >
                <t.icon className={`h-5 w-5 ${theme === t.key ? "text-primary" : "text-slate-400"}`} />
                <span className={`text-xs font-bold ${theme === t.key ? "text-primary" : "text-slate-500"}`}>{t.label}</span>
                {theme === t.key && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
