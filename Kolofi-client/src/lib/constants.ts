// App constants
export const APP_NAME = 'Kolofi';
export const APP_TAGLINE = 'Save Smart Together';
export const APP_DESCRIPTION = 'A modern fintech platform for group savings in Africa';

// Navigation
export const MAIN_NAV_ITEMS = [
  { label: 'Home', href: '/', icon: 'home' },
  { label: 'Circles', href: '/circles', icon: 'users' },
  { label: 'Vaults', href: '/vaults', icon: 'lock' },
  { label: 'Funds', href: '/funds', icon: 'zap' },
];

// Savings frequency options
export const FREQUENCY_OPTIONS = [
  { value: 'weekly', label: 'Weekly', days: 7 },
  { value: 'biweekly', label: 'Bi-weekly', days: 14 },
  { value: 'monthly', label: 'Monthly', days: 30 },
];

// Vault types
export const VAULT_TYPES = [
  { value: 'savings', label: 'Savings', icon: '💰' },
  { value: 'emergency', label: 'Emergency Fund', icon: '🚨' },
  { value: 'goal', label: 'Goal', icon: '🎯' },
  { value: 'investment', label: 'Investment', icon: '📈' },
];

// Transaction types
export const TRANSACTION_TYPES = {
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
  TRANSFER: 'transfer',
};

// Transaction statuses
export const TRANSACTION_STATUSES = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

// Member statuses
export const MEMBER_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
};

// Notification types
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
};

// Currency settings — Arc native USDC
export const CURRENCY = {
  SYMBOL: '$',
  CODE: 'USDC',
  LOCALE: 'en-US',
  SUFFIX: 'USDC',
};

// Onboarding steps
export const ONBOARDING_STEPS = [
  { step: 1, title: 'Welcome', description: 'Welcome to Kolofi' },
  { step: 2, title: 'Profile', description: 'Complete your profile' },
  { step: 3, title: 'Verification', description: 'Verify your identity' },
  { step: 4, title: 'Ready', description: 'You\'re all set!' },
];

// Feature flags
export const FEATURES = {
  DARK_MODE: true,
  NOTIFICATIONS: true,
  ONBOARDING: true,
  PWA: true,
};
