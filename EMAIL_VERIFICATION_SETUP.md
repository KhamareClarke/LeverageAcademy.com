# Email Verification Setup Guide

## Step 1: Enable Email Confirmation in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Settings** (or **Configuration**)
3. Find **Email Auth** section
4. **Enable "Confirm email"** (turn it ON)
5. Save the changes

## Step 2: Configure OTP Codes (Important!)

Supabase needs to be configured to send OTP codes instead of magic links:

1. Go to **Authentication** → **Settings** → **Auth Providers**
2. Find **Email** provider settings
3. Look for **"OTP"** or **"One-Time Password"** option
4. Enable OTP for email verification
5. Or go to **Authentication** → **URL Configuration**
6. Set **"Redirect URLs"** to include your verification page: `http://localhost:3000/verify-email`

## Step 3: Configure Email Template

1. Go to **Authentication** → **Email Templates**
2. Find the **"Confirm signup"** or **"Magic Link"** template
3. Update the template to show the OTP code
4. The template should include: `{{ .Token }}` or `{{ .TokenHash }}` for the code
5. Example template:
   ```
   Your verification code is: {{ .Token }}
   This code will expire in 1 hour.
   ```

## Step 3: Configure SMTP (Required for Production)

For email verification to work, you need to configure an email provider:

### Option A: Use Supabase's Built-in Email (Limited)
- Works for development/testing
- Limited emails per day on free tier

### Option B: Configure Custom SMTP (Recommended for Production)

1. Go to **Authentication** → **Settings** → **SMTP Settings**
2. Choose a provider:
   - **Gmail**: Use Gmail SMTP
   - **SendGrid**: Use SendGrid API
   - **Mailgun**: Use Mailgun API
   - **Custom SMTP**: Enter your SMTP server details

3. Enter your SMTP credentials
4. Test the connection
5. Save

## How It Works

1. **User Signs Up**:
   - User enters email, password, and name
   - Supabase sends a 6-digit verification code to their email
   - User is redirected to `/verify-email` page

2. **User Verifies Email**:
   - User enters the 6-digit code from their email
   - Code is verified against Supabase
   - If correct, email is confirmed and user can login

3. **User Logs In**:
   - System checks if email is verified
   - If not verified, user is redirected to verification page
   - If verified, user can access their dashboard

## Features

- ✅ 6-digit code verification
- ✅ Auto-focus on next input field
- ✅ Paste support for code
- ✅ Resend code functionality
- ✅ Email verification required before login
- ✅ Beautiful UI matching your design system

## Testing

1. Sign up with a real email address
2. Check your email for the 6-digit code
3. Enter the code on the verification page
4. You'll be redirected to your dashboard
5. Try logging in - it should work now!

## Troubleshooting

### Code not received?
- Check spam folder
- Click "Resend code" button
- Verify email address is correct
- Check SMTP configuration in Supabase

### Code not working?
- Make sure you're using the latest code from email
- Codes expire after a certain time (usually 1 hour)
- Request a new code if expired

### Still having issues?
- Check Supabase logs in dashboard
- Verify SMTP settings are correct
- Make sure email confirmation is enabled

