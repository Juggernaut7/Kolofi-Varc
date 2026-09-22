-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  full_name TEXT NOT NULL,
  phone_number TEXT,
  avatar TEXT,
  bio TEXT,
  country TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Savings Circles table
CREATE TABLE IF NOT EXISTS savings_circles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  target DECIMAL(15,2) NOT NULL,
  current_amount DECIMAL(15,2) DEFAULT 0,
  frequency TEXT NOT NULL DEFAULT 'monthly',
  start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMP,
  created_by TEXT NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Circle Members table
CREATE TABLE IF NOT EXISTS circle_members (
  id TEXT PRIMARY KEY,
  circle_id TEXT NOT NULL REFERENCES savings_circles(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total_contributed DECIMAL(15,2) DEFAULT 0,
  status TEXT DEFAULT 'active',
  UNIQUE(circle_id, user_id)
);

-- Vaults table
CREATE TABLE IF NOT EXISTS vaults (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  description TEXT,
  target_amount DECIMAL(15,2) NOT NULL,
  current_amount DECIMAL(15,2) DEFAULT 0,
  deadline TIMESTAMP,
  type TEXT NOT NULL DEFAULT 'savings',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Group Funds table
CREATE TABLE IF NOT EXISTS group_funds (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  purpose TEXT,
  target_amount DECIMAL(15,2) NOT NULL,
  current_amount DECIMAL(15,2) DEFAULT 0,
  admin_id TEXT NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Group Fund Members table
CREATE TABLE IF NOT EXISTS group_fund_members (
  id TEXT PRIMARY KEY,
  fund_id TEXT NOT NULL REFERENCES group_funds(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total_contributed DECIMAL(15,2) DEFAULT 0,
  UNIQUE(fund_id, user_id)
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  type TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'completed',
  circle_id TEXT REFERENCES savings_circles(id),
  vault_id TEXT REFERENCES vaults(id),
  group_fund_id TEXT REFERENCES group_funds(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_circle_created_by ON savings_circles(created_by);
CREATE INDEX IF NOT EXISTS idx_circle_members_user ON circle_members(user_id);
CREATE INDEX IF NOT EXISTS idx_vault_user ON vaults(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_group_fund_admin ON group_funds(admin_id);
CREATE INDEX IF NOT EXISTS idx_group_fund_members_user ON group_fund_members(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
