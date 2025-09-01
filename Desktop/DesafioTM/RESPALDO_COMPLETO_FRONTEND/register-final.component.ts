import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';
import { RegisterData } from '../interfaces/user.interface';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-register',
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
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      
      <!-- Contenedor principal del formulario -->
      <div class="w-full max-w-md">
        
        <!-- Header con logo y título -->
        <div class="text-center mb-8">
          <div class="logo-container mx-auto mb-4">
            <div class="logo-icon-modern">
              <span class="logo-text">SWO</span>
            </div>
          </div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            TaskManagerSWO
          </h1>
          <p class="text-gray-600 mt-2">Crea tu cuenta profesional</p>
        </div>

        <!-- Card del formulario -->
        <mat-card class="register-card">
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
            
            <!-- Campo de nombre completo -->
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Nombre completo</mat-label>
              <input 
                matInput 
                formControlName="fullName" 
                placeholder="Ingresa tu nombre completo"
                autocomplete="name">
              <mat-icon matSuffix>person</mat-icon>
              
              <!-- Mensajes de error -->
              <mat-error *ngIf="registerForm.get('fullName')?.hasError('required')">
                El nombre es requerido
              </mat-error>
              <mat-error *ngIf="registerForm.get('fullName')?.hasError('minlength')">
                Debe tener al menos 2 caracteres
              </mat-error>
            </mat-form-field>

            <!-- Campo de email -->
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Correo electrónico</mat-label>
              <input 
                matInput 
                formControlName="email" 
                placeholder="tu@email.com"
                autocomplete="email">
              <mat-icon matSuffix>email</mat-icon>
              
              <!-- Mensajes de error -->
              <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
                El email es requerido
              </mat-error>
              <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
                Ingresa un email válido
              </mat-error>
            </mat-form-field>

            <!-- Campo de nombre de usuario -->
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Nombre de usuario</mat-label>
              <input 
                matInput 
                formControlName="username" 
                placeholder="Elige un nombre de usuario"
                autocomplete="username">
              <mat-icon matSuffix>account_circle</mat-icon>
              
              <!-- Mensajes de error -->
              <mat-error *ngIf="registerForm.get('username')?.hasError('required')">
                El nombre de usuario es requerido
              </mat-error>
              <mat-error *ngIf="registerForm.get('username')?.hasError('minlength')">
                Debe tener al menos 3 caracteres
              </mat-error>
            </mat-form-field>

            <!-- Campo de contraseña -->
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Contraseña</mat-label>
              <input 
                matInput 
                [type]="hidePassword ? 'password' : 'text'"
                formControlName="password" 
                placeholder="Mínimo 6 caracteres"
                autocomplete="new-password">
              <mat-icon 
                matSuffix 
                (click)="hidePassword = !hidePassword" 
                class="cursor-pointer">
                {{hidePassword ? 'visibility_off' : 'visibility'}}
              </mat-icon>
              
              <!-- Mensajes de error -->
              <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
                La contraseña es requerida
              </mat-error>
              <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
                La contraseña debe tener al menos 6 caracteres
              </mat-error>
            </mat-form-field>

            <!-- Campo de confirmar contraseña -->
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Confirmar contraseña</mat-label>
              <input 
                matInput 
                [type]="hideConfirmPassword ? 'password' : 'text'"
                formControlName="confirmPassword" 
                placeholder="Repite tu contraseña"
                autocomplete="new-password">
              <mat-icon 
                matSuffix 
                (click)="hideConfirmPassword = !hideConfirmPassword" 
                class="cursor-pointer">
                {{hideConfirmPassword ? 'visibility_off' : 'visibility'}}
              </mat-icon>
              
              <!-- Mensajes de error -->
              <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('required')">
                Confirma tu contraseña
              </mat-error>
              <mat-error *ngIf="registerForm.hasError('passwordMismatch') && registerForm.get('confirmPassword')?.touched">
                Las contraseñas no coinciden
              </mat-error>
            </mat-form-field>

            <!-- Mensaje de error general -->
            <div *ngIf="errorMessage" class="error-message">
              <mat-icon class="error-icon">error</mat-icon>
              {{ errorMessage }}
            </div>

            <!-- Botón de registro -->
            <button 
              mat-flat-button 
              type="submit" 
              [disabled]="registerForm.invalid || isLoading"
              class="register-button">
              
              <!-- Spinner de carga -->
              <mat-spinner 
                *ngIf="isLoading" 
                diameter="20" 
                class="spinner">
              </mat-spinner>
              
              <!-- Texto del botón -->
              <span *ngIf="!isLoading">
                <mat-icon class="button-icon">person_add</mat-icon>
                Crear cuenta
              </span>
              <span *ngIf="isLoading">Creando cuenta...</span>
            </button>

            <!-- Enlaces adicionales -->
            <div class="form-links">
              <p class="link-text">
                ¿Ya tienes una cuenta? 
                <a routerLink="/login" class="login-link">
                  Inicia sesión aquí
                </a>
              </p>
              <p>
                <a routerLink="/" class="back-link">
                  ← Volver al inicio
                </a>
              </p>
            </div>
          </form>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    /* Contenedor principal */
    .min-h-screen {
      min-height: 100vh;
      background: linear-gradient(135deg, #f0f8ff 0%, #e6f0ff 25%, #f5f0ff 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }
    
    /* Logo moderno con gradiente */
    .logo-container {
      width: 64px;
      height: 64px;
    }
    
    .logo-icon-modern {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #0079bf 0%, #026aa7 50%, #FFD700 100%);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 32px rgba(0, 121, 191, 0.3);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    
    .logo-icon-modern::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%);
      border-radius: 16px;
    }
    
    .logo-icon-modern:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(0, 121, 191, 0.4);
    }
    
    .logo-text {
      font-size: 24px;
      font-weight: 900;
      color: white;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      z-index: 1;
      position: relative;
    }
    
    /* Título */
    h1 {
      font-size: 3rem;
      font-weight: bold;
      background: linear-gradient(to right, #2563eb, #4f46e5);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-align: center;
      margin-bottom: 0.5rem;
    }
    
    /* Card del formulario */
    .register-card {
      padding: 2rem;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }
    
    /* Formulario */
    .register-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    /* Campos de formulario */
    .form-field {
      width: 100% !important;
    }
    
    .form-field .mat-mdc-form-field-flex {
      width: 100% !important;
    }
    
    .form-field .mat-mdc-text-field-wrapper {
      width: 100% !important;
    }
    
    /* Mensaje de error */
    .error-message {
      color: #dc2626;
      font-size: 0.875rem;
      text-align: center;
      padding: 0.75rem;
      background: #fef2f2;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    
    .error-icon {
      font-size: 1rem !important;
      width: 1rem !important;
      height: 1rem !important;
    }
    
    /* Botón de registro */
    .register-button {
      width: 100% !important;
      background: #2563eb !important;
      color: white !important;
      padding: 0.75rem 1.5rem !important;
      font-size: 1.125rem !important;
      font-weight: 600 !important;
      border-radius: 8px !important;
      min-height: 48px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 0.5rem !important;
      transition: all 0.3s ease !important;
    }
    
    .register-button:hover {
      background: #1d4ed8 !important;
    }
    
    .register-button:disabled {
      background: #9ca3af !important;
      cursor: not-allowed !important;
    }
    
    .button-icon {
      font-size: 1.25rem !important;
      width: 1.25rem !important;
      height: 1.25rem !important;
    }
    
    .spinner {
      margin-right: 0.5rem;
      display: inline-block;
    }
    
    /* Enlaces del formulario */
    .form-links {
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .link-text {
      color: #6b7280;
    }
    
    .login-link {
      color: #2563eb;
      font-weight: 600;
      text-decoration: none;
      transition: color 0.3s ease;
    }
    
    .login-link:hover {
      color: #1d4ed8;
    }
    
    .back-link {
      color: #6b7280;
      font-size: 0.875rem;
      text-decoration: none;
      transition: color 0.3s ease;
    }
    
    .back-link:hover {
      color: #374151;
    }
    
    /* Estilos personalizados para el formulario */
    .mat-mdc-form-field {
      width: 100% !important;
    }
    
    /* Animaciones suaves */
    button, .mat-mdc-form-field {
      transition: all 0.3s ease;
    }
    
    /* Cursor pointer para iconos clickeables */
    .cursor-pointer {
      cursor: pointer;
    }
    
    /* Responsivo */
    @media (max-width: 640px) {
      h1 {
        font-size: 2rem;
      }
      
      .register-card {
        padding: 1.5rem;
        margin: 0.5rem;
      }
    }
  `]
})
export class RegisterComponent implements OnInit {
  // Formulario reactivo para el registro
  registerForm: FormGroup;
  
  // Estados del componente
  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // Inicializar el formulario con validaciones
    this.registerForm = this.fb.group({
      fullName: ['', [
        Validators.required,
        Validators.minLength(2)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      username: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      confirmPassword: ['', [
        Validators.required
      ]]
    }, { validators: passwordMatchValidator });
  }

  ngOnInit(): void {
    // Si el usuario ya está autenticado, redirigir al dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  /**
   * Maneja el envío del formulario de registro
   * Valida los datos y llama al servicio de autenticación
   */
  async onSubmit(): Promise<void> {
    if (this.registerForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';

      try {
        // Obtener los datos del formulario
        const formValue = this.registerForm.value;
        const registerData: RegisterData = {
          fullName: formValue.fullName,
          email: formValue.email,
          username: formValue.username,
          password: formValue.password
        };

        // Llamar al servicio de registro
        const response = await this.authService.register(registerData).toPromise();
        
        if (response && response.user) {
          this.snackBar.open(`¡Bienvenido ${response.user.fullName}!`, 'Cerrar', {
            duration: 5000,
            panelClass: ['success-snackbar']
          });

          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Error al crear la cuenta';
        }
      } catch (error: any) {
        console.error('Error en registro:', error);
        
        if (error.status === 400) {
          this.errorMessage = error.error?.message || 'Datos inválidos. Verifica la información ingresada.';
        } else if (error.status === 409) {
          this.errorMessage = 'El email o username ya está en uso.';
        } else if (error.status === 0) {
          this.errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
        } else {
          this.errorMessage = 'Error inesperado. Inténtalo de nuevo.';
        }

        this.snackBar.open(this.errorMessage, 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      } finally {
        this.isLoading = false;
      }
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      this.registerForm.markAllAsTouched();
    }
  }

  /**
   * Limpia el mensaje de error cuando el usuario empieza a escribir
   */
  clearError(): void {
    this.errorMessage = '';
  }
}
