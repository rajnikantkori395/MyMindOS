import { baseApi } from './baseApi';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface ChatResponse {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ChatListResponse {
  data: ChatResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createChat: builder.mutation<ChatResponse, { title?: string }>({
      query: (body) => ({
        url: '/chat',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Chat'],
    }),
    getChats: builder.query<ChatListResponse, { page?: number; limit?: number }>({
      query: (params) => ({ url: '/chat', params }),
      providesTags: ['Chat'],
    }),
    getChatById: builder.query<ChatResponse, string>({
      query: (id) => `/chat/${id}`,
      providesTags: (result, error, id) => [{ type: 'Chat', id }],
    }),
    sendMessage: builder.mutation<ChatResponse, { id: string; content: string }>({
      query: ({ id, content }) => ({
        url: `/chat/${id}/message`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Chat', id }, 'Chat'],
    }),
    deleteChat: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/chat/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Chat'],
    }),
  }),
});

export const {
  useCreateChatMutation,
  useGetChatsQuery,
  useGetChatByIdQuery,
  useSendMessageMutation,
  useDeleteChatMutation,
} = chatApi;
