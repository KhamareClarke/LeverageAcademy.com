# Supabase Storage Setup for Video Uploads

## Step 1: Create Storage Bucket (REQUIRED FIRST!)

**⚠️ IMPORTANT: You MUST create the bucket before running the SQL policies!**

1. Go to your Supabase Dashboard
2. Navigate to **Storage** → **Buckets**
3. Click **"New Bucket"** button (top right)
4. Fill in:
   - **Name**: `course-videos` (exactly this name, no spaces)
   - **Public bucket**: ✅ **Toggle ON** (this makes videos accessible)
   - **File size limit**: Leave default or set to 500MB
   - **Allowed MIME types**: Leave empty (allows all video types)
5. Click **"Create Bucket"**
6. ✅ You should see `course-videos` in your buckets list

**If you see "Bucket not found" error, the bucket doesn't exist yet!**

## Step 2: Set Up Storage Policies

The storage bucket has Row Level Security (RLS) enabled. You need to create policies to allow uploads.

### Option A: Create Policies via SQL Editor (Recommended)

1. Go to **SQL Editor** in Supabase Dashboard
2. Run this SQL to create all policies:

```sql
-- Policy 1: Allow authenticated admins to upload
CREATE POLICY "Admins can upload videos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'course-videos'::text AND (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  )
);

-- Policy 2: Allow authenticated admins to update/delete
CREATE POLICY "Admins can manage videos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'course-videos'::text AND (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  )
);

CREATE POLICY "Admins can delete videos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'course-videos'::text AND (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  )
);

-- Policy 3: Allow public read access
CREATE POLICY "Public can view videos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'course-videos'::text);
```

### Option B: Create Policies via Dashboard

1. Go to **Storage** → **Policies** → `course-videos`
2. Click **New Policy** for each:

**Policy 1: Admins can upload**
- Policy name: `Admins can upload videos`
- Allowed operation: `INSERT`
- Target roles: `authenticated`
- Policy definition:
  ```sql
  bucket_id = 'course-videos'::text AND (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  )
  ```
- Check expression: Same as above

**Policy 2: Admins can update**
- Policy name: `Admins can update videos`
- Allowed operation: `UPDATE`
- Target roles: `authenticated`
- Policy definition: Same as Policy 1

**Policy 3: Admins can delete**
- Policy name: `Admins can delete videos`
- Allowed operation: `DELETE`
- Target roles: `authenticated`
- Policy definition: Same as Policy 1

**Policy 4: Public can view**
- Policy name: `Public can view videos`
- Allowed operation: `SELECT`
- Target roles: `public`
- Policy definition:
  ```sql
  bucket_id = 'course-videos'::text
  ```

### Option C: Use Service Role Key (Development Only)

If policies are too complex, you can use the service role key for uploads (bypasses RLS):

1. Go to **Settings** → **API** → Copy **`service_role` key** (keep it secret!)
2. Add to `.env.local`:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```
3. Update `app/api/upload/video/route.ts` to use service role key (see below)

**⚠️ Warning**: Service role key bypasses all security. Only use for development!

### Option D: Disable RLS (Not Recommended)

1. Go to **Storage** → **Buckets** → `course-videos`
2. Click **Settings**
3. Find **"Public bucket"** or **"RLS"** toggle
4. Disable RLS (allows anyone to upload - use only for testing)

**⚠️ Warning**: This removes all security. Only for development!

## Step 3: Test Upload

1. Go to Admin → Courses → Manage Course
2. Add a lesson with video content type
3. Try uploading a video file
4. The video should upload and the URL will be automatically filled

## File Size Limits

- Maximum file size: 500MB
- Supported formats: MP4, WebM, OGG, QuickTime

## Alternative: Use External URLs

If you prefer not to use Supabase Storage, you can:
- Upload videos to YouTube/Vimeo
- Use any public video hosting service
- Paste the video URL directly in the form

