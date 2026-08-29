"use client";

import React, { useState, useEffect } from "react";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
  Button, Input, Label, Select, Badge, Separator,
} from "@/components/ui";
import { Settings, User, Bell, Shield, Database, Palette, Building2 } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { changePassword, getSessionAction, updateProfileAction } from "@/actions/auth";

export default function SettingsPage() {
  const { setTheme, theme } = useTheme();
  
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
    aadhaar: "",
    education: ""
  });

  useEffect(() => {
    // We can fetch full profile info including MongoDB onboarding data here
    fetch('/api/auth/profile')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        if (data.user) {
          setProfile({
            name: data.user.name || "",
            email: data.user.email || "",
            role: data.user.role || "",
            aadhaar: data.user.onboardingData?.aadhaar || "",
            education: data.user.onboardingData?.education || ""
          });
        }
      })
      .catch(() => {
        // Fallback to session
        getSessionAction().then(session => {
          if (session) {
            setProfile(prev => ({
              ...prev,
              name: session.name || "",
              email: session.email || "",
              role: session.role || "",
            }));
          }
        });
      });
  }, []);

  const [password, setPassword] = useState("");
  const [retention, setRetention] = useState("3y");
  const [cohort, setCohort] = useState("30");
  
  const [notifications, setNotifications] = useState([
    { id: "n1", label: "Follow-up due reminders", enabled: true },
    { id: "n2", label: "Verification pending alerts", enabled: true },
    { id: "n3", label: "Intervention recommendations", enabled: true },
    { id: "n4", label: "Monthly report generation", enabled: false },
    { id: "n5", label: "Consent change notifications", enabled: true },
  ]);

  const toggleNotification = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, enabled: !n.enabled } : n
    ));
    toast.success("Notification preferences updated");
  };

  const handleSaveProfile = async () => {
    const formData = new FormData();
    formData.append("name", profile.name);
    if (profile.role === "trainee") {
      formData.append("aadhaar", profile.aadhaar);
      formData.append("education", profile.education);
    }
    
    const result = await updateProfileAction(formData);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Profile updated successfully!");
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (formData.get("newPassword") !== formData.get("confirmPassword")) {
      toast.error("New passwords do not match");
      return;
    }

    const result = await changePassword(formData);
    if (result?.error) {
      toast.error(result.error);
    } else if (result?.success) {
      toast.success("Password updated successfully!");
      e.currentTarget.reset();
    }
  };
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Platform configuration and preferences</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <CardTitle>Profile</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Full Name</Label>
              <Input 
                value={profile.name} 
                onChange={(e) => setProfile({...profile, name: e.target.value})} 
                className="mt-1" 
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={profile.email} className="mt-1" disabled />
            </div>
            <div>
              <Label>Role</Label>
              <Input value={profile.role.replace(/_/g, ' ')} className="mt-1 capitalize" disabled />
            </div>
            
            {profile.role === "trainee" && (
              <>
                <div>
                  <Label>Aadhaar Number / ID</Label>
                  <Input 
                    value={profile.aadhaar} 
                    onChange={(e) => setProfile({...profile, aadhaar: e.target.value})} 
                    className="mt-1" 
                  />
                </div>
                <div>
                  <Label>Highest Education</Label>
                  <Select 
                    value={profile.education} 
                    onChange={(e) => setProfile({...profile, education: e.target.value})} 
                  >
                    <option value="" disabled className="hidden"></option>
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
          <Button className="mt-4" size="sm" onClick={handleSaveProfile}>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            <CardTitle>Notifications</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n.id} className="flex items-center justify-between py-2">
                <span className="text-sm">{n.label}</span>
                <div 
                  onClick={() => toggleNotification(n.id)}
                  className={`h-6 w-11 rounded-full relative cursor-pointer transition-colors ${n.enabled ? "bg-primary" : "bg-muted"}`}
                >
                  <div className={`h-5 w-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${n.enabled ? "left-5" : "left-0.5"}`} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <CardTitle>Security</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input name="oldPassword" type="password" required />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input name="newPassword" type="password" required />
              </div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input name="confirmPassword" type="password" required />
              </div>
            </div>
            <Button type="submit" size="sm" variant="outline">Update Password</Button>
          </form>
        </CardContent>
      </Card>

      {/* Data Retention */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-primary" />
            <CardTitle>Data Retention & Consent</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="text-sm font-medium">Default data retention period</p>
                <p className="text-xs text-muted-foreground">How long trainee data is retained after programme completion</p>
              </div>
              <Select 
                className="w-[150px] h-8 text-xs"
                value={retention}
                onChange={(e) => {
                  setRetention(e.target.value);
                  toast.success("Retention policy updated");
                }}
              >
                <option value="3y">3 Years</option>
                <option value="5y">5 Years</option>
                <option value="7y">7 Years</option>
              </Select>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="text-sm font-medium">Minimum cohort threshold</p>
                <p className="text-xs text-muted-foreground">Minimum number of individuals for demographic analytics</p>
              </div>
              <Select 
                className="w-[150px] h-8 text-xs"
                value={cohort}
                onChange={(e) => {
                  setCohort(e.target.value);
                  toast.success("Cohort threshold updated");
                }}
              >
                <option value="30">30 individuals</option>
                <option value="50">50 individuals</option>
                <option value="100">100 individuals</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" />
            <CardTitle>Appearance</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Button 
              size="sm" 
              variant={theme === 'light' ? 'default' : 'outline'}
              onClick={() => setTheme('light')}
            >
              Light
            </Button>
            <Button 
              size="sm" 
              variant={theme === 'dark' ? 'default' : 'outline'}
              onClick={() => setTheme('dark')}
            >
              Dark
            </Button>
            <Button 
              size="sm" 
              variant={theme === 'system' ? 'default' : 'outline'}
              onClick={() => setTheme('system')}
            >
              System
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
