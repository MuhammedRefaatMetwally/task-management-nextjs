'use client';

import { useState } from 'react';
import { MoreVertical, Pencil, Trash2, Calendar, User, Flag } from 'lucide-react';
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

const priorityConfig = {
  LOW: { color: 'bg-gray-500', label: 'Low', icon: Flag },
  MEDIUM: { color: 'bg-blue-500', label: 'Medium', icon: Flag },
  HIGH: { color: 'bg-orange-500', label: 'High', icon: Flag },
  URGENT: { color: 'bg-red-500', label: 'Urgent', icon: Flag },
};

export function TaskCard({ task }: TaskCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const priorityInfo = priorityConfig[task.priority];
  const PriorityIcon = priorityInfo.icon;

  return (
    <>
      <Card className="group cursor-grab transition-all hover:shadow-lg active:cursor-grabbing">
        <CardHeader className="p-4 pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-2">
              <div className="flex items-start gap-2">
                <div className={`mt-1 rounded-full p-1 ${priorityInfo.color}`}>
                  <PriorityIcon className="h-3 w-3 text-white" />
                </div>
                <h4 className="flex-1 font-semibold leading-tight">{task.title}</h4>
              </div>
              
              {task.description && (
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {task.description}
                </p>
              )}
            </div>

            {/* Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <MoreVertical className="h-4 w-4" />
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

        <CardContent className="p-4 pt-0">
          <div className="flex flex-wrap items-center gap-3">
            {/* Due Date */}
            {task.dueDate && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}</span>
              </div>
            )}

            {/* Assignee */}
            {task.assignedTo && (
              <div className="flex items-center gap-1.5">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={task.assignedTo.avatar} />
                  <AvatarFallback className="text-[10px]">
                    {getInitials(task.assignedTo.firstName || '', task.assignedTo.lastName || '')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">
                  {task.assignedTo.firstName}
                </span>
              </div>
            )}

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.tags.slice(0, 2).map((tag, i) => (
                  <Badge key={i} variant="secondary" className="h-5 text-xs">
                    {tag}
                  </Badge>
                ))}
                {task.tags.length > 2 && (
                  <Badge variant="secondary" className="h-5 text-xs">
                    +{task.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
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