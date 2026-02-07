'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  useGetChatsQuery,
  useCreateChatMutation,
  useGetChatByIdQuery,
  useSendMessageMutation,
  useDeleteChatMutation,
} from '@/lib/api/chatApi';
import { Button, Card, CardHeader, CardTitle, CardContent, Input } from '@/components/common';
import Link from 'next/link';

export default function ChatPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const { data: chatsData } = useGetChatsQuery({ page: 1, limit: 50 });
  const { data: chat } = useGetChatByIdQuery(selectedChatId!, { skip: !selectedChatId });
  const [createChat] = useCreateChatMutation();
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [deleteChat] = useDeleteChatMutation();

  if (!isAuthenticated) {
    router.push('/signin');
    return null;
  }

  const handleNewChat = async () => {
    const result = await createChat({ title: 'New Chat' }).unwrap();
    setSelectedChatId(result.id);
  };

  const handleSend = async () => {
    if (!message.trim() || !selectedChatId) return;
    await sendMessage({ id: selectedChatId, content: message }).unwrap();
    setMessage('');
  };

  return (
    <div className="flex h-screen bg-background">
      <div className="w-64 border-r border-border p-4">
        <div className="mb-4">
          <Button onClick={handleNewChat} fullWidth>
            New Chat
          </Button>
        </div>
        <div className="space-y-2">
          {chatsData?.data.map((c) => (
            <div
              key={c.id}
              className={`cursor-pointer rounded-md p-2 ${
                selectedChatId === c.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
              onClick={() => setSelectedChatId(c.id)}
            >
              {c.title}
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        {selectedChatId && chat ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chat.messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      m.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border p-4">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                />
                <Button onClick={handleSend} isLoading={isSending}>
                  Send
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-muted-foreground">Select a chat or create a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
