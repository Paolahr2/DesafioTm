import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';
import { LoginCredentials } from '../interfaces/user.interface';

/**
 * Componente de inicio de sesión
 * Permite a los usuarios autenticarse con email/username y contraseña
 * Se conecta directamente con el backend para validar credenciales
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="auth-container">
      <!-- Fondo animado -->
      <div class="animated-background">
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
        <div class="floating-shape shape-3"></div>
        <div class="floating-shape shape-4"></div>
      </div>

      <!-- Contenedor principal -->
      <div class="auth-content">
        
        <!-- Sección de branding -->
        <div class="brand-section">
          <div class="logo-container">
            <div class="logo-circle">
              <span class="logo-letters">SWO</span>
            </div>
          </div>
          <h1 class="brand-title">TaskManagerSWO</h1>
          <p class="brand-subtitle">Bienvenido de nuevo</p>
        </div>

        <!-- Card del formulario -->
        <div class="form-card">
          <div class="form-header">
            <h2>Iniciar Sesión</h2>
            <p>Ingresa tus credenciales para acceder</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
            
            <!-- Campo de email/username -->
            <mat-form-field appearance="outline" class="custom-field">
              <mat-label>Email o Usuario</mat-label>
              <input 
                matInput 
                formControlName="emailOrUsername" 
                placeholder="tu@email.com o username">
              <mat-icon matSuffix class="field-icon">person</mat-icon>
              
              <mat-error *ngIf="loginForm.get('emailOrUsername')?.hasError('required')">
                Este campo es requerido
              </mat-error>
              <mat-error *ngIf="loginForm.get('emailOrUsername')?.hasError('minlength')">
                Mínimo 3 caracteres
              </mat-error>
            </mat-form-field>

            <!-- Campo de contraseña -->
            <mat-form-field appearance="outline" class="custom-field">
              <mat-label>Contraseña</mat-label>
              <input 
                matInput 
                [type]="hidePassword ? 'password' : 'text'"
                formControlName="password" 
                placeholder="Tu contraseña">
              <mat-icon 
                matSuffix 
                class="field-icon clickable" 
                (click)="hidePassword = !hidePassword">
                {{hidePassword ? 'visibility_off' : 'visibility'}}
              </mat-icon>
              
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                La contraseña es requerida
              </mat-error>
              <mat-error *ngIf="loginForm.get('password')?.hasError('minlength')">
                Mínimo 6 caracteres
              </mat-error>
            </mat-form-field>

            <!-- Mensaje de error -->
            <div *ngIf="errorMessage" class="error-alert">
              <mat-icon>error_outline</mat-icon>
              <span>{{ errorMessage }}</span>
            </div>

            <!-- Botón de envío -->
            <button 
              mat-flat-button 
              type="submit" 
              class="submit-btn"
              [disabled]="loginForm.invalid || isLoading">
              
              <mat-spinner *ngIf="isLoading" diameter="20" class="btn-spinner"></mat-spinner>
              <mat-icon *ngIf="!isLoading" class="btn-icon">login</mat-icon>
              <span>{{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}</span>
            </button>

            <!-- Enlaces -->
            <div class="form-footer">
              <p class="switch-text">
                ¿No tienes cuenta?
                <a routerLink="/register" class="switch-link">Regístrate aquí</a>
              </p>
              <a routerLink="/" class="back-link">
                <mat-icon>arrow_back</mat-icon>
                Volver al inicio
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      overflow: hidden;
    }

    /* Contenedor principal con fondo animado */
    .auth-container {
      position: relative;
      width: 100%;
      height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    /* Fondo animado */
    .animated-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .floating-shape {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      animation: float 20s infinite linear;
    }

    .shape-1 {
      width: 80px;
      height: 80px;
      top: 20%;
      left: 10%;
      animation-delay: 0s;
    }

    .shape-2 {
      width: 60px;
      height: 60px;
      top: 60%;
      right: 15%;
      animation-delay: 5s;
    }

    .shape-3 {
      width: 100px;
      height: 100px;
      bottom: 30%;
      left: 20%;
      animation-delay: 10s;
    }

    .shape-4 {
      width: 120px;
      height: 120px;
      top: 10%;
      right: 30%;
      animation-delay: 15s;
    }

    @keyframes float {
      0% {
        transform: translateY(0) rotate(0deg);
        opacity: 0.7;
      }
      50% {
        transform: translateY(-100px) rotate(180deg);
        opacity: 0.3;
      }
      100% {
        transform: translateY(0) rotate(360deg);
        opacity: 0.7;
      }
    }

    /* Contenido principal */
    .auth-content {
      position: relative;
      z-index: 10;
      width: 100%;
      max-width: 900px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      padding: 2rem;
      align-items: center;
    }

    /* Sección de branding */
    .brand-section {
      text-align: center;
      color: white;
    }

    .logo-container {
      margin-bottom: 2rem;
    }

    .logo-circle {
      width: 120px;
      height: 120px;
      background: linear-gradient(135deg, #ff6b6b, #feca57);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
      animation: pulse 3s ease-in-out infinite;
    }

    .logo-letters {
      font-size: 36px;
      font-weight: 900;
      color: white;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
    }

    .brand-title {
      font-size: 48px;
      font-weight: 700;
      margin-bottom: 1rem;
      background: linear-gradient(45deg, #fff, #e3f2fd);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .brand-subtitle {
      font-size: 18px;
      opacity: 0.9;
      font-weight: 300;
    }

    /* Card del formulario */
    .form-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 3rem;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .form-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .form-header h2 {
      font-size: 32px;
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 0.5rem;
    }

    .form-header p {
      color: #718096;
      font-size: 16px;
    }

    /* Formulario */
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    /* Campos personalizados */
    .custom-field {
      width: 100% !important;
    }

    .custom-field .mat-mdc-form-field-flex {
      background: rgba(247, 250, 252, 0.8);
      border-radius: 12px !important;
      border: 2px solid transparent;
      transition: all 0.3s ease;
    }

    .custom-field.mat-focused .mat-mdc-form-field-flex {
      background: white;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .field-icon {
      color: #667eea !important;
    }

    .clickable {
      cursor: pointer;
      transition: color 0.3s ease;
    }

    .clickable:hover {
      color: #764ba2 !important;
    }

    /* Alert de error */
    .error-alert {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
      color: white;
      border-radius: 12px;
      font-weight: 500;
      animation: shake 0.5s ease-in-out;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }

    /* Botón de envío */
    .submit-btn {
      width: 100% !important;
      height: 56px !important;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      color: white !important;
      border-radius: 16px !important;
      font-size: 16px !important;
      font-weight: 600 !important;
      text-transform: none !important;
      box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4) !important;
      transition: all 0.3s ease !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 0.5rem !important;
    }

    .submit-btn:hover:not([disabled]) {
      transform: translateY(-2px) !important;
      box-shadow: 0 12px 32px rgba(102, 126, 234, 0.6) !important;
    }

    .submit-btn:disabled {
      opacity: 0.6 !important;
      cursor: not-allowed !important;
    }

    .btn-spinner {
      width: 20px !important;
      height: 20px !important;
    }

    .btn-icon {
      font-size: 20px !important;
    }

    /* Footer del formulario */
    .form-footer {
      text-align: center;
      padding-top: 1rem;
      border-top: 1px solid #e2e8f0;
    }

    .switch-text {
      color: #718096;
      margin-bottom: 1rem;
    }

    .switch-link {
      color: #667eea;
      font-weight: 600;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .switch-link:hover {
      color: #764ba2;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #718096;
      text-decoration: none;
      font-size: 14px;
      transition: color 0.3s ease;
    }

    .back-link:hover {
      color: #4a5568;
    }

    /* Responsivo */
    @media (max-width: 768px) {
      .auth-content {
        grid-template-columns: 1fr;
        gap: 2rem;
        padding: 1rem;
      }

      .brand-section {
        order: 2;
      }

      .form-card {
        order: 1;
        padding: 2rem;
      }

      .brand-title {
        font-size: 32px;
      }

      .logo-circle {
        width: 80px;
        height: 80px;
      }

      .logo-letters {
        font-size: 24px;
      }
    }
  `]
})
export class LoginComponent implements OnInit {
  // Formulario reactivo para el login
  loginForm: FormGroup;
  
  // Estados del componente
  hidePassword = true;  // Controla la visibilidad de la contraseña
  isLoading = false;    // Indica si está en proceso de autenticación
  errorMessage = '';    // Mensaje de error a mostrar al usuario

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // Inicializar el formulario con validaciones
    this.loginForm = this.fb.group({
      emailOrUsername: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]]
    });
  }

  ngOnInit(): void {
    // Si el usuario ya está autenticado, redirigir al dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  /**
   * Maneja el envío del formulario de login
   * Valida los datos y llama al servicio de autenticación
   */
  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';

      // Obtener los datos del formulario
      const credentials: LoginCredentials = this.loginForm.value;

      // Llamar al servicio de autenticación
      this.authService.login(credentials).subscribe({
        next: (response) => {
          // Login exitoso
          this.isLoading = false;
          
          // Mostrar mensaje de éxito
          this.snackBar.open('¡Bienvenido de vuelta!', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });

          // Redirigir al dashboard
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          // Manejar errores de autenticación
          this.isLoading = false;
          
          console.error('Error en login:', error);
          
          // Determinar el mensaje de error apropiado
          if (error.status === 401) {
            this.errorMessage = 'Credenciales incorrectas. Verifica tu email/username y contraseña.';
          } else if (error.status === 0) {
            this.errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
          } else {
            this.errorMessage = error.error?.message || 'Error inesperado. Inténtalo de nuevo.';
          }

          // También mostrar el error en un snackbar
          this.snackBar.open(this.errorMessage, 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      this.loginForm.markAllAsTouched();
    }
  }

  /**
   * Limpia el mensaje de error cuando el usuario empieza a escribir
   */
  clearError(): void {
    this.errorMessage = '';
  }
}
/* Forced reload */
