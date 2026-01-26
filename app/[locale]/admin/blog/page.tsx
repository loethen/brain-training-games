'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Plus, Edit, Trash2, LogOut, Loader2, FileText } from 'lucide-react';

interface BlogPost {
    id: number;
    slug: string;
    locale: string;
    title: string;
    excerpt: string | null;
    published_at: string | null;
    created_at: string;
}

export default function AdminBlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [locale, setLocale] = useState('en');
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (!loading) {
            fetchPosts();
        }
    }, [locale]);

    const checkAuth = async () => {
        const response = await fetch('/api/admin/auth');
        const data = await response.json() as { authenticated: boolean };

        if (!data.authenticated) {
            router.push('/admin/login');
            return;
        }

        fetchPosts();
    };

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/blog?locale=${locale}`);
            const data = await response.json() as { posts?: BlogPost[] };
            setPosts(data.posts || []);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await fetch('/api/admin/auth', { method: 'DELETE' });
        router.push('/admin/login');
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            await fetch('/api/admin/blog', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            fetchPosts();
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
            <div className="max-w-6xl mx-auto">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <FileText className="w-6 h-6" />
                                Blog Posts
                            </CardTitle>
                            <CardDescription>
                                Manage your blog content
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-4">
                            <Select value={locale} onValueChange={setLocale}>
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="zh">中文</SelectItem>
                                </SelectContent>
                            </Select>
                            <Link href="/admin/blog/new">
                                <Button>
                                    <Plus className="w-4 h-4 mr-2" />
                                    New Post
                                </Button>
                            </Link>
                            <Button variant="outline" onClick={handleLogout}>
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No posts found for {locale === 'en' ? 'English' : '中文'}
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Slug</TableHead>
                                        <TableHead>Published</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {posts.map((post) => (
                                        <TableRow key={post.id}>
                                            <TableCell className="font-medium">
                                                {post.title}
                                                <Badge variant="outline" className="ml-2">
                                                    {post.locale}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {post.slug}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(post.published_at)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={`/admin/blog/${post.id}`}>
                                                        <Button variant="ghost" size="sm">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-destructive"
                                                        onClick={() => handleDelete(post.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
