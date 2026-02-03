'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { Task, TaskStatus } from '@/types';
import { SortableTaskCard } from './sortable-task-card';

interface KanbanColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  onAddTask?: () => void;
}

const columnColors = {
  TODO: 'bg-gray-100 dark:bg-gray-800',
  IN_PROGRESS: 'bg-blue-100 dark:bg-blue-900',
  IN_REVIEW: 'bg-yellow-100 dark:bg-yellow-900',
  DONE: 'bg-green-100 dark:bg-green-900',
};

export function KanbanColumn({ status, title, tasks, onAddTask }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <Card className="flex h-full min-w-[280px] max-w-[400px] flex-1 flex-col">
      <CardHeader className="flex-shrink-0 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-semibold">{title}</CardTitle>
            <Badge variant="secondary" className="h-5 px-1.5 text-xs">
              {tasks.length}
            </Badge>
          </div>
          {onAddTask && (
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onAddTask}>
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 min-h-0 p-3 pt-0">
        <div
          ref={setNodeRef}
          className={`h-full overflow-y-auto rounded-md p-2 transition-colors ${
            isOver ? columnColors[status] : ''
          }`}
        >
          <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {tasks.map((task) => (
                <SortableTaskCard key={task.id} task={task} />
              ))}
            </div>
          </SortableContext>

          {tasks.length === 0 && (
            <div className="flex h-32 items-center justify-center">
              <p className="text-sm text-muted-foreground">No tasks</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}