import React from "react";
import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="h-8 w-48 bg-slate-200 rounded-md mb-2"></div>
          <div className="h-4 w-64 bg-slate-100 rounded-md"></div>
        </div>
        <div className="h-10 w-32 bg-slate-200 rounded-lg"></div>
      </div>

      {/* Stats Row Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-white border border-slate-100 rounded-2xl shadow-sm p-4 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="h-4 w-20 bg-slate-100 rounded-md"></div>
              <div className="h-8 w-8 bg-slate-100 rounded-full"></div>
            </div>
            <div className="h-8 w-24 bg-slate-200 rounded-md"></div>
          </div>
        ))}
      </div>

      {/* Main Charts Row Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-96 bg-white border border-slate-100 rounded-2xl shadow-sm p-6 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-slate-300 animate-spin" />
        </div>
        <div className="h-96 bg-white border border-slate-100 rounded-2xl shadow-sm p-6 flex flex-col gap-4">
          <div className="h-6 w-1/2 bg-slate-200 rounded-md"></div>
          <div className="h-4 w-full bg-slate-100 rounded-md"></div>
          <div className="flex-1 bg-slate-50 rounded-xl mt-4"></div>
        </div>
      </div>
    </div>
  );
}
