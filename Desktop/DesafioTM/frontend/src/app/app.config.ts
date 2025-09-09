import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

/**
 * Configuración principal de la aplicación TaskManager
 * Define todos los proveedores necesarios para el funcionamiento
 * Integrado con Clean Architecture Backend
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Manejo de errores globales
    provideBrowserGlobalErrorListeners(),
    
    // Detección de cambios optimizada
    provideZoneChangeDetection({ eventCoalescing: true }),
    
    // Router con lazy loading
    provideRouter(routes),
    
    // Cliente HTTP con interceptor JWT
    provideHttpClient(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    
    // Animaciones de Angular Material
    provideAnimationsAsync(),
    
    // Hidratación SSR con replay de eventos
    provideClientHydration(withEventReplay())
  ]
};
