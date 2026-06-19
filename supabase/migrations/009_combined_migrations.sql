-- Combined Migration: Estimated Time, Quizzes, and Student Management
-- Run this file in Supabase SQL Editor to create all required tables

-- ============================================
-- PART 1: Estimated Time and Quizzes
-- ============================================

-- Add estimated_time to courses (in minutes)
ALTER TABLE IF EXISTS public.courses 
  ADD COLUMN IF NOT EXISTS estimated_time INTEGER DEFAULT 0;

-- Add estimated_time to modules (in minutes)
ALTER TABLE IF EXISTS public.modules 
  ADD COLUMN IF NOT EXISTS estimated_time INTEGER DEFAULT 0;

-- Add estimated_time to lessons (in minutes)
ALTER TABLE IF EXISTS public.lessons 
  ADD COLUMN IF NOT EXISTS estimated_time INTEGER DEFAULT 0;

-- Create quizzes table (one quiz per module)
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  questions JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of question objects
  passing_score INTEGER DEFAULT 0, -- Not required to pass, just for awareness
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(module_id) -- One quiz per module
);

-- Create quiz_attempts table (tracks student quiz attempts)
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  answers JSONB NOT NULL DEFAULT '[]'::jsonb, -- Student's answers
  score INTEGER NOT NULL DEFAULT 0, -- Score out of 100
  total_questions INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create module_progress table to track module completion
CREATE TABLE IF NOT EXISTS public.module_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  lessons_completed INTEGER NOT NULL DEFAULT 0,
  total_lessons INTEGER NOT NULL DEFAULT 0,
  quiz_completed BOOLEAN NOT NULL DEFAULT false,
  quiz_score INTEGER,
  module_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_quizzes_module_id ON public.quizzes(module_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_course_id ON public.quizzes(course_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON public.quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id ON public.quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_module_id ON public.quiz_attempts(module_id);
CREATE INDEX IF NOT EXISTS idx_module_progress_user_id ON public.module_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_module_progress_module_id ON public.module_progress(module_id);
CREATE INDEX IF NOT EXISTS idx_module_progress_course_id ON public.module_progress(course_id);

-- RLS Policies for quizzes
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

-- Enrolled users can view quizzes for their courses
DROP POLICY IF EXISTS "Enrolled users can view quizzes" ON public.quizzes;
CREATE POLICY "Enrolled users can view quizzes"
  ON public.quizzes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.enrollments
      WHERE enrollments.course_id = quizzes.course_id 
      AND enrollments.user_id = auth.uid()
      AND enrollments.payment_status = 'paid'
    )
  );

-- Admins can manage quizzes
DROP POLICY IF EXISTS "Admins can manage quizzes" ON public.quizzes;
CREATE POLICY "Admins can manage quizzes"
  ON public.quizzes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- RLS Policies for quiz_attempts
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Users can view their own quiz attempts
DROP POLICY IF EXISTS "Users can view their own quiz attempts" ON public.quiz_attempts;
CREATE POLICY "Users can view their own quiz attempts"
  ON public.quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own quiz attempts
DROP POLICY IF EXISTS "Users can create quiz attempts" ON public.quiz_attempts;
CREATE POLICY "Users can create quiz attempts"
  ON public.quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all quiz attempts
DROP POLICY IF EXISTS "Admins can view all quiz attempts" ON public.quiz_attempts;
CREATE POLICY "Admins can view all quiz attempts"
  ON public.quiz_attempts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- RLS Policies for module_progress
ALTER TABLE public.module_progress ENABLE ROW LEVEL SECURITY;

-- Users can view their own module progress
DROP POLICY IF EXISTS "Users can view their own module progress" ON public.module_progress;
CREATE POLICY "Users can view their own module progress"
  ON public.module_progress FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own module progress
DROP POLICY IF EXISTS "Users can update their own module progress" ON public.module_progress;
CREATE POLICY "Users can update their own module progress"
  ON public.module_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- System can create module progress (via triggers or API)
DROP POLICY IF EXISTS "System can create module progress" ON public.module_progress;
CREATE POLICY "System can create module progress"
  ON public.module_progress FOR INSERT
  WITH CHECK (true);

-- Admins can view all module progress
DROP POLICY IF EXISTS "Admins can view all module progress" ON public.module_progress;
CREATE POLICY "Admins can view all module progress"
  ON public.module_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- ============================================
-- PART 2: Student Management
-- ============================================

-- Add status to users table
ALTER TABLE IF EXISTS public.users 
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'blocked'));

-- Add assigned_at to enrollments to track when course was assigned
ALTER TABLE IF EXISTS public.enrollments 
  ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS assigned_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS unassigned_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS unassigned_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Update existing enrollments to have assigned_at = enrolled_at
UPDATE public.enrollments 
SET assigned_at = enrolled_at 
WHERE assigned_at IS NULL;

-- Create index for active enrollments
CREATE INDEX IF NOT EXISTS idx_enrollments_active ON public.enrollments(user_id, is_active) WHERE is_active = true;

-- Function to create enrollments for approved applications when user registers
CREATE OR REPLACE FUNCTION public.link_approved_applications_to_user()
RETURNS TRIGGER AS $$
BEGIN
  -- When a new user is created, check for approved applications with matching email
  -- and create enrollments for them
  INSERT INTO public.enrollments (user_id, course_id, payment_status, assigned_at, is_active)
  SELECT 
    NEW.id,
    ca.course_id,
    'pending',
    ca.reviewed_at, -- Use reviewed_at as assigned_at
    true
  FROM public.course_applications ca
  WHERE ca.email = NEW.email
    AND ca.status = 'approved'
    AND ca.user_id IS NULL -- Only link applications that weren't already linked
    AND NOT EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.user_id = NEW.id AND e.course_id = ca.course_id
    )
  ON CONFLICT (user_id, course_id) DO NOTHING;
  
  -- Update course_applications to link user_id
  UPDATE public.course_applications
  SET user_id = NEW.id
  WHERE email = NEW.email
    AND user_id IS NULL;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to link approved applications when user is created
DROP TRIGGER IF EXISTS on_user_created_link_applications ON public.users;
CREATE TRIGGER on_user_created_link_applications
  AFTER INSERT ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.link_approved_applications_to_user();

-- Update RLS policies to respect student status
-- Users can only access their own data if they are active
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (
    auth.uid() = id AND status = 'active'
  );

-- Admins can view all users
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
CREATE POLICY "Admins can view all users"
  ON public.users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Blocked students cannot access enrollments
DROP POLICY IF EXISTS "Users can view their own enrollments" ON public.enrollments;
CREATE POLICY "Users can view their own enrollments"
  ON public.enrollments FOR SELECT
  USING (
    auth.uid() = user_id 
    AND is_active = true
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.status = 'active'
    )
  );

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Migration completed successfully! All tables and policies have been created.';
END $$;



