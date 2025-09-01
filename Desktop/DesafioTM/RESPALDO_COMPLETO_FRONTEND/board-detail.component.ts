import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { Board } from '../interfaces/board.interface';
import { Task } from '../interfaces/task.interface';
import { User } from '../interfaces/user.interface';
import { TaskStatus, TaskPriority } from '../interfaces/task.interface';

import { BoardService } from '../services/board.service';
import { TaskService } from '../services/task.service';
import { AuthService } from '../services/auth.service';
import { TaskDialogComponent } from './task-dialog.component';

@Component({
  selector: 'app-board-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    DragDropModule
  ],
  template: `
    <div class="board-container">
      <!-- Header del tablero -->
      <mat-toolbar class="gradient-bg" color="primary">
        <div class="flex justify-between align-center full-width">
          <div class="flex align-center gap-4">
            <button mat-icon-button (click)="goBack()">
              <mat-icon>arrow_back</mat-icon>
            </button>
            <h1 class="mat-h1" style="margin: 0; color: white;">{{ board?.name || 'Cargando...' }}</h1>
          </div>
          
          <div class="flex align-center gap-2">
            <!-- Menú de usuario -->
            <button mat-icon-button [matMenuTriggerFor]="userMenu">
              <mat-icon style="color: white;">account_circle</mat-icon>
            </button>
          </div>
        </div>
      </mat-toolbar>

      <!-- Contenido del tablero -->
      <div class="board-content p-6 min-h-screen" style="background-color: #f5f5f5;" *ngIf="!loading; else loadingTemplate">
        <div class="columns-container flex gap-6" style="overflow-x: auto; min-height: 400px;">
          <!-- Columna Pendiente -->
          <div class="kanban-column">
            <div class="column-header status-pending p-4">
              <div class="flex justify-between align-center">
                <h2 class="mat-h3" style="margin: 0; color: #f57c00;">Pendiente</h2>
                <span class="mat-caption" style="background-color: #ffc107; color: white; padding: 4px 8px; border-radius: 12px;">
                  {{ getTasksByStatus(TaskStatus.Pending).length }}
                </span>
              </div>
              <button mat-raised-button color="accent" class="full-width mt-3" (click)="openTaskDialog(TaskStatus.Pending)">
                <mat-icon>add</mat-icon> Agregar Tarea
              </button>
            </div>
            
            <div class="tasks-container mt-4 min-h-72" 
                 cdkDropList [cdkDropListData]="getTasksByStatus(TaskStatus.Pending)"
                 cdkDropListConnectedTo="['in-progress-list', 'completed-list']" 
                 id="pending-list"
                 (cdkDropListDropped)="onTaskDrop($event)">
              
              <div *ngFor="let task of getTasksByStatus(TaskStatus.Pending); trackBy: trackByTaskId" 
                   class="task-card mb-3" cdkDrag>
                <mat-card class="hover:shadow-lg transition-shadow cursor-pointer">
                  <mat-card-content class="p-4">
                    <div class="flex justify-between items-start mb-2">
                      <h3 class="text-lg font-medium text-gray-800 line-clamp-2">{{ task.title }}</h3>
                      <button mat-icon-button [matMenuTriggerFor]="taskMenu" (click)="setSelectedTask(task)">
                        <mat-icon class="text-gray-500">more_vert</mat-icon>
                      </button>
                    </div>
                    
                    <p class="text-gray-600 text-sm mb-3 line-clamp-3">{{ task.description }}</p>
                    
                    <div class="flex justify-between items-center">
                      <span [ngClass]="getPriorityClass(task.priority)" 
                            class="px-2 py-1 rounded-full text-xs font-medium">
                        {{ getPriorityText(task.priority) }}
                      </span>
                      <span class="text-xs text-gray-500">
                        {{ formatDate(task.dueDate) }}
                      </span>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </div>

          <!-- Columna En Progreso -->
          <div class="kanban-column">
            <div class="column-header bg-blue-100 border-l-4 border-blue-500 p-4 rounded-lg">
              <div class="flex justify-between items-center">
                <h2 class="text-lg font-semibold text-blue-700">En Progreso</h2>
                <span class="bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
                  {{ getTasksByStatus(TaskStatus.InProgress).length }}
                </span>
              </div>
              <button mat-button (click)="openTaskDialog(TaskStatus.InProgress)" 
                      class="w-full mt-3 bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                <mat-icon>add</mat-icon> Agregar Tarea
              </button>
            </div>
            
            <div class="tasks-container mt-4 min-h-72" 
                 cdkDropList [cdkDropListData]="getTasksByStatus(TaskStatus.InProgress)"
                 cdkDropListConnectedTo="['pending-list', 'completed-list']" 
                 id="in-progress-list"
                 (cdkDropListDropped)="onTaskDrop($event)">
              
              <div *ngFor="let task of getTasksByStatus(TaskStatus.InProgress); trackBy: trackByTaskId" 
                   class="task-card mb-3" cdkDrag>
                <mat-card class="hover:shadow-lg transition-shadow cursor-pointer">
                  <mat-card-content class="p-4">
                    <div class="flex justify-between items-start mb-2">
                      <h3 class="text-lg font-medium text-gray-800 line-clamp-2">{{ task.title }}</h3>
                      <button mat-icon-button [matMenuTriggerFor]="taskMenu" (click)="setSelectedTask(task)">
                        <mat-icon class="text-gray-500">more_vert</mat-icon>
                      </button>
                    </div>
                    
                    <p class="text-gray-600 text-sm mb-3 line-clamp-3">{{ task.description }}</p>
                    
                    <div class="flex justify-between items-center">
                      <span [ngClass]="getPriorityClass(task.priority)" 
                            class="px-2 py-1 rounded-full text-xs font-medium">
                        {{ getPriorityText(task.priority) }}
                      </span>
                      <span class="text-xs text-gray-500">
                        {{ formatDate(task.dueDate) }}
                      </span>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </div>

          <!-- Columna Completado -->
          <div class="kanban-column">
            <div class="column-header bg-green-100 border-l-4 border-green-500 p-4 rounded-lg">
              <div class="flex justify-between items-center">
                <h2 class="text-lg font-semibold text-green-700">Completado</h2>
                <span class="bg-green-500 text-white px-2 py-1 rounded-full text-sm">
                  {{ getTasksByStatus(TaskStatus.Completed).length }}
                </span>
              </div>
              <button mat-button (click)="openTaskDialog(TaskStatus.Completed)" 
                      class="w-full mt-3 bg-green-500 text-white hover:bg-green-600 transition-colors">
                <mat-icon>add</mat-icon> Agregar Tarea
              </button>
            </div>
            
            <div class="tasks-container mt-4 min-h-72" 
                 cdkDropList [cdkDropListData]="getTasksByStatus(TaskStatus.Completed)"
                 cdkDropListConnectedTo="['pending-list', 'in-progress-list']" 
                 id="completed-list"
                 (cdkDropListDropped)="onTaskDrop($event)">
              
              <div *ngFor="let task of getTasksByStatus(TaskStatus.Completed); trackBy: trackByTaskId" 
                   class="task-card mb-3" cdkDrag>
                <mat-card class="hover:shadow-lg transition-shadow cursor-pointer">
                  <mat-card-content class="p-4">
                    <div class="flex justify-between items-start mb-2">
                      <h3 class="text-lg font-medium text-gray-800 line-clamp-2">{{ task.title }}</h3>
                      <button mat-icon-button [matMenuTriggerFor]="taskMenu" (click)="setSelectedTask(task)">
                        <mat-icon class="text-gray-500">more_vert</mat-icon>
                      </button>
                    </div>
                    
                    <p class="text-gray-600 text-sm mb-3 line-clamp-3">{{ task.description }}</p>
                    
                    <div class="flex justify-between items-center">
                      <span [ngClass]="getPriorityClass(task.priority)" 
                            class="px-2 py-1 rounded-full text-xs font-medium">
                        {{ getPriorityText(task.priority) }}
                      </span>
                      <span class="text-xs text-gray-500">
                        {{ formatDate(task.dueDate) }}
                      </span>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Template de carga -->
      <ng-template #loadingTemplate>
        <div class="flex justify-center items-center h-96">
          <mat-spinner></mat-spinner>
        </div>
      </ng-template>

      <!-- Menú del usuario -->
      <mat-menu #userMenu="matMenu">
        <div class="px-4 py-2 border-b">
          <p class="text-sm text-gray-600">{{ currentUser?.name }}</p>
          <p class="text-xs text-gray-500">{{ currentUser?.email }}</p>
        </div>
        <button mat-menu-item (click)="logout()">
          <mat-icon>logout</mat-icon>
          Cerrar Sesión
        </button>
      </mat-menu>

      <!-- Menú de tarea -->
      <mat-menu #taskMenu="matMenu">
        <button mat-menu-item (click)="editTask()">
          <mat-icon>edit</mat-icon>
          Editar
        </button>
        <button mat-menu-item (click)="deleteTask()" class="text-red-600">
          <mat-icon>delete</mat-icon>
          Eliminar
        </button>
      </mat-menu>
    </div>
  `,
  styles: [`
    .board-container {
      height: 100vh;
      overflow: hidden;
    }

    .kanban-column {
      min-width: 320px;
      max-width: 320px;
    }

    .column-header {
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .task-card {
      transition: all 0.3s ease;
    }

    .task-card:hover {
      transform: translateY(-2px);
    }

    .line-clamp-2 {
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }

    .line-clamp-3 {
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
    }

    .cdk-drag-preview {
      box-sizing: border-box;
      border-radius: 4px;
      box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
                  0 8px 10px 1px rgba(0, 0, 0, 0.14),
                  0 3px 14px 2px rgba(0, 0, 0, 0.12);
    }

    .cdk-drag-placeholder {
      opacity: 0;
    }

    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    .tasks-container.cdk-drop-list-dragging .task-card:not(.cdk-drag-placeholder) {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
  `]
})
export class BoardDetailComponent implements OnInit {
  // Servicios inyectados
  private boardService = inject(BoardService);
  private taskService = inject(TaskService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  // Propiedades del componente
  board: Board | null = null;
  tasks: Task[] = [];
  currentUser: User | null = null;
  loading = true;
  selectedTask: Task | null = null;

  // Enum references para el template
  TaskStatus = TaskStatus;
  TaskPriority = TaskPriority;

  async ngOnInit() {
    try {
      // Obtener el usuario actual
      this.currentUser = await this.authService.getCurrentUser();
      
      // Obtener el ID del tablero desde la ruta
      const boardId = this.route.snapshot.params['id'];
      if (!boardId) {
        this.showError('ID del tablero no válido');
        this.goBack();
        return;
      }

      // Cargar el tablero y sus tareas
      await this.loadBoard(boardId);
      await this.loadTasks(boardId);
    } catch (error) {
      console.error('Error al inicializar el componente:', error);
      this.showError('Error al cargar el tablero');
    } finally {
      this.loading = false;
    }
  }

  /**
   * Carga los datos del tablero
   */
  private async loadBoard(boardId: string): Promise<void> {
    try {
      this.board = await this.boardService.getBoardById(boardId);
    } catch (error) {
      console.error('Error al cargar el tablero:', error);
      throw error;
    }
  }

  /**
   * Carga las tareas del tablero
   */
  private async loadTasks(boardId: string): Promise<void> {
    try {
      this.tasks = await this.taskService.getTasksByBoardId(boardId);
    } catch (error) {
      console.error('Error al cargar las tareas:', error);
      throw error;
    }
  }

  /**
   * Obtiene las tareas filtradas por estado
   */
  getTasksByStatus(status: TaskStatus): Task[] {
    return this.tasks.filter(task => task.status === status);
  }

  /**
   * Maneja el evento de drag and drop de tareas
   */
  async onTaskDrop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      // Mover dentro de la misma columna
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Mover entre columnas diferentes
      const task = event.previousContainer.data[event.previousIndex];
      const newStatus = this.getStatusFromContainerId(event.container.id);
      
      if (newStatus) {
        try {
          // Actualizar el estado de la tarea en el backend
          const updatedTask: Partial<Task> = {
            ...task,
            status: newStatus
          };
          
          await this.taskService.updateTask(task.id!, updatedTask);
          
          // Actualizar la lista local
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
          
          // Actualizar la tarea en la lista local
          const taskIndex = this.tasks.findIndex(t => t.id === task.id);
          if (taskIndex !== -1) {
            this.tasks[taskIndex].status = newStatus;
          }
          
          this.showSuccess('Tarea movida correctamente');
        } catch (error) {
          console.error('Error al actualizar el estado de la tarea:', error);
          this.showError('Error al mover la tarea');
        }
      }
    }
  }

  /**
   * Obtiene el estado basado en el ID del contenedor
   */
  private getStatusFromContainerId(containerId: string): TaskStatus | null {
    switch (containerId) {
      case 'pending-list':
        return TaskStatus.Pending;
      case 'in-progress-list':
        return TaskStatus.InProgress;
      case 'completed-list':
        return TaskStatus.Completed;
      default:
        return null;
    }
  }

  /**
   * Abre el diálogo para crear/editar una tarea
   */
  openTaskDialog(status: TaskStatus = TaskStatus.Pending, task?: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '600px',
      data: {
        task: task || null,
        boardId: this.board?.id,
        defaultStatus: status
      }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.loadTasks(this.board!.id!);
      }
    });
  }

  /**
   * Establece la tarea seleccionada
   */
  setSelectedTask(task: Task): void {
    this.selectedTask = task;
  }

  /**
   * Edita la tarea seleccionada
   */
  editTask(): void {
    if (this.selectedTask) {
      this.openTaskDialog(this.selectedTask.status, this.selectedTask);
    }
  }

  /**
   * Elimina la tarea seleccionada
   */
  async deleteTask(): Promise<void> {
    if (this.selectedTask && confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      try {
        await this.taskService.deleteTask(this.selectedTask.id!);
        this.tasks = this.tasks.filter(t => t.id !== this.selectedTask!.id);
        this.showSuccess('Tarea eliminada correctamente');
      } catch (error) {
        console.error('Error al eliminar la tarea:', error);
        this.showError('Error al eliminar la tarea');
      }
    }
  }

  /**
   * Obtiene la clase CSS para la prioridad
   */
  getPriorityClass(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.Low:
        return 'bg-green-100 text-green-800';
      case TaskPriority.Medium:
        return 'bg-yellow-100 text-yellow-800';
      case TaskPriority.High:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Obtiene el texto de la prioridad
   */
  getPriorityText(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.Low:
        return 'Baja';
      case TaskPriority.Medium:
        return 'Media';
      case TaskPriority.High:
        return 'Alta';
      default:
        return 'Sin definir';
    }
  }

  /**
   * Formatea una fecha
   */
  formatDate(date: Date | string | null | undefined): string {
    if (!date) return 'Sin fecha';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  /**
   * Función de tracking para ngFor
   */
  trackByTaskId(index: number, task: Task): string {
    return task.id || index.toString();
  }

  /**
   * Regresa al dashboard
   */
  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  /**
   * Cierra sesión del usuario
   */
  async logout(): Promise<void> {
    try {
      await this.authService.logout();
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      this.showError('Error al cerrar sesión');
    }
  }

  /**
   * Muestra un mensaje de éxito
   */
  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  /**
   * Muestra un mensaje de error
   */
  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}
