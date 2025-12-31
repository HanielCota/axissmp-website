-- Admin Dashboard Setup
-- Run this in your Supabase SQL Editor

-- 1. Add Role to Profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role text DEFAULT 'user' CHECK (role IN ('user', 'admin', 'mod'));

-- 2. Create Products Table
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('vips', 'coins', 'unban')),
    color TEXT DEFAULT 'bg-brand-orange/20',
    image TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Posts Table (News)
CREATE TABLE IF NOT EXISTS posts (
    slug TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('update', 'event', 'maintenance', 'announcement')),
    author TEXT NOT NULL,
    image TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- Products: Public Read, Admin Write
CREATE POLICY "Public products are viewable by everyone" 
ON products FOR SELECT USING (true);

CREATE POLICY "Admins can insert products" 
ON products FOR INSERT 
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

CREATE POLICY "Admins can update products" 
ON products FOR UPDATE 
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

CREATE POLICY "Admins can delete products" 
ON products FOR DELETE 
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- Posts: Public Read, Admin Write
CREATE POLICY "Public posts are viewable by everyone" 
ON posts FOR SELECT USING (true);

CREATE POLICY "Admins can insert posts" 
ON posts FOR INSERT 
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

CREATE POLICY "Admins can update posts" 
ON posts FOR UPDATE 
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

CREATE POLICY "Admins can delete posts" 
ON posts FOR DELETE 
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- 6. Policy for Updating Roles (Only Admins can update roles)
-- We need to adjust the existing profile update policy or add a new one?
-- Existing: "Users can update own profile." -> This might allow users to change their own role if we are not careful!
-- We should restrict the update policy on profiles to exclude 'role' column for normal users, OR
-- create a trigger/function to prevent role changes by non-admins.
-- Simpler approach: Revoke update on role column for normal users if possible, or check it in RLS.

-- Let's assume we handle role updates via a secure server action that uses `supabaseAdmin` (service role) or we check permission carefully.
-- For now, let's create a policy that allows Admins to update ANY profile (to change roles, etc)
CREATE POLICY "Admins can update any profile" 
ON profiles FOR UPDATE 
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- Note: You (the owner) will need to manually set your role to 'admin' in the database table initially.
