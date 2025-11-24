import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';

// Usa la URL configurada en tu entorno
function getApiUrl(): string {
  try {
    if (typeof window !== 'undefined' && (window as any).__env && (window as any).__env.API_URL) {
      return (window as any).__env.API_URL;
    }
  } catch { /* noop */ }
  return 'http://localhost:5000';
}
const SIM_USER_KEY = 'sim_users_current';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && !!(window as any).localStorage;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  register(datosRegistro: { nombre: string; email: string; password: string; }): Observable<any> {
    return this.http.post<any>(`${getApiUrl()}/auth/register`, datosRegistro);
  }

  login(credenciales: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${getApiUrl()}/auth/login`, credenciales).pipe(
      tap(response => {
        const token = response?.access_token || response?.token;
        if (token && isBrowser()) {
          (window as any).localStorage.setItem('access_token', token);
        }
      }),
      catchError(() => {
        // Fallback: simulación local
        const isAdmin = credenciales.email?.toLowerCase().includes('admin');
        const fakeToken = 'sim-token-' + Date.now();
        const user = { email: credenciales.email, nombre: credenciales.email.split('@')[0] || credenciales.email, rol: isAdmin ? 'admin' : 'estudiante', token: fakeToken };
        if (isBrowser()) {
          (window as any).localStorage.setItem('access_token', fakeToken);
          (window as any).localStorage.setItem(SIM_USER_KEY, JSON.stringify(user));
        }
        return of({ access_token: fakeToken, user });
      })
    );
  }

  logout(): void {
    if (isBrowser()) {
      (window as any).localStorage.removeItem('access_token');
      (window as any).localStorage.removeItem(SIM_USER_KEY);
    }
  }

  getToken(): string | null {
    if (!isBrowser()) return null;
    return (window as any).localStorage.getItem('access_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getSimUser(): any | null {
    if (!isBrowser()) return null;
    try { return JSON.parse((window as any).localStorage.getItem(SIM_USER_KEY) || 'null'); } catch { return null; }
  }
}
