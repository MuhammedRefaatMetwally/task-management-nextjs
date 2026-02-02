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
import { formatDate } from '@/lib/utils';
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

  // Connect to WebSocket for real-time updates
  useWebSocket(projectId);

  if (projectLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-12">
        <h2 className="text-2xl font-bold">Project not found</h2>
        <p className="mt-2 text-muted-foreground">
          The project you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button onClick={() => router.push('/projects')} className="mt-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-full flex-col space-y-6">
        {/* Back Button */}
        <div>
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Project Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              {project.color && (
                <div 
                  className="h-3 w-3 rounded-full" 
                  style={{ backgroundColor: project.color }} 
                />
              )}
              <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
            </div>
            
            {project.description && (
              <p className="text-base text-muted-foreground">{project.description}</p>
            )}
            
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span>Created {formatDate(project.createdAt)}</span>
              <span>•</span>
              <Badge variant="secondary" className="font-normal">
                {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <CreateTaskDialog projectId={projectId} />
            <Button variant="outline" size="sm" onClick={() => setShowEditDialog(true)}>
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

        {/* Kanban Board */}
        <div className="flex-1 overflow-hidden">
          <KanbanBoard tasks={tasks} projectId={projectId} isLoading={tasksLoading} />
        </div>
      </div>

      {/* Dialogs */}
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