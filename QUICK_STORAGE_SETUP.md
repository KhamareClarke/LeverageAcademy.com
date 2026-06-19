# Quick Storage Setup - Copy & Paste

## Step 1: Create Bucket (Do This First!)

1. Go to **Supabase Dashboard** → **Storage** → **Buckets**
2. Click **"New Bucket"**
3. Name: `course-videos`
4. Toggle **"Public bucket"** ON
5. Click **"Create Bucket"**

## Step 2: Run This SQL (Copy & Paste)

Go to **SQL Editor** and paste this:

```sql
-- Storage Policies for course-videos bucket
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

CREATE POLICY "Admins can update videos"
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

CREATE POLICY "Public can view videos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'course-videos'::text);
```

## Step 3: Test Upload

1. Go to Admin → Courses → Manage Course
2. Add a lesson with video
3. Try uploading a video file
4. ✅ Should work now!

## Troubleshooting

**Error: "Bucket not found"**
→ Bucket doesn't exist. Go back to Step 1 and create it.

**Error: "new row violates row-level security policy"**
→ Policies not set up. Run Step 2 SQL.

**Error: "Permission denied"**
→ Make sure you're logged in as admin.



