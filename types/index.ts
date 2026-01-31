export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_REVIEW = 'IN_REVIEW',
  DONE = 'DONE',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color?: string;
  ownerId: string;
  owner?: Partial<User>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  tasks?: Task[];
  _count?: {
    tasks: number;
  };
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  assignedToId?: string;
  assignedTo?: Partial<User>;
  createdById: string;
  createdBy?: Partial<User>;
  projectId: string;
  project?: Partial<Project>;
  tags?: string[];
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateProjectDto extends Partial<CreateProjectDto> {}

export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  assignedToId?: string;
  projectId: string;
  tags?: string[];
}

export interface UpdateTaskDto extends Partial<CreateTaskDto> {
  isCompleted?: boolean;
}

export enum NotificationType {
  TASK_CREATED = 'TASK_CREATED',
  TASK_UPDATED = 'TASK_UPDATED',
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  TASK_COMPLETED = 'TASK_COMPLETED',
  PROJECT_CREATED = 'PROJECT_CREATED',
  PROJECT_UPDATED = 'PROJECT_UPDATED',
}

export interface Notification {
  type: NotificationType;
  title: string;
  message: string;
  userId: string;
  data?: any;
  createdAt?: string;
}