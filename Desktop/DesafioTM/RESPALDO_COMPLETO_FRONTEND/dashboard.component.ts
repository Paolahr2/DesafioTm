import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { BoardService } from '../services/board.service';
import { Board } from '../interfaces/board.interface';
import { User } from '../interfaces/user.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    RouterModule
  ],
  template: `
    <div class="dashboard-container">
      <!-- Header con gradiente mejorado -->
      <mat-toolbar class="dashboard-header gradient-bg">
        <div class="flex justify-between align-center full-width">
          <div class="flex items-center space-x-3">
            <mat-icon class="text-white text-3xl">dashboard</mat-icon>
            <h1 class="text-2xl font-bold text-white" style="margin: 0;">TaskManagerSWO</h1>
          </div>
          <button mat-icon-button [matMenuTriggerFor]="userMenu" class="interactive-hover">
            <mat-icon class="text-white text-3xl">account_circle</mat-icon>
          </button>
        </div>
      </mat-toolbar>

      <!-- Contenido principal con efectos mejorados -->
      <div class="dashboard-content p-6" style="background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); min-height: calc(100vh - 80px);">
        <div class="flex justify-between align-center mb-4">
          <h2 class="text-3xl font-bold title-gradient" style="margin: 0;">Mis Tableros</h2>
          <button mat-raised-button class="btn-primary interactive-hover pulse-effect" (click)="createBoard()">
            <mat-icon>add</mat-icon> 
            <span style="margin-left: 8px;">Crear Tablero</span>
          </button>
        </div>

        <!-- Grid mejorado de tableros -->
        <div class="boards-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 32px;">
          <mat-card *ngFor="let board of boards" class="board-card interactive-hover" (click)="openBoard(board)">
            <mat-card-header>
              <mat-card-title class="text-xl font-semibold">{{ board.name }}</mat-card-title>
              <mat-card-subtitle class="subtitle-modern">{{ board.description }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p class="text-sm text-gray-500">Creado: {{ formatDate(board.createdAt) }}</p>
              <div class="mt-3 flex items-center space-x-2">
                <span class="task-tag">Tablero</span>
                <span class="task-tag" style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);">Activo</span>
              </div>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button class="interactive-hover" (click)="editBoard(board, $event)">
                <mat-icon>edit</mat-icon> Editar
              </button>
              <button mat-button class="interactive-hover" style="color: #ff6b6b;" (click)="deleteBoard(board, $event)">
                <mat-icon>delete</mat-icon> Eliminar
              </button>
            </mat-card-actions>
          </mat-card>

          <!-- Tarjeta mejorada para crear nuevo tablero -->
          <mat-card class="new-board-card interactive-hover" (click)="createBoard()">
            <mat-card-content class="text-center p-6">
              <mat-icon class="text-6xl mb-4" style="color: #667eea; font-size: 64px; width: 64px; height: 64px;">add_circle_outline</mat-icon>
              <h3 class="text-xl font-semibold title-gradient">Crear Nuevo Tablero</h3>
              <p class="subtitle-modern mt-2">Organiza tus proyectos de manera eficiente</p>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <!-- Menú del usuario mejorado -->
      <mat-menu #userMenu="matMenu">
        <div class="p-4" style="border-bottom: 1px solid rgba(102, 126, 234, 0.1); background: linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%);">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 gradient-bg rounded-full flex items-center justify-center">
              <mat-icon class="text-white">person</mat-icon>
            </div>
            <div>
              <p class="font-semibold text-gray-800" style="margin: 0;">{{ currentUser?.fullName || currentUser?.username }}</p>
              <p class="text-sm text-gray-500" style="margin: 0;">{{ currentUser?.email }}</p>
            </div>
          </div>
        </div>
        <button mat-menu-item class="interactive-hover" (click)="logout()">
          <mat-icon style="color: #ff6b6b;">logout</mat-icon>
          <span style="margin-left: 8px;">Cerrar Sesión</span>
        </button>
      </mat-menu>
    </div>
  `,
  styles: [`
    .dashboard-container {
      height: 100vh;
      overflow-y: auto;
    }

    .board-card {
      cursor: pointer;
      height: fit-content;
    }

    .new-board-card {
      cursor: pointer;
      border: 2px dashed #ccc;
      height: fit-content;
    }

    .new-board-card:hover {
      border-color: #1976d2;
      background-color: #f5f5f5;
    }

    .flex {
      display: flex;
    }

    .justify-between {
      justify-content: space-between;
    }

    .align-center {
      align-items: center;
    }

    .full-width {
      width: 100%;
    }

    .p-6 {
      padding: 24px;
    }

    .p-4 {
      padding: 16px;
    }

    .mb-4 {
      margin-bottom: 16px;
    }

    .text-center {
      text-align: center;
    }

    .card-hover:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transform: translateY(-2px);
      transition: all 0.2s ease-in-out;
    }

    .gradient-bg {
      background: linear-gradient(45deg, #1976d2 30%, #42a5f5 90%);
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  boards: Board[] = [];
  loading = true;

  constructor(
    private authService: AuthService,
    private boardService: BoardService,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      this.currentUser = await this.authService.getCurrentUser();
      await this.loadBoards();
    } catch (error) {
      console.error('Error al inicializar dashboard:', error);
    } finally {
      this.loading = false;
    }
  }

  private async loadBoards(): Promise<void> {
    try {
      this.boards = await this.boardService.getBoards().toPromise() || [];
    } catch (error) {
      console.error('Error al cargar tableros:', error);
    }
  }

  openBoard(board: Board): void {
    this.router.navigate(['/board', board.id]);
  }

  createBoard(): void {
    // Por ahora, crear un tablero simple
    const boardName = prompt('Nombre del tablero:');
    if (boardName) {
      this.boardService.createBoard({ 
        name: boardName, 
        description: 'Nuevo tablero' 
      }).subscribe({
        next: () => this.loadBoards(),
        error: (error) => console.error('Error al crear tablero:', error)
      });
    }
  }

  editBoard(board: Board, event: Event): void {
    event.stopPropagation();
    // Implementar edición de tablero
    console.log('Editar tablero:', board);
  }

  deleteBoard(board: Board, event: Event): void {
    event.stopPropagation();
    if (confirm('¿Estás seguro de eliminar este tablero?')) {
      this.boardService.deleteBoard(board.id!).subscribe({
        next: () => this.loadBoards(),
        error: (error) => console.error('Error al eliminar tablero:', error)
      });
    }
  }

  formatDate(date?: Date | string): string {
    if (!date) return 'Fecha no disponible';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('es-ES');
  }

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}
