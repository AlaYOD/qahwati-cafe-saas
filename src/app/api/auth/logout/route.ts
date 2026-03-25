import { NextResponse } from 'next/server'
import { logoutAction } from '@/lib/auth/auth-actions'

/**
 * POST /api/auth/logout
 * Clears authentication cookies and signs out the user.
 */
export async function POST(request: Request) {
  try {
    const origin = new URL(request.url).origin;
    await logoutAction()

    return NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully' 
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message }, 
      { status: 500 }
    )
  }
}

/**
 * GET /api/auth/logout
 * Allows logout via a simple link redirect.
 */
export async function GET(request: Request) {
  try {
    const origin = new URL(request.url).origin;
    await logoutAction()

    // Use origin to construct the absolute login URL
    return NextResponse.redirect(`${origin}/login`)
  } catch (error) {
    const origin = new URL(request.url).origin;
    return NextResponse.redirect(`${origin}/login?error=logout_failed`)
  }
}
