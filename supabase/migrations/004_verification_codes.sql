-- Table to store verification codes
CREATE TABLE IF NOT EXISTS public.verification_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 hour'),
  used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_verification_codes_email ON public.verification_codes(email);
CREATE INDEX IF NOT EXISTS idx_verification_codes_code ON public.verification_codes(code);
CREATE INDEX IF NOT EXISTS idx_verification_codes_user_id ON public.verification_codes(user_id);

-- RLS policies
ALTER TABLE public.verification_codes ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own codes (for debugging)
CREATE POLICY "Users can view their own codes"
  ON public.verification_codes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid() AND email = verification_codes.email
    )
  );

-- Allow service role to insert codes (via SECURITY DEFINER function)
CREATE POLICY "Allow code creation"
  ON public.verification_codes FOR INSERT
  WITH CHECK (true);

-- Function to generate and store verification code
CREATE OR REPLACE FUNCTION public.generate_verification_code(p_email TEXT, p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_code TEXT;
BEGIN
  -- Generate 6-digit code
  v_code := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
  
  -- Insert code
  INSERT INTO public.verification_codes (email, code, user_id, expires_at)
  VALUES (p_email, v_code, p_user_id, NOW() + INTERVAL '1 hour');
  
  RETURN v_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify code
CREATE OR REPLACE FUNCTION public.verify_code(p_email TEXT, p_code TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_code_record RECORD;
BEGIN
  -- Find valid, unused code
  SELECT * INTO v_code_record
  FROM public.verification_codes
  WHERE email = p_email
    AND code = p_code
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

-- Cleanup function for expired codes (can be run periodically)
CREATE OR REPLACE FUNCTION public.cleanup_expired_codes()
RETURNS void AS $$
BEGIN
  DELETE FROM public.verification_codes
  WHERE expires_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

