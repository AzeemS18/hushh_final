-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  academic_year INT,
  department VARCHAR(100),
  target_role VARCHAR(255),
  preferred_companies JSONB DEFAULT '[]',
  weekly_availability INT,
  classification_level VARCHAR(50),
  domain_preference VARCHAR(100),
  knows_target_domain BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "students_select_own" ON public.students FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "students_insert_own" ON public.students FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "students_update_own" ON public.students FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "students_delete_own" ON public.students FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "students_admin_all" ON public.students FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 2. ASSESSMENTS TABLE
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  test_number INT NOT NULL,
  score INT,
  skill_categories JSONB DEFAULT '{}',
  difficulty_progression JSONB DEFAULT '[]',
  duration_seconds INT,
  weak_areas TEXT[],
  strong_areas TEXT[],
  growth_rate_vs_previous FLOAT,
  forecast_7day INT,
  forecast_14day INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "assessments_select_own" ON public.assessments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.students WHERE students.id = assessments.student_id AND students.user_id = auth.uid())
);
CREATE POLICY "assessments_insert_own" ON public.assessments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.students WHERE students.id = assessments.student_id AND students.user_id = auth.uid())
);
CREATE POLICY "assessments_update_own" ON public.assessments FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.students WHERE students.id = assessments.student_id AND students.user_id = auth.uid())
);
CREATE POLICY "assessments_admin_all" ON public.assessments FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 3. SKILL_PERFORMANCE TABLE
CREATE TABLE IF NOT EXISTS public.skill_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  skill_category VARCHAR(100) NOT NULL,
  current_score INT,
  previous_score INT,
  attempts INT DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  trend VARCHAR(50)
);

ALTER TABLE public.skill_performance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "skill_perf_select_own" ON public.skill_performance FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.students WHERE students.id = skill_performance.student_id AND students.user_id = auth.uid())
);
CREATE POLICY "skill_perf_insert_own" ON public.skill_performance FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.students WHERE students.id = skill_performance.student_id AND students.user_id = auth.uid())
);
CREATE POLICY "skill_perf_update_own" ON public.skill_performance FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.students WHERE students.id = skill_performance.student_id AND students.user_id = auth.uid())
);
CREATE POLICY "skill_perf_admin_all" ON public.skill_performance FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 4. MOCK_INTERVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.mock_interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  role VARCHAR(255),
  question_id UUID,
  answer_text TEXT,
  model_answer TEXT,
  self_rating INT,
  time_taken_seconds INT,
  system_evaluation JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.mock_interviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "mocks_select_own" ON public.mock_interviews FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.students WHERE students.id = mock_interviews.student_id AND students.user_id = auth.uid())
);
CREATE POLICY "mocks_insert_own" ON public.mock_interviews FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.students WHERE students.id = mock_interviews.student_id AND students.user_id = auth.uid())
);
CREATE POLICY "mocks_admin_all" ON public.mock_interviews FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 5. RESUMES TABLE
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  content TEXT,
  resume_score INT,
  clarity_score INT,
  skill_alignment_score INT,
  missing_keywords TEXT[],
  improvement_suggestions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "resumes_select_own" ON public.resumes FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.students WHERE students.id = resumes.student_id AND students.user_id = auth.uid())
);
CREATE POLICY "resumes_insert_own" ON public.resumes FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.students WHERE students.id = resumes.student_id AND students.user_id = auth.uid())
);
CREATE POLICY "resumes_update_own" ON public.resumes FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.students WHERE students.id = resumes.student_id AND students.user_id = auth.uid())
);
CREATE POLICY "resumes_admin_all" ON public.resumes FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 6. GROWTH_METRICS TABLE
CREATE TABLE IF NOT EXISTS public.growth_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  overall_readiness_score INT,
  growth_rate FLOAT,
  forecast_7day INT,
  forecast_14day INT,
  streak_count INT DEFAULT 0,
  last_practice_date TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(student_id)
);

ALTER TABLE public.growth_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "growth_select_own" ON public.growth_metrics FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.students WHERE students.id = growth_metrics.student_id AND students.user_id = auth.uid())
);
CREATE POLICY "growth_insert_own" ON public.growth_metrics FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.students WHERE students.id = growth_metrics.student_id AND students.user_id = auth.uid())
);
CREATE POLICY "growth_update_own" ON public.growth_metrics FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.students WHERE students.id = growth_metrics.student_id AND students.user_id = auth.uid())
);
CREATE POLICY "growth_admin_all" ON public.growth_metrics FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 7. ADMIN_ASSESSMENTS TABLE
CREATE TABLE IF NOT EXISTS public.admin_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  title VARCHAR(255),
  batch VARCHAR(100),
  department VARCHAR(100),
  domain VARCHAR(100),
  difficulty_level VARCHAR(50),
  question_ids UUID[],
  target_completion_date DATE,
  participation_count INT DEFAULT 0,
  completion_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.admin_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_assessments_admin_all" ON public.admin_assessments FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 8. ASSESSMENT_RESPONSES TABLE
CREATE TABLE IF NOT EXISTS public.assessment_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_assessment_id UUID NOT NULL REFERENCES public.admin_assessments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  score INT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.assessment_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "assessment_responses_select_own" ON public.assessment_responses FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.students WHERE students.id = assessment_responses.student_id AND students.user_id = auth.uid())
  OR auth.jwt() ->> 'role' = 'admin'
);
CREATE POLICY "assessment_responses_insert_own" ON public.assessment_responses FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.students WHERE students.id = assessment_responses.student_id AND students.user_id = auth.uid())
  OR auth.jwt() ->> 'role' = 'admin'
);
CREATE POLICY "assessment_responses_update_own" ON public.assessment_responses FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.students WHERE students.id = assessment_responses.student_id AND students.user_id = auth.uid())
  OR auth.jwt() ->> 'role' = 'admin'
);

-- 9. QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain VARCHAR(100),
  category VARCHAR(100),
  difficulty VARCHAR(50),
  question_text TEXT NOT NULL,
  options JSONB,
  correct_answer VARCHAR(50),
  explanation TEXT,
  skills_tested TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "questions_select_all" ON public.questions FOR SELECT USING (true);
CREATE POLICY "questions_admin_write" ON public.questions FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "questions_admin_update" ON public.questions FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- 10. GROWTH_CARDS TABLE
CREATE TABLE IF NOT EXISTS public.growth_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  snapshot_readiness_score INT,
  strongest_skill VARCHAR(100),
  weakest_skill VARCHAR(100),
  forecast_projection INT,
  referral_code VARCHAR(50) UNIQUE,
  whatsapp_shared_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.growth_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "growth_cards_select_own" ON public.growth_cards FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.students WHERE students.id = growth_cards.student_id AND students.user_id = auth.uid())
);
CREATE POLICY "growth_cards_insert_own" ON public.growth_cards FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.students WHERE students.id = growth_cards.student_id AND students.user_id = auth.uid())
);
CREATE POLICY "growth_cards_select_public" ON public.growth_cards FOR SELECT USING (referral_code IS NOT NULL);

-- Create indexes for performance
CREATE INDEX idx_students_user_id ON public.students(user_id);
CREATE INDEX idx_assessments_student_id ON public.assessments(student_id);
CREATE INDEX idx_assessments_created_at ON public.assessments(created_at);
CREATE INDEX idx_skill_performance_student_id ON public.skill_performance(student_id);
CREATE INDEX idx_growth_metrics_student_id ON public.growth_metrics(student_id);
CREATE INDEX idx_growth_cards_student_id ON public.growth_cards(student_id);
CREATE INDEX idx_growth_cards_referral_code ON public.growth_cards(referral_code);

-- Create trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON public.assessments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resumes_updated_at BEFORE UPDATE ON public.resumes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_growth_metrics_updated_at BEFORE UPDATE ON public.growth_metrics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
