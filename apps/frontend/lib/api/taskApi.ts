import { baseApi } from './baseApi';

export interface TaskResponse {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  dueDate?: string;
  tags: string[];
  metadata: Record<string, any>;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskListResponse {
  data: TaskResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const taskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTask: builder.mutation<TaskResponse, Partial<TaskResponse>>({
      query: (body) => ({
        url: '/tasks',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Task'],
    }),
    getTasks: builder.query<
      TaskListResponse,
      { page?: number; limit?: number; status?: string; tags?: string }
    >({
      query: (params) => ({ url: '/tasks', params }),
      providesTags: ['Task'],
    }),
    getTaskById: builder.query<TaskResponse, string>({
      query: (id) => `/tasks/${id}`,
      providesTags: (result, error, id) => [{ type: 'Task', id }],
    }),
    updateTask: builder.mutation<TaskResponse, { id: string; data: Partial<TaskResponse> }>({
      query: ({ id, data }) => ({
        url: `/tasks/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Task', id }, 'Task'],
    }),
    deleteTask: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Task'],
    }),
  }),
});

export const {
  useCreateTaskMutation,
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApi;
