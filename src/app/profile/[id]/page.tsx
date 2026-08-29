import React from "react";
import Link from "next/link";
import { getTraineeById } from "@/actions/trainees";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  MapPin, GraduationCap, Briefcase, Phone, Mail, User,
  Calendar, Award, MessageSquare, Building, CheckCircle2, Clock, 
  ChevronLeft, FileText, ArrowLeft
} from "lucide-react";
import { Avatar, Badge, StatusBadge, Card, CardHeader, CardTitle, CardContent } from "@/components/ui";

export default async function TraineePublicProfilePage({ params }: { params: { id: string } }) {
  const trainee = await getTraineeById(params.id);

  if (!trainee) {
    return <div className="p-12 text-center text-muted-foreground max-w-4xl mx-auto mt-10">Trainee not found in system.</div>;
  }

  const empData = trainee.employmentData;
  const certificates = trainee.certificates || [];
  const followUps = trainee.followUps || [];
  const empHistory = trainee.employmentHistory || [];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Premium Header Banner */}
      <div className="h-48 md:h-64 bg-gradient-to-r from-saffron via-orange-500 to-india-green relative overflow-hidden">
        {/* Abstract shapes for premium feel */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-10 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl translate-y-1/4"></div>
        
        {/* Back navigation */}
        <div className="absolute top-6 left-6 z-10">
          <Link href="javascript:history.back()" className="flex items-center gap-2 text-white/90 hover:text-white bg-black/20 hover:bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm transition-all text-sm font-medium">
            <ArrowLeft className="h-4 w-4" /> Go Back
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 md:-mt-24 relative z-10 space-y-8">
        
        {/* Profile Identity Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-end">
            <div className="p-1 bg-white rounded-full shadow-lg shrink-0">
              <Avatar name={trainee.name} size="lg" />
            </div>
            <div className="flex-1 space-y-2 pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{trainee.name}</h1>
                  <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
                    <User className="h-4 w-4" /> ID: {trainee.trainee_id}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 px-3 py-1 text-sm font-medium">
                    <GraduationCap className="h-3.5 w-3.5 mr-1.5" /> {trainee.course_name}
                  </Badge>
                  <StatusBadge status={empData ? "employed" : "enrolled"} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50/50 border-t border-slate-100 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3 text-slate-600">
              <Mail className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">Email</p>
                <p className="font-medium">{trainee.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <Phone className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">Phone</p>
                <p className="font-medium">{trainee.phone || "Not provided"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <MapPin className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">Location</p>
                <p className="font-medium">{trainee.district}, {trainee.taluka}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Current Employment */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-india-green" /> Current Employment
              </h2>
              {empData ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="h-1 w-full bg-india-green"></div>
                  <div className="p-6 md:p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">{empData.role}</h3>
                        <p className="text-lg text-slate-600 font-medium mt-1 flex items-center gap-2">
                          <Building className="h-5 w-5" /> {empData.employer}
                        </p>
                      </div>
                      <Badge className="bg-india-green/10 text-india-green hover:bg-india-green/20 border-none px-3 py-1">Active</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
                      <div>
                        <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">Monthly Salary</p>
                        <p className="font-bold text-lg text-emerald-600">{formatCurrency(empData.salary)}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">Joined</p>
                        <p className="font-medium text-slate-800">{formatDate(empData.joiningDate)}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">Type</p>
                        <Badge variant="outline">{empData.type}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
                  <div className="h-16 w-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700">Not Currently Employed</h3>
                  <p className="text-slate-500 max-w-sm mx-auto mt-2">This trainee has not reported an active employment status.</p>
                </div>
              )}
            </section>

            {/* Employment History Timeline */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Clock className="h-5 w-5 text-saffron" /> Work History
              </h2>
              
              {empHistory.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center text-slate-500 italic">
                  No past employment history records found.
                </div>
              ) : (
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-saffron/20 before:via-slate-300 before:to-transparent">
                  {empHistory.map((job: any, i: number) => (
                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      {/* Timeline Dot */}
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 text-slate-400 shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors group-hover:bg-saffron group-hover:text-white">
                        <Briefcase className="h-4 w-4" />
                      </div>
                      
                      {/* Timeline Content */}
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-slate-800 text-lg">{job.role}</h4>
                          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">{job.status}</span>
                        </div>
                        <p className="text-sm font-medium text-slate-600 mb-4">{job.employer}</p>
                        
                        <div className="grid grid-cols-2 gap-4 text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <div>
                            <span className="block text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">Joined</span>
                            <span className="font-medium text-slate-700">{job.joiningDate ? formatDate(job.joiningDate) : "—"}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">Left</span>
                            <span className="font-medium text-slate-700">{job.endDate ? formatDate(job.endDate.split('T')[0]) : "—"}</span>
                          </div>
                          {job.reason && (
                            <div className="col-span-2 pt-2 border-t border-slate-200 mt-1">
                              <span className="block text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">Reason</span>
                              <span className="italic text-slate-600">"{job.reason}"</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar Content (Right) */}
          <div className="space-y-8">
            
            {/* Certifications */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Award className="h-5 w-5 text-saffron" /> Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                {certificates.length > 0 ? (
                  <div className="space-y-4">
                    {certificates.map((cert: any) => (
                      <div key={cert.id} className="flex gap-4 p-4 rounded-xl border border-slate-100 hover:border-saffron/30 hover:bg-orange-50/30 transition-colors">
                        <div className="h-10 w-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                          <Award className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 leading-tight">{cert.name}</h4>
                          <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5"><Building className="h-3 w-3"/>{cert.authority}</p>
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5"><Calendar className="h-3 w-3"/>{formatDate(cert.date)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-500">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No certificates uploaded.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Self-Reported Updates */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageSquare className="h-5 w-5 text-blue-500" /> Recent Updates
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {followUps.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {followUps.slice(0, 5).map((log: any, i: number) => (
                      <div key={log.id} className="p-5">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-bold">{log.status}</Badge>
                          <span className="text-xs text-slate-400">{formatDate(log.date)}</span>
                        </div>
                        {log.notes && (
                          <p className="text-sm text-slate-600 italic bg-slate-50 p-3 rounded-lg border border-slate-100 mt-3 relative before:absolute before:left-3 before:-top-2 before:text-slate-300 before:text-2xl before:content-['']">"{log.notes}"</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-slate-500">
                    <p className="text-sm">No recent status updates.</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
          </div>
        </div>
      </div>
    </div>
  );
}
