'use client';

import { useState } from 'react';
import { MoreVertical, Pencil, Trash2, Calendar, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Task } from '@/types';
import { getInitials } from '@/lib/utils';
import { DeleteTaskDialog } from './delete-task-dialog';
import { EditTaskDialog } from './edit-task-dialog';

interface TaskCardProps {
  task: Task;
}

const priorityColors = {
  LOW: 'bg-gray-500',
  MEDIUM: 'bg-blue-500',
  HIGH: 'bg-orange-500',
  URGENT: 'bg-red-500',
};

export function TaskCard({ task }: TaskCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <Card className="group cursor-grab active:cursor-grabbing">
        <CardHeader className="p-3 pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className="font-medium leading-tight">{task.title}</h4>
              {task.description && (
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {task.description}
                </p>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="p-3 pt-0">
          <div className="flex flex-wrap items-center gap-2">
            {/* Priority Badge */}
            <Badge
              variant="secondary"
              className={`h-2 w-2 rounded-full p-0 ${priorityColors[task.priority]}`}
            />

            {task.dueDate && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}</span>
              </div>
            )}

            {task.assignedTo && (
              <Avatar className="h-5 w-5">
                <AvatarImage src={task.assignedTo.avatar} />
                <AvatarFallback className="text-[10px]">
                  {getInitials(task.assignedTo.firstName || '', task.assignedTo.lastName || '')}
                </AvatarFallback>
              </Avatar>
            )}

            {task.tags && task.tags.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {task.tags[0]}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <EditTaskDialog
        task={task}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />
      <DeleteTaskDialog
        task={task}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  );
}