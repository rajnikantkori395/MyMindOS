/**
 * Sign Up Page
 * User registration page with form validation
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import {
  registerSchema,
  type RegisterFormData,
} from '@/lib/validations/auth.schema';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button, Input, Form, Card, CardHeader, CardTitle, CardDescription, CardContent, Alert, AlertDescription, ThemeToggle } from '@/components/common';

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null);
  const { register: registerUser, isRegistering } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    const result = await registerUser(data.email, data.password, data.name);
    if (!result.success) {
      setError(result.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            MyMindOS
          </h1>
          <p className="mt-2 text-muted-foreground">
            Personal AI Operating System
          </p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Create account</CardTitle>
            <CardDescription>
              Enter your information to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form onSubmit={handleSubmit(onSubmit)}>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <Input
                  label="Full name"
                  type="text"
                  autoComplete="name"
                  placeholder="John Doe"
                  error={errors.name?.message}
                  {...register('name')}
                />

                <Input
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  error={errors.email?.message}
                  {...register('email')}
                />

                <Input
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  error={errors.password?.message}
                  helperText="Must be at least 8 characters with uppercase, lowercase, and number"
                  {...register('password')}
                />

                <Input
                  label="Confirm password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Confirm your password"
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isRegistering}
                >
                  Create account
                </Button>
              </div>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-2 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/signin"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
          <p className="text-xs text-muted-foreground">
            By creating an account, you agree to our{' '}
            <Link
              href="/terms"
              className="underline hover:text-foreground"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="underline hover:text-foreground"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

