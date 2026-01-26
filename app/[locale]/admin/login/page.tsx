'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/admin/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (response.ok) {
                router.push('/admin/blog');
            } else {
                const data = await response.json() as { error?: string };
                setError(data.error || 'Login failed');
            }
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Lock className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Admin Login</CardTitle>
                    <CardDescription>
                        Enter your admin password to access the dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Input
                                type="password"
                                placeholder="Enter admin password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                autoFocus
                            />
                        </div>

                        {error && (
                            <div className="text-sm text-destructive text-center">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={loading || !password}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Logging in...
                                </>
                            ) : (
                                'Login'
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
