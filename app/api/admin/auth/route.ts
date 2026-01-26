import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

const ADMIN_SESSION_COOKIE = 'admin_session';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

// Simple session token generator
function generateSessionToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as { password: string };
        const { password } = body;

        // Get admin password from environment
        let adminPassword: string | undefined;

        try {
            const { env } = await getCloudflareContext();
            adminPassword = (env as unknown as Record<string, string>)?.ADMIN_PASSWORD;
        } catch {
            // Ignore error
        }

        // Fallback to process.env for local development if not found in context
        if (!adminPassword) {
            adminPassword = process.env.ADMIN_PASSWORD;
        }

        if (!adminPassword) {
            return NextResponse.json(
                { error: 'Admin password not configured' },
                { status: 500 }
            );
        }

        if (password !== adminPassword) {
            return NextResponse.json(
                { error: 'Invalid password' },
                { status: 401 }
            );
        }

        // Generate session token
        const sessionToken = generateSessionToken();

        // Set cookie
        const cookieStore = await cookies();
        cookieStore.set(ADMIN_SESSION_COOKIE, sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: SESSION_DURATION / 1000,
            path: '/',
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Auth error:', error);
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500 }
        );
    }
}

export async function DELETE() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete(ADMIN_SESSION_COOKIE);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { error: 'Logout failed' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get(ADMIN_SESSION_COOKIE);

        if (!session?.value) {
            return NextResponse.json({ authenticated: false });
        }

        return NextResponse.json({ authenticated: true });
    } catch {
        return NextResponse.json({ authenticated: false });
    }
}
