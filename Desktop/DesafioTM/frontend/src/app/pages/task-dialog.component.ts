import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Task, TaskStatus, TaskPriority } from '../interfaces/task.interface';
import { TaskService } from '../services/task.service';

interface DialogData {
  task: Task | null;
  boardId: string;
  defaultStatus: TaskStatus;
}

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule
  ],
  template: `
    <div class="task-dialog">
      <h2 mat-dialog-title class="text-xl font-semibold mb-4">
        {{ data.task ? 'Editar Tarea' : 'Nueva Tarea' }}
      </h2>

      <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="space-y-4">
        <mat-dialog-content class="space-y-4 min-w-96">
          <!-- Título -->
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Título</mat-label>
            <input matInput formControlName="title" placeholder="Ingresa el título de la tarea">
            <mat-error *ngIf="taskForm.get('title')?.hasError('required')">
              El título es obligatorio
            </mat-error>
            <mat-error *ngIf="taskForm.get('title')?.hasError('maxlength')">
              El título no puede tener más de 100 caracteres
            </mat-error>
          </mat-form-field>

          <!-- Descripción -->
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Descripción</mat-label>
            <textarea matInput formControlName="description" 
                      placeholder="Describe los detalles de la tarea" 
                      rows="3"></textarea>
            <mat-error *ngIf="taskForm.get('description')?.hasError('maxlength')">
              La descripción no puede tener más de 500 caracteres
            </mat-error>
          </mat-form-field>

          <!-- Estado -->
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Estado</mat-label>
            <mat-select formControlName="status">
              <mat-option [value]="TaskStatus.Pending">Pendiente</mat-option>
              <mat-option [value]="TaskStatus.InProgress">En Progreso</mat-option>
              <mat-option [value]="TaskStatus.Completed">Completado</mat-option>
            </mat-select>
          </mat-form-field>

          <!-- Prioridad -->
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Prioridad</mat-label>
            <mat-select formControlName="priority">
              <mat-option [value]="TaskPriority.Low">Baja</mat-option>
              <mat-option [value]="TaskPriority.Medium">Media</mat-option>
              <mat-option [value]="TaskPriority.High">Alta</mat-option>
            </mat-select>
          </mat-form-field>

          <!-- Fecha de vencimiento -->
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Fecha de vencimiento</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="dueDate">
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
        </mat-dialog-content>

        <mat-dialog-actions align="end" class="gap-2 pt-4">
          <button mat-button type="button" (click)="onCancel()">
            Cancelar
          </button>
          <button mat-raised-button color="primary" type="submit" 
                  [disabled]="taskForm.invalid || loading" class="px-6">
            {{ loading ? 'Guardando...' : (data.task ? 'Actualizar' : 'Crear') }}
          </button>
        </mat-dialog-actions>
      </form>
    </div>
  `,
  styles: [`
    .task-dialog {
      padding: 20px;
      max-width: 600px;
    }

    ::ng-deep .mat-mdc-dialog-content {
      max-height: 70vh;
    }
  `]
})
export class TaskDialogComponent implements OnInit {
  taskForm: FormGroup;
  loading = false;

  // Referencias a los enums para el template
  TaskStatus = TaskStatus;
  TaskPriority = TaskPriority;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    // Inicializar el formulario
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      status: [data.defaultStatus || TaskStatus.Pending, [Validators.required]],
      priority: [TaskPriority.Medium, [Validators.required]],
      dueDate: [null]
    });
  }

  ngOnInit(): void {
    // Si estamos editando una tarea existente, cargar sus datos
    if (this.data.task) {
      this.loadTaskData();
    }
  }

  /**
   * Carga los datos de la tarea en el formulario
   */
  private loadTaskData(): void {
    if (this.data.task) {
      this.taskForm.patchValue({
        title: this.data.task.title,
        description: this.data.task.description || '',
        status: this.data.task.status,
        priority: this.data.task.priority,
        dueDate: this.data.task.dueDate ? new Date(this.data.task.dueDate) : null
      });
    }
  }

  /**
   * Maneja el envío del formulario
   */
  async onSubmit(): Promise<void> {
    if (this.taskForm.valid && !this.loading) {
      this.loading = true;

      try {
        const taskData = this.prepareTaskData();

        if (this.data.task?.id) {
          // Actualizar tarea existente
          await this.updateTask(taskData);
        } else {
          // Crear nueva tarea
          await this.createTask(taskData);
        }

        this.dialogRef.close(true);
        this.showSuccess(
          this.data.task ? 'Tarea actualizada correctamente' : 'Tarea creada correctamente'
        );
      } catch (error) {
        console.error('Error al guardar la tarea:', error);
        this.showError('Error al guardar la tarea. Por favor, intenta de nuevo.');
      } finally {
        this.loading = false;
      }
    }
  }

  /**
   * Prepara los datos de la tarea para enviar al backend
   */
  private prepareTaskData(): Partial<Task> {
    const formValue = this.taskForm.value;
    
    return {
      title: formValue.title?.trim(),
      description: formValue.description?.trim() || undefined,
      status: formValue.status,
      priority: formValue.priority,
      dueDate: formValue.dueDate || undefined,
      boardId: this.data.boardId
    };
  }

  /**
   * Crea una nueva tarea
   */
  private async createTask(taskData: Partial<Task>): Promise<void> {
    await this.taskService.createTask(taskData as Omit<Task, 'id'>);
  }

  /**
   * Actualiza una tarea existente
   */
  private async updateTask(taskData: Partial<Task>): Promise<void> {
    if (this.data.task?.id) {
      await this.taskService.updateTask(this.data.task.id, taskData);
    }
  }

  /**
   * Cierra el diálogo sin guardar
   */
  onCancel(): void {
    this.dialogRef.close(false);
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
