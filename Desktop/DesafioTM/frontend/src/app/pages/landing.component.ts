import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-landing',
  imports: [CommonModule, RouterModule, MatButtonModule, MatCardModule, MatIconModule, FormsModule],
  template: `
    <div class="landing-container">
      
      <!-- navegacion superior -->
      <nav class="navbar">
        <div class="nav-content">
          <div class="nav-inner">
            
            
            <div class="logo-section">
              <div class="logo-icon-modern">
                <div class="tm-logo-landing">
                  <div class="logo-text-relief-landing">TM</div>
                </div>
              </div>
              <h1 class="logo-text-modern">TaskManager</h1>
            </div>
            
            <!-- botones de navegacion login y registro -->
            <div class="nav-buttons">
              <button mat-stroked-button routerLink="/login" class="login-btn">
                Iniciar Sesión
              </button>
              <button mat-flat-button routerLink="/register" class="register-btn">
                Registrarse Gratis
              </button>
            </div>
          </div>
        </div>
      </nav>

      <-- seccion principal hero -->
      <div class="hero-section">
        <div class="hero-content">
          
          
          <div class="welcome-banner">
            <h1 class="welcome-title">
              Bienvenido a <span class="brand-highlight">TaskManager</span>
            </h1>
            <div class="welcome-subtitle">
              ¡La plataforma de gestión de proyectos que transformará la manera en que tu equipo trabaja!
            </div>
          </div>
          

          <div class="hero-text-section">
            <h2 class="hero-title">
              <span class="hero-highlight">Organiza</span><span class="hero-highlight">, </span><span class="hero-highlight">Colabora</span><span class="hero-highlight"> y </span><span class="hero-highlight">Triunfa</span>
            </h2>
            
            <!-- subtitulo centrado -->
            <p class="hero-subtitle">
              <strong>Gestiona proyectos</strong> con tableros intuitivos<br>
              <strong>Colabora en tiempo real</strong> con tu equipo desde cualquier lugar<br>
              <strong>Aumenta la productividad</strong> con herramientas visuales poderosas<br>
              <strong>Simplifica el trabajo</strong> y enfócate en lo que realmente importa
            </p>
           
            <div class="quick-signup-bar">
              <h3>¡Empieza gratis hoy!</h3>
              <div class="signup-container">
                <input 
                  type="email" 
                  placeholder="Ingresa tu correo electrónico" 
                  class="email-input"
                  [(ngModel)]="userEmail"
                  (keyup.enter)="quickSignup()">
                <button 
                  mat-flat-button 
                  class="signup-btn"
                  (click)="quickSignup()"
                  [disabled]="!isValidEmail(userEmail)">
                  Registrarse Gratis
                </button>
              </div>
              <p class="signup-note">
                <mat-icon class="note-icon">check_circle</mat-icon>
                
              </p>
            </div>
            
            <!-- botones de accion centrados -->
            <div class="cta-buttons">
              <button mat-stroked-button routerLink="/login" class="cta-secondary">
                ¿Ya tienes una cuenta? Inicia sesión
              </button>
            </div>
          </div>

          <!-- demo visual de tablero estilo trello -->
          <div class="demo-board-section">
            <div class="demo-board">
              
              <!-- lista por hacer -->
              <div class="demo-list">
                <div class="demo-list-header">
                  <h3><mat-icon class="list-header-icon">playlist_add_check</mat-icon> Por hacer</h3>
                  <span class="card-count">3</span>
                </div>
                <div class="demo-cards">
                  <div class="demo-card">
                    <div class="card-labels">
                      <span class="label green">Diseño</span>
                    </div>
                    <p class="card-title">Crear wireframes de la nueva funcionalidad</p>
                    <div class="card-footer">
                      <div class="card-avatars">
                        <div class="avatar avatar-1">JD</div>
                      </div>
                      <mat-icon class="card-icon">chat_bubble_outline</mat-icon>
                    </div>
                  </div>
                  <div class="demo-card">
                    <div class="card-labels">
                      <span class="label blue">Desarrollo</span>
                    </div>
                    <p class="card-title">Implementar autenticación de usuarios</p>
                    <div class="card-footer">
                      <div class="card-avatars">
                        <div class="avatar avatar-2">MA</div>
                        <div class="avatar avatar-3">+2</div>
                      </div>
                      <mat-icon class="card-icon">link</mat-icon>
                    </div>
                  </div>
                  <div class="demo-card">
                    <p class="card-title">Revisar documentación del API</p>
                  </div>
                </div>
              </div>

              <!-- lista en progreso -->
              <div class="demo-list">
                <div class="demo-list-header">
                  <h3><mat-icon class="list-header-icon">trending_up</mat-icon> En progreso</h3>
                  <span class="card-count">2</span>
                </div>
                <div class="demo-cards">
                  <div class="demo-card active">
                    <div class="card-labels">
                      <span class="label orange">Urgente</span>
                    </div>
                    <p class="card-title">Corregir bug en el dashboard</p>
                    <div class="card-footer">
                      <div class="card-avatars">
                        <div class="avatar avatar-4">LP</div>
                      </div>
                      <div class="card-due">Vence mañana</div>
                    </div>
                  </div>
                  <div class="demo-card">
                    <div class="card-labels">
                      <span class="label purple">Testing</span>
                    </div>
                    <p class="card-title">Pruebas de integración</p>
                    <div class="progress-bar">
                      <div class="progress-fill" style="width: 60%"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- lista completado -->
              <div class="demo-list">
                <div class="demo-list-header">
                  <h3><mat-icon class="list-header-icon">verified</mat-icon> Completado</h3>
                  <span class="card-count">4</span>
                </div>
                <div class="demo-cards">
                  <div class="demo-card completed">
                    <div class="card-labels">
                      <span class="label green">Diseño</span>
                    </div>
                    <p class="card-title">Mockups aprobados por cliente</p>
                  </div>
                  <div class="demo-card completed">
                    <p class="card-title">Setup del proyecto inicial</p>
                  </div>
                  <div class="demo-card completed">
                    <p class="card-title">Configuración de base de datos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- caracteristicas principales -->
      <div class="features-section">
        <div class="features-content">
          <div class="features-header">
            <h2>Una herramienta productiva para equipos colaborativos</h2>
            <p>TaskManagerSWO hace que trabajar en equipo sea más fácil, desde intercambio de ideas hasta planificación hasta ejecución, las características de TaskManagerSWO ayudan a tu equipo a ser más productivo.</p>
          </div>

          <div class="features-grid">
            
            <!-- caracteristica tableros -->
            <div class="feature-item">
              <div class="feature-visual boards">
                <div class="mini-board">
                  <div class="mini-list">
                    <div class="mini-header"></div>
                    <div class="mini-card"></div>
                    <div class="mini-card"></div>
                  </div>
                  <div class="mini-list">
                    <div class="mini-header"></div>
                    <div class="mini-card"></div>
                  </div>
                  <div class="mini-list">
                    <div class="mini-header"></div>
                    <div class="mini-card"></div>
                    <div class="mini-card"></div>
                    <div class="mini-card"></div>
                  </div>
                </div>
              </div>
              <h3><mat-icon class="feature-icon">dashboard</mat-icon> Tableros</h3>
              <p>Los tableros de TaskManagerSWO mantienen las tareas organizadas y el trabajo avanzando, en un vistazo, ve todo desde "cosas por hacer" hasta "¡terminado!"</p>
            </div>

            <!-- caracteristica listas -->
            <div class="feature-item">
              <div class="feature-visual lists">
                <div class="list-demo">
                  <div class="list-header">
                    <div class="list-title-bar"></div>
                  </div>
                  <div class="list-cards">
                    <div class="list-card"></div>
                    <div class="list-card"></div>
                    <div class="list-card"></div>
                    <div class="list-card-add">+ Agregar tarjeta</div>
                  </div>
                </div>
              </div>
              <h3><mat-icon class="feature-icon">view_list</mat-icon> Listas</h3>
              <p>Las diferentes etapas de una tarea pueden ser organizadas en listas, comienza tan simple como "Por hacer", "En progreso", "Completado".</p>
            </div>

            <!-- caracteristica tarjetas -->
            <div class="feature-item">
              <div class="feature-visual cards">
                <div class="card-demo">
                  <div class="card-demo-header">
                    <div class="card-demo-title"></div>
                  </div>
                  <div class="card-demo-labels">
                    <span class="demo-label green"></span>
                    <span class="demo-label blue"></span>
                  </div>
                  <div class="card-demo-description"></div>
                  <div class="card-demo-members">
                    <div class="demo-avatar"></div>
                    <div class="demo-avatar"></div>
                    <div class="demo-avatar-add">+</div>
                  </div>
                </div>
              </div>
              <h3><mat-icon class="feature-icon">style</mat-icon> Tarjetas</h3>
              <p>Las tarjetas contienen todo lo que necesitas para hacer el trabajo, asigna tareas, agrega fechas de vencimiento y colabora en proyectos.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- seccion de casos de uso -->
      <div class="use-cases-section">
        <div class="use-cases-content">
          <div class="use-cases-header">
            <h2>TaskManagerSWO funciona para equipos de cualquier tamaño</h2>
          </div>

          <div class="use-cases-grid">
            
            <!-- equipo pequeno -->
            <div class="use-case-item">
              <div class="use-case-icon small-team">
                <mat-icon>groups</mat-icon>
              </div>
              <h3>Equipos pequeños</h3>
              <p>Perfectecto para startups y equipos pequeños que necesitan organización sin complejidad.</p>
            </div>

            <!-- equipo grande -->
            <div class="use-case-item">
              <div class="use-case-icon large-team">
                <mat-icon>business</mat-icon>
              </div>
              <h3>Empresas</h3>
              <p>Escala para empresas grandes con características avanzadas de gestión y reportes.</p>
            </div>

            <!-- uso personal -->
            <div class="use-case-item">
              <div class="use-case-icon personal">
                <mat-icon>account_circle</mat-icon>
              </div>
              <h3>Uso personal</h3>
              <p>Organiza tu vida personal, hobbies y proyectos individuales de manera eficiente.</p>
            </div>

            <!-- gestion de proyectos -->
            <div class="use-case-item">
              <div class="use-case-icon projects">
                <mat-icon>assignment</mat-icon>
              </div>
              <h3>Gestión de proyectos</h3>
              <p>Maneja proyectos complejos con múltiples fases, dependencias y colaboradores.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- llamada final a la accion -->
      <div class="final-cta">
        <div class="final-cta-content">
          <div class="cta-text-center">
            <h2>¿Listo para comenzar con TaskManagerSWO?</h2>
            <p>Únete a millones de equipos en todo el mundo que utilizan TaskManagerSWO para hacer más.</p>
            <div class="final-cta-buttons">
              <button mat-flat-button routerLink="/register" class="final-cta-btn-primary">
                Comenzar ahora - es gratis
              </button>
              <button mat-stroked-button routerLink="/login" class="final-cta-btn-secondary">
                Iniciar sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- pie de pagina -->
      <footer class="footer">
        <div class="footer-content">
          <div class="footer-main">
            <div class="footer-logo">
              <div class="footer-logo-icon-modern">
                <div class="footer-gradient-bg">
                  <span class="footer-swo-modern">SWO</span>
                </div>
              </div>
              <span>TaskManagerSWO</span>
            </div>
            <p class="footer-description">Organiza cualquier cosa, junto con cualquier persona, desde cualquier lugar.</p>
          </div>
          <div class="footer-divider"></div>
          <div class="footer-bottom">
            <p class="footer-copyright">© 2024 TaskManagerSWO. Inspirado en la simplicidad y efectividad de Trello.</p>
          </div>
        </div>
      </footer>

    </div>
  `,
  styles: [`
    .landing-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #4fc3f7 0%, #29b6f6 100%);
      position: relative;
      overflow-x: hidden;
    }

    /* navegacion superior */
    .navbar {
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 50;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(0, 121, 191, 0.1);
    }

    .nav-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .nav-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 64px;
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logo-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #0079bf, #026aa7);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0, 121, 191, 0.2);
    }

    .logo-icon mat-icon {
      color: white;
      font-size: 20px;
    }

    /* estilos del logo swo con gradiente moderno */
    .logo-swo {
      background: linear-gradient(45deg, #0079bf, #026aa7);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      color: #0079bf; /* fallback para navegadores antiguos */
      font-size: 1.2rem;
      font-weight: 900;
      letter-spacing: 2px;
      text-align: center;
      text-shadow: 0 2px 4px rgba(0, 121, 191, 0.3);
    }

    /* nuevo logo moderno con gradiente y sombras */
    .logo-icon-modern {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
    }

    /* Logo TM para Landing */
    .tm-logo-landing {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, #87ceeb 0%, #4fc3f7 50%, #29b6f6 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3),
                  0 2px 4px rgba(33, 150, 243, 0.1);
      transition: all 0.3s ease;
      position: relative;
    }

    .tm-logo-landing:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(33, 150, 243, 0.4),
                  0 2px 8px rgba(33, 150, 243, 0.2);
    }

    .tm-logo-landing::before {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      right: 2px;
      height: 50%;
      background: linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%);
      border-radius: 10px 10px 4px 4px;
    }

    .logo-text-relief-landing {
      color: white;
      font-size: 1rem;
      font-weight: 900;
      letter-spacing: 1px;
      text-align: center;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      text-shadow: 
        0 1px 0 rgba(255, 255, 255, 0.2),
        0 2px 0 rgba(255, 255, 255, 0.1),
        0 3px 0 rgba(0, 0, 0, 0.1),
        0 4px 0 rgba(0, 0, 0, 0.1),
        0 1px 2px rgba(0, 0, 0, 0.3);
      z-index: 1;
      position: relative;
      transition: all 0.3s ease;
    }

    .logo-text-modern {
      font-size: 1.75rem;
      font-weight: 700;
      color: #2196f3;
      margin: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      letter-spacing: -0.5px;
      text-shadow: 0 1px 2px rgba(33, 150, 243, 0.2);
    }

    .logo-text {
      font-size: 1.5rem;
      font-weight: 700;
      color: #0079bf;
      margin: 0;
    }

    .nav-buttons {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .login-btn {
      color: #0079bf !important;
      border-color: #0079bf !important;
      font-weight: 600 !important;
    }

    .register-btn {
      background: #0079bf !important;
      color: white !important;
      font-weight: 600 !important;
    }

    /* seccion principal hero */
    .hero-section {
      padding: 100px 2rem 60px;
      position: relative;
      z-index: 10;
    }

    .hero-content {
      max-width: 1400px;
      margin: 0 auto;
    }

    /* mensaje de bienvenida llamativo */
    .welcome-banner {
      text-align: center;
      margin-bottom: 3rem;
      padding: 2rem;
      background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
      border-radius: 20px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.1);
      animation: welcomeFloat 3s ease-in-out infinite;
    }

    @keyframes welcomeFloat {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-5px); }
    }

    .welcome-title {
      font-size: 3.2rem;
      font-weight: 800;
      color: white;
      margin-bottom: 1rem;
      line-height: 1.1;
      letter-spacing: -0.02em;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .brand-highlight {
      background: linear-gradient(135deg, #0079bf 0%, #026aa7 50%, #FFD700 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 900;
      animation: brandGlow 2s ease-in-out infinite alternate;
    }

    @keyframes brandGlow {
      0% { filter: brightness(1); }
      100% { filter: brightness(1.2); }
    }

    .welcome-subtitle {
      font-size: 1.3rem;
      color: rgba(255, 255, 255, 0.9);
      line-height: 1.4;
      font-weight: 400;
      max-width: 600px;
      margin: 0 auto;
    }

    .hero-text-section {
      text-align: center;
      max-width: 800px;
      margin: 0 auto 4rem;
    }

    .hero-title {
      font-size: 3rem;
      font-weight: 700;
      color: white;
      margin-bottom: 1.5rem;
      line-height: 1.1;
      letter-spacing: -0.02em;
    }

    .hero-highlight {
      color: #FFD700;
      font-weight: 800;
    }

    /* características destacadas */
    .hero-highlights {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
      max-width: 600px;
      margin: 2.5rem auto 3rem;
      padding: 0 1rem;
    }

    .highlight-item {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.3s ease;
    }

    .highlight-item:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    }

    .highlight-icon {
      font-size: 1.5rem;
      opacity: 0.9;
    }

    .highlight-text {
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.9);
      font-weight: 500;
    }

    .hero-subtitle {
      font-size: 1.375rem;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 2.5rem;
      line-height: 1.5;
      max-width: 700px;
      margin-left: auto;
      margin-right: auto;
    }

    .cta-buttons {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: center;
      justify-content: center;
    }

    @media (min-width: 640px) {
      .cta-buttons {
        flex-direction: row;
        gap: 1.5rem;
      }
    }

    .cta-primary {
      background: #1976d2 !important;
      color: white !important;
      padding: 1rem 2.5rem !important;
      font-size: 1.125rem !important;
      font-weight: 600 !important;
      border-radius: 8px !important;
      box-shadow: 0 4px 16px rgba(112, 181, 0, 0.3);
      transition: all 0.3s ease;
    }

    .cta-primary:hover {
      background: #5a9600 !important;
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(112, 181, 0, 0.4);
    }

    .cta-secondary {
      border: 2px solid rgba(255, 255, 255, 0.8) !important;
      color: white !important;
      padding: 1rem 2.5rem !important;
      font-size: 1.125rem !important;
      font-weight: 600 !important;
      border-radius: 8px !important;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    }

    .cta-secondary:hover {
      background: rgba(255, 255, 255, 0.1) !important;
      border-color: white !important;
    }

    /* estilos para barra de registro rápido */
    .quick-signup-bar {
      background: rgba(255, 255, 255, 0.98);
      border-radius: 16px;
      padding: 2.5rem 2rem;
      box-shadow: 0 12px 40px rgba(25, 118, 210, 0.15);
      backdrop-filter: blur(15px);
      border: 2px solid rgba(25, 118, 210, 0.1);
      margin: 3rem 0;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .quick-signup-bar::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 3px;
      background: linear-gradient(90deg, #1976d2, #42a5f5, #1976d2);
      animation: shimmer 3s infinite;
    }

    @keyframes shimmer {
      0% { left: -100%; }
      100% { left: 100%; }
    }

    .quick-signup-bar h3 {
      color: #1976d2;
      margin-bottom: 1.5rem;
      font-size: 1.8rem;
      font-weight: 700;
      background: linear-gradient(135deg, #1976d2, #42a5f5);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .signup-container {
      display: flex;
      justify-content: center;
      align-items: center;
      max-width: 400px;
      margin: 0 auto;
      position: relative;
    }

    .email-input {
      padding: 1rem 1.25rem;
      border: 2px solid #e3f2fd;
      border-radius: 12px 0 0 12px;
      font-size: 1.1rem;
      width: 280px;
      outline: none;
      transition: all 0.3s ease;
      background: #fafafa;
      color: #333;
    }

    .email-input:focus {
      border-color: #1976d2;
      box-shadow: 0 0 0 4px rgba(25, 118, 210, 0.1);
      background: white;
    }

    .signup-btn {
      padding: 1rem 2.5rem !important;
      background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%) !important;
      color: white !important;
      border: none !important;
      border-radius: 0 12px 12px 0 !important;
      font-size: 1.1rem !important;
      font-weight: 700 !important;
      cursor: pointer !important;
      transition: all 0.3s ease !important;
      margin-left: -2px !important;
      box-shadow: 0 6px 20px rgba(25, 118, 210, 0.3) !important;
      text-transform: uppercase !important;
      letter-spacing: 0.5px !important;
    }

    .signup-btn:hover {
      background: linear-gradient(135deg, #1565c0 0%, #2196f3 100%) !important;
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 25px rgba(25, 118, 210, 0.4) !important;
    }

    .signup-btn:disabled {
      background: linear-gradient(135deg, #bdbdbd 0%, #e0e0e0 100%) !important;
      cursor: not-allowed !important;
      transform: none !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
    }

    /* estilos responsivos para barra de registro */
    @media (max-width: 768px) {
      .quick-signup-bar {
        padding: 2rem 1.5rem;
        margin: 2rem 1rem;
      }

      .signup-container {
        flex-direction: column;
        gap: 1rem;
      }

      .email-input {
        width: 100%;
        border-radius: 12px;
        margin-bottom: 0;
      }

      .signup-btn {
        width: 100% !important;
        border-radius: 12px !important;
        margin-left: 0 !important;
        padding: 1.2rem 2rem !important;
      }
    }

    /* estilos responsivos para bienvenida */
    @media (max-width: 768px) {
      .welcome-title {
        font-size: 2.2rem;
      }

      .welcome-banner {
        padding: 1.5rem;
        margin-bottom: 2rem;
      }

      .hero-highlights {
        grid-template-columns: 1fr;
        gap: 1rem;
        margin: 2rem auto 2rem;
      }

      .hero-title {
        font-size: 2.5rem;
      }

      .highlight-item {
        padding: 0.8rem;
      }
    }

    @media (max-width: 480px) {
      .welcome-title {
        font-size: 1.8rem;
      }

      .hero-title {
        font-size: 2rem;
      }

      .welcome-subtitle {
        font-size: 1.1rem;
      }

      .cta-primary, .cta-secondary {
        padding: 0.8rem 2rem !important;
        font-size: 1rem !important;
      }
    }

    /* demo visual del tablero estilo trello */
    .demo-board-section {
      margin-top: 4rem;
      perspective: 1000px;
    }

    .demo-board {
      display: flex;
      gap: 1.5rem;
      padding: 2rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      overflow-x: auto;
      min-height: 400px;
      animation: fadeInUp 1s ease-out;
    }

    .demo-list {
      min-width: 280px;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 12px;
      padding: 1rem;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      animation: slideInUp 0.8s ease-out;
    }

    .demo-list:nth-child(2) { animation-delay: 0.2s; }
    .demo-list:nth-child(3) { animation-delay: 0.4s; }

    .demo-list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .demo-list-header h3 {
      font-size: 1rem;
      font-weight: 600;
      color: #172b4d;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    /* estilos para iconos de encabezado de listas */
    .list-header-icon {
      font-size: 1.1rem !important;
      color: #0079bf;
      opacity: 0.8;
      transition: all 0.2s ease;
    }

    .demo-list:hover .list-header-icon {
      opacity: 1;
      transform: scale(1.1);
    }

    /* estilos para iconos de características */
    .feature-icon {
      font-size: 1.3rem !important;
      color: #0079bf;
      margin-right: 0.5rem;
      vertical-align: middle;
      opacity: 0.9;
      transition: all 0.3s ease;
    }

    .feature-item:hover .feature-icon {
      opacity: 1;
      transform: translateY(-1px);
      color: #026aa7;
    }

    .card-count {
      background: #ddd;
      color: #666;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .demo-cards {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .demo-card {
      background: white;
      border-radius: 10px;
      padding: 1.25rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08),
                  0 1px 3px rgba(0, 0, 0, 0.06);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid #e4e6ea;
      position: relative;
      overflow: hidden;
      backdrop-filter: blur(10px);
    }

    .demo-card:hover {
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12),
                  0 4px 8px rgba(0, 0, 0, 0.08);
      transform: translateY(-3px);
      border-color: #ddd;
    }

    .demo-card.active {
      border-left: 4px solid #ff9f1a;
    }

    .demo-card.completed {
      opacity: 0.8;
      position: relative;
    }

    .demo-card.completed::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: #1976d2;
    }

    .card-labels {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .label {
      padding: 0.3rem 0.7rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      color: white;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: all 0.2s ease;
    }

    .label:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    }

    .label.green { 
      background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%); 
    }
    .label.blue { 
      background: linear-gradient(135deg, #0079bf 0%, #026aa7 100%); 
    }
    .label.orange { 
      background: linear-gradient(135deg, #ff9f1a 0%, #ffb84d 100%); 
    }
    .label.purple { 
      background: linear-gradient(135deg, #c377e0 0%, #d38ce6 100%); 
    }

    .card-title {
      font-size: 0.9rem;
      font-weight: 600;
      color: #172b4d;
      margin: 0 0 0.875rem 0;
      line-height: 1.4;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      letter-spacing: -0.01em;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 0.75rem;
    }

    .card-avatars {
      display: flex;
      gap: 0.25rem;
      align-items: center;
    }

    .avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 600;
      color: white;
      border: 2px solid white;
    }

    .avatar-1 { background: #0079bf; }
    .avatar-2 { background: #42a5f5; }
    .avatar-3 { background: #c377e0; }
    .avatar-4 { background: #ff9f1a; }

    .card-icon {
      color: #6b778c;
      font-size: 18px;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .card-icon:hover {
      color: #0079bf;
      transform: scale(1.1);
    }

    .card-due {
      background: #ffebe5;
      color: #b04632;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: #e4e6ea;
      border-radius: 4px;
      margin-top: 0.5rem;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: #1976d2;
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    /* seccion de caracteristicas */
    .features-section {
      background: white;
      padding: 5rem 2rem;
      position: relative;
      z-index: 10;
    }

    .features-content {
      max-width: 1400px;
      margin: 0 auto;
    }

    .features-header {
      text-align: center;
      margin-bottom: 4rem;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
    }

    .features-header h2 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #172b4d;
      margin-bottom: 1.5rem;
      line-height: 1.2;
    }

    .features-header p {
      font-size: 1.25rem;
      color: #5e6c84;
      line-height: 1.5;
    }

    .features-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 3rem;
    }

    @media (min-width: 1024px) {
      .features-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .feature-item {
      text-align: center;
      padding: 2rem;
    }

    .feature-visual {
      width: 200px;
      height: 150px;
      margin: 0 auto 2rem;
      position: relative;
      overflow: hidden;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    /* visual de tableros */
    .feature-visual.boards {
      background: linear-gradient(135deg, #0079bf, #026aa7);
      padding: 1rem;
    }

    .mini-board {
      display: flex;
      gap: 0.5rem;
      height: 100%;
    }

    .mini-list {
      flex: 1;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 4px;
      padding: 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .mini-header {
      height: 12px;
      background: #ddd;
      border-radius: 2px;
    }

    .mini-card {
      height: 16px;
      background: white;
      border-radius: 2px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    /* visual de listas */
    .feature-visual.lists {
      background: #f4f5f7;
      padding: 1rem;
    }

    .list-demo {
      background: white;
      border-radius: 8px;
      padding: 1rem;
      height: 100%;
    }

    .list-header {
      margin-bottom: 1rem;
    }

    .list-title-bar {
      height: 16px;
      background: #ddd;
      border-radius: 4px;
      width: 80%;
    }

    .list-cards {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .list-card {
      height: 20px;
      background: #f4f5f7;
      border-radius: 4px;
    }

    .list-card-add {
      color: #6b778c;
      font-size: 0.75rem;
      padding: 0.5rem;
      border: 2px dashed #ddd;
      border-radius: 4px;
      text-align: center;
    }

    /* visual de tarjetas */
    .feature-visual.cards {
      background: white;
      padding: 1rem;
    }

    .card-demo {
      background: white;
      border: 1px solid #e4e6ea;
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .card-demo-title {
      height: 16px;
      background: #ddd;
      border-radius: 4px;
      margin-bottom: 1rem;
    }

    .card-demo-labels {
      display: flex;
      gap: 0.25rem;
      margin-bottom: 1rem;
    }

    .demo-label {
      width: 40px;
      height: 12px;
      border-radius: 12px;
    }

    .demo-label.green { background: #42a5f5; }
    .demo-label.blue { background: #0079bf; }

    .card-demo-description {
      height: 32px;
      background: #f4f5f7;
      border-radius: 4px;
      margin-bottom: 1rem;
    }

    .card-demo-members {
      display: flex;
      gap: 0.25rem;
    }

    .demo-avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #0079bf;
    }

    .demo-avatar:nth-child(2) { background: #42a5f5; }

    .demo-avatar-add {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 2px dashed #ddd;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      color: #6b778c;
      font-weight: 600;
    }

    .feature-item h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #172b4d;
      margin-bottom: 1rem;
    }

    .feature-item p {
      color: #5e6c84;
      line-height: 1.6;
      font-size: 1rem;
    }

    /* seccion de casos de uso */
    .use-cases-section {
      background: #f4f5f7;
      padding: 5rem 2rem;
      position: relative;
      z-index: 10;
    }

    .use-cases-content {
      max-width: 1400px;
      margin: 0 auto;
    }

    .use-cases-header {
      text-align: center;
      margin-bottom: 4rem;
    }

    .use-cases-header h2 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #172b4d;
      margin-bottom: 1rem;
    }

    .use-cases-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    @media (min-width: 768px) {
      .use-cases-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .use-cases-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .use-case-item {
      background: white;
      padding: 2.5rem 2rem;
      border-radius: 20px;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
      text-align: center;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(255, 255, 255, 0.1);
      position: relative;
      overflow: hidden;
    }

    .use-case-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #2196f3, #1976d2);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .use-case-item:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    }

    .use-case-item:hover::before {
      opacity: 1;
    }

    .use-case-icon {
      width: 100px;
      height: 100px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .use-case-icon.small-team { background: linear-gradient(135deg, #e3f2fd, #2196f3); }
    .use-case-icon.large-team { background: linear-gradient(135deg, #f3e5f5, #9c27b0); }
    .use-case-icon.personal { background: linear-gradient(135deg, #e8f4f8, #607d8b); }
    .use-case-icon.projects { background: linear-gradient(135deg, #fff3e0, #ff9800); }

    .use-case-icon mat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      color: white;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
    }

    .use-case-item:hover .use-case-icon {
      transform: translateY(-5px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
    }

    .use-case-item:hover .use-case-icon mat-icon {
      transform: scale(1.1);
    }

    .use-case-item h3 {
      font-size: 1.4rem;
      font-weight: 700;
      color: #1976d2;
      margin-bottom: 1rem;
      transition: color 0.3s ease;
    }

    .use-case-item p {
      color: #666;
      line-height: 1.6;
      font-size: 1rem;
      margin: 0;
    }

    .use-case-item:hover h3 {
      color: #0d47a1;
    }
    /* llamada final a la accion */
    .final-cta {
      background: linear-gradient(135deg, #0079bf 0%, #026aa7 100%);
      padding: 5rem 2rem;
      position: relative;
      z-index: 10;
    }

    .final-cta-content {
      max-width: 800px;
      margin: 0 auto;
    }

    .cta-text-center {
      text-align: center;
    }

    .final-cta h2 {
      font-size: 2.5rem;
      font-weight: 700;
      color: white;
      margin-bottom: 1.5rem;
      line-height: 1.2;
    }

    .final-cta p {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 2.5rem;
      line-height: 1.5;
    }

    .final-cta-buttons {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: center;
      justify-content: center;
    }

    @media (min-width: 640px) {
      .final-cta-buttons {
        flex-direction: row;
        gap: 1.5rem;
      }
    }

    .final-cta-btn-primary {
      background: #1976d2 !important;
      color: white !important;
      padding: 1rem 2.5rem !important;
      font-size: 1.125rem !important;
      font-weight: 600 !important;
      border-radius: 8px !important;
      box-shadow: 0 4px 16px rgba(112, 181, 0, 0.3);
      transition: all 0.3s ease;
    }

    .final-cta-btn-primary:hover {
      background: #5a9600 !important;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(112, 181, 0, 0.4);
    }

    .final-cta-btn-secondary {
      border: 2px solid rgba(255, 255, 255, 0.8) !important;
      color: white !important;
      padding: 1rem 2.5rem !important;
      font-size: 1.125rem !important;
      font-weight: 600 !important;
      border-radius: 8px !important;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    }

    .final-cta-btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1) !important;
      border-color: white !important;
    }

    /* pie de pagina */
    .footer {
      background: #172b4d;
      color: white;
      padding: 3rem 2rem;
      position: relative;
      z-index: 10;
    }

    .footer-content {
      max-width: 1400px;
      margin: 0 auto;
      text-align: center;
    }

    .footer-main {
      margin-bottom: 2rem;
    }

    .footer-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .footer-logo-icon {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #0079bf, #026aa7);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .footer-logo-icon mat-icon {
      color: white;
      font-size: 16px;
    }

    .footer-logo-icon .logo-swo {
      color: white;
      font-size: 0.85rem;
      font-weight: 900;
      letter-spacing: 1px;
      text-align: center;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }

    /* nuevo logo moderno del footer */
    .footer-logo-icon-modern {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
    }

    .footer-gradient-bg {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 100%);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.1);
      transition: all 0.3s ease;
    }

    .footer-gradient-bg:hover {
      background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.1) 100%);
      border-color: rgba(255,255,255,0.2);
    }

    .footer-swo-modern {
      color: white;
      font-size: 0.8rem;
      font-weight: 900;
      letter-spacing: 1px;
      text-align: center;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }

    .footer-logo span {
      font-size: 1.25rem;
      font-weight: 700;
      color: white;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      letter-spacing: -0.5px;
    }

    .footer-description {
      color: rgba(255, 255, 255, 0.8);
      font-size: 1rem;
      line-height: 1.5;
      max-width: 500px;
      margin: 0 auto;
    }

    .footer-divider {
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      margin: 2rem 0 1rem 0;
    }

    .footer-bottom {
      padding-top: 1rem;
    }

    .footer-copyright {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.875rem;
      margin: 0;
      line-height: 1.5;
    }

    /* animaciones */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(50px) rotateX(10deg);
      }
      to {
        opacity: 1;
        transform: translateY(0) rotateX(0);
      }
    }

    /* responsive design */
    @media (max-width: 1024px) {
      .demo-board {
        flex-direction: column;
        gap: 1rem;
      }
      
      .demo-list {
        min-width: auto;
      }
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 2.5rem;
      }
      
      .hero-subtitle {
        font-size: 1.125rem;
      }
      
      .final-cta h2 {
        font-size: 2rem;
      }
      
      .features-header h2 {
        font-size: 2rem;
      }

      .use-cases-header h2 {
        font-size: 2rem;
      }
      
      .nav-content {
        padding: 0 1rem;
      }
      
      .hero-section {
        padding: 80px 1rem 40px;
      }
      
      .features-section,
      .use-cases-section {
        padding: 3rem 1rem;
      }
      
      .final-cta {
        padding: 3rem 1rem;
      }
      
      .footer {
        padding: 2rem 1rem;
      }
    }

    @media (max-width: 480px) {
      .hero-title {
        font-size: 2rem;
      }
      
      .cta-primary,
      .cta-secondary,
      .final-cta-btn-primary,
      .final-cta-btn-secondary {
        width: 100%;
        max-width: 300px;
      }
      
      .demo-board {
        padding: 1rem;
      }
      
      .demo-list {
        min-width: 240px;
      }
    }
  `]
})
export class LandingComponent { 
  userEmail: string = '';

  constructor(private router: Router) {}

  isValidEmail(email: string): boolean {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  quickSignup(): void {
    if (this.isValidEmail(this.userEmail)) {
      // Redirigir al registro con el email pre-llenado
      this.router.navigate(['/register'], { 
        queryParams: { email: this.userEmail } 
      });
    }
  }
}
