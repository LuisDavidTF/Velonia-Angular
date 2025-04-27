import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'app/services/auth/auth.service';
import { AuthModalService } from 'app/services/auth-modal/auth-modal.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [CommonModule,RouterModule] 
})
export class NavbarComponent {
  user: any = null;
  constructor(private authService: AuthService,private router: Router, private cdr: ChangeDetectorRef,private authModal:AuthModalService) {console.log("Estado inicial de user:", this.user);}
  ngOnInit(): void {
    
    this.authService.user.subscribe(user => {
      this.user = user; 
    });
  }
  logout() {
    this.authService.logout().subscribe(() => {
      this.user = null;
      this.cdr.detectChanges();
    });
  }
  redirectToAdd():void{
    this.router.navigate(['/products/add'])
  }
  redirectToLogin(): void {
    this.authModal.openLogin(); 
  }

  redirectToRegister(): void {
    this.authModal.openRegister();
  }
  redirectToCart(): void {
    this.router.navigate(['/cart']);
  }
}
