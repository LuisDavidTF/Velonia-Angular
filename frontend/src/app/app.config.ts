import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes'; // Asegúrate de tener las rutas correctamente definidas
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { authInterceptor } from './interceptors/auth.interceptor'; // Asegúrate de que la ruta sea correcta

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), // Configuración de Zone.js
    provideRouter(routes), // Rutas de la aplicación
    provideHttpClient(withInterceptors([authInterceptor])), // Añadiendo el interceptor
    importProvidersFrom(FormsModule), // Importando FormsModule si necesitas formularios
  ]
};