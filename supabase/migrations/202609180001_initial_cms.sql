-- Fable Packaging CMS, leads, auth authorization and storage policies.
-- Run this file once in Supabase SQL Editor or with `supabase db push`.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'editor' check (role in ('owner', 'editor')),
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = (select auth.uid()) and active = true
  );
$$;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  subtitle text not null default '',
  description text not null default '',
  image text not null default '',
  alt text not null default '',
  badge text check (badge is null or badge in ('Popular', 'Luxury', 'Flexible')),
  active boolean not null default true,
  featured boolean not null default true,
  sort_order integer not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.industries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text not null default '',
  image text not null default '',
  alt text not null default '',
  active boolean not null default true,
  featured boolean not null default true,
  sort_order integer not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  category text not null default '',
  description text not null default '',
  image text not null default '',
  alt text not null default '',
  active boolean not null default true,
  featured boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  group_name text not null default 'home' check (group_name in ('home', 'quote', 'general')),
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.page_content (
  id uuid primary key default gen_random_uuid(),
  page_slug text not null,
  content_key text not null,
  label text not null,
  value text not null default '',
  input_type text not null default 'text' check (input_type in ('text', 'textarea', 'url', 'image')),
  sort_order integer not null default 0,
  updated_at timestamptz not null default timezone('utc', now()),
  unique(page_slug, content_key)
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default ('FQ-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  status text not null default 'new' check (status in ('new', 'contacted', 'quoted', 'won', 'lost', 'spam')),
  name text not null,
  email text not null,
  phone text,
  company text,
  packaging text not null,
  quantity text not null,
  length text,
  width text,
  height text,
  unit text,
  material text,
  printing text,
  finishes text[] not null default '{}',
  artwork text,
  artwork_path text,
  notes text,
  internal_notes text,
  source text not null default 'website',
  ip_hash text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'new' check (status in ('new', 'contacted', 'closed', 'spam')),
  name text not null,
  email text not null,
  phone text,
  company text,
  country text,
  message text not null,
  internal_notes text,
  ip_hash text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  active boolean not null default true,
  consented_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  admin_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity text not null,
  entity_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists quote_requests_created_at_idx on public.quote_requests (created_at desc);
create index if not exists quote_requests_ip_created_idx on public.quote_requests (ip_hash, created_at desc);
create index if not exists contact_requests_created_at_idx on public.contact_requests (created_at desc);
create index if not exists contact_requests_ip_created_idx on public.contact_requests (ip_hash, created_at desc);

do $$
declare table_name text;
begin
  foreach table_name in array array['products','industries','projects','faqs','page_content','site_settings','quote_requests','contact_requests']
  loop
    execute format('drop trigger if exists set_%I_updated_at on public.%I', table_name, table_name);
    execute format('create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name, table_name);
  end loop;
end $$;

alter table public.admin_users enable row level security;
alter table public.products enable row level security;
alter table public.industries enable row level security;
alter table public.projects enable row level security;
alter table public.faqs enable row level security;
alter table public.page_content enable row level security;
alter table public.site_settings enable row level security;
alter table public.quote_requests enable row level security;
alter table public.contact_requests enable row level security;
alter table public.subscribers enable row level security;
alter table public.audit_logs enable row level security;

revoke all on table public.admin_users, public.products, public.industries, public.projects,
  public.faqs, public.page_content, public.site_settings, public.quote_requests,
  public.contact_requests, public.subscribers, public.audit_logs from anon, authenticated;

grant select on public.products, public.industries, public.projects, public.faqs,
  public.page_content, public.site_settings to anon, authenticated;
grant select, insert, update, delete on public.products, public.industries, public.projects,
  public.faqs, public.page_content, public.site_settings to authenticated;
grant select, update, delete on public.quote_requests, public.contact_requests, public.subscribers to authenticated;
grant select on public.admin_users, public.audit_logs to authenticated;
grant usage, select on sequence public.audit_logs_id_seq to authenticated;

create policy "published products are public" on public.products for select using (active = true or public.is_admin());
create policy "published industries are public" on public.industries for select using (active = true or public.is_admin());
create policy "published projects are public" on public.projects for select using (active = true or public.is_admin());
create policy "published faqs are public" on public.faqs for select using (active = true or public.is_admin());
create policy "page content is public" on public.page_content for select using (true);
create policy "site settings are public" on public.site_settings for select using (true);

create policy "admins manage products" on public.products for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage industries" on public.industries for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage projects" on public.projects for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage faqs" on public.faqs for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage page content" on public.page_content for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage settings" on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage quotes" on public.quote_requests for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage contacts" on public.contact_requests for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage subscribers" on public.subscribers for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins read themselves" on public.admin_users for select to authenticated using (user_id = (select auth.uid()) or public.is_admin());
create policy "admins read audit logs" on public.audit_logs for select to authenticated using (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('site-media', 'site-media', true, 10485760, array['image/jpeg','image/png','image/webp','image/avif','image/svg+xml']),
  ('quote-artwork', 'quote-artwork', false, 26214400, array['application/pdf','application/zip','image/jpeg','image/png','image/webp','application/postscript'])
on conflict (id) do nothing;

create policy "admins upload site media" on storage.objects for insert to authenticated with check (bucket_id = 'site-media' and public.is_admin());
create policy "admins update site media" on storage.objects for update to authenticated using (bucket_id = 'site-media' and public.is_admin()) with check (bucket_id = 'site-media' and public.is_admin());
create policy "admins delete site media" on storage.objects for delete to authenticated using (bucket_id = 'site-media' and public.is_admin());
create policy "admins read quote artwork" on storage.objects for select to authenticated using (bucket_id = 'quote-artwork' and public.is_admin());

insert into public.products (name, slug, subtitle, image, alt, badge, description, sort_order) values
('Mailer Boxes','mailer-boxes','Built for memorable unboxing','/images/products/mailer-box.webp','Premium custom mailer box packaging','Popular','Custom printed mailer boxes designed for ecommerce, gifting and a brand moment at the door — protective in transit, beautiful when opened.',10),
('Rigid Boxes','rigid-boxes','Premium structure, elevated reveal','/images/products/rigid-box.webp','Luxury rigid box packaging','Luxury','Heavyweight presentation boxes with a refined reveal. Ideal for beauty, electronics, luxury gifting and products that deserve a slower unboxing.',20),
('Folding Cartons','folding-cartons','Lightweight, versatile and refined','/images/products/folding-carton.webp','Custom folding carton packaging',null,'Crisp cartons for retail shelves and everyday products. Lightweight, print-friendly and easy to customize in size, structure and finish.',30),
('Shipping Boxes','shipping-boxes','Strong protection for every journey','/images/products/shipping-box.webp','Corrugated shipping box packaging',null,'Corrugated shipping boxes built for strength, branding and safe delivery. Add custom print, inserts and the right board grade for your product.',40),
('Display Boxes','display-boxes','Designed to stand out on shelf','/images/products/display-box.webp','Custom retail display packaging',null,'Retail-ready display packaging that presents product clearly, protects on shelf and gives your brand a stronger presence in-store.',50),
('Mylar Bags','mylar-bags','Flexible packaging that stays fresh','/images/products/mylar-bag.webp','Custom printed mylar bag packaging','Flexible','Flexible pouches with a premium print finish. A practical choice for food, wellness and products that need freshness, barrier protection and stand-up presence.',60)
on conflict (slug) do nothing;

insert into public.industries (name, slug, description, image, alt, sort_order) values
('Cosmetics & Beauty','cosmetics-beauty','Elegant packaging for skincare, makeup and fragrance.','/images/industries/cosmetics-beauty.webp','Blush and cream cosmetic packaging in a premium studio setting',10),
('Food & Beverage','food-beverage','Packaging designed for freshness, presentation and shelf appeal.','/images/industries/food-beverage.webp','Natural kraft food cartons and premium flexible pouch packaging',20),
('Retail & E-Commerce','ecommerce','Branded packaging built for shipping and memorable unboxing.','/images/industries/ecommerce.webp','Open navy ecommerce mailer box with tissue paper and kraft insert',30),
('Health & Wellness','health-wellness','Clean, trustworthy packaging for modern wellness brands.','/images/industries/health-wellness.webp','White and soft blue wellness cartons with an amber bottle',40),
('Electronics','electronics','Protective structures with a refined premium presentation.','/images/industries/electronics.webp','Deep navy electronics rigid box with protective insert',50),
('Apparel & Fashion','apparel-fashion','Thoughtful packaging for clothing, accessories and lifestyle brands.','/images/industries/apparel-fashion.webp','Cream apparel gift box with tissue paper and burnt orange ribbon',60)
on conflict (slug) do nothing;

insert into public.projects (name, slug, category, image, alt, sort_order) values
('Bloom Botanics','bloom-botanics','Beauty','/images/projects/bloom-botanics.webp','Blush botanical cosmetics packaging for Bloom Botanics',10),
('Aurora Skincare','aurora-skincare','Skincare','/images/projects/aurora-skincare.webp','Navy celestial skincare packaging for Aurora Skincare',20),
('Better Snacks','better-snacks','Food','/images/projects/better-snacks.webp','Kraft orange and green snack packaging for Better Snacks',30),
('Velora Tea','velora-tea','Food & drink','/images/projects/velora-tea.webp','Black and gold presentation packaging for Velora Tea',40),
('Natura Home','natura-home','Home fragrance','/images/projects/natura-home.webp','Sage green botanical packaging for Natura Home',50)
on conflict (slug) do nothing;

insert into public.faqs (question, answer, group_name, sort_order) values
('What is your minimum order quantity?','Most custom box projects begin at 100 units. Minimums can vary by structure, material and finish, so we will recommend the most practical production route for your quantity.','home',10),
('Can you create custom sizes?','Yes. Every structure can be tailored around your product, including internal fit, inserts and shipping requirements.','home',20),
('Can you help with artwork?','Yes. We provide dielines, artwork checks, prepress guidance and digital proofs before production begins.','home',30),
('Do you offer samples?','Yes. We can provide existing samples, plain structural samples or fully printed production samples depending on your project stage.','home',40),
('What printing and finishes are available?','Options include offset and digital print, matte or gloss lamination, soft touch, foil, Spot UV, embossing, debossing and more.','home',50),
('Do you ship internationally?','Yes. We support brands across the United States, Canada, the United Kingdom, Europe and other international markets.','home',60),
('How quickly will I receive a quote?','Most quotes are prepared within one business day. If a structure needs extra engineering, a specialist will follow up with clarifying questions first.','quote',10),
('Do I need final artwork to get pricing?','No. Share what you have — a sketch, a brand file, or nothing at all. We can quote from dimensions and style, then help with dielines and artwork after.','quote',20)
on conflict do nothing;

insert into public.site_settings (key, value) values
('general', '{"company_name":"Fable Packaging","email":"hello@fablepack.co","phone":"+1 (855) 123-4567","phone_href":"+18551234567","address":"","facebook":"","instagram":"","linkedin":"","youtube":"","tagline":"Thoughtful custom packaging for ambitious brands. Sustainable, scalable and memorable.","newsletter_title":"Packaging notes, worth opening.","newsletter_body":"Fresh ideas, useful guides and product news. No clutter.","copyright_text":"© 2026 Fable Packaging Co. All rights reserved."}'::jsonb)
on conflict (key) do nothing;

insert into public.page_content (page_slug, content_key, label, value, input_type, sort_order) values
('home','hero_eyebrow','Hero eyebrow','Custom packaging, made memorable','text',10),
('home','hero_title','Hero title','Packaging that elevates your brand.','text',20),
('home','hero_body','Hero description','Custom boxes, endless possibilities. Thoughtful packaging solutions designed to protect your products, reflect your brand, and make every unboxing count.','textarea',30),
('home','products_title','Products section title','Find the right box for your product','text',40),
('home','products_body','Products section description','Explore our most-loved packaging formats, built to protect, present and elevate your products.','textarea',50),
('home','industries_title','Industries section title','Packaging made for your industry.','text',60),
('home','industries_body','Industries section description','From beauty launches to ecommerce deliveries, discover packaging solutions shaped around the way your products are sold, shipped and experienced.','textarea',70),
('home','projects_title','Projects section title','Fresh from the studio','text',80),
('home','projects_body','Projects section description','Real structures. Original artwork. Packaging made to be remembered.','textarea',90),
('home','why_eyebrow','Why section eyebrow','Why Fable','text',100),
('home','why_title','Why section title','Great packaging should feel simple.','text',110),
('home','why_body','Why section description','From first sketch to final delivery, our packaging experts bring structure, clarity and craft to every project — so you can focus on growing your brand.','textarea',120),
('home','materials_eyebrow','Materials eyebrow','Make it distinctly yours','text',130),
('home','materials_title','Materials title','Materials and finishes that make an impression.','text',140),
('home','materials_body','Materials description','From natural kraft textures to soft-touch finishes and metallic foils, choose the details that make your packaging unmistakably yours.','textarea',150),
('home','sustainability_eyebrow','Sustainability eyebrow','Packaging with a lighter footprint','text',160),
('home','sustainability_title','Sustainability title','A better box for a brighter tomorrow.','text',170),
('home','sustainability_body','Sustainability description','Make confident material choices without compromising the experience. Our team helps you reduce waste at every step.','textarea',180),
('home','process_eyebrow','Process eyebrow','A clear path forward','text',190),
('home','process_title','Process title','How it works','text',200),
('home','process_body','Process description','Four simple steps from idea to delivery.','textarea',210),
('home','testimonial_title','Testimonial title','Packaging partnership, without the complexity.','text',220),
('home','testimonial_quote','Testimonial quote','Fable made a complex launch feel effortless. The samples were beautiful, communication was clear, and the finished boxes exceeded every expectation.','textarea',230),
('home','testimonial_initials','Testimonial initials','SK','text',240),
('home','testimonial_name','Testimonial name','Sarah Kim','text',250),
('home','testimonial_role','Testimonial role','Founder, PureGlow','text',260),
('home','cta_eyebrow','Final CTA eyebrow','Ready when you are','text',270),
('home','cta_title','Final CTA title','Let’s create packaging worth opening.','text',280),
('home','cta_body','Final CTA description','Tell us what you’re making. We’ll help shape the rest.','textarea',290)
on conflict (page_slug, content_key) do nothing;

insert into public.page_content (page_slug, content_key, label, value, input_type, sort_order) values
('get-a-quote','quote_eyebrow','Quote hero eyebrow','Built around your product','text',10),
('get-a-quote','quote_title','Quote hero title','Tell us about your packaging.','text',20),
('get-a-quote','quote_intro','Quote hero description','Share what you know — skip the rest. Quotes are free, and a specialist usually replies within one business day.','textarea',30),
('get-a-quote','quote_faq_eyebrow','Quote FAQ eyebrow','Before you send','text',40),
('get-a-quote','quote_faq_title','Quote FAQ title','Quote questions, answered.','text',50),
('contact','contact_eyebrow','Contact eyebrow','We’re here to help','text',10),
('contact','contact_title','Contact title','Let’s talk packaging.','text',20),
('contact','contact_intro','Contact introduction','Questions about materials, sizing or a project already in motion? Send us a note.','textarea',30),
('contact','contact_info_title','Contact information title','Talk to a real packaging person.','text',40),
('contact','contact_info_body','Contact information description','Our team works across time zones to keep projects moving.','textarea',50),
('contact','contact_hours','Business hours','Monday–Friday, 9am–6pm EST','text',60)
on conflict (page_slug, content_key) do nothing;

insert into public.page_content (page_slug, content_key, label, value, input_type, sort_order)
select p.slug, x.content_key, x.label, x.value, x.input_type, x.sort_order
from (values
  ('custom-boxes','Custom boxes, made around you.','Packaging library','Explore proven box structures, then tailor every dimension, material and detail to your product.'),
  ('industries','Built for the way you sell.','Industry expertise','Practical structures and beautiful print for brands in every aisle and every inbox.'),
  ('materials','Materials with substance.','Material library','Compare strength, printability, texture and sustainability to find the right foundation.'),
  ('finishes','The details people remember.','Finishes & effects','Add tactile and visual depth with a carefully chosen premium finish.'),
  ('design-support','Design support, on the house.','From sketch to press','Dielines, artwork checks, 3D mockups and practical advice from specialists who know boxes.'),
  ('sustainability','Packaging with more purpose.','Better by design','Smarter materials and less waste, without giving up the moments that make your brand special.'),
  ('about','Making custom feel uncomplicated.','Our story','We pair production expertise with thoughtful service to help growing brands package with confidence.'),
  ('faq','Good questions. Clear answers.','Help center','Everything you need to move your packaging project forward.'),
  ('blog','Ideas worth unpacking.','Fable journal','Practical packaging guidance, material notes and inspiration for growing brands.'),
  ('packaging-guide','The packaging guide.','Start smarter','A friendly, practical guide to structure, sizing, materials, print and production.'),
  ('our-process','From idea to delivery.','Our process','A clear, collaborative path from structural concept to finished packaging.'),
  ('reviews','Brands say the nicest things.','Customer stories','See why growing teams trust Fable with their most important product moments.'),
  ('projects','Fresh from the studio.','Selected work','A collection of packaging projects built to perform and designed to be remembered.'),
  ('artwork-guidelines','Artwork guidelines.','Ready for press','Prepare clean, accurate artwork and move from proof to production with confidence.'),
  ('shipping-and-delivery','Shipping and delivery.','Around the world','Flexible freight options, transparent timelines and clear project tracking.'),
  ('track-your-order','Track your order.','Project status','Get in touch with your order reference and our team will share the latest update.'),
  ('help-center','How can we help?','Fable support','Guides and answers for artwork, materials, production, shipping and more.'),
  ('privacy-policy','Privacy policy','The important details','How we collect, use and protect your information.'),
  ('terms','Terms of service','The important details','The terms that govern use of our website and services.'),
  ('shipping-policy','Shipping policy','The important details','How we plan, track and deliver packaging around the world.'),
  ('refund-policy','Refund policy','The important details','Our approach to changes, cancellations and production issues.')
) as p(slug, title, eyebrow, intro)
cross join lateral (values
  ('page_title','Page title',p.title,'text',10),
  ('page_eyebrow','Page eyebrow',p.eyebrow,'text',20),
  ('page_intro','Page introduction',p.intro,'textarea',30)
) as x(content_key, label, value, input_type, sort_order)
on conflict (page_slug, content_key) do nothing;

-- After creating a user in Authentication > Users, bootstrap the first owner:
-- insert into public.admin_users (user_id, email, role)
-- select id, email, 'owner' from auth.users where email = 'owner@example.com';
