-- Supabase Storage Setup for Product Images
-- Run this in your Supabase SQL Editor

-- 1. Create the storage bucket for product images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-images',
    'product-images',
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public read access to product images
CREATE POLICY "Public read access for product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- 3. Allow authenticated admins to upload images
CREATE POLICY "Admins can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'product-images'
    AND auth.uid() IN (
        SELECT id FROM public.profiles WHERE role = 'admin'
    )
);

-- 4. Allow authenticated admins to update images
CREATE POLICY "Admins can update product images"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'product-images'
    AND auth.uid() IN (
        SELECT id FROM public.profiles WHERE role = 'admin'
    )
);

-- 5. Allow authenticated admins to delete images
CREATE POLICY "Admins can delete product images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'product-images'
    AND auth.uid() IN (
        SELECT id FROM public.profiles WHERE role = 'admin'
    )
);
