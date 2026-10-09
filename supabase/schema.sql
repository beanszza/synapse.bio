-- ==========================================================
-- SYNAPSE.BIO — Supabase Schema & Security Setup
-- Run this in the Supabase Dashboard -> SQL Editor
-- ==========================================================

-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  username      TEXT PRIMARY KEY,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  bio           TEXT,
  avatar_url    TEXT,
  platforms     TEXT[] DEFAULT '{}',
  theme         TEXT DEFAULT 'synapse-dark',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast user_id lookups
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

-- 2. Create Links Table
CREATE TABLE IF NOT EXISTS public.links (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  label       TEXT NOT NULL,
  url         TEXT NOT NULL,
  platform    TEXT,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index for user's links
CREATE INDEX IF NOT EXISTS idx_links_user_id ON public.links(user_id);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

-- 4. Profiles RLS Policies
-- Anyone (public/anon) can view profiles so synapse.bio/:username works!
DROP POLICY IF EXISTS "Public can view profiles" ON public.profiles;
CREATE POLICY "Public can view profiles"
  ON public.profiles
  FOR SELECT
  USING (true);

-- Authenticated users can create their own profile
DROP POLICY IF EXISTS "Users can create their profile" ON public.profiles;
CREATE POLICY "Users can create their profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Authenticated users can update their own profile
DROP POLICY IF EXISTS "Users can update their profile" ON public.profiles;
CREATE POLICY "Users can update their profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Authenticated users can delete their own profile
DROP POLICY IF EXISTS "Users can delete their profile" ON public.profiles;
CREATE POLICY "Users can delete their profile"
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 5. Links RLS Policies
-- Anyone can view links so profile visitors can see social buttons
DROP POLICY IF EXISTS "Public can view links" ON public.links;
CREATE POLICY "Public can view links"
  ON public.links
  FOR SELECT
  USING (true);

-- Authenticated users can insert their own links
DROP POLICY IF EXISTS "Users can insert links" ON public.links;
CREATE POLICY "Users can insert links"
  ON public.links
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Authenticated users can update their own links
DROP POLICY IF EXISTS "Users can update links" ON public.links;
CREATE POLICY "Users can update links"
  ON public.links
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Authenticated users can delete their own links
DROP POLICY IF EXISTS "Users can delete links" ON public.links;
CREATE POLICY "Users can delete links"
  ON public.links
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 6. Storage Bucket for Avatars
-- Insert 'avatars' into storage.buckets if it does not already exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies for 'avatars'
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Authenticated users can update their avatars" ON storage.objects;
CREATE POLICY "Authenticated users can update their avatars"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Authenticated users can delete their avatars" ON storage.objects;
CREATE POLICY "Authenticated users can delete their avatars"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'avatars');
