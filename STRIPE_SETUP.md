# Stripe Payment Integration Setup

This guide will help you set up Stripe payments for the Leverage Academy platform.

## Prerequisites

1. A Stripe account (sign up at https://stripe.com)
2. Access to your Supabase project environment variables

## Step 1: Get Your Stripe API Keys

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to **Developers** → **API keys**
3. Copy your **Publishable key** and **Secret key**
   - For testing, use the **Test mode** keys (they start with `pk_test_` and `sk_test_`)
   - For production, use the **Live mode** keys (they start with `pk_live_` and `sk_live_`)

## Step 2: Set Up Webhook Endpoint

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Set the endpoint URL to:
   ```
   https://leverageacademy.vercel.app/api/webhooks/stripe
   ```
4. Select events to listen to:
   - `checkout.session.completed`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Make sure to add this secret to your Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

## Step 3: Add Environment Variables

### For Production (Vercel)

Add these environment variables in your Vercel project settings:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following:

```env
# Stripe Keys (Production)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Site URL (Production)
NEXT_PUBLIC_SITE_URL=https://leverageacademy.vercel.app

# Supabase Service Role Key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### For Local Development

Add these to your `.env.local` file:

```env
# Stripe Keys (Test Mode)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (from Stripe CLI)

# Site URL (Local)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase Service Role Key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

⚠️ **IMPORTANT**: Never commit `.env.local` to version control!

## Step 4: Add Supabase Service Role Key

For webhooks to work, you need the Supabase service role key:

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the **service_role** key (⚠️ Keep this secret!)
4. Add to `.env.local`:

```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Step 5: Test the Integration

### Test Mode

1. Use Stripe test card numbers:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Use any future expiry date, any 3-digit CVC, any ZIP code

2. Test the flow:
   - Apply for a course
   - Admin approves the application
   - Click "Proceed to Payment" on the approved application
   - Complete payment with test card
   - Verify enrollment is created in database

### Webhook Testing (Local Development)

For local development, use Stripe CLI to forward webhooks:

1. Install [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Run:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
3. Copy the webhook signing secret from the CLI output
4. Use that secret in your `.env.local` for local testing

## Step 6: Go Live

When ready for production:

1. Switch to **Live mode** in Stripe Dashboard
2. Update environment variables with live keys
3. Update webhook endpoint URL to production domain
4. Update `NEXT_PUBLIC_SITE_URL` to production domain
5. Test with a real card (use a small amount first!)

## Troubleshooting

### Payment Session Not Created

- Check that `STRIPE_SECRET_KEY` is set correctly
- Verify the course exists and has a valid price
- Check browser console for errors

### Webhook Not Working

- Verify `STRIPE_WEBHOOK_SECRET` matches your webhook endpoint
- Check that `SUPABASE_SERVICE_ROLE_KEY` is set
- Check Stripe Dashboard → Webhooks for delivery logs
- For local dev, ensure Stripe CLI is running

### Enrollment Not Created After Payment

- Check webhook logs in Stripe Dashboard
- Verify database has `enrollments` table with correct schema
- Check server logs for errors

## Security Notes

⚠️ **Never commit these keys to version control!**

- Add `.env.local` to `.gitignore`
- Use environment variables in your hosting platform (Vercel, etc.)
- Rotate keys if accidentally exposed
- Use test keys for development, live keys only in production

## Support

For Stripe-specific issues, check:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)
