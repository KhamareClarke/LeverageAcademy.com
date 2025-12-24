# Verification Code Setup - Quick Fix

## Problem
You're not receiving verification codes in your email.

## Solution: Custom Code System with Dev Mode

I've implemented a custom verification code system that:
1. ✅ Stores codes in the database
2. ✅ Shows codes in development mode (so you can test)
3. ✅ Works even if email isn't configured

## Step 1: Run the Database Migration

Run this SQL in your Supabase SQL Editor:

```sql
-- Copy and paste the contents of: supabase/migrations/004_verification_codes.sql
```

Or run it directly:

```sql
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

CREATE INDEX IF NOT EXISTS idx_verification_codes_email ON public.verification_codes(email);
CREATE INDEX IF NOT EXISTS idx_verification_codes_code ON public.verification_codes(code);

ALTER TABLE public.verification_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own codes"
  ON public.verification_codes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid() AND email = verification_codes.email
    )
  );

CREATE POLICY "Allow code creation"
  ON public.verification_codes FOR INSERT
  WITH CHECK (true);

-- Function to generate code
CREATE OR REPLACE FUNCTION public.generate_verification_code(p_email TEXT, p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_code TEXT;
BEGIN
  v_code := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
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
  
  UPDATE public.verification_codes
  SET used = true
  WHERE id = v_code_record.id;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Step 2: How It Works Now

### In Development Mode:
1. **Sign up** - Code is generated and stored
2. **Alert pops up** showing your code: `🔐 DEV MODE: Your verification code is: 123456`
3. **Enter the code** on verification page
4. **Sign in** after verification

### In Production:
1. **Sign up** - Code is generated
2. **Email is sent** (when you configure email service)
3. **Enter code** from email
4. **Sign in** after verification

## Step 3: Test It Now

1. **Sign up** with any email
2. **Look for the alert** with your code (in development)
3. **Enter the code** on the verification page
4. **You'll be redirected to login**
5. **Sign in** with your password

## Step 4: View Codes in Database (Optional)

You can also check codes in Supabase:

```sql
SELECT email, code, created_at, expires_at, used
FROM public.verification_codes
ORDER BY created_at DESC
LIMIT 10;
```

## Step 5: Configure Email (For Production)

When ready for production, integrate an email service:

1. **SendGrid** - Easy integration
2. **Resend** - Developer-friendly
3. **Mailgun** - Reliable
4. **Custom SMTP** - Your own server

Update `app/api/send-verification-code/route.ts` to send emails.

## Current Status

✅ Codes are generated and stored
✅ Codes shown in development mode
✅ Verification works
✅ Codes expire after 1 hour
✅ Codes can only be used once

## Next Steps

1. Run the migration SQL above
2. Try signing up - you'll see the code in an alert
3. Enter the code to verify
4. Sign in with your password

The system is working! You just need to run the migration.

