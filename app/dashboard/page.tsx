'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useProjects, useTasks } from '@/lib/hooks';
import { useAuthStore } from '@/lib/stores/auth-store';
import { FolderKanban, CheckSquare, Clock, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: tasks, isLoading: tasksLoading } = useTasks();

  const stats = [
    {
      title: 'Total Projects',
      value: projects?.length || 0,
      icon: FolderKanban,
      loading: projectsLoading,
    },
    {
      title: 'Total Tasks',
      value: tasks?.length || 0,
      icon: CheckSquare,
      loading: tasksLoading,
    },
    {
      title: 'In Progress',
      value: tasks?.filter((t) => t.status === 'IN_PROGRESS').length || 0,
      icon: Clock,
      loading: tasksLoading,
    },
    {
      title: 'Completed',
      value: tasks?.filter((t) => t.isCompleted).length || 0,
      icon: TrendingUp,
      loading: tasksLoading,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your projects today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {stat.loading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-2xl font-bold">{stat.value}</div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {projectsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : projects && projects.length > 0 ? (
              <div className="space-y-2">
                {projects.slice(0, 5).map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      {project.color && (
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                      )}
                      <span className="text-sm">{project.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {project._count?.tasks || 0} tasks
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No projects yet. Create your first project!
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {tasksLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : tasks && tasks.length > 0 ? (
              <div className="space-y-2">
                {tasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm">{task.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No tasks yet. Create your first task!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}