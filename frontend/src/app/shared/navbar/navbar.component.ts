import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'app/services/auth/auth.service';
import { CartService } from 'app/services/cart/cart.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [CommonModule,RouterModule] 
})
export class NavbarComponent {
  user: any = null;
  constructor(private authService: AuthService,private router: Router, private cdr: ChangeDetectorRef) {console.log("Estado inicial de user:", this.user);}
  ngOnInit(): void {
    // Suscribirse al estado del usuario
    this.authService.user.subscribe(user => {
      this.user = user; // Actualiza el estado local del usuario cuando cambie
    });
  }
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
  redirectToCart(): void {
    this.router.navigate(['/cart']);
  }
}
