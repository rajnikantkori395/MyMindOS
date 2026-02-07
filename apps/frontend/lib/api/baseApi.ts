/**
 * Base API Configuration with RTK Query
 * Centralized API client setup with authentication handling
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '@/config/api.config';
import type { RootState } from '@/lib/store';
import { setCredentials, logout } from '@/lib/store/slices/authSlice';

// Log API configuration on module load (for debugging)
if (typeof window !== 'undefined') {
  console.log('API Configuration:', {
    baseURL: API_CONFIG.baseURL,
    envVar: process.env.NEXT_PUBLIC_API_URL,
    currentOrigin: window.location.origin,
  });
}

const baseQuery = fetchBaseQuery({
  baseUrl: API_CONFIG.baseURL,
  prepareHeaders: (headers, { getState }) => {
    // Get token from Redux state
    const state = getState() as RootState;
    const token = state.auth?.accessToken;

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    // Don't set Content-Type here - let fetchBaseQuery handle it
    // It will automatically set application/json for JSON, and let browser set multipart/form-data for FormData
    return headers;
  },
  credentials: 'include',
  // RTK Query will automatically handle FormData and set appropriate Content-Type
});

// Base query with re-authentication logic
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  // Handle network/CORS errors
  if (result?.error) {
    const error = result.error as any;
    const fullUrl = API_CONFIG.baseURL + (args.url || '');
    
    // Network error (CORS, connection failed, etc.)
    if (error.status === 'FETCH_ERROR' || error.status === 'PARSING_ERROR') {
      console.error('🚨 API Request Failed:', {
        url: fullUrl,
        method: args.method || 'GET',
        error: error.error || error.message || 'Network error',
        errorStatus: error.status,
        errorData: error.data,
        possibleCauses: [
          'Backend server is not running',
          'CORS configuration issue - frontend origin not allowed',
          'Incorrect API URL',
          'Network connectivity problem',
        ],
        baseURL: API_CONFIG.baseURL,
        frontendOrigin: typeof window !== 'undefined' ? window.location.origin : 'N/A',
        backendURL: API_CONFIG.baseURL,
      });
    }
  }

  // If we get a 401, try to refresh the token
  if (result?.error && 'status' in result.error && result.error.status === 401) {
    const state = api.getState() as RootState;
    const refreshToken = state.auth?.refreshToken;

    if (refreshToken) {
      // Try to refresh the token
      const refreshResult = await baseQuery(
        {
          url: API_CONFIG.endpoints.auth.refresh,
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions,
      );

      if (refreshResult.data) {
        // Store the new token
        const { accessToken, refreshToken: newRefreshToken } = refreshResult.data as {
          accessToken: string;
          refreshToken: string;
        };

        // Update the auth state (preserve existing user)
        const user = state.auth?.user;
        if (user) {
          api.dispatch(
            setCredentials({
              accessToken,
              refreshToken: newRefreshToken,
              user,
            }),
          );

          // Retry the original query with the new token
          result = await baseQuery(args, api, extraOptions);
        } else {
          // No user in state, logout
          api.dispatch(logout());
        }
      } else {
        // Refresh failed, logout the user
        api.dispatch(logout());
      }
    } else {
      // No refresh token, logout
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Auth', 'File', 'Memory', 'Chat', 'Task', 'Analytics'],
  endpoints: () => ({}),
});

