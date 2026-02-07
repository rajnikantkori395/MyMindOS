import { baseApi } from './baseApi';

export interface AnalyticsStats {
  totalFiles: number;
  totalMemories: number;
  totalTasks: number;
  storageUsed: number;
  storageLimit: number;
}

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStats: builder.query<AnalyticsStats, void>({
      query: () => '/analytics/stats',
      providesTags: ['Analytics'],
    }),
  }),
});

export const { useGetStatsQuery } = analyticsApi;
