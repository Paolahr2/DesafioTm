import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-create-board-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSlideToggleModule
  ],
  template: `
    <h2 mat-dialog-title>Crear Nuevo Tablero</h2>

    <mat-dialog-content>
      <form [formGroup]="boardForm" class="create-board-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Título del Tablero</mat-label>
          <input matInput formControlName="title" placeholder="Ej: Proyecto Web">
          <mat-error *ngIf="boardForm.get('title')?.hasError('required')">
            El título es requerido
          </mat-error>
          <mat-error *ngIf="boardForm.get('title')?.hasError('maxlength')">
            Máximo 100 caracteres
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Descripción (opcional)</mat-label>
          <textarea matInput formControlName="description"
                    placeholder="Describe el propósito de este tablero..."
                    rows="3"></textarea>
          <mat-error *ngIf="boardForm.get('description')?.hasError('maxlength')">
            Máximo 500 caracteres
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Color del Tablero</mat-label>
          <mat-select formControlName="color">
            <mat-option value="#3B82F6">Azul</mat-option>
            <mat-option value="#10B981">Verde</mat-option>
            <mat-option value="#F59E0B">Amarillo</mat-option>
            <mat-option value="#EF4444">Rojo</mat-option>
            <mat-option value="#8B5CF6">Morado</mat-option>
            <mat-option value="#F97316">Naranja</mat-option>
          </mat-select>
        </mat-form-field>

        <div class="toggle-section">
          <mat-slide-toggle formControlName="isPublic">
            Tablero Público
          </mat-slide-toggle>
          <p class="toggle-description">
            Los tableros públicos pueden ser vistos por otros usuarios
          </p>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary"
              [disabled]="boardForm.invalid"
              (click)="onSubmit()">
        Crear Tablero
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .create-board-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 400px;
    }

    .full-width {
      width: 100%;
    }

    .toggle-section {
      margin-top: 8px;
    }

    .toggle-description {
      font-size: 0.875rem;
      color: rgba(0, 0, 0, 0.6);
      margin: 8px 0 0 0;
    }

    mat-dialog-actions {
      padding: 16px 0 0 0;
    }
  `]
})
export class CreateBoardDialogComponent {
  boardForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateBoardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.boardForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      color: ['#3B82F6'],
      isPublic: [false]
    });
  }

  onSubmit() {
    if (this.boardForm.valid) {
      this.dialogRef.close(this.boardForm.value);
    }
  }
}
