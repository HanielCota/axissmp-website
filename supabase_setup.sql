-- SQL para criar a tabela de perfis (profiles) que armazena os dados dos jogadores
-- Execute este link no seu "SQL Editor" no painel do Supabase

-- 1. Criar a tabela de perfis
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  nickname text unique,
  avatar_url text,
  level int default 1,
  balance decimal(12, 2) default 0.00,
  created_at timestamp with time zone default now(),

  constraint nickname_length check (char_length(nickname) >= 3)
);

-- 2. Habilitar o Row Level Security (RLS)
alter table profiles enable row level security;

-- 3. Criar políticas de acesso
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- 4. Função para criar o perfil automaticamente quando um usuário se registra
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nickname, avatar_url)
  values (new.id, new.raw_user_meta_data->>'nickname', 'https://mc-heads.net/avatar/' || (new.raw_user_meta_data->>'nickname') || '/64');
  return new;
end;
$$ language plpgsql security definer;

-- 5. Trigger para chamar a função após o insert no auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
