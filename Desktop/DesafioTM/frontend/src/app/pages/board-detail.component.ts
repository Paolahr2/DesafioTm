import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';

import { BoardService } from '../services/board.service';
import { TaskService } from '../services/task.service';
import { AuthService } from '../services/auth.service';
import { Board, TaskDto, CreateTaskDto, ChangeTaskStatusDto } from '../interfaces/board.interface';
import { TaskStatus } from '../enums/task-status.enum';

interface KanbanColumn {
  id: string;
  title: string;
  status: TaskStatus;
  tasks: TaskDto[];
  color: string;
}

@Component({
  selector: 'app-board-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DragDropModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <!-- Header -->
    <mat-toolbar color="primary" class="board-header">
      <button mat-icon-button (click)="goBack()">
        <mat-icon>arrow_back</mat-icon>
      </button>

      <span class="board-title">{{ board?.title || 'Cargando...' }}</span>

      <span class="spacer"></span>

      <div class="board-actions">
        <button mat-icon-button [matMenuTriggerFor]="boardMenu">
          <mat-icon>more_vert</mat-icon>
        </button>
        <mat-menu #boardMenu="matMenu">
          <button mat-menu-item (click)="editBoard()">
            <mat-icon>edit</mat-icon>
            Editar Tablero
          </button>
          <button mat-menu-item (click)="shareBoard()">
            <mat-icon>share</mat-icon>
            Compartir
          </button>
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="deleteBoard()" class="delete-option">
            <mat-icon>delete</mat-icon>
            Eliminar Tablero
          </button>
        </mat-menu>
      </div>
    </mat-toolbar>

    <!-- Loading State -->
    <div *ngIf="loading" class="loading-container">
      <mat-spinner></mat-spinner>
      <p>Cargando tablero...</p>
    </div>

    <!-- Board Content -->
    <div *ngIf="!loading && board" class="board-container">
      <div class="kanban-board">
        <div
          *ngFor="let column of columns"
          class="kanban-column"
          [style.border-top-color]="column.color">

          <div class="column-header">
            <h3>{{ column.title }}</h3>
            <span class="task-count">{{ column.tasks.length }}</span>
          </div>

          <div
            class="task-list"
            cdkDropList
            [id]="column.id"
            [cdkDropListData]="column.tasks"
            (cdkDropListDropped)="drop($event)">

            <mat-card
              *ngFor="let task of column.tasks; trackBy: trackByTaskId"
              class="task-card"
              cdkDrag
              [cdkDragData]="task">

              <mat-card-header class="task-header">
                <mat-card-title class="task-title">{{ task.title }}</mat-card-title>
                <button mat-icon-button [matMenuTriggerFor]="taskMenu" (click)="$event.stopPropagation()">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #taskMenu="matMenu">
                  <button mat-menu-item (click)="editTask(task)">
                    <mat-icon>edit</mat-icon>
                    Editar
                  </button>
                  <button mat-menu-item (click)="duplicateTask(task)">
                    <mat-icon>content_copy</mat-icon>
                    Duplicar
                  </button>
                  <mat-divider></mat-divider>
                  <button mat-menu-item (click)="deleteTask(task)" class="delete-option">
                    <mat-icon>delete</mat-icon>
                    Eliminar
                  </button>
                </mat-menu>
              </mat-card-header>

              <mat-card-content class="task-content">
                <p class="task-description" *ngIf="task.description">{{ task.description }}</p>

                <div class="task-meta" *ngIf="task.assignedUserId">
                  <div class="task-assigned">
                    <mat-icon>person</mat-icon>
                    Asignado
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>

          <button
            mat-button
            class="add-task-btn"
            (click)="openCreateTaskDialog(column.status)">
            <mat-icon>add</mat-icon>
            Agregar tarea
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .board-header {
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .board-title {
      font-size: 1.25rem;
      font-weight: 500;
      margin-left: 16px;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .board-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 60vh;
      gap: 16px;
    }

    .board-container {
      padding: 24px;
      background-color: #f5f5f5;
      min-height: calc(100vh - 64px);
    }

    .kanban-board {
      display: flex;
      gap: 24px;
      overflow-x: auto;
      padding: 16px 0;
    }

    .kanban-column {
      background: white;
      border-radius: 8px;
      min-width: 300px;
      max-width: 300px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border-top: 4px solid;
    }

    .column-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #e0e0e0;
    }

    .column-header h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: #333;
    }

    .task-count {
      background: #e0e0e0;
      color: #666;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .task-list {
      min-height: 200px;
      padding: 8px;
      max-height: 60vh;
      overflow-y: auto;
    }

    .task-card {
      margin-bottom: 8px;
      cursor: move;
      transition: all 0.2s ease;
    }

    .task-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transform: translateY(-1px);
    }

    .task-header {
      padding: 12px 12px 8px 12px;
    }

    .task-title {
      font-size: 0.95rem;
      line-height: 1.3;
      margin-bottom: 4px;
    }

    .task-content {
      padding: 0 12px 12px 12px;
    }

    .task-description {
      font-size: 0.875rem;
      color: #666;
      margin: 8px 0;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .task-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 8px 0;
      font-size: 0.75rem;
    }

    .task-assigned {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #666;
    }

    .add-task-btn {
      width: 100%;
      margin: 8px;
      justify-content: flex-start;
      color: #666;
      border: 1px dashed #ccc;
    }

    .add-task-btn:hover {
      background: #f5f5f5;
      border-color: #999;
    }

    .delete-option {
      color: #d32f2f;
    }

    .delete-option mat-icon {
      color: #d32f2f;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .kanban-board {
        flex-direction: column;
        align-items: center;
      }

      .kanban-column {
        min-width: 280px;
        max-width: 280px;
      }
    }

    /* Drag and drop styles */
    .cdk-drag-preview {
      box-sizing: border-box;
      border-radius: 4px;
      box-shadow: 0 8px 16px rgba(0,0,0,0.3);
    }

    .cdk-drag-placeholder {
      opacity: 0.4;
      border: 2px dashed #ccc;
      background: #f9f9f9;
      min-height: 60px;
      border-radius: 4px;
    }

    .cdk-drag-animating {
      transition: transform 300ms cubic-bezier(0, 0, 0.2, 1);
    }

    .task-list.cdk-drop-list-dragging .task-card:not(.cdk-drag-placeholder) {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
  `]
})
export class BoardDetailComponent implements OnInit, OnDestroy {
  board: Board | null = null;
  columns: KanbanColumn[] = [];
  loading = true;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService,
    private taskService: TaskService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    const boardId = this.route.snapshot.paramMap.get('id');
    if (boardId) {
      this.loadBoard(boardId);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadBoard(boardId: string) {
    this.loading = true;

    // Load board details
    this.boardService.getBoardById(boardId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (board) => {
        this.board = board;
        this.initializeColumns();
        this.loadTasks(boardId);
      },
      error: (error: any) => {
        console.error('Error loading board:', error);
        this.showError('Error al cargar el tablero');
        this.loading = false;
      }
    });
  }

  private initializeColumns() {
    this.columns = [
      {
        id: 'pending',
        title: 'Pendiente',
        status: TaskStatus.Pending,
        tasks: [],
        color: '#e3f2fd'
      },
      {
        id: 'in-progress',
        title: 'En Progreso',
        status: TaskStatus.InProgress,
        tasks: [],
        color: '#fff3e0'
      },
      {
        id: 'completed',
        title: 'Completado',
        status: TaskStatus.Completed,
        tasks: [],
        color: '#e8f5e8'
      }
    ];
  }

  private loadTasks(boardId: string) {
    this.taskService.getTasksByBoard(boardId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (tasks: TaskDto[]) => {
        this.distributeTasksToColumns(tasks);
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading tasks:', error);
        this.showError('Error al cargar las tareas');
        this.loading = false;
      }
    });
  }

  private distributeTasksToColumns(tasks: TaskDto[]) {
    this.columns.forEach(column => {
      column.tasks = tasks.filter(task => task.status === column.status);
    });
  }

  drop(event: CdkDragDrop<TaskDto[]>) {
    if (event.previousContainer === event.container) {
      // Same column - reorder
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Different column - move task
      const task = event.previousContainer.data[event.previousIndex];
      const newStatus = this.getColumnStatus(event.container.id);

      if (newStatus !== undefined) {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );

        // Update task status in backend
        this.updateTaskStatus(task.id, newStatus);
      }
    }
  }

  private getColumnStatus(columnId: string): TaskStatus | undefined {
    const column = this.columns.find(col => col.id === columnId);
    return column?.status;
  }

  private updateTaskStatus(taskId: string, newStatus: TaskStatus) {
    const statusData: ChangeTaskStatusDto = { newStatus: newStatus };
    this.taskService.changeTaskStatus(taskId, statusData).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.showSuccess('Tarea movida correctamente');
      },
      error: (error: any) => {
        console.error('Error updating task status:', error);
        this.showError('Error al mover la tarea');
        // Reload tasks to revert changes
        if (this.board) {
          this.loadTasks(this.board.id);
        }
      }
    });
  }

  openCreateTaskDialog(status: TaskStatus) {
    // TODO: Implement create task dialog
    console.log('Create task with status:', status);
  }

  editTask(task: TaskDto) {
    // TODO: Implement edit task dialog
    console.log('Edit task:', task);
  }

  duplicateTask(task: TaskDto) {
    // TODO: Implement duplicate task
    console.log('Duplicate task:', task);
  }

  deleteTask(task: TaskDto) {
    if (confirm(`¿Estás seguro de que quieres eliminar "${task.title}"?`)) {
      this.taskService.deleteTask(task.id).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.showSuccess('Tarea eliminada correctamente');
          if (this.board) {
            this.loadTasks(this.board.id);
          }
        },
        error: (error: any) => {
          console.error('Error deleting task:', error);
          this.showError('Error al eliminar la tarea');
        }
      });
    }
  }

  editBoard() {
    // TODO: Implement edit board dialog
    console.log('Edit board:', this.board);
  }

  shareBoard() {
    // TODO: Implement share board dialog
    console.log('Share board:', this.board);
  }

  deleteBoard() {
    if (this.board && confirm(`¿Estás seguro de que quieres eliminar "${this.board.title}"?`)) {
      this.boardService.deleteBoard(this.board.id).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.showSuccess('Tablero eliminado correctamente');
          this.router.navigate(['/dashboard']);
        },
        error: (error: any) => {
          console.error('Error deleting board:', error);
          this.showError('Error al eliminar el tablero');
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  trackByTaskId(index: number, task: TaskDto): string {
    return task.id;
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}
