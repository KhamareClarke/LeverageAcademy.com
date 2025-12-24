-- Fix RLS policy for users table to avoid circular dependency
-- Drop the existing admin policy
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;

-- Create a better policy that checks metadata first
CREATE POLICY "Admins can view all users"
  ON public.users FOR SELECT
  USING (
    -- Check if user metadata has admin role (avoids circular dependency)
    (auth.jwt() ->> 'user_metadata')::jsonb->>'role' = 'admin'
    OR
    -- Also allow users to view their own profile
    auth.uid() = id
  );

