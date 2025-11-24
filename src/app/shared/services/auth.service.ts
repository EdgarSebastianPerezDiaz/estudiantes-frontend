import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { BASE_API_URL } from '../../core/config/api.config';

export interface Usuario {
  id?: number | string;
  email: string;
  nombre?: string;
  rol?: string;
  password?: string;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'token';
  private userKey = 'user';

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<{ token: string; user?: Usuario }> {
    return this.http.post<{ token: string; user?: Usuario }>(`${BASE_API_URL}/auth/login`, credentials).pipe(
      tap(res => {
        if (res?.token) localStorage.setItem(this.tokenKey, res.token);
        if (res?.user) localStorage.setItem(this.userKey, JSON.stringify(res.user));
      })
    );
  }

  register(data: Usuario): Observable<{ token: string; user?: Usuario }> {
    return this.http.post<{ token: string; user?: Usuario }>(`${BASE_API_URL}/auth/register`, data).pipe(
      tap(res => {
        if (res?.token) localStorage.setItem(this.tokenKey, res.token);
        if (res?.user) localStorage.setItem(this.userKey, JSON.stringify(res.user));
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  // Verifica si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Devuelve el usuario actual
  getSimUser(): { nombre?: string; rol?: string } | null {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  // Cierra sesión
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }
}