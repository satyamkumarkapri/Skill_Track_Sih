"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, KPICard, Badge } from "@/components/ui";
import { getAllCoursesFromDB } from "@/actions/courses";
import { BookOpen, Users, Building2, Clock } from "lucide-react";

export default function TrainingPage() {
  const [courses, setCourses] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getAllCoursesFromDB().then((result) => {
      if (result.success) setCourses(result.courses);
      setLoading(false);
    });
  }, []);

  const sectors = [...new Set(courses.map((c) => c.sector))].sort();
  const totalEnrolled = courses.reduce((s, c) => s + (c.enrolledTrainees || 0), 0);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse p-6">
        <div className="h-8 bg-muted rounded w-1/4" />
        <div className="grid grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-muted rounded" />)}</div>
        <div className="h-64 bg-muted rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Training Programs</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {courses.length} courses across {sectors.length} sector{sectors.length !== 1 ? "s" : ""} · live from MongoDB
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-green-100 text-green-700 border border-green-200 px-3 py-1 rounded-full">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          Real-Time Data
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Total Courses" value={String(courses.length)} icon="BookOpen" />
        <KPICard label="Total Sectors" value={String(sectors.length)} icon="GraduationCap" />
        <KPICard label="Total Enrolled" value={String(totalEnrolled)} icon="Users" />
        <KPICard label="Active Providers" value={String(new Set(courses.map(c => c.providerId)).size)} icon="Briefcase" />
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">No Courses Yet</h3>
            <p className="text-sm text-muted-foreground">
              Training providers will add courses here. Once added, they appear immediately across all dashboards.
            </p>
          </CardContent>
        </Card>
      ) : (
        sectors.map((sector) => {
          const sectorCourses = courses.filter((c) => c.sector === sector);
          return (
            <Card key={sector} className="overflow-hidden">
              <CardHeader className="bg-slate-50/80 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{sector}</CardTitle>
                    <CardDescription>{sectorCourses.length} course{sectorCourses.length !== 1 ? "s" : ""}</CardDescription>
                  </div>
                  <span className="text-xs text-muted-foreground bg-white border rounded-full px-3 py-1">
                    {sectorCourses.reduce((s, c) => s + (c.enrolledTrainees || 0), 0)} enrolled
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {sectorCourses.map((course) => (
                    <div key={course.id} className="p-4 rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all bg-white">
                      <h4 className="text-sm font-semibold text-foreground mb-1">{course.title}</h4>
                      <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                        <Building2 className="h-3 w-3 flex-shrink-0" /> {course.providerName}
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" /><span>{course.durationWeeks} weeks</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Users className="h-3 w-3" /><span>{course.enrolledTrainees || 0} enrolled</span>
                        </div>
                      </div>
                      {course.targetSkills?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {course.targetSkills.slice(0, 3).map((s: string) => (
                            <Badge key={s} variant="secondary" className="text-[10px] px-1.5 py-0">{s}</Badge>
                          ))}
                          {course.targetSkills.length > 3 && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">+{course.targetSkills.length - 3}</Badge>
                          )}
                        </div>
                      )}
                      <div className="pt-2 border-t border-border/50">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${course.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                          {course.isActive ? "● Active" : "● Inactive"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
