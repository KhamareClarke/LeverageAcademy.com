# Check Supabase Configuration

## Quick Fix Steps:

1. **Check if `.env.local` exists** in the root directory
2. **Verify your Supabase credentials**:
   - Go to https://supabase.com/dashboard
   - Select your project
   - Go to Settings → API
   - Copy:
     - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
     - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Create/Update `.env.local`**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. **Restart your dev server**:
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

5. **Check if Supabase project is active**:
   - Go to Supabase dashboard
   - Make sure project is not paused
   - If paused, click "Resume project"

## Test Connection:

After updating `.env.local`, try signing up again. If it still times out:
- Check browser console for errors
- Check terminal/console for Supabase connection errors
- Verify your internet connection
