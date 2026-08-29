// ===== Core Types for SkillTrack Maharashtra =====

export type Role = "government_admin" | "government_officer" | "training_provider" | "employer" | "trainee";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar_url?: string;
  organization?: string;
  district?: string;
  created_at: string;
}

export interface Trainee {
  id: string;
  trainee_id: string; // MH-SKILL-2026-XXXXXX
  user_id?: string;
  name: string;
  email: string;
  phone: string;
  gender: "Male" | "Female" | "Other";
  date_of_birth: string;
  age: number;
  education: string;
  district: string;
  taluka?: string;
  address?: string;
  aadhaar_last_four?: string;
  category?: string;
  provider_id: string;
  provider_name: string;
  course_id: string;
  course_name: string;
  batch_id?: string;
  enrollment_date: string;
  training_status: TrainingStatus;
  certification_status: CertificationStatus;
  employment_status: EmploymentStatus;
  assessment_score?: number;
  attendance_percentage?: number;
  certification_date?: string;
  placement_date?: string;
  current_salary?: number;
  skill_match_score?: number;
  consent_given: boolean;
  created_at: string;
  updated_at: string;
}

export type TrainingStatus = "enrolled" | "in-progress" | "completed" | "dropped";
export type CertificationStatus = "pending" | "passed" | "failed" | "not-attempted";
export type EmploymentStatus = "employed" | "self-employed" | "apprentice" | "seeking" | "not-working";
export type VerificationStatus = "unverified" | "trainee-confirmed" | "employer-confirmed" | "verified";

export interface TrainingProvider {
  id: string;
  name: string;
  code: string;
  type: string;
  district: string;
  address: string;
  contact_person: string;
  email: string;
  phone: string;
  courses_offered: number;
  total_trainees: number;
  completion_rate: number;
  certification_rate: number;
  placement_rate: number;
  retention_rate_6m: number;
  avg_salary: number;
  skill_match_score: number;
  outcome_effectiveness_score: number;
  status: "active" | "inactive" | "suspended";
  created_at: string;
}

export interface Course {
  id: string;
  name: string;
  sector: string;
  duration_hours: number;
  provider_id: string;
  provider_name: string;
  total_trainees: number;
  completion_rate: number;
  certification_rate: number;
  placement_rate: number;
  retention_rate: number;
  avg_salary: number;
  skill_match_score: number;
  skills_taught: string[];
  status: "active" | "inactive";
}

export interface Employer {
  id: string;
  name: string;
  industry: string;
  sector: string;
  district: string;
  address: string;
  contact_person: string;
  email: string;
  phone: string;
  gstin?: string;
  total_employees_from_program: number;
  verification_rate: number;
  avg_salary_offered: number;
  retention_rate: number;
  status: "active" | "inactive" | "unverified";
  created_at: string;
}

export interface EmploymentRecord {
  id: string;
  trainee_id: string;
  trainee_name: string;
  employer_id?: string;
  employer_name: string;
  job_role: string;
  joining_date: string;
  current_salary: number;
  initial_salary: number;
  employment_type: "full-time" | "part-time" | "contract" | "apprentice";
  verification_status: VerificationStatus;
  confidence_score: number;
  is_active: boolean;
  end_date?: string;
  end_reason?: string;
}

export interface SelfEmployment {
  id: string;
  trainee_id: string;
  trainee_name: string;
  business_type: string;
  business_sector: string;
  start_date: string;
  location: string;
  monthly_income: number;
  num_workers: number;
  business_status: "active" | "closed" | "struggling";
  training_relevance: "highly-relevant" | "somewhat-relevant" | "not-relevant";
}

export interface Apprenticeship {
  id: string;
  trainee_id: string;
  trainee_name: string;
  company: string;
  trade: string;
  start_date: string;
  duration_months: number;
  stipend: number;
  conversion_status: "ongoing" | "converted" | "not-converted" | "completed";
  status: "active" | "completed" | "dropped";
}

export interface FollowUp {
  id: string;
  trainee_id: string;
  trainee_name: string;
  type: "30-day" | "90-day" | "180-day" | "365-day";
  scheduled_date: string;
  status: "pending" | "sent" | "responded" | "verified" | "no-response" | "escalated";
  channel: "sms" | "call" | "app" | "email";
  response_date?: string;
  employment_status?: EmploymentStatus;
  salary?: number;
  satisfaction_score?: number;
  notes?: string;
}

export interface Intervention {
  id: string;
  title: string;
  description: string;
  type: "curriculum-revision" | "employer-connect" | "bridge-course" | "interview-prep" | "apprenticeship" | "district-targeted" | "upskilling";
  target_district?: string;
  target_provider?: string;
  target_course?: string;
  priority: "high" | "medium" | "low";
  status: "recommended" | "approved" | "in-progress" | "completed" | "measured";
  created_by: string;
  assigned_to?: string;
  impact_metric?: string;
  impact_value?: number;
  created_at: string;
  updated_at: string;
}

export interface SkillGap {
  skill: string;
  demand_score: number;
  supply_score: number;
  gap_severity: "high" | "medium" | "low";
  affected_courses: string[];
  affected_districts: string[];
}

export interface DistrictData {
  id: string;
  name: string;
  total_trainees: number;
  training_centres: number;
  employment_rate: number;
  retention_rate: number;
  avg_salary: number;
  skill_gap_score: number;
  non_placement_rate: number;
  self_employment_rate: number;
  top_courses: string[];
  coordinates: [number, number]; // [lat, lng]
}

export interface KPIMetric {
  label: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon: string;
  trend?: "up" | "down" | "neutral";
  color?: string;
}

export interface OutcomeEvent {
  date: string;
  type: string;
  title: string;
  description: string;
  status: "completed" | "pending" | "upcoming";
}

export interface SalaryHistory {
  period: string;
  salary: number;
}

export interface Consent {
  id: string;
  trainee_id: string;
  purpose: string;
  status: "granted" | "withdrawn";
  timestamp: string;
  version: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  user_name: string;
  user_role: Role;
  action: string;
  entity_type: string;
  entity_id: string;
  details: string;
  ip_address?: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  type: "follow-up" | "verification" | "intervention" | "report" | "consent" | "employment";
  title: string;
  description: string;
  read: boolean;
  created_at: string;
  link?: string;
}

export interface MLPrediction {
  prediction: number;
  confidence: number;
  risk_level: "low" | "medium" | "high";
  factors: { factor: string; impact: "positive" | "negative"; weight: number }[];
  recommendations: string[];
  disclaimer: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface FilterState {
  dateRange?: { from: string; to: string };
  district?: string;
  provider?: string;
  course?: string;
  gender?: string;
  ageGroup?: string;
  employmentStatus?: EmploymentStatus;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
