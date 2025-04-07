// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, JsonpInterceptor } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = '/api/auth'; // Se asume que tus rutas están montadas en /api/auth
  private userSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    this.userSubject.next(user);
  }

  get user(): Observable<any> {
    return this.userSubject.asObservable();
  }

  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, credentials).pipe(
      // Después de hacer login, actualizamos el estado del usuario
      tap((res) => {
        if (res && res.user) {
          localStorage.setItem('user', JSON.stringify(res.user)); // Guardar al usuario en localStorage
          localStorage.setItem('idUser',JSON.stringify(res.token))
          this.userSubject.next(res.user); // Actualizamos el estado del usuario
        }
      })
    );
  }

  register(data: { username: string; email: string; password: string; full_name: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem('user'); // Limpiar el localStorage
        this.userSubject.next(null); // Restablecer el estado del usuario
      })
    );
  }
}

