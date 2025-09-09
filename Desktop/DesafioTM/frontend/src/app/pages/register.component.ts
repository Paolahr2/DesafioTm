import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <div class="auth-container" style="max-width:480px;margin:3rem auto;padding:1rem;">
      <h2>Crear cuenta</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Nombre completo</mat-label>
          <input matInput formControlName="fullName" />
        </mat-form-field>

        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Correo</mat-label>
          <input matInput formControlName="email" />
        </mat-form-field>

        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Usuario</mat-label>
          <input matInput formControlName="username" />
        </mat-form-field>

        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Contraseña</mat-label>
          <input matInput type="password" formControlName="password" />
        </mat-form-field>

        <div *ngIf="error" style="color:#b00020;margin-bottom:8px">{{error}}</div>

        <button mat-flat-button color="primary" style="width:100%" [disabled]="loading">{{ loading ? 'Creando...' : 'Crear cuenta' }}</button>
      </form>

      <p style="margin-top:12px;text-align:center">¿Ya tienes cuenta? <a routerLink="/login">Inicia sesión</a></p>
    </div>
  `
})
export class RegisterComponent {
  form: FormGroup;
  loading = false;
  error = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.error = 'Completa los campos requeridos correctamente';
      return;
    }

    this.loading = true;
    this.error = '';

    this.auth.register(this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || err?.message || 'Error al registrar';
      }
    });
  }
}
