import React from "react";
import { Card, CardContent, Button } from "@/components/ui";
import { Wrench } from "lucide-react";
import Link from "next/link";

export default function ComingSoonPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-6 animate-fade-in min-h-[80vh]">
      <Card className="max-w-md w-full shadow-lg border-primary/20">
        <CardContent className="p-8 text-center">
          <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Wrench className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Module Under Development</h2>
          <p className="text-muted-foreground mb-8">
            This section of the Training Provider Portal is currently under development for the SIH 2026 prototype.
          </p>
          <Link href="/provider/dashboard">
            <Button className="w-full">Return to Dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
