import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError, firstValueFrom } from 'rxjs';
import { 
  Task, 
  CreateTaskRequest, 
  UpdateTaskRequest, 
  ChangeTaskStatusRequest 
} from '../interfaces/task.interface';
import { AuthService } from './auth.service';

/**
 * Servicio para gestionar tareas dentro de los tableros Kanban
 * Maneja todas las operaciones CRUD de tareas y cambios de estado
 */
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // URL base para el endpoint de tareas
  private readonly apiUrl = 'http://localhost:5064/api/Tasks';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Obtiene todas las tareas de un tablero específico
   * @param boardId - ID del tablero del cual obtener las tareas
   * @returns Observable con lista de tareas del tablero
   */
  getTasksByBoard(boardId: string): Observable<Task[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('Usuario no autenticado'));
    }

    const params = new HttpParams()
      .set('boardId', boardId)
      .set('userId', currentUser.id);

    return this.http.get<Task[]>(this.apiUrl, {
      headers: this.authService.getAuthHeaders(),
      params: params
    }).pipe(
      catchError(error => {
        console.error('Error obteniendo tareas:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene una tarea específica por su ID
   * @param taskId - ID de la tarea a obtener
   * @returns Observable con los datos de la tarea
   */
  getTaskById(taskId: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${taskId}`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error obteniendo tarea:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene todas las tareas de un tablero específico
   * @param boardId ID del tablero
   * @returns Promise con array de tareas
   */
  async getTasksByBoardId(boardId: string): Promise<Task[]> {
    try {
      const tasks = await firstValueFrom(this.getTasksByBoard(boardId));
      return tasks;
    } catch (error) {
      console.error('Error al obtener tareas del tablero:', error);
      throw error;
    }
  }

  /**
   * Crea una nueva tarea en el tablero especificado
   * @param taskData - Datos de la tarea a crear
   * @returns Observable con la tarea creada
   */
  createTask(taskData: CreateTaskRequest): Observable<Task> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('Usuario no autenticado'));
    }

    // Asegurar que el createdBy sea el usuario actual
    const taskRequest = {
      ...taskData,
      createdBy: currentUser.id
    };

    return this.http.post<Task>(this.apiUrl, taskRequest, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error creando tarea:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Actualiza los datos de una tarea existente
   * @param taskId - ID de la tarea a actualizar
   * @param taskData - Datos a actualizar en la tarea
   * @returns Observable con la tarea actualizada
   */
  updateTask(taskId: string, taskData: UpdateTaskRequest): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${taskId}`, taskData, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error actualizando tarea:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Cambia el estado de una tarea (moverla entre columnas)
   * @param taskId - ID de la tarea a mover
   * @param statusRequest - Nuevo estado de la tarea
   * @returns Observable con la tarea actualizada
   */
  changeTaskStatus(taskId: string, statusRequest: ChangeTaskStatusRequest): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${taskId}/status`, statusRequest, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error cambiando estado de tarea:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Cambia la posición de una tarea dentro de su columna
   * @param taskId - ID de la tarea a reposicionar
   * @param newPosition - Nueva posición de la tarea
   * @returns Observable con la tarea actualizada
   */
  changeTaskPosition(taskId: string, newPosition: number): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${taskId}/position`, { newPosition }, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error cambiando posición de tarea:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Elimina una tarea de forma permanente
   * @param taskId - ID de la tarea a eliminar
   * @returns Observable vacío indicando éxito
   */
  deleteTask(taskId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${taskId}`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error eliminando tarea:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Busca tareas por término de búsqueda
   * @param boardId - ID del tablero donde buscar
   * @param searchTerm - Término a buscar en título y descripción
   * @returns Observable con tareas que coinciden con la búsqueda
   */
  searchTasks(boardId: string, searchTerm: string): Observable<Task[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('Usuario no autenticado'));
    }

    const params = new HttpParams()
      .set('boardId', boardId)
      .set('userId', currentUser.id)
      .set('search', searchTerm);

    return this.http.get<Task[]>(`${this.apiUrl}/search`, {
      headers: this.authService.getAuthHeaders(),
      params: params
    }).pipe(
      catchError(error => {
        console.error('Error buscando tareas:', error);
        return throwError(() => error);
      })
    );
  }
}
