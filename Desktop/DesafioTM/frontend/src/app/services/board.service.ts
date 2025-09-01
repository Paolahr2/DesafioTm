import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError, firstValueFrom } from 'rxjs';
import { Board, CreateBoardRequest, UpdateBoardRequest } from '../interfaces/board.interface';
import { AuthService } from './auth.service';

/**
 * Servicio para gestionar tableros Kanban
 * Se conecta con el backend para realizar operaciones CRUD en tableros
 */
@Injectable({
  providedIn: 'root'
})
export class BoardService {
  // URL base para el endpoint de tableros
  private readonly apiUrl = 'http://localhost:5064/api/Boards';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Obtiene todos los tableros accesibles para el usuario autenticado
   * Incluye tableros propios y compartidos
   * @returns Observable con lista de tableros
   */
  getBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(this.apiUrl, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error obteniendo tableros:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene un tablero específico por su ID
   * @param boardId - ID del tablero a obtener
   * @returns Observable con los datos del tablero
   */
  getBoardByIdObservable(boardId: string): Observable<Board> {
    return this.http.get<Board>(`${this.apiUrl}/${boardId}`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error obteniendo tablero:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene un tablero específico por su ID (versión Promise)
   * @param boardId - ID del tablero a obtener
   * @returns Promise con los datos del tablero
   */
  async getBoardById(boardId: string): Promise<Board> {
    try {
      const board = await firstValueFrom(this.getBoardByIdObservable(boardId));
      return board;
    } catch (error) {
      console.error('Error al obtener el tablero:', error);
      throw error;
    }
  }

  /**
   * Crea un nuevo tablero para el usuario autenticado
   * @param boardData - Datos del tablero a crear
   * @returns Observable con el tablero creado
   */
  createBoard(boardData: CreateBoardRequest): Observable<Board> {
    // Añadir color por defecto si no se especifica
    const boardRequest = {
      ...boardData,
      color: boardData.color || '#2196f3'
    };

    return this.http.post<Board>(this.apiUrl, boardRequest, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error creando tablero:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Actualiza un tablero existente
   * Solo el propietario puede actualizar el tablero
   * @param boardId - ID del tablero a actualizar
   * @param boardData - Datos a actualizar
   * @returns Observable con el tablero actualizado
   */
  updateBoard(boardId: string, boardData: UpdateBoardRequest): Observable<Board> {
    return this.http.put<Board>(`${this.apiUrl}/${boardId}`, boardData, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error actualizando tablero:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Elimina un tablero de forma permanente
   * Solo el propietario puede eliminar el tablero
   * @param boardId - ID del tablero a eliminar
   * @returns Observable vacío indicando éxito
   */
  deleteBoard(boardId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${boardId}`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error eliminando tablero:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene los tableros del usuario con filtros opcionales
   * @param searchTerm - Término de búsqueda para filtrar tableros
   * @returns Observable con tableros filtrados
   */
  searchBoards(searchTerm: string): Observable<Board[]> {
    const params = new HttpParams().set('search', searchTerm);
    
    return this.http.get<Board[]>(`${this.apiUrl}/search`, {
      headers: this.authService.getAuthHeaders(),
      params: params
    }).pipe(
      catchError(error => {
        console.error('Error buscando tableros:', error);
        return throwError(() => error);
      })
    );
  }
}
