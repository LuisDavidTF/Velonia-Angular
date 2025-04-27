import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth/auth.service';
import { AuthModalService } from 'app/services/auth-modal/auth-modal.service';
import { FlashAlertService } from 'app/services/flash-alert/flash-alert.service'; // <--- importa aquí
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterModule,CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  fullName: string = '';

  errorMessage: string | null = null; // <-- nuevo para mostrar errores locales

  passwordCriteria = {
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false
  };

  @Output() registerSuccess = new EventEmitter<void>();

  constructor(
    private authModal: AuthModalService,
    private authService: AuthService,
    private router: Router,
    private flashAlertService: FlashAlertService // <-- inyectamos servicio
  ) {}

  get isPasswordSecure(): boolean {
    return Object.values(this.passwordCriteria).every(Boolean);
  }

  checkPasswordSecurity(): void {
    const p = this.password || '';
    this.passwordCriteria.length = p.length >= 8;
    this.passwordCriteria.lowercase = /[a-z]/.test(p);
    this.passwordCriteria.uppercase = /[A-Z]/.test(p);
    this.passwordCriteria.number = /\d/.test(p);
    this.passwordCriteria.special = /[!@#$%^&*(),.?":{}|<>]/.test(p);
  }

  onSubmit(): void {
    if (!this.username || !this.email || !this.password || !this.fullName || !this.isPasswordSecure) return;

    const data = {
      username: this.username,
      email: this.email,
      password: this.password,
      full_name: this.fullName
    };

    this.authService.register(data).subscribe({
      next: () => {
        this.registerSuccess.emit();
        this.authModal.openLogin(); // abrir login modal
        this.flashAlertService.showSuccess('¡Registro exitoso! Ahora inicia sesión.');
      },
      error: (err) => {
        console.error('Error al registrarse:', err);
        if (err.status === 409) {
          this.errorMessage = 'El correo ya está registrado.';
        } else {
          this.errorMessage = 'Hubo un problema al registrarse. Intenta de nuevo.';
        }
      }
    });
  }

  redirectToLogin(): void {
    this.authModal.openLogin();
  }
}
