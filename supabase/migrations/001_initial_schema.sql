-- Bodega Research Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_name TEXT NOT NULL,
  raw_notes JSONB NOT NULL,
  ai_data JSONB,
  infographic_url TEXT,
  report_url TEXT,
  rating_score DECIMAL(3,1),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  project_link TEXT,
  email TEXT NOT NULL,
  telegram_username TEXT,
  preferred_contact TEXT DEFAULT 'email',
  preferred_contact_other TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to reviews table
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Public read access for reviews (for the market frontend)
CREATE POLICY "Reviews are publicly viewable"
  ON reviews FOR SELECT
  USING (true);

-- Only authenticated users can insert/update reviews
CREATE POLICY "Authenticated users can insert reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update reviews"
  ON reviews FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Anyone can submit leads (contact form)
CREATE POLICY "Anyone can submit leads"
  ON leads FOR INSERT
  WITH CHECK (true);

-- Only authenticated users can view leads
CREATE POLICY "Authenticated users can view leads"
  ON leads FOR SELECT
  USING (auth.role() = 'authenticated');

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_rating_score ON reviews(rating_score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- Storage buckets (run these separately in Supabase Storage settings)
-- Or use the Supabase CLI to create them:
--
-- Public bucket for infographics (publicly accessible)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('public-infographics', 'public-infographics', true);
--
-- Private bucket for reports (authenticated access only)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('private-reports', 'private-reports', false);
