'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useProject, useTasks } from '@/lib/hooks';
import { useWebSocket } from '@/lib/hooks/use-websocket';
import { EditProjectDialog } from '@/components/projects/edit-project-dialog';
import { DeleteProjectDialog } from '@/components/projects/delete-project-dialog';
import { CreateTaskDialog } from '@/components/tasks/create-task-dialog';
import { KanbanBoard } from '@/components/tasks/kanban-board';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const { data: project, isLoading: projectLoading } = useProject(projectId);
  const { data: tasks = [], isLoading: tasksLoading } = useTasks(projectId);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useWebSocket(projectId);

  if (projectLoading) {
    return (
      <div className="flex h-full flex-col p-6">
        <div className="flex items-center gap-3 pb-4">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-48" />
          <Skeleton className="ml-auto h-9 w-32" />
        </div>
        <Separator />
        <div className="flex flex-1 gap-4 overflow-hidden pt-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-full min-w-[280px] flex-shrink-0 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="flex flex-col items-center rounded-lg border border-dashed p-12">
          <h2 className="text-2xl font-bold">Project not found</h2>
          <p className="mt-2 text-center text-muted-foreground">
            The project you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => router.push('/projects')} className="mt-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-full flex-col p-6">
        
        <div className="flex items-center gap-3 pb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 px-3" 
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex min-w-0 items-center gap-2">
            {project.color && (
              <div
                className="h-4 w-4 flex-shrink-0 rounded-full"
                style={{ backgroundColor: project.color }}
              />
            )}
            <h1 className="truncate text-2xl font-bold tracking-tight">{project.name}</h1>
          </div>

          <Badge variant="secondary" className="flex-shrink-0">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </Badge>

          <div className="ml-auto flex items-center gap-2">
            <CreateTaskDialog projectId={projectId} />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowEditDialog(true)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <Separator />

        <div className="flex-1 min-h-0 pt-6">
          <KanbanBoard 
            tasks={tasks} 
            projectId={projectId} 
            isLoading={tasksLoading} 
          />
        </div>
      </div>

      <EditProjectDialog
        project={project}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />
      <DeleteProjectDialog
        project={project}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  );
}