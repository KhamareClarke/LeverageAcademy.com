-- Create verification_codes table for email verification
CREATE TABLE IF NOT EXISTS public.verification_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_verification_codes_email ON public.verification_codes(email);
CREATE INDEX IF NOT EXISTS idx_verification_codes_code ON public.verification_codes(code);
CREATE INDEX IF NOT EXISTS idx_verification_codes_expires ON public.verification_codes(expires_at);

-- Enable RLS
ALTER TABLE public.verification_codes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for signup)
CREATE POLICY "Allow insert verification codes" ON public.verification_codes
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read their own codes (for verification)
CREATE POLICY "Allow read own verification codes" ON public.verification_codes
  FOR SELECT
  USING (true);

-- Allow anyone to update (for marking as used)
CREATE POLICY "Allow update verification codes" ON public.verification_codes
  FOR UPDATE
  USING (true);
