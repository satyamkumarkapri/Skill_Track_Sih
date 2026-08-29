import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui";
import { Users, Search, Download } from "lucide-react";
import { getProviderTrainees, seedMockEnrollments } from "@/actions/provider";

export default async function ProviderTraineesPage() {
  const result = await getProviderTrainees();
  const enrollments = result.enrollments || [];

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Enrolled Trainees</h1>
          <p className="text-sm text-muted-foreground mt-1">View and manage trainees across all your courses.</p>
        </div>
        
        <div className="flex gap-2">
          {enrollments.length === 0 && (
            <form action={async () => { "use server"; await seedMockEnrollments(); }}>
              <Button variant="outline" type="submit">
                Generate Mock Data
              </Button>
            </form>
          )}
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="pb-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <CardTitle>All Trainees ({enrollments.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name or course..."
                className="w-full pl-9 pr-4 py-2 border rounded-md text-sm bg-background"
                disabled
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {enrollments.length === 0 ? (
            <div className="text-center py-16">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-foreground">No trainees found</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Once trainees enroll in your courses, they will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground border-b border-border/50">
                  <tr>
                    <th className="px-6 py-3 font-medium">Trainee Name</th>
                    <th className="px-6 py-3 font-medium">Course Enrolled</th>
                    <th className="px-6 py-3 font-medium">Enrollment Date</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {enrollments.map((enrollment: any) => (
                    <tr key={enrollment.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{enrollment.traineeName}</td>
                      <td className="px-6 py-4 text-muted-foreground">{enrollment.courseTitle}</td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={
                          enrollment.status === "Completed" 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }>
                          {enrollment.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/profile/${enrollment.traineeId}`}>
                          <Button variant="ghost" size="sm">View Profile</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
