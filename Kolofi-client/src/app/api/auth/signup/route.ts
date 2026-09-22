import { NextRequest, NextResponse } from 'next/server'
import { generateId, hashPassword, isValidEmail, isValidPassword } from '@/lib/auth'

// Mock database - in production, use a real database
const users = new Map()

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, password } = await request.json()

    // Validation
    if (!fullName?.trim()) {
      return NextResponse.json(
        { message: 'Full name is required' },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: 'Please enter a valid email' },
        { status: 400 }
      )
    }

    if (!isValidPassword(password)) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Check if user exists (mock implementation)
    if (users.has(email)) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user (mock implementation)
    const userId = generateId('usr')
    const user = {
      id: userId,
      email,
      fullName,
      passwordHash,
      createdAt: new Date(),
    }

    users.set(email, user)

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        userId,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { message: 'An error occurred during signup' },
      { status: 500 }
    )
  }
}
