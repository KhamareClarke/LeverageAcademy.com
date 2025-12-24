# How to Disable Email Confirmation in Supabase

If you're getting "Error sending confirmation email" when users sign up, you can disable email confirmation in Supabase.

## Option 1: Disable Email Confirmation (Recommended for Development)

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Settings** (or **Configuration**)
3. Find **Email Auth** section
4. Look for **"Enable email confirmations"** or **"Confirm email"** toggle
5. **Turn it OFF**
6. Save the changes

Now users can sign up and sign in immediately without email confirmation.

## Option 2: Configure Email Provider (For Production)

If you want to keep email confirmation but fix the error:

1. Go to **Authentication** → **Settings** → **SMTP Settings**
2. Configure an SMTP provider:
   - **Gmail**: Use Gmail SMTP
   - **SendGrid**: Use SendGrid API
   - **Mailgun**: Use Mailgun API
   - **Custom SMTP**: Enter your SMTP server details

3. Or use Supabase's built-in email service (limited on free tier)

## Option 3: Auto-Confirm Users (Alternative)

You can also auto-confirm users when creating them via the dashboard:

1. When creating a user in **Authentication** → **Users**
2. Check **"Auto Confirm User"** checkbox
3. The user will be confirmed immediately

## Current Behavior

With the updated code:
- If email confirmation fails, the user account is still created
- Users can sign in immediately (if email confirmation is disabled)
- A helpful message is shown if email confirmation is required

## Test It

After disabling email confirmation:
1. Try signing up a new user
2. You should be able to sign in immediately
3. No email confirmation error should appear

