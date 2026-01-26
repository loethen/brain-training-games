import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getCloudflareContext } from '@opennextjs/cloudflare';

interface D1BlogPost {
    id: number;
    slug: string;
    locale: string;
    title: string;
    excerpt: string | null;
    content: string;
    cover_image_url: string | null;
    keywords: string | null;
    author_name: string;
    author_picture: string | null;
    published_at: string | null;
    created_at: string;
    updated_at: string;
}

// Check if user is authenticated
async function isAuthenticated(): Promise<boolean> {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get('admin_session');
        return !!session?.value;
    } catch {
        return false;
    }
}

// GET - List all blog posts
export async function GET(request: NextRequest) {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { env } = await getCloudflareContext();

        if (!env?.DB) {
            return NextResponse.json({ error: 'Database not available' }, { status: 500 });
        }

        const locale = request.nextUrl.searchParams.get('locale') || 'en';

        const result = await env.DB.prepare(
            `SELECT * FROM blog_posts WHERE locale = ? ORDER BY published_at DESC`
        ).bind(locale).all<D1BlogPost>();

        return NextResponse.json({ posts: result.results || [] });
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
}

// POST - Create new blog post
export async function POST(request: NextRequest) {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { env } = await getCloudflareContext();

        if (!env?.DB) {
            return NextResponse.json({ error: 'Database not available' }, { status: 500 });
        }

        const body = await request.json() as {
            slug: string;
            locale?: string;
            title: string;
            excerpt?: string;
            content: string;
            cover_image_url?: string;
            keywords?: string;
            author_name?: string;
        };
        const { slug, locale, title, excerpt, content, cover_image_url, keywords, author_name } = body;

        if (!slug || !title || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await env.DB.prepare(`
      INSERT INTO blog_posts (slug, locale, title, excerpt, content, cover_image_url, keywords, author_name, published_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(
            slug,
            locale || 'en',
            title,
            excerpt || '',
            content,
            cover_image_url || null,
            keywords || '',
            author_name || 'Anonymous'
        ).run();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}

// PUT - Update blog post
export async function PUT(request: NextRequest) {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { env } = await getCloudflareContext();

        if (!env?.DB) {
            return NextResponse.json({ error: 'Database not available' }, { status: 500 });
        }

        const body = await request.json() as {
            id: number;
            title: string;
            excerpt?: string;
            content: string;
            cover_image_url?: string;
            keywords?: string;
            author_name?: string;
            published_at?: string;
        };
        const { id, title, excerpt, content, cover_image_url, keywords, author_name, published_at } = body;

        if (!id) {
            return NextResponse.json({ error: 'Post ID required' }, { status: 400 });
        }

        await env.DB.prepare(`
      UPDATE blog_posts 
      SET title = ?, excerpt = ?, content = ?, cover_image_url = ?, keywords = ?, 
          author_name = ?, published_at = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(
            title,
            excerpt || '',
            content,
            cover_image_url || null,
            keywords || '',
            author_name || 'Anonymous',
            published_at,
            id
        ).run();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating post:', error);
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
}

// DELETE - Delete blog post
export async function DELETE(request: NextRequest) {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { env } = await getCloudflareContext();

        if (!env?.DB) {
            return NextResponse.json({ error: 'Database not available' }, { status: 500 });
        }

        const body = await request.json() as { id: number };
        const { id } = body;

        if (!id) {
            return NextResponse.json({ error: 'Post ID required' }, { status: 400 });
        }

        await env.DB.prepare(`DELETE FROM blog_posts WHERE id = ?`).bind(id).run();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting post:', error);
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}
