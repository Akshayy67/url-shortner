-- Create the urls table
CREATE TABLE IF NOT EXISTS urls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  original_url TEXT NOT NULL,
  short_code VARCHAR(10) UNIQUE NOT NULL,
  custom_alias VARCHAR(50) UNIQUE,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  user_ip INET,
  user_agent TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_urls_short_code ON urls(short_code);
CREATE INDEX IF NOT EXISTS idx_urls_custom_alias ON urls(custom_alias);
CREATE INDEX IF NOT EXISTS idx_urls_created_at ON urls(created_at);
CREATE INDEX IF NOT EXISTS idx_urls_active ON urls(is_active);

-- Create the clicks table for detailed analytics
CREATE TABLE IF NOT EXISTS clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url_id UUID REFERENCES urls(id) ON DELETE CASCADE,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_ip INET,
  user_agent TEXT,
  referer TEXT,
  country VARCHAR(2),
  city VARCHAR(100)
);

-- Create indexes for clicks table
CREATE INDEX IF NOT EXISTS idx_clicks_url_id ON clicks(url_id);
CREATE INDEX IF NOT EXISTS idx_clicks_clicked_at ON clicks(clicked_at);

-- Function to increment click count
CREATE OR REPLACE FUNCTION increment_click_count(url_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE urls 
  SET click_count = click_count + 1 
  WHERE id = url_id_param;
END;
$$ LANGUAGE plpgsql;

-- Function to check if URL is expired
CREATE OR REPLACE FUNCTION is_url_expired(expires_at_param TIMESTAMP WITH TIME ZONE)
RETURNS boolean AS $$
BEGIN
  IF expires_at_param IS NULL THEN
    RETURN false;
  END IF;
  RETURN expires_at_param < NOW();
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security (RLS)
ALTER TABLE urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE clicks ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a public URL shortener)
CREATE POLICY "Allow public read access to active URLs" ON urls
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public insert of URLs" ON urls
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update of click count" ON urls
  FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to clicks" ON clicks
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert of clicks" ON clicks
  FOR INSERT WITH CHECK (true);
