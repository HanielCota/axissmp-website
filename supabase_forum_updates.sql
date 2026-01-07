-- Advanced Forum Features Updates

-- 1. Add Solved Post ID to Threads
ALTER TABLE forum_threads ADD COLUMN IF NOT EXISTS solved_post_id UUID REFERENCES forum_posts(id) ON DELETE SET NULL;

-- 2. Add Last Edited At to Posts
ALTER TABLE forum_posts ADD COLUMN IF NOT EXISTS last_edited_at TIMESTAMPTZ;

-- 3. Forum Reactions Table
CREATE TABLE IF NOT EXISTS forum_reactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
    thread_id UUID REFERENCES forum_threads(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    emoji TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(post_id, thread_id, user_id, emoji),
    CONSTRAINT one_target CHECK (
        (post_id IS NOT NULL AND thread_id IS NULL) OR
        (post_id IS NULL AND thread_id IS NOT NULL)
    )
);

-- 4. Forum Reports Table
CREATE TABLE IF NOT EXISTS forum_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
    reporter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE forum_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_reports ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for Reactions
-- Everyone can view reactions
CREATE POLICY "Everyone can view reactions"
ON forum_reactions FOR SELECT
USING (true);

-- Authenticated users can react
CREATE POLICY "Authenticated users can react"
ON forum_reactions FOR INSERT
WITH CHECK ((select auth.role()) = 'authenticated');

-- Users can remove their own reactions
CREATE POLICY "Users can remove their own reactions"
ON forum_reactions FOR DELETE
USING ((select auth.uid()) = user_id);

-- 6. RLS Policies for Reports
-- Only staff can view reports (Assuming profiles table has roles)
-- For now, let's allow reporters to see their own reports
CREATE POLICY "Users can view their own reports"
ON forum_reports FOR SELECT
USING ((select auth.uid()) = reporter_id);

-- Authenticated users can report
CREATE POLICY "Authenticated users can report"
ON forum_reports FOR INSERT
WITH CHECK ((select auth.role()) = 'authenticated');
