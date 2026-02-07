/**
 * useAuth Hook
 * Custom hook for authentication operations
 */

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetMeQuery,
} from '@/lib/api/authApi';
import { setCredentials, logout as logoutAction } from '@/lib/store/slices/authSlice';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const auth = useAppSelector((state) => state.auth);
  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();
  const [registerMutation, { isLoading: isRegistering }] = useRegisterMutation();
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();
  const { data: userData, isLoading: isLoadingUser } = useGetMeQuery(undefined, {
    skip: !auth.isAuthenticated,
  });

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const result = await loginMutation({ email, password }).unwrap();
        dispatch(
          setCredentials({
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            user: result.user,
          }),
        );
        router.push('/dashboard');
        return { success: true };
      } catch (error: unknown) {
        let errorMessage = 'Login failed';
        
        if (error && typeof error === 'object') {
          if ('data' in error) {
            const data = error.data as { message?: string };
            errorMessage = data?.message || 'Login failed';
          } else if ('message' in error) {
            errorMessage = String(error.message);
          }
        }

        // Check for common typos in email
        if (errorMessage.includes('Invalid credentials') && email.includes('mymiindos')) {
          errorMessage = 'Invalid credentials. Did you mean superadmin@mymindos.com? (Note: single "i" in mymindos)';
        }

        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    [loginMutation, dispatch, router],
  );

  const register = useCallback(
    async (email: string, password: string, name: string) => {
      try {
        const result = await registerMutation({ email, password, name }).unwrap();
        dispatch(
          setCredentials({
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            user: result.user,
          }),
        );
        router.push('/dashboard');
        return { success: true };
      } catch (error: unknown) {
        const errorMessage =
          error && typeof error === 'object' && 'data' in error
            ? (error.data as { message?: string })?.message
            : error && typeof error === 'object' && 'message' in error
              ? String(error.message)
              : 'Registration failed';
        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    [registerMutation, dispatch, router],
  );

  const logout = useCallback(async () => {
    try {
      if (auth.refreshToken) {
        await logoutMutation({ refreshToken: auth.refreshToken }).unwrap();
      }
    } catch (error) {
      // Even if logout fails on server, clear local state
      console.error('Logout error:', error);
    } finally {
      dispatch(logoutAction());
      router.push('/signin');
    }
  }, [auth.refreshToken, logoutMutation, dispatch, router]);

  return {
    user: auth.user || userData,
    isAuthenticated: auth.isAuthenticated,
    isLoading: isLoggingIn || isRegistering || isLoggingOut || isLoadingUser,
    login,
    register,
    logout,
    isLoggingIn,
    isRegistering,
    isLoggingOut,
  };
};

