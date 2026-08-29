"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Label, Badge } from "@/components/ui";
import { Award, Loader2, Plus, Calendar, Building } from "lucide-react";
import { getMyFullProfile, addMyCertificate } from "@/actions/trainee-updates";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

export default function TraineeCertificatesPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const result = await getMyFullProfile();
    if (result.success) {
      setProfile(result.profile);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    const result = await addMyCertificate(formData);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Certificate added successfully!");
      setIsAdding(false);
      await fetchData();
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="p-12 text-center text-muted-foreground"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>;
  }

  const certificates = profile?.certificates || [];

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Certificates</h1>
          <p className="text-sm text-muted-foreground">Manage your skill certifications</p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Add Certificate
          </Button>
        )}
      </div>

      {isAdding && (
        <Card className="border-primary/20 shadow-md">
          <CardHeader className="bg-slate-50/50 border-b pb-4">
            <CardTitle className="text-lg">Add New Certificate</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="name">Certificate Name / Title</Label>
                  <Input id="name" name="name" placeholder="e.g., AWS Certified Cloud Practitioner" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="authority">Issuing Authority</Label>
                  <Input id="authority" name="authority" placeholder="e.g., Amazon Web Services" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date Issued</Label>
                  <Input id="date" name="date" type="date" required />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t mt-6">
                <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Save Certificate
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {certificates.map((cert: any) => (
          <Card key={cert.id} className="overflow-hidden border border-slate-200 hover:border-primary/30 transition-all shadow-sm">
            <div className="h-2 bg-gradient-to-r from-saffron to-emerald-500 w-full" />
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <Award className="h-5 w-5 text-slate-600" />
                </div>
                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">Verified</Badge>
              </div>
              <h3 className="font-bold text-lg leading-tight mb-2">{cert.name}</h3>
              <div className="space-y-2 text-sm text-muted-foreground mt-4">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span>{cert.authority}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Issued: {formatDate(cert.date)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {certificates.length === 0 && !isAdding && (
          <div className="col-span-full">
            <Card className="border-dashed border-2">
              <CardContent className="p-16 text-center flex flex-col items-center justify-center">
                <Award className="h-12 w-12 text-slate-300 mb-4" />
                <h3 className="font-semibold text-lg text-slate-700">No Certificates Added</h3>
                <p className="text-muted-foreground text-sm max-w-sm mt-1">
                  Upload your skill certificates to improve your profile visibility to employers.
                </p>
                <Button onClick={() => setIsAdding(true)} variant="outline" className="mt-6 gap-2">
                  <Plus className="h-4 w-4" /> Add Your First Certificate
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
