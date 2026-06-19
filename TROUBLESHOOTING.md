# Troubleshooting Network Connection Issues

## Current Issue: Cannot Connect to Supabase

You're experiencing network connectivity issues with your Supabase instance:
- **Error**: `EAI_AGAIN` (DNS resolution failure)
- **Error**: `ConnectTimeoutError` (Connection timeout)
- **Hostname**: `cymdvjacbmqdmknxctys.supabase.co`

## Quick Test

1. **Test Connection**:
   - Visit: `http://localhost:3000/api/test-connection`
   - This will test if your app can reach Supabase

2. **Test DNS Resolution**:
   Open terminal/command prompt and run:
   ```bash
   ping cymdvjacbmqdmknxctys.supabase.co
   ```
   or
   ```bash
   nslookup cymdvjacbmqdmknxctys.supabase.co
   ```

## Common Solutions

### 1. Check Internet Connection
- Open a browser and visit https://supabase.com
- If it doesn't load, you have an internet connectivity issue

### 2. Check Firewall/VPN
- **Disable VPN** if you're using one
- **Check Windows Firewall** - may be blocking connections
- **Try different network** (mobile hotspot)

### 3. Check DNS Settings
- Try using Google DNS: `8.8.8.8` and `8.8.4.4`
- Or Cloudflare DNS: `1.1.1.1` and `1.0.0.1`

### 4. Verify Supabase Project
- Go to https://supabase.com/dashboard
- Check if your project is active
- Verify the project URL matches: `https://cymdvjacbmqdmknxctys.supabase.co`

### 5. Check Environment Variables
Verify your `.env.local` file has:
```env
NEXT_PUBLIC_SUPABASE_URL=https://cymdvjacbmqdmknxctys.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 6. Restart Development Server
After fixing network issues:
```bash
# Stop server (Ctrl+C)
npm run dev
```

### 7. Check Supabase Status
Visit: https://status.supabase.com to see if there are service issues

## Windows-Specific Fixes

### Flush DNS Cache
```bash
ipconfig /flushdns
```

### Reset Network
```bash
netsh winsock reset
netsh int ip reset
```
Then restart your computer.

### Check Proxy Settings
- Windows Settings → Network & Internet → Proxy
- Make sure no proxy is blocking connections

## If Nothing Works

1. **Contact your network administrator** if on a corporate network
2. **Try from a different network** (mobile hotspot)
3. **Check if Supabase is blocked** by your ISP or network
4. **Verify Supabase project is not paused** in dashboard

## Current Status

The app is now handling network errors gracefully:
- ✅ Shows clear error messages instead of infinite loading
- ✅ Timeout after 10 seconds
- ✅ Allows retry after errors
- ⚠️ Still cannot connect to Supabase (network issue)

Once your network can reach Supabase, everything will work normally.



