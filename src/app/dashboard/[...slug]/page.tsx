import React from "react";
import { Card, CardContent, EmptyState, Button } from "@/components/ui";
import { Wrench } from "lucide-react";
import Link from "next/link";

export default function ComingSoonPage({ params }: { params: { slug: string[] } }) {
  const moduleName = params.slug[0] 
    ? params.slug[0].charAt(0).toUpperCase() + params.slug[0].slice(1)
    : "This Module";

  return (
    <div className="h-[calc(100vh-120px)] flex items-center justify-center p-6 animate-fade-in">
      <Card className="max-w-md w-full shadow-lg border-primary/20">
        <CardContent className="p-8 text-center">
          <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Wrench className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{moduleName}</h2>
          <p className="text-muted-foreground mb-8">
            This module is currently under development for the SIH 2026 prototype. 
            Check back later for updates to the {moduleName} features.
          </p>
          <Link href="/dashboard">
            <Button className="w-full">Return to Dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
