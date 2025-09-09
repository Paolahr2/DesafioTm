// ============================================================================
// INTERFACES PARA TASKMANAGER - INTEGRADAS CON BACKEND
// ============================================================================

import { TaskStatus } from '../enums/task-status.enum';

export interface Board {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  members: string[];
  color?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateBoardDto {
  title: string;
  description: string;
  color?: string;
  isPublic?: boolean;
}

export interface UpdateBoardDto {
  title?: string;
  description?: string;
  isPublic?: boolean;
}

export interface TaskLabel {
  id: string;
  name: string;
  color: string;
}

export interface TaskDto {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  boardId: string;
  assignedUserId?: string;
  labels?: TaskLabel[];
  priority?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  status: TaskStatus;
  boardId: string;
  assignedUserId?: string;
  labels?: TaskLabel[];
  priority?: string;
  dueDate?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  assignedUserId?: string;
  labels?: TaskLabel[];
  priority?: string;
  dueDate?: string;
}

export interface ChangeTaskStatusDto {
  newStatus: TaskStatus;
}

export interface BoardFilters {
  search?: string;
  isPublic?: boolean;
  ownerId?: string;
}

export interface BoardWithTasks extends Board {
  tasks: TaskDto[];
}

export interface TaskFilters {
  boardId?: string;
  status?: TaskStatus;
  assignedUserId?: string;
  search?: string;
}
