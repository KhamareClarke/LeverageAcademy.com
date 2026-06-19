-- Migration: Add estimated time and quiz system
-- Adds estimated_time to courses, modules, lessons
-- Creates quizzes and quiz_attempts tables

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

-- Add module_completed_at to track when module is fully completed (all lessons + quiz)
ALTER TABLE IF EXISTS public.lesson_progress 
  ADD COLUMN IF NOT EXISTS module_completed_at TIMESTAMPTZ;

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
CREATE POLICY "Users can view their own quiz attempts"
  ON public.quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own quiz attempts
CREATE POLICY "Users can create quiz attempts"
  ON public.quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all quiz attempts
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
CREATE POLICY "Users can view their own module progress"
  ON public.module_progress FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own module progress
CREATE POLICY "Users can update their own module progress"
  ON public.module_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- System can create module progress (via triggers or API)
CREATE POLICY "System can create module progress"
  ON public.module_progress FOR INSERT
  WITH CHECK (true);

-- Admins can view all module progress
CREATE POLICY "Admins can view all module progress"
  ON public.module_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );



