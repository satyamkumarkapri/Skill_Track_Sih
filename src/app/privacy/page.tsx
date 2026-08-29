import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
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
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Privacy Policy & Data Security</h1>
          </div>
          
          <p className="text-slate-500 mb-8 text-sm">Last Updated: August 2026 (SIH Submission)</p>

          <div className="space-y-8 prose prose-slate max-w-none">
            <section id="data-security">
              <h2 className="text-xl font-bold text-slate-900 mb-3">1. Data Collection & Security</h2>
              <p className="text-slate-600 leading-relaxed">
                SkillTrack Maharashtra collects longitudinal employment data, skill certification records, and wage progression information. This data is strictly used for tracking the efficacy of government skilling schemes and identifying skill gaps. All data is encrypted at rest and in transit using industry-standard AES-256 encryption.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">2. Trainee Consent Architecture</h2>
              <p className="text-slate-600 leading-relaxed">
                We operate on a consent-first architecture. Trainees have granular control over their data sharing preferences through their personal dashboard. Consent for employment verification, follow-up communications, and demographic analytics can be withdrawn at any time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">3. Anonymization & Analytics</h2>
              <p className="text-slate-600 leading-relaxed">
                For predictive modeling and macro-level dashboards used by Government Officials, all personally identifiable information (PII) is obfuscated. The system employs minimum cohort thresholds to prevent reverse-identification of individuals in demographic breakdowns.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">4. Third-Party Access</h2>
              <p className="text-slate-600 leading-relaxed">
                Data is only shared with verified Employers and authorized Training Providers within the SkillTrack ecosystem. We do not sell, rent, or lease trainee data to any external marketing or third-party organizations.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
