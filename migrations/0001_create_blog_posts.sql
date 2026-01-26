-- Create blog posts table with bilingual support
-- Each article can have multiple language versions (same slug, different locale)

CREATE TABLE blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en',
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  keywords TEXT,
  author_name TEXT DEFAULT 'Anonymous',
  author_picture TEXT,
  published_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(slug, locale)
);

-- Indexes for common queries
CREATE INDEX idx_posts_locale ON blog_posts(locale);
CREATE INDEX idx_posts_slug_locale ON blog_posts(slug, locale);
CREATE INDEX idx_posts_published ON blog_posts(published_at DESC);
