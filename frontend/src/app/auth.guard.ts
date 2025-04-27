import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth/auth.service';

const rutasPublicas = [ '/category', '/product/'];

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const rutaActual = state.url;
  const estaEnRutaPublica = rutasPublicas.some(r => rutaActual.startsWith(r));

  if (authService.isLoggedIn() || estaEnRutaPublica) {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};

