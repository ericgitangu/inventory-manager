import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log('Middleware token:', token);
    
    if (!token) {
        console.log('Redirecting to landing page');
        const url = req.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
    }
    
    console.log('Token found, proceeding');
    return NextResponse.next();
}

// Apply middleware to specific routes
export const config = {
    matcher: ['/dashboard/:path*', '/inventory/:path*'],
};
