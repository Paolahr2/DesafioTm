/**
 * Enumeración para los estados de una tarea
 * Representa las diferentes columnas del tablero Kanban
 */
export enum TaskStatus {
  Pending = 0,     // Pendiente
  InProgress = 1,  // En progreso
  Completed = 2    // Completado
}

/**
 * Enumeración para las prioridades de las tareas
 * Ayuda a organizar y priorizar el trabajo
 */
export enum TaskPriority {
  Low = 0,       // Prioridad baja
  Medium = 1,    // Prioridad media
  High = 2       // Prioridad alta
}

/**
 * Interfaz que representa una tarea individual
 * Contiene toda la información necesaria para una tarea
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdBy: string;
  assignedTo?: string;
  boardId: string;
  dueDate?: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  position: number;
}

/**
 * Interfaz para crear una nueva tarea
 * Campos requeridos para la creación
 */
export interface CreateTaskRequest {
  title: string;
  description: string;
  boardId: string;
  createdBy: string;
  priority?: TaskPriority;
  assignedTo?: string;
  dueDate?: Date;
  tags: string[];
}

/**
 * Interfaz para actualizar una tarea existente
 * Todos los campos son opcionales excepto los que se quieren cambiar
 */
export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  assignedTo?: string;
  dueDate?: Date;
  tags?: string[];
}

/**
 * Interfaz para cambiar el estado de una tarea
 * Se usa para mover tareas entre columnas
 */
export interface ChangeTaskStatusRequest {
  newStatus: TaskStatus;
}
