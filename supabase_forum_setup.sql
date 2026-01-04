-- Forum System Tables

-- 1. Forum Categories Table
CREATE TABLE IF NOT EXISTS forum_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT, -- Lucide icon name or image URL
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Forum Threads Table
CREATE TABLE IF NOT EXISTS forum_threads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID REFERENCES forum_categories(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL, -- Initial post content or we can separate it. Let's keep initial content here for preview.
    view_count INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT false,
    is_locked BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Forum Posts (Replies) Table
CREATE TABLE IF NOT EXISTS forum_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    thread_id UUID REFERENCES forum_threads(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_solution BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for Categories
-- Everyone can view categories
CREATE POLICY "Everyone can view categories"
ON forum_categories FOR SELECT
USING (true);

-- Only admins/mods can insert/update/delete categories (Assuming explicit admin check or just manual insertion for now)
-- Skipping admin policy for now as it's usually done via dashboard or seed.

-- 5. RLS Policies for Threads
-- Everyone can view threads
CREATE POLICY "Everyone can view threads"
ON forum_threads FOR SELECT
USING (true);

-- Authenticated users can create threads
CREATE POLICY "Authenticated users can create threads"
ON forum_threads FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Users can update their own threads
CREATE POLICY "Users can update their own threads"
ON forum_threads FOR UPDATE
USING (auth.uid() = user_id);

-- 6. RLS Policies for Posts
-- Everyone can view posts
CREATE POLICY "Everyone can view posts"
ON forum_posts FOR SELECT
USING (true);

-- Authenticated users can create posts
CREATE POLICY "Authenticated users can create posts"
ON forum_posts FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Users can update their own posts
CREATE POLICY "Users can update their own posts"
ON forum_posts FOR UPDATE
USING (auth.uid() = user_id);

-- 7. Seed Initial Categories
INSERT INTO forum_categories (name, description, slug, icon, order_index) VALUES
('Anúncios', 'Notícias e atualizações oficiais do servidor.', 'anuncios', 'Megaphone', 1),
('Geral', 'Discussões gerais sobre o servidor e Minecraft.', 'geral', 'MessageSquare', 2),
('Sugestões', 'Tem uma ideia? Compartilhe conosco!', 'sugestoes', 'Lightbulb', 3),
('Dúvidas (Suporte)', 'Precisa de ajuda? Pergunte aqui.', 'duvidas', 'HelpCircle', 4),
('Denúncias', 'Reporte jogadores ou bugs (Visível apenas para Staff).', 'denuncias', 'AlertTriangle', 5),
('Off-Topic', 'Converse sobre qualquer coisa fora do servidor.', 'off-topic', 'Coffee', 6)
ON CONFLICT (slug) DO NOTHING;
