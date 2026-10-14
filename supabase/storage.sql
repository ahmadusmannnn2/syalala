-- Create Storage Bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('menu-images', 'menu-images', true) ON CONFLICT (id) DO NOTHING;

-- Set up Storage Policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'menu-images');
CREATE POLICY "Authenticated users can upload images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'menu-images');
CREATE POLICY "Authenticated users can update images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'menu-images');
CREATE POLICY "Authenticated users can delete images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'menu-images');
