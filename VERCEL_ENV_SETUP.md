# Vercel Environment Variables Setup

## Quick Setup Instructions

1. Go to your Vercel project: https://vercel.com/dashboard
2. Select your **LeverageAcademy.com** project
3. Go to **Settings** → **Environment Variables**
4. Add each variable below (click "Add New" for each)

## Required Environment Variables

### Stripe Configuration

1. **STRIPE_SECRET_KEY**
   - Key: `STRIPE_SECRET_KEY`
   - Value: `sk_live_...` (add your live key in Vercel)
   - Environment: ✅ Production, ✅ Preview, ✅ Development

2. **STRIPE_WEBHOOK_SECRET**
   - Key: `STRIPE_WEBHOOK_SECRET`
   - Value: `whsec_...` (add your webhook signing secret)
   - Environment: ✅ Production, ✅ Preview, ✅ Development

3. **NEXT_PUBLIC_SITE_URL**
   - Key: `NEXT_PUBLIC_SITE_URL`
   - Value: `https://leverageacademy.vercel.app`
   - Environment: ✅ Production, ✅ Preview, ✅ Development

4. **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY** (Optional - for client-side if needed)
   - Key: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Value: `pk_live_...` (add your publishable key)
   - Environment: ✅ Production, ✅ Preview, ✅ Development

### Supabase Configuration

4. **SUPABASE_SERVICE_ROLE_KEY**
   - Value: Your Supabase service role key (from Supabase Dashboard → Settings → API)
   - Environment: Production, Preview, Development
   - ⚠️ Keep this secret! Never expose in client-side code.

5. **NEXT_PUBLIC_SUPABASE_URL**
   - Value: Your Supabase project URL
   - Environment: Production, Preview, Development

6. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Value: Your Supabase anon/public key
   - Environment: Production, Preview, Development

### Email Configuration (for notifications)

7. **SMTP_HOST**
   - Value: Your SMTP server host (e.g., `smtp.gmail.com`)
   - Environment: Production, Preview, Development

8. **SMTP_PORT**
   - Value: `587` or `465`
   - Environment: Production, Preview, Development

9. **SMTP_USER**
   - Value: Your email address
   - Environment: Production, Preview, Development

10. **SMTP_PASS**
    - Value: Your email password or app password
    - Environment: Production, Preview, Development

## After Adding Variables

1. **Redeploy** your application for changes to take effect
2. Go to **Deployments** → Click the three dots on the latest deployment → **Redeploy**

## Verify Setup

1. Check that webhook is receiving events in Stripe Dashboard → **Developers** → **Webhooks**
2. Test a payment with a test card to ensure enrollment is created
3. Check Vercel function logs for any errors

## Security Notes

- ✅ All keys are encrypted in Vercel
- ✅ Never commit these values to Git
- ✅ Use different keys for test/production
- ✅ Rotate keys if exposed
