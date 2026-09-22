import { NextRequest, NextResponse } from 'next/server'
import { generateId, isValidEmail } from '@/lib/auth'

// Mock database - in production, use a real database
const users = new Map()

// Add a test user for demo purposes
users.set('test@example.com', {
  id: 'usr_test123',
  email: 'test@example.com',
  fullName: 'Test User',
  passwordHash: 'hashed_password_here',
})

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validation
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: 'Please enter a valid email' },
        { status: 400 }
      )
    }

    if (!password) {
      return NextResponse.json(
        { message: 'Password is required' },
        { status: 400 }
      )
    }

    // Find user (mock implementation)
    const user = users.get(email)
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // For demo, accept any password
    // In production, verify password hash: await verifyPassword(password, user.passwordHash)

    // Generate session token
    const token = generateId('tok')

    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        userId: user.id,
        token,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'An error occurred during login' },
      { status: 500 }
    )
  }
}
