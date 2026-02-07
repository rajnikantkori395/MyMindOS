/**
 * Profile Page
 * User profile management
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from '@/lib/api/userApi';
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

export default function ProfilePage() {
  const { isAuthenticated, user: authUser } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { data: profile, isLoading } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  if (!isAuthenticated) {
    router.push('/signin');
    return null;
  }

  const user = profile || authUser;

  const handleEdit = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      });
    }
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      setError('Name and email are required');
      return;
    }

    try {
      await updateProfile({
        name: formData.name,
        email: formData.email,
      }).unwrap();
      setIsEditing(false);
      setSuccess('Profile updated successfully');
      setError(null);
    } catch (error: any) {
      setError(error?.data?.message || 'Failed to update profile');
      setSuccess(null);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  if (isLoading) {
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
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profile</h1>
            <p className="mt-2 text-muted-foreground">
              Manage your account settings
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Your personal information and account details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <Input
                  label="Name"
                  value={isEditing ? formData.name : user?.name || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={!isEditing}
                />

                <Input
                  label="Email"
                  type="email"
                  value={isEditing ? formData.email : user?.email || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={!isEditing}
                />

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Role
                  </label>
                  <div className="rounded-md border border-input bg-muted px-3 py-2 text-sm">
                    {user?.role || 'user'}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Status
                  </label>
                  <div className="rounded-md border border-input bg-muted px-3 py-2 text-sm capitalize">
                    {user?.status || 'active'}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                {isEditing ? (
                  <>
                    <Button
                      onClick={handleSave}
                      isLoading={isUpdating}
                      disabled={!formData.name || !formData.email}
                    >
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleEdit}>Edit Profile</Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
