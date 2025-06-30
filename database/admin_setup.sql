-- Admin Setup for CodeSentinel
-- Run this in Supabase SQL Editor

-- 1. First find your user ID
SELECT id, email, raw_user_meta_data FROM auth.users WHERE email = 'genshro@icloud.com';

-- 2. Update user metadata to add admin role
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'genshro@icloud.com';

-- 3. Also update the public.users table if it exists
UPDATE public.users 
SET name = COALESCE(name, 'Admin User')
WHERE email = 'genshro@icloud.com';

-- 4. Verify the update
SELECT id, email, raw_user_meta_data FROM auth.users WHERE email = 'genshro@icloud.com';

-- 5. Create admin policies (optional - for future admin features)
-- Example: Admin can see all users
-- create policy "Admins can view all users" on public.users 
--   for select using (
--     auth.jwt() ->> 'role' = 'admin' OR 
--     (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
--   ); 
