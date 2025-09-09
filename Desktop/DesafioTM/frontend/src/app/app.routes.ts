import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

// Guard para proteger rutas autenticadas
const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};

// Guard para redirigir usuarios autenticados
const guestGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    router.navigate(['/dashboard']);
    return false;
  } else {
    return true;
  }
};

export const routes: Routes = [
  // Ruta por defecto - Landing page
  {
    path: '',
    loadComponent: () => import('./pages/landing.component').then(m => m.LandingComponent),
    canActivate: [guestGuard]
  },
  
  // Página de inicio de sesión
  {
    path: 'login',
  loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard]
  },
  
  // Página de registro
  {
    path: 'register',
  loadComponent: () => import('./pages/register.component').then(m => m.RegisterComponent),
    canActivate: [guestGuard]
  },
  
  // Dashboard principal (requiere autenticación)
  {
    path: 'dashboard',
  loadComponent: () => import('./pages/dashboard-integrated.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  
  // Vista detallada del tablero (requiere autenticación)
  {
    path: 'board/:id',
    loadComponent: () => import('./pages/board-detail.component').then(c => c.BoardDetailComponent),
    canActivate: [authGuard]
  },
  
  // Redirigir rutas no encontradas al inicio
  {
    path: '**',
    redirectTo: ''
  }
];
