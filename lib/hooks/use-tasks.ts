import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tasksService } from "@/lib/api";
import type {
  CreateTaskDto,
  UpdateTaskDto,
  MoveTaskDto,
  ReorderTasksDto,
  Task,
} from "@/types";
import { toast } from "sonner";

export const useTasks = (projectId?: string) => {
  return useQuery({
    queryKey: projectId ? ["tasks", "project", projectId] : ["tasks"],
    queryFn: () => tasksService.getAll(projectId),
    refetchOnMount: "always",
  });
};

export const useTask = (id: string) => {
  return useQuery({
    queryKey: ["tasks", id],
    queryFn: () => tasksService.getById(id),
    enabled: !!id,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskDto) => tasksService.create(data),
    onSuccess: (newTask) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({
        queryKey: ["tasks", "project", newTask.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["projects", newTask.projectId],
      });
      toast.success("Task created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create task");
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskDto }) =>
      tasksService.update(id, data),
    onSuccess: (updatedTask, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.id] });
      queryClient.invalidateQueries({
        queryKey: ["tasks", "project", updatedTask.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["projects", updatedTask.projectId],
      });
      toast.success("Task updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update task");
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tasksService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Task deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete task");
    },
  });
};

// IMPROVED: Smoother optimistic move task hook
export const useMoveTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MoveTaskDto }) =>
      tasksService.moveTask(id, data),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousTasks = queryClient.getQueryData(["tasks"]);
      const projectQueries = queryClient.getQueriesData({
        queryKey: ["tasks", "project"],
      });

      queryClient.setQueriesData(
        { queryKey: ["tasks"] },
        (old: Task[] | undefined) => {
          if (!old) return old;
          return old.map((task) =>
            task.id === id
              ? { ...task, status: data.status, order: data.order }
              : task,
          );
        },
      );

      return { previousTasks, projectQueries };
    },

    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }
      if (context?.projectQueries) {
        context.projectQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("Failed to move task");
    },

    onSuccess: (data) => {
      queryClient.setQueriesData(
        { queryKey: ["tasks"] },
        (old: Task[] | undefined) => {
          if (!old) return old;
          return old.map((task) => (task.id === data.id ? data : task));
        },
      );
    },
  });
};

export const useReorderTasks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReorderTasksDto) => tasksService.reorderTasks(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => {
      toast.error("Failed to reorder tasks");
    },
  });
};
