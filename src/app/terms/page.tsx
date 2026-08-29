import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-primary hover:underline mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Terms of Service</h1>
          </div>
          
          <p className="text-slate-500 mb-8 text-sm">Last Updated: August 2026 (SIH Submission)</p>

          <div className="space-y-8 prose prose-slate max-w-none">
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">1. Platform Usage</h2>
              <p className="text-slate-600 leading-relaxed">
                SkillTrack Maharashtra is an official platform designed for the monitoring of skilling outcomes and impact intelligence. Access to the platform is restricted to authorized Government Officials, verified Training Providers, registered Employers, and certified Trainees.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">2. User Responsibilities</h2>
              <p className="text-slate-600 leading-relaxed">
                Users are responsible for maintaining the confidentiality of their login credentials. Any activity conducted under a user's account is their sole responsibility. Employers and Training Providers must ensure the accuracy of the employment and certification data they submit.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">3. Data Accuracy & Auditing</h2>
              <p className="text-slate-600 leading-relaxed">
                The Government of Maharashtra reserves the right to audit employment verification records submitted by Training Providers and Employers. Falsification of placement data may result in the suspension of platform access and associated scheme benefits.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">4. Limitation of Liability</h2>
              <p className="text-slate-600 leading-relaxed">
                While the platform utilizes AI and predictive modeling for skill gap analysis and demand forecasting, these insights are provided as decision support tools. The platform operators are not liable for business decisions made solely based on automated insights.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
