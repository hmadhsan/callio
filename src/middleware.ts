import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const ref = url.searchParams.get('ref');

  // If there's a referral code in the URL
  if (ref) {
    // Clone URL and remove 'ref' so we can redirect to clean URL
    const cleanUrl = new URL(url.toString());
    cleanUrl.searchParams.delete('ref');
    
    // Redirect to clean URL
    const response = NextResponse.redirect(cleanUrl);
    
    // Set cookie for 60 days
    response.cookies.set('callio_ref', ref, {
      path: '/',
      maxAge: 60 * 60 * 24 * 60, // 60 days
      httpOnly: true, // Cannot be accessed by client JS
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    
    // Asynchronously log the click (fire and forget)
    // We send this to our API route to increment click_count
    fetch(`${url.origin}/api/affiliate/track-click?ref=${ref}`, { method: 'POST' }).catch(() => {});

    return response;
  }

  return NextResponse.next();
}

// Optionally, configure matcher to avoid running middleware on static files
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api|images|logo|public).*)',
  ],
};
