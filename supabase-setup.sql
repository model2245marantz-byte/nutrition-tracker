-- ============================================================
-- NutriTrack - Supabase Database Setup
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Create meals table
create table if not exists public.meals (
  id text primary key,
  user_id uuid references auth.users(id) not null default auth.uid(),
  type text not null,
  description text not null,
  items jsonb not null default '[]',
  totals jsonb not null default '{}',
  date text not null,
  timestamp timestamptz not null,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.meals enable row level security;

-- Policy: users can only read their own meals
create policy "Users can view own meals"
  on public.meals for select
  using (auth.uid() = user_id);

-- Policy: users can insert their own meals
create policy "Users can insert own meals"
  on public.meals for insert
  with check (auth.uid() = user_id);

-- Policy: users can update their own meals
create policy "Users can update own meals"
  on public.meals for update
  using (auth.uid() = user_id);

-- Policy: users can delete their own meals
create policy "Users can delete own meals"
  on public.meals for delete
  using (auth.uid() = user_id);

-- Index for faster queries by user and date
create index if not exists idx_meals_user_date on public.meals(user_id, date);

-- ============================================================
-- Custom Products Table
-- ============================================================

create table if not exists public.custom_products (
  id text primary key,
  user_id uuid references auth.users(id) not null default auth.uid(),
  product_name text not null,
  serving_size text not null default '1 serving',
  calories numeric not null default 0,
  protein numeric not null default 0,
  carbs numeric not null default 0,
  fat numeric not null default 0,
  fiber numeric not null default 0,
  sodium numeric not null default 0,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.custom_products enable row level security;

-- Policy: users can only read their own custom products
create policy "Users can view own custom products"
  on public.custom_products for select
  using (auth.uid() = user_id);

-- Policy: users can insert their own custom products
create policy "Users can insert own custom products"
  on public.custom_products for insert
  with check (auth.uid() = user_id);

-- Policy: users can update their own custom products
create policy "Users can update own custom products"
  on public.custom_products for update
  using (auth.uid() = user_id);

-- Policy: users can delete their own custom products
create policy "Users can delete own custom products"
  on public.custom_products for delete
  using (auth.uid() = user_id);

-- Index for faster lookups by user
create index if not exists idx_custom_products_user on public.custom_products(user_id);

-- ============================================================
-- User Profiles Table (per-user daily macro targets)
-- ============================================================

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  daily_calories integer not null default 2000,
  daily_protein integer not null default 150,
  daily_carbs integer not null default 250,
  daily_fat integer not null default 65,
  daily_fiber integer not null default 30,
  daily_sodium integer not null default 2300,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.user_profiles enable row level security;

-- Policy: users can only read their own profile
create policy "Users can view own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

-- Policy: users can insert their own profile
create policy "Users can insert own profile"
  on public.user_profiles for insert
  with check (auth.uid() = id);

-- Policy: users can update their own profile
create policy "Users can update own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

-- Auto-create a profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if it exists, then create
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
