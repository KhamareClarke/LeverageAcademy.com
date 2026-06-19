# Supabase Storage Setup for Video Uploads

## Step 1: Create Storage Bucket

1. Go to your Supabase dashboard
2. Navigate to **Storage**
3. Click **New bucket**
4. Name: `course-videos`
5. Make it **Public** (or Private with signed URLs - your choice)
6. Click **Create bucket**

## Step 2: Set Bucket Policies

Go to **Storage** → **Policies** → `course-videos`

### Policy 1: Allow admins to upload
```sql
CREATE POLICY "Admins can upload videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'course-videos' AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

### Policy 2: Allow admins to update/delete
```sql
CREATE POLICY "Admins can update videos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'course-videos' AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete videos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'course-videos' AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

### Policy 3: Allow public read (if bucket is public)
```sql
CREATE POLICY "Public can view videos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'course-videos');
```

## Step 3: File Size Limits

By default, Supabase allows up to 50MB. For larger videos:
- Go to **Settings** → **API** → **Storage**
- Adjust file size limits (may require upgrade)

## Step 4: Test Upload

After setup, try uploading a video through the admin lesson form.
