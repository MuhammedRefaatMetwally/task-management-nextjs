'use client';

import { useState, useMemo } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { Task, TaskStatus } from '@/types';
import { KanbanColumn } from './kanban-column';
import { TaskCard } from './task-card';
import { useMoveTask } from '@/lib/hooks';
import { Skeleton } from '@/components/ui/skeleton';

interface KanbanBoardProps {
  tasks: Task[];
  projectId: string;
  isLoading?: boolean;
}

const COLUMNS = [
  { id: 'TODO' as TaskStatus, title: 'To Do' },
  { id: 'IN_PROGRESS' as TaskStatus, title: 'In Progress' },
  { id: 'IN_REVIEW' as TaskStatus, title: 'In Review' },
  { id: 'DONE' as TaskStatus, title: 'Done' },
];

export function KanbanBoard({ tasks, projectId, isLoading }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const { mutate: moveTask } = useMoveTask();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      TODO: [],
      IN_PROGRESS: [],
      IN_REVIEW: [],
      DONE: [],
    };

    tasks.forEach((task) => {
      if (grouped[task.status]) {
        grouped[task.status].push(task);
      }
    });

    Object.keys(grouped).forEach((status) => {
      grouped[status as TaskStatus].sort((a, b) => a.order - b.order);
    });

    return grouped;
  }, [tasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) {
      setActiveTask(null);
      return;
    }

    const overId = over.id as string;
    const overTask = tasks.find((t) => t.id === overId);
    const overStatus = overTask?.status || (overId as TaskStatus);

    let newStatus = activeTask.status;
    let newOrder = activeTask.order;

    if (COLUMNS.some((col) => col.id === overId)) {
      newStatus = overId as TaskStatus;
      const tasksInColumn = tasksByStatus[newStatus];
      newOrder = tasksInColumn.length > 0 
        ? Math.max(...tasksInColumn.map((t) => t.order)) + 1 
        : 0;
    } else if (overTask) {
      newStatus = overTask.status;
      newOrder = overTask.order;
    }

    if (newStatus !== activeTask.status || newOrder !== activeTask.order) {
      moveTask({
        id: activeTask.id,
        data: { status: newStatus, order: newOrder },
      });
    }

    setActiveTask(null);
  };

  if (isLoading) {
    return (
      <div className="grid h-full gap-4 md:grid-cols-2 lg:grid-cols-4">
        {COLUMNS.map((column) => (
          <Skeleton key={column.id} className="h-full min-h-[500px]" />
        ))}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid h-full gap-4 md:grid-cols-2 lg:grid-cols-4">
        {COLUMNS.map((column) => (
          <KanbanColumn
            key={column.id}
            status={column.id}
            title={column.title}
            tasks={tasksByStatus[column.id]}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
}