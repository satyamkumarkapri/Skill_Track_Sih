import React from "react";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui";
import { BookOpen, Users, TrendingUp, Plus } from "lucide-react";
import Link from "next/link";
import { getProviderAnalytics } from "@/actions/courses";

export default async function ProviderDashboardPage() {
  const result = await getProviderAnalytics();
  
  if (result.error || !result.data) {
    return (
      <div className="p-6 text-center text-red-500">
        Error loading dashboard: {result.error}
      </div>
    );
  }

  const { totalCourses, totalTrainees, avgPlacementRate, courses } = result.data;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Training Provider Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your courses and track trainee outcomes.</p>
        </div>
        <Link href="/provider/courses/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Course
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Courses</p>
              <h2 className="text-3xl font-bold text-foreground">{totalCourses}</h2>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Users className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Enrolled</p>
              <h2 className="text-3xl font-bold text-foreground">{totalTrainees}</h2>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-purple-50 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg Placement Rate</p>
              <h2 className="text-3xl font-bold text-foreground">{avgPlacementRate}%</h2>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Courses List */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle>Your Courses</CardTitle>
        </CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg border-muted">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-foreground">No courses created yet</h3>
              <p className="text-muted-foreground text-sm mt-1 mb-4">Add your first training program to start tracking enrollments.</p>
              <Link href="/provider/courses/new">
                <Button variant="outline">Add Your First Course</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {courses.slice(0, 5).map((course) => (
                <div key={course.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div>
                    <h4 className="font-semibold text-foreground">{course.title}</h4>
                    <p className="text-sm text-muted-foreground">Enrolled: {course.enrolledTrainees}</p>
                  </div>
                  <Link href={`/provider/courses`}>
                    <Button variant="ghost" size="sm">View Details</Button>
                  </Link>
                </div>
              ))}
              {courses.length > 5 && (
                <div className="text-center pt-2">
                  <Link href="/provider/courses" className="text-sm text-primary hover:underline">View all {courses.length} courses</Link>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
