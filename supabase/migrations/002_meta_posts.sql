-- Centralized metadata table for all public pages
CREATE TABLE IF NOT EXISTS public.meta (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_default TEXT,
  title_template TEXT,
  description TEXT,
  keywords JSONB,
  authors JSONB,
  creator TEXT,
  publisher TEXT,
  og_title TEXT,
  og_description TEXT,
  og_url TEXT,
  og_site_name TEXT,
  og_images JSONB,
  og_locale TEXT,
  og_type TEXT,
  robots_index BOOLEAN DEFAULT true,
  robots_follow BOOLEAN DEFAULT true,
  googlebot JSONB,
  yandex_verification TEXT,
  manifest TEXT,
  canonical_url TEXT,
  twitter_card TEXT,
  twitter_title TEXT,
  twitter_description TEXT,
  twitter_images JSONB,
  json_ld JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_meta_canonical_url ON public.meta(canonical_url);

-- Link site settings to global metadata entry
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS meta_id UUID REFERENCES public.meta(id) ON DELETE SET NULL;

-- Blog posts
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  banner_image TEXT NOT NULL,
  meta_id UUID NOT NULL REFERENCES public.meta(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);

-- Ordered post sections
CREATE TABLE IF NOT EXISTS public.post_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  text TEXT NOT NULL,
  image TEXT,
  "order" INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_post_sections_order ON public.post_sections(post_id, "order");

-- Update timestamps
CREATE TRIGGER update_meta_updated_at BEFORE UPDATE ON public.meta
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE public.meta ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Meta is viewable by everyone" ON public.meta
  FOR SELECT USING (true);

CREATE POLICY "Posts are viewable by everyone" ON public.posts
  FOR SELECT USING (true);

CREATE POLICY "Post sections are viewable by everyone" ON public.post_sections
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert meta" ON public.meta
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update meta" ON public.meta
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete meta" ON public.meta
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert posts" ON public.posts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update posts" ON public.posts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete posts" ON public.posts
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert post sections" ON public.post_sections
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update post sections" ON public.post_sections
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete post sections" ON public.post_sections
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Seed global metadata
WITH global_meta AS (
  INSERT INTO public.meta (
    title_default,
    title_template,
    description,
    keywords,
    authors,
    creator,
    publisher,
    og_title,
    og_description,
    og_site_name,
    og_locale,
    og_type,
    robots_index,
    robots_follow,
    googlebot,
    yandex_verification,
    manifest,
    canonical_url,
    twitter_card,
    twitter_title,
    twitter_description,
    json_ld
  ) VALUES (
    'Неврологическая клиника Доктора Авдеевой',
    '%s | Неврологическая клиника Доктора Авдеевой',
    'Диагностика и лечение неврологических заболеваний: мигрени, боли в спине, нарушения сна, реабилитация.',
    '["невролог", "головная боль", "лечение мигрени", "неврология", "боль в спине"]'::jsonb,
    '[{"name": "Доктор Анна Авдеева"}]'::jsonb,
    'Доктор Анна Авдеева',
    'Неврологическая клиника Доктора Авдеевой',
    'Неврологическая клиника Доктора Авдеевой',
    'Современный подход к неврологии, доказательная медицина и персональный план лечения.',
    'Неврологическая клиника Доктора Авдеевой',
    'ru_RU',
    'website',
    true,
    true,
    '{"index": true, "follow": true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1}'::jsonb,
    '106364517',
    '/manifest.json',
    '/',
    'summary_large_image',
    'Неврологическая клиника Доктора Авдеевой',
    'Современная диагностика и лечение неврологических заболеваний.',
    '{"@context": "https://schema.org", "@type": "MedicalClinic", "name": "Неврологическая клиника Доктора Авдеевой", "medicalSpecialty": "Neurologic", "url": "https://example.com"}'::jsonb
  )
  ON CONFLICT DO NOTHING
  RETURNING id
)
UPDATE public.site_settings
SET meta_id = COALESCE(
  (SELECT id FROM global_meta LIMIT 1),
  (SELECT id FROM public.meta ORDER BY created_at ASC LIMIT 1)
)
WHERE meta_id IS NULL;
