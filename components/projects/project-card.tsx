'use client';

import { useState } from 'react';
import { MoreVertical, Pencil, Trash2, FolderKanban } from 'lucide-react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Project } from '@/types';
import { formatDate } from '@/lib/utils';
import { DeleteProjectDialog } from './delete-project-dialog';
import { EditProjectDialog } from './edit-project-dialog';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <Card className="group relative overflow-hidden transition-shadow hover:shadow-md">
        {/* Color Bar */}
        {project.color && (
          <div
            className="absolute left-0 top-0 h-full w-1"
            style={{ backgroundColor: project.color }}
          />
        )}

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{
                  backgroundColor: project.color || '#3B82F6',
                  opacity: 0.1,
                }}
              >
                <FolderKanban
                  className="h-5 w-5"
                  style={{ color: project.color || '#3B82F6' }}
                />
              </div>
              <div>
                <Link href={`/projects/${project.id}`}>
                  <CardTitle className="line-clamp-1 hover:underline">
                    {project.name}
                  </CardTitle>
                </Link>
                <CardDescription className="mt-1">
                  Created {formatDate(project.createdAt)}
                </CardDescription>
              </div>
            </div>

            {/* Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 transition-opacity group-hover:opacity-100"
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

        <CardContent>
          {project.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {project.description}
            </p>
          )}
        </CardContent>

        <CardFooter>
          <div className="flex w-full items-center justify-between">
            <Badge variant="secondary">
              {project._count?.tasks || 0} {project._count?.tasks === 1 ? 'task' : 'tasks'}
            </Badge>
            <Link href={`/projects/${project.id}`}>
              <Button variant="ghost" size="sm">
                View Details
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>

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