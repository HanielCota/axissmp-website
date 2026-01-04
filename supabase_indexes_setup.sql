-- =====================================================
-- Supabase Database Optimization Setup
-- =====================================================
-- This file contains indexes and optimizations for all
-- foreign keys and commonly queried columns to improve
-- database performance for JOINs, WHERE clauses, and
-- DELETE operations.
--
-- NOTE: Uses DO blocks to safely skip indexes for
-- tables that don't exist yet.
-- =====================================================

-- =====================================================
-- SECTION 1: FOREIGN KEY INDEXES (Core Tables)
-- These address the unindexed foreign keys warning
-- =====================================================

-- Forum Posts indexes
CREATE INDEX IF NOT EXISTS idx_forum_posts_thread_id ON public.forum_posts(thread_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_user_id ON public.forum_posts(user_id);

-- Forum Threads indexes
CREATE INDEX IF NOT EXISTS idx_forum_threads_category_id ON public.forum_threads(category_id);
CREATE INDEX IF NOT EXISTS idx_forum_threads_user_id ON public.forum_threads(user_id);

-- Orders index
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);

-- Ticket Messages indexes
CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket_id ON public.ticket_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_user_id ON public.ticket_messages(user_id);

-- Tickets index
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON public.tickets(user_id);

-- =====================================================
-- SECTION 2: QUERY OPTIMIZATION INDEXES (Core Tables)
-- Based on actual query patterns in the codebase
-- =====================================================

-- 2.1 Forum Categories (sorted by order_index frequently)
CREATE INDEX IF NOT EXISTS idx_forum_categories_order_index ON public.forum_categories(order_index);
CREATE INDEX IF NOT EXISTS idx_forum_categories_slug ON public.forum_categories(slug);

-- 2.2 Forum Threads (complex queries in CategoryPage)
-- Composite index for the most common query pattern
CREATE INDEX IF NOT EXISTS idx_forum_threads_category_pinned_updated 
ON public.forum_threads(category_id, is_pinned DESC, updated_at DESC);

-- Index for recent threads widget
CREATE INDEX IF NOT EXISTS idx_forum_threads_created_at ON public.forum_threads(created_at DESC);

-- 2.3 Profiles (used extensively for role checks and nickname lookups)
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_nickname_lower ON public.profiles(LOWER(nickname));

-- 2.4 Posts/News (sorted by created_at in admin and public views)
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.posts(category);

-- 2.5 Products (sorted by price, filtered by category)
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);

-- 2.6 Orders (frequently ordered by created_at, filtered by status)
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- 2.7 Tickets (status filtering is common)
CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON public.tickets(created_at DESC);

-- 2.8 Ticket Messages (ordered by created_at in detail view)
CREATE INDEX IF NOT EXISTS idx_ticket_messages_created_at ON public.ticket_messages(created_at);

-- =====================================================
-- SECTION 3: OPTIONAL INDEXES (Tables from forum_updates.sql)
-- These tables may not exist if forum_updates.sql wasn't run
-- =====================================================

DO $$ 
BEGIN
    -- Forum Reactions indexes (only if table exists)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'forum_reactions') THEN
        CREATE INDEX IF NOT EXISTS idx_forum_reactions_thread_id ON public.forum_reactions(thread_id);
        CREATE INDEX IF NOT EXISTS idx_forum_reactions_post_id ON public.forum_reactions(post_id);
        CREATE INDEX IF NOT EXISTS idx_forum_reactions_user_id ON public.forum_reactions(user_id);
        RAISE NOTICE 'Created indexes for forum_reactions';
    ELSE
        RAISE NOTICE 'Skipping forum_reactions indexes (table does not exist)';
    END IF;

    -- Forum Reports indexes (only if table exists)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'forum_reports') THEN
        CREATE INDEX IF NOT EXISTS idx_forum_reports_post_id ON public.forum_reports(post_id);
        CREATE INDEX IF NOT EXISTS idx_forum_reports_reporter_id ON public.forum_reports(reporter_id);
        CREATE INDEX IF NOT EXISTS idx_forum_reports_status ON public.forum_reports(status);
        RAISE NOTICE 'Created indexes for forum_reports';
    ELSE
        RAISE NOTICE 'Skipping forum_reports indexes (table does not exist)';
    END IF;
END $$;

-- =====================================================
-- SUMMARY OF INDEXES CREATED
-- =====================================================
-- 
-- CORE TABLES (always created):
-- - forum_posts: thread_id, user_id
-- - forum_threads: category_id, user_id, composite(category_id, is_pinned, updated_at), created_at
-- - forum_categories: order_index, slug
-- - orders: user_id, created_at, status
-- - tickets: user_id, status, created_at
-- - ticket_messages: ticket_id, user_id, created_at
-- - profiles: role, LOWER(nickname)
-- - posts: created_at, category
-- - products: price, category
--
-- OPTIONAL TABLES (created if exist):
-- - forum_reactions: thread_id, post_id, user_id
-- - forum_reports: post_id, reporter_id, status
--
