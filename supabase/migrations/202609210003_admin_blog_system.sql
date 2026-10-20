-- Supabase migration for full Blog publication and Editor system
-- Compatible with all fields and features from the blog specification

create table if not exists public.blog_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text default '',
  icon text default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  excerpt text not null default '',
  content text not null default '',
  image text default '',
  image_alt text default '',
  cover_image text default '',
  cover_image_alt text default '',
  author text not null default 'Editorial Team',
  category text not null default 'Journal',
  read_time text default '3 min read',
  seo_title text,
  seo_description text,
  seo_keywords text,
  canonical_link text,
  no_index boolean not null default false,
  featured boolean not null default false,
  is_latest boolean not null default false,
  status text not null default 'Published' check (status in ('Draft', 'Published')),
  active boolean not null default true,
  pdf_link text default '',
  pdf_button_text text default '',
  video_url text default '',
  video_title text default '',
  schema_script text default '',
  custom_buttons jsonb not null default '[]'::jsonb,
  faq_title text default '',
  faq_description text default '',
  faq_image text default '',
  faq_image_alt text default '',
  faq_image_title text default '',
  faq_image_caption text default '',
  faq_image_description text default '',
  faqs jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  published_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Indexes for performance
create index if not exists blog_posts_slug_idx on public.blog_posts (slug);
create index if not exists blog_posts_status_idx on public.blog_posts (status, published_at desc);
create index if not exists blog_posts_featured_idx on public.blog_posts (featured, published_at desc);
create index if not exists blog_posts_category_idx on public.blog_posts (category);

-- Row level security
alter table public.blog_categories enable row level security;
alter table public.blog_posts enable row level security;

-- Policies for public reading
create policy "blog categories are readable by public" on public.blog_categories for select using (true);
create policy "published blog posts are readable by public" on public.blog_posts for select using (
  (status = 'Published' and active = true) or public.is_admin()
);

-- Policies for admin modification
create policy "admins can manage blog categories" on public.blog_categories for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins can manage blog posts" on public.blog_posts for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Default starter categories
insert into public.blog_categories (name, slug, description) values
  ('Design & Creative', 'design-creative', 'Creative direction, visual inspiration, and branding craftsmanship.'),
  ('Sustainability', 'sustainability', 'Conscious choices, zero-waste methods, and circular lifestyle notes.'),
  ('Materials & Craft', 'materials-craft', 'The tactile science of textures, papers, finishes, and tactile design.'),
  ('Industry Insights', 'industry-insights', 'Deep dives into modern commerce, retail trends, and product culture.'),
  ('How-To Guides', 'how-to-guides', 'Step-by-step practical advice, checklists, and expert walkthroughs.')
on conflict (name) do nothing;
