import crypto from 'crypto'

// Generate a unique ID
export function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).slice(2)
  return prefix ? `${prefix}_${timestamp}${random}` : `${timestamp}${random}`
}

// Hash a password
export async function hashPassword(password: string): Promise<string> {
  // Using Node.js crypto for hashing (in production, use bcrypt)
  const hash = crypto.pbkdf2Sync(password, 'salt', 1000, 64, 'sha512')
  return hash.toString('hex')
}

// Verify a password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}

// Generate session token
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Generate OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone number (Nigerian format)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+234|0)[0-9]{10}$/
  return phoneRegex.test(phone)
}

// Validate password strength
export function isValidPassword(password: string): boolean {
  return password.length >= 8
}

// User types for auth
export interface SignUpData {
  email: string
  password: string
  fullName: string
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  message: string
  userId?: string
  token?: string
}
