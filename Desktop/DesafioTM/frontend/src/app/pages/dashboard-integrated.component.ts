import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { BoardService } from '../services/board.service';
import { Board, CreateBoardDto, BoardFilters } from '../interfaces/board.interface';
import { User } from '../interfaces/user.interface';
import { CreateBoardDialogComponent } from './create-board-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    MatSlideToggleModule,
    RouterModule
  ],
  template: `
    <!-- Header -->
    <mat-toolbar color="primary" class="header-toolbar">
      <span class="logo">
        <mat-icon>dashboard</mat-icon>
        TaskManager
      </span>
      
      <span class="spacer"></span>
      
      <div class="header-actions">
        <button mat-icon-button [matMenuTriggerFor]="userMenu">
          <mat-icon>account_circle</mat-icon>
        </button>
        <mat-menu #userMenu="matMenu">
          <div class="user-info">
            <p><strong>{{currentUser?.fullName}}</strong></p>
            <p>{{currentUser?.email}}</p>
          </div>
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon>
            Cerrar Sesión
          </button>
        </mat-menu>
      </div>
    </mat-toolbar>

    <!-- Main Content -->
    <div class="dashboard-container">
      <!-- Dashboard Header -->
      <div class="dashboard-header">
        <h1>Mis Tableros</h1>
        <button mat-raised-button color="primary" (click)="openCreateBoardDialog()">
          <mat-icon>add</mat-icon>
          Crear Tablero
        </button>
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar tableros</mat-label>
          <input matInput 
                 [(ngModel)]="searchText" 
                 (ngModelChange)="onFilterChange()"
                 placeholder="Nombre o descripción...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
        
        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Tipo</mat-label>
          <mat-select [(ngModel)]="selectedFilter" (ngModelChange)="onFilterChange()">
            <mat-option value="all">Todos</mat-option>
            <mat-option value="my">Mis Tableros</mat-option>
            <mat-option value="public">Públicos</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="loading-container">
        <p>Cargando tableros...</p>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && filteredBoards.length === 0" class="empty-state">
        <mat-icon>dashboard</mat-icon>
        <h2>No hay tableros</h2>
        <p>Crea tu primer tablero para empezar a organizar tus tareas</p>
        <button mat-raised-button color="primary" (click)="openCreateBoardDialog()">
          Crear Tablero
        </button>
      </div>

      <!-- Boards Grid -->
      <div *ngIf="!loading && filteredBoards.length > 0" class="boards-grid">
        <mat-card 
          *ngFor="let board of filteredBoards"
          class="board-card"
          [routerLink]="['/board', board.id]">
          
          <mat-card-header>
            <mat-card-title>{{board.title}}</mat-card-title>
            <mat-card-subtitle>
              <mat-icon *ngIf="board.isPublic">public</mat-icon>
              <mat-icon *ngIf="!board.isPublic">lock</mat-icon>
              {{board.isPublic ? 'Público' : 'Privado'}}
            </mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <p class="board-description">{{board.description}}</p>
            
            <div class="board-stats">
              <span class="stat">
                <mat-icon>people</mat-icon>
                {{board.members.length}} miembros
              </span>
              <span class="stat">
                <mat-icon>schedule</mat-icon>
                {{formatDate(board.createdAt)}}
              </span>
            </div>
          </mat-card-content>
          
          <mat-card-actions>
            <button mat-button color="primary">
              <mat-icon>arrow_forward</mat-icon>
              Abrir
            </button>
            <button mat-icon-button [matMenuTriggerFor]="boardMenu" (click)="$event.stopPropagation()">
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #boardMenu="matMenu">
              <button mat-menu-item (click)="editBoard(board); $event.stopPropagation()">
                <mat-icon>edit</mat-icon>
                Editar
              </button>
              <button mat-menu-item (click)="deleteBoard(board); $event.stopPropagation()">
                <mat-icon>delete</mat-icon>
                Eliminar
              </button>
            </mat-menu>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .header-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.2rem;
      font-weight: 600;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .user-info {
      padding: 16px;
      text-align: center;
    }

    .user-info p {
      margin: 4px 0;
    }

    .dashboard-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .dashboard-header h1 {
      margin: 0;
      color: #333;
    }

    .filters-section {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      align-items: center;
    }

    .search-field {
      flex: 1;
      max-width: 400px;
    }

    .filter-field {
      min-width: 150px;
    }

    .loading-container {
      text-align: center;
      padding: 48px;
    }

    .empty-state {
      text-align: center;
      padding: 48px;
      color: #666;
    }

    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #ccc;
      margin-bottom: 16px;
    }

    .boards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }

    .board-card {
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid #e0e0e0;
    }

    .board-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .board-description {
      color: #666;
      margin: 12px 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .board-stats {
      display: flex;
      justify-content: space-between;
      margin-top: 16px;
    }

    .stat {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.875rem;
      color: #666;
    }

    .stat mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  boards: Board[] = [];
  filteredBoards: Board[] = [];
  loading = false;
  searchText = '';
  selectedFilter = 'all';

  constructor(
    private authService: AuthService,
    private boardService: BoardService,
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadBoards();
  }

  loadBoards() {
    this.loading = true;
    
    // Cargar boards del usuario
    this.boardService.getUserBoards().subscribe({
      next: (userBoards) => {
        this.boards = [...userBoards];
        
        // Si queremos mostrar también los públicos
        if (this.selectedFilter === 'all' || this.selectedFilter === 'public') {
          this.boardService.getPublicBoards().subscribe({
            next: (publicBoards) => {
              // Agregar boards públicos que no sean del usuario
              const publicNotOwned = publicBoards.filter(
                pub => !this.boards.some(user => user.id === pub.id)
              );
              this.boards = [...this.boards, ...publicNotOwned];
              this.applyFilters();
              this.loading = false;
            },
            error: (error) => {
              console.error('Error loading public boards:', error);
              this.applyFilters();
              this.loading = false;
            }
          });
        } else {
          this.applyFilters();
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error loading user boards:', error);
        this.showError('Error al cargar los tableros');
        this.loading = false;
      }
    });
  }

  onFilterChange() {
    this.applyFilters();
  }

  private applyFilters() {
    let filtered = [...this.boards];

    // Filtro por tipo
    if (this.selectedFilter === 'my') {
      filtered = filtered.filter(board => board.ownerId === this.currentUser?.id);
    } else if (this.selectedFilter === 'public') {
      filtered = filtered.filter(board => board.isPublic);
    }

    // Filtro por búsqueda
    if (this.searchText.trim()) {
      const search = this.searchText.toLowerCase();
      filtered = filtered.filter(board => 
        board.title.toLowerCase().includes(search) ||
        board.description.toLowerCase().includes(search)
      );
    }

    this.filteredBoards = filtered;
  }

  openCreateBoardDialog() {
    const dialogRef = this.dialog.open(CreateBoardDialogComponent, {
      width: '500px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createBoard(result);
      }
    });
  }

  createBoard(boardData: any) {
    const createBoardDto: CreateBoardDto = {
      title: boardData.title,
      description: boardData.description || '',
      color: boardData.color,
      isPublic: boardData.isPublic
    };

    this.boardService.createBoard(createBoardDto).subscribe({
      next: (newBoard) => {
        this.showSuccess('Tablero creado correctamente');
        this.loadBoards();
        // Navegar al tablero recién creado
        this.router.navigate(['/board', newBoard.id]);
      },
      error: (error) => {
        console.error('Error creating board:', error);
        this.showError('Error al crear el tablero');
      }
    });
  }

  editBoard(board: Board) {
    // TODO: Implementar edición de board
    console.log('Edit board:', board);
  }

  deleteBoard(board: Board) {
    if (confirm(`¿Estás seguro de que quieres eliminar "${board.title}"?`)) {
      this.boardService.deleteBoard(board.id).subscribe({
        next: () => {
          this.showSuccess('Tablero eliminado correctamente');
          this.loadBoards();
        },
        error: (error) => {
          console.error('Error deleting board:', error);
          this.showError('Error al eliminar el tablero');
        }
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  private showSuccess(message: string) {
    console.log('SUCCESS:', message);
    // TODO: Implement toast notification when material snackbar is available
  }

  private showError(message: string) {
    console.error('ERROR:', message);
    // TODO: Implement toast notification when material snackbar is available
  }
}
