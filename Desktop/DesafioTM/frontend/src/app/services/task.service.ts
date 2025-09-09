import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { 
  TaskDto, 
  CreateTaskDto, 
  UpdateTaskDto, 
  ChangeTaskStatusDto,
  TaskFilters 
} from '../interfaces/board.interface';
import { TaskStatus } from '../enums/task-status.enum';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // ============================================================================
  // CRUD OPERATIONS - COINCIDE CON TASKSCONTROLLER
  // ============================================================================

  /**
   * Obtener todas las tasks de un board
   */
  getTasksByBoard(boardId: string): Observable<TaskDto[]> {
    return this.http.get<TaskDto[]>(`${this.apiUrl}${environment.endpoints.tasks}/board/${boardId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError((error: any) => {
        console.error('Error getting tasks by board:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtener task por ID
   */
  getTaskById(id: string): Observable<TaskDto> {
    return this.http.get<TaskDto>(`${this.apiUrl}${environment.endpoints.tasks}/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError((error: any) => {
        console.error('Error getting task by id:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Crear nueva task
   */
  createTask(taskData: CreateTaskDto): Observable<TaskDto> {
    return this.http.post<TaskDto>(`${this.apiUrl}${environment.endpoints.tasks}`, taskData, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError((error: any) => {
        console.error('Error creating task:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Actualizar task existente
   */
  updateTask(id: string, taskData: UpdateTaskDto): Observable<TaskDto> {
    return this.http.put<TaskDto>(`${this.apiUrl}${environment.endpoints.tasks}/${id}`, taskData, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError((error: any) => {
        console.error('Error updating task:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Cambiar estado de task
   */
  changeTaskStatus(id: string, statusData: ChangeTaskStatusDto): Observable<TaskDto> {
    return this.http.patch<TaskDto>(`${this.apiUrl}${environment.endpoints.tasks}/${id}/status`, statusData, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError((error: any) => {
        console.error('Error changing task status:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Eliminar task
   */
  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${environment.endpoints.tasks}/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError((error: any) => {
        console.error('Error deleting task:', error);
        return throwError(() => error);
      })
    );
  }

  // ============================================================================
  // MÉTODOS AUXILIARES PARA EL FRONTEND
  // ============================================================================

  /**
   * Filtrar tasks localmente
   */
  filterTasks(tasks: TaskDto[], filters: TaskFilters): TaskDto[] {
    return tasks.filter(task => {
      let matches = true;

      if (filters.status !== undefined) {
        matches = matches && task.status === filters.status;
      }

      if (filters.assignedUserId) {
        matches = matches && task.assignedUserId === filters.assignedUserId;
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        matches = matches && (
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower)
        );
      }

      return matches;
    });
  }

  /**
   * Agrupar tasks por estado
   */
  groupTasksByStatus(tasks: TaskDto[]): { [key in TaskStatus]: TaskDto[] } {
    return {
      [TaskStatus.Pending]: tasks.filter(t => t.status === TaskStatus.Pending),
      [TaskStatus.InProgress]: tasks.filter(t => t.status === TaskStatus.InProgress),
      [TaskStatus.Completed]: tasks.filter(t => t.status === TaskStatus.Completed)
    };
  }

  /**
   * Contar tasks por estado
   */
  getTaskCounts(tasks: TaskDto[]) {
    return {
      pending: tasks.filter(t => t.status === TaskStatus.Pending).length,
      inProgress: tasks.filter(t => t.status === TaskStatus.InProgress).length,
      completed: tasks.filter(t => t.status === TaskStatus.Completed).length,
      total: tasks.length
    };
  }
}
