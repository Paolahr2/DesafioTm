import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import { LoginData, RegisterData, AuthResponse, User } from '../interfaces/user.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Cargar usuario desde localStorage al inicializar (solo en el browser)
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          this.currentUserSubject.next(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('currentUser');
        }
      }
    }
  }

  login(loginData: LoginData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}${environment.endpoints.auth}/login`, loginData)
      .pipe(
        tap((response: AuthResponse) => {
          if (response.token && response.user && isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
          }
        }),
        catchError((error: any) => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }

  register(registerData: any): Observable<AuthResponse> {
    // Transformar fullName a firstName y lastName para el backend
    const nameParts = registerData.fullName ? registerData.fullName.split(' ') : ['', ''];
    const backendData = {
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      username: registerData.username,
      email: registerData.email,
      password: registerData.password
    };

    return this.http.post<AuthResponse>(`${this.apiUrl}${environment.endpoints.auth}/register`, backendData)
      .pipe(
        tap((response: AuthResponse) => {
          if (response.token && response.user && isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
          }
        }),
        catchError((error: any) => {
          console.error('Register error:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }
    const token = localStorage.getItem('token');
    return !!token && !this.isTokenExpired(token);
  }

  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    return localStorage.getItem('token');
  }

  public getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expiry;
    } catch (error) {
      return true; // Si no se puede decodificar, considerar expirado
    }
  }

  // Método para refrescar el token (opcional, para implementar más adelante)
  refreshToken(): Observable<AuthResponse> {
    const token = this.getToken();
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/refresh`, { token })
      .pipe(
        tap(response => {
          if (response.token && isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', response.token);
            if (response.user) {
              localStorage.setItem('currentUser', JSON.stringify(response.user));
              this.currentUserSubject.next(response.user);
            }
          }
        }),
        catchError(error => {
          console.error('Token refresh error:', error);
          this.logout(); // Si no se puede refrescar, cerrar sesión
          return throwError(() => error);
        })
      );
  }
}
