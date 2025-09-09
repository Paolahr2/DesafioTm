import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <div class="auth-container" style="max-width:420px;margin:3rem auto;padding:1rem;">
      <h2>Iniciar sesión</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Usuario o email</mat-label>
          <input matInput formControlName="emailOrUsername" />
        </mat-form-field>

        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Contraseña</mat-label>
          <input matInput type="password" formControlName="password" />
        </mat-form-field>

        <div *ngIf="error" style="color:#b00020;margin-bottom:8px">{{error}}</div>

        <button mat-flat-button color="primary" style="width:100%" [disabled]="loading">{{ loading ? 'Ingresando...' : 'Ingresar' }}</button>
      </form>

      <p style="margin-top:12px;text-align:center">¿No tienes cuenta? <a routerLink="/register">Regístrate</a></p>
    </div>
  `
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  error = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      emailOrUsername: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.error = 'Completa los campos requeridos';
      return;
    }

    this.loading = true;
    this.error = '';

    this.auth.login(this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        try {
          this.error = (err?.error && err.error.message) ? err.error.message : (err?.message || 'Error al iniciar sesión');
        } catch {
          this.error = 'Error al iniciar sesión';
        }
      }
    });
  }
}
