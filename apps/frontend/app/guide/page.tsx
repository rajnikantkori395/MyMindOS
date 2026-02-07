/**
 * User Manual Guide Page
 * Comprehensive guide for end users on how to use MyMindOS
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
} from '@/components/common';
import {
  FileText,
  Brain,
  MessageSquare,
  CheckSquare,
  User,
  Upload,
  Search,
  Settings,
  BookOpen,
  Zap,
} from 'lucide-react';

export default function GuidePage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Zap,
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Welcome to MyMindOS!</h3>
            <p className="text-muted-foreground">
              MyMindOS is your personal AI operating system that helps you capture, organize, and
              recall your knowledge. This guide will walk you through all the features.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">First Steps</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Login with your credentials</li>
              <li>Explore the dashboard to see all available modules</li>
              <li>Start by uploading a file or creating a memory</li>
              <li>Try the chat feature to interact with your knowledge base</li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      id: 'authentication',
      title: 'Authentication',
      icon: User,
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Signing In</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Navigate to the Sign In page</li>
              <li>Enter your email and password</li>
              <li>Click "Sign in" to access your account</li>
              <li>You'll be automatically redirected to the dashboard</li>
            </ol>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Creating an Account</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Click "Sign up" on the login page</li>
              <li>Fill in your name, email, and password</li>
              <li>Password must be at least 8 characters with uppercase, lowercase, number, and special character</li>
              <li>Click "Sign up" to create your account</li>
            </ol>
          </div>
          <div className="bg-muted p-4 rounded-md">
            <p className="text-sm font-medium mb-1">💡 Tip:</p>
            <p className="text-sm text-muted-foreground">
              Your session is automatically saved. You'll stay logged in until you sign out.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'files',
      title: 'File Management',
      icon: Upload,
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Uploading Files</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Navigate to <strong>Files</strong> from the dashboard</li>
              <li>Click "Choose File" and select a file from your computer</li>
              <li>Review the file details (name, size, type)</li>
              <li>Click "Upload File" to upload</li>
              <li>Wait for the upload to complete</li>
            </ol>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Supported File Types</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="font-medium">Documents:</p>
                <p className="text-muted-foreground">PDF, Word, Excel, PowerPoint, Text, Markdown, CSV</p>
              </div>
              <div>
                <p className="font-medium">Images:</p>
                <p className="text-muted-foreground">JPEG, PNG, GIF, WebP, SVG</p>
              </div>
              <div>
                <p className="font-medium">Audio:</p>
                <p className="text-muted-foreground">MP3, WAV, OGG, WebM</p>
              </div>
              <div>
                <p className="font-medium">Video:</p>
                <p className="text-muted-foreground">MP4, WebM, OGG</p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">File Size Limits</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Maximum file size: 100 MB</li>
              <li>Images: 10 MB</li>
              <li>Documents: 50 MB</li>
              <li>Audio: 100 MB</li>
              <li>Video: 500 MB</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Managing Files</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>View:</strong> All your files are listed on the Files page</li>
              <li><strong>Download:</strong> Click "Download" to get a file</li>
              <li><strong>Delete:</strong> Click "Delete" to remove a file (can be recovered)</li>
              <li><strong>Storage Usage:</strong> Check your storage usage at the top of the Files page</li>
            </ul>
          </div>
          <div className="bg-muted p-4 rounded-md">
            <p className="text-sm font-medium mb-1">💡 Tip:</p>
            <p className="text-sm text-muted-foreground">
              Files are automatically processed and can be linked to memories for better organization.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'memories',
      title: 'Memory Management',
      icon: Brain,
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Creating Memories</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Navigate to <strong>Memories</strong> from the dashboard</li>
              <li>Click "Create Memory" button</li>
              <li>Enter a title for your memory</li>
              <li>Add the content or text</li>
              <li>Add tags (comma-separated) for better organization</li>
              <li>Click "Create Memory" to save</li>
            </ol>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Memory Types</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>File:</strong> Extracted from uploaded files</li>
              <li><strong>Note:</strong> User-created notes</li>
              <li><strong>Chat:</strong> From chat conversations</li>
              <li><strong>Task:</strong> Task-related memories</li>
              <li><strong>Event:</strong> Event-related memories</li>
              <li><strong>Contact:</strong> Contact information</li>
              <li><strong>Bookmark:</strong> Bookmarked content</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Searching Memories</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Use the search box at the top of the Memories page</li>
              <li>Type keywords related to what you're looking for</li>
              <li>Press Enter or click "Search"</li>
              <li>Results show matching memories with highlighted matches</li>
            </ol>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Organizing with Tags</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Add multiple tags when creating memories</li>
              <li>Tags help categorize and filter memories</li>
              <li>Use consistent tag names for better organization</li>
              <li>Examples: "work", "personal", "important", "meeting"</li>
            </ul>
          </div>
          <div className="bg-muted p-4 rounded-md">
            <p className="text-sm font-medium mb-1">💡 Tip:</p>
            <p className="text-sm text-muted-foreground">
              Memories can be linked together to show relationships. This helps build a knowledge graph of your information.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'chat',
      title: 'Chat Interface',
      icon: MessageSquare,
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Starting a Chat</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Navigate to <strong>Chat</strong> from the dashboard</li>
              <li>Click "New Chat" to start a new conversation</li>
              <li>Type your message in the input box</li>
              <li>Press Enter or click "Send"</li>
              <li>AI will respond based on your memories and knowledge base</li>
            </ol>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Chat Features</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Multiple Chats:</strong> Create and switch between different chat sessions</li>
              <li><strong>Message History:</strong> All messages are saved automatically</li>
              <li><strong>Context Awareness:</strong> AI uses your memories to provide relevant answers</li>
              <li><strong>Conversation Flow:</strong> Chat maintains context throughout the conversation</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Managing Chats</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>View all your chats in the left sidebar</li>
              <li>Click on a chat to open it</li>
              <li>Chats are automatically saved</li>
              <li>Delete chats you no longer need</li>
            </ul>
          </div>
          <div className="bg-muted p-4 rounded-md">
            <p className="text-sm font-medium mb-1">💡 Tip:</p>
            <p className="text-sm text-muted-foreground">
              The more memories and files you add, the better the AI can assist you. Upload documents and create memories to enhance chat responses.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'tasks',
      title: 'Task Management',
      icon: CheckSquare,
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Creating Tasks</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Navigate to <strong>Tasks</strong> from the dashboard</li>
              <li>Click "New Task" button</li>
              <li>Enter a task title (required)</li>
              <li>Add a description (optional)</li>
              <li>Set a due date (optional)</li>
              <li>Click "Create Task" to save</li>
            </ol>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Task Status</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Pending:</strong> Task not started yet</li>
              <li><strong>In Progress:</strong> Currently working on the task</li>
              <li><strong>Completed:</strong> Task is finished</li>
              <li><strong>Cancelled:</strong> Task was cancelled</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Managing Tasks</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Complete:</strong> Click "Complete" to mark a task as done</li>
              <li><strong>Reopen:</strong> Click "Reopen" to change status back to pending</li>
              <li><strong>Delete:</strong> Click "Delete" to remove a task</li>
              <li><strong>Filter:</strong> Filter tasks by status or tags</li>
            </ul>
          </div>
          <div className="bg-muted p-4 rounded-md">
            <p className="text-sm font-medium mb-1">💡 Tip:</p>
            <p className="text-sm text-muted-foreground">
              Set due dates for important tasks to stay organized. Tasks with due dates appear first in the list.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'profile',
      title: 'Profile Management',
      icon: Settings,
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Viewing Your Profile</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Navigate to <strong>Profile</strong> from the dashboard</li>
              <li>View your account information:
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Role (User, Admin, or Super Admin)</li>
                  <li>Account status</li>
                </ul>
              </li>
            </ol>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Editing Your Profile</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Click "Edit Profile" button</li>
              <li>Update your name or email</li>
              <li>Click "Save Changes" to update</li>
              <li>Changes are saved immediately</li>
            </ol>
          </div>
          <div className="bg-muted p-4 rounded-md">
            <p className="text-sm font-medium mb-1">💡 Tip:</p>
            <p className="text-sm text-muted-foreground">
              Keep your profile information up to date. Your name appears in all your content and activities.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'dashboard',
      title: 'Dashboard Overview',
      icon: BookOpen,
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Dashboard Features</h3>
            <p className="text-muted-foreground mb-4">
              The dashboard is your central hub for accessing all MyMindOS features.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Quick Actions</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Manage Memories:</strong> Access your knowledge base</li>
              <li><strong>Upload Files:</strong> Quickly upload new files</li>
              <li><strong>Start Chat:</strong> Begin a new AI conversation</li>
              <li><strong>Manage Tasks:</strong> View and create tasks</li>
              <li><strong>View Profile:</strong> Access your account settings</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Profile Summary</h4>
            <p className="text-sm text-muted-foreground">
              The dashboard shows a summary of your profile including your role and account status.
              Click "Edit Profile" to make changes.
            </p>
          </div>
          <div className="bg-muted p-4 rounded-md">
            <p className="text-sm font-medium mb-1">💡 Tip:</p>
            <p className="text-sm text-muted-foreground">
              Use the dashboard as your starting point. All major features are just one click away.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground">User Manual</h1>
              <p className="mt-2 text-lg text-muted-foreground">
                Complete guide to using MyMindOS - Your Personal AI Operating System
              </p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>

        {/* Table of Contents */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Table of Contents</CardTitle>
            <CardDescription>Jump to any section</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(activeSection === section.id ? null : section.id);
                      document
                        .getElementById(section.id)
                        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className={`flex items-center gap-3 p-3 rounded-md border transition-colors text-left ${
                      activeSection === section.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="font-medium">{section.title}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Card key={section.id} id={section.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Icon className="h-6 w-6 text-primary" />
                    <CardTitle>{section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>{section.content}</CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Reference */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Reference</CardTitle>
            <CardDescription>Common actions and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Navigation</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <strong>Dashboard:</strong> Main hub - <Link href="/dashboard" className="text-primary hover:underline">/dashboard</Link>
                  </li>
                  <li>
                    <strong>Files:</strong> File management - <Link href="/files" className="text-primary hover:underline">/files</Link>
                  </li>
                  <li>
                    <strong>Memories:</strong> Knowledge base - <Link href="/memories" className="text-primary hover:underline">/memories</Link>
                  </li>
                  <li>
                    <strong>Chat:</strong> AI conversations - <Link href="/chat" className="text-primary hover:underline">/chat</Link>
                  </li>
                  <li>
                    <strong>Tasks:</strong> Task management - <Link href="/tasks" className="text-primary hover:underline">/tasks</Link>
                  </li>
                  <li>
                    <strong>Profile:</strong> Account settings - <Link href="/profile" className="text-primary hover:underline">/profile</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Common Tasks</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><strong>Upload File:</strong> Files → Choose File → Upload</li>
                  <li><strong>Create Memory:</strong> Memories → Create Memory → Fill form</li>
                  <li><strong>Start Chat:</strong> Chat → New Chat → Type message</li>
                  <li><strong>Create Task:</strong> Tasks → New Task → Fill details</li>
                  <li><strong>Search:</strong> Use search boxes on respective pages</li>
                  <li><strong>Sign Out:</strong> Dashboard → Sign out button</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>Additional resources and support</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Documentation</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Check the <Link href="/guide" className="text-primary hover:underline">User Manual</Link> (this page)</li>
                  <li>Review API documentation at Swagger UI</li>
                  <li>Check backend logs for error details</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Common Issues</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li><strong>Can't upload file:</strong> Check file size and type</li>
                  <li><strong>Search not working:</strong> Ensure you have memories created</li>
                  <li><strong>Chat not responding:</strong> AI provider may need configuration</li>
                  <li><strong>Login issues:</strong> Check email spelling and password</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
