-- Migration: Add Course Completion Quiz Support
-- Allows quizzes to be associated with courses (for course completion quizzes)

-- Update quizzes table to make module_id nullable (for course-level quizzes)
ALTER TABLE IF EXISTS public.quizzes 
  ALTER COLUMN module_id DROP NOT NULL;

-- Add quiz_type to distinguish between module and course quizzes
ALTER TABLE IF EXISTS public.quizzes 
  ADD COLUMN IF NOT EXISTS quiz_type TEXT DEFAULT 'module' CHECK (quiz_type IN ('module', 'course'));

-- Update unique constraint to allow course-level quizzes
-- Remove old constraint if exists
ALTER TABLE IF EXISTS public.quizzes 
  DROP CONSTRAINT IF EXISTS quizzes_module_id_key;

-- Add new constraint: one quiz per module OR one quiz per course
-- For module quizzes: module_id must be unique
-- For course quizzes: course_id must be unique (with NULL module_id)
CREATE UNIQUE INDEX IF NOT EXISTS idx_quizzes_module_unique 
  ON public.quizzes(module_id) 
  WHERE module_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_quizzes_course_unique 
  ON public.quizzes(course_id) 
  WHERE module_id IS NULL AND quiz_type = 'course';

-- Update quiz_attempts to handle course-level quizzes
ALTER TABLE IF EXISTS public.quiz_attempts 
  ALTER COLUMN module_id DROP NOT NULL;

-- Add course_completion_quiz_attempted flag to track if course quiz was attempted
ALTER TABLE IF EXISTS public.enrollments 
  ADD COLUMN IF NOT EXISTS course_completion_quiz_attempted BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS course_completion_quiz_score INTEGER,
  ADD COLUMN IF NOT EXISTS course_completed_at TIMESTAMPTZ;



