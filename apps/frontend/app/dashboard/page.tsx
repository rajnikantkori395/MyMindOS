/**
 * Dashboard Page
 * Main dashboard page after authentication
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen,
  Bot,
  CalendarCheck2,
  FolderUp,
  LayoutDashboard,
  ShieldCheck,
  UserCircle2,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  ThemeToggle,
} from '@/components/common';
import { DashboardActionTile } from './components/DashboardActionTile';
import { DashboardStatTile } from './components/DashboardStatTile';

const quickActions = [
  {
    title: 'Manage Memories',
    description: 'Create, search, and organize memory entries.',
    href: '/memories',
    icon: BookOpen,
  },
  {
    title: 'Upload Files',
    description: 'Add files and connect them to your knowledge graph.',
    href: '/files',
    icon: FolderUp,
  },
  {
    title: 'Start Chat',
    description: 'Ask questions and interact with your AI assistant.',
    href: '/chat',
    icon: Bot,
  },
  {
    title: 'Manage Tasks',
    description: 'Track actions and mark progress quickly.',
    href: '/tasks',
    icon: CalendarCheck2,
  },
  {
    title: 'View Profile',
    description: 'Update your account and preferences.',
    href: '/profile',
    icon: UserCircle2,
  },
  {
    title: 'User Guide',
    description: 'Learn workflows and best practices.',
    href: '/guide',
    icon: Sparkles,
  },
] as const;

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
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-linear-to-br from-primary/10 via-background to-background p-6 shadow-sm md:p-8">
          <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 left-20 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
                <LayoutDashboard className="mr-2 h-3.5 w-3.5 text-primary" />
                Intelligent Workspace
              </div>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                Welcome back, {user.name}!
              </h1>
              <p className="mt-2 text-sm text-muted-foreground md:text-base">
                {user.email}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button variant="outline" onClick={logout}>
                Sign out
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardStatTile
            label="Account Type"
            value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            icon={ShieldCheck}
          />
          <DashboardStatTile
            label="Account Status"
            value={user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : 'Active'}
            icon={UserCircle2}
            accentClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          />
          <DashboardStatTile
            label="Workspace"
            value="MyMindOS"
            icon={LayoutDashboard}
            accentClassName="bg-blue-500/10 text-blue-600 dark:text-blue-400"
          />
          <DashboardStatTile
            label="Assistant Ready"
            value="Online"
            icon={Bot}
            accentClassName="bg-violet-500/10 text-violet-600 dark:text-violet-400"
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Jump into your most important workflows.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {quickActions.map((action) => (
                  <DashboardActionTile key={action.href} {...action} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader>
              <CardTitle>Profile Snapshot</CardTitle>
              <CardDescription>
                Your account details at a glance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
              </div>
              <div className="rounded-xl border border-dashed border-border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">
                  Keep your profile current to improve personalized responses and recommendations.
                </p>
              </div>
              <Link href="/profile">
                <Button variant="outline" size="sm" fullWidth>
                  Edit Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>
                Build momentum with a simple first flow.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>1. Upload files to seed your knowledge base.</p>
              <p>2. Create memories to capture key context.</p>
              <p>3. Use chat to query and explore insights.</p>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <CardTitle>Recommended Next Step</CardTitle>
              <CardDescription>
                Continue where you get the most value.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-card/50 p-4">
                <div className="rounded-md bg-primary/10 p-2 text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Explore the guide to discover power workflows for faster memory retrieval and assistant usage.
                  </p>
                  <Link href="/guide">
                    <Button size="sm">Open Guide</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

