// ============================================================================
// ENUMS PARA ESTADOS DE TAREAS - COINCIDE CON BACKEND
// ============================================================================

export enum TaskStatus {
  Pending = 0,
  InProgress = 1,
  Completed = 2
}

export const TaskStatusLabels = {
  [TaskStatus.Pending]: 'Pendiente',
  [TaskStatus.InProgress]: 'En Progreso', 
  [TaskStatus.Completed]: 'Completada'
};

export const TaskStatusColors = {
  [TaskStatus.Pending]: '#f59e0b',
  [TaskStatus.InProgress]: '#3b82f6',
  [TaskStatus.Completed]: '#10b981'
};
