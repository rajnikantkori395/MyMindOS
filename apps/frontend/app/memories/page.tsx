/**
 * Memories Page
 * Memory management and search interface
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  useGetMemoriesQuery,
  useCreateMemoryMutation,
  useDeleteMemoryMutation,
  useSearchMemoriesMutation,
  type MemoryResponse,
} from '@/lib/api/memoryApi';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Alert,
  AlertDescription,
} from '@/components/common';
import Link from 'next/link';

export default function MemoriesPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newMemory, setNewMemory] = useState({
    title: '',
    content: '',
    type: 'note' as const,
    tags: '',
  });
  const [error, setError] = useState<string | null>(null);

  const { data: memoriesData, isLoading: isLoadingMemories } = useGetMemoriesQuery({
    page,
    limit: 20,
    search: searchQuery || undefined,
  });

  const [createMemory, { isLoading: isCreating }] = useCreateMemoryMutation();
  const [deleteMemory, { isLoading: isDeleting }] = useDeleteMemoryMutation();
  const [searchMemories, { data: searchResults, isLoading: isSearching }] =
    useSearchMemoriesMutation();

  if (!isAuthenticated) {
    router.push('/signin');
    return null;
  }

  const handleCreate = async () => {
    if (!newMemory.title || !newMemory.content) {
      setError('Title and content are required');
      return;
    }

    try {
      await createMemory({
        title: newMemory.title,
        content: newMemory.content,
        type: newMemory.type,
        tags: newMemory.tags
          ? newMemory.tags.split(',').map((t) => t.trim())
          : [],
      }).unwrap();
      setNewMemory({ title: '', content: '', type: 'note', tags: '' });
      setShowCreateForm(false);
      setError(null);
    } catch (error: any) {
      setError(error?.data?.message || 'Failed to create memory');
    }
  };

  const handleDelete = async (memoryId: string) => {
    if (!confirm('Are you sure you want to delete this memory?')) return;

    try {
      await deleteMemory(memoryId).unwrap();
    } catch (error: any) {
      alert(error?.data?.message || 'Failed to delete memory');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      await searchMemories({
        query: searchQuery,
        limit: 20,
      }).unwrap();
    } catch (error: any) {
      setError(error?.data?.message || 'Search failed');
    }
  };

  const displayMemories = searchResults || memoriesData?.data || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Memories</h1>
            <p className="mt-2 text-muted-foreground">
              Store and search your knowledge
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
            <Button onClick={() => setShowCreateForm(!showCreateForm)}>
              {showCreateForm ? 'Cancel' : 'Create Memory'}
            </Button>
          </div>
        </div>

        {/* Search Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Memories</CardTitle>
            <CardDescription>
              Search through your memories by keyword
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Search memories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} isLoading={isSearching}>
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Create Memory Form */}
        {showCreateForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Create New Memory</CardTitle>
              <CardDescription>
                Add a new memory to your knowledge base
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Input
                  label="Title"
                  placeholder="Memory title"
                  value={newMemory.title}
                  onChange={(e) =>
                    setNewMemory({ ...newMemory, title: e.target.value })
                  }
                />
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Content
                  </label>
                  <textarea
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    rows={6}
                    placeholder="Memory content..."
                    value={newMemory.content}
                    onChange={(e) =>
                      setNewMemory({ ...newMemory, content: e.target.value })
                    }
                  />
                </div>
                <Input
                  label="Tags (comma-separated)"
                  placeholder="work, important, meeting"
                  value={newMemory.tags}
                  onChange={(e) =>
                    setNewMemory({ ...newMemory, tags: e.target.value })
                  }
                />
                <Button
                  onClick={handleCreate}
                  isLoading={isCreating}
                  disabled={!newMemory.title || !newMemory.content}
                >
                  Create Memory
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Memories List */}
        <Card>
          <CardHeader>
            <CardTitle>
              {searchResults ? 'Search Results' : 'Your Memories'}
            </CardTitle>
            <CardDescription>
              {memoriesData?.total || 0} memor{memoriesData?.total !== 1 ? 'ies' : 'y'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingMemories && !searchResults ? (
              <div className="py-8 text-center text-muted-foreground">
                Loading memories...
              </div>
            ) : displayMemories.length > 0 ? (
              <div className="space-y-4">
                <div className="space-y-4">
                  {displayMemories.map((memory: MemoryResponse) => (
                    <div
                      key={memory.id}
                      className="rounded-md border border-border bg-card p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">
                            {memory.title}
                          </h3>
                          <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                            {memory.content}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {memory.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary"
                              >
                                {tag}
                              </span>
                            ))}
                            <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                              {memory.type}
                            </span>
                          </div>
                          <p className="mt-2 text-xs text-muted-foreground">
                            {new Date(memory.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(memory.id)}
                          disabled={isDeleting}
                          className="ml-4"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {!searchResults &&
                  memoriesData &&
                  memoriesData.totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Page {page} of {memoriesData.totalPages}
                      </span>
                      <Button
                        variant="outline"
                        onClick={() =>
                          setPage((p) =>
                            Math.min(memoriesData.totalPages, p + 1),
                          )
                        }
                        disabled={page === memoriesData.totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  )}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                {searchQuery
                  ? 'No memories found matching your search.'
                  : 'No memories yet. Create your first memory above!'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
