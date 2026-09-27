-- Table for Mirage Configuration
CREATE TABLE IF NOT EXISTS admin_mirage_config (
  id TEXT PRIMARY KEY,
  generator_pin_hash TEXT NOT NULL,
  generator_pin_salt TEXT NOT NULL,
  true_colors JSONB NOT NULL,
  true_port INT DEFAULT 8,
  mirage_strikes INT DEFAULT 0,
  mirage_locked_until TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Table for Mirage Temporary OTPs
CREATE TABLE IF NOT EXISTS admin_mirage_otps (
  id TEXT PRIMARY KEY,
  otp_hash TEXT NOT NULL,
  otp_salt TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Insert Default Config (Master PIN: 242242)
-- Note: In production, the backend will update these hashes properly.
-- For now we can use a temporary placeholder that the backend will replace on first boot.
INSERT INTO admin_mirage_config (id, generator_pin_hash, generator_pin_salt, true_colors)
VALUES (
  'master_mirage', 
  'UNINITIALIZED', 
  'UNINITIALIZED', 
  '["#10b981", "#10b981", "#10b981", "#10b981"]'
)
ON CONFLICT (id) DO NOTHING;
