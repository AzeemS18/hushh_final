-- ==========================================
-- HUSHH AI PLACEMENT PLATFORM SCHEMA
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. STUDENTS PROFILE TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone_number TEXT,
    department TEXT DEFAULT 'General',
    classification_level TEXT DEFAULT 'Beginner', -- Beginner, Intermediate, Advanced
    domain_preference TEXT,
    university_name TEXT,
    graduation_year INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 2. ASSESSMENTS / SCORECARDS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    category TEXT NOT NULL,      -- e.g., 'Aptitude', 'Technical', 'HR', 'Company X'
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    percentage DECIMAL(5,2) GENERATED ALWAYS AS ((score::decimal / total_questions) * 100) STORED,
    skill_categories JSONB,      -- Detailed breakdown (e.g., {"arrays": 80, "graphs": 40})
    recommendations JSONB,       -- ML Study Plan generated
    pdf_report_url TEXT,         -- Link to generated PDF in Supabase Storage
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 3. RESUME ATS ANALYSIS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.resume_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    resume_url TEXT NOT NULL,    -- Link to PDF in storage
    ats_score INTEGER NOT NULL,  -- 0-100
    missing_keywords JSONB,      -- Array of missing keywords
    formatting_feedback TEXT,
    impact_feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 4. CODING SUBMISSIONS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.coding_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    problem_id TEXT NOT NULL,
    language TEXT NOT NULL,      -- python, java, cpp
    code_content TEXT NOT NULL,
    status TEXT NOT NULL,        -- PASSED, FAILED, ERROR
    execution_time_ms INTEGER,
    memory_used_kb INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- REALTIME SUBSCRIPTIONS
-- ==========================================
-- Enable Realtime on tables so UI can listen to updates instantly
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'students') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.students;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'assessments') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.assessments;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'resume_analysis') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.resume_analysis;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'coding_submissions') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.coding_submissions;
    END IF;
END $$;

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
-- Secure the tables so users can only view/edit their own data

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coding_submissions ENABLE ROW LEVEL SECURITY;

-- Students Policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.students;
CREATE POLICY "Users can view own profile" 
ON public.students FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.students;
CREATE POLICY "Users can insert own profile" 
ON public.students FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.students;
CREATE POLICY "Users can update own profile" 
ON public.students FOR UPDATE USING (auth.uid() = user_id);

-- Assessments Policies
DROP POLICY IF EXISTS "Users can view own assessments" ON public.assessments;
CREATE POLICY "Users can view own assessments" 
ON public.assessments FOR SELECT USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "Users can insert own assessments" ON public.assessments;
CREATE POLICY "Users can insert own assessments" 
ON public.assessments FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Resume Policies
DROP POLICY IF EXISTS "Users can view own resume analysis" ON public.resume_analysis;
CREATE POLICY "Users can view own resume analysis" 
ON public.resume_analysis FOR SELECT USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "Users can insert own resume analysis" ON public.resume_analysis;
CREATE POLICY "Users can insert own resume analysis" 
ON public.resume_analysis FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Coding Policies
DROP POLICY IF EXISTS "Users can view own coding submissions" ON public.coding_submissions;
CREATE POLICY "Users can view own coding submissions" 
ON public.coding_submissions FOR SELECT USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "Users can insert own coding submissions" ON public.coding_submissions;
CREATE POLICY "Users can insert own coding submissions" 
ON public.coding_submissions FOR INSERT WITH CHECK (auth.uid() = student_id);
