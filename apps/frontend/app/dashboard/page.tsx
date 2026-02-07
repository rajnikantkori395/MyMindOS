/**
 * Dashboard Page
 * Main dashboard page after authentication
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, ThemeToggle } from '@/components/common';

export default function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {user.name}!
            </h1>
            <p className="mt-2 text-muted-foreground">
              {user.email}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" onClick={logout}>
              Sign out
            </Button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Get started with MyMindOS
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="/memories">
                  <Button variant="outline" fullWidth className="justify-start">
                    Manage Memories
                  </Button>
                </Link>
                <Link href="/files">
                  <Button variant="outline" fullWidth className="justify-start">
                    Upload Files
                  </Button>
                </Link>
                <Link href="/chat">
                  <Button variant="outline" fullWidth className="justify-start">
                    Start Chat
                  </Button>
                </Link>
                <Link href="/tasks">
                  <Button variant="outline" fullWidth className="justify-start">
                    Manage Tasks
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="outline" fullWidth className="justify-start">
                    View Profile
                  </Button>
                </Link>
                <Link href="/guide">
                  <Button variant="outline" fullWidth className="justify-start">
                    User Manual
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Manage your account settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Role:</span>
                  <span className="font-medium capitalize">{user.role}</span>
                </div>
                {user.status && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium capitalize">{user.status}</span>
                  </div>
                )}
                <div className="pt-2">
                  <Link href="/profile">
                    <Button variant="outline" size="sm" fullWidth>
                      Edit Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Welcome</CardTitle>
              <CardDescription>
                Your personal AI operating system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Start by uploading files, creating memories, or exploring your
                knowledge base. Everything is organized and searchable.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

