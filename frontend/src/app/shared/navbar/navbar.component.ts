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
    
    this.authService.user.subscribe(user => {
      this.user = user; 
    });
  }
  logout() {
    this.user = null;
    
    this.cdr.detectChanges();
    this.router.navigate(['/auth/login']);
  }
  redirectToAdd():void{
    this.router.navigate(['/product/add'])
  }
  redirectToLogin(): void {
    this.router.navigate(['/auth/login']); 
  }

  redirectToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
  redirectToCart(): void {
    this.router.navigate(['/cart']);
  }
}
