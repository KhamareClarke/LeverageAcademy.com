-- Fix the handle_new_user trigger function to handle errors better
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Use ON CONFLICT to handle cases where user already exists
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NULL),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.users.full_name),
    role = COALESCE(EXCLUDED.role, public.users.role);
  
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log the error but don't fail the auth user creation
    RAISE WARNING 'Error creating user profile: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Also add a policy to allow the trigger function to insert
-- The SECURITY DEFINER should handle this, but let's be explicit
DROP POLICY IF EXISTS "Allow trigger to create users" ON public.users;
CREATE POLICY "Allow trigger to create users"
  ON public.users FOR INSERT
  WITH CHECK (true);

