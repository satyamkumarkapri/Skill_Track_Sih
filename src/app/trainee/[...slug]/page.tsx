import React from "react";
import { Card, CardContent, Button } from "@/components/ui";
import { Wrench } from "lucide-react";
import Link from "next/link";

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Basic header so it's not totally empty */}
      <header className="h-16 border-b border-border bg-white flex items-center px-6">
        <Link href="/" className="font-bold text-foreground">SkillTrack</Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-6 animate-fade-in">
        <Card className="max-w-md w-full shadow-lg border-primary/20">
          <CardContent className="p-8 text-center">
            <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Wrench className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Trainee Portal</h2>
            <p className="text-muted-foreground mb-8">
              The Trainee Portal is currently under development for the SIH 2026 prototype.
            </p>
            <Link href="/">
              <Button className="w-full" variant="outline">Return to Home</Button>
            </Link>
            <Link href="/login" className="block mt-3">
              <Button className="w-full">Back to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
