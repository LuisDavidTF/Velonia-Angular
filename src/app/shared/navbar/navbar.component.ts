import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [CommonModule,RouterModule] 
})
export class NavbarComponent {
  user: any = null; // Simulación, reemplazar con datos reales

  constructor(private router: Router, private cdr: ChangeDetectorRef) {console.log("Estado inicial de user:", this.user);}

  logout() {
    this.user = null;
    this.cdr.detectChanges(); // Forzar actualización de la vista
    this.router.navigate(['/auth/login']);
  }
  
  redirectToLogin(): void {
    this.router.navigate(['/auth/login']); // Redirige a la ruta '/auth/login'
  }

  redirectToRegister(): void {
    this.router.navigate(['/auth/register']); // Redirige a la ruta '/auth/register'
  }
}
