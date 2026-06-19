-- Migration: Update course structure and application system
-- Adds modules, updates applications to support pre-signup, enhances lessons

-- Rename applications to course_applications and update structure
ALTER TABLE IF EXISTS public.applications RENAME TO course_applications;

-- Update course_applications table to support pre-signup applications
ALTER TABLE IF EXISTS public.course_applications 
  DROP CONSTRAINT IF EXISTS applications_user_id_fkey,
  DROP CONSTRAINT IF EXISTS applications_course_id_fkey,
  DROP CONSTRAINT IF EXISTS applications_reviewed_by_fkey;

-- Make user_id nullable (for pre-signup applications)
ALTER TABLE IF EXISTS public.course_applications 
  ALTER COLUMN user_id DROP NOT NULL;

-- Add new fields
ALTER TABLE IF EXISTS public.course_applications 
  ADD COLUMN IF NOT EXISTS name TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS goals TEXT,
  ADD COLUMN IF NOT EXISTS experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
  ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Re-add foreign key constraints (with ON DELETE SET NULL for user_id since it can be null)
ALTER TABLE IF EXISTS public.course_applications 
  ADD CONSTRAINT course_applications_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;

ALTER TABLE IF EXISTS public.course_applications 
  ADD CONSTRAINT course_applications_course_id_fkey 
  FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.course_applications 
  ADD CONSTRAINT course_applications_reviewed_by_fkey 
  FOREIGN KEY (reviewed_by) REFERENCES public.users(id) ON DELETE SET NULL;

-- Create modules table
CREATE TABLE IF NOT EXISTS public.modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update lessons table to include module relationship and enhanced content
ALTER TABLE IF EXISTS public.lessons 
  ADD COLUMN IF NOT EXISTS module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS video_url TEXT,
  ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'text' CHECK (content_type IN ('text', 'video', 'mixed'));

-- Handle order_index column - rename lesson_order if it exists, or add order_index if neither exists
DO $$ 
BEGIN
  -- Check if lesson_order exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'lesson_order'
  ) THEN
    -- Check if order_index already exists
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'order_index'
    ) THEN
      -- Both exist, drop lesson_order and keep order_index
      ALTER TABLE public.lessons DROP COLUMN lesson_order;
    ELSE
      -- Only lesson_order exists, rename it
      ALTER TABLE public.lessons RENAME COLUMN lesson_order TO order_index;
    END IF;
  ELSIF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'order_index'
  ) THEN
    -- Neither exists, add order_index
    ALTER TABLE public.lessons ADD COLUMN order_index INTEGER NOT NULL DEFAULT 0;
  END IF;
END $$;

-- Update enrollments to include Stripe payment intent
ALTER TABLE IF EXISTS public.enrollments 
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_modules_course_id ON public.modules(course_id);
CREATE INDEX IF NOT EXISTS idx_modules_order_index ON public.modules(order_index);
CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON public.lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order_index ON public.lessons(order_index);
CREATE INDEX IF NOT EXISTS idx_course_applications_email ON public.course_applications(email);
CREATE INDEX IF NOT EXISTS idx_course_applications_status ON public.course_applications(status);

-- Update RLS policies for course_applications
DROP POLICY IF EXISTS "Users can view their own applications" ON public.course_applications;
DROP POLICY IF EXISTS "Admins can view all applications" ON public.course_applications;
DROP POLICY IF EXISTS "Users can create applications" ON public.course_applications;
DROP POLICY IF EXISTS "Admins can update applications" ON public.course_applications;

-- Users can view their own applications (if user_id is set)
CREATE POLICY "Users can view their own applications"
  ON public.course_applications FOR SELECT
  USING (user_id IS NULL OR auth.uid() = user_id);

-- Anyone can view applications by email (for pre-signup tracking)
CREATE POLICY "Anyone can view applications by email"
  ON public.course_applications FOR SELECT
  USING (true);

-- Admins can view all applications
CREATE POLICY "Admins can view all applications"
  ON public.course_applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Anyone can create applications (for pre-signup)
CREATE POLICY "Anyone can create applications"
  ON public.course_applications FOR INSERT
  WITH CHECK (true);

-- Users can update their own applications (if user_id matches)
CREATE POLICY "Users can update their own applications"
  ON public.course_applications FOR UPDATE
  USING (user_id IS NULL OR auth.uid() = user_id);

-- Admins can update all applications
CREATE POLICY "Admins can update all applications"
  ON public.course_applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- RLS policies for modules
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

-- Anyone can view published course modules
CREATE POLICY "Anyone can view modules for published courses"
  ON public.modules FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = modules.course_id AND courses.status = 'published'
    )
  );

-- Enrolled users can view modules
CREATE POLICY "Enrolled users can view modules"
  ON public.modules FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.enrollments
      WHERE enrollments.course_id = modules.course_id 
      AND enrollments.user_id = auth.uid()
      AND enrollments.payment_status = 'paid'
    )
  );

-- Admins can view all modules
CREATE POLICY "Admins can view all modules"
  ON public.modules FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Admins can manage modules
CREATE POLICY "Admins can manage modules"
  ON public.modules FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Update lessons RLS to check module access
DROP POLICY IF EXISTS "Anyone can view lessons for published courses" ON public.lessons;
DROP POLICY IF EXISTS "Enrolled users can view lessons" ON public.lessons;

-- Anyone can view lessons for published courses (if module is accessible)
CREATE POLICY "Anyone can view lessons for published courses"
  ON public.lessons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      JOIN public.modules ON modules.course_id = courses.id
      WHERE courses.id = lessons.course_id 
      AND modules.id = lessons.module_id
      AND courses.status = 'published'
    )
  );

-- Enrolled users can view lessons
CREATE POLICY "Enrolled users can view lessons"
  ON public.lessons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.enrollments
      WHERE enrollments.course_id = lessons.course_id 
      AND enrollments.user_id = auth.uid()
      AND enrollments.payment_status = 'paid'
    )
  );

