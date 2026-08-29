import React from "react";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { BookOpen, Plus, Search, Star, MessageSquare } from "lucide-react";
import Link from "next/link";
import { getProviderCourses } from "@/actions/courses";

export default async function CoursesListPage() {
  const result = await getProviderCourses();

  if (result.error || !result.courses) {
    return (
      <div className="p-6 text-center text-red-500">
        Error loading courses: {result.error}
      </div>
    );
  }

  const { courses } = result;

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Course Catalog</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage the training programs offered by your institute.</p>
        </div>
        <Link href="/provider/courses/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add New Course
          </Button>
        </Link>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>All Courses ({courses.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full pl-9 pr-4 py-2 border rounded-md text-sm bg-background"
                disabled
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed rounded-lg border-muted">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-foreground">No courses available</h3>
              <p className="text-muted-foreground text-sm mt-1 mb-6">Create a course to start enrolling trainees and tracking their skilling outcomes.</p>
              <Link href="/provider/courses/new">
                <Button>Add Your First Course</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="border border-border/50 shadow-sm hover:border-primary/30 transition-colors flex flex-col">
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                        {course.sector}
                      </Badge>
                      <span className="text-xs font-medium text-muted-foreground">{course.durationWeeks} Weeks</span>
                    </div>
                    <h3 className="font-semibold text-lg leading-tight mb-2">{course.title}</h3>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center text-amber-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="ml-1 text-sm font-bold">{course.rating ? course.rating.toFixed(1) : "New"}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{course.reviewCount || 0} reviews</span>
                    </div>
                    
                    <div className="mt-auto">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Target Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {course.targetSkills.slice(0, 3).map((skill: string, i: number) => (
                          <span key={i} className="text-xs bg-muted px-2 py-1 rounded-md text-foreground">{skill}</span>
                        ))}
                        {course.targetSkills.length > 3 && (
                          <span className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground">+{course.targetSkills.length - 3}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="p-5 border-t border-border/50 bg-slate-50/50 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Enrolled</p>
                      <p className="font-bold text-foreground text-lg">{course.enrolledTrainees}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/provider/courses/${course.id}/feedback`}>
                        <Button variant="outline" size="sm" className="gap-2" title="View Feedback">
                          <MessageSquare className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Button variant="default" size="sm">Manage</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
