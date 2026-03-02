-- ============================================================
-- AxisSMP Website – Supabase Schema
-- Cole este arquivo inteiro no SQL Editor do Supabase e execute.
-- ============================================================

-- ─────────────────────────────────────────
-- EXTENSÕES
-- ─────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────
-- TABELA: profiles
-- Criada automaticamente via trigger quando
-- um novo usuário se registra no Auth.
-- ─────────────────────────────────────────
create table if not exists public.profiles (
    id          uuid primary key references auth.users (id) on delete cascade,
    nickname    text not null,
    role        text not null default 'user' check (role in ('user', 'mod', 'admin')),
    avatar_url  text,
    level       integer not null default 1,
    balance     numeric(10, 2) not null default 0,
    created_at  timestamptz not null default now()
);

-- Trigger: cria o perfil assim que o usuário se registra
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.profiles (id, nickname, avatar_url)
    values (
        new.id,
        coalesce(new.raw_user_meta_data ->> 'nickname', split_part(new.email, '@', 1)),
        new.raw_user_meta_data ->> 'avatar_url'
    );
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────
-- TABELA: products
-- ─────────────────────────────────────────
create table if not exists public.products (
    id          uuid primary key default uuid_generate_v4(),
    name        text not null,
    price       numeric(10, 2) not null check (price >= 0),
    category    text not null check (category in ('vips', 'coins', 'unban')),
    color       text not null default 'bg-brand-orange/20',
    image       text not null,
    created_at  timestamptz not null default now()
);

-- ─────────────────────────────────────────
-- TABELA: posts (notícias)
-- ─────────────────────────────────────────
create table if not exists public.posts (
    id          uuid primary key default uuid_generate_v4(),
    slug        text not null unique,
    title       text not null,
    excerpt     text not null,
    content     text not null,
    category    text not null check (category in ('update', 'event', 'maintenance', 'announcement')),
    author      text not null default 'Admin',
    image       text,
    date        text,
    created_at  timestamptz not null default now()
);

-- ─────────────────────────────────────────
-- TABELA: orders
-- ─────────────────────────────────────────
create table if not exists public.orders (
    id            uuid primary key default uuid_generate_v4(),
    user_id       uuid references public.profiles (id) on delete set null,
    nickname      text not null,
    items         jsonb not null default '[]',
    total_amount  numeric(10, 2) not null check (total_amount >= 0),
    status        text not null default 'pending'
                      check (status in ('pending', 'paid', 'delivered', 'cancelled')),
    created_at    timestamptz not null default now()
);

-- ─────────────────────────────────────────
-- TABELAS: tickets & ticket_messages
-- ─────────────────────────────────────────
create table if not exists public.tickets (
    id          uuid primary key default uuid_generate_v4(),
    user_id     uuid references public.profiles (id) on delete cascade,
    title       text not null,
    category    text not null,
    status      text not null default 'open'
                    check (status in ('open', 'answered', 'closed')),
    created_at  timestamptz not null default now()
);

create table if not exists public.ticket_messages (
    id          uuid primary key default uuid_generate_v4(),
    ticket_id   uuid not null references public.tickets (id) on delete cascade,
    user_id     uuid references public.profiles (id) on delete set null,
    content     text not null,
    is_staff    boolean not null default false,
    created_at  timestamptz not null default now()
);

-- ─────────────────────────────────────────
-- TABELAS: forum
-- ─────────────────────────────────────────
create table if not exists public.forum_categories (
    id           uuid primary key default uuid_generate_v4(),
    name         text not null,
    description  text not null default '',
    slug         text not null unique,
    icon         text not null default 'MessageSquare',
    order_index  integer not null default 0
);

create table if not exists public.forum_threads (
    id              uuid primary key default uuid_generate_v4(),
    category_id     uuid not null references public.forum_categories (id) on delete cascade,
    user_id         uuid references public.profiles (id) on delete set null,
    title           text not null,
    content         text not null,
    view_count      integer not null default 0,
    is_pinned       boolean not null default false,
    is_locked       boolean not null default false,
    solved_post_id  uuid,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now(),
    last_reply_at   timestamptz
);

create table if not exists public.forum_posts (
    id           uuid primary key default uuid_generate_v4(),
    thread_id    uuid not null references public.forum_threads (id) on delete cascade,
    user_id      uuid references public.profiles (id) on delete set null,
    content      text not null,
    is_solution  boolean not null default false,
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now()
);

-- FK circular resolvida após criar forum_posts
alter table public.forum_threads
    add constraint fk_solved_post
    foreign key (solved_post_id)
    references public.forum_posts (id)
    on delete set null;

create table if not exists public.forum_reactions (
    id          uuid primary key default uuid_generate_v4(),
    user_id     uuid not null references public.profiles (id) on delete cascade,
    post_id     uuid references public.forum_posts (id) on delete cascade,
    thread_id   uuid references public.forum_threads (id) on delete cascade,
    emoji       text not null,
    created_at  timestamptz not null default now(),
    check (
        (post_id is not null and thread_id is null) or
        (post_id is null and thread_id is not null)
    )
);

-- Índices parciais garantem unicidade por emoji/post e emoji/thread separadamente
create unique index if not exists forum_reactions_unique_post
    on public.forum_reactions (user_id, post_id, emoji)
    where post_id is not null;

create unique index if not exists forum_reactions_unique_thread
    on public.forum_reactions (user_id, thread_id, emoji)
    where thread_id is not null;

create table if not exists public.forum_reports (
    id           uuid primary key default uuid_generate_v4(),
    post_id      uuid references public.forum_posts (id) on delete cascade,
    reporter_id  uuid references public.profiles (id) on delete set null,
    reason       text not null,
    status       text not null default 'pending'
                     check (status in ('pending', 'resolved', 'dismissed')),
    created_at   timestamptz not null default now()
);

-- ─────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────

-- profiles
alter table public.profiles enable row level security;

create policy "Perfis visíveis a todos"
    on public.profiles for select
    using (true);

create policy "Usuário atualiza o próprio perfil"
    on public.profiles for update
    using (auth.uid() = id);

-- products
alter table public.products enable row level security;

create policy "Produtos visíveis a todos"
    on public.products for select
    using (true);

create policy "Apenas admin gerencia produtos"
    on public.products for all
    using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin'
        )
    );

-- posts
alter table public.posts enable row level security;

create policy "Posts visíveis a todos"
    on public.posts for select
    using (true);

create policy "Apenas admin gerencia posts"
    on public.posts for all
    using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin'
        )
    );

-- orders
alter table public.orders enable row level security;

create policy "Usuário vê os próprios pedidos"
    on public.orders for select
    using (auth.uid() = user_id);

create policy "Usuário autenticado cria pedidos"
    on public.orders for insert
    with check (auth.uid() = user_id);

create policy "Admin gerencia todos os pedidos"
    on public.orders for all
    using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin'
        )
    );

-- tickets
alter table public.tickets enable row level security;

create policy "Usuário vê os próprios tickets"
    on public.tickets for select
    using (auth.uid() = user_id);

create policy "Usuário autenticado abre ticket"
    on public.tickets for insert
    with check (auth.uid() = user_id);

create policy "Usuário fecha o próprio ticket"
    on public.tickets for update
    using (auth.uid() = user_id);

create policy "Admin gerencia todos os tickets"
    on public.tickets for all
    using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role in ('admin', 'mod')
        )
    );

-- ticket_messages
alter table public.ticket_messages enable row level security;

create policy "Participantes veem mensagens do ticket"
    on public.ticket_messages for select
    using (
        auth.uid() = user_id
        or exists (
            select 1 from public.tickets
            where tickets.id = ticket_id and tickets.user_id = auth.uid()
        )
        or exists (
            select 1 from public.profiles
            where id = auth.uid() and role in ('admin', 'mod')
        )
    );

create policy "Usuário envia mensagem no próprio ticket"
    on public.ticket_messages for insert
    with check (auth.uid() = user_id);

-- forum_categories
alter table public.forum_categories enable row level security;

create policy "Categorias visíveis a todos"
    on public.forum_categories for select
    using (true);

create policy "Admin gerencia categorias"
    on public.forum_categories for all
    using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin'
        )
    );

-- forum_threads
alter table public.forum_threads enable row level security;

create policy "Tópicos visíveis a todos"
    on public.forum_threads for select
    using (true);

create policy "Usuário autenticado cria tópico"
    on public.forum_threads for insert
    with check (auth.uid() = user_id);

create policy "Autor ou moderador atualiza tópico"
    on public.forum_threads for update
    using (
        auth.uid() = user_id
        or exists (
            select 1 from public.profiles
            where id = auth.uid() and role in ('admin', 'mod')
        )
    );

create policy "Admin/mod exclui tópico"
    on public.forum_threads for delete
    using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role in ('admin', 'mod')
        )
    );

-- forum_posts
alter table public.forum_posts enable row level security;

create policy "Posts do fórum visíveis a todos"
    on public.forum_posts for select
    using (true);

create policy "Usuário autenticado cria post"
    on public.forum_posts for insert
    with check (auth.uid() = user_id);

create policy "Autor ou moderador atualiza post"
    on public.forum_posts for update
    using (
        auth.uid() = user_id
        or exists (
            select 1 from public.profiles
            where id = auth.uid() and role in ('admin', 'mod')
        )
    );

create policy "Admin/mod exclui post"
    on public.forum_posts for delete
    using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role in ('admin', 'mod')
        )
    );

-- forum_reactions
alter table public.forum_reactions enable row level security;

create policy "Reações visíveis a todos"
    on public.forum_reactions for select
    using (true);

create policy "Usuário autenticado reage"
    on public.forum_reactions for insert
    with check (auth.uid() = user_id);

create policy "Usuário remove a própria reação"
    on public.forum_reactions for delete
    using (auth.uid() = user_id);

-- forum_reports
alter table public.forum_reports enable row level security;

create policy "Admin/mod vê denúncias"
    on public.forum_reports for select
    using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role in ('admin', 'mod')
        )
    );

create policy "Usuário autenticado denuncia"
    on public.forum_reports for insert
    with check (auth.uid() = reporter_id);

create policy "Admin/mod atualiza denúncia"
    on public.forum_reports for update
    using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role in ('admin', 'mod')
        )
    );

-- ─────────────────────────────────────────
-- SEED: categorias do fórum
-- ─────────────────────────────────────────
insert into public.forum_categories (name, description, slug, icon, order_index)
values
    ('Geral',        'Conversas gerais sobre o servidor',          'geral',        'MessageSquare', 1),
    ('Sugestões',    'Envie suas sugestões para melhorar o servidor', 'sugestoes',    'Lightbulb',     2),
    ('Suporte',      'Tire dúvidas e peça ajuda à comunidade',     'suporte',      'HelpCircle',    3),
    ('Apresentações','Apresente-se para a comunidade',              'apresentacoes','Users',         4),
    ('Off-Topic',    'Assuntos fora do contexto do servidor',       'off-topic',    'Hash',          5)
on conflict (slug) do nothing;

-- ─────────────────────────────────────────
-- SEED: produtos da loja
-- ─────────────────────────────────────────
insert into public.products (name, price, category, color, image)
values
    ('VIP',            19.90, 'vips',  'bg-brand-orange/20',  '/images/vips/vip.png'),
    ('MVP',            39.90, 'vips',  'bg-zinc-400/20',      '/images/vips/mvp.png'),
    ('MVP+',           69.90, 'vips',  'bg-emerald-500/20',   '/images/vips/mvp-plus.png'),
    ('10.000 Coins',   10.00, 'coins', 'bg-yellow-400/20',    '/images/coins/coins-gold-pile-small.png'),
    ('50.000 Coins',   40.00, 'coins', 'bg-yellow-500/20',    '/images/coins/coins-gold-stack.png'),
    ('100.000 Coins',  70.00, 'coins', 'bg-orange-400/20',    '/images/coins/currency-medium-gold-stack.png'),
    ('250.000 Coins', 150.00, 'coins', 'bg-orange-500/20',    '/images/coins/currency-large-gold-stack.png'),
    ('Unban',          25.00, 'unban', 'bg-red-500/20',       '/images/items/unban.png')
on conflict do nothing;
