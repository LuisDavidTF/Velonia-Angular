import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule,RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  fullName: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.username || !this.email || !this.password || !this.fullName) return;

    const data = {
      username: this.username,
      email: this.email,
      password: this.password,
      full_name: this.fullName
    };

    this.authService.register(data).subscribe({
      next: (res) => {
        alert('Usuario registrado correctamente');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        console.error('Error al registrarse:', err);
        if (err.status === 409) {
          alert('El correo ya está registrado');
        } else {
          alert(`Hubo un problema al registrarse: ${err.message || err.statusText}`);
        }
      }
    });
  }
}