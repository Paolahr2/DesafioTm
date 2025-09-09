// ============================================================================
// AUTH INTERCEPTOR - PARA JWT TOKEN AUTHENTICATION
// ============================================================================

import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Obtener el token del localStorage
    const token = localStorage.getItem('token');
    
    // Si hay token, clonamos la request y añadimos el header de autorización
    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return next.handle(authReq);
    }
    
    // Si no hay token, enviamos la request original
    return next.handle(req);
  }
}
