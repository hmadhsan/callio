import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, role, company } = body;

    // Validation
    if (!email || !role) {
      return NextResponse.json(
        { error: 'Email and role are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check for duplicate email
    const existingSignup = await prisma.betaSignup.findUnique({
      where: { email },
    });

    if (existingSignup) {
      return NextResponse.json(
        { error: 'This email is already registered' },
        { status: 409 }
      );
    }

    // Valid roles
    const validRoles = ['Developer', 'API Provider', 'AI Startup', 'Other'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role selected' },
        { status: 400 }
      );
    }

    // Create signup
    const signup = await prisma.betaSignup.create({
      data: {
        email,
        role,
        company: company || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "You're on the list. We'll be in touch soon.",
        id: signup.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Beta signup error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST only endpoint for beta signups',
  });
}
