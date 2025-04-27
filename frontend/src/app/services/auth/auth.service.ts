// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, JsonpInterceptor } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

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
  private baseUrl = '/api/auth';
  private userSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient, private router: Router) {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const token = localStorage.getItem('token');

    if (user && token) {
      this.userSubject.next(user);
    } else {
      this.userSubject.next(null);
    }

  }

  get user(): Observable<any> {
    return this.userSubject.asObservable();
  }
  getCurrentUser() {
    return this.userSubject.value;
  }
  
  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, credentials).pipe(
      tap((res) => {
        if (res && res.user && res.token) {
          localStorage.setItem('user', JSON.stringify(res.user));
          localStorage.setItem('token', res.token); // <- Guarda el token aquí
          this.userSubject.next(res.user);
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
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        this.userSubject.next(null);
        const rutasPublicas = [

          '/category',
          '/product/'
        ];

        const rutaActual = this.router.url;
        const estaEnRutaPublica = rutasPublicas.some(r => rutaActual.startsWith(r));

        if (!estaEnRutaPublica) {
          this.router.navigate(['/']);
        }
      })
    );
  }


  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

}

