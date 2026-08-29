"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui";
import { toast } from "sonner";
import { updateTraineeProfile } from "@/actions/trainee";
import { Pencil, X } from "lucide-react";

export function EditProfileDialog({ trainee }: { trainee: any }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: trainee.name || "",
    phone: trainee.phone || "",
    district: trainee.district || "",
    taluka: trainee.taluka || "",
    education: trainee.education || "",
    gender: trainee.gender || "",
    age: trainee.age || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await updateTraineeProfile({
      name: formData.name,
      onboardingData: {
        phone: formData.phone,
        district: formData.district,
        taluka: formData.taluka,
        education: formData.education,
        gender: formData.gender,
        age: parseInt(formData.age as string) || 0,
      }
    });

    setLoading(false);
    if (result.success) {
      toast.success("Profile updated successfully");
      setOpen(false);
    } else {
      toast.error(result.error || "Failed to update profile");
    }
  };

  return (
    <>
      <Button variant="outline" size="sm" className="gap-2" onClick={() => setOpen(true)}>
        <Pencil className="h-4 w-4" />
        Edit Profile
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setOpen(false)} />
          <div className="relative z-50 w-full max-w-lg bg-background p-6 shadow-lg rounded-xl border border-border animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Edit Profile</h2>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <input 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <input 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Age</label>
                  <input 
                    name="age" 
                    type="number"
                    value={formData.age} 
                    onChange={handleChange} 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">District</label>
                  <input 
                    name="district" 
                    value={formData.district} 
                    onChange={handleChange} 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Taluka</label>
                  <input 
                    name="taluka" 
                    value={formData.taluka} 
                    onChange={handleChange} 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Education</label>
                  <input 
                    name="education" 
                    value={formData.education} 
                    onChange={handleChange} 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Gender</label>
                  <select 
                    name="gender" 
                    value={formData.gender} 
                    onChange={handleChange} 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Select...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
