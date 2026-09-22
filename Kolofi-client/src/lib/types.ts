// User types
export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Savings Circle types
export interface SavingsCircle {
  id: string;
  name: string;
  description?: string;
  target: number;
  currentAmount: number;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  startDate: Date;
  endDate?: Date;
  memberCount: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CircleMember {
  id: string;
  circleId: string;
  userId: string;
  joinedAt: Date;
  totalContributed: number;
  status: 'active' | 'inactive' | 'pending';
}

// Vault types
export interface Vault {
  id: string;
  userId: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
  type: 'savings' | 'emergency' | 'goal' | 'investment';
  createdAt: Date;
  updatedAt: Date;
}

// Group Funds types
export interface GroupFund {
  id: string;
  name: string;
  description?: string;
  purpose: string;
  targetAmount: number;
  currentAmount: number;
  memberCount: number;
  adminId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Transaction types
export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  circleId?: string;
  vaultId?: string;
  groupFundId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}
