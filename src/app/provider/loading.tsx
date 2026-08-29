import React from "react";
import { Loader2 } from "lucide-react";

export default function ProviderLoading() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="h-8 w-64 bg-slate-200 rounded-md mb-2"></div>
          <div className="h-4 w-48 bg-slate-100 rounded-md"></div>
        </div>
        <div className="h-10 w-32 bg-slate-200 rounded-lg"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-white border border-slate-100 rounded-2xl shadow-sm p-4 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="h-4 w-24 bg-slate-100 rounded-md"></div>
              <div className="h-10 w-10 bg-slate-100 rounded-full"></div>
            </div>
            <div className="h-10 w-28 bg-slate-200 rounded-md mt-4"></div>
          </div>
        ))}
      </div>
      
      <div className="h-[400px] bg-white border border-slate-100 rounded-2xl shadow-sm p-6 flex items-center justify-center mt-6">
        <Loader2 className="h-8 w-8 text-slate-300 animate-spin" />
      </div>
    </div>
  );
}
