-- Migration: Student Management and Course Assignments
-- Adds student status (active/blocked) and tracks course assignments

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

