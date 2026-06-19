-- Storage Policies for course-videos bucket
-- Run this in Supabase SQL Editor after creating the 'course-videos' bucket

-- Policy 1: Allow authenticated admins to upload videos
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

-- Policy 2: Allow authenticated admins to update videos
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

-- Policy 3: Allow authenticated admins to delete videos
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

-- Policy 4: Allow public read access to videos
CREATE POLICY "Public can view videos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'course-videos'::text);



