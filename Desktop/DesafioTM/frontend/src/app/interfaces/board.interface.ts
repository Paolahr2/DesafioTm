/**
 * Interfaz que representa un tablero Kanban
 * Contiene toda la información del tablero y sus configuraciones
 */
export interface Board {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  members: string[];
  color: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  lists?: BoardList[];
  isFavorite?: boolean;
}

/**
 * Interfaz para una lista dentro de un tablero
 */
export interface BoardList {
  id: string;
  title: string;
  type: TaskStatus;
  cards: BoardCard[];
  position: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  boardId: string;
}

/**
 * Estados posibles de una tarjeta
 */
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

/**
 * Configuración de listas fijas del sistema
 */
export interface FixedListConfig {
  type: TaskStatus;
  title: string;
  color: string;
  position: number;
  allowedTransitions: TaskStatus[];
}

/**
 * Interfaz para una tarjeta dentro de una lista
 */
export interface BoardCard {
  id: string;
  title: string;
  description?: string;
  labels?: CardLabel[];
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  assignedUsers?: CardMember[];
  members?: CardMember[];
  position: number;
  listId: string;
  status: TaskStatus;
  isCompleted: boolean;
  completedAt?: Date;
  completedBy?: string;
}

/**
 * Interfaz para las etiquetas de las tarjetas
 */
export interface CardLabel {
  id?: string;
  name: string;
  color: string;
}

/**
 * Interfaz para los miembros de las tarjetas
 */
export interface CardMember {
  id: string;
  name: string;
  avatar?: string;
}

/**
 * Interfaz para crear un nuevo tablero
 * Campos requeridos para la creación de un tablero
 */
export interface CreateBoardRequest {
  name: string;
  description: string;
  color?: string;
}

/**
 * Interfaz para actualizar un tablero existente
 * Todos los campos son opcionales
 */
export interface UpdateBoardRequest {
  name?: string;
  description?: string;
  color?: string;
}

/**
 * Interfaz para crear una nueva lista
 */
export interface CreateListRequest {
  title: string;
  boardId: string;
  position?: number;
}

/**
 * Interfaz para actualizar una lista
 */
export interface UpdateListRequest {
  title?: string;
  position?: number;
}

/**
 * Interfaz para crear una nueva tarjeta
 */
export interface CreateCardRequest {
  title: string;
  description?: string;
  listId: string;
  dueDate?: Date;
  assignedUsers?: string[];
  labels?: CardLabel[];
  position?: number;
}

/**
 * Interfaz para actualizar una tarjeta
 */
export interface UpdateCardRequest {
  title?: string;
  description?: string;
  dueDate?: Date;
  status?: TaskStatus;
  assignedUsers?: string[];
  labels?: CardLabel[];
  position?: number;
  listId?: string;
}

/**
 * Interfaz para mover una tarjeta entre listas
 */
export interface MoveCardRequest {
  cardId: string;
  sourceListId: string;
  targetListId: string;
  newPosition: number;
}

/**
 * Configuración de las listas fijas del sistema
 */
export const FIXED_LISTS_CONFIG: FixedListConfig[] = [
  {
    type: TaskStatus.TODO,
    title: 'Por Hacer',
    color: '#e3f2fd',
    position: 0,
    allowedTransitions: [TaskStatus.IN_PROGRESS]
  },
  {
    type: TaskStatus.IN_PROGRESS,
    title: 'En Progreso',
    color: '#fff3e0',
    position: 1,
    allowedTransitions: [TaskStatus.TODO, TaskStatus.COMPLETED]
  },
  {
    type: TaskStatus.COMPLETED,
    title: 'Completado',
    color: '#e8f5e8',
    position: 2,
    allowedTransitions: [TaskStatus.IN_PROGRESS]
  }
];

/**
 * Usuarios del sistema para asignación
 */
export interface SystemUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'member' | 'viewer';
  isOnline: boolean;
}

/**
 * Lista de usuarios disponibles en el sistema
 */
export const SYSTEM_USERS: SystemUser[] = [
  {
    id: '1',
    name: 'Ana García',
    email: 'ana.garcia@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana&backgroundColor=b6e3f4',
    role: 'admin',
    isOnline: true
  },
  {
    id: '2',
    name: 'Carlos López',
    email: 'carlos.lopez@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos&backgroundColor=c0aede',
    role: 'member',
    isOnline: true
  },
  {
    id: '3',
    name: 'María Rodríguez',
    email: 'maria.rodriguez@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria&backgroundColor=d1c4e9',
    role: 'member',
    isOnline: false
  },
  {
    id: '4',
    name: 'José Martínez',
    email: 'jose.martinez@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jose&backgroundColor=ffcdd2',
    role: 'member',
    isOnline: true
  },
  {
    id: '5',
    name: 'Laura Fernández',
    email: 'laura.fernandez@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Laura&backgroundColor=f8bbd9',
    role: 'viewer',
    isOnline: false
  },
  {
    id: '6',
    name: 'David Silva',
    email: 'david.silva@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David&backgroundColor=e1bee7',
    role: 'member',
    isOnline: true
  }
];
