'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from '@/lib/api/taskApi';
import { Button, Card, CardHeader, CardTitle, CardContent, Input } from '@/components/common';
import Link from 'next/link';

export default function TasksPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' });

  const { data: tasksData } = useGetTasksQuery({ page: 1, limit: 100 });
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  if (!isAuthenticated) {
    router.push('/signin');
    return null;
  }

  const handleCreate = async () => {
    if (!newTask.title) return;
    await createTask({
      ...newTask,
      dueDate: newTask.dueDate || undefined,
    }).unwrap();
    setNewTask({ title: '', description: '', dueDate: '' });
    setShowForm(false);
  };

  const handleToggleStatus = async (task: any) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    await updateTask({ id: task.id, data: { status: newStatus } }).unwrap();
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Tasks</h1>
          <div className="flex gap-2">
            <Link href="/dashboard">
              <Button variant="outline">Back</Button>
            </Link>
            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : 'New Task'}
            </Button>
          </div>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Input
                  label="Title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
                <Input
                  label="Description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
                <Input
                  label="Due Date"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
                <Button onClick={handleCreate}>Create Task</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-2">
          {tasksData?.data.map((task) => (
            <Card key={task.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
                    )}
                    <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
                      <span className="capitalize">{task.status}</span>
                      {task.dueDate && (
                        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(task)}
                    >
                      {task.status === 'completed' ? 'Reopen' : 'Complete'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
