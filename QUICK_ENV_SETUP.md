# Quick Environment Variables Setup for Vercel

## ⚡ Quick Steps

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project**: LeverageAcademy.com
3. **Navigate to**: Settings → Environment Variables
4. **Add these 4 variables** (click "Add New" for each):

---

## 📝 Variables to Add

### 1. STRIPE_SECRET_KEY
```
Key: STRIPE_SECRET_KEY
Value: sk_live_... (your live secret key)
Environments: ✅ Production ✅ Preview ✅ Development
```

### 2. STRIPE_WEBHOOK_SECRET
```
Key: STRIPE_WEBHOOK_SECRET
Value: whsec_... (your webhook signing secret)
Environments: ✅ Production ✅ Preview ✅ Development
```

### 3. NEXT_PUBLIC_SITE_URL
```
Key: NEXT_PUBLIC_SITE_URL
Value: https://leverageacademy.vercel.app
Environments: ✅ Production ✅ Preview ✅ Development
```

### 4. NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```
Key: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
Value: pk_live_... (your publishable key)
Environments: ✅ Production ✅ Preview ✅ Development
```

---

## ✅ After Adding Variables

1. **Redeploy** your application:
   - Go to **Deployments** tab
   - Click the **three dots** (⋯) on the latest deployment
   - Click **Redeploy**

2. **Verify Webhook in Stripe**:
   - Go to Stripe Dashboard → Developers → Webhooks
   - Make sure endpoint is: `https://leverageacademy.vercel.app/api/webhooks/stripe`
   - Verify it's receiving events

3. **Test Payment Flow**:
   - Apply for a course
   - Admin approves application
   - Complete payment
   - Verify enrollment is created

---

## 🔒 Security Reminder

- ✅ Add keys only in Vercel or your local `.env.local`
- ✅ Never commit secrets to Git
- ✅ Rotate keys if they were exposed

---

## 🆘 Need Help?

- Check Vercel logs: Deployments → Click deployment → Functions tab
- Check Stripe webhook logs: Dashboard → Developers → Webhooks
- See full guide: `VERCEL_ENV_SETUP.md`
