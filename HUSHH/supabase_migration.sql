-- Create the assessments table
CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    test_number INT DEFAULT 1,
    score INT NOT NULL,
    skill_categories JSONB DEFAULT '{}'::jsonb,
    difficulty_progression TEXT[] DEFAULT '{}'::text[],
    duration_seconds INT DEFAULT 0,
    weak_areas TEXT[] DEFAULT '{}'::text[],
    strong_areas TEXT[] DEFAULT '{}'::text[],
    growth_rate_vs_previous FLOAT DEFAULT 0,
    forecast_7day INT DEFAULT 0,
    forecast_14day INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Basic RLS for assessments
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own assessments"
    ON assessments FOR SELECT
    USING (auth.uid() = student_id);

CREATE POLICY "Users can insert their own assessments"
    ON assessments FOR INSERT
    WITH CHECK (auth.uid() = student_id);

-- Create the students table
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    roll_number TEXT,
    email TEXT,
    academic_year INT,
    department TEXT,
    target_role TEXT,
    preferred_companies TEXT[] DEFAULT '{}'::text[],
    weekly_availability INT DEFAULT 10,
    classification_level TEXT,
    domain_preference TEXT,
    knows_target_domain BOOLEAN DEFAULT FALSE,
    solved_problems JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Basic RLS for students
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own student profile"
    ON students FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own student profile"
    ON students FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own student profile"
    ON students FOR UPDATE
    USING (auth.uid() = user_id);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_student_id ON assessments(student_id);
