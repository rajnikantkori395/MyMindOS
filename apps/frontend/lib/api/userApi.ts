/**
 * User API Slice
 * RTK Query endpoints for user operations
 */

import { baseApi } from './baseApi';
import type { User } from '@/lib/store/slices/authSlice';

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<User, void>({
      query: () => '/users/me',
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation<User, UpdateProfileRequest>({
      query: (body) => ({
        url: '/users/me',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['User', 'Auth'],
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = userApi;

