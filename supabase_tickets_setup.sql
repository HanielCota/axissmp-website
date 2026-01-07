-- Support Ticket System Tables

-- 1. Tickets Table
CREATE TABLE IF NOT EXISTS tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('vendas', 'bug', 'suporte', 'outro')),
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'pending', 'closed')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Ticket Messages Table
CREATE TABLE IF NOT EXISTS ticket_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_staff BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies for Tickets
CREATE POLICY "Users can view their own tickets"
ON tickets FOR SELECT
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own tickets"
ON tickets FOR INSERT
WITH CHECK ((select auth.uid()) = user_id);

-- 4. RLS Policies for Ticket Messages
CREATE POLICY "Users can view messages of their own tickets"
ON ticket_messages FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM tickets 
        WHERE tickets.id = ticket_messages.ticket_id 
        AND tickets.user_id = (select auth.uid())
    )
);

CREATE POLICY "Users can insert messages to their own tickets"
ON ticket_messages FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM tickets 
        WHERE tickets.id = ticket_messages.ticket_id 
        AND tickets.user_id = (select auth.uid())
    )
    AND (select auth.uid()) = user_id
);
