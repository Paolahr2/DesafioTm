import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

/**
 * Configuración principal de la aplicación TaskFlow
 * Define todos los proveedores necesarios para el funcionamiento
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Manejo de errores globales
    provideBrowserGlobalErrorListeners(),
    
    // Detección de cambios optimizada
    provideZoneChangeDetection({ eventCoalescing: true }),
    
    // Router con lazy loading
    provideRouter(routes),
    
    // Cliente HTTP para conectar con el backend
    provideHttpClient(),
    
    // Animaciones de Angular Material
    provideAnimationsAsync(),
    
    // Hidratación SSR con replay de eventos
    provideClientHydration(withEventReplay())
  ]
};
