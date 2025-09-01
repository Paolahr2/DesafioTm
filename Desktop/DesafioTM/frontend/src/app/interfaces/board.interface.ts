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
