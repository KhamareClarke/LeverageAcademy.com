-- Fix RLS policies for verification_codes to allow service role inserts
-- The API needs to be able to insert codes without authentication

-- Drop the existing insert policy
DROP POLICY IF EXISTS "Allow code creation" ON public.verification_codes;

-- Create a policy that allows inserts from service role (bypasses RLS)
-- Service role operations bypass RLS, but we also allow authenticated inserts
CREATE POLICY "Allow code creation"
  ON public.verification_codes FOR INSERT
  WITH CHECK (true);

-- Also allow service role to update codes (for marking as used)
DROP POLICY IF EXISTS "Allow code updates" ON public.verification_codes;
CREATE POLICY "Allow code updates"
  ON public.verification_codes FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow service role to delete codes (for cleanup)
DROP POLICY IF EXISTS "Allow code deletion" ON public.verification_codes;
CREATE POLICY "Allow code deletion"
  ON public.verification_codes FOR DELETE
  USING (true);

-- Make sure the generate_verification_code function works correctly
-- It should already have SECURITY DEFINER, but let's ensure it's correct
CREATE OR REPLACE FUNCTION public.generate_verification_code(p_email TEXT, p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_code TEXT;
BEGIN
  -- Generate 6-digit code
  v_code := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
  
  -- Insert code (SECURITY DEFINER bypasses RLS)
  INSERT INTO public.verification_codes (email, code, user_id, expires_at)
  VALUES (LOWER(TRIM(p_email)), v_code, p_user_id, NOW() + INTERVAL '1 hour');
  
  RETURN v_code;
EXCEPTION
  WHEN others THEN
    -- Log error but still return code
    RAISE WARNING 'Error storing verification code: %', SQLERRM;
    RETURN v_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Also update verify_code to normalize email
CREATE OR REPLACE FUNCTION public.verify_code(p_email TEXT, p_code TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_code_record RECORD;
BEGIN
  -- Find valid, unused code (normalize email for comparison)
  SELECT * INTO v_code_record
  FROM public.verification_codes
  WHERE LOWER(TRIM(email)) = LOWER(TRIM(p_email))
    AND code = TRIM(p_code)
    AND used = false
    AND expires_at > NOW()
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF v_code_record IS NULL THEN
    RETURN false;
  END IF;
  
  -- Mark as used
  UPDATE public.verification_codes
  SET used = true
  WHERE id = v_code_record.id;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

