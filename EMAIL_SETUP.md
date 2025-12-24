# Email Setup Guide - Send Verification Codes via Email

## Quick Setup Options

### Option 1: Resend (Recommended - Easiest)

1. **Sign up at [resend.com](https://resend.com)** (free tier available)
2. **Get your API key** from the dashboard
3. **Add to `.env.local`**:
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   FROM_EMAIL=noreply@yourdomain.com
   ```
4. **Install Resend**:
   ```bash
   npm install resend
   ```

### Option 2: SendGrid

1. **Sign up at [sendgrid.com](https://sendgrid.com)** (free tier available)
2. **Create API key** in Settings → API Keys
3. **Add to `.env.local`**:
   ```env
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
   FROM_EMAIL=noreply@yourdomain.com
   ```
4. **Install SendGrid**:
   ```bash
   npm install @sendgrid/mail
   ```

### Option 3: Mailgun

1. **Sign up at [mailgun.com](https://mailgun.com)** (free tier available)
2. **Get API key** from dashboard
3. **Add to `.env.local`**:
   ```env
   MAILGUN_API_KEY=xxxxxxxxxxxxx
   MAILGUN_DOMAIN=yourdomain.com
   FROM_EMAIL=noreply@yourdomain.com
   ```

### Option 4: Configure Supabase SMTP

1. Go to **Supabase Dashboard** → **Authentication** → **Settings** → **SMTP Settings**
2. Configure your SMTP provider
3. The code will use Supabase's email service automatically

## After Setup

1. **Restart your dev server**:
   ```bash
   npm run dev
   ```

2. **Test it**:
   - Sign up with your email
   - Check your email inbox
   - You should receive the verification code

## Email Template

The email will include:
- Your verification code (6 digits)
- Expiration time (1 hour)
- Branded design matching Leverage Academy

## Troubleshooting

- **Not receiving emails?** Check spam folder
- **Email service error?** Check API keys in `.env.local`
- **Still not working?** Check server logs for errors

## Development Note

Once you configure an email service, codes will be sent via email instead of showing in alerts.

