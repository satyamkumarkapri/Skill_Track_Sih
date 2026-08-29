import React from "react";
import { Loader2 } from "lucide-react";

export default function EmployerLoading() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="h-8 w-64 bg-slate-200 rounded-md mb-2"></div>
          <div className="h-4 w-48 bg-slate-100 rounded-md"></div>
        </div>
        <div className="h-10 w-32 bg-slate-200 rounded-lg"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-white border border-slate-100 rounded-2xl shadow-sm p-4 flex flex-col justify-center gap-2">
            <div className="h-4 w-24 bg-slate-100 rounded-md"></div>
            <div className="h-8 w-16 bg-slate-200 rounded-md"></div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="h-80 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-slate-300 animate-spin" />
        </div>
        <div className="h-80 bg-white border border-slate-100 rounded-2xl shadow-sm p-6 flex flex-col gap-4">
          <div className="h-6 w-32 bg-slate-200 rounded-md"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex-1 bg-slate-50 rounded-xl"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
