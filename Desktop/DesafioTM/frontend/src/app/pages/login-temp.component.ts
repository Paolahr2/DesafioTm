import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../services/auth.service';
import { LoginData } from '../interfaces/user.interface';

@Component({
  selector: 'app-login-temp',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="ultra-elegant-page">
      <div class="page-background-animation"></div>
      
      <div class="floating-elements">
        <div class="floating-circle circle-1"></div>
        <div class="floating-circle circle-2"></div>
        <div class="floating-circle circle-3"></div>
        <div class="floating-circle circle-4"></div>
        <div class="floating-circle circle-5"></div>
        <div class="floating-circle circle-6"></div>
      </div>

      <div class="content-wrapper">
        <div class="brand-section">
          <div class="brand-logo">
            <div class="logo-icon-modern">
              <div class="tm-logo-landing">
                <div class="logo-text-relief-landing">TM</div>
              </div>
            </div>
          </div>
          <h1 class="brand-title">TaskManager</h1>
          <div class="title-spacing"></div>
          <p class="brand-subtitle">Organiza tu vida profesional</p>
        </div>

        <div class="ultra-modal-container">
          <div class="ultra-modal-card">
            <div class="modal-header-design">
              <div class="header-accent"></div>
              <h2 class="modal-title">Bienvenido</h2>
              <p class="modal-subtitle">Inicia sesión en tu cuenta</p>
            </div>

            <div class="modal-content-area">
              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="premium-form">
                <div class="premium-input-group">
                  <mat-form-field appearance="fill" class="ultra-field">
                    <mat-label>Email o Nombre de Usuario</mat-label>
                    <input
                      matInput
                      type="text"
                      formControlName="emailOrUsername"
                      placeholder="tu@email.com o tu_usuario">
                    <mat-icon matSuffix class="input-icon">account_circle</mat-icon>
                    <mat-error *ngIf="loginForm.get('emailOrUsername')?.hasError('required')">
                      El email o nombre de usuario es obligatorio
                    </mat-error>
                  </mat-form-field>
                </div>

                <div class="premium-input-group">
                  <mat-form-field appearance="fill" class="ultra-field">
                    <mat-label>Contraseña</mat-label>
                    <input
                      matInput
                      [type]="hidePassword ? 'password' : 'text'"
                      formControlName="password"
                      placeholder="Tu contraseña">
                    <button
                      mat-icon-button
                      matSuffix
                      type="button"
                      class="password-toggle-premium"
                      (click)="togglePasswordVisibility()">
                      <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                    </button>
                    <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                      La contraseña es obligatoria
                    </mat-error>
                    <mat-error *ngIf="loginForm.get('password')?.hasError('minlength')">
                      Mínimo 6 caracteres
                    </mat-error>
                  </mat-form-field>
                </div>

                <button
                  mat-raised-button
                  type="submit"
                  class="ultra-login-button"
                  [disabled]="loginForm.invalid || isLoading">
                  <span *ngIf="!isLoading" class="button-content">
                    <mat-icon class="button-icon">login</mat-icon>
                    Iniciar sesión
                  </span>
                  <span *ngIf="isLoading" class="button-content">
                    <mat-icon class="spinning-loader">autorenew</mat-icon>
                    Iniciando sesión...
                  </span>
                </button>

                <div class="forgot-password-section">
                  <a href="#" class="forgot-password-link">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              </form>

              <div class="elegant-separator">
                <div class="separator-line"></div>
                <span class="separator-text">o si no tienes cuenta</span>
                <div class="separator-line"></div>
              </div>

              <div class="register-invitation">
                <p class="invitation-text">¿Nuevo en TaskManager?</p>
                <a routerLink="/register" mat-stroked-button class="premium-register-button">
                  <mat-icon class="register-icon">person_add</mat-icon>
                  Crear cuenta gratuita
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    * {
      box-sizing: border-box;
    }

    .ultra-elegant-page {
      min-height: 100vh;
      width: 100vw;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      overflow-x: hidden;
      overflow-y: auto;
      padding: 20px;
    }

    .page-background-animation {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100vw;
      height: 100vh;
      z-index: -2;
      background: linear-gradient(
        135deg,
        #00bcd4 0%,    /* Cyan */
        #26c6da 12%,   /* Cyan claro */
        #4dd0e1 24%,   /* Cyan medio */
        #81c784 36%,   /* Verde claro */
        #a5d6a7 48%,   /* Verde muy claro */
        #2196f3 60%,   /* Azul */
        #42a5f5 72%,   /* Azul claro */
        #64b5f6 84%,   /* Azul medio */
        #90caf9 100%   /* Azul muy claro */
      );
      background-size: 500% 500%;
      animation: backgroundFlow 15s ease-in-out infinite;
    }

    @keyframes backgroundFlow {
      0% {
        background-position: 0% 50%;
        filter: brightness(1.1) saturate(0.9);
      }
      20% {
        background-position: 100% 25%;
        filter: brightness(1.0) saturate(1.1);
      }
      40% {
        background-position: 75% 75%;
        filter: brightness(1.2) saturate(0.8);
      }
      60% {
        background-position: 25% 100%;
        filter: brightness(0.95) saturate(1.2);
      }
      80% {
        background-position: 50% 25%;
        filter: brightness(1.05) saturate(1.0);
      }
      100% {
        background-position: 0% 50%;
        filter: brightness(1.1) saturate(0.9);
      }
    }

    .floating-elements {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: -1;
    }

    .floating-circle {
      position: absolute;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(129, 212, 250, 0.1), rgba(225, 245, 254, 0.15));
      backdrop-filter: blur(5px);
      animation: floatAround 20s linear infinite;
    }

    .circle-1 {
      width: 80px;
      height: 80px;
      top: 10%;
      left: 10%;
      animation-delay: 0s;
    }

    .circle-2 {
      width: 120px;
      height: 120px;
      top: 20%;
      right: 15%;
      animation-delay: -5s;
    }

    .circle-3 {
      width: 60px;
      height: 60px;
      bottom: 25%;
      left: 20%;
      animation-delay: -10s;
    }

    .circle-4 {
      width: 100px;
      height: 100px;
      bottom: 15%;
      right: 25%;
      animation-delay: -15s;
    }

    .circle-5 {
      width: 90px;
      height: 90px;
      top: 50%;
      left: 5%;
      animation-delay: -8s;
    }

    .circle-6 {
      width: 70px;
      height: 70px;
      top: 70%;
      right: 10%;
      animation-delay: -12s;
    }

    @keyframes floatAround {
      0% {
        transform: translateY(0px) translateX(0px) rotate(0deg);
        opacity: 0.7;
      }
      25% {
        transform: translateY(-20px) translateX(10px) rotate(90deg);
        opacity: 1;
      }
      50% {
        transform: translateY(-5px) translateX(-15px) rotate(180deg);
        opacity: 0.6;
      }
      75% {
        transform: translateY(-15px) translateX(12px) rotate(270deg);
        opacity: 0.9;
      }
      100% {
        transform: translateY(0px) translateX(0px) rotate(360deg);
        opacity: 0.7;
      }
    }

    .content-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      max-width: 1000px;
      z-index: 1;
      position: relative;
    }

    .brand-section {
      text-align: center;
      margin-bottom: 3rem;
      animation: slideInFromTop 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    @keyframes slideInFromTop {
      0% {
        opacity: 0;
        transform: translateY(-50px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .brand-logo {
      display: inline-block;
      padding: 2rem;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
      border-radius: 50%;
      box-shadow: 
        0 10px 40px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      margin-bottom: 2rem;
      transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .brand-logo:hover {
      transform: translateY(-8px) scale(1.05);
      box-shadow: 
        0 15px 50px rgba(0, 0, 0, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
    }

    .logo-icon {
      font-size: 4rem;
      color: #1976d2;
      background: linear-gradient(135deg, #1976d2, #42a5f5);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .brand-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1a237e;
      margin: 0;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #1a237e, #303f9f, #1976d2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-shadow: 0 4px 8px rgba(26, 35, 126, 0.1);
    }

    .title-spacing {
      height: 12px;
    }

    .brand-subtitle {
      font-size: 1.2rem;
      color: #546e7a;
      margin: 0;
      font-weight: 400;
      opacity: 0.8;
    }

    /* Logo moderno del landing page */
    .logo-icon-modern {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
    }

    .tm-logo-landing {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #00bcd4 0%, #2196f3 50%, #4caf50 100%);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 24px rgba(33, 150, 243, 0.4),
                  0 4px 8px rgba(33, 150, 243, 0.2);
      transition: all 0.3s ease;
      position: relative;
      margin: 0 auto;
    }

    .tm-logo-landing:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 32px rgba(33, 150, 243, 0.5),
                  0 6px 16px rgba(33, 150, 243, 0.3);
    }

    .tm-logo-landing::before {
      content: '';
      position: absolute;
      top: 3px;
      left: 3px;
      right: 3px;
      height: 50%;
      background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%);
      border-radius: 13px 13px 6px 6px;
    }

    .logo-text-relief-landing {
      color: white;
      font-size: 1.8rem;
      font-weight: 900;
      letter-spacing: 2px;
      text-align: center;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      text-shadow: 
        0 2px 0 rgba(255, 255, 255, 0.2),
        0 3px 0 rgba(255, 255, 255, 0.1),
        0 4px 0 rgba(0, 0, 0, 0.1),
        0 5px 0 rgba(0, 0, 0, 0.1),
        0 2px 4px rgba(0, 0, 0, 0.3);
      z-index: 1;
      position: relative;
      transition: all 0.3s ease;
    }

    .forgot-password-section {
      text-align: center;
      margin-top: 1rem;
    }

    .forgot-password-link {
      color: #1976d2;
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.3s ease;
    }

    .forgot-password-link:hover {
      color: #1565c0;
      text-decoration: underline;
    }

    .ultra-modal-container {
      width: 100%;
      max-width: 480px;
      animation: modalSlideIn 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s both;
    }

    @keyframes modalSlideIn {
      0% {
        opacity: 0;
        transform: translateY(30px) scale(0.95);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .ultra-modal-card {
      background: linear-gradient(135deg, 
        rgba(255, 255, 255, 0.95) 0%, 
        rgba(255, 255, 255, 0.9) 50%, 
        rgba(248, 250, 252, 0.95) 100%);
      border-radius: 28px;
      box-shadow: 
        0 25px 80px rgba(0, 0, 0, 0.08),
        0 10px 40px rgba(0, 0, 0, 0.06),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(40px);
      border: 1px solid rgba(255, 255, 255, 0.4);
      overflow: hidden;
      position: relative;
      transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .ultra-modal-card:hover {
      transform: translateY(-4px);
      box-shadow: 
        0 30px 90px rgba(0, 0, 0, 0.12),
        0 15px 50px rgba(0, 0, 0, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.95);
    }

    .modal-header-design {
      padding: 2.5rem 3rem 2rem;
      text-align: center;
      position: relative;
    }

    .header-accent {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 5px;
      background: linear-gradient(90deg, #1976d2, #42a5f5, #81d4fa, #1976d2);
      background-size: 300% 100%;
      animation: gradientShift 3s ease-in-out infinite;
    }

    @keyframes gradientShift {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    .modal-title {
      font-size: 2.2rem;
      font-weight: 600;
      color: #1a237e;
      margin: 0 0 0.5rem 0;
      letter-spacing: -0.3px;
    }

    .modal-subtitle {
      font-size: 1.1rem;
      color: #546e7a;
      margin: 0;
      font-weight: 400;
      opacity: 0.8;
    }

    .modal-content-area {
      padding: 0 2rem 1.5rem;
    }

    .premium-form {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .premium-input-group {
      position: relative;
    }

    .ultra-field {
      width: 100%;
      font-size: 1.1rem;
    }

    .ultra-field ::ng-deep .mat-mdc-form-field-flex {
      background: linear-gradient(135deg, 
        rgba(255, 255, 255, 0.8) 0%, 
        rgba(248, 250, 252, 0.9) 100%);
      border-radius: 18px;
      border: 2px solid rgba(25, 118, 210, 0.15);
      transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      backdrop-filter: blur(15px);
    }

    .ultra-field ::ng-deep .mat-mdc-form-field-flex:hover {
      border-color: rgba(25, 118, 210, 0.3);
      background: linear-gradient(135deg, 
        rgba(255, 255, 255, 0.9) 0%, 
        rgba(248, 250, 252, 0.95) 100%);
      box-shadow: 0 6px 20px rgba(25, 118, 210, 0.08);
    }

    .ultra-field ::ng-deep .mat-mdc-form-field-focus-overlay {
      border-radius: 18px;
    }

    .ultra-field ::ng-deep .mat-mdc-form-field.mat-focused .mat-mdc-form-field-flex {
      border-color: #1976d2;
      background: linear-gradient(135deg, 
        rgba(255, 255, 255, 0.95) 0%, 
        rgba(227, 242, 253, 0.8) 100%);
      box-shadow: 
        0 0 0 4px rgba(25, 118, 210, 0.1),
        0 6px 24px rgba(25, 118, 210, 0.15);
    }

    .ultra-field ::ng-deep .mat-mdc-input-element {
      font-size: 1.1rem;
      font-weight: 500;
      color: #263238;
      padding: 0.8rem 1.2rem;
    }

    .ultra-field ::ng-deep .mat-mdc-floating-label {
      font-weight: 500;
      color: #546e7a !important;
    }

    .ultra-field ::ng-deep .mat-mdc-form-field.mat-focused .mat-mdc-floating-label {
      color: #1976d2 !important;
    }

    .input-icon {
      color: #90a4ae;
      transition: color 0.3s ease;
      font-size: 1.3rem;
    }

    .ultra-field ::ng-deep .mat-focused .input-icon {
      color: #1976d2;
    }

    .password-toggle-premium {
      color: #90a4ae;
      transition: all 0.3s ease;
      border-radius: 14px;
    }

    .password-toggle-premium:hover {
      background: rgba(25, 118, 210, 0.08);
      color: #1976d2;
    }

    .ultra-login-button {
      width: 100%;
      height: 60px;
      border-radius: 18px;
      font-size: 1.2rem;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: none;
      margin-top: 1.5rem;
      background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
      color: white;
      border: none;
      box-shadow: 
        0 10px 30px rgba(25, 118, 210, 0.3),
        0 5px 15px rgba(25, 118, 210, 0.2);
      transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      overflow: hidden;
      position: relative;
    }

    .ultra-login-button:not([disabled]):hover {
      transform: translateY(-3px);
      box-shadow: 
        0 15px 40px rgba(25, 118, 210, 0.4),
        0 8px 20px rgba(25, 118, 210, 0.3);
      background: linear-gradient(135deg, #1565c0 0%, #2196f3 100%);
    }

    .ultra-login-button:not([disabled]):active {
      transform: translateY(-1px);
    }

    .ultra-login-button[disabled] {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .button-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.8rem;
    }

    .button-icon {
      font-size: 1.4rem;
    }

    .spinning-loader {
      animation: spin 2s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .elegant-separator {
      display: flex;
      align-items: center;
      margin: 2.5rem 0;
      gap: 1rem;
    }

    .separator-line {
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, 
        transparent 0%, 
        rgba(144, 164, 174, 0.3) 50%, 
        transparent 100%);
    }

    .separator-text {
      font-size: 0.95rem;
      color: #90a4ae;
      font-weight: 500;
      padding: 0 1.2rem;
      background: linear-gradient(135deg, 
        rgba(255, 255, 255, 0.9) 0%, 
        rgba(248, 250, 252, 0.8) 100%);
      border-radius: 25px;
      border: 1px solid rgba(144, 164, 174, 0.1);
    }

    .register-invitation {
      text-align: center;
      margin-top: 2rem;
    }

    .invitation-text {
      font-size: 1rem;
      color: #546e7a;
      margin: 0 0 1.2rem 0;
      font-weight: 400;
    }

    .premium-register-button {
      width: 100%;
      height: 52px;
      border-radius: 18px;
      font-size: 1.1rem;
      font-weight: 500;
      text-transform: none;
      border: 2px solid rgba(25, 118, 210, 0.2);
      color: #1976d2;
      background: linear-gradient(135deg, 
        rgba(255, 255, 255, 0.9) 0%, 
        rgba(227, 242, 253, 0.5) 100%);
      transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.6rem;
    }

    .premium-register-button:hover {
      background: linear-gradient(135deg, 
        rgba(227, 242, 253, 0.8) 0%, 
        rgba(187, 222, 251, 0.6) 100%);
      border-color: rgba(25, 118, 210, 0.4);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(25, 118, 210, 0.15);
    }

    .register-icon {
      font-size: 1.3rem;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .ultra-elegant-page {
        padding: 15px;
      }
      
      .brand-title {
        font-size: 3.2rem;
      }
      
      .ultra-modal-card {
        border-radius: 24px;
      }
      
      .modal-header-design {
        padding: 1.2rem 1.5rem 1rem;
      }
      
      .modal-content-area {
        padding: 0 1.5rem 1.2rem;
      }
      
      .modal-title {
        font-size: 2rem;
      }
    }

    @media (max-width: 480px) {
      .ultra-elegant-page {
        padding: 10px;
      }
      
      .brand-section {
        margin-bottom: 2.5rem;
      }
      
      .brand-title {
        font-size: 2.8rem;
      }
      
      .modal-header-design {
        padding: 1rem 1.2rem 0.8rem;
      }
      
      .modal-content-area {
        padding: 0 1.2rem 1rem;
      }
      
      .premium-form {
        gap: 1.5rem;
      }
    }
  `]
})
export class LoginTempComponent implements OnInit {
  loginForm!: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.loginForm = this.fb.group({
      emailOrUsername: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const formValue = this.loginForm.value;
      
      // Crear el objeto de credenciales con la interfaz correcta
      const credentials: LoginData = {
        emailOrUsername: formValue.emailOrUsername,
        password: formValue.password
      };

      this.authService.login(credentials).subscribe({
        next: (response: any) => {
          console.log('SUCCESS: Inicio de sesión exitoso');
          this.router.navigate(['/dashboard']);
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('ERROR:', error.error?.message || 'Error en el inicio de sesión');
        }
      });
    }
  }
}
