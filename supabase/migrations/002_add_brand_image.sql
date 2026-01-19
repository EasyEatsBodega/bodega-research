-- Add brand_image_url column to reviews table
-- Run this in Supabase SQL Editor

ALTER TABLE reviews ADD COLUMN IF NOT EXISTS brand_image_url TEXT;
