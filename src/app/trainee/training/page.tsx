"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from "@/components/ui";
import { BookOpen, CheckCircle2, Clock, MapPin, Building2, Calendar, Loader2, Star, MessageSquare } from "lucide-react";
import { getAvailableCourses, getMyEnrollments, enrollInCourse } from "@/actions/trainee";
import Link from "next/link";
import { toast } from "sonner";

export default function TraineeTrainingPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [coursesRes, enrollmentsRes] = await Promise.all([
      getAvailableCourses(),
      getMyEnrollments()
    ]);
    
    if (coursesRes.success) setCourses(coursesRes.courses);
    if (enrollmentsRes.success) setEnrollments(enrollmentsRes.enrollments);
    
    setLoading(false);
  };

  const handleEnroll = async (courseId: string) => {
    setEnrollingId(courseId);
    const result = await enrollInCourse(courseId);
    
    if (result.success) {
      toast.success("Successfully enrolled in course!");
      await fetchData(); // Refresh data to show new enrollment
    } else {
      toast.error(result.error || "Failed to enroll in course.");
    }
    setEnrollingId(null);
  };

  if (loading) {
    return <div className="p-12 text-center text-muted-foreground"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>;
  }

  // Get IDs of courses the trainee is already enrolled in
  const enrolledCourseIds = new Set(enrollments.map(e => e.courseId));

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Course Catalog</h1>
        <p className="text-sm text-muted-foreground mt-1">Discover and enroll in skill development programs.</p>
      </div>

      {/* Current Enrollments Section */}
      {enrollments.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            My Active Courses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment) => (
              <Card key={enrollment.id} className="border-border shadow-sm border-l-4 border-l-emerald-500 flex flex-col">
                <div className="p-5 flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className={enrollment.status === "Completed" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-blue-50 text-blue-700 border-blue-200"}>
                      {enrollment.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground" suppressHydrationWarning>
                      Enrolled: {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg">{enrollment.courseTitle}</h3>
                </div>
                <div className="px-5 py-3 border-t border-border/50 bg-muted/20 flex gap-2">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => toast.success("Redirecting to Learning Management System...")}
                  >
                    Go to Course
                  </Button>
                  <Link href="/trainee/feedback" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <Star className="h-3.5 w-3.5" /> Rate Course
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Available Courses Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Available for Enrollment
        </h2>
        
        {courses.length === 0 ? (
          <Card className="border-border border-dashed">
            <CardContent className="py-16 text-center">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-foreground">No courses available right now</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Training providers are currently updating their catalogs. Check back soon!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const isEnrolled = enrolledCourseIds.has(course.id);
              
              return (
                <Card key={course.id} className={`border border-border/50 shadow-sm flex flex-col ${isEnrolled ? "opacity-60" : ""}`}>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                        {course.sector}
                      </Badge>
                      <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {course.durationWeeks} Weeks
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg leading-tight mb-2">{course.title}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5 mb-2">
                      <Building2 className="h-4 w-4" /> {course.providerName}
                    </p>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center text-amber-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="ml-1 text-sm font-bold">{course.rating ? course.rating.toFixed(1) : "New"}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground hover:underline">
                        <Link href={`/trainee/courses/${course.id}/feedback`}>
                          {course.reviewCount || 0} reviews
                        </Link>
                      </span>
                    </div>
                    
                    <div className="mt-auto">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Skills Covered</p>
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
                  <div className="p-5 border-t border-border/50 bg-slate-50/50 flex gap-2">
                    <Link href={`/trainee/courses/${course.id}/feedback`}>
                      <Button variant="outline" className="px-3 text-muted-foreground hover:text-primary" title="Read Reviews">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </Link>
                    {isEnrolled ? (
                      <Button variant="secondary" className="flex-1 cursor-default" disabled>
                        <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-600" />
                        Enrolled
                      </Button>
                    ) : (
                      <Button 
                        className="flex-1" 
                        onClick={() => handleEnroll(course.id)}
                        disabled={enrollingId === course.id}
                      >
                        {enrollingId === course.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Enroll
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
