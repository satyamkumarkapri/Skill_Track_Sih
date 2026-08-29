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
        <Card className="border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 card-hover bg-white/60 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150" />
          <CardContent className="p-6 flex items-center gap-5 relative z-10">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200/50 flex items-center justify-center shadow-inner">
              <BookOpen className="h-7 w-7 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Active Courses</p>
              <h2 className="text-4xl font-extrabold text-slate-900 mt-1">{totalCourses}</h2>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 card-hover bg-white/60 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150" />
          <CardContent className="p-6 flex items-center gap-5 relative z-10">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200/50 flex items-center justify-center shadow-inner">
              <Users className="h-7 w-7 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Enrolled</p>
              <h2 className="text-4xl font-extrabold text-slate-900 mt-1">{totalTrainees}</h2>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 card-hover bg-white/60 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150" />
          <CardContent className="p-6 flex items-center gap-5 relative z-10">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200/50 flex items-center justify-center shadow-inner">
              <TrendingUp className="h-7 w-7 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Placement Rate</p>
              <h2 className="text-4xl font-extrabold text-slate-900 mt-1">{avgPlacementRate}%</h2>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Courses List */}
      <Card className="border-slate-100 shadow-sm bg-white/60 backdrop-blur-md">
        <CardHeader className="border-b border-slate-100 bg-white/40 pb-4">
          <CardTitle className="text-lg font-bold text-slate-800">Your Active Courses</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {courses.length === 0 ? (
            <div className="text-center py-16">
              <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-inner">
                <BookOpen className="h-10 w-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-700">No courses created yet</h3>
              <p className="text-slate-500 mt-2 mb-6 max-w-sm mx-auto">Add your first training program to start tracking enrollments and outcomes.</p>
              <Link href="/provider/courses/new">
                <Button className="bg-primary text-white hover:bg-primary/90 shadow-md">
                  <Plus className="h-4 w-4 mr-2" /> Add Your First Course
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {courses.slice(0, 5).map((course) => (
                <div key={course.id} className="flex items-center justify-between p-5 hover:bg-slate-50/80 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all border border-slate-200/50">
                      <BookOpen className="h-5 w-5 text-slate-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 group-hover:text-primary transition-colors">{course.title}</h4>
                      <p className="text-sm font-medium text-slate-500 mt-0.5">Enrolled Trainees: <span className="text-slate-700 font-bold">{course.enrolledTrainees}</span></p>
                    </div>
                  </div>
                  <Link href={`/provider/courses`}>
                    <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity bg-white hover:bg-slate-50 border-slate-200">
                      View Details
                    </Button>
                  </Link>
                </div>
              ))}
              {courses.length > 5 && (
                <div className="text-center p-4 bg-slate-50/50 border-t border-slate-100">
                  <Link href="/provider/courses" className="text-sm font-semibold text-primary hover:underline">
                    View all {courses.length} courses
                  </Link>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
