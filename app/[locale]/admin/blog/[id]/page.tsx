'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save, Loader2, Globe } from 'lucide-react';

interface BlogPost {
    id: number;
    slug: string;
    locale: string;
    title: string;
    excerpt: string | null;
    content: string;
    cover_image_url: string | null;
    keywords: string | null;
    author_name: string;
    published_at: string | null;
}

export default function BlogEditorPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const isNew = resolvedParams.id === 'new';

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [translating, setTranslating] = useState(false);
    const [post, setPost] = useState<Partial<BlogPost>>({
        slug: '',
        locale: 'en',
        title: '',
        excerpt: '',
        content: '',
        cover_image_url: '',
        keywords: '',
        author_name: '',
    });

    const router = useRouter();

    useEffect(() => {
        checkAuth();
        if (!isNew) {
            fetchPost();
        }
    }, []);

    const checkAuth = async () => {
        const response = await fetch('/api/admin/auth');
        const data = await response.json() as { authenticated: boolean };
        if (!data.authenticated) {
            router.push('/admin/login');
        }
    };

    const fetchPost = async () => {
        try {
            const response = await fetch(`/api/admin/blog?locale=en`);
            const data = await response.json() as { posts?: BlogPost[] };
            const found = data.posts?.find((p: BlogPost) => p.id === parseInt(resolvedParams.id));

            if (found) {
                setPost(found);
            }
        } catch (error) {
            console.error('Failed to fetch post:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const method = isNew ? 'POST' : 'PUT';
            const response = await fetch('/api/admin/blog', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(post),
            });

            if (response.ok) {
                router.push('/admin/blog');
            } else {
                const data = await response.json() as { error?: string };
                alert(data.error || 'Failed to save');
            }
        } catch (error) {
            console.error('Failed to save:', error);
            alert('Failed to save post');
        } finally {
            setSaving(false);
        }
    };

    const handleTranslate = async () => {
        if (!post.content) {
            alert('Please enter some content first');
            return;
        }

        if (!confirm(`This will overwrite the current content with a ${post.locale === 'en' ? 'Chinese' : 'English'} translation. Continue?`)) {
            return;
        }

        setTranslating(true);
        try {
            const targetLocale = post.locale === 'en' ? 'zh' : 'en';

            const response = await fetch('/api/admin/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: post.title,
                    excerpt: post.excerpt,
                    content: post.content,
                    keywords: post.keywords,
                    author_name: post.author_name,
                    targetLocale
                }),
            });

            if (response.ok) {
                const data = await response.json() as {
                    title: string;
                    excerpt: string;
                    content: string;
                    keywords: string;
                    author_name: string;
                };

                setPost(prev => ({
                    ...prev,
                    ...data,
                    locale: targetLocale
                }));

                // Also update the slug to be translation-friendly if needed? 
                // Alternatively, user can just edit the slug manually.
                // alert('Translation complete! Please review and update the Slug if needed.');
            } else {
                const data = await response.json() as { error?: string };
                alert(data.error || 'Translation failed');
            }
        } catch (error) {
            console.error('Translation error:', error);
            alert('Translation failed');
        } finally {
            setTranslating(false);
        }
    };

    const updateField = (field: string, value: string) => {
        setPost(prev => ({ ...prev, [field]: value }));
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-4xl mx-auto">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Link href="/admin/blog">
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="w-4 h-4" />
                                </Button>
                            </Link>
                            <div className="flex-1">
                                <CardTitle>{isNew ? 'New Blog Post' : 'Edit Blog Post'}</CardTitle>
                                <CardDescription>
                                    {isNew ? 'Create a new blog article' : `Editing: ${post.slug}`}
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleTranslate}
                                    disabled={translating || saving}
                                    variant="secondary"
                                >
                                    {translating ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Translating...
                                        </>
                                    ) : (
                                        <>
                                            <Globe className="w-4 h-4 mr-2" />
                                            Translate to {post.locale === 'en' ? 'Chinese' : 'English'}
                                        </>
                                    )}
                                </Button>
                                <Button onClick={handleSave} disabled={saving || translating}>
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    value={post.slug || ''}
                                    onChange={(e) => updateField('slug', e.target.value)}
                                    placeholder="my-blog-post"
                                    disabled={!isNew}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="locale">Language</Label>
                                <Select
                                    value={post.locale || 'en'}
                                    onValueChange={(value) => updateField('locale', value)}
                                    disabled={!isNew}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">English</SelectItem>
                                        <SelectItem value="zh">中文</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={post.title || ''}
                                onChange={(e) => updateField('title', e.target.value)}
                                placeholder="Blog post title"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="excerpt">Excerpt</Label>
                            <Textarea
                                id="excerpt"
                                value={post.excerpt || ''}
                                onChange={(e) => updateField('excerpt', e.target.value)}
                                placeholder="Brief description of the post"
                                rows={2}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">Content (Markdown)</Label>
                            <Textarea
                                id="content"
                                value={post.content || ''}
                                onChange={(e) => updateField('content', e.target.value)}
                                placeholder="Write your blog post content in Markdown..."
                                rows={20}
                                className="font-mono text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="cover_image_url">Cover Image URL</Label>
                                <Input
                                    id="cover_image_url"
                                    value={post.cover_image_url || ''}
                                    onChange={(e) => updateField('cover_image_url', e.target.value)}
                                    placeholder="/blog/cover.jpg or https://..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="author_name">Author</Label>
                                <Input
                                    id="author_name"
                                    value={post.author_name || ''}
                                    onChange={(e) => updateField('author_name', e.target.value)}
                                    placeholder="Author name"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="keywords">Keywords</Label>
                            <Input
                                id="keywords"
                                value={post.keywords || ''}
                                onChange={(e) => updateField('keywords', e.target.value)}
                                placeholder="keyword1, keyword2, keyword3"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
