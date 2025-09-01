import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';
import { RegisterData } from '../interfaces/user.interface';

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
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
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
        <div class="floating-circle circle-7"></div>
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
          <p class="brand-subtitle">Gestiona tareas eficientemente</p>
        </div>

        <div class="ultra-modal-container">
          <div class="ultra-modal-card">
            <div class="modal-header-design">
              <div class="header-accent"></div>
              <h2 class="modal-title">Crear Cuenta</h2>
              <p class="modal-subtitle">Comienza tu experiencia</p>
            </div>

            <div class="modal-content-area">
              <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="premium-form">
                <div class="form-grid">
                  <div class="premium-input-group">
                    <mat-form-field appearance="fill" class="ultra-field">
                      <mat-label>Nombre completo</mat-label>
                      <input
                        matInput
                        type="text"
                        formControlName="fullName"
                        placeholder="Tu nombre completo">
                      <mat-icon matSuffix class="input-icon">person_outline</mat-icon>
                      <mat-error *ngIf="registerForm.get('fullName')?.hasError('required')">
                        El nombre es obligatorio
                      </mat-error>
                      <mat-error *ngIf="registerForm.get('fullName')?.hasError('minlength')">
                        El nombre debe tener al menos 2 caracteres
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="premium-input-group">
                    <mat-form-field appearance="fill" class="ultra-field">
                      <mat-label>Nombre de usuario</mat-label>
                      <input
                        matInput
                        type="text"
                        formControlName="username"
                        placeholder="usuario_unico">
                      <mat-icon matSuffix class="input-icon">alternate_email</mat-icon>
                      <mat-error *ngIf="registerForm.get('username')?.hasError('required')">
                        El usuario es obligatorio
                      </mat-error>
                      <mat-error *ngIf="registerForm.get('username')?.hasError('minlength')">
                        El usuario debe tener al menos 3 caracteres
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="premium-input-group full-width">
                    <mat-form-field appearance="fill" class="ultra-field">
                      <mat-label>Correo electrónico</mat-label>
                      <input
                        matInput
                        type="email"
                        formControlName="email"
                        placeholder="tu@email.com">
                      <mat-icon matSuffix class="input-icon">mail_outline</mat-icon>
                      <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
                        El correo es obligatorio
                      </mat-error>
                      <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
                        Email inválido
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
                        placeholder="Contraseña segura">
                      <button
                        mat-icon-button
                        matSuffix
                        type="button"
                        class="password-toggle-premium"
                        (click)="togglePasswordVisibility()">
                        <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                      </button>
                      <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
                        La contraseña es obligatoria
                      </mat-error>
                      <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
                        Mínimo 6 caracteres
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="premium-input-group">
                    <mat-form-field appearance="fill" class="ultra-field">
                      <mat-label>Confirmar contraseña</mat-label>
                      <input
                        matInput
                        [type]="hideConfirmPassword ? 'password' : 'text'"
                        formControlName="confirmPassword"
                        placeholder="Repetir contraseña">
                      <button
                        mat-icon-button
                        matSuffix
                        type="button"
                        class="password-toggle-premium"
                        (click)="toggleConfirmPasswordVisibility()">
                        <mat-icon>{{hideConfirmPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                      </button>
                      <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('required')">
                        Confirma tu contraseña
                      </mat-error>
                      <mat-error *ngIf="registerForm.hasError('passwordMismatch') && registerForm.get('confirmPassword')?.touched">
                        Las contraseñas no coinciden
                      </mat-error>
                    </mat-form-field>
                  </div>
                </div>

                <button
                  mat-raised-button
                  type="submit"
                  class="ultra-register-button"
                  [disabled]="registerForm.invalid || isLoading">
                  <mat-icon *ngIf="isLoading" class="spinning-loader">hourglass_empty</mat-icon>
                  <span *ngIf="!isLoading" class="button-content">
                    <mat-icon class="button-icon">account_circle</mat-icon>
                    Crear mi cuenta
                  </span>
                  <span *ngIf="isLoading" class="button-content">
                    <mat-icon class="spinning-loader">autorenew</mat-icon>
                    Creando cuenta...
                  </span>
                </button>
              </form>

              <div class="elegant-separator">
                <div class="separator-line"></div>
                <span class="separator-text">o si ya tienes cuenta</span>
                <div class="separator-line"></div>
              </div>

              <div class="login-invitation">
                <p class="invitation-text">¿Ya tienes tu cuenta??</p>
                <a routerLink="/login" mat-stroked-button class="premium-login-button">
                  <mat-icon class="login-icon">login</mat-icon>
                  Iniciar sesión
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
      background: linear-gradient(135deg, rgba(129, 212, 250, 0.08), rgba(225, 245, 254, 0.12));
      backdrop-filter: blur(3px);
      animation: floatAround 25s linear infinite;
    }

    .circle-1 {
      width: 90px;
      height: 90px;
      top: 8%;
      left: 8%;
      animation-delay: 0s;
    }

    .circle-2 {
      width: 130px;
      height: 130px;
      top: 15%;
      right: 12%;
      animation-delay: -4s;
    }

    .circle-3 {
      width: 70px;
      height: 70px;
      bottom: 30%;
      left: 18%;
      animation-delay: -8s;
    }

    .circle-4 {
      width: 110px;
      height: 110px;
      bottom: 12%;
      right: 20%;
      animation-delay: -12s;
    }

    .circle-5 {
      width: 100px;
      height: 100px;
      top: 45%;
      left: 3%;
      animation-delay: -16s;
    }

    .circle-6 {
      width: 80px;
      height: 80px;
      top: 65%;
      right: 8%;
      animation-delay: -20s;
    }

    .circle-7 {
      width: 60px;
      height: 60px;
      top: 25%;
      left: 50%;
      animation-delay: -24s;
    }

    @keyframes floatAround {
      0% {
        transform: translateY(0px) translateX(0px) rotate(0deg);
        opacity: 0.6;
      }
      25% {
        transform: translateY(-25px) translateX(15px) rotate(90deg);
        opacity: 0.9;
      }
      50% {
        transform: translateY(-10px) translateX(-10px) rotate(180deg);
        opacity: 0.5;
      }
      75% {
        transform: translateY(-20px) translateX(20px) rotate(270deg);
        opacity: 0.8;
      }
      100% {
        transform: translateY(0px) translateX(0px) rotate(360deg);
        opacity: 0.6;
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
      margin-bottom: 2.5rem;
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
      padding: 1.5rem;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
      border-radius: 50%;
      box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(15px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      margin-bottom: 1.5rem;
      transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .brand-logo:hover {
      transform: translateY(-5px) scale(1.05);
      box-shadow: 
        0 12px 40px rgba(0, 0, 0, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
    }

    .logo-icon {
      font-size: 3rem;
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
      font-size: 1.1rem;
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

    .ultra-modal-container {
      width: 100%;
      max-width: 580px;
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
      border-radius: 24px;
      box-shadow: 
        0 20px 60px rgba(0, 0, 0, 0.08),
        0 8px 32px rgba(0, 0, 0, 0.06),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(30px);
      border: 1px solid rgba(255, 255, 255, 0.4);
      overflow: hidden;
      position: relative;
      transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .ultra-modal-card:hover {
      transform: translateY(-2px);
      box-shadow: 
        0 25px 70px rgba(0, 0, 0, 0.12),
        0 12px 40px rgba(0, 0, 0, 0.08),
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
      height: 4px;
      background: linear-gradient(90deg, #1976d2, #42a5f5, #81d4fa, #1976d2);
      background-size: 300% 100%;
      animation: gradientShift 3s ease-in-out infinite;
    }

    @keyframes gradientShift {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    .modal-title {
      font-size: 2rem;
      font-weight: 600;
      color: #1a237e;
      margin: 0 0 0.5rem 0;
      letter-spacing: -0.3px;
    }

    .modal-subtitle {
      font-size: 1rem;
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
      gap: 1.5rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      align-items: start;
    }

    .premium-input-group {
      position: relative;
    }

    .premium-input-group.full-width {
      grid-column: 1 / -1;
    }

    .ultra-field {
      width: 100%;
      font-size: 1rem;
    }

    .ultra-field ::ng-deep .mat-mdc-form-field-flex {
      background: linear-gradient(135deg, 
        rgba(255, 255, 255, 0.8) 0%, 
        rgba(248, 250, 252, 0.9) 100%);
      border-radius: 16px;
      border: 1.5px solid rgba(25, 118, 210, 0.15);
      transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      backdrop-filter: blur(10px);
    }

    .ultra-field ::ng-deep .mat-mdc-form-field-flex:hover {
      border-color: rgba(25, 118, 210, 0.3);
      background: linear-gradient(135deg, 
        rgba(255, 255, 255, 0.9) 0%, 
        rgba(248, 250, 252, 0.95) 100%);
      box-shadow: 0 4px 16px rgba(25, 118, 210, 0.08);
    }

    .ultra-field ::ng-deep .mat-mdc-form-field-focus-overlay {
      border-radius: 16px;
    }

    .ultra-field ::ng-deep .mat-mdc-form-field.mat-focused .mat-mdc-form-field-flex {
      border-color: #1976d2;
      background: linear-gradient(135deg, 
        rgba(255, 255, 255, 0.95) 0%, 
        rgba(227, 242, 253, 0.8) 100%);
      box-shadow: 
        0 0 0 3px rgba(25, 118, 210, 0.1),
        0 4px 20px rgba(25, 118, 210, 0.12);
    }

    .ultra-field ::ng-deep .mat-mdc-input-element {
      font-size: 1rem;
      font-weight: 500;
      color: #263238;
      padding: 0.8rem 1rem;
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
    }

    .ultra-field ::ng-deep .mat-focused .input-icon {
      color: #1976d2;
    }

    .password-toggle-premium {
      color: #90a4ae;
      transition: all 0.3s ease;
      border-radius: 12px;
    }

    .password-toggle-premium:hover {
      background: rgba(25, 118, 210, 0.08);
      color: #1976d2;
    }

    .ultra-register-button {
      width: 100%;
      height: 56px;
      border-radius: 16px;
      font-size: 1.1rem;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: none;
      margin-top: 1rem;
      background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
      color: white;
      border: none;
      box-shadow: 
        0 8px 24px rgba(25, 118, 210, 0.3),
        0 4px 12px rgba(25, 118, 210, 0.2);
      transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      overflow: hidden;
      position: relative;
    }

    .ultra-register-button:not([disabled]):hover {
      transform: translateY(-2px);
      box-shadow: 
        0 12px 32px rgba(25, 118, 210, 0.4),
        0 6px 16px rgba(25, 118, 210, 0.3);
      background: linear-gradient(135deg, #1565c0 0%, #2196f3 100%);
    }

    .ultra-register-button:not([disabled]):active {
      transform: translateY(0px);
    }

    .ultra-register-button[disabled] {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .button-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .button-icon {
      font-size: 1.3rem;
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
      margin: 2rem 0;
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
      font-size: 0.9rem;
      color: #90a4ae;
      font-weight: 500;
      padding: 0 1rem;
      background: linear-gradient(135deg, 
        rgba(255, 255, 255, 0.9) 0%, 
        rgba(248, 250, 252, 0.8) 100%);
      border-radius: 20px;
      border: 1px solid rgba(144, 164, 174, 0.1);
    }

    .login-invitation {
      text-align: center;
      margin-top: 1.5rem;
    }

    .invitation-text {
      font-size: 0.95rem;
      color: #546e7a;
      margin: 0 0 1rem 0;
      font-weight: 400;
    }

    .premium-login-button {
      width: 100%;
      height: 48px;
      border-radius: 16px;
      font-size: 1rem;
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
      gap: 0.5rem;
    }

    .premium-login-button:hover {
      background: linear-gradient(135deg, 
        rgba(227, 242, 253, 0.8) 0%, 
        rgba(187, 222, 251, 0.6) 100%);
      border-color: rgba(25, 118, 210, 0.4);
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(25, 118, 210, 0.15);
    }

    .login-icon {
      font-size: 1.2rem;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
        gap: 1.2rem;
      }
      
      .premium-input-group.full-width {
        grid-column: 1;
      }
      
      .ultra-elegant-page {
        padding: 15px;
      }
      
      .brand-title {
        font-size: 2.8rem;
      }
      
      .ultra-modal-card {
        border-radius: 20px;
      }
      
      .modal-header-design {
        padding: 1.2rem 1.5rem 1rem;
      }
      
      .modal-content-area {
        padding: 0 1.5rem 1.2rem;
      }
      
      .modal-title {
        font-size: 1.4rem;
      }
    }

    @media (max-width: 580px) {
      .ultra-elegant-page {
        padding: 10px;
      }
      
      .brand-section {
        margin-bottom: 2rem;
      }
      
      .brand-title {
        font-size: 2.4rem;
      }
      
      .modal-header-design {
        padding: 1rem 1.2rem 0.8rem;
      }
      
      .modal-content-area {
        padding: 0 1.2rem 1rem;
      }
      
      .form-grid {
        gap: 1rem;
      }
    }
  `]
})
export class RegisterFinalComponent implements OnInit {
  registerForm!: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const registerData: RegisterData = {
        fullName: this.registerForm.value.fullName,
        username: this.registerForm.value.username,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password
      };

      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.snackBar.open('Cuenta creada exitosamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(
            error.error?.message || 'Error al crear la cuenta',
            'Cerrar',
            {
              duration: 5000,
              panelClass: ['error-snackbar']
            }
          );
        }
      });
    }
  }
}
/* Updated 01:13:56 */
/* Force reload 01:25:28 */
