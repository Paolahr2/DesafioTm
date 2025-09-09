import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { 
  Board, 
  CreateBoardDto, 
  UpdateBoardDto, 
  BoardWithTasks,
  BoardFilters 
} from '../interfaces/board.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
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
  // CRUD OPERATIONS - COINCIDE CON BOARDSCONTROLLER
  // ============================================================================

  /**
   * Obtener todos los boards del usuario autenticado
   */
  getUserBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(`${this.apiUrl}${environment.endpoints.boards}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError((error: any) => {
        console.error('Error getting user boards:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtener boards públicos
   */
  getPublicBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(`${this.apiUrl}${environment.endpoints.boards}/public`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError((error: any) => {
        console.error('Error getting public boards:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtener board por ID
   */
  getBoardById(id: string): Observable<Board> {
    return this.http.get<Board>(`${this.apiUrl}${environment.endpoints.boards}/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError((error: any) => {
        console.error('Error getting board by id:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Crear nuevo board
   */
  createBoard(boardData: CreateBoardDto): Observable<Board> {
    return this.http.post<Board>(`${this.apiUrl}${environment.endpoints.boards}`, boardData, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError((error: any) => {
        console.error('Error creating board:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Actualizar board existente
   */
  updateBoard(id: string, boardData: UpdateBoardDto): Observable<Board> {
    return this.http.put<Board>(`${this.apiUrl}${environment.endpoints.boards}/${id}`, boardData, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError((error: any) => {
        console.error('Error updating board:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Eliminar board
   */
  deleteBoard(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${environment.endpoints.boards}/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError((error: any) => {
        console.error('Error deleting board:', error);
        return throwError(() => error);
      })
    );
  }

  // ============================================================================
  // MÉTODOS AUXILIARES PARA EL FRONTEND
  // ============================================================================

  /**
   * Filtrar boards localmente
   */
  filterBoards(boards: Board[], filters: BoardFilters): Board[] {
    return boards.filter(board => {
      let matches = true;

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        matches = matches && (
          board.title.toLowerCase().includes(searchLower) ||
          board.description.toLowerCase().includes(searchLower)
        );
      }

      if (filters.isPublic !== undefined) {
        matches = matches && board.isPublic === filters.isPublic;
      }

      if (filters.ownerId) {
        matches = matches && board.ownerId === filters.ownerId;
      }

      return matches;
    });
  }
}
