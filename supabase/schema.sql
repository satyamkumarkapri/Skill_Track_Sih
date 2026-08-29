-- ==========================================
-- SKILLTRACK MAHARASHTRA - SUPABASE SCHEMA
-- ==========================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. TABLES
-- ==========================================

CREATE TABLE public.providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    district TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.employers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    industry TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.trainees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES public.providers(id),
    name TEXT NOT NULL,
    trainee_id TEXT UNIQUE NOT NULL,
    gender TEXT,
    district TEXT,
    taluka TEXT,
    course_name TEXT,
    employment_status TEXT DEFAULT 'enrolled',
    certification_status TEXT DEFAULT 'pending',
    attendance_percentage NUMERIC,
    assessment_score NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.employment_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trainee_id UUID REFERENCES public.trainees(id) ON DELETE CASCADE,
    employer_id UUID REFERENCES public.employers(id) ON DELETE SET NULL,
    job_role TEXT NOT NULL,
    salary NUMERIC,
    start_date DATE NOT NULL,
    status TEXT DEFAULT 'active',
    verification_status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.interventions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    target_group TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    priority TEXT DEFAULT 'medium',
    district TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

CREATE TABLE public.system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action TEXT NOT NULL,
    performed_by UUID REFERENCES auth.users(id),
    target_id UUID,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 2. ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 3. RLS POLICIES
-- ==========================================

-- Function to check if user is a government admin (based on JWT metadata)
CREATE OR REPLACE FUNCTION auth.is_gov_admin() RETURNS BOOLEAN AS $$
  SELECT COALESCE((current_setting('request.jwt.claims', true)::jsonb ->> 'role') = 'government_admin', false);
$$ LANGUAGE sql STABLE;

-- ------------------------------------------
-- Providers
-- ------------------------------------------
-- Providers can see their own profile
CREATE POLICY "Providers can view own profile" 
    ON public.providers FOR SELECT 
    USING (auth.uid() = user_id OR auth.is_gov_admin());

-- ------------------------------------------
-- Employers
-- ------------------------------------------
-- Employers can see their own profile
CREATE POLICY "Employers can view own profile" 
    ON public.employers FOR SELECT 
    USING (auth.uid() = user_id OR auth.is_gov_admin());

-- ------------------------------------------
-- Trainees
-- ------------------------------------------
-- Trainees can view and update their own data
CREATE POLICY "Trainees can view own data" 
    ON public.trainees FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Trainees can update own data" 
    ON public.trainees FOR UPDATE 
    USING (auth.uid() = user_id);

-- Providers can view trainees assigned to them
CREATE POLICY "Providers can view assigned trainees" 
    ON public.trainees FOR SELECT 
    USING (provider_id IN (SELECT id FROM public.providers WHERE user_id = auth.uid()));

-- Employers can view trainees they have hired
CREATE POLICY "Employers can view hired trainees" 
    ON public.trainees FOR SELECT 
    USING (id IN (
        SELECT trainee_id FROM public.employment_records 
        WHERE employer_id IN (SELECT id FROM public.employers WHERE user_id = auth.uid())
    ));

-- Gov admins can view all trainees
CREATE POLICY "Gov admins can view all trainees" 
    ON public.trainees FOR SELECT 
    USING (auth.is_gov_admin());

-- ------------------------------------------
-- Employment Records
-- ------------------------------------------
-- Trainees can view their own employment records
CREATE POLICY "Trainees can view own employment records" 
    ON public.employment_records FOR SELECT 
    USING (trainee_id IN (SELECT id FROM public.trainees WHERE user_id = auth.uid()));

-- Employers can view and manage employment records for their company
CREATE POLICY "Employers can manage own employment records" 
    ON public.employment_records FOR ALL 
    USING (employer_id IN (SELECT id FROM public.employers WHERE user_id = auth.uid()));

-- Gov admins can view all employment records
CREATE POLICY "Gov admins can view all employment records" 
    ON public.employment_records FOR SELECT 
    USING (auth.is_gov_admin());

-- ------------------------------------------
-- Interventions
-- ------------------------------------------
-- Gov admins can manage interventions
CREATE POLICY "Gov admins can manage interventions" 
    ON public.interventions FOR ALL 
    USING (auth.is_gov_admin());

-- Public can read interventions (or specific roles, keeping it simple here)
CREATE POLICY "Anyone can view active interventions" 
    ON public.interventions FOR SELECT 
    USING (status = 'active');

-- ------------------------------------------
-- System Logs
-- ------------------------------------------
-- Only Gov Admins can view system logs (Audit Trail)
CREATE POLICY "Gov admins can view system logs" 
    ON public.system_logs FOR SELECT 
    USING (auth.is_gov_admin());

-- System can insert logs (Bypass RLS for service role, but for auth users:)
CREATE POLICY "Authenticated users can insert logs" 
    ON public.system_logs FOR INSERT 
    WITH CHECK (auth.uid() = performed_by);
